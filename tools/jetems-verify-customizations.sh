#!/usr/bin/env bash
# =============================================================================
# jetems-verify-customizations.sh
#
# 在 merge upstream/main 之后运行，确认二开能力未被覆盖/删除。
# 退出码 0 = 全部通过；非 0 = 有失败（不得 push）。
#
# 用法:
#   ./tools/jetems-verify-customizations.sh
#   ./tools/jetems-verify-customizations.sh --strict   # 额外检查 docs-zh 数量下限
# =============================================================================
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

STRICT=0
if [[ "${1:-}" == "--strict" ]]; then
  STRICT=1
fi

PASS=0
FAIL=0
WARN=0

green() { printf '\033[32m%s\033[0m\n' "$*"; }
red() { printf '\033[31m%s\033[0m\n' "$*"; }
yellow() { printf '\033[33m%s\033[0m\n' "$*"; }

ok() {
  green "  PASS  $*"
  PASS=$((PASS + 1))
}

bad() {
  red "  FAIL  $*"
  FAIL=$((FAIL + 1))
}

warn() {
  yellow "  WARN  $*"
  WARN=$((WARN + 1))
}

require_file() {
  local path="$1"
  local why="${2:-}"
  if [[ -f "$path" ]]; then
    ok "exists: $path${why:+ ($why)}"
  else
    bad "missing: $path${why:+ — $why}"
  fi
}

require_dir_nonempty() {
  local path="$1"
  local why="${2:-}"
  if [[ -d "$path" ]] && [[ -n "$(ls -A "$path" 2>/dev/null || true)" ]]; then
    ok "dir non-empty: $path${why:+ ($why)}"
  else
    bad "dir missing/empty: $path${why:+ — $why}"
  fi
}

require_grep() {
  local pattern="$1"
  local path="$2"
  local why="${3:-}"
  if [[ ! -e "$path" ]]; then
    bad "grep target missing: $path${why:+ — $why}"
    return
  fi
  if grep -qE "$pattern" "$path" 2>/dev/null; then
    ok "match /$pattern/ in $path${why:+ ($why)}"
  else
    bad "no match /$pattern/ in $path${why:+ — $why}"
  fi
}

echo "=============================================="
echo " jetems customization verification"
echo " root: $ROOT"
echo "=============================================="
echo ""

# -----------------------------------------------------------------------------
echo "### A. jetems-owned files (must never be deleted)"
# -----------------------------------------------------------------------------
require_file "JETEMS_DEV.md" "二开规范"
require_file "JETEMS_UPSTREAM_SYNC.md" "上游同步保护手册"
require_file "LOCAL_RUN.md"
require_file "dev-values.jetems.yaml" "本地 abctl 企业版 values"
require_file "dev-values.jetems-swr.yaml" "SWR abctl values"
require_file "tools/jetems-abctl-up.sh"
require_file "tools/jetems-abctl-up-swr.sh"
require_file "tools/jetems-abctl-fix-ingress.sh"
require_file "tools/jetems-publish-images.sh"
require_file "tools/jetems-create-release-tag.sh"
require_file ".github/workflows/jetems-publish-images.yml" "SWR 发布 CI"
require_file "airbyte-commons-entitlements/src/main/kotlin/io/airbyte/commons/entitlements/AllEntitledClient.kt" "entitlement 全开"
require_file "airbyte-commons-server/src/main/kotlin/io/airbyte/jetems/docs/JetemsConnectorDocumentationStore.kt" "中文连接器文档"
require_file "airbyte-commons-server/src/test/kotlin/io/airbyte/jetems/docs/JetemsConnectorDocumentationStoreTest.kt"
require_dir_nonempty "airbyte-commons-server/src/main/resources/docs-zh/integrations" "中文设置指南"
require_file "airbyte-webapp/src/locales/zh.json" "中文 UI"
require_file "airbyte-webapp/src/locales/zh.errors.json"
require_file "airbyte-webapp/src/jetems/components/LanguageToggle/LanguageToggle.tsx"
require_file "airbyte-webapp/src/area/connectorBuilder/components/Builder/localizeCdkSchema.ts" "CDK 中文"
require_file "tools/jetems-gen-cdk-schema-zh.py"
require_file "tools/jetems-docs-zh/README.md"

echo ""
# -----------------------------------------------------------------------------
echo "### B. invasive markers (upstream files must still carry JETEMS logic)"
# -----------------------------------------------------------------------------
require_grep "AllEntitledClient" \
  "airbyte-commons-entitlements/src/main/kotlin/io/airbyte/commons/entitlements/EntitlementClientConfig.kt" \
  "ENTERPRISE 分支必须创建 AllEntitledClient"

require_grep "return LicenseStatus.PRO" \
  "airbyte-commons-server/src/main/kotlin/io/airbyte/commons/server/handlers/InstanceConfigurationHandler.kt" \
  "强制 PRO 消除 invalid license 横幅"

require_grep "JetemsConnectorDocumentationStore" \
  "airbyte-commons-server/src/main/kotlin/io/airbyte/commons/server/handlers/ConnectorDocumentationHandler.kt" \
  "中文文档注入"

require_grep "findChineseDoc|isChineseLocale" \
  "airbyte-commons-server/src/main/kotlin/io/airbyte/commons/server/handlers/ConnectorDocumentationHandler.kt" \
  "locale=zh 优先 docs-zh"

require_grep "locale:" \
  "airbyte-api/server-api/src/main/openapi/config.yaml" \
  "OpenAPI ConnectorDocumentationRequestBody.locale"

require_grep "zhMessages|JetemsLocale|messagesByLocale" \
  "airbyte-webapp/src/core/services/i18n/I18nProvider.tsx" \
  "中文 bundle 与语言切换"

require_grep "LanguageToggle" \
  "airbyte-webapp/src/area/layout/SideBar/SideBar.tsx" \
  "侧栏语言切换"

require_grep "jetemsLocale|locale: jetemsLocale" \
  "airbyte-webapp/src/core/api/hooks/connectorDocumentation.ts" \
  "请求连接器文档时传 locale"

require_grep "localizeCdkSchemaTitle|localizeCdkSchemaDescription" \
  "airbyte-webapp/src/components/ui/forms/SchemaForm/Controls/SchemaFormControl.tsx" \
  "Builder schema 中文化"

require_grep "authentication: bearer" \
  "airbyte-server/src/main/resources/application.yml" \
  "企业版 bearer 认证"

require_grep "instance-admin:" \
  "airbyte-server/src/main/resources/application.yml" \
  "instance-admin password 绑定"

# PG17（若上游改回旧版本，脚本失败以提醒人工决策）
require_grep "postgres:17" \
  "airbyte-db/db-lib/Dockerfile" \
  "jetems PG17 镜像"

require_grep "postgres:17" \
  "airbyte-db/db-lib/src/main/kotlin/io/airbyte/db/instance/DatabaseConstants.kt" \
  "jetems PG17 常量"

echo ""
# -----------------------------------------------------------------------------
echo "### C. content health"
# -----------------------------------------------------------------------------
ZH_LINES=$(wc -l < airbyte-webapp/src/locales/zh.json | tr -d ' ')
if [[ "$ZH_LINES" -ge 2000 ]]; then
  ok "zh.json has ${ZH_LINES} lines (>= 2000)"
else
  bad "zh.json only ${ZH_LINES} lines — may have been truncated/overwritten"
fi

JETEMS_KEYS=$(grep -c '"jetems\.' airbyte-webapp/src/locales/en.json 2>/dev/null || echo 0)
if [[ "$JETEMS_KEYS" -ge 5 ]]; then
  ok "en.json has ${JETEMS_KEYS} jetems.* keys"
else
  bad "en.json jetems.* keys too few (${JETEMS_KEYS}) — may have lost jetems keys in en.json merge"
fi

DOC_COUNT=$(find airbyte-commons-server/src/main/resources/docs-zh -name '*.md' 2>/dev/null | wc -l | tr -d ' ')
if [[ "$DOC_COUNT" -ge 100 ]]; then
  ok "docs-zh has ${DOC_COUNT} markdown files"
else
  bad "docs-zh only ${DOC_COUNT} md files — bulk Chinese docs may be gone"
fi

if [[ "$STRICT" -eq 1 ]]; then
  if [[ "$DOC_COUNT" -ge 600 ]]; then
    ok "strict: docs-zh >= 600 (${DOC_COUNT})"
  else
    bad "strict: docs-zh expected >= 600, got ${DOC_COUNT}"
  fi
  if [[ "$ZH_LINES" -ge 3000 ]]; then
    ok "strict: zh.json >= 3000 lines (${ZH_LINES})"
  else
    warn "strict: zh.json lines ${ZH_LINES} < 3000 (upstream may have removed keys; check completeness)"
  fi
fi

# 确保 AllEntitledClient 未被改回仅 Stigg（粗检）
if grep -q 'AllEntitledClient()' \
  airbyte-commons-entitlements/src/main/kotlin/io/airbyte/commons/entitlements/EntitlementClientConfig.kt 2>/dev/null; then
  ok "EntitlementClientConfig still instantiates AllEntitledClient()"
else
  bad "EntitlementClientConfig no longer uses AllEntitledClient() — enterprise unlock lost"
fi

# 确保 license 强制 PRO 仍是 early return（在 isEmpty 检查之前）
HANDLER="airbyte-commons-server/src/main/kotlin/io/airbyte/commons/server/handlers/InstanceConfigurationHandler.kt"
if [[ -f "$HANDLER" ]]; then
  # 用绝对行号：函数声明行之后，第一个 return PRO 应早于 isEmpty
  FN_LINE=$(grep -n 'fun currentLicenseStatus' "$HANDLER" | head -1 | cut -d: -f1 || true)
  if [[ -z "${FN_LINE:-}" ]]; then
    bad "currentLicenseStatus function missing"
  else
    PRO_LINE=$(awk -v start="$FN_LINE" 'NR>start && /return LicenseStatus.PRO/ { print NR; exit }' "$HANDLER" || true)
    EMPTY_LINE=$(awk -v start="$FN_LINE" 'NR>start && /activeAirbyteLicense.isEmpty/ { print NR; exit }' "$HANDLER" || true)
    if [[ -n "${PRO_LINE:-}" && -n "${EMPTY_LINE:-}" && "$PRO_LINE" -lt "$EMPTY_LINE" ]]; then
      ok "InstanceConfigurationHandler PRO return (L${PRO_LINE}) before isEmpty (L${EMPTY_LINE})"
    elif [[ -n "${PRO_LINE:-}" ]]; then
      # 仍有 PRO 返回即可，顺序异常仅警告
      warn "PRO return at L${PRO_LINE}; isEmpty at ${EMPTY_LINE:-n/a} — confirm override still short-circuits"
    else
      bad "currentLicenseStatus PRO override missing after L${FN_LINE}"
    fi
  fi
fi

echo ""
echo "=============================================="
echo " result: PASS=${PASS}  FAIL=${FAIL}  WARN=${WARN}"
echo "=============================================="

if [[ "$FAIL" -gt 0 ]]; then
  red "FAILED — do not push. Restore jetems customizations (see JETEMS_UPSTREAM_SYNC.md)."
  exit 1
fi

if [[ "$WARN" -gt 0 ]]; then
  yellow "PASSED with warnings — review WARN items before release."
  exit 0
fi

green "ALL CHECKS PASSED"
exit 0
