"""
preprocessing.py
Scans the Phish360 dataset folder structure directly (does not require the
forensics CSVs, though it will use dataset_inventory.csv if present at
artifacts/dataset_inventory.csv to save re-scanning time) and produces a
single, clean, leakage-safe master index:

    artifacts/master_index.csv

Columns: split, sample_id, label, url_path, html_path, screenshot_path,
         html_md5, screenshot_md5, url_md5, dup_group_id

Leakage handling: if a sample's HTML content (by MD5) also appears in a
DIFFERENT split, we DROP the copy that is in `trainval` and keep the one in
`test`, so your test set stays untouched and trainval doesn't get an easy
answer key. This is a conservative default -- read the printed summary and
decide if it's right for your case.

Run:
    python -m src.preprocessing
"""
from __future__ import annotations

import csv
import hashlib
from collections import defaultdict
from pathlib import Path

from .text_io import read_text_stripped

DATASET_ROOT = Path("datasets") / "phish360"
ARTIFACTS_DIR = Path("artifacts")

MODALITY_DIRS = {"label": "Label", "url": "URL", "html": "RAW-HTML", "screenshot": "SCREEN-SHOT"}
MODALITY_FILENAMES = {"label": "label.txt", "url": "url.txt", "html": "index.html", "screenshot": "screen_shoot.png"}


def md5_of_file(path: Path) -> str | None:
    if not path.exists():
        return None
    h = hashlib.md5()
    try:
        with path.open("rb") as f:
            for chunk in iter(lambda: f.read(1024 * 1024), b""):
                h.update(chunk)
        return h.hexdigest()
    except OSError:
        return None


def parse_folder_label(sample_id: str) -> str | None:
    if "_" not in sample_id:
        return None
    return sample_id.split("_", 1)[1].strip().lower() or None


def read_label(sample_dir: Path) -> str | None:
    label_path = sample_dir / MODALITY_DIRS["label"] / MODALITY_FILENAMES["label"]
    if label_path.exists():
        text = read_text_stripped(label_path).strip().lower()
        return text or None
    return None


LEGITIMATE_TOKENS = {"legitimate", "legit", "benign", "safe"}


def normalize_label(raw_label: str) -> tuple[str, str | None]:
    """Collapses the dataset's raw label (which can be 'legitimate', the
    generic 'phish', OR a specific impersonated-brand name like 'chase' /
    'paypal') into a clean binary label for training, while keeping the
    brand name around separately in case you want it later (e.g. for a
    brand-identification side task, or to stratify your train/val split
    by targeted brand so rare brands aren't all dumped in one fold).

    Returns (binary_label, target_brand_or_None).
    """
    raw = raw_label.strip().lower()
    if raw in LEGITIMATE_TOKENS:
        return "legitimate", None
    if raw in ("phish", "phishing"):
        return "phishing", None
    # anything else (a brand name like 'chase', 'paypal', 'adobe', ...)
    # is a phishing sample targeting that brand
    return "phishing", raw


def scan_dataset() -> list[dict]:
    rows = []
    if not DATASET_ROOT.exists():
        raise FileNotFoundError(
            f"Could not find {DATASET_ROOT.resolve()}. Run this from the folder that "
            f"contains 'datasets/' (same place you run dataset_forensics.py from)."
        )
    for split_dir in sorted(p for p in DATASET_ROOT.iterdir() if p.is_dir()):
        for sample_dir in sorted(p for p in split_dir.iterdir() if p.is_dir()):
            raw_label = read_label(sample_dir) or parse_folder_label(sample_dir.name)
            if raw_label is None:
                continue  # can't use an unlabeled sample for supervised training
            label, target_brand = normalize_label(raw_label)

            url_path = sample_dir / MODALITY_DIRS["url"] / MODALITY_FILENAMES["url"]
            html_path = sample_dir / MODALITY_DIRS["html"] / MODALITY_FILENAMES["html"]
            shot_path = sample_dir / MODALITY_DIRS["screenshot"] / MODALITY_FILENAMES["screenshot"]

            if not (url_path.exists() and html_path.exists() and shot_path.exists()):
                continue  # skip incomplete samples for the baseline pipeline

            rows.append({
                "split": split_dir.name,
                "sample_id": sample_dir.name,
                "label": label,
                "raw_label": raw_label,
                "target_brand": target_brand or "",
                "url_path": str(url_path),
                "html_path": str(html_path),
                "screenshot_path": str(shot_path),
                "html_md5": md5_of_file(html_path),
                "screenshot_md5": md5_of_file(shot_path),
                "url_md5": md5_of_file(url_path),
            })
    return rows


def dedupe_cross_split(rows: list[dict]) -> tuple[list[dict], dict]:
    """Drops trainval rows whose HTML MD5 also appears in the test split.
    Keeps a dup_group_id on every row so you can inspect groups later."""
    by_html: dict[str, list[dict]] = defaultdict(list)
    for r in rows:
        if r["html_md5"]:
            by_html[r["html_md5"]].append(r)

    group_id_map: dict[str, int] = {}
    dropped = []
    kept_rows = []
    next_gid = 0

    for html_md5, group in by_html.items():
        group_id_map[html_md5] = next_gid
        next_gid += 1
        splits = {r["split"] for r in group}
        if len(group) > 1 and "test" in splits and len(splits) > 1:
            # keep test copies, drop trainval copies of this exact HTML
            for r in group:
                if r["split"] == "test":
                    kept_rows.append(r)
                else:
                    dropped.append(r)
        else:
            kept_rows.extend(group)

    # rows with no html_md5 (shouldn't happen given completeness filter, but be safe)
    kept_ids = {(r["split"], r["sample_id"]) for r in kept_rows}
    for r in rows:
        if r["html_md5"] is None and (r["split"], r["sample_id"]) not in kept_ids:
            kept_rows.append(r)

    for r in kept_rows:
        r["dup_group_id"] = group_id_map.get(r["html_md5"], -1)

    summary = {
        "total_scanned": len(rows),
        "kept": len(kept_rows),
        "dropped_as_cross_split_duplicates": len(dropped),
        "dropped_sample_ids": [f"{r['split']}/{r['sample_id']}" for r in dropped][:50],
    }
    return kept_rows, summary


def write_master_index(rows: list[dict], out_path: Path) -> None:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    fields = ["split", "sample_id", "label", "raw_label", "target_brand",
              "url_path", "html_path", "screenshot_path",
              "html_md5", "screenshot_md5", "url_md5", "dup_group_id"]
    with out_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        for r in rows:
            writer.writerow(r)


def main() -> None:
    print("Scanning dataset...")
    rows = scan_dataset()
    print(f"  Complete, labeled samples found: {len(rows)}")

    print("Checking for cross-split duplicates (leakage)...")
    kept_rows, summary = dedupe_cross_split(rows)
    print(f"  Kept: {summary['kept']}   Dropped (trainval copies duplicated in test): "
          f"{summary['dropped_as_cross_split_duplicates']}")

    out_path = ARTIFACTS_DIR / "master_index.csv"
    write_master_index(kept_rows, out_path)
    print(f"Wrote {out_path.resolve()}")

    labels = sorted({r["label"] for r in kept_rows})
    for split in sorted({r["split"] for r in kept_rows}):
        counts = {lab: sum(1 for r in kept_rows if r["split"] == split and r["label"] == lab) for lab in labels}
        print(f"  {split}: {counts}")

    brands = sorted({r["target_brand"] for r in kept_rows if r["target_brand"]})
    if brands:
        print(f"\n  {len(brands)} distinct target brands found among phishing samples "
              f"(kept in the 'target_brand' column for reference): {', '.join(brands[:15])}"
              f"{', ...' if len(brands) > 15 else ''}")
        test_brands = {r["target_brand"] for r in kept_rows if r["split"] == "test" and r["target_brand"]}
        trainval_only_brands = brands and (set(brands) - test_brands)
        if trainval_only_brands:
            print(f"  NOTE: {len(trainval_only_brands)} brands appear ONLY in trainval, never in test "
                  f"(test phishing samples may be labeled generically). This is fine for binary "
                  f"legitimate/phishing classification but means you can't evaluate brand-specific "
                  f"generalization on test.")


if __name__ == "__main__":
    main()
