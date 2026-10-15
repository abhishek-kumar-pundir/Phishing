#!/usr/bin/env python3
"""
dataset_forensics.py
Audits the Phish360 dataset and produces:
  - artifacts/dataset_inventory.csv   (one row per sample)
  - artifacts/phish360_manifest.csv   (one row per file, flattened)
  - artifacts/dataset_report.json     (machine-readable summary)
  - artifacts/dataset_report.md       (human-readable summary)

Expected layout:
  datasets/phish360/<split>/<sample_id>/Label/label.txt
  datasets/phish360/<split>/<sample_id>/URL/url.txt
  datasets/phish360/<split>/<sample_id>/RAW-HTML/index.html
  datasets/phish360/<split>/<sample_id>/SCREEN-SHOT/screen_shoot.png

<sample_id> is expected to look like "L00001_legitimate" or similar
(an id prefix, then "_", then a label token). The label token is
also cross-checked against Label/label.txt when present.

Run from the folder that CONTAINS "datasets/", e.g.:
  C:\\Users\\Abhishek Kuma\\Desktop\\Phishing>  python dataset_forensics.py

Requires only the standard library. Pillow is used opportunistically
to validate screenshots (dimensions / truncation) if installed; the
script degrades gracefully if it isn't.
"""

from __future__ import annotations

import csv
import hashlib
import json
import sys
from collections import defaultdict, Counter
from dataclasses import dataclass, field, asdict
from datetime import datetime
from pathlib import Path
from typing import Optional

try:
    from PIL import Image  # type: ignore
    HAVE_PIL = True
except ImportError:
    HAVE_PIL = False

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

DATASET_ROOT = Path("datasets") / "phish360"
OUTPUT_DIR = Path("artifacts")
PROGRESS_EVERY = 250

MODALITY_DIRS = {
    "label": "Label",
    "url": "URL",
    "html": "RAW-HTML",
    "screenshot": "SCREEN-SHOT",
}
MODALITY_FILENAMES = {
    "label": "label.txt",
    "url": "url.txt",
    "html": "index.html",
    "screenshot": "screen_shoot.png",
}

HASH_CHUNK = 1024 * 1024  # 1 MB


# ---------------------------------------------------------------------------
# Data model
# ---------------------------------------------------------------------------

@dataclass
class SampleRecord:
    split: str
    sample_id: str
    folder_label: Optional[str] = None      # label parsed from folder name
    file_label: Optional[str] = None        # label read from label.txt
    label_agrees: Optional[bool] = None

    has_label: bool = False
    has_url: bool = False
    has_html: bool = False
    has_screenshot: bool = False

    label_bytes: int = 0
    url_bytes: int = 0
    html_bytes: int = 0
    screenshot_bytes: int = 0

    url_value: Optional[str] = None
    html_encoding_ok: bool = True
    html_error: Optional[str] = None
    screenshot_valid: Optional[bool] = None  # None if Pillow unavailable
    screenshot_error: Optional[str] = None

    html_md5: Optional[str] = None
    screenshot_md5: Optional[str] = None
    url_md5: Optional[str] = None

    is_complete: bool = False
    path: str = ""


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def md5_of_file(path: Path) -> Optional[str]:
    try:
        h = hashlib.md5()
        with path.open("rb") as f:
            for chunk in iter(lambda: f.read(HASH_CHUNK), b""):
                h.update(chunk)
        return h.hexdigest()
    except OSError:
        return None


def read_text_safely(path: Path) -> tuple[Optional[str], bool, Optional[str]]:
    """Returns (content, encoding_ok, error_message)."""
    try:
        return path.read_text(encoding="utf-8"), True, None
    except UnicodeDecodeError:
        try:
            return path.read_text(encoding="latin-1"), False, None
        except OSError as e:
            return None, False, str(e)
    except OSError as e:
        return None, False, str(e)


def parse_folder_label(sample_id: str) -> Optional[str]:
    """'L00001_legitimate' -> 'legitimate'. Splits on the FIRST underscore
    only, so ids with underscores in the label portion still work
    ('P00042_phishing_confirmed' -> 'phishing_confirmed')."""
    if "_" not in sample_id:
        return None
    return sample_id.split("_", 1)[1].strip().lower() or None


def discover_samples(dataset_root: Path) -> list[tuple[str, Path]]:
    """Returns list of (split_name, sample_dir_path)."""
    samples = []
    if not dataset_root.exists():
        return samples
    for split_dir in sorted(p for p in dataset_root.iterdir() if p.is_dir()):
        for sample_dir in sorted(p for p in split_dir.iterdir() if p.is_dir()):
            samples.append((split_dir.name, sample_dir))
    return samples


# ---------------------------------------------------------------------------
# Core processing
# ---------------------------------------------------------------------------

def process_sample(split: str, sample_dir: Path) -> SampleRecord:
    rec = SampleRecord(split=split, sample_id=sample_dir.name, path=str(sample_dir))
    rec.folder_label = parse_folder_label(sample_dir.name)

    # --- Label ---
    label_path = sample_dir / MODALITY_DIRS["label"] / MODALITY_FILENAMES["label"]
    if label_path.exists():
        rec.has_label = True
        rec.label_bytes = label_path.stat().st_size
        content, _, _ = read_text_safely(label_path)
        if content is not None:
            rec.file_label = content.strip().lower() or None

    if rec.folder_label is not None and rec.file_label is not None:
        rec.label_agrees = (rec.folder_label == rec.file_label)

    # --- URL ---
    url_path = sample_dir / MODALITY_DIRS["url"] / MODALITY_FILENAMES["url"]
    if url_path.exists():
        rec.has_url = True
        rec.url_bytes = url_path.stat().st_size
        content, _, _ = read_text_safely(url_path)
        rec.url_value = content.strip() if content else None
        rec.url_md5 = md5_of_file(url_path)

    # --- HTML ---
    html_path = sample_dir / MODALITY_DIRS["html"] / MODALITY_FILENAMES["html"]
    if html_path.exists():
        rec.has_html = True
        rec.html_bytes = html_path.stat().st_size
        _, encoding_ok, err = read_text_safely(html_path)
        rec.html_encoding_ok = encoding_ok
        rec.html_error = err
        rec.html_md5 = md5_of_file(html_path)

    # --- Screenshot ---
    shot_path = sample_dir / MODALITY_DIRS["screenshot"] / MODALITY_FILENAMES["screenshot"]
    if shot_path.exists():
        rec.has_screenshot = True
        rec.screenshot_bytes = shot_path.stat().st_size
        rec.screenshot_md5 = md5_of_file(shot_path)
        if HAVE_PIL:
            try:
                with Image.open(shot_path) as im:
                    im.verify()
                rec.screenshot_valid = True
            except Exception as e:  # noqa: BLE001 - want to catch any Pillow failure
                rec.screenshot_valid = False
                rec.screenshot_error = str(e)

    rec.is_complete = rec.has_label and rec.has_url and rec.has_html and rec.has_screenshot
    return rec


# ---------------------------------------------------------------------------
# Report writers
# ---------------------------------------------------------------------------

INVENTORY_FIELDS = [
    "split", "sample_id", "folder_label", "file_label", "label_agrees",
    "has_label", "has_url", "has_html", "has_screenshot", "is_complete",
    "label_bytes", "url_bytes", "html_bytes", "screenshot_bytes",
    "url_value", "html_encoding_ok", "html_error",
    "screenshot_valid", "screenshot_error",
    "html_md5", "screenshot_md5", "url_md5", "path",
]


def write_inventory_csv(records: list[SampleRecord], out_path: Path) -> None:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=INVENTORY_FIELDS)
        writer.writeheader()
        for rec in records:
            writer.writerow(asdict(rec))


def write_manifest_csv(records: list[SampleRecord], out_path: Path) -> None:
    """One row per physical file (flattened view), useful for spotting
    e.g. zero-byte files or size outliers at a glance."""
    out_path.parent.mkdir(parents=True, exist_ok=True)
    fields = ["split", "sample_id", "modality", "filename", "exists", "size_bytes", "md5"]
    with out_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        for rec in records:
            rows = [
                ("label", MODALITY_FILENAMES["label"], rec.has_label, rec.label_bytes, None),
                ("url", MODALITY_FILENAMES["url"], rec.has_url, rec.url_bytes, rec.url_md5),
                ("html", MODALITY_FILENAMES["html"], rec.has_html, rec.html_bytes, rec.html_md5),
                ("screenshot", MODALITY_FILENAMES["screenshot"], rec.has_screenshot,
                 rec.screenshot_bytes, rec.screenshot_md5),
            ]
            for modality, filename, exists, size_bytes, md5 in rows:
                writer.writerow({
                    "split": rec.split,
                    "sample_id": rec.sample_id,
                    "modality": modality,
                    "filename": filename,
                    "exists": exists,
                    "size_bytes": size_bytes,
                    "md5": md5,
                })


def find_duplicate_groups(records: list[SampleRecord], attr: str) -> list[dict]:
    """Groups samples sharing the same hash for a given attribute
    (e.g. 'html_md5'). Flags cross-split groups as leakage risks."""
    buckets: dict[str, list[SampleRecord]] = defaultdict(list)
    for rec in records:
        val = getattr(rec, attr)
        if val:
            buckets[val].append(rec)

    groups = []
    for digest, recs in buckets.items():
        if len(recs) < 2:
            continue
        splits_involved = sorted({r.split for r in recs})
        groups.append({
            "hash": digest,
            "count": len(recs),
            "splits_involved": splits_involved,
            "cross_split_leak": len(splits_involved) > 1,
            "sample_ids": [f"{r.split}/{r.sample_id}" for r in recs][:20],  # cap for readability
        })
    groups.sort(key=lambda g: (-g["cross_split_leak"], -g["count"]))
    return groups


def build_report(records: list[SampleRecord], errors: list[str]) -> dict:
    total = len(records)

    # NOTE: every dict below uses plain string keys only (this is what the
    # original script got wrong: it used tuple keys like (split, label) in a
    # Counter and then handed that straight to json.dumps, which only
    # accepts str/int/float/bool/None keys).
    by_split = Counter(r.split for r in records)
    by_label = Counter(r.folder_label or "UNKNOWN" for r in records)

    by_split_and_label: dict[str, dict[str, int]] = defaultdict(lambda: defaultdict(int))
    for r in records:
        by_split_and_label[r.split][r.folder_label or "UNKNOWN"] += 1
    by_split_and_label = {k: dict(v) for k, v in by_split_and_label.items()}

    incomplete = [r for r in records if not r.is_complete]
    label_mismatches = [r for r in records if r.label_agrees is False]
    zero_byte_html = [r for r in records if r.has_html and r.html_bytes == 0]
    zero_byte_shots = [r for r in records if r.has_screenshot and r.screenshot_bytes == 0]
    bad_encoding = [r for r in records if r.has_html and not r.html_encoding_ok]
    bad_screenshots = [r for r in records if r.screenshot_valid is False]

    def size_stats(values: list[int]) -> dict:
        if not values:
            return {"count": 0}
        values_sorted = sorted(values)
        n = len(values_sorted)
        return {
            "count": n,
            "min": values_sorted[0],
            "max": values_sorted[-1],
            "mean": round(sum(values_sorted) / n, 1),
            "median": values_sorted[n // 2],
        }

    html_dupes = find_duplicate_groups(records, "html_md5")
    shot_dupes = find_duplicate_groups(records, "screenshot_md5")
    url_dupes = find_duplicate_groups(records, "url_md5")

    report = {
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "dataset_root": str(DATASET_ROOT),
        "totals": {
            "samples_found": total,
            "complete_samples": total - len(incomplete),
            "incomplete_samples": len(incomplete),
        },
        "by_split": dict(by_split),
        "by_label": dict(by_label),
        "by_split_and_label": by_split_and_label,
        "integrity_issues": {
            "label_folder_vs_file_mismatches": len(label_mismatches),
            "zero_byte_html_files": len(zero_byte_html),
            "zero_byte_screenshots": len(zero_byte_shots),
            "html_encoding_not_utf8": len(bad_encoding),
            "corrupt_or_unreadable_screenshots": len(bad_screenshots) if HAVE_PIL else "PIL not installed - skipped",
        },
        "file_size_stats_bytes": {
            "html": size_stats([r.html_bytes for r in records if r.has_html]),
            "screenshot": size_stats([r.screenshot_bytes for r in records if r.has_screenshot]),
            "url": size_stats([r.url_bytes for r in records if r.has_url]),
        },
        "duplicate_groups": {
            "html_duplicate_groups": len(html_dupes),
            "html_cross_split_leaks": sum(1 for g in html_dupes if g["cross_split_leak"]),
            "screenshot_duplicate_groups": len(shot_dupes),
            "screenshot_cross_split_leaks": sum(1 for g in shot_dupes if g["cross_split_leak"]),
            "url_duplicate_groups": len(url_dupes),
            "url_cross_split_leaks": sum(1 for g in url_dupes if g["cross_split_leak"]),
        },
        "duplicate_group_details": {
            "html_top_20": html_dupes[:20],
            "screenshot_top_20": shot_dupes[:20],
            "url_top_20": url_dupes[:20],
        },
        "incomplete_sample_ids": [f"{r.split}/{r.sample_id}" for r in incomplete][:100],
        "label_mismatch_sample_ids": [f"{r.split}/{r.sample_id}" for r in label_mismatches][:100],
        "processing_errors": errors[:100],
    }
    return report


def render_markdown(report: dict) -> str:
    lines = []
    lines.append(f"# Phish360 Dataset Forensics Report")
    lines.append(f"Generated: {report['generated_at']}")
    lines.append("")
    t = report["totals"]
    lines.append("## Totals")
    lines.append(f"- Samples found: **{t['samples_found']}**")
    lines.append(f"- Complete (all 4 modalities present): **{t['complete_samples']}**")
    lines.append(f"- Incomplete: **{t['incomplete_samples']}**")
    lines.append("")
    lines.append("## By split")
    for split, n in report["by_split"].items():
        lines.append(f"- {split}: {n}")
    lines.append("")
    lines.append("## By label")
    for label, n in report["by_label"].items():
        lines.append(f"- {label}: {n}")
    lines.append("")
    lines.append("## By split x label")
    for split, labels in report["by_split_and_label"].items():
        lines.append(f"- **{split}**: " + ", ".join(f"{k}={v}" for k, v in labels.items()))
    lines.append("")
    lines.append("## Integrity issues")
    for k, v in report["integrity_issues"].items():
        lines.append(f"- {k}: {v}")
    lines.append("")
    lines.append("## File size stats (bytes)")
    for modality, stats in report["file_size_stats_bytes"].items():
        lines.append(f"- **{modality}**: {stats}")
    lines.append("")
    lines.append("## Duplicate / leakage summary")
    for k, v in report["duplicate_groups"].items():
        lines.append(f"- {k}: {v}")
    lines.append("")
    lines.append("_See dataset_report.json for full duplicate group listings, "
                  "incomplete sample IDs, and label-mismatch sample IDs._")
    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> int:
    print(f"Dataset: {DATASET_ROOT.resolve()}")

    print("[1/4] Discovering samples...")
    samples = discover_samples(DATASET_ROOT)
    print(f"      Sample directories found: {len(samples):,}")

    if not samples:
        print(f"ERROR: no sample directories found under {DATASET_ROOT.resolve()}")
        print("Check that you're running this from the folder that CONTAINS 'datasets/'.")
        return 1

    print("[2/4] Processing samples...")
    records: list[SampleRecord] = []
    errors: list[str] = []
    for i, (split, sample_dir) in enumerate(samples, start=1):
        try:
            records.append(process_sample(split, sample_dir))
        except Exception as e:  # noqa: BLE001 - never let one bad sample kill the run
            errors.append(f"{split}/{sample_dir.name}: {e}")
        if i % PROGRESS_EVERY == 0 or i == len(samples):
            print(f"      Processed {i:,}/{len(samples):,}")

    print("[3/4] Building report...")
    report = build_report(records, errors)

    print("[4/4] Writing outputs...")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    write_inventory_csv(records, OUTPUT_DIR / "dataset_inventory.csv")
    write_manifest_csv(records, OUTPUT_DIR / "phish360_manifest.csv")
    with (OUTPUT_DIR / "dataset_report.json").open("w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, default=str)
    with (OUTPUT_DIR / "dataset_report.md").open("w", encoding="utf-8") as f:
        f.write(render_markdown(report))

    print("")
    print("Done. Wrote:")
    print(f"  {OUTPUT_DIR / 'dataset_inventory.csv'}")
    print(f"  {OUTPUT_DIR / 'phish360_manifest.csv'}")
    print(f"  {OUTPUT_DIR / 'dataset_report.json'}")
    print(f"  {OUTPUT_DIR / 'dataset_report.md'}")
    if errors:
        print(f"\n{len(errors)} samples raised errors during processing (see processing_errors in the JSON report).")
    if not HAVE_PIL:
        print("\nNote: Pillow not installed, so screenshots were hashed/size-checked but not "
              "opened/validated for corruption. Install with: pip install Pillow")
    return 0


if __name__ == "__main__":
    sys.exit(main())