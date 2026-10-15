"""
train_fusion.py
Late fusion: takes the held-out-validation probability from each of the
four per-modality models (already trained by train_modality.py) and trains
a small logistic-regression meta-classifier on top of them. Evaluates the
fused model on the test split.

This only works after you've run, for every modality:
    python -m src.train_modality --modality url
    python -m src.train_modality --modality html
    python -m src.train_modality --modality text
    python -m src.train_modality --modality vision

Run:
    python -m src.train_fusion
    python -m src.train_fusion --exclude vision     # for ablations
"""
from __future__ import annotations

import argparse

import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression

from .config import PREDICTIONS_DIR, METRICS_DIR, MODELS_DIR, RANDOM_SEED, ensure_dirs
from .evaluation import evaluate, save_metrics, print_summary

ALL_MODALITIES = ["url", "html", "text", "vision"]


def load_predictions(modality: str, split_name: str) -> pd.DataFrame:
    path = PREDICTIONS_DIR / f"{modality}_{split_name}.csv"
    if not path.exists():
        raise FileNotFoundError(f"{path} not found -- run `python -m src.train_modality --modality {modality}` first.")
    return pd.read_csv(path).rename(columns={"prob": f"prob_{modality}"})


def build_fusion_table(modalities: list[str], split_name: str) -> pd.DataFrame:
    merged = None
    for m in modalities:
        df = load_predictions(m, split_name)[["sample_id", "label", f"prob_{m}"]]
        merged = df if merged is None else merged.merge(df, on=["sample_id", "label"], how="inner")
    return merged


def run_fusion(modalities: list[str], tag: str) -> dict:
    val_table = build_fusion_table(modalities, "val")
    test_table = build_fusion_table(modalities, "test")

    prob_cols = [f"prob_{m}" for m in modalities]
    positive_label = None
    # positive_label is consistent across modality models; recover it from any one model file
    for m in modalities:
        meta = joblib.load(MODELS_DIR / f"{m}_model.joblib")
        positive_label = meta["positive_label"]
        break

    X_val, y_val = val_table[prob_cols].to_numpy(), val_table["label"].to_numpy()
    X_test, y_test = test_table[prob_cols].to_numpy(), test_table["label"].to_numpy()

    meta_clf = LogisticRegression(max_iter=1000, class_weight="balanced", random_state=RANDOM_SEED)
    meta_clf.fit(X_val, y_val)
    pos_idx = list(meta_clf.classes_).index(positive_label)

    val_probs = meta_clf.predict_proba(X_val)[:, pos_idx]
    test_probs = meta_clf.predict_proba(X_test)[:, pos_idx]

    val_metrics = evaluate(y_val, val_probs, positive_label)
    test_metrics = evaluate(y_test, test_probs, positive_label)
    print_summary(f"fusion[{tag}]/val", val_metrics)
    print_summary(f"fusion[{tag}]/test", test_metrics)

    ensure_dirs()
    joblib.dump({"model": meta_clf, "modalities": modalities, "positive_label": positive_label},
                MODELS_DIR / f"fusion_{tag}_model.joblib")
    save_metrics(val_metrics, METRICS_DIR / f"fusion_{tag}_val.json")
    save_metrics(test_metrics, METRICS_DIR / f"fusion_{tag}_test.json")

    return {"tag": tag, "modalities": modalities, "val": val_metrics, "test": test_metrics}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--exclude", nargs="*", default=[], choices=ALL_MODALITIES,
                         help="Modalities to leave OUT of fusion (used by ablation.py).")
    args = parser.parse_args()

    modalities = [m for m in ALL_MODALITIES if m not in args.exclude]
    tag = "full" if not args.exclude else "minus_" + "_".join(args.exclude)
    run_fusion(modalities, tag)


if __name__ == "__main__":
    main()
