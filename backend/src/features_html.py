"""
features_html.py
Two things live here:
  1. extract_html_features(): structural/DOM features (form counts, hidden
     inputs, iframe usage, external-resource ratios, etc.) -- the classic
     "DOM modality" signal for phishing detection.
  2. extract_visible_text(): the human-readable text of the page, used
     separately to build TF-IDF features (the "text modality").
"""
from __future__ import annotations

from urllib.parse import urlparse

from bs4 import BeautifulSoup


def _domain(url: str) -> str:
    try:
        return urlparse(url if "://" in url else "http://" + url).netloc.split("@")[-1].split(":")[0].lower()
    except ValueError:
        return ""


def extract_html_features(html: str, page_url: str = "") -> dict:
    feats = {}
    if not html:
        return {k: 0 for k in HTML_FEATURE_NAMES}

    try:
        soup = BeautifulSoup(html, "lxml")
    except Exception:
        soup = BeautifulSoup(html, "html.parser")

    page_domain = _domain(page_url)

    forms = soup.find_all("form")
    inputs = soup.find_all("input")
    scripts = soup.find_all("script")
    links = soup.find_all("a", href=True)
    imgs = soup.find_all("img")
    iframes = soup.find_all("iframe")

    feats["num_forms"] = len(forms)
    feats["num_password_inputs"] = len(soup.find_all("input", {"type": "password"}))
    feats["num_hidden_inputs"] = len(soup.find_all("input", {"type": "hidden"}))
    feats["num_inputs_total"] = len(inputs)
    feats["num_iframes"] = len(iframes)
    feats["num_images"] = len(imgs)
    feats["num_scripts"] = len(scripts)

    external_scripts = 0
    for s in scripts:
        src = s.get("src")
        if src and _domain(src) and _domain(src) != page_domain:
            external_scripts += 1
    feats["external_script_ratio"] = external_scripts / max(len(scripts), 1)

    external_links = 0
    for a in links:
        href = a.get("href", "")
        if href.startswith("http") and _domain(href) != page_domain:
            external_links += 1
    feats["external_link_ratio"] = external_links / max(len(links), 1)
    feats["num_links"] = len(links)

    external_form_actions = 0
    for f in forms:
        action = f.get("action", "")
        if action.startswith("http") and _domain(action) != page_domain:
            external_form_actions += 1
    feats["num_external_form_actions"] = external_form_actions

    title = soup.title.get_text(strip=True) if soup.title else ""
    feats["title_length"] = len(title)
    feats["has_title"] = int(bool(title))

    feats["has_meta_refresh"] = int(bool(soup.find("meta", attrs={"http-equiv": lambda v: v and v.lower() == "refresh"})))
    feats["has_favicon"] = int(bool(soup.find("link", rel=lambda v: v and "icon" in " ".join(v).lower())))

    text = soup.get_text(separator=" ", strip=True)
    feats["visible_text_length"] = len(text)
    feats["html_length"] = len(html)
    feats["text_to_html_ratio"] = feats["visible_text_length"] / max(feats["html_length"], 1)

    return feats


def extract_visible_text(html: str) -> str:
    if not html:
        return ""
    try:
        soup = BeautifulSoup(html, "lxml")
    except Exception:
        soup = BeautifulSoup(html, "html.parser")
    for tag in soup(["script", "style"]):
        tag.decompose()
    return soup.get_text(separator=" ", strip=True)


HTML_FEATURE_NAMES = list(extract_html_features(
    "<html><head><title>t</title></head><body><form action='x'><input type='password'></form></body></html>",
    "http://example.com"
).keys())
