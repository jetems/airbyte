#!/usr/bin/env python3
"""
JETEMS: 按 airbyte-commons-license/ActiveAirbyteLicense 的解析逻辑生成「可解析」的 license key。

解析算法（源码 extractLicense）：
  1. 必须是 3 段 JWT 形态: HEADER.PAYLOAD.SIGNATURE（用 '.' 分隔）
  2. 只解码 payload（第 2 段），Base64 → JSON
  3. 必填字段: license, exp（毫秒 epoch）
  4. 可选字段: maxNodes, maxEditors, enterpriseConnectorIds, isEmbedded
  5. 不校验签名、不校验 iss/aud/sub、解析时不校验是否过期

用途：本地二开 / 评估。商用须合法 license（ELv2 禁止绕过许可校验）。

示例:
  ./tools/jetems-generate-license.py
  ./tools/jetems-generate-license.py --type pro --days 365 --max-editors 50 --max-nodes 10
  ./tools/jetems-generate-license.py --verify 'HEADER.xxx.SIGNATURE'
  ./tools/jetems-generate-license.py --quiet   # 只打印 key，方便写进 values
"""

from __future__ import annotations

import argparse
import base64
import json
import sys
import time
import uuid
from typing import Any


LICENSE_TYPES = ("pro", "trial", "enterprise", "invalid")

# 与 ActiveAirbyteLicenseTest 中样例对齐的默认企业连接器 id（可改）
DEFAULT_ENTERPRISE_CONNECTOR_ID = "3f17c355-5717-446b-8857-8ce7c7144531"


def b64_encode(raw: bytes) -> str:
    """标准 Base64（非 URL-safe），与 Java Base64.getDecoder() 兼容；去掉 padding 亦可被 Java 接受。"""
    return base64.b64encode(raw).decode("ascii").rstrip("=")


def b64_decode(s: str) -> bytes:
    pad = "=" * (-len(s) % 4)
    return base64.b64decode(s + pad)


def build_payload(
    *,
    license_type: str,
    exp_ms: int,
    max_nodes: int | None,
    max_editors: int | None,
    enterprise_connector_ids: list[str],
    is_embedded: bool,
    subject: str,
) -> dict[str, Any]:
    payload: dict[str, Any] = {
        "license": license_type,
        "exp": exp_ms,
        # 以下字段解析器不使用，但贴近官方样例，便于肉眼阅读
        "iat": int(time.time()),
        "iss": "Jetems-Local",
        "aud": "Airbyte-Dev",
        "sub": subject,
    }
    if max_nodes is not None:
        payload["maxNodes"] = max_nodes
    if max_editors is not None:
        payload["maxEditors"] = max_editors
    if enterprise_connector_ids:
        payload["enterpriseConnectorIds"] = enterprise_connector_ids
    if is_embedded:
        payload["isEmbedded"] = True
    return payload


def generate_license_key(payload: dict[str, Any]) -> str:
    # header 与 signature 均被 ActiveAirbyteLicense 忽略；填合理占位即可
    header = {"alg": "none", "typ": "JWT"}
    header_b64 = b64_encode(json.dumps(header, separators=(",", ":")).encode("utf-8"))
    payload_b64 = b64_encode(
        json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    )
    signature_b64 = b64_encode(b"jetems-local-unsigned")
    return f"{header_b64}.{payload_b64}.{signature_b64}"


def parse_license_key(key: str) -> dict[str, Any]:
    """复刻 ActiveAirbyteLicense.extractLicense 的成功路径，用于 --verify。"""
    fragments = key.split(".")
    if len(fragments) != 3:
        raise ValueError(f"expected 3 fragments, got {len(fragments)}")
    raw = b64_decode(fragments[1])
    payload = json.loads(raw.decode("utf-8"))
    if payload.get("license") is None or payload.get("exp") is None:
        raise ValueError("payload must contain non-null 'license' and 'exp'")
    # 校验 connector ids 是否是 UUID（与源码 UUID.fromString 一致）
    for cid in payload.get("enterpriseConnectorIds") or []:
        uuid.UUID(str(cid))
    return payload


def status_hint(payload: dict[str, Any]) -> str:
    """对照 InstanceConfigurationHandler.currentLicenseStatus 的上游逻辑给提示（不含 jetems 强制 PRO）。"""
    lic = payload.get("license")
    if lic in (None, "invalid"):
        return "INVALID (type missing or 'invalid')"
    exp_ms = payload.get("exp")
    if isinstance(exp_ms, (int, float)) and exp_ms < time.time() * 1000:
        return "EXPIRED (exp < now)"
    # 编辑者超限依赖运行时 count，脚本侧无法算
    if lic == "pro":
        return "PRO candidate (isPro=true; 若 maxEditors 运行时未超限且未过期 → status PRO)"
    if lic == "enterprise":
        return "ENTERPRISE type (isPro=false; 设计上给 Stigg 离线 entitlements 用)"
    if lic == "trial":
        return "TRIAL type (isPro=false)"
    return f"unknown type={lic!r}"


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Generate a parseable AIRBYTE_LICENSE_KEY for local jetems/Airbyte Enterprise eval.",
        epilog="Does NOT cryptographically sign the key. Signature is ignored by ActiveAirbyteLicense.",
    )
    parser.add_argument(
        "--type",
        choices=LICENSE_TYPES,
        default="pro",
        help="payload.license value (default: pro → isPro=true)",
    )
    parser.add_argument(
        "--days",
        type=int,
        default=365,
        help="days until exp from now (default: 365). exp is milliseconds epoch.",
    )
    parser.add_argument(
        "--exp-ms",
        type=int,
        default=None,
        help="absolute exp as epoch milliseconds (overrides --days)",
    )
    parser.add_argument("--max-nodes", type=int, default=10, help="maxNodes (default: 10)")
    parser.add_argument("--max-editors", type=int, default=50, help="maxEditors (default: 50)")
    parser.add_argument(
        "--no-limits",
        action="store_true",
        help="omit maxNodes / maxEditors (status 侧不会因超限返回 EXCEEDED)",
    )
    parser.add_argument(
        "--connector-id",
        action="append",
        default=None,
        metavar="UUID",
        help="enterpriseConnectorIds entry (repeatable). Default: one sample UUID.",
    )
    parser.add_argument(
        "--no-connectors",
        action="store_true",
        help="omit enterpriseConnectorIds",
    )
    parser.add_argument(
        "--embedded",
        action="store_true",
        help="set isEmbedded=true",
    )
    parser.add_argument(
        "--subject",
        default="dev@jetems.local",
        help="payload.sub (informational only)",
    )
    parser.add_argument(
        "--verify",
        metavar="KEY",
        help="parse/verify an existing key instead of generating",
    )
    parser.add_argument(
        "--quiet",
        "-q",
        action="store_true",
        help="print only the license key (or only JSON for --verify)",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="print machine-readable JSON (key + payload)",
    )
    args = parser.parse_args(argv)

    if args.verify:
        try:
            payload = parse_license_key(args.verify)
        except Exception as e:
            print(f"INVALID: {e}", file=sys.stderr)
            return 1
        if args.json:
            print(json.dumps({"valid": True, "payload": payload, "status_hint": status_hint(payload)}, indent=2))
        elif args.quiet:
            print(json.dumps(payload, indent=2))
        else:
            print("Parse OK (matches ActiveAirbyteLicense success path)\n")
            print(json.dumps(payload, indent=2))
            print(f"\nstatus_hint: {status_hint(payload)}")
            print(f"isPro: {payload.get('license') == 'pro'}")
        return 0

    exp_ms = args.exp_ms if args.exp_ms is not None else int((time.time() + args.days * 86400) * 1000)

    if args.no_limits:
        max_nodes = max_editors = None
    else:
        max_nodes, max_editors = args.max_nodes, args.max_editors

    if args.no_connectors:
        connector_ids: list[str] = []
    elif args.connector_id:
        connector_ids = args.connector_id
        for cid in connector_ids:
            uuid.UUID(cid)  # fail fast
    else:
        connector_ids = [DEFAULT_ENTERPRISE_CONNECTOR_ID]

    payload = build_payload(
        license_type=args.type,
        exp_ms=exp_ms,
        max_nodes=max_nodes,
        max_editors=max_editors,
        enterprise_connector_ids=connector_ids,
        is_embedded=args.embedded,
        subject=args.subject,
    )
    key = generate_license_key(payload)

    # 自检：生成后立刻按同一算法解析
    try:
        roundtrip = parse_license_key(key)
    except Exception as e:
        print(f"internal error: generated key failed parse: {e}", file=sys.stderr)
        return 2

    if args.json:
        print(json.dumps({"license_key": key, "payload": roundtrip, "status_hint": status_hint(roundtrip)}, indent=2))
        return 0

    if args.quiet:
        print(key)
        return 0

    print("=" * 72)
    print("JETEMS local license key (unsigned; signature ignored by platform)")
    print("=" * 72)
    print()
    print("AIRBYTE_LICENSE_KEY=")
    print(key)
    print()
    print("payload:")
    print(json.dumps(roundtrip, indent=2))
    print()
    print(f"status_hint : {status_hint(roundtrip)}")
    print(f"isPro       : {roundtrip.get('license') == 'pro'}")
    print(f"exp (UTC)   : {time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime(roundtrip['exp'] / 1000))} UTC")
    print()
    print("Helm (dev-values.jetems.yaml):")
    print(f'  global.enterprise.licenseKey: "{key}"')
    print()
    print("Env:")
    print(f'  export AIRBYTE_LICENSE_KEY="{key}"')
    print(f"  export AIRBYTE_EDITION=ENTERPRISE")
    print()
    print("WARNING: local/eval only. ELv2 forbids removing or bypassing license checks for commercial use.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
