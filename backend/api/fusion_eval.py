"""
api/fusion_eval.py
Reconstructs per-sample fused predictions on the held-out test split by
joining the four modality prediction CSVs (already written by
train_modality.py) and running them back through the trained fusion
model -- the same procedure src/train_fusion.py used to fit it in the
first place. This backs /model-info's PR-AUC numbers (not stored in the
metrics JSON files) and /error-analysis's real false positives/negatives.

Nothing here is fabricated: every number comes from the actual per-sample
predictions each modality model made on the test set, run back through
the actual fitted fusion model.
"""
from __future__ import annotations

from pathlib import Path
from typing import Optional

import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import average_precision_score

PREDICTIONS_DIR = Path("artifacts/predictions")
MODELS_DIR = Path("models")

ALL_MODALITIES = ["url", "html", "text", "vision"]


def _load_predictions(modality: str, split: str) -> pd.DataFrame:
    path = PREDICTIONS_DIR / f"{modality}_{split}.csv"
    if not path.exists():
        raise FileNotFoundError(str(path))
    return pd.read_csv(path).rename(columns={"prob": f"prob_{modality}"})


def build_fusion_table(modalities: list[str], split: str) -> pd.DataFrame:
    merged = None
    for m in modalities:
        df = _load_predictions(m, split)[["sample_id", "label", f"prob_{m}"]]
        merged = df if merged is None else merged.merge(df, on=["sample_id", "label"], how="inner")
    return merged


def compute_fused_predictions(tag: str, modalities: list[str], split: str = "test") -> Optional[pd.DataFrame]:
    """DataFrame with sample_id, label, prob_<modality> columns,
    fused_probability, predicted_label -- or None if required files
    (prediction CSVs or the fusion_<tag>_model.joblib) aren't present."""
    try:
        table = build_fusion_table(modalities, split)
        fusion = joblib.load(MODELS_DIR / f"fusion_{tag}_model.joblib")
    except FileNotFoundError:
        return None

    prob_cols = [f"prob_{m}" for m in fusion["modalities"]]
    X = table[prob_cols].to_numpy()
    pos_idx = list(fusion["model"].classes_).index(fusion["positive_label"])
    table = table.copy()
    table["fused_probability"] = fusion["model"].predict_proba(X)[:, pos_idx]
    table["predicted_label"] = np.where(
        table["fused_probability"] >= 0.5, fusion["positive_label"], "legitimate"
    )
    return table


def pr_auc(y_true_labels, y_prob, positive_label: str) -> Optional[float]:
    y_true_bin = [1 if y == positive_label else 0 for y in y_true_labels]
    try:
        return round(float(average_precision_score(y_true_bin, y_prob)), 4)
    except ValueError:
        return None  # only one class present


def standalone_pr_auc(modality: str, split: str = "test") -> Optional[float]:
    try:
        df = _load_predictions(modality, split)
    except FileNotFoundError:
        return None
    return pr_auc(df["label"], df[f"prob_{modality}"], "phishing")


def fusion_pr_auc(tag: str, modalities: list[str], split: str = "test") -> Optional[float]:
    table = compute_fused_predictions(tag, modalities, split)
    if table is None:
        return None
    return pr_auc(table["label"], table["fused_probability"], "phishing")
