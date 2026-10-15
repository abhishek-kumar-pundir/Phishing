"""
features_url.py
Classic lexical/statistical URL features used widely in phishing-URL
literature. No network calls -- everything is derived from the URL string
itself, so this is fast and safe to run on untrusted URLs.
"""
from __future__ import annotations

import math
import re
from urllib.parse import urlparse

SUSPICIOUS_KEYWORDS = [
    "login", "verify", "account", "update", "secure", "banking", "confirm",
    "signin", "password", "billing", "webscr", "ebayisapi", "paypal",
    "wallet", "reset", "unlock", "suspend", "invoice",
]

IP_RE = re.compile(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$")


def shannon_entropy(s: str) -> float:
    if not s:
        return 0.0
    probs = [s.count(c) / len(s) for c in set(s)]
    return -sum(p * math.log2(p) for p in probs)


def extract_url_features(url: str) -> dict:
    url = (url or "").strip()
    feats = {}

    feats["url_length"] = len(url)

    try:
        parsed = urlparse(url if "://" in url else "http://" + url)
    except ValueError:
        parsed = urlparse("")

    host = parsed.netloc.split("@")[-1].split(":")[0] if parsed.netloc else ""
    path = parsed.path or ""

    feats["host_length"] = len(host)
    feats["path_length"] = len(path)
    feats["num_dots"] = url.count(".")
    feats["num_hyphens"] = url.count("-")
    feats["num_underscores"] = url.count("_")
    feats["num_slashes"] = url.count("/")
    feats["num_question_marks"] = url.count("?")
    feats["num_equals"] = url.count("=")
    feats["num_at_symbols"] = url.count("@")
    feats["num_ampersands"] = url.count("&")
    feats["num_digits"] = sum(c.isdigit() for c in url)
    feats["digit_ratio"] = feats["num_digits"] / max(len(url), 1)
    feats["num_percent"] = url.count("%")
    feats["has_https"] = int(parsed.scheme.lower() == "https")
    feats["has_ip_host"] = int(bool(IP_RE.match(host)))
    feats["num_subdomains"] = max(host.count(".") - 1, 0) if host and not IP_RE.match(host) else 0
    feats["has_port"] = int(":" in parsed.netloc and not parsed.netloc.endswith(":"))
    feats["url_entropy"] = round(shannon_entropy(url), 4)
    feats["host_entropy"] = round(shannon_entropy(host), 4)
    lower_url = url.lower()
    feats["suspicious_keyword_count"] = sum(1 for kw in SUSPICIOUS_KEYWORDS if kw in lower_url)
    feats["has_suspicious_tld"] = int(any(host.endswith(tld) for tld in
                                           [".zip", ".xyz", ".top", ".tk", ".ml", ".ga", ".cf", ".gq"]))
    feats["double_slash_in_path"] = int("//" in path)
    feats["num_www"] = lower_url.count("www")

    return feats


URL_FEATURE_NAMES = list(extract_url_features("http://example.com/a?b=1").keys())
