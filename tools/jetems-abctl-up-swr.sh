#!/usr/bin/env bash
#
# 使用华为云 SWR 上 jetems/*:latest 镜像部署 abctl。
# Tag 固定 latest。通过 abctl --docker-* 在 helm pre-install hook 前注入 pull secret。
#
# 环境变量:
#   SWR_USERNAME / SWR_PASSWORD  可选；缺省时从本机 docker 登录（keychain）读取
#   SWR_HOST                    默认 swr.cn-south-1.myhuaweicloud.com
#   ABCTL_PORT                  默认 8000
#
# 用法:
#   ./tools/jetems-abctl-up-swr.sh
#   # 或先卸再装:
#   abctl local uninstall --persisted && ./tools/jetems-abctl-up-swr.sh
#
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CHART="$REPO_ROOT/charts/v2/airbyte"
VALUES="$REPO_ROOT/dev-values.jetems-swr.yaml"
PORT="${ABCTL_PORT:-8000}"
NS="${AIRBYTE_NAMESPACE:-airbyte-abctl}"
SWR_HOST="${SWR_HOST:-swr.cn-south-1.myhuaweicloud.com}"
KUBECONFIG_PATH="${KUBECONFIG:-$HOME/.airbyte/abctl/abctl.kubeconfig}"

load_swr_creds_from_docker() {
  if [[ -n "${SWR_USERNAME:-}" && -n "${SWR_PASSWORD:-}" ]]; then
    return 0
  fi
  local helper json
  helper="$(
    python3 -c "
import json, pathlib
c=json.loads(pathlib.Path.home().joinpath('.docker/config.json').read_text())
print(c.get('credsStore') or c.get('credHelpers',{}).get('${SWR_HOST}') or 'osxkeychain')
" 2>/dev/null || echo osxkeychain
  )"
  if command -v "docker-credential-${helper}" >/dev/null 2>&1; then
    json="$(printf '%s' "$SWR_HOST" | "docker-credential-${helper}" get 2>/dev/null || true)"
    if [[ -n "$json" ]]; then
      SWR_USERNAME="$(echo "$json" | python3 -c "import sys,json; print(json.load(sys.stdin).get('Username',''))")"
      SWR_PASSWORD="$(echo "$json" | python3 -c "import sys,json; print(json.load(sys.stdin).get('Secret',''))")"
      export SWR_USERNAME SWR_PASSWORD
    fi
  fi
}

echo "=== Jetems abctl ← SWR jetems/*:latest ==="
echo "values: $VALUES"
echo "tag:    latest（固定）"
echo "images: ${SWR_HOST}/jetems/<svc>:latest"
echo

[[ -f "$VALUES" ]] || { echo "ERROR: missing $VALUES" >&2; exit 1; }
grep -qE 'tag:\s*latest' "$VALUES" || { echo "ERROR: values must use tag latest" >&2; exit 1; }

load_swr_creds_from_docker
if [[ -z "${SWR_USERNAME:-}" || -z "${SWR_PASSWORD:-}" ]]; then
  echo "ERROR: 需要 SWR 凭证。请 export SWR_USERNAME/SWR_PASSWORD 或: docker login $SWR_HOST" >&2
  exit 1
fi
echo "SWR user: ${SWR_USERNAME:0:24}…"

echo "=== abctl local install（含 docker pull secret 注入）==="
abctl local install \
  --chart "$CHART" \
  --values "$VALUES" \
  --port "$PORT" \
  --low-resource-mode \
  --no-browser \
  --docker-server="$SWR_HOST" \
  --docker-username="$SWR_USERNAME" \
  --docker-password="$SWR_PASSWORD" \
  --verbose

export KUBECONFIG="$KUBECONFIG_PATH"

# abctl --docker-* 创建 secret 名 docker-auth（与 values 中 imagePullSecrets 一致）
echo "=== 确认 imagePullSecret docker-auth ==="
export KUBECONFIG="$KUBECONFIG_PATH"
if kubectl get secret -n "$NS" docker-auth >/dev/null 2>&1; then
  echo "  ✅ docker-auth"
else
  echo "  ⚠️  缺少 docker-auth，补创建…"
  kubectl create secret docker-registry docker-auth \
    -n "$NS" \
    --docker-server="$SWR_HOST" \
    --docker-username="$SWR_USERNAME" \
    --docker-password="$SWR_PASSWORD" \
    --docker-email="unused@jetems.local" \
    --dry-run=client -o yaml | kubectl apply -f -
fi

echo "=== 修复 ingress / Keycloak hostname ==="
"$REPO_ROOT/tools/jetems-abctl-fix-ingress.sh" || true

echo
echo "================ 完成 ================"
echo "镜像:   ${SWR_HOST}/jetems/<svc>:latest"
echo "UI:     http://localhost:$PORT"
echo "状态:   KUBECONFIG=$KUBECONFIG_PATH kubectl get pods -n $NS"
kubectl get pods -n "$NS" 2>/dev/null || true
