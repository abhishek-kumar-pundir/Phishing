# Phish360 Multimodal Phishing Detector

A working baseline pipeline: 4 modality models (URL, HTML/DOM, page text,
screenshot) → late-fusion meta-classifier → ablation study → inference API.

This is a **solid, honest v1 baseline** built on classical ML (Random
Forests / Logistic Regression), not a state-of-the-art deep-learning
system. That's a deliberate choice: it runs on a laptop CPU, has no
flaky training dynamics, and every number it reports is real and
reproducible. Treat it as the foundation to build on (e.g. swap the URL
model for a char-CNN, fine-tune a real vision transformer, etc.) once
this baseline is working end-to-end on your real data.

Everything in here has been tested end-to-end on a synthetic dataset that
mimics your real folder structure (see `tests/make_synthetic_dataset.py`)
-- the code runs and produces valid metrics/predictions. It has **not**
been run against your actual 10,748-sample dataset, since I don't have
access to it. Run it and send me the output if anything errors or the
numbers look off.

## 1. Setup

```
cd Phishing                      # the folder that already contains datasets/
pip install -r requirements.txt
```

Copy these files into that folder, preserving structure:
```
Phishing/
  datasets/phish360/...          <- already exists
  src/                           <- from this delivery
  api/                           <- from this delivery
  tests/                         <- from this delivery
  requirements.txt
  README.md (this file)
```

For real vision features (recommended -- see note in `src/features_vision.py`):
```
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
```
Without torch, vision features fall back to a much weaker hand-built
color-histogram descriptor so the pipeline still runs, but that modality
will not perform nearly as well.

## 2. Run order

```
python -m src.preprocessing        # scans datasets/, dedupes cross-split leaks
python -m src.dataset_builder      # builds URL/HTML/text/vision feature tables
python -m src.train_modality --modality url
python -m src.train_modality --modality html
python -m src.train_modality --modality text
python -m src.train_modality --modality vision
python -m src.train_fusion         # combines all 4 into one fused model
python -m src.ablation             # drops each modality in turn, compares
```

Each step prints progress and writes to `artifacts/` and `models/`.
`artifacts/metrics/ablation_summary.csv` is the one table you want for
your report -- it directly shows how much each modality is contributing.

## 3. Run the API

```
uvicorn api.app:app --reload --port 8000
```

```
curl -X POST http://localhost:8000/predict \
     -F "url=http://example.com/login" \
     -F "html=<html>...</html>" \
     -F "screenshot=@page.png"
```

`html` and `screenshot` are both optional -- the API automatically falls
back to whichever fusion model matches the modalities you actually
provided (or a plain average if that exact combination wasn't
pre-trained). By default the API will **not** fetch a URL's HTML itself
(`allow_fetch=false`) -- you supply the HTML. Setting `allow_fetch=true`
turns on `api/safe_fetch.py`, which fetches the URL server-side with SSRF
guardrails (blocks localhost/private/link-local IPs, re-checks every
redirect hop, caps size and timeout). Read the docstring at the top of
that file before exposing this on the open internet -- it's meant for a
trusted/internal deployment, not a public endpoint, without further
hardening (rate limiting, auth, egress allowlisting).

## 4. What each modality model actually looks at

- **URL** (`src/features_url.py`): lexical/statistical features only --
  length, entropy, digit ratio, suspicious keywords, IP-as-host, etc.
  No network calls.
- **HTML/DOM** (`src/features_html.py`): structural features -- form
  counts, password/hidden inputs, iframe count, external
  script/link/form-action ratios, meta-refresh, title.
- **Text** (`src/train_modality.py:train_text_modality`): TF-IDF
  (1-2 grams) over the page's visible text, fit only on the training
  split.
- **Vision** (`src/features_vision.py`): frozen pretrained ResNet18
  embedding of the screenshot (or the histogram fallback described
  above).

## 5. Known limitations / what to check first on your real data

- **Leakage dedup is conservative by design**: `preprocessing.py` drops
  any `trainval` sample whose HTML is byte-identical to a `test` sample.
  Read the printed drop count -- if it's large, your dataset may have a
  lot of duplicate pages, which you should know about regardless.
- **Positive-label auto-detection** (`src/config.py:resolve_positive_label`)
  assumes your labels are something like `legitimate` / `phishing`. If
  your real label strings differ, check the printed
  "Positive label resolved as: ..." line the first time you train each
  modality and fix `config.py` if it picked the wrong one.
- **Class balance**: this baseline uses `class_weight="balanced"` for the
  tree models, which helps but isn't a substitute for knowing your real
  legitimate/phishing ratio. Check `artifacts/master_index.csv` after
  running `preprocessing.py`.
- **Vision fallback**: if you skip installing torch, don't trust the
  vision numbers as representative of what a real CNN would achieve --
  install torch for anything you plan to report.
