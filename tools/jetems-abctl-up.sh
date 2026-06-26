#!/usr/bin/env bash
#
# jetems-abctl-up.sh
#
# 一键(重)装 jetems 本地 dev 环境：abctl + 本地源码构建的 dev 镜像。
# 自动在安装后修复 abctl ingress（见 jetems-abctl-fix-ingress.sh）。
#
# 前置条件（只需做一次，重装无需重复）：
#   1) 已用 Gradle 构建好 dev 镜像（见 README / dev-values 注释）：
#        airbyte/{server,worker,workload-api-server,workload-launcher,cron,
#                 bootloader,keycloak,keycloak-setup,db,
#                 container-orchestrator,connector-sidecar,workload-init-container}:dev
#   2) 这些镜像已在本地 docker（脚本会自动 kind load 进集群）
#
# 用法：
#   ./tools/jetems-abctl-up.sh
#
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CHART="$REPO_ROOT/charts/v2/airbyte"
VALUES="$REPO_ROOT/dev-values.jetems.yaml"
CLUSTER="${ABCTL_CLUSTER:-airbyte-abctl}"
PORT="${ABCTL_PORT:-8000}"

IMAGES=(
  server worker workload-api-server workload-launcher cron bootloader
  keycloak keycloak-setup db
  container-orchestrator connector-sidecar workload-init-container
)

echo "=== [1/3] abctl local install (chart + dev values) ==="
abctl local install \
  --chart "$CHART" \
  --values "$VALUES" \
  --port "$PORT" \
  --low-resource-mode \
  --no-browser &
ABCTL_PID=$!

echo "=== [2/3] 等 kind 节点出现后 kind load 12 个 dev 镜像 ==="
until docker ps --format '{{.Names}}' | grep -q "${CLUSTER}-control-plane"; do sleep 5; done
for img in "${IMAGES[@]}"; do
  if docker image inspect "airbyte/$img:dev" >/dev/null 2>&1; then
    kind load docker-image "airbyte/$img:dev" --name "$CLUSTER" >/dev/null 2>&1 \
      && echo "  ✅ loaded airbyte/$img:dev" || echo "  ⚠️ load 失败 airbyte/$img:dev"
  else
    echo "  ❌ 本地缺镜像 airbyte/$img:dev（需先 Gradle 构建）"
  fi
done

echo "=== 等 abctl install 完成（建集群+部署+装 ingress）… ==="
wait "$ABCTL_PID" || echo "（abctl 退出码非 0，通常是某 pod 健康等待超时，下一步修 ingress 后再看）"

echo "=== [3/3] 修复 abctl ingress（/->server, /auth->keycloak）==="
"$REPO_ROOT/tools/jetems-abctl-fix-ingress.sh"

echo
echo "================ 完成 ================"
echo "UI:   http://localhost:$PORT"
echo "登录: admin@jetems.com / jetems-local-admin   （simple auth，注意是 .com）"
echo "状态: KUBECONFIG=~/.airbyte/abctl/abctl.kubeconfig kubectl get pods -n airbyte-abctl"
