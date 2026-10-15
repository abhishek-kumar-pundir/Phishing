"""
dataset_builder.py
Reads artifacts/master_index.csv and builds feature tables for every
modality, saved under artifacts/features/:

    url_features.csv          (lexical URL features, one row per sample)
    html_features.csv         (DOM/structural features, one row per sample)
    text_corpus.csv           (sample_id, split, label, visible_text) -- TF-IDF
                               is fit later inside train_modality.py so the
                               vectorizer is only ever fit on the train split
    vision_features.npz       (sample_id array + stacked embedding matrix)

Run:
    python -m src.dataset_builder
"""
from __future__ import annotations

import csv
from pathlib import Path

import numpy as np

from .features_html import extract_html_features, extract_visible_text
from .features_url import extract_url_features
from .features_vision import extract_vision_features, vision_embedding_dim
from .text_io import read_text_stripped

ARTIFACTS_DIR = Path("artifacts")
FEATURES_DIR = ARTIFACTS_DIR / "features"
MASTER_INDEX = ARTIFACTS_DIR / "master_index.csv"


def load_master_index() -> list[dict]:
    if not MASTER_INDEX.exists():
        raise FileNotFoundError(f"{MASTER_INDEX} not found -- run `python -m src.preprocessing` first.")
    with MASTER_INDEX.open(encoding="utf-8") as f:
        return list(csv.DictReader(f))


def read_text_safely(path: str) -> str:
    return read_text_stripped(path)  # BOM-safe (see text_io.py)


def build_url_features(rows: list[dict], out_path: Path) -> None:
    fieldnames = None
    with out_path.open("w", newline="", encoding="utf-8") as f:
        writer = None
        for r in rows:
            url_text = read_text_safely(r["url_path"])
            feats = extract_url_features(url_text)
            record = {"sample_id": r["sample_id"], "split": r["split"], "label": r["label"], **feats}
            if writer is None:
                fieldnames = list(record.keys())
                writer = csv.DictWriter(f, fieldnames=fieldnames)
                writer.writeheader()
            writer.writerow(record)
    print(f"  wrote {out_path}")


def build_html_features_and_text(rows: list[dict], html_out: Path, text_out: Path) -> None:
    html_writer = None
    with html_out.open("w", newline="", encoding="utf-8") as fh, \
         text_out.open("w", newline="", encoding="utf-8") as ft:
        text_writer = csv.DictWriter(ft, fieldnames=["sample_id", "split", "label", "text"])
        text_writer.writeheader()
        for r in rows:
            html_text = read_text_safely(r["html_path"])
            url_text = read_text_safely(r["url_path"]).strip()
            feats = extract_html_features(html_text, url_text)
            record = {"sample_id": r["sample_id"], "split": r["split"], "label": r["label"], **feats}
            if html_writer is None:
                html_writer = csv.DictWriter(fh, fieldnames=list(record.keys()))
                html_writer.writeheader()
            html_writer.writerow(record)

            text_writer.writerow({
                "sample_id": r["sample_id"],
                "split": r["split"],
                "label": r["label"],
                "text": extract_visible_text(html_text)[:20000],  # cap to keep TF-IDF fitting fast
            })
    print(f"  wrote {html_out}")
    print(f"  wrote {text_out}")


def build_vision_features(rows: list[dict], out_path: Path) -> None:
    dim = vision_embedding_dim()
    sample_ids, splits, labels = [], [], []
    embeddings = np.zeros((len(rows), dim), dtype=np.float32)
    errors = []
    for i, r in enumerate(rows):
        try:
            embeddings[i] = extract_vision_features(r["screenshot_path"])
        except Exception as e:  # noqa: BLE001
            errors.append(f"{r['split']}/{r['sample_id']}: {e}")
        sample_ids.append(r["sample_id"])
        splits.append(r["split"])
        labels.append(r["label"])
        if (i + 1) % 250 == 0 or (i + 1) == len(rows):
            print(f"    vision: {i + 1}/{len(rows)}")

    np.savez_compressed(
        out_path,
        sample_ids=np.array(sample_ids),
        splits=np.array(splits),
        labels=np.array(labels),
        embeddings=embeddings,
    )
    print(f"  wrote {out_path}  (dim={dim}, errors={len(errors)})")
    if errors:
        err_path = out_path.parent / "vision_errors.txt"
        err_path.write_text("\n".join(errors), encoding="utf-8")
        print(f"  logged {len(errors)} unreadable screenshots to {err_path}")


def main() -> None:
    from .features_vision import HAVE_TORCH
    FEATURES_DIR.mkdir(parents=True, exist_ok=True)
    rows = load_master_index()
    print(f"Loaded {len(rows)} samples from {MASTER_INDEX}")
    if not HAVE_TORCH:
        print("NOTE: torch/torchvision not installed -- vision features will use the "
              "weaker histogram fallback. See features_vision.py docstring to install torch.")

    print("Building URL features...")
    build_url_features(rows, FEATURES_DIR / "url_features.csv")

    print("Building HTML/DOM features + text corpus...")
    build_html_features_and_text(rows, FEATURES_DIR / "html_features.csv", FEATURES_DIR / "text_corpus.csv")

    print("Building vision features (this is the slow step)...")
    build_vision_features(rows, FEATURES_DIR / "vision_features.npz")

    print("Done.")


if __name__ == "__main__":
    main()
