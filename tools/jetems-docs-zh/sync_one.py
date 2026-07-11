#!/usr/bin/env python3
"""Download one English connector doc into a working tree for translation."""

from __future__ import annotations

import argparse
import pathlib
import urllib.request

RAW = "https://raw.githubusercontent.com/airbytehq/airbyte/master/docs/integrations"
REPO_ROOT = pathlib.Path(__file__).resolve().parents[2]
DEFAULT_OUT = REPO_ROOT / "airbyte-commons-server/src/main/resources/docs-zh/integrations"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("path", help="e.g. sources/airtable.md or sources/airtable")
    parser.add_argument(
        "--out-dir",
        type=pathlib.Path,
        default=DEFAULT_OUT,
        help="docs-zh/integrations root (default: server resources)",
    )
    parser.add_argument(
        "--en-only",
        action="store_true",
        help="write as .en.md alongside for reference (does not overwrite .md)",
    )
    args = parser.parse_args()
    rel = args.path.removesuffix(".md") + ".md"
    url = f"{RAW}/{rel}"
    dest_dir = args.out_dir / pathlib.Path(rel).parent
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / (pathlib.Path(rel).name + (".en.md" if args.en_only else ""))
    if not args.en_only and dest.exists():
        print(f"skip existing {dest} (use --en-only for English reference copy)")
        return
    print(f"GET {url}")
    with urllib.request.urlopen(url, timeout=60) as resp:
        body = resp.read()
    dest.write_bytes(body)
    print(f"wrote {dest} ({len(body)} bytes)")


if __name__ == "__main__":
    main()
