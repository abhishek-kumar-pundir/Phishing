"""
api/app.py
Inference API for the Phish360 multimodal phishing detector.

Run (from the project root, i.e. the folder that contains 'api/' and 'src/'):
    uvicorn api.app:app --reload --port 8000

This file is a superset of the original: every original endpoint and
behavior (SSRF-guarded optional fetch, /predict, /predict/stream, /health,
/scans, /scans/stats, /model-info, /error-analysis) is unchanged in shape.

WHAT CHANGED IN THIS REVISION (all additive, nothing removed):
  - /predict and /predict/stream now persist the FULL evidence for a scan
    (url/html features, fetch info, text/html previews, vision embedding
    info, and the uploaded screenshot itself saved to disk) into the scans
    table via api/db.py, and return the new row's id as "scan_id". This is
    what lets the frontend route to /scan/:scanId or /history/:scanId and
    reconstruct a complete result later -- not just the four bare scores
    the original schema stored.
  - New GET /scans/{scan_id}: the complete historical scan record (evidence
    included), same shape the frontend already knows how to render from a
    live /predict/stream run.
  - New GET /scans/{scan_id}/screenshot: serves the persisted screenshot
    file for that scan, if one was uploaded.
  - Uploaded screenshots are now saved under artifacts/scan_screenshots/
    instead of being deleted after scoring.

NOTE ON DEPENDENCIES: this file additionally uses BeautifulSoup (already a
project dependency, bs4) for page-title extraction, and pandas + sklearn
(already project dependencies) via api/fusion_eval.py.

NOTE ON SKLEARN: if you see `AttributeError: 'LogisticRegression' object
has no attribute 'multi_class'` on startup/first request, your installed
scikit-learn version doesn't match whatever trained models/*.joblib --
`pip install scikit-learn==<version used at training time>` and re-pin it
in requirements.txt.
"""
from __future__ import annotations

import json
import time
import uuid
from pathlib import Path
from typing import Optional

import joblib
import numpy as np
from bs4 import BeautifulSoup
from fastapi import FastAPI, Form, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse

import sys
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))  # so `src` resolves when run via uvicorn

from src.features_url import extract_url_features
from src.features_html import extract_html_features, extract_visible_text
from src.features_vision import extract_vision_features, vision_embedding_dim, HAVE_TORCH
from api.safe_fetch import safe_fetch_html, UnsafeUrlError
from api.db import init_db, log_scan, recent_scans, stats, get_scan
from api.fusion_eval import ALL_MODALITIES, standalone_pr_auc, fusion_pr_auc, compute_fused_predictions

MODELS_DIR = Path("models")
METRICS_DIR = Path("artifacts/metrics")
SCREENSHOTS_DIR = Path("artifacts/scan_screenshots")
SCREENSHOTS_DIR.mkdir(parents=True, exist_ok=True)

THRESHOLD = 0.5  # fixed decision threshold used everywhere below -- surfaced to the frontend, not hidden

app = FastAPI(title="Phish360 Multimodal Phishing Detector")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_origin_regex=r".*", # Allow all origins (Vercel, Chrome Ext, etc) securely
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

_loaded = {}


def _load(name: str):
    if name not in _loaded:
        path = MODELS_DIR / f"{name}.joblib"
        if not path.exists():
            return None
        _loaded[name] = joblib.load(path)
    return _loaded[name]


def _extract_title(html: str) -> str:
    try:
        soup = BeautifulSoup(html, "lxml")
    except Exception:
        soup = BeautifulSoup(html, "html.parser")
    return soup.title.get_text(strip=True) if soup.title else ""


def _save_screenshot(data: bytes, request_id: str) -> str:
    """Persist an uploaded screenshot next to the scan's DB row so it can
    be re-displayed later from /history/:scanId. Returns the file path."""
    path = SCREENSHOTS_DIR / f"{request_id}.png"
    path.write_bytes(data)
    return str(path)


def _score_url(url: str) -> Optional[float]:
    model = _load("url_model")
    if model is None:
        return None
    feats = extract_url_features(url)
    x = np.array([[feats[c] for c in model["feature_cols"]]], dtype=np.float32)
    pos_idx = list(model["model"].classes_).index(model["positive_label"])
    return float(model["model"].predict_proba(x)[0, pos_idx])


def _score_html(html: str, url: str) -> Optional[float]:
    model = _load("html_model")
    if model is None:
        return None
    feats = extract_html_features(html, url)
    x = np.array([[feats[c] for c in model["feature_cols"]]], dtype=np.float32)
    pos_idx = list(model["model"].classes_).index(model["positive_label"])
    return float(model["model"].predict_proba(x)[0, pos_idx])


def _score_text(html: str) -> Optional[float]:
    model = _load("text_model")
    if model is None:
        return None
    text = extract_visible_text(html)
    x = model["vectorizer"].transform([text])
    pos_idx = list(model["model"].classes_).index(model["positive_label"])
    return float(model["model"].predict_proba(x)[0, pos_idx])


def _score_vision(screenshot_path: str) -> Optional[float]:
    model = _load("vision_model")
    if model is None:
        return None
    emb = extract_vision_features(screenshot_path).reshape(1, -1)
    pos_idx = list(model["model"].classes_).index(model["positive_label"])
    return float(model["model"].predict_proba(emb)[0, pos_idx])


def _fuse(scores: dict) -> tuple[Optional[float], str]:
    present = {k for k, v in scores.items() if v is not None}
    all_four = {"url", "html", "text", "vision"}

    if present == all_four:
        fusion = _load("fusion_full_model")
        tag = "full"
    elif present == (all_four - {"vision"}):
        fusion = _load("fusion_minus_vision_model")
        tag = "minus_vision"
    else:
        fusion = None
        tag = "none"

    if fusion is not None:
        x = np.array([[scores[m] for m in fusion["modalities"]]])
        pos_idx = list(fusion["model"].classes_).index(fusion["positive_label"])
        return float(fusion["model"].predict_proba(x)[0, pos_idx]), tag

    if present:
        return float(np.mean([scores[m] for m in present])), "simple_average_fallback"
    return None, "no_modalities_available"


@app.post("/predict")
async def predict(
    url: str = Form(...),
    html: Optional[str] = Form(None),
    allow_fetch: bool = Form(False),
    screenshot: Optional[UploadFile] = File(None),
):
    request_id = str(uuid.uuid4())
    start_time = time.perf_counter()

    fetched_from = None
    status_code = None
    page_title = None
    fetch_duration_ms = None
    if html is None and allow_fetch:
        try:
            fetch_start = time.perf_counter()
            result = safe_fetch_html(url)
            html = result.html
            fetched_from = result.final_url
            status_code = result.status_code
            page_title = _extract_title(html)
            fetch_duration_ms = round((time.perf_counter() - fetch_start) * 1000, 1)
        except UnsafeUrlError as e:
            raise HTTPException(status_code=400, detail=f"Refused to fetch URL: {e}")
        except Exception as e:  # noqa: BLE001
            raise HTTPException(status_code=502, detail=f"Fetch failed: {e}")

    scores = {
        "url": _score_url(url),
        "html": _score_html(html, url) if html else None,
        "text": _score_text(html) if html else None,
        "vision": None,
    }

    screenshot_path = None
    if screenshot is not None:
        data = await screenshot.read()
        screenshot_path = _save_screenshot(data, request_id)
        scores["vision"] = _score_vision(screenshot_path)

    fused_prob, fusion_tag = _fuse(scores)
    if fused_prob is None:
        raise HTTPException(status_code=503, detail="No trained models available on the server.")

    predicted_label = "phishing" if fused_prob >= THRESHOLD else "legitimate"
    duration_ms = round((time.perf_counter() - start_time) * 1000, 1)

    url_features = extract_url_features(url)
    html_features = extract_html_features(html, url) if html else None
    visible_text = extract_visible_text(html) if html else None

    scan_id = log_scan(
        url=url, scores=scores, fused_probability=fused_prob,
        predicted_label=predicted_label, fusion_strategy=fusion_tag, fetched_from=fetched_from,
        request_id=request_id, threshold=THRESHOLD, scan_duration_ms=duration_ms,
        url_features=url_features, html_features=html_features,
        html_preview=html[:5000] if html else None, html_length=len(html) if html else None,
        status_code=status_code, page_title=page_title, fetch_duration_ms=fetch_duration_ms,
        text_preview=visible_text[:3000] if visible_text else None,
        text_length=len(visible_text) if visible_text else None,
        word_count=len(visible_text.split()) if visible_text else None,
        vision_embedding_dim=vision_embedding_dim() if screenshot_path else None,
        vision_backbone=("resnet18" if HAVE_TORCH else "fallback_histogram") if screenshot_path else None,
        screenshot_path=screenshot_path,
    )

    return {
        "request_id": request_id,
        "scan_id": scan_id,
        "url": url,
        "fetched_from": fetched_from,
        "phishing_probability": round(fused_prob, 4),
        "predicted_label": predicted_label,
        "threshold": THRESHOLD,
        "fusion_strategy": fusion_tag,
        "scan_duration_ms": duration_ms,
        "per_modality_scores": {k: (round(v, 4) if v is not None else None) for k, v in scores.items()},
        "evidence": {
            "url_features": url_features,
            "html_features": html_features,
        },
    }


@app.get("/health")
async def health():
    available = [name for name in ["url_model", "html_model", "text_model", "vision_model",
                                    "fusion_full_model", "fusion_minus_vision_model"]
                 if (MODELS_DIR / f"{name}.joblib").exists()]
    return {"status": "ok", "models_available": available}


def _sse(payload: dict) -> str:
    return f"data: {json.dumps(payload)}\n\n"


@app.post("/predict/stream")
async def predict_stream(
    url: str = Form(...),
    html: Optional[str] = Form(None),
    allow_fetch: bool = Form(False),
    screenshot: Optional[UploadFile] = File(None),
):
    """Same inputs and same underlying models as /predict, but emits one
    SSE event per modality AS IT FINISHES, then a final 'fusion' event.
    The delay between events is the model's real inference time -- nothing
    here is artificially staggered for effect."""

    request_id = str(uuid.uuid4())
    start_time = time.perf_counter()
    screenshot_bytes = await screenshot.read() if screenshot is not None else None

    async def event_generator():
        fetched_from = None
        nonlocal_html = html
        status_code = None
        page_title = None
        fetch_duration_ms = None
        html_preview = None
        html_length = None
        text_preview = None
        text_length = None
        word_count = None
        vis_embedding_dim = None
        vis_backbone = None
        screenshot_path = None
        skip_reasons: dict[str, str] = {}
        html_features = None

        # --- STEP 1: URL analysis (always available -- needs nothing but the string itself) ---
        url_features = extract_url_features(url)
        scores: dict[str, Optional[float]] = {}
        scores["url"] = _score_url(url)
        yield _sse({"stage": "url", "score": scores["url"], "url_features": url_features})

        # --- STEP 2: fetch the page (only if the caller asked us to and didn't supply html) ---
        if nonlocal_html is None and allow_fetch:
            fetch_start = time.perf_counter()
            try:
                result = safe_fetch_html(url)
                nonlocal_html = result.html
                fetched_from = result.final_url
                status_code = result.status_code
                page_title = _extract_title(nonlocal_html)
                html_length = len(nonlocal_html)
                html_preview = nonlocal_html[:5000]
                fetch_duration_ms = round((time.perf_counter() - fetch_start) * 1000, 1)
                yield _sse({
                    "stage": "fetch",
                    "final_url": fetched_from,
                    "status_code": status_code,
                    "page_title": page_title,
                    "html_length": html_length,
                    "html_preview": html_preview,
                    "fetch_duration_ms": fetch_duration_ms,
                })
            except UnsafeUrlError as e:
                yield _sse({"stage": "error", "message": f"Refused to fetch URL: {e}"})
                return
            except Exception as e:  # noqa: BLE001
                yield _sse({"stage": "error", "message": f"Fetch failed: {e}"})
                return
        elif nonlocal_html is not None:
            html_preview = nonlocal_html[:5000]
            html_length = len(nonlocal_html)

        # --- STEP 3 & 4: HTML/DOM analysis, then text analysis ---
        if nonlocal_html:
            html_features = extract_html_features(nonlocal_html, url)
            scores["html"] = _score_html(nonlocal_html, url)
            yield _sse({"stage": "html", "score": scores["html"], "html_features": html_features})

            visible_text = extract_visible_text(nonlocal_html)
            scores["text"] = _score_text(nonlocal_html)
            word_count = len(visible_text.split())
            text_length = len(visible_text)
            text_preview = visible_text[:3000]
            yield _sse({
                "stage": "text",
                "score": scores["text"],
                "text_length": text_length,
                "word_count": word_count,
                "text_preview": text_preview,
            })
        else:
            scores["html"] = None
            scores["text"] = None
            skip_reasons["html"] = "no html provided"
            skip_reasons["text"] = "no html provided"
            yield _sse({"stage": "html", "score": None, "skipped": "no html provided"})
            yield _sse({"stage": "text", "score": None, "skipped": "no html provided"})

        # --- STEP 5: vision (only if a screenshot was uploaded) ---
        if screenshot_bytes:
            screenshot_path = _save_screenshot(screenshot_bytes, request_id)
            scores["vision"] = _score_vision(screenshot_path)
            vis_embedding_dim = vision_embedding_dim()
            vis_backbone = "resnet18" if HAVE_TORCH else "fallback_histogram"
            yield _sse({
                "stage": "vision",
                "score": scores["vision"],
                "embedding_dim": vis_embedding_dim,
                "backbone": vis_backbone,
            })
        else:
            scores["vision"] = None
            skip_reasons["vision"] = "no screenshot provided"
            yield _sse({"stage": "vision", "score": None, "skipped": "no screenshot provided"})

        # --- STEP 6: fusion ---
        fused_prob, fusion_tag = _fuse(scores)
        predicted_label = (
            ("phishing" if (fused_prob or 0) >= THRESHOLD else "legitimate") if fused_prob is not None else None
        )
        duration_ms = round((time.perf_counter() - start_time) * 1000, 1)

        scan_id = log_scan(
            url=url, scores=scores, fused_probability=fused_prob,
            predicted_label=predicted_label, fusion_strategy=fusion_tag, fetched_from=fetched_from,
            request_id=request_id, threshold=THRESHOLD, scan_duration_ms=duration_ms,
            modality_skip_reasons=skip_reasons or None,
            url_features=url_features, html_features=html_features,
            html_preview=html_preview, html_length=html_length,
            status_code=status_code, page_title=page_title, fetch_duration_ms=fetch_duration_ms,
            text_preview=text_preview, text_length=text_length, word_count=word_count,
            vision_embedding_dim=vis_embedding_dim, vision_backbone=vis_backbone,
            screenshot_path=screenshot_path,
        )

        yield _sse({
            "stage": "fusion",
            "request_id": request_id,
            "scan_id": scan_id,
            "phishing_probability": round(fused_prob, 4) if fused_prob is not None else None,
            "predicted_label": predicted_label,
            "threshold": THRESHOLD,
            "fusion_strategy": fusion_tag,
            "fetched_from": fetched_from,
            "scan_duration_ms": duration_ms,
        })
        yield _sse({"stage": "done"})

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


# ---------------------------------------------------------------------------
# Scan history (api/db.py) -- real logged scans, not synthetic
# ---------------------------------------------------------------------------

@app.get("/scans")
async def get_scans(limit: int = 50):
    return {"scans": recent_scans(limit=limit)}


@app.get("/scans/stats")
async def get_scan_stats():
    return stats()


def _scan_record_to_detail(row: dict) -> dict:
    """Reshapes a raw scans-table row (api/db.get_scan) into the same
    logical shape the frontend already builds while a live /predict/stream
    scan is running -- so /history/:scanId and a refreshed /scan/:scanId
    can be rendered by the exact same UI as a just-completed live scan."""
    has_screenshot = bool(row.get("screenshot_path"))
    return {
        "id": row["id"],
        "ts": row["ts"],
        "request_id": row.get("request_id"),
        "url": row["url"],
        "fetched_from": row.get("fetched_from"),
        "status_code": row.get("status_code"),
        "page_title": row.get("page_title"),
        "fetch_duration_ms": row.get("fetch_duration_ms"),
        "per_modality_scores": {
            "url": row.get("score_url"),
            "html": row.get("score_html"),
            "text": row.get("score_text"),
            "vision": row.get("score_vision"),
        },
        "modality_skip_reasons": row.get("modality_skip_reasons") or {},
        "fused_probability": row.get("fused_probability"),
        "predicted_label": row.get("predicted_label"),
        "fusion_strategy": row.get("fusion_strategy"),
        "threshold": row.get("threshold"),
        "scan_duration_ms": row.get("scan_duration_ms"),
        "evidence": {
            "url_features": row.get("url_features"),
            "html_features": row.get("html_features"),
            "html_preview": (
                {"content": row["html_preview"], "full_length": row.get("html_length") or len(row["html_preview"])}
                if row.get("html_preview")
                else None
            ),
            "text_preview": (
                {
                    "content": row["text_preview"],
                    "full_length": row.get("text_length") or len(row["text_preview"]),
                    "word_count": row.get("word_count"),
                }
                if row.get("text_preview")
                else None
            ),
            "vision": (
                {"embedding_dim": row.get("vision_embedding_dim"), "backbone": row.get("vision_backbone")}
                if row.get("vision_embedding_dim") is not None
                else None
            ),
            "screenshot_url": f"/scans/{row['id']}/screenshot" if has_screenshot else None,
        },
    }


@app.get("/scans/{scan_id}")
async def get_scan_detail(scan_id: int):
    """The complete historical scan result -- everything /history/:scanId
    (and a refreshed /scan/:scanId) needs to render the same verdict,
    modality cards, fusion diagram and 'what the models saw' evidence a
    live scan shows, reconstructed from what was persisted at scan time."""
    row = get_scan(scan_id)
    if row is None:
        raise HTTPException(status_code=404, detail=f"No scan with id {scan_id}")
    return _scan_record_to_detail(row)


@app.get("/scans/{scan_id}/screenshot")
async def get_scan_screenshot(scan_id: int):
    row = get_scan(scan_id)
    if row is None or not row.get("screenshot_path"):
        raise HTTPException(status_code=404, detail="No screenshot stored for this scan")
    path = Path(row["screenshot_path"])
    if not path.exists():
        raise HTTPException(status_code=404, detail="Screenshot file is missing on disk")
    return FileResponse(path, media_type="image/png")


# ---------------------------------------------------------------------------
# Research/evaluation endpoints -- everything here is read from
# artifacts/metrics/*.json (written by evaluation.py during training) or
# recomputed from artifacts/predictions/*.csv + the actual fitted models.
# Nothing is hand-typed.
# ---------------------------------------------------------------------------

_ABLATION_TAGS = ["full", "minus_url", "minus_html", "minus_text", "minus_vision"]
_ABLATION_MODALITIES = {
    "full": ALL_MODALITIES,
    "minus_url": ["html", "text", "vision"],
    "minus_html": ["url", "text", "vision"],
    "minus_text": ["url", "html", "vision"],
    "minus_vision": ["url", "html", "text"],
}


def _read_metrics_json(name: str) -> Optional[dict]:
    path = METRICS_DIR / f"{name}_test.json"
    if not path.exists():
        return None
    with path.open(encoding="utf-8") as f:
        return json.load(f)


@app.get("/model-info")
async def model_info():
    """Full real evaluation data for the Model Performance / Research pages:
    per-model accuracy/precision/recall/F1/ROC-AUC/PR-AUC, confusion
    matrices, classification reports, the real ablation table, and a
    contribution ranking derived from it (accuracy lost when a modality is
    removed from fusion -- not standalone accuracy)."""
    standalone = {}
    for m in ALL_MODALITIES:
        metrics = _read_metrics_json(m)
        if metrics is not None:
            metrics = {**metrics, "pr_auc": standalone_pr_auc(m)}
        standalone[m] = metrics

    ablation = {}
    for tag in _ABLATION_TAGS:
        metrics = _read_metrics_json(f"fusion_{tag}")
        if metrics is not None:
            metrics = {**metrics, "pr_auc": fusion_pr_auc(tag, _ABLATION_MODALITIES[tag])}
        ablation[tag] = metrics
    ablation = {tag: m for tag, m in ablation.items() if m is not None}

    priority = None
    full = ablation.get("full")
    if full is not None:
        priority = []
        for m in ALL_MODALITIES:
            dropped = ablation.get(f"minus_{m}")
            if dropped is None:
                continue
            priority.append({
                "modality": m,
                "standalone_accuracy": (standalone.get(m) or {}).get("accuracy"),
                "fusion_contribution": round(full["accuracy"] - dropped["accuracy"], 4),
            })
        priority.sort(key=lambda p: p["fusion_contribution"], reverse=True)

    coefficients = None
    intercept = None
    fusion = _load("fusion_full_model")
    if fusion is not None:
        coefs = np.asarray(fusion["model"].coef_[0], dtype=float)
        coefficients = {mod: round(float(c), 4) for mod, c in zip(fusion["modalities"], coefs)}
        intercept = round(float(fusion["model"].intercept_[0]), 4)

    return {
        "standalone_metrics": standalone,   # per modality: accuracy/precision/recall/f1/roc_auc/pr_auc/confusion_matrix/classification_report
        "ablation": ablation,                # per ablation tag: same shape, from fusion_<tag>_test.json + recomputed pr_auc
        "priority": priority,
        "fusion_logreg_coefficients": coefficients,
        "fusion_logreg_intercept": intercept,
        "threshold": THRESHOLD,
    }


@app.get("/error-analysis")
async def error_analysis(limit: int = 8):
    """Real false positives / false negatives from the OFFLINE TEST SET --
    reconstructed by rejoining the four modality prediction CSVs on
    sample_id and re-running the actual fitted fusion_full_model. This is
    NOT live-scan data; sample_id identifies a benchmark dataset row, not
    a URL (the offline dataset doesn't retain live URLs)."""
    table = compute_fused_predictions("full", ALL_MODALITIES, split="test")
    if table is None:
        raise HTTPException(
            status_code=503,
            detail="Prediction CSVs or fusion_full_model.joblib not found -- run the training pipeline first.",
        )

    wrong = table[table["predicted_label"] != table["label"]]
    false_positives = wrong[wrong["label"] == "legitimate"].sort_values("fused_probability", ascending=False)
    false_negatives = wrong[wrong["label"] == "phishing"].sort_values("fused_probability", ascending=True)

    def _rows(df) -> list[dict]:
        out = []
        for _, r in df.head(limit).iterrows():
            out.append({
                "sample_id": r["sample_id"],
                "true_label": r["label"],
                "predicted_label": r["predicted_label"],
                "fused_probability": round(float(r["fused_probability"]), 4),
                "modality_probabilities": {m: round(float(r[f"prob_{m}"]), 4) for m in ALL_MODALITIES},
            })
        return out

    return {
        "source": "offline_test_set",
        "n_test_samples": len(table),
        "n_errors": int(len(wrong)),
        "false_positives": _rows(false_positives),
        "false_negatives": _rows(false_negatives),
    }
