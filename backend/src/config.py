"""
config.py -- shared paths and small helpers used across training scripts.
"""
from pathlib import Path

ARTIFACTS_DIR = Path("artifacts")
FEATURES_DIR = ARTIFACTS_DIR / "features"
PREDICTIONS_DIR = ARTIFACTS_DIR / "predictions"
METRICS_DIR = ARTIFACTS_DIR / "metrics"
MODELS_DIR = Path("models")

RANDOM_SEED = 42
VAL_SIZE = 0.15  # fraction of trainval held out as validation


def resolve_positive_label(labels) -> str:
    """Decides which label counts as the 'positive' (phishing) class for
    precision/recall/ROC-AUC reporting. Looks for an obvious phishing-ish
    label first; falls back to the label that isn't 'legitimate'; falls
    back to alphabetically last if neither heuristic fires."""
    labels = sorted(set(labels))
    for lab in labels:
        if "phish" in lab or "malicious" in lab or "fraud" in lab:
            return lab
    non_legit = [lab for lab in labels if "legit" not in lab]
    if len(non_legit) == 1:
        return non_legit[0]
    return labels[-1]


def ensure_dirs() -> None:
    for d in (PREDICTIONS_DIR, METRICS_DIR, MODELS_DIR):
        d.mkdir(parents=True, exist_ok=True)
