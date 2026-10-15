"""
api/db.py
A minimal local SQLite log of every completed prediction, so the frontend
can show real scan history AND a complete historical scan detail page
(/history/:scanId) instead of just a row of scores.
No ORM, no migrations -- one table, stdlib sqlite3 only.

CHANGED vs the original version: the schema now also stores everything
needed to reconstruct "what the models saw" for a past scan -- the same
evidence that is streamed live during /predict/stream (url/html features,
fetch info, text/html previews, vision embedding info, and the path to the
uploaded screenshot on disk). Feature dicts are stored as JSON text; the
rest are plain columns. This is purely additive: every original column and
function is still here with the same behavior, plus init_db() migrates an
existing db file created by the original schema in place (ALTER TABLE),
so no one loses already-logged scans.

The DB file (phish360_scans.db) is created next to wherever you run
uvicorn from (the project root), same convention as MODELS_DIR="models"
in app.py.
"""
from __future__ import annotations

import json
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

DB_PATH = Path("phish360_scans.db")

_SCHEMA = """
CREATE TABLE IF NOT EXISTS scans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ts TEXT NOT NULL,
    request_id TEXT,
    url TEXT NOT NULL,
    fetched_from TEXT,
    status_code INTEGER,
    page_title TEXT,
    fetch_duration_ms REAL,
    score_url REAL,
    score_html REAL,
    score_text REAL,
    score_vision REAL,
    fused_probability REAL,
    predicted_label TEXT,
    fusion_strategy TEXT,
    threshold REAL,
    scan_duration_ms REAL,
    modality_skip_reasons TEXT,
    url_features TEXT,
    html_features TEXT,
    html_preview TEXT,
    html_length INTEGER,
    text_preview TEXT,
    text_length INTEGER,
    word_count INTEGER,
    vision_embedding_dim INTEGER,
    vision_backbone TEXT,
    screenshot_path TEXT
);
"""

# Columns added after the original release. Kept as an explicit list (rather
# than just trusting _SCHEMA) so init_db() can ALTER an existing db file that
# was created by the original schema, without losing already-logged scans.
_MIGRATION_COLUMNS: list[tuple[str, str]] = [
    ("request_id", "TEXT"),
    ("status_code", "INTEGER"),
    ("page_title", "TEXT"),
    ("fetch_duration_ms", "REAL"),
    ("threshold", "REAL"),
    ("scan_duration_ms", "REAL"),
    ("modality_skip_reasons", "TEXT"),
    ("url_features", "TEXT"),
    ("html_features", "TEXT"),
    ("html_preview", "TEXT"),
    ("html_length", "INTEGER"),
    ("text_preview", "TEXT"),
    ("text_length", "INTEGER"),
    ("word_count", "INTEGER"),
    ("vision_embedding_dim", "INTEGER"),
    ("vision_backbone", "TEXT"),
    ("screenshot_path", "TEXT"),
]


@contextmanager
def _connect():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db() -> None:
    with _connect() as conn:
        conn.execute(_SCHEMA)
        existing = {row["name"] for row in conn.execute("PRAGMA table_info(scans)")}
        for name, coltype in _MIGRATION_COLUMNS:
            if name not in existing:
                conn.execute(f"ALTER TABLE scans ADD COLUMN {name} {coltype}")


def _json_or_none(value: Any) -> Optional[str]:
    if value is None:
        return None
    return json.dumps(value)


def log_scan(
    url: str,
    scores: dict,
    fused_probability: Optional[float],
    predicted_label: Optional[str],
    fusion_strategy: str,
    fetched_from: Optional[str] = None,
    request_id: Optional[str] = None,
    threshold: Optional[float] = None,
    scan_duration_ms: Optional[float] = None,
    modality_skip_reasons: Optional[dict] = None,
    url_features: Optional[dict] = None,
    html_features: Optional[dict] = None,
    html_preview: Optional[str] = None,
    html_length: Optional[int] = None,
    status_code: Optional[int] = None,
    page_title: Optional[str] = None,
    fetch_duration_ms: Optional[float] = None,
    text_preview: Optional[str] = None,
    text_length: Optional[int] = None,
    word_count: Optional[int] = None,
    vision_embedding_dim: Optional[int] = None,
    vision_backbone: Optional[str] = None,
    screenshot_path: Optional[str] = None,
) -> Optional[int]:
    """Called once per completed /predict or /predict/stream request, after
    fusion. Never raises -- a logging failure should never break a scan.
    Returns the new row's id (used as the /history/:scanId and
    /scan/:scanId identifier) or None if logging failed."""
    try:
        with _connect() as conn:
            cur = conn.execute(
                """INSERT INTO scans
                   (ts, request_id, url, fetched_from, status_code, page_title, fetch_duration_ms,
                    score_url, score_html, score_text, score_vision,
                    fused_probability, predicted_label, fusion_strategy, threshold, scan_duration_ms,
                    modality_skip_reasons, url_features, html_features, html_preview, html_length,
                    text_preview, text_length, word_count, vision_embedding_dim, vision_backbone,
                    screenshot_path)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    datetime.now(timezone.utc).isoformat(),
                    request_id,
                    url,
                    fetched_from,
                    status_code,
                    page_title,
                    fetch_duration_ms,
                    scores.get("url"),
                    scores.get("html"),
                    scores.get("text"),
                    scores.get("vision"),
                    fused_probability,
                    predicted_label,
                    fusion_strategy,
                    threshold,
                    scan_duration_ms,
                    _json_or_none(modality_skip_reasons),
                    _json_or_none(url_features),
                    _json_or_none(html_features),
                    html_preview,
                    html_length,
                    text_preview,
                    text_length,
                    word_count,
                    vision_embedding_dim,
                    vision_backbone,
                    screenshot_path,
                ),
            )
            return cur.lastrowid
    except Exception:  # noqa: BLE001 -- logging is best-effort, never fatal
        return None


def recent_scans(limit: int = 50) -> list[dict]:
    with _connect() as conn:
        rows = conn.execute(
            "SELECT * FROM scans ORDER BY id DESC LIMIT ?", (limit,)
        ).fetchall()
        return [dict(r) for r in rows]


def get_scan(scan_id: int) -> Optional[dict]:
    """Full row for /scans/{scan_id} (the /history/:scanId and completed
    /scan/:scanId detail views), with JSON columns parsed back into dicts."""
    with _connect() as conn:
        row = conn.execute("SELECT * FROM scans WHERE id = ?", (scan_id,)).fetchone()
        if row is None:
            return None
        d = dict(row)
        for key in ("modality_skip_reasons", "url_features", "html_features"):
            raw = d.get(key)
            d[key] = json.loads(raw) if raw else None
        return d


def _histogram(values: list[float], buckets: int = 10) -> list[dict]:
    counts = [0] * buckets
    for v in values:
        if v is None:
            continue
        idx = min(buckets - 1, max(0, int(v * buckets)))
        counts[idx] += 1
    return [
        {"bucket_start": round(i / buckets, 2), "bucket_end": round((i + 1) / buckets, 2), "count": c}
        for i, c in enumerate(counts)
    ]


def stats() -> dict:
    with _connect() as conn:
        rows = [dict(r) for r in conn.execute("SELECT * FROM scans").fetchall()]

    total = len(rows)
    label_counts = {"phishing": 0, "legitimate": 0}
    for r in rows:
        if r["predicted_label"] in label_counts:
            label_counts[r["predicted_label"]] += 1

    fused_values = [r["fused_probability"] for r in rows if r["fused_probability"] is not None]

    per_modality = {}
    for m in ("url", "html", "text", "vision"):
        values = [r[f"score_{m}"] for r in rows if r[f"score_{m}"] is not None]
        per_modality[m] = {
            "count_scored": len(values),
            "mean_score": round(sum(values) / len(values), 4) if values else None,
            "histogram": _histogram(values),
        }

    timeline = [
        {
            "ts": r["ts"],
            "url": r["url"],
            "fused_probability": r["fused_probability"],
            "predicted_label": r["predicted_label"],
        }
        for r in sorted(rows, key=lambda r: r["ts"])
    ]

    return {
        "total_scans": total,
        "label_counts": label_counts,
        "fused_probability_histogram": _histogram(fused_values),
        "per_modality": per_modality,
        "timeline": timeline,
    }
