"""
evaluation.py
Shared metric computation so every training script (per-modality, fusion,
ablation) reports numbers the same way and they're directly comparable.
"""
from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, classification_report,
)


def evaluate(y_true, y_prob, positive_label: str, threshold: float = 0.5) -> dict:
    """y_true: array of string labels. y_prob: array of P(positive_label)."""
    y_true_bin = np.array([1 if y == positive_label else 0 for y in y_true])
    y_pred_bin = (np.asarray(y_prob) >= threshold).astype(int)

    metrics = {
        "positive_label": positive_label,
        "threshold": threshold,
        "n_samples": len(y_true_bin),
        "accuracy": round(accuracy_score(y_true_bin, y_pred_bin), 4),
        "precision": round(precision_score(y_true_bin, y_pred_bin, zero_division=0), 4),
        "recall": round(recall_score(y_true_bin, y_pred_bin, zero_division=0), 4),
        "f1": round(f1_score(y_true_bin, y_pred_bin, zero_division=0), 4),
    }
    try:
        metrics["roc_auc"] = round(roc_auc_score(y_true_bin, y_prob), 4)
    except ValueError:
        metrics["roc_auc"] = None  # only one class present in y_true

    cm = confusion_matrix(y_true_bin, y_pred_bin).tolist()
    metrics["confusion_matrix"] = {"labels": ["negative", positive_label], "matrix": cm}
    metrics["classification_report"] = classification_report(
        y_true_bin, y_pred_bin, target_names=["negative", positive_label], zero_division=0, output_dict=True
    )
    return metrics


def save_metrics(metrics: dict, out_path: Path) -> None:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2, default=str)


def print_summary(name: str, metrics: dict) -> None:
    print(f"[{name}] acc={metrics['accuracy']}  precision={metrics['precision']}  "
          f"recall={metrics['recall']}  f1={metrics['f1']}  roc_auc={metrics['roc_auc']}")
