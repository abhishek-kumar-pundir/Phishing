"""
text_io.py
Tiny shared helper: reads text files defensively against a leading UTF-8
byte-order-mark (BOM, the invisible \\ufeff character some tools -- Notepad,
PowerShell redirection, etc. -- prepend to "UTF-8" files) and against
non-UTF-8 encodings in general.

Without this, a label.txt containing "\\ufeffchase" and one containing
"chase" look like two different labels, and a url.txt containing
"\\ufeffhttp://..." breaks scheme detection in urlparse.
"""
from __future__ import annotations

from pathlib import Path


def read_text_stripped(path: str | Path) -> str:
    p = Path(path)
    try:
        text = p.read_text(encoding="utf-8-sig")  # utf-8-sig strips a leading BOM if present
    except UnicodeDecodeError:
        text = p.read_text(encoding="latin-1", errors="replace")
    except OSError:
        return ""
    return text.lstrip("\ufeff")  # belt-and-braces, in case of a double-encoded BOM
