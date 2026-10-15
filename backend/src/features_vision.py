"""
features_vision.py
Extracts a fixed-length embedding from each screenshot.

Preferred path: a pretrained ResNet18 (ImageNet weights) used purely as a
frozen feature extractor -- no fine-tuning, no GPU required (runs fine on
CPU, just slower). This gives a 512-dim embedding per screenshot.

Fallback path (if torch/torchvision aren't installed): a cheap hand-built
feature vector from color histograms + basic image stats. This is NOT as
strong as a CNN embedding -- it exists so the pipeline still runs end to
end on a machine without torch installed. Install torch + torchvision
for real results:
    pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
"""
from __future__ import annotations

import numpy as np
from PIL import Image

try:
    import torch
    import torchvision.transforms as T
    from torchvision.models import resnet18, ResNet18_Weights
    HAVE_TORCH = True
except ImportError:
    HAVE_TORCH = False

VISION_EMBEDDING_DIM_TORCH = 512
VISION_EMBEDDING_DIM_FALLBACK = 32 + 3  # histogram bins + basic stats

_model = None
_transform = None


def _lazy_load_model():
    global _model, _transform
    if _model is None:
        weights = ResNet18_Weights.IMAGENET1K_V1
        _model = resnet18(weights=weights)
        _model.fc = torch.nn.Identity()  # strip classifier head -> 512-dim embedding
        _model.eval()
        _transform = weights.transforms()
    return _model, _transform


def _extract_torch(image_path: str) -> np.ndarray:
    model, transform = _lazy_load_model()
    img = Image.open(image_path).convert("RGB")
    x = transform(img).unsqueeze(0)
    with torch.no_grad():
        emb = model(x).squeeze(0).numpy()
    return emb.astype(np.float32)


def _extract_fallback(image_path: str) -> np.ndarray:
    img = Image.open(image_path).convert("RGB").resize((128, 128))
    arr = np.asarray(img).astype(np.float32) / 255.0

    hist_feats = []
    for channel in range(3):
        hist, _ = np.histogram(arr[:, :, channel], bins=8, range=(0, 1))
        hist_feats.extend((hist / hist.sum()).tolist())  # 24 features

    brightness = arr.mean()
    contrast = arr.std()
    edges = np.abs(np.diff(arr.mean(axis=2), axis=0)).mean() + np.abs(np.diff(arr.mean(axis=2), axis=1)).mean()

    feats = np.array(hist_feats + [brightness, contrast, edges], dtype=np.float32)
    # pad/truncate to a fixed length in case bin math changes later
    target_len = VISION_EMBEDDING_DIM_FALLBACK
    if len(feats) < target_len:
        feats = np.pad(feats, (0, target_len - len(feats)))
    return feats[:target_len]


def extract_vision_features(image_path: str) -> np.ndarray:
    """Returns a fixed-length float32 embedding. Raises if the image can't
    be opened at all (caller should catch and treat the sample as corrupt)."""
    if HAVE_TORCH:
        return _extract_torch(image_path)
    return _extract_fallback(image_path)


def vision_embedding_dim() -> int:
    return VISION_EMBEDDING_DIM_TORCH if HAVE_TORCH else VISION_EMBEDDING_DIM_FALLBACK
