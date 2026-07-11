#!/usr/bin/env python3
"""
Batch-translate Airbyte connector docs EN → ZH for jetems docs-zh.

- Protects fenced code, inline code, HTML tags (FieldAnchor, HideInUI, env markers), URLs, image paths
- Translator: Google via deep-translator (default), or OpenAI-compatible if OPENAI_API_KEY/XAI_API_KEY set
- Writes to airbyte-commons-server/src/main/resources/docs-zh/integrations/
- Updates docs-zh/manifest.json

Usage:
  python3 tools/jetems-docs-zh/translate_batch.py --top
  python3 tools/jetems-docs-zh/translate_batch.py --all          # full catalog from GitHub
  python3 tools/jetems-docs-zh/translate_batch.py --path sources/airtable
  python3 tools/jetems-docs-zh/translate_batch.py --top --force
  python3 tools/jetems-docs-zh/translate_batch.py --top --engine openai
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import pathlib
import re
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from typing import Callable

try:
    import yaml
except ImportError:
    yaml = None  # type: ignore

REPO_ROOT = pathlib.Path(__file__).resolve().parents[2]
DEFAULT_OUT = REPO_ROOT / "airbyte-commons-server/src/main/resources/docs-zh"
RAW_BASE = "https://raw.githubusercontent.com/airbytehq/airbyte/master/docs/integrations"
TOP_YAML = pathlib.Path(__file__).resolve().parent / "top_connectors.yaml"

# ASCII placeholders — less likely to be mangled by free MT than unicode brackets
PH_PREFIX = "@@JETEMS_"
PH_SUFFIX = "@@"

HEADER_NOTE = (
    "\n\n> 本文档由 jetems 自动翻译自官方英文设置指南，技术术语与命令请以英文原文为准。"
    "若与产品界面不一致，以当前版本 UI 为准。\n"
)

# Product / brand names that free MT often mistranslates — protect before translate.
PROTECT_TERMS = [
    "Airbyte Cloud",
    "Airbyte Open Source",
    "Airbyte",
    "Personal Access Token",
    "OAuth2.0",
    "OAuth 2.0",
    "OAuth",
    "Full Refresh",
    "Incremental Sync",
    "CDC",
    "PostgreSQL",
    "Postgres",
    "MySQL",
    "MongoDB",
    "Elasticsearch",
    "BigQuery",
    "Snowflake",
    "Redshift",
    "Databricks",
    "ClickHouse",
    "Kafka",
    "Asana",
    "Salesforce",
    "HubSpot",
    "Shopify",
    "Zendesk",
    "Stripe",
    "GitHub",
    "GitLab",
    "Jira",
    "Slack",
    "Twilio",
    "Mailchimp",
    "Intercom",
    "Notion",
    "Airtable",
    "Google Ads",
    "Google Sheets",
    "Google Analytics",
    "Facebook Marketing",
    "LinkedIn Ads",
    "Amazon Ads",
    "Microsoft SQL Server",
    "MSSQL",
    "Oracle",
    "S3",
    "GCS",
    "Weaviate",
    "Pinecone",
    "MotherDuck",
    "DuckDB",
    "Firebolt",
    "Typeform",
    "Mixpanel",
    "Harvest",
    "Chargebee",
    "JSON",
    "AVRO",
    "Avro",
    "Parquet",
    "Protobuf",
]

# Fix residual MT mistakes if protect failed
POST_FIXES = [
    (re.compile(r"体式"), "Asana"),
    (re.compile(r"卡夫卡"), "Kafka"),
    (re.compile(r"爱字节"), "Airbyte"),
    (re.compile(r"气字节"), "Airbyte"),
    (re.compile(r"雪花\b"), "Snowflake"),
    (re.compile(r"红移\b"), "Redshift"),
    (re.compile(r"大查询"), "BigQuery"),
]


def load_top_list() -> list[str]:
    text = TOP_YAML.read_text(encoding="utf-8")
    if yaml:
        data = yaml.safe_load(text)
        paths = [f"sources/{n}" for n in data.get("sources", [])]
        paths += [f"destinations/{n}" for n in data.get("destinations", [])]
        return paths
    # minimal fallback without PyYAML
    paths: list[str] = []
    section = None
    for line in text.splitlines():
        if line.startswith("sources:"):
            section = "sources"
        elif line.startswith("destinations:"):
            section = "destinations"
        elif line.strip().startswith("- ") and section:
            name = line.strip()[2:].strip()
            paths.append(f"{section}/{name}")
    return paths


GITHUB_API = "https://api.github.com/repos/airbytehq/airbyte/contents/docs/integrations"
SKIP_NAME_SUFFIXES = ("-migrations.md", "README.md")


def list_github_kind(kind: str) -> list[str]:
    """List docs/integrations/{kind}/*.md relative paths (kind/name without .md)."""
    url = f"{GITHUB_API}/{kind}?ref=master"
    req = urllib.request.Request(url, headers={"Accept": "application/vnd.github+json", "User-Agent": "jetems-docs-zh"})
    with urllib.request.urlopen(req, timeout=90) as resp:
        data = json.load(resp)
    if not isinstance(data, list):
        raise RuntimeError(f"unexpected GitHub API response for {kind}: {data}")
    paths: list[str] = []
    for item in data:
        name = item.get("name") or ""
        if not name.endswith(".md"):
            continue
        if name in SKIP_NAME_SUFFIXES or name.endswith(SKIP_NAME_SUFFIXES):
            continue
        if name.lower() == "readme.md":
            continue
        paths.append(f"{kind}/{name[:-3]}")
    return sorted(paths)


def load_all_list() -> list[str]:
    """Full catalog: sources + destinations + enterprise-connectors (excl. migrations)."""
    paths: list[str] = []
    for kind in ("sources", "destinations", "enterprise-connectors"):
        try:
            kind_paths = list_github_kind(kind)
            print(f"  listed {kind}: {len(kind_paths)}", file=sys.stderr)
            paths.extend(kind_paths)
        except Exception as e:
            print(f"  WARN list {kind}: {e}", file=sys.stderr)
    return paths


def sha256_text(s: str) -> str:
    return hashlib.sha256(s.encode("utf-8")).hexdigest()[:16]


def fetch_en(rel_path: str) -> str | None:
    """rel_path like sources/postgres (no .md)."""
    url = f"{RAW_BASE}/{rel_path}.md"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "jetems-docs-zh"})
        with urllib.request.urlopen(req, timeout=60) as resp:
            body = resp.read().decode("utf-8", errors="replace")
        if body.startswith("404") or "<!DOCTYPE html>" in body[:200]:
            return None
        if not body.strip():
            return None
        return body
    except urllib.error.HTTPError as e:
        print(f"  HTTP {e.code} for {url}", file=sys.stderr)
        return None
    except Exception as e:
        print(f"  fetch error {url}: {e}", file=sys.stderr)
        return None


_PROTECT_PATTERNS = [
    # fenced code blocks
    re.compile(r"```[\s\S]*?```", re.MULTILINE),
    # HTML comments (env markers)
    re.compile(r"<!--[\s\S]*?-->"),
    # HTML tags with optional content for known wrappers (non-greedy inner for simple tags)
    re.compile(r"</?(?:FieldAnchor|HideInUI|Tabs|TabItem|details|summary)[^>]*>", re.IGNORECASE),
    # self-closing / full simple HTML lines
    re.compile(r"<[^>]+>"),
    # images ![alt](url)
    re.compile(r"!\[[^\]]*\]\([^)]+\)"),
    # markdown links keep URL: [text](url) → protect whole, retranslate text later if needed
    re.compile(r"\[[^\]]*\]\([^)]+\)"),
    # inline code
    re.compile(r"`[^`]+`"),
    # bare URLs
    re.compile(r"https?://[^\s)>\]]+"),
    # MDX imports
    re.compile(r"^import\s+.+$", re.MULTILINE),
]


def protect(text: str) -> tuple[str, list[str]]:
    buckets: list[str] = []

    def repl(m: re.Match[str]) -> str:
        buckets.append(m.group(0))
        return f"{PH_PREFIX}{len(buckets) - 1}{PH_SUFFIX}"

    out = text
    for pat in _PROTECT_PATTERNS:
        out = pat.sub(repl, out)
    # Protect brand/product terms (longest first already ordered in PROTECT_TERMS)
    for term in PROTECT_TERMS:
        if term not in out:
            continue
        token_re = re.compile(re.escape(term))
        out = token_re.sub(repl, out)
    return out, buckets


def unprotect(text: str, buckets: list[str]) -> str:
    def repl(m: re.Match[str]) -> str:
        idx = int(m.group(1))
        if 0 <= idx < len(buckets):
            return buckets[idx]
        return m.group(0)

    return re.sub(re.escape(PH_PREFIX) + r"(\d+)" + re.escape(PH_SUFFIX), repl, text)


def post_fix_zh(text: str) -> str:
    for pat, rep in POST_FIXES:
        text = pat.sub(rep, text)
    return text


def chunk_text(text: str, max_chars: int = 3500) -> list[str]:
    """Split on blank lines, packing paragraphs under max_chars."""
    paras = re.split(r"(\n{2,})", text)
    chunks: list[str] = []
    buf = ""
    for part in paras:
        if len(buf) + len(part) <= max_chars:
            buf += part
        else:
            if buf.strip():
                chunks.append(buf)
            if len(part) > max_chars:
                # hard split long part
                for i in range(0, len(part), max_chars):
                    chunks.append(part[i : i + max_chars])
                buf = ""
            else:
                buf = part
    if buf.strip():
        chunks.append(buf)
    return chunks


def make_google_translator() -> Callable[[str], str]:
    from deep_translator import GoogleTranslator

    tr = GoogleTranslator(source="en", target="zh-CN")

    def translate(s: str) -> str:
        s = s.strip()
        if not s:
            return s
        # Google has length limits; recurse if needed
        if len(s) > 3500:
            return "\n".join(translate(c) for c in chunk_text(s, 3000))
        for attempt in range(5):
            try:
                out = tr.translate(s)
                if out is None:
                    raise RuntimeError("translator returned None")
                return out
            except Exception as e:
                wait = 2.0 * (attempt + 1)
                print(f"    google retry {attempt + 1}: {e}", file=sys.stderr)
                time.sleep(wait)
        # Fall back to English chunk rather than crash the batch
        return s

    return translate


def make_openai_translator() -> Callable[[str], str]:
    api_key = os.environ.get("OPENAI_API_KEY") or os.environ.get("XAI_API_KEY")
    if not api_key:
        raise SystemExit("OPENAI_API_KEY or XAI_API_KEY required for --engine openai")
    base = os.environ.get("OPENAI_BASE_URL") or os.environ.get("XAI_BASE_URL") or "https://api.openai.com/v1"
    if os.environ.get("XAI_API_KEY") and not os.environ.get("OPENAI_BASE_URL"):
        base = os.environ.get("XAI_BASE_URL") or "https://api.x.ai/v1"
    model = os.environ.get("JETEMS_DOCS_MODEL") or ("grok-3-mini" if "x.ai" in base else "gpt-4o-mini")

    def translate(s: str) -> str:
        if not s.strip():
            return s
        payload = {
            "model": model,
            "temperature": 0.2,
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "You translate Airbyte connector documentation from English to Simplified Chinese. "
                        "Keep markdown structure. Do not translate: code, URLs, env var names, product CLI flags, "
                        "placeholders like ⟦JETEMS0⟧. Preserve heading levels. Output only the translation."
                    ),
                },
                {"role": "user", "content": s},
            ],
        }
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            f"{base.rstrip('/')}/chat/completions",
            data=data,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {api_key}",
            },
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=120) as resp:
            body = json.load(resp)
        return body["choices"][0]["message"]["content"].strip()

    return translate


def strip_changelog_for_mt(en: str) -> str:
    """
    Changelog tables are huge and low-value for setup UI; keep a short stub in Chinese
    after MT of the main body (append EN changelog truncated is optional).
    """
    m = re.search(r"(?im)^##\s+Changelog\s*$", en)
    if not m:
        m = re.search(r"(?im)^##\s+Change\s*log\s*$", en)
    if not m:
        return en
    return en[: m.start()] + "\n## Changelog\n\n> 完整变更记录见官方英文文档 Changelog 章节。\n"


def translate_document(en: str, translate_fn: Callable[[str], str]) -> str:
    en = strip_changelog_for_mt(en)
    protected, buckets = protect(en)
    chunks = chunk_text(protected, max_chars=2800)
    out_parts: list[str] = []
    for i, ch in enumerate(chunks):
        # Skip pure-placeholder chunks (optional speed-up still translate to be safe)
        zh = translate_fn(ch)
        # Ensure placeholders survived
        for j, _ in enumerate(buckets):
            token = f"{PH_PREFIX}{j}{PH_SUFFIX}"
            if token in ch and token not in zh:
                # translator ate placeholder — fall back to original chunk piece
                zh = ch
                break
        out_parts.append(zh)
        time.sleep(0.15)
    merged = "".join(out_parts)
    restored = unprotect(merged, buckets)
    restored = post_fix_zh(restored)
    # Inject note after first H1 if present
    if restored.lstrip().startswith("#"):
        lines = restored.splitlines(keepends=True)
        # after first line
        if lines:
            restored = lines[0] + HEADER_NOTE + "".join(lines[1:])
    else:
        restored = HEADER_NOTE.lstrip() + restored
    return restored


def load_manifest(path: pathlib.Path) -> dict:
    if path.is_file():
        return json.loads(path.read_text(encoding="utf-8"))
    return {"version": 1, "docs": {}}


def save_manifest(path: pathlib.Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def process_one(
    rel: str,
    out_root: pathlib.Path,
    translate_fn: Callable[[str], str],
    force: bool,
    manifest: dict,
) -> bool:
    print(f"== {rel}")
    en = fetch_en(rel)
    if en is None:
        print("  skip: not found")
        return False
    en_sha = sha256_text(en)
    out_file = out_root / "integrations" / f"{rel}.md"
    meta = manifest.get("docs", {}).get(rel)
    if out_file.is_file() and meta and meta.get("en_sha") == en_sha and not force:
        print(f"  skip: up-to-date ({out_file})")
        return True

    print(f"  translating ({len(en)} bytes)…")
    zh = translate_document(en, translate_fn)
    out_file.parent.mkdir(parents=True, exist_ok=True)
    out_file.write_text(zh, encoding="utf-8")
    manifest.setdefault("docs", {})[rel] = {
        "en_sha": en_sha,
        "zh_bytes": len(zh.encode("utf-8")),
        "translated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "engine": os.environ.get("JETEMS_DOCS_ENGINE", "google"),
    }
    print(f"  wrote {out_file}")
    return True


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--top", action="store_true", help="process top_connectors.yaml")
    parser.add_argument(
        "--all",
        action="store_true",
        help="process full GitHub docs/integrations catalog (sources+destinations+enterprise)",
    )
    parser.add_argument("--path", action="append", default=[], help="e.g. sources/postgres (repeatable)")
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--engine", choices=("google", "openai"), default="google")
    parser.add_argument("--out", type=pathlib.Path, default=DEFAULT_OUT)
    parser.add_argument("--limit", type=int, default=0, help="max docs to process (0=all)")
    parser.add_argument(
        "--sleep",
        type=float,
        default=0.35,
        help="extra delay seconds between docs (rate-limit friendliness)",
    )
    args = parser.parse_args()

    paths: list[str] = []
    if args.all:
        print("Listing full catalog from GitHub…", file=sys.stderr)
        paths.extend(load_all_list())
    if args.top:
        paths.extend(load_top_list())
    paths.extend(p.removesuffix(".md") for p in args.path)
    # unique preserve order
    seen = set()
    ordered: list[str] = []
    for p in paths:
        if p not in seen:
            seen.add(p)
            ordered.append(p)
    if not ordered:
        parser.error("specify --all and/or --top and/or --path")

    if args.limit > 0:
        ordered = ordered[: args.limit]

    os.environ["JETEMS_DOCS_ENGINE"] = args.engine
    if args.engine == "openai":
        translate_fn = make_openai_translator()
    else:
        translate_fn = make_google_translator()

    manifest_path = args.out / "manifest.json"
    manifest = load_manifest(manifest_path)
    ok = 0
    fail = 0
    total = len(ordered)
    print(f"Queue: {total} docs → {args.out}", file=sys.stderr)
    for idx, rel in enumerate(ordered, 1):
        print(f"[{idx}/{total}] ", end="", flush=True)
        try:
            if process_one(rel, args.out, translate_fn, args.force, manifest):
                ok += 1
            else:
                fail += 1
            save_manifest(manifest_path, manifest)
        except KeyboardInterrupt:
            save_manifest(manifest_path, manifest)
            print(f"Interrupted at {idx}/{total}. ok={ok} fail={fail}", file=sys.stderr)
            raise
        except Exception as e:
            fail += 1
            print(f"  ERROR {rel}: {e}", file=sys.stderr)
            save_manifest(manifest_path, manifest)
        if args.sleep > 0:
            time.sleep(args.sleep)

    print(f"Done. ok={ok} fail={fail} total={total} manifest={manifest_path}")


if __name__ == "__main__":
    main()
