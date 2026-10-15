"""
ablation.py
Runs the fusion model with the full modality set, then once per modality
with that modality excluded, and writes a comparison table so you can see
how much each modality actually contributes.

Requires all four modalities already trained (train_modality.py) since it
reuses their saved validation/test predictions.

Run:
    python -m src.ablation
"""
from __future__ import annotations

import csv

from .config import METRICS_DIR
from .train_fusion import ALL_MODALITIES, run_fusion


def main() -> None:
    results = [run_fusion(ALL_MODALITIES, "full")]
    for excluded in ALL_MODALITIES:
        modalities = [m for m in ALL_MODALITIES if m != excluded]
        tag = f"minus_{excluded}"
        results.append(run_fusion(modalities, tag))

    out_path = METRICS_DIR / "ablation_summary.csv"
    with out_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["config", "modalities", "test_accuracy", "test_precision",
                          "test_recall", "test_f1", "test_roc_auc"])
        for r in results:
            t = r["test"]
            writer.writerow([r["tag"], "+".join(r["modalities"]), t["accuracy"],
                              t["precision"], t["recall"], t["f1"], t["roc_auc"]])
    print(f"\nAblation summary written to {out_path}")
    print("(config 'minus_X' shows performance WITHOUT modality X -- a big drop vs "
          "'full' means X was contributing a lot; little/no drop means X may be redundant.)")


if __name__ == "__main__":
    main()
