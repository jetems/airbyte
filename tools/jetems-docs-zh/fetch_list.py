#!/usr/bin/env python3
"""List connector doc markdown files from airbytehq/airbyte on GitHub."""

from __future__ import annotations

import argparse
import json
import urllib.request

GITHUB_API = "https://api.github.com/repos/airbytehq/airbyte/contents/docs/integrations"


def list_md(kind: str) -> list[str]:
    url = f"{GITHUB_API}/{kind}?ref=master"
    req = urllib.request.Request(url, headers={"Accept": "application/vnd.github+json", "User-Agent": "jetems-docs-zh"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.load(resp)
    if not isinstance(data, list):
        raise SystemExit(f"unexpected response: {data}")
    return sorted(item["name"] for item in data if item.get("name", "").endswith(".md"))


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--kind",
        choices=("sources", "destinations", "enterprise-connectors"),
        default="sources",
    )
    parser.add_argument("--json", action="store_true", help="print JSON array")
    args = parser.parse_args()
    names = list_md(args.kind)
    if args.json:
        print(json.dumps(names, ensure_ascii=False, indent=2))
    else:
        for n in names:
            print(f"{args.kind}/{n}")
        print(f"# total {len(names)}", file=__import__("sys").stderr)


if __name__ == "__main__":
    main()
