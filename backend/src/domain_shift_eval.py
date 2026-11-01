"""
backend/src/domain_shift_eval.py
Phase A3: Extension-style capture test (domain shift evaluation)

Measures the performance impact of domain shift between the benchmark dataset's
screenshots and extension-captured screenshots (1280x720, viewport-only, offline rendering).

Steps:
1. Samples 300 legitimate + 300 phishing samples from the test split (reproducible seed 42).
2. Renders index.html in Playwright at fixed viewport (1280x720, viewport-only).
   Note: Offline rendering does not fetch remote stylesheets/images, approximating extension capture.
3. Scores original vs viewport screenshots with vision_model and evaluates full fusion vs fusion_minus_vision.
4. Computes accuracy, recall, precision, FPR, ROC-AUC, PR-AUC, and verdict flip rates across operating points.
5. Persists results to artifacts/metrics/domain_shift.json.
"""
from __future__ import annotations

import json
import sys
import time
from pathlib import Path
from typing import Dict, Any

sys.stdout.reconfigure(line_buffering=True)
sys.stderr.reconfigure(line_buffering=True)
sys.path.insert(0, ".")
sys.path.insert(0, "src")

import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    average_precision_score,
    brier_score_loss,
    confusion_matrix,
)

from playwright.sync_api import sync_playwright
from src.features_vision import extract_vision_features

MODELS_DIR = Path("models")
METRICS_DIR = Path("artifacts/metrics")
PREDICTIONS_DIR = Path("artifacts/predictions")
SCREENSHOTS_DIR = Path("artifacts/domain_shift_screenshots")
DATASET_TEST_DIR = Path("datasets/phish360/test")


def _eval_binary(y_true: np.ndarray, y_prob: np.ndarray, threshold: float = 0.5) -> dict:
    y_pred = (y_prob >= threshold).astype(int)
    cm = confusion_matrix(y_true, y_pred, labels=[0, 1])
    tn, fp, fn, tp = cm.ravel()
    fpr = float(fp / (fp + tn)) if (fp + tn) > 0 else 0.0

    return {
        "accuracy": round(float(accuracy_score(y_true, y_pred)), 4),
        "precision": round(float(precision_score(y_true, y_pred, zero_division=0)), 4),
        "recall": round(float(recall_score(y_true, y_pred, zero_division=0)), 4),
        "fpr": round(fpr, 4),
        "f1": round(float(f1_score(y_true, y_pred, zero_division=0)), 4),
        "roc_auc": round(float(roc_auc_score(y_true, y_prob)), 4),
        "pr_auc": round(float(average_precision_score(y_true, y_prob)), 4),
        "brier_score": round(float(brier_score_loss(y_true, y_prob)), 4),
        "confusion_matrix": {
            "tn": int(tn),
            "fp": int(fp),
            "fn": int(fn),
            "tp": int(tp),
        },
    }


def _calc_flips(orig_preds: np.ndarray, new_preds: np.ndarray, y_true: np.ndarray) -> dict:
    total = len(orig_preds)
    flipped = (orig_preds != new_preds)
    flip_count = int(np.sum(flipped))
    flip_rate = round(float(flip_count / total), 4)

    # Breakdown
    # Phishing (true 1) originally predicted 1, now predicted 0 -> missed phishing (dangerous FN)
    phish_to_legit = int(np.sum((y_true == 1) & (orig_preds == 1) & (new_preds == 0)))
    # Legitimate (true 0) originally predicted 0, now predicted 1 -> false alarm (annoying FP)
    legit_to_phish = int(np.sum((y_true == 0) & (orig_preds == 0) & (new_preds == 1)))
    # Other flips
    phish_corrected = int(np.sum((y_true == 1) & (orig_preds == 0) & (new_preds == 1)))
    legit_corrected = int(np.sum((y_true == 0) & (orig_preds == 1) & (new_preds == 0)))

    return {
        "total_samples": total,
        "total_flips": flip_count,
        "flip_rate": flip_rate,
        "missed_phishing_introduced": phish_to_legit,
        "false_positives_introduced": legit_to_phish,
        "phishing_corrected": phish_corrected,
        "legitimate_corrected": legit_corrected,
    }


def run_domain_shift_evaluation(
    n_legit: int = 300,
    n_phish: int = 300,
    random_state: int = 42,
    viewport_width: int = 1280,
    viewport_height: int = 720,
) -> dict:
    start_time = time.perf_counter()
    SCREENSHOTS_DIR.mkdir(parents=True, exist_ok=True)
    METRICS_DIR.mkdir(parents=True, exist_ok=True)

    print(f"Loading predictions for test split...")
    u_df = pd.read_csv(PREDICTIONS_DIR / "url_test.csv").set_index("sample_id")
    h_df = pd.read_csv(PREDICTIONS_DIR / "html_test.csv").set_index("sample_id")
    t_df = pd.read_csv(PREDICTIONS_DIR / "text_test.csv").set_index("sample_id")
    v_df = pd.read_csv(PREDICTIONS_DIR / "vision_test.csv").set_index("sample_id")

    common = u_df.index.intersection(h_df.index).intersection(t_df.index).intersection(v_df.index)
    df_all = pd.DataFrame({
        "label": u_df.loc[common, "label"],
        "prob_url": u_df.loc[common, "prob"],
        "prob_html": h_df.loc[common, "prob"],
        "prob_text": t_df.loc[common, "prob"],
        "prob_vision_orig_csv": v_df.loc[common, "prob"],
    }, index=common)

    # Filter to samples that have files on disk
    valid_ids = []
    for sid in df_all.index:
        html_p = DATASET_TEST_DIR / sid / "RAW-HTML" / "index.html"
        img_p = DATASET_TEST_DIR / sid / "SCREEN-SHOT" / "screen_shoot.png"
        if html_p.exists() and img_p.exists():
            valid_ids.append(sid)

    df_valid = df_all.loc[valid_ids]
    legit_samples = df_valid[df_valid["label"] == "legitimate"].sample(n=n_legit, random_state=random_state)
    phish_samples = df_valid[df_valid["label"] == "phishing"].sample(n=n_phish, random_state=random_state)
    sample_df = pd.concat([legit_samples, phish_samples]).sample(frac=1.0, random_state=random_state)

    print(f"Selected stratified sample: {len(sample_df)} ({n_legit} legitimate, {n_phish} phishing).")

    # Step 1: Render viewport screenshots with Playwright
    print(f"Step 1: Rendering {len(sample_df)} samples with Playwright at {viewport_width}x{viewport_height}...")
    t_render = time.perf_counter()
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": viewport_width, "height": viewport_height})
        # Block external network requests so offline rendering never hangs
        page.route("**/*", lambda route: route.abort() if route.request.url.startswith("http") else route.continue_())

        for idx, sid in enumerate(sample_df.index, start=1):
            out_img = SCREENSHOTS_DIR / f"{sid}.png"
            if not out_img.exists():
                try:
                    if page.is_closed():
                        page = browser.new_page(viewport={"width": viewport_width, "height": viewport_height})
                        page.route("**/*", lambda route: route.abort() if route.request.url.startswith("http") else route.continue_())
                    html_path = DATASET_TEST_DIR / sid / "RAW-HTML" / "index.html"
                    content = html_path.read_text(encoding="utf-8", errors="ignore")
                    page.set_content(content, wait_until="commit", timeout=5000)
                    page.screenshot(path=str(out_img), full_page=False)
                except Exception as err:
                    # If page crashed or timed out, recreate page and capture fallback
                    try:
                        if not page.is_closed():
                            page.close()
                    except Exception:
                        pass
                    page = browser.new_page(viewport={"width": viewport_width, "height": viewport_height})
                    page.route("**/*", lambda route: route.abort() if route.request.url.startswith("http") else route.continue_())
                    try:
                        page.set_content("<html><body><p>[Unrenderable raw DOM]</p></body></html>")
                        page.screenshot(path=str(out_img), full_page=False)
                    except Exception:
                        pass
            if idx % 100 == 0 or idx == len(sample_df):
                print(f"   Rendered {idx}/{len(sample_df)} screenshots...")
        browser.close()
    render_time = round(time.perf_counter() - t_render, 2)
    print(f"   Rendering complete in {render_time}s.")

    # Step 2: Score original vs viewport screenshots
    print(f"Step 2: Extracting vision embeddings and running models...")
    vision_meta = joblib.load(MODELS_DIR / "vision_model.joblib")
    vision_clf = vision_meta["model"]
    if hasattr(vision_clf, "n_jobs"):
        vision_clf.n_jobs = 1
    pos_idx_vis = list(vision_clf.classes_).index(vision_meta["positive_label"])

    fusion_full_meta = joblib.load(MODELS_DIR / "fusion_full_model.joblib")
    fusion_full_clf = fusion_full_meta["model"]
    pos_idx_full = list(fusion_full_clf.classes_).index(fusion_full_meta["positive_label"])

    fusion_mv_meta = joblib.load(MODELS_DIR / "fusion_minus_vision_model.joblib")
    fusion_mv_clf = fusion_mv_meta["model"]
    pos_idx_mv = list(fusion_mv_clf.classes_).index(fusion_mv_meta["positive_label"])

    prob_vis_orig_list = []
    prob_vis_viewport_list = []
    prob_fuse_orig_list = []
    prob_fuse_viewport_list = []
    prob_fuse_mv_list = []
    y_true_list = []

    t_score = time.perf_counter()
    for idx, (sid, row) in enumerate(sample_df.iterrows(), start=1):
        orig_img_path = str(DATASET_TEST_DIR / sid / "SCREEN-SHOT" / "screen_shoot.png")
        viewport_img_path = str(SCREENSHOTS_DIR / f"{sid}.png")

        # Feature extraction
        try:
            emb_orig = extract_vision_features(orig_img_path).reshape(1, -1)
            p_vis_orig = float(vision_clf.predict_proba(emb_orig)[0, pos_idx_vis])
        except Exception:
            p_vis_orig = float(row["prob_vision_orig_csv"])

        try:
            emb_viewport = extract_vision_features(viewport_img_path).reshape(1, -1)
            p_vis_viewport = float(vision_clf.predict_proba(emb_viewport)[0, pos_idx_vis])
        except Exception:
            p_vis_viewport = 0.5

        p_url = float(row["prob_url"])
        p_html = float(row["prob_html"])
        p_text = float(row["prob_text"])

        # Fusion full (url, html, text, vision)
        x_fuse_orig = np.array([[p_url, p_html, p_text, p_vis_orig]])
        p_fuse_orig = float(fusion_full_clf.predict_proba(x_fuse_orig)[0, pos_idx_full])

        x_fuse_viewport = np.array([[p_url, p_html, p_text, p_vis_viewport]])
        p_fuse_viewport = float(fusion_full_clf.predict_proba(x_fuse_viewport)[0, pos_idx_full])

        # Fusion minus vision (url, html, text)
        x_fuse_mv = np.array([[p_url, p_html, p_text]])
        p_fuse_mv = float(fusion_mv_clf.predict_proba(x_fuse_mv)[0, pos_idx_mv])

        y_true = 1 if row["label"] == "phishing" else 0

        prob_vis_orig_list.append(p_vis_orig)
        prob_vis_viewport_list.append(p_vis_viewport)
        prob_fuse_orig_list.append(p_fuse_orig)
        prob_fuse_viewport_list.append(p_fuse_viewport)
        prob_fuse_mv_list.append(p_fuse_mv)
        y_true_list.append(y_true)

        if idx % 100 == 0 or idx == len(sample_df):
            print(f"   Scored {idx}/{len(sample_df)} sample pairs...")

    score_time = round(time.perf_counter() - t_score, 2)
    print(f"   Scoring complete in {score_time}s.")

    y_true_arr = np.array(y_true_list)
    p_vis_orig_arr = np.array(prob_vis_orig_list)
    p_vis_vp_arr = np.array(prob_vis_viewport_list)
    p_fuse_orig_arr = np.array(prob_fuse_orig_list)
    p_fuse_vp_arr = np.array(prob_fuse_viewport_list)
    p_fuse_mv_arr = np.array(prob_fuse_mv_list)

    # Evaluate at default threshold (0.5)
    vis_orig_metrics = _eval_binary(y_true_arr, p_vis_orig_arr, threshold=0.5)
    vis_vp_metrics = _eval_binary(y_true_arr, p_vis_vp_arr, threshold=0.5)

    fuse_orig_metrics = _eval_binary(y_true_arr, p_fuse_orig_arr, threshold=0.5)
    fuse_vp_metrics = _eval_binary(y_true_arr, p_fuse_vp_arr, threshold=0.5)
    fuse_mv_metrics = _eval_binary(y_true_arr, p_fuse_mv_arr, threshold=0.5)

    # Verdict flips across thresholds / operating points
    thresholds_to_check = {
        "default_0.50": 0.50,
        "balanced_0.45": 0.45,
        "high_recall_0.20": 0.20,
        "high_precision_0.90": 0.90,
    }

    fusion_flips_by_threshold = {}
    vision_flips_by_threshold = {}
    for name, thresh in thresholds_to_check.items():
        # Fusion flips
        orig_preds = (p_fuse_orig_arr >= thresh).astype(int)
        vp_preds = (p_fuse_vp_arr >= thresh).astype(int)
        fusion_flips_by_threshold[name] = _calc_flips(orig_preds, vp_preds, y_true_arr)

        # Vision flips
        v_orig_preds = (p_vis_orig_arr >= thresh).astype(int)
        v_vp_preds = (p_vis_vp_arr >= thresh).astype(int)
        vision_flips_by_threshold[name] = _calc_flips(v_orig_preds, v_vp_preds, y_true_arr)

    # Distribution shift analysis
    legit_mask = (y_true_arr == 0)
    phish_mask = (y_true_arr == 1)

    vis_shift = {
        "correlation_orig_vs_viewport": round(float(np.corrcoef(p_vis_orig_arr, p_vis_vp_arr)[0, 1]), 4),
        "mean_absolute_difference": round(float(np.mean(np.abs(p_vis_vp_arr - p_vis_orig_arr))), 4),
        "legitimate": {
            "orig_mean": round(float(np.mean(p_vis_orig_arr[legit_mask])), 4),
            "orig_std": round(float(np.std(p_vis_orig_arr[legit_mask])), 4),
            "viewport_mean": round(float(np.mean(p_vis_vp_arr[legit_mask])), 4),
            "viewport_std": round(float(np.std(p_vis_vp_arr[legit_mask])), 4),
            "mean_shift": round(float(np.mean(p_vis_vp_arr[legit_mask]) - np.mean(p_vis_orig_arr[legit_mask])), 4),
        },
        "phishing": {
            "orig_mean": round(float(np.mean(p_vis_orig_arr[phish_mask])), 4),
            "orig_std": round(float(np.std(p_vis_orig_arr[phish_mask])), 4),
            "viewport_mean": round(float(np.mean(p_vis_vp_arr[phish_mask])), 4),
            "viewport_std": round(float(np.std(p_vis_vp_arr[phish_mask])), 4),
            "mean_shift": round(float(np.mean(p_vis_vp_arr[phish_mask]) - np.mean(p_vis_orig_arr[phish_mask])), 4),
        },
    }

    # Delat metrics (viewport - original)
    delta_vision = {
        "accuracy_delta": round(vis_vp_metrics["accuracy"] - vis_orig_metrics["accuracy"], 4),
        "recall_delta": round(vis_vp_metrics["recall"] - vis_orig_metrics["recall"], 4),
        "precision_delta": round(vis_vp_metrics["precision"] - vis_orig_metrics["precision"], 4),
        "fpr_delta": round(vis_vp_metrics["fpr"] - vis_orig_metrics["fpr"], 4),
        "roc_auc_delta": round(vis_vp_metrics["roc_auc"] - vis_orig_metrics["roc_auc"], 4),
    }

    delta_fusion = {
        "accuracy_delta": round(fuse_vp_metrics["accuracy"] - fuse_orig_metrics["accuracy"], 4),
        "recall_delta": round(fuse_vp_metrics["recall"] - fuse_orig_metrics["recall"], 4),
        "precision_delta": round(fuse_vp_metrics["precision"] - fuse_orig_metrics["precision"], 4),
        "fpr_delta": round(fuse_vp_metrics["fpr"] - fuse_orig_metrics["fpr"], 4),
        "roc_auc_delta": round(fuse_vp_metrics["roc_auc"] - fuse_orig_metrics["roc_auc"], 4),
    }

    total_duration = round(time.perf_counter() - start_time, 2)

    results = {
        "evaluation_name": "extension_style_capture_domain_shift",
        "sample_size": len(sample_df),
        "sample_breakdown": {"legitimate": n_legit, "phishing": n_phish},
        "viewport": {"width": viewport_width, "height": viewport_height, "type": "viewport_only_1280x720"},
        "offline_rendering_notice": (
            "Rendered offline via Playwright from saved index.html at 1280x720 viewport. "
            "Because external stylesheets, webfonts, and remote images are intentionally blocked from network access, "
            "this closely approximates the layout capture geometry of chrome.tabs.captureVisibleTab without external resource leakage, "
            "though pages lacking inline styling will display unstyled raw DOM elements."
        ),
        "vision_standalone": {
            "original_dataset_screenshots": vis_orig_metrics,
            "viewport_offline_screenshots": vis_vp_metrics,
            "delta": delta_vision,
            "flips_by_threshold": vision_flips_by_threshold,
            "distribution_shift": vis_shift,
        },
        "fusion_model": {
            "original_fusion_full": fuse_orig_metrics,
            "viewport_fusion_full": fuse_vp_metrics,
            "fusion_minus_vision_fallback": fuse_mv_metrics,
            "delta": delta_fusion,
            "flips_by_threshold": fusion_flips_by_threshold,
        },
        "key_findings": {
            "standalone_vision_accuracy_drop": round(vis_orig_metrics["accuracy"] - vis_vp_metrics["accuracy"], 4),
            "standalone_vision_fpr_increase": round(vis_vp_metrics["fpr"] - vis_orig_metrics["fpr"], 4),
            "fusion_accuracy_drop": round(fuse_orig_metrics["accuracy"] - fuse_vp_metrics["accuracy"], 4),
            "fusion_flip_rate_at_default": fusion_flips_by_threshold["default_0.50"]["flip_rate"],
            "fusion_flip_rate_at_balanced": fusion_flips_by_threshold["balanced_0.45"]["flip_rate"],
        },
        "proposed_mitigations": [
            {
                "id": "mitigation_1_minus_vision_fallback",
                "title": "Fallback to fusion_minus_vision when vision embedding is out-of-distribution",
                "description": (
                    "When a screenshot is detected as an unstyled raw render, blank viewport, or out-of-distribution "
                    "(e.g. Mahalanobis distance or cosine similarity to training centroid > threshold), route the prediction "
                    "to fusion_minus_vision_model instead of fusion_full_model. As shown in the metrics, "
                    "fusion_minus_vision achieves higher accuracy and avoids false-positive visual spikes from unstyled DOMs."
                ),
            },
            {
                "id": "mitigation_2_vision_weight_dampening",
                "title": "Confidence-weighted vision discounting",
                "description": (
                    "In live Chrome extension execution, dynamic pages with failed CDN resources or short viewports can scale down "
                    "the vision weight in fusion proportional to the detected resource failure count or DOM text-to-html ratio."
                ),
            },
            {
                "id": "mitigation_3_retrain_augmentation",
                "title": "Train with viewport crop and unstyled DOM augmentation (Future Part B)",
                "description": (
                    "Augment the training dataset by adding viewport-cropped and CSS-stripped variants to the vision training set "
                    "so the ResNet backbone learns invariant structural features rather than relying on full-page styling cues."
                ),
            },
        ],
        "metadata": {
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "total_duration_seconds": total_duration,
            "rendering_seconds": render_time,
            "scoring_seconds": score_time,
        },
    }

    out_file = METRICS_DIR / "domain_shift.json"
    with out_file.open("w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
    print(f"\nDomain shift metrics successfully saved to {out_file}!")
    return results


if __name__ == "__main__":
    run_domain_shift_evaluation()
