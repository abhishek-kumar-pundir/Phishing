"""
backend/scripts/collect_extension_captures.py
Step 3: Collect and evaluate real extension-captured screenshots from safe, known-legitimate pages.

SAFETY INSTRUCTION:
Do NOT open or test live phishing sites in your browser. This tool is strictly designed
to capture and benchmark safe, verified legitimate websites to check whether the
live Chrome extension captures match the vision and fusion model expectations.

Instructions:
1. Open Google Chrome.
2. Go to chrome://extensions, enable "Developer mode", and click "Load unpacked".
3. Select the "extension/" directory from this project root.
4. Open any safe legitimate website, for example:
   - https://en.wikipedia.org/wiki/Phishing
   - https://github.com
   - https://www.python.org
   - https://www.google.com
   - https://stackoverflow.com
5. Click the Phish360 extension icon and run a scan (or save the tab screenshot).
6. To run a safe automated capture of these public safe domains via Playwright:
   Run: python scripts/collect_extension_captures.py --sample-safe
   This renders genuine live safe sites at your exact window size with online assets,
   and computes vision and fusion scores to verify live calibration.
"""
from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path

sys.path.insert(0, ".")
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import joblib
import numpy as np

CAPTURES_DIR = Path("artifacts/real_extension_captures")
CAPTURES_DIR.mkdir(parents=True, exist_ok=True)
MODELS_DIR = Path("models")

SAFE_SEEDS = [
    {"name": "wikipedia", "url": "https://en.wikipedia.org/wiki/Computer_security", "label": "legitimate"},
    {"name": "github", "url": "https://github.com", "label": "legitimate"},
    {"name": "python_org", "url": "https://www.python.org", "label": "legitimate"},
    {"name": "mozilla", "url": "https://www.mozilla.org", "label": "legitimate"},
    {"name": "stack_overflow", "url": "https://stackoverflow.com", "label": "legitimate"},
]


def register_manual_capture(
    image_path: str,
    url: str,
    label: str = "legitimate",
    notes: str = "Manual capture via Chrome extension captureVisibleTab",
) -> dict:
    """Registers an image file exported from the Chrome extension into the evaluation catalog."""
    from src.features_vision import extract_vision_features
    from src.features_url import extract_url_features

    src_p = Path(image_path)
    if not src_p.exists():
        raise FileNotFoundError(f"Screenshot file {image_path} not found.")

    dest_p = CAPTURES_DIR / src_p.name
    if dest_p.resolve() != src_p.resolve():
        dest_p.write_bytes(src_p.read_bytes())

    # Score with vision model
    v_model = joblib.load(MODELS_DIR / "vision_model.joblib")
    if hasattr(v_model["model"], "n_jobs"):
        v_model["model"].n_jobs = 1
    pos_idx = list(v_model["model"].classes_).index(v_model["positive_label"])

    emb = extract_vision_features(str(dest_p)).reshape(1, -1)
    vision_score = float(v_model["model"].predict_proba(emb)[0, pos_idx])

    entry = {
        "url": url,
        "label": label,
        "file": str(dest_p.name),
        "vision_score": round(vision_score, 4),
        "notes": notes,
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }

    catalog_file = CAPTURES_DIR / "captures_catalog.json"
    catalog = []
    if catalog_file.exists():
        try:
            with catalog_file.open("r", encoding="utf-8") as f:
                catalog = json.load(f)
        except Exception:
            catalog = []

    catalog.append(entry)
    with catalog_file.open("w", encoding="utf-8") as f:
        json.dump(catalog, f, indent=2)

    print(f"Registered capture for {url}: vision phishing probability = {vision_score:.4f}")
    return entry


def capture_safe_live_pages(viewport_width: int = 1280, viewport_height: int = 720) -> list[dict]:
    """Automates capturing the list of safe, verified legitimate websites with online assets loaded."""
    from playwright.sync_api import sync_playwright

    print(f"Capturing {len(SAFE_SEEDS)} safe public sites with live assets at {viewport_width}x{viewport_height}...")
    results = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": viewport_width, "height": viewport_height})

        for s in SAFE_SEEDS:
            name = s["name"]
            url = s["url"]
            print(f"   Navigating to {url}...")
            try:
                page.goto(url, timeout=15000, wait_until="domcontentloaded")
                # Wait briefly for layout settle
                page.wait_for_timeout(1000)
                out_path = CAPTURES_DIR / f"{name}_live.png"
                page.screenshot(path=str(out_path), full_page=False)
                entry = register_manual_capture(
                    image_path=str(out_path),
                    url=url,
                    label=s["label"],
                    notes="Live online render via Playwright approximating clean Chrome viewport",
                )
                results.append(entry)
            except Exception as e:
                print(f"   Warning: could not capture {url}: {e}")

        browser.close()

    print(f"Completed safe site collection: {len(results)} pages captured.")
    return results


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Collect and benchmark extension-style captures.")
    parser.add_argument("--sample-safe", action="store_true", help="Capture live safe benchmark sites")
    parser.add_argument("--register", type=str, help="Path to a screenshot captured from the Chrome extension")
    parser.add_argument("--url", type=str, default="https://example.com", help="URL of the captured page")
    parser.add_argument("--label", type=str, default="legitimate", help="Ground truth label (default: legitimate)")

    args = parser.parse_args()
    if args.sample_safe:
        capture_safe_live_pages()
    elif args.register:
        register_manual_capture(args.register, args.url, args.label)
    else:
        parser.print_help()

