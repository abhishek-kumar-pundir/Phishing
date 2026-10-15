"""
train_modality.py
Trains ONE modality's baseline classifier and writes out:
    models/<modality>_model.joblib
    artifacts/predictions/<modality>_val.csv   (sample_id, split, label, prob)
    artifacts/predictions/<modality>_test.csv
    artifacts/metrics/<modality>_val.json
    artifacts/metrics/<modality>_test.json

Modalities: url, html, text, vision

Run (from the project root, after preprocessing.py and dataset_builder.py):
    python -m src.train_modality --modality url
    python -m src.train_modality --modality html
    python -m src.train_modality --modality text
    python -m src.train_modality --modality vision
"""
from __future__ import annotations

import argparse
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

from .config import (FEATURES_DIR, PREDICTIONS_DIR, METRICS_DIR, MODELS_DIR,
                      RANDOM_SEED, VAL_SIZE, resolve_positive_label, ensure_dirs)
from .evaluation import evaluate, save_metrics, print_summary


def load_tabular(modality: str) -> pd.DataFrame:
    path = FEATURES_DIR / f"{modality}_features.csv"
    if not path.exists():
        raise FileNotFoundError(f"{path} not found -- run `python -m src.dataset_builder` first.")
    return pd.read_csv(path)


def split_trainval(df: pd.DataFrame, y_col: str = "label"):
    trainval = df[df["split"] == "trainval"].reset_index(drop=True)
    test = df[df["split"] == "test"].reset_index(drop=True)
    train, val = train_test_split(
        trainval, test_size=VAL_SIZE, random_state=RANDOM_SEED, stratify=trainval[y_col]
    )
    return train.reset_index(drop=True), val.reset_index(drop=True), test.reset_index(drop=True)


def _write_predictions(df: pd.DataFrame, probs: np.ndarray, out_path: Path) -> None:
    out = df[["sample_id", "split", "label"]].copy()
    out["prob"] = probs
    out.to_csv(out_path, index=False)


def train_tabular_modality(modality: str) -> None:
    df = load_tabular(modality)
    feature_cols = [c for c in df.columns if c not in ("sample_id", "split", "label")]

    train, val, test = split_trainval(df)
    positive_label = resolve_positive_label(df["label"].unique())
    print(f"Positive label resolved as: '{positive_label}'")

    X_train = train[feature_cols].to_numpy(dtype=np.float32)
    y_train = train["label"].to_numpy()
    X_val = val[feature_cols].to_numpy(dtype=np.float32)
    X_test = test[feature_cols].to_numpy(dtype=np.float32)

    clf = RandomForestClassifier(
        n_estimators=300, max_depth=None, class_weight="balanced",
        random_state=RANDOM_SEED, n_jobs=-1,
    )
    clf.fit(X_train, y_train)
    pos_idx = list(clf.classes_).index(positive_label)

    val_probs = clf.predict_proba(X_val)[:, pos_idx]
    test_probs = clf.predict_proba(X_test)[:, pos_idx]

    val_metrics = evaluate(val["label"].to_numpy(), val_probs, positive_label)
    test_metrics = evaluate(test["label"].to_numpy(), test_probs, positive_label)
    print_summary(f"{modality}/val", val_metrics)
    print_summary(f"{modality}/test", test_metrics)

    ensure_dirs()
    joblib.dump({"model": clf, "feature_cols": feature_cols, "positive_label": positive_label},
                MODELS_DIR / f"{modality}_model.joblib")
    _write_predictions(val, val_probs, PREDICTIONS_DIR / f"{modality}_val.csv")
    _write_predictions(test, test_probs, PREDICTIONS_DIR / f"{modality}_test.csv")
    save_metrics(val_metrics, METRICS_DIR / f"{modality}_val.json")
    save_metrics(test_metrics, METRICS_DIR / f"{modality}_test.json")


def train_text_modality() -> None:
    path = FEATURES_DIR / "text_corpus.csv"
    if not path.exists():
        raise FileNotFoundError(f"{path} not found -- run `python -m src.dataset_builder` first.")
    df = pd.read_csv(path).fillna({"text": ""})

    train, val, test = split_trainval(df)
    positive_label = resolve_positive_label(df["label"].unique())
    print(f"Positive label resolved as: '{positive_label}'")

    vectorizer = TfidfVectorizer(max_features=20000, ngram_range=(1, 2), min_df=2)
    X_train = vectorizer.fit_transform(train["text"])  # fit ONLY on train, never val/test
    X_val = vectorizer.transform(val["text"])
    X_test = vectorizer.transform(test["text"])

    clf = LogisticRegression(max_iter=1000, class_weight="balanced", random_state=RANDOM_SEED)
    clf.fit(X_train, train["label"])
    pos_idx = list(clf.classes_).index(positive_label)

    val_probs = clf.predict_proba(X_val)[:, pos_idx]
    test_probs = clf.predict_proba(X_test)[:, pos_idx]

    val_metrics = evaluate(val["label"].to_numpy(), val_probs, positive_label)
    test_metrics = evaluate(test["label"].to_numpy(), test_probs, positive_label)
    print_summary("text/val", val_metrics)
    print_summary("text/test", test_metrics)

    ensure_dirs()
    joblib.dump({"model": clf, "vectorizer": vectorizer, "positive_label": positive_label},
                MODELS_DIR / "text_model.joblib")
    _write_predictions(val, val_probs, PREDICTIONS_DIR / "text_val.csv")
    _write_predictions(test, test_probs, PREDICTIONS_DIR / "text_test.csv")
    save_metrics(val_metrics, METRICS_DIR / "text_val.json")
    save_metrics(test_metrics, METRICS_DIR / "text_test.json")


def train_vision_modality() -> None:
    npz_path = FEATURES_DIR / "vision_features.npz"
    if not npz_path.exists():
        raise FileNotFoundError(f"{npz_path} not found -- run `python -m src.dataset_builder` first.")
    data = np.load(npz_path, allow_pickle=True)
    df = pd.DataFrame({"sample_id": data["sample_ids"], "split": data["splits"], "label": data["labels"]})
    embeddings = data["embeddings"]

    positive_label = resolve_positive_label(df["label"].unique())
    print(f"Positive label resolved as: '{positive_label}'")

    trainval_mask = (df["split"] == "trainval").to_numpy()
    test_mask = (df["split"] == "test").to_numpy()

    idx_trainval = np.where(trainval_mask)[0]
    train_idx, val_idx = train_test_split(
        idx_trainval, test_size=VAL_SIZE, random_state=RANDOM_SEED, stratify=df.loc[idx_trainval, "label"]
    )
    test_idx = np.where(test_mask)[0]

    clf = RandomForestClassifier(
        n_estimators=300, max_depth=None, class_weight="balanced",
        random_state=RANDOM_SEED, n_jobs=-1,
    )
    clf.fit(embeddings[train_idx], df.loc[train_idx, "label"])
    pos_idx = list(clf.classes_).index(positive_label)

    val_probs = clf.predict_proba(embeddings[val_idx])[:, pos_idx]
    test_probs = clf.predict_proba(embeddings[test_idx])[:, pos_idx]

    val_df, test_df = df.loc[val_idx].reset_index(drop=True), df.loc[test_idx].reset_index(drop=True)
    val_metrics = evaluate(val_df["label"].to_numpy(), val_probs, positive_label)
    test_metrics = evaluate(test_df["label"].to_numpy(), test_probs, positive_label)
    print_summary("vision/val", val_metrics)
    print_summary("vision/test", test_metrics)

    ensure_dirs()
    joblib.dump({"model": clf, "positive_label": positive_label}, MODELS_DIR / "vision_model.joblib")
    _write_predictions(val_df, val_probs, PREDICTIONS_DIR / "vision_val.csv")
    _write_predictions(test_df, test_probs, PREDICTIONS_DIR / "vision_test.csv")
    save_metrics(val_metrics, METRICS_DIR / "vision_val.json")
    save_metrics(test_metrics, METRICS_DIR / "vision_test.json")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--modality", required=True, choices=["url", "html", "text", "vision"])
    args = parser.parse_args()

    if args.modality in ("url", "html"):
        train_tabular_modality(args.modality)
    elif args.modality == "text":
        train_text_modality()
    elif args.modality == "vision":
        train_vision_modality()


if __name__ == "__main__":
    main()
