"""
backend/src/explainability.py
Provides local and global feature attribution:
  1. TreeSHAP for URL Random Forest model.
  2. TreeSHAP for HTML / DOM Random Forest model.
  3. Linear n-gram coefficient attribution for Text Logistic Regression model.
  4. Global feature importance calculation and serialization.

Honesty note: SHAP and linear feature attributions explain the trained models'
internal decision boundaries and sensitivities. They do NOT represent ground truth.
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List, Optional

import joblib
import numpy as np
import shap

from .features_html import extract_html_features, extract_visible_text
from .features_url import extract_url_features

MODELS_DIR = Path("models")
METRICS_DIR = Path("artifacts/metrics")

_loaded_explainers = {}
_loaded_models = {}


def _get_model(name: str):
    if name not in _loaded_models:
        path = MODELS_DIR / f"{name}.joblib"
        if not path.exists():
            return None
        obj = joblib.load(path)
        if isinstance(obj, dict) and "model" in obj and hasattr(obj["model"], "n_jobs"):
            obj["model"].n_jobs = 1  # prevent multiprocessing hangs during single-sample inference
        _loaded_models[name] = obj
    return _loaded_models[name]


def _get_tree_explainer(model_name: str):
    if model_name not in _loaded_explainers:
        meta = _get_model(model_name)
        if meta is None or "model" not in meta:
            return None
        _loaded_explainers[model_name] = shap.TreeExplainer(meta["model"])
    return _loaded_explainers[model_name]


SHAP_HONESTY_NOTICE = (
    "TreeSHAP attributes the model's internal prediction score to input features. "
    "It explains what drove the Random Forest model's decision, not real-world ground truth."
)

TEXT_HONESTY_NOTICE = (
    "Linear feature attribution via TF-IDF value * logistic regression coefficient. "
    "It explains how text tokens shifted the model's log-odds, not semantic ground truth."
)


def explain_url(url: str, url_features: Optional[dict] = None, top_k: int = 8) -> Optional[dict]:
    meta = _get_model("url_model")
    explainer = _get_tree_explainer("url_model")
    if meta is None or explainer is None:
        return None

    feats = url_features if url_features is not None else extract_url_features(url)
    feature_cols = meta["feature_cols"]
    x = np.array([[feats.get(c, 0) for c in feature_cols]], dtype=np.float32)

    sv = explainer(x)
    pos_idx = list(meta["model"].classes_).index(meta["positive_label"])
    if len(sv.values.shape) == 3:
        shap_vals = sv.values[0, :, pos_idx]
    else:
        shap_vals = sv.values[0]

    abs_indices = np.argsort(np.abs(shap_vals))[::-1][:top_k]
    features = []
    for idx in abs_indices:
        col = feature_cols[idx]
        val = feats.get(col, 0)
        s_val = float(shap_vals[idx])
        direction = "phishing" if s_val > 0 else "legitimate"
        features.append({
            "feature": col,
            "value": val,
            "shap_value": round(s_val, 4),
            "magnitude": round(abs(s_val), 4),
            "direction": direction,
        })

    return {
        "modality": "url",
        "method": "TreeSHAP",
        "notice": SHAP_HONESTY_NOTICE,
        "base_value": round(float(sv.base_values[0, pos_idx]) if hasattr(sv, "base_values") and len(np.shape(sv.base_values)) > 1 else float(sv.base_values[0]), 4),
        "top_features": features,
    }


def explain_html(html: str, url: str = "", html_features: Optional[dict] = None, top_k: int = 8) -> Optional[dict]:
    if not html:
        return None
    meta = _get_model("html_model")
    explainer = _get_tree_explainer("html_model")
    if meta is None or explainer is None:
        return None

    feats = html_features if html_features is not None else extract_html_features(html, url)
    feature_cols = meta["feature_cols"]
    x = np.array([[feats.get(c, 0) for c in feature_cols]], dtype=np.float32)

    sv = explainer(x)
    pos_idx = list(meta["model"].classes_).index(meta["positive_label"])
    if len(sv.values.shape) == 3:
        shap_vals = sv.values[0, :, pos_idx]
    else:
        shap_vals = sv.values[0]

    abs_indices = np.argsort(np.abs(shap_vals))[::-1][:top_k]
    features = []
    for idx in abs_indices:
        col = feature_cols[idx]
        val = feats.get(col, 0)
        s_val = float(shap_vals[idx])
        direction = "phishing" if s_val > 0 else "legitimate"
        features.append({
            "feature": col,
            "value": round(val, 4) if isinstance(val, float) else val,
            "shap_value": round(s_val, 4),
            "magnitude": round(abs(s_val), 4),
            "direction": direction,
        })

    return {
        "modality": "html",
        "method": "TreeSHAP",
        "notice": SHAP_HONESTY_NOTICE,
        "base_value": round(float(sv.base_values[0, pos_idx]) if hasattr(sv, "base_values") and len(np.shape(sv.base_values)) > 1 else float(sv.base_values[0]), 4),
        "top_features": features,
    }


def explain_text(html: str, top_k: int = 8) -> Optional[dict]:
    if not html:
        return None
    meta = _get_model("text_model")
    if meta is None or "vectorizer" not in meta or "model" not in meta:
        return None

    vec = meta["vectorizer"]
    clf = meta["model"]
    pos_idx = list(clf.classes_).index(meta["positive_label"])
    coefs = clf.coef_[0] if pos_idx == 1 else -clf.coef_[0]

    visible_text = extract_visible_text(html)
    if not visible_text:
        return None

    X = vec.transform([visible_text])
    feature_names = vec.get_feature_names_out()

    contributions = []
    for idx, tfidf_val in zip(X.indices, X.data):
        w = float(coefs[idx])
        contrib = float(tfidf_val * w)
        direction = "phishing" if contrib > 0 else "legitimate"
        contributions.append({
            "ngram": str(feature_names[idx]),
            "tfidf": round(float(tfidf_val), 4),
            "coefficient": round(w, 4),
            "contribution": round(contrib, 4),
            "magnitude": round(abs(contrib), 4),
            "direction": direction,
        })

    contributions.sort(key=lambda c: c["magnitude"], reverse=True)
    return {
        "modality": "text",
        "method": "linear_coefficient_attribution",
        "notice": TEXT_HONESTY_NOTICE,
        "intercept": round(float(clf.intercept_[0]), 4),
        "top_ngrams": contributions[:top_k],
    }


def compute_all_explanations(
    url: str,
    html: Optional[str] = None,
    url_features: Optional[dict] = None,
    html_features: Optional[dict] = None,
) -> dict:
    explanations = {}
    url_exp = explain_url(url, url_features)
    if url_exp is not None:
        explanations["url"] = url_exp

    if html:
        html_exp = explain_html(html, url, html_features)
        if html_exp is not None:
            explanations["html"] = html_exp

        text_exp = explain_text(html)
        if text_exp is not None:
            explanations["text"] = text_exp

    return explanations


def get_global_feature_importance(metrics_dir: Path = METRICS_DIR) -> dict:
    path = metrics_dir / "global_feature_importance.json"
    if path.exists():
        try:
            with path.open(encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass

    # Compute on the fly
    url_meta = _get_model("url_model")
    url_importances = []
    if url_meta and "model" in url_meta:
        for col, imp in zip(url_meta["feature_cols"], url_meta["model"].feature_importances_):
            url_importances.append({"feature": col, "importance": round(float(imp), 4)})
        url_importances.sort(key=lambda x: x["importance"], reverse=True)

    html_meta = _get_model("html_model")
    html_importances = []
    if html_meta and "model" in html_meta:
        for col, imp in zip(html_meta["feature_cols"], html_meta["model"].feature_importances_):
            html_importances.append({"feature": col, "importance": round(float(imp), 4)})
        html_importances.sort(key=lambda x: x["importance"], reverse=True)

    payload = {
        "url": url_importances,
        "html": html_importances,
        "method": "mean_decrease_in_impurity",
        "description": "Global Gini feature importance across the 300 decision trees of each Random Forest model.",
        "notice": "Gini importance measures how frequently a feature split reduced impurity during training. It explains the model's structural reliance on features, not causal ground truth."
    }

    metrics_dir.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)

    return payload


if __name__ == "__main__":
    g = get_global_feature_importance()
    print("Global feature importance generated.")
    print("URL top 3:", g["url"][:3])
    print("HTML top 3:", g["html"][:3])

