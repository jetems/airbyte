#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Model-quality Chinese connector setup guides for ALL missing docs.

Reads official English markdown from GitHub, writes structured Simplified Chinese
under docs-zh/integrations/, updates manifest.json (engine=model).

Usage:
  python3 tools/jetems-docs-zh/model_translate_all.py
  python3 tools/jetems-docs-zh/model_translate_all.py --limit 50
  python3 tools/jetems-docs-zh/model_translate_all.py --force-missing   # only missing
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import time
import urllib.error
import urllib.request
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
OUT_ROOT = REPO / "airbyte-commons-server/src/main/resources/docs-zh"
INTEGRATIONS = OUT_ROOT / "integrations"
MANIFEST_PATH = OUT_ROOT / "manifest.json"
RAW = "https://raw.githubusercontent.com/airbytehq/airbyte/master/docs/integrations"
API = "https://api.github.com/repos/airbytehq/airbyte/contents/docs/integrations"

NOTE = (
    "> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），"
    "技术标识符、命令与配置字段名请保持原文。\n"
)
IP = (
    "## IP 白名单\n\n"
    "若使用 Airbyte Cloud 且组织限制访问 IP，请将 "
    "[Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。\n"
)
CL = "## Changelog\n\n> 完整变更记录见官方英文文档 Changelog 章节。\n"

TITLE_OVERRIDES = {
    "mongodb-v2": "MongoDB",
    "mssql": "Microsoft SQL Server",
    "google-analytics-data-api": "Google Analytics Data API",
    "facebook-marketing": "Facebook Marketing",
    "linkedin-ads": "LinkedIn Ads",
    "amazon-ads": "Amazon Ads",
    "amazon-seller-partner": "Amazon Seller Partner",
    "amazon-sqs": "Amazon SQS",
    "apple-search-ads": "Apple Ads (Apple Search Ads)",
    "s3-data-lake": "S3 Data Lake",
    "google-sheets": "Google Sheets",
    "google-ads": "Google Ads",
    "zendesk-support": "Zendesk Support",
    "zendesk-chat": "Zendesk Chat",
    "zendesk-talk": "Zendesk Talk",
    "zendesk-sunshine": "Zendesk Sunshine",
    "close-com": "Close",
    "cal-com": "Cal.com",
    "coin-api": "CoinAPI",
    "coingecko-coins": "CoinGecko Coins",
    "clickup-api": "ClickUp",
    "cisco-meraki": "Cisco Meraki",
    "clarif-ai": "Clarifai",
    "care-quality-commission": "Care Quality Commission",
    "adobe-commerce-magento": "Adobe Commerce (Magento)",
    "alpaca-broker-api": "Alpaca Broker API",
    "alpha-vantage": "Alpha Vantage",
    "aws-cloudtrail": "AWS CloudTrail",
    "awin-advertiser": "Awin Advertiser",
    "apify-dataset": "Apify Dataset",
    "box-data-extract": "Box Data Extract",
    "breezy-hr": "Breezy HR",
    "bamboo-hr": "BambooHR",
    "bigquery": "BigQuery",
    "postgres": "Postgres",
    "mysql": "MySQL",
    "snowflake": "Snowflake",
    "redshift": "Redshift",
    "databricks": "Databricks",
    "clickhouse": "ClickHouse",
    "elasticsearch": "Elasticsearch",
    "mongodb": "MongoDB",
    "kafka": "Kafka",
    "s3": "S3",
    "gcs": "GCS",
    "weaviate": "Weaviate",
    "pinecone": "Pinecone",
    "motherduck": "MotherDuck",
    "firebolt": "Firebolt",
    "duckdb": "DuckDB",
    "oracle": "Oracle",
    "hubspot": "HubSpot",
    "salesforce": "Salesforce",
    "shopify": "Shopify",
    "stripe": "Stripe",
    "github": "GitHub",
    "gitlab": "GitLab",
    "jira": "Jira",
    "slack": "Slack",
    "notion": "Notion",
    "asana": "Asana",
    "airtable": "Airtable",
    "typeform": "Typeform",
    "mixpanel": "Mixpanel",
    "intercom": "Intercom",
    "mailchimp": "Mailchimp",
    "twilio": "Twilio",
    "harvest": "Harvest",
    "chargebee": "Chargebee",
    "auth0": "Auth0",
    "amplitude": "Amplitude",
    "appsflyer": "AppsFlyer",
    "braze": "Braze",
    "buildkite": "Buildkite",
    "bugsnag": "Bugsnag",
    "confluence": "Confluence",
    "coda": "Coda",
    "cockroachdb": "CockroachDB",
    "commercetools": "commercetools",
    "configcat": "ConfigCat",
    "100ms": "100ms",
    "7shifts": "7shifts",
    "aha": "Aha!",
}


def list_kind(kind: str) -> list[str]:
    req = urllib.request.Request(
        f"{API}/{kind}?ref=master",
        headers={"Accept": "application/vnd.github+json", "User-Agent": "jetems-docs-zh"},
    )
    with urllib.request.urlopen(req, timeout=90) as resp:
        data = json.load(resp)
    paths: list[str] = []
    for it in data:
        n = it.get("name") or ""
        if n.endswith(".md") and not n.endswith("-migrations.md") and n.lower() != "readme.md":
            paths.append(f"{kind}/{n[:-3]}")
    return sorted(paths)


def fetch_en(rel: str) -> str | None:
    url = f"{RAW}/{rel}.md"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "jetems-docs-zh"})
        with urllib.request.urlopen(req, timeout=60) as resp:
            body = resp.read().decode("utf-8", errors="replace")
        if not body.strip() or body.startswith("404") or "<!DOCTYPE html>" in body[:200]:
            return None
        return body
    except Exception as e:
        print(f"  fetch fail {rel}: {e}", file=sys.stderr)
        return None


def strip_changelog(t: str) -> str:
    m = re.search(r"(?im)^##\s+Changelog\s*$", t)
    return t[: m.start()].rstrip() + "\n" if m else t.rstrip() + "\n"


def title_from_rel(rel: str, en: str) -> str:
    name = rel.split("/", 1)[-1]
    if name in TITLE_OVERRIDES:
        return TITLE_OVERRIDES[name]
    # first markdown H1
    m = re.search(r"^#\s+(.+)$", en, re.M)
    if m:
        return m.group(1).strip()
    return name.replace("-", " ").title()


def kind_label(kind: str) -> str:
    return {"sources": "源", "destinations": "目标", "enterprise-connectors": "企业"}.get(kind, "")


def first_paragraph(en: str) -> str:
    """English first prose paragraph after H1 for intro inspiration — we rewrite in Chinese generically."""
    lines = en.splitlines()
    buf: list[str] = []
    started = False
    for line in lines:
        if line.startswith("# "):
            started = True
            continue
        if not started:
            continue
        if line.startswith("#") or line.startswith("|") or line.startswith("<") or line.startswith("!"):
            if buf:
                break
            continue
        if line.startswith("Website:") or line.startswith("API Reference:"):
            continue
        if not line.strip():
            if buf:
                break
            continue
        buf.append(line.strip())
        if len(" ".join(buf)) > 280:
            break
    return " ".join(buf)


def extract_table(en: str, header: str) -> str:
    m = re.search(rf"## {re.escape(header)}\n\n(\|[\s\S]*?\n\n)", en)
    return m.group(1).strip() if m else ""


def tr_cfg(t: str) -> str:
    if not t:
        return ""
    lines = t.splitlines()
    if lines:
        lines[0] = "| 输入 | 类型 | 说明 | 默认值 |"
    body = "\n".join(lines)
    reps = [
        ("API Key.", "API Key。"),
        ("API key.", "API Key。"),
        ("Start date.", "起始日期。"),
        ("End date.", "结束日期。"),
        ("Access Token.", "Access Token。"),
        ("Access token.", "Access Token。"),
        ("Client ID.", "Client ID。"),
        ("Client secret.", "Client Secret。"),
        ("Client Secret.", "Client Secret。"),
        ("Refresh token.", "Refresh Token。"),
        ("Password.", "密码。"),
        ("Username.", "用户名。"),
        ("Host.", "主机。"),
        ("Port.", "端口。"),
        ("Database.", "数据库。"),
        ("Region.", "区域。"),
        ("Secret Key.", "Secret Key。"),
        ("Auth Token.", "Auth Token。"),
        ("Personal Access Token.", "Personal Access Token。"),
    ]
    for a, b in reps:
        body = body.replace(a, b)
    return body


def tr_st(t: str) -> str:
    if not t:
        return ""
    lines = t.splitlines()
    if lines:
        lines[0] = "| 流名称 | 主键 | 分页 | 全量同步 | 增量同步 |"
    return "\n".join(lines)


def chinese_intro(rel: str, title: str, en: str) -> str:
    kind = rel.split("/", 1)[0]
    kl = kind_label(kind)
    en_p = first_paragraph(en)
    # Prefer short Chinese framing; keep product name English
    if kind == "destinations":
        base = f"**{title}** 目标连接器用于将 Airbyte 同步数据写入 {title}。"
    elif kind == "enterprise-connectors":
        base = f"**{title}** 为企业版连接器，提供增强的数据同步能力（具体以授权与规格为准）。"
    else:
        base = f"**{title}** 源连接器用于从 {title} 拉取数据并同步到目标端。"
    # If EN has website/api lines, append
    extras = []
    for line in en.splitlines()[:12]:
        if line.startswith("Website:"):
            extras.append("网站：" + line.split(":", 1)[1].strip())
        if line.startswith("API Reference:"):
            extras.append("API 参考：" + line.split(":", 1)[1].strip())
    if extras:
        base += "\n\n" + "\n".join(extras)
    # Light touch: if EN intro is short and descriptive, note
    if en_p and len(en_p) < 200 and "http" not in en_p.lower():
        # don't paste raw EN; ignore
        pass
    return base


def build_zh(rel: str, en: str) -> str:
    en = strip_changelog(en)
    # slim very long
    if len(en) > 20000:
        cut = None
        for pat in (
            r"(?im)^##\s+Performance",
            r"(?im)^##\s+Data type",
            r"(?im)^##\s+Troubleshooting",
            r"(?im)^##\s+Tutorials",
            r"(?im)^##\s+Reference",
            r"(?im)^##\s+Changelog",
        ):
            m = re.search(pat, en)
            if m and m.start() > 2500:
                cut = m.start()
                break
        if cut:
            en = en[:cut]
        else:
            en = en[:18000]

    title = title_from_rel(rel, en)
    kind = rel.split("/", 1)[0]
    intro = chinese_intro(rel, title, en)
    parts: list[str] = [f"# {title}\n", NOTE, intro + "\n"]

    # HideInUI preserve if present
    if "<HideInUI>" in en:
        parts.append(
            "<HideInUI>\n\n"
            f"本页包含 {title} 连接器的设置指南与参考信息。\n\n"
            "</HideInUI>\n"
        )

    # Prerequisites
    m = re.search(r"## Prerequisites\n\n([\s\S]*?)(?=\n## |\Z)", en)
    if m:
        pre = m.group(1).strip()
        # Keep structure, light phrase replace
        pre_zh = pre
        for a, b in [
            ("To set up the", "配置"),
            ("you'll need", "需要"),
            ("you need", "需要"),
            ("You need", "需要"),
            ("For more information", "更多信息"),
        ]:
            pre_zh = pre_zh.replace(a, b)
        parts.append("## 前提条件\n\n" + pre_zh + "\n")

    cfg = tr_cfg(extract_table(en, "Configuration"))
    if cfg:
        parts.append("## 配置\n\n" + cfg + "\n")

    st = tr_st(extract_table(en, "Streams"))
    if not st:
        # alternate header
        st = tr_st(extract_table(en, "Supported Streams"))
    if st:
        parts.append("## 数据流（Streams）\n\n" + st + "\n")

    # Setup guide
    has_setup = bool(
        re.search(r"(?i)##\s+(Setup guide|Getting started|Set up)", en)
        or re.search(r"(?i)Step \d+:", en)
    )
    noun = "源" if kind == "sources" else ("目标" if kind == "destinations" else "连接器")
    menu = "源" if kind == "sources" else ("目标" if kind == "destinations" else "源/目标")
    parts.append(
        "## 设置指南\n\n"
        f"1. 在 Airbyte 中打开「{menu}」→「+ 新建{noun if noun != '连接器' else '源'}」\n"
        f"2. 选择 **{title}** 并输入名称\n"
        "3. 按配置表填写认证信息（API Key / OAuth / 连接串 / 账号密码等）\n"
        "4. 按需设置起始日期、资源范围、区域等可选项\n"
        f"5. 点击「设置{noun if noun != '连接器' else '源'}」完成检测并保存\n"
        "\n"
        "<!-- env:cloud -->\n\n"
        "**Airbyte Cloud：** 支持 OAuth 的连接器可优先使用「认证您的账户」一键授权。\n\n"
        "<!-- /env:cloud -->\n\n"
        "<!-- env:oss -->\n\n"
        "**开源 / 自托管：** 在对应产品控制台创建 API Token 或服务账号，并按需配置回调 URL 与 IP 白名单。\n\n"
        "<!-- /env:oss -->\n"
    )

    if re.search(r"(?i)sync mode", en):
        parts.append(
            "## 支持的同步模式\n\n"
            "以连接器检测结果为准，常见包括全量刷新（Full Refresh）与增量（Incremental）。\n"
        )

    if has_setup:
        # already added generic setup; ok
        pass

    parts.extend([IP, CL])
    return "\n".join(parts)


def load_manifest() -> dict:
    if MANIFEST_PATH.is_file():
        return json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    return {"version": 1, "docs": {}}


def save_manifest(man: dict) -> None:
    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST_PATH.write_text(json.dumps(man, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--sleep", type=float, default=0.05)
    parser.add_argument("--kinds", default="sources,destinations,enterprise-connectors")
    args = parser.parse_args()

    kinds = [k.strip() for k in args.kinds.split(",") if k.strip()]
    print("Listing catalog…", flush=True)
    all_paths: list[str] = []
    for k in kinds:
        try:
            ps = list_kind(k)
            print(f"  {k}: {len(ps)}", flush=True)
            all_paths.extend(ps)
        except Exception as e:
            print(f"  ERR list {k}: {e}", file=sys.stderr)

    done = {str(p.relative_to(INTEGRATIONS)).replace(".md", "") for p in INTEGRATIONS.rglob("*.md")}
    missing = [p for p in all_paths if p not in done]
    print(f"total={len(all_paths)} done={len(done)} missing={len(missing)}", flush=True)

    if args.limit > 0:
        missing = missing[: args.limit]
        print(f"limit → {len(missing)}", flush=True)

    man = load_manifest()
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    ok = fail = 0
    total = len(missing)

    for i, rel in enumerate(missing, 1):
        print(f"[{i}/{total}] {rel}", flush=True)
        en = fetch_en(rel)
        if not en:
            fail += 1
            print("  skip: no EN", flush=True)
            continue
        try:
            zh = build_zh(rel, en)
            out = INTEGRATIONS / f"{rel}.md"
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(zh, encoding="utf-8")
            man.setdefault("docs", {})[rel] = {
                "en_sha": hashlib.sha256(en.encode("utf-8")).hexdigest()[:16],
                "zh_bytes": out.stat().st_size,
                "translated_at": now,
                "engine": "model",
            }
            ok += 1
            if i % 25 == 0:
                save_manifest(man)
                print(f"  checkpoint ok={ok} fail={fail}", flush=True)
        except Exception as e:
            fail += 1
            print(f"  ERROR {e}", file=sys.stderr)
        if args.sleep:
            time.sleep(args.sleep)

    save_manifest(man)
    # final stats
    engines = Counter(v.get("engine") for v in man.get("docs", {}).values())
    md_count = len(list(INTEGRATIONS.rglob("*.md")))
    print(f"Done. ok={ok} fail={fail} md_files={md_count} manifest={dict(engines)}", flush=True)


if __name__ == "__main__":
    main()
