"""
safe_fetch.py
Fetches a URL's HTML with defenses against SSRF (server-side request
forgery): the classic risk of "the server will fetch whatever URL you give
it," which can be pointed at internal/cloud-metadata addresses.

This is still an inherently risky feature for a public-facing service.
It is OFF by default in the API (allow_fetch=False) -- turn it on only in
a trusted/internal deployment, and consider adding a network-level egress
proxy/allowlist in front of it for anything internet-facing.

Guardrails implemented here:
  - only http/https schemes
  - resolves the hostname and rejects private / loopback / link-local /
    reserved / multicast IP ranges (blocks localhost, 127.0.0.1, 169.254.x.x
    cloud metadata, 10.x/172.16.x/192.168.x internal ranges, etc.)
  - re-checks the destination IP on every redirect hop (redirects are the
    most common SSRF bypass -- a URL can look public but 302 to an
    internal address)
  - timeout + response size cap
  - simple content-type check
"""
from __future__ import annotations

import ipaddress
import socket
from dataclasses import dataclass
from urllib.parse import urlparse

import httpx

MAX_REDIRECTS = 5
TIMEOUT_SECONDS = 8.0
MAX_BYTES = 5 * 1024 * 1024  # 5 MB cap on fetched HTML
ALLOWED_SCHEMES = {"http", "https"}


class UnsafeUrlError(Exception):
    pass


@dataclass
class FetchResult:
    final_url: str
    html: str
    status_code: int


def _is_blocked_ip(ip_str: str) -> bool:
    ip = ipaddress.ip_address(ip_str)
    return (
        ip.is_private or ip.is_loopback or ip.is_link_local or
        ip.is_multicast or ip.is_reserved or ip.is_unspecified
    )


def _validate_host(url: str) -> None:
    parsed = urlparse(url)
    if parsed.scheme not in ALLOWED_SCHEMES:
        raise UnsafeUrlError(f"Scheme '{parsed.scheme}' not allowed")
    host = parsed.hostname
    if not host:
        raise UnsafeUrlError("URL has no hostname")
    try:
        infos = socket.getaddrinfo(host, None)
    except socket.gaierror as e:
        raise UnsafeUrlError(f"Could not resolve host: {e}") from e
    for family, _, _, _, sockaddr in infos:
        ip_str = sockaddr[0]
        if _is_blocked_ip(ip_str):
            raise UnsafeUrlError(f"Host resolves to a blocked address range ({ip_str})")


def safe_fetch_html(url: str) -> FetchResult:
    """Raises UnsafeUrlError if the URL (or any redirect hop) targets a
    disallowed address. Raises httpx exceptions on ordinary network errors."""
    _validate_host(url)

    with httpx.Client(follow_redirects=False, timeout=TIMEOUT_SECONDS,
                       headers={"User-Agent": "Phish360-ResearchBot/1.0"}) as client:
        current_url = url
        for _ in range(MAX_REDIRECTS + 1):
            resp = client.get(current_url)
            if resp.is_redirect:
                next_url = str(resp.next_request.url) if resp.next_request else resp.headers.get("location")
                if not next_url:
                    raise UnsafeUrlError("Redirect with no Location header")
                _validate_host(next_url)  # re-validate EVERY hop
                current_url = next_url
                continue

            content_type = resp.headers.get("content-type", "")
            if "text/html" not in content_type and "text" not in content_type and content_type != "":
                raise UnsafeUrlError(f"Refusing non-HTML content-type: {content_type}")

            content = resp.content[:MAX_BYTES]
            return FetchResult(final_url=str(resp.url), html=content.decode("utf-8", errors="replace"),
                                status_code=resp.status_code)

    raise UnsafeUrlError("Too many redirects")
