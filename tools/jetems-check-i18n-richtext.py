#!/usr/bin/env python3
"""
JETEMS: detect Chinese locale rich-text tag problems that break hyperlinks.

formatjs/react-intl rich text:
  - Message must contain unescaped tags: <a>…</a>, <lnk>…</lnk>, …
  - Escaped form '<'a'>'…'<'/a'>' renders as literal text, NOT as a link.

This script flags zh strings where EN uses unescaped rich-text tags but ZH
still escapes them (or omits them).

Usage:
  python3 tools/jetems-check-i18n-richtext.py
  # exit 0 = clean, exit 1 = problems found
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EN = ROOT / "airbyte-webapp/src/locales/en.json"
ZH = ROOT / "airbyte-webapp/src/locales/zh.json"

# Literal angle-bracket placeholders (not rich text), e.g. "'<destination schema>"
LITERAL_PLACEHOLDER = re.compile(r"^'?<[^>]+>?$")

# formatjs escape for a tag: '<'a'>' or '<'/a'>' or '<'a href=...'>'
ESCAPED_TAG = re.compile(r"'<'(/?)([A-Za-z][A-Za-z0-9]*)([^']*)'>'")
# unescaped opening tag
OPEN_TAG = re.compile(r"<(?!/)([A-Za-z][A-Za-z0-9]*)(?:\s[^>]*)?>")


def tags_unescaped(s: str) -> set[str]:
    return set(OPEN_TAG.findall(s))


def tags_escaped(s: str) -> set[str]:
    return {m.group(2) for m in ESCAPED_TAG.finditer(s)}


def main() -> int:
    en = json.loads(EN.read_text())
    zh = json.loads(ZH.read_text())

    escaped_when_en_rich: list[tuple[str, set[str], str, str]] = []
    missing_tags: list[tuple[str, set[str], str, str]] = []
    any_escape_left: list[tuple[str, str]] = []

    for key, en_val in en.items():
        if not isinstance(en_val, str):
            continue
        zh_val = zh.get(key)
        if not isinstance(zh_val, str):
            continue

        # intentional literal placeholders like "'<no name>'" / "'<destination schema>"
        if (
            LITERAL_PLACEHOLDER.match(en_val.strip())
            or LITERAL_PLACEHOLDER.match(zh_val.strip())
            or en_val.strip().startswith("'<")
        ):
            continue

        en_tags = tags_unescaped(en_val)
        en_esc = tags_escaped(en_val)
        if not en_tags and not en_esc:
            continue

        # EN also escapes the same tags → literal angle brackets (e.g. `'<'token'>'`), not rich text
        zh_esc = tags_escaped(zh_val)
        zh_raw = tags_unescaped(zh_val)

        # Broken: EN uses unescaped rich-text tag, ZH still escapes it
        broken_tags = (zh_esc & en_tags) - en_esc
        if broken_tags:
            escaped_when_en_rich.append((key, broken_tags, zh_val, en_val))

        # ZH omitted tags that EN uses as rich text (unescaped in EN)
        missing = en_tags - zh_raw - zh_esc
        if missing:
            missing_tags.append((key, missing, zh_val, en_val))

    # Only flag remaining escapes on link-like tags (a/lnk/link/docLink/…) —
    # placeholders like `'<'token'>'` are intentional literals.
    LINKISH = {"a", "lnk", "link", "docLink", "docsLink", "privacy", "terms", "creditsLink"}
    for key, zh_val in zh.items():
        if not isinstance(zh_val, str):
            continue
        esc_linkish = {t for t in tags_escaped(zh_val) if t in LINKISH or t.endswith("Link") or t.endswith("link")}
        if not esc_linkish:
            continue
        en_val = en.get(key, "") if isinstance(en.get(key), str) else ""
        en_raw_linkish = tags_unescaped(en_val) & esc_linkish
        if en_raw_linkish:
            any_escape_left.append((key, zh_val[:160]))

    print("=== JETEMS i18n rich-text check ===")
    print(f"zh escaped while en uses rich-text tags: {len(escaped_when_en_rich)}")
    for key, tags, zv, ev in escaped_when_en_rich:
        print(f"  FAIL {key} tags={sorted(tags)}")
        print(f"    zh: {zv[:120]}")
        print(f"    en: {ev[:120]}")

    print(f"zh missing tags present in en: {len(missing_tags)}")
    for key, tags, zv, ev in missing_tags:
        print(f"  WARN {key} missing={sorted(tags)}")
        print(f"    zh: {zv[:120]}")
        print(f"    en: {ev[:120]}")

    print(f"zh still contains formatjs escapes: {len(any_escape_left)}")
    for key, zv in any_escape_left[:20]:
        print(f"  INFO {key}: {zv}")

    # Hard failures: escaped rich text (broken links)
    if escaped_when_en_rich:
        print("\nRESULT: FAIL — fix escaped rich-text tags in zh.json")
        return 1

    print("\nRESULT: OK — no broken rich-text escapes")
    return 0


if __name__ == "__main__":
    sys.exit(main())
