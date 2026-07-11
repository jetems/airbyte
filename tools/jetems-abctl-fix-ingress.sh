#!/usr/bin/env bash
#
# jetems-abctl-fix-ingress.sh
#
# 修复 abctl 自建 ingress（ingress-abctl），使其在我们的 dev 部署下可用。
#
# 背景：
#   - 我们禁用了 webapp（前端已打进 server 镜像），但 abctl 的 ingress 默认把
#     "/" 路由到不存在的 airbyte-webapp-svc → 503。
#   - abctl 的 ingress 也不含 "/auth" 路由（正常由 webapp 的 nginx 代理）。
#   本脚本把 ingress 的 paths 整体替换为：
#       /auth  -> keycloak-svc:8180   （切到 keycloak OIDC SSO 时需要；simple auth 下无害）
#       /      -> server-svc:8001     （server 自带前端 + API）
#
#   这个 ingress 由 abctl 创建、不归 Helm chart 管理，所以：
#     - `helm upgrade` 不会动它（patch 不丢）
#     - `abctl local install` 会重建它（patch 会丢）→ 重装后重跑本脚本即可
#
# 用法：
#   ./tools/jetems-abctl-fix-ingress.sh
#
# 幂等：整体替换 paths，重复执行结果一致。
set -euo pipefail

KUBECONFIG_PATH="${KUBECONFIG:-$HOME/.airbyte/abctl/abctl.kubeconfig}"
export KUBECONFIG="$KUBECONFIG_PATH"

NS="${AIRBYTE_NAMESPACE:-airbyte-abctl}"
INGRESS="${AIRBYTE_INGRESS:-ingress-abctl}"
SERVER_SVC="${AIRBYTE_SERVER_SVC:-airbyte-abctl-airbyte-server-svc}"
SERVER_PORT="${AIRBYTE_SERVER_PORT:-8001}"
KEYCLOAK_SVC="${AIRBYTE_KEYCLOAK_SVC:-airbyte-abctl-airbyte-keycloak-svc}"
KEYCLOAK_PORT="${AIRBYTE_KEYCLOAK_PORT:-8180}"

echo "[fix-ingress] KUBECONFIG=$KUBECONFIG"
echo "[fix-ingress] 等待 ingress '$INGRESS' (ns=$NS) 出现…"
for i in $(seq 1 60); do
  if kubectl get ingress -n "$NS" "$INGRESS" >/dev/null 2>&1; then
    break
  fi
  sleep 2
  [ "$i" = 60 ] && { echo "[fix-ingress] ❌ 超时：找不到 ingress $INGRESS"; exit 1; }
done

echo "[fix-ingress] 重写 ingress paths（/auth->keycloak, /->server）…"
kubectl patch ingress -n "$NS" "$INGRESS" --type=json -p="[
  {\"op\":\"replace\",\"path\":\"/spec/rules/0/http/paths\",\"value\":[
    {\"path\":\"/auth\",\"pathType\":\"Prefix\",\"backend\":{\"service\":{\"name\":\"$KEYCLOAK_SVC\",\"port\":{\"number\":$KEYCLOAK_PORT}}}},
    {\"path\":\"/\",\"pathType\":\"Prefix\",\"backend\":{\"service\":{\"name\":\"$SERVER_SVC\",\"port\":{\"number\":$SERVER_PORT}}}}
  ]}
]"

echo "[fix-ingress] 当前 paths:"
kubectl get ingress -n "$NS" "$INGRESS" -o jsonpath='{range .spec.rules[0].http.paths[*]}  {.path} -> {.backend.service.name}:{.backend.service.port.number}{"\n"}{end}'

echo "[fix-ingress] 验证 http://localhost:8000/ …"
sleep 3
code=$(curl -s -m8 -o /dev/null -w "%{http_code}" http://localhost:8000/ || echo 000)
echo "[fix-ingress] localhost:8000/ => HTTP $code"
[ "$code" = "200" ] && echo "[fix-ingress] ✅ ingress 完成" || echo "[fix-ingress] ⚠️ 非 200，可能 server 尚未就绪，稍后重试"

# --- Keycloak Admin hostname（abctl 8000→80 丢端口）---
# 企业版 chart 把 KEYCLOAK_HOSTNAME_URL 置空；Admin 用请求头拼 URL 会变成
# Location: http://localhost/auth/admin/...（无 :8000）。
# 镜像 entrypoint 映射：KEYCLOAK_HOSTNAME_URL / KEYCLOAK_HOSTNAME_ADMIN_URL。
# 勿在 Helm values 的 extraEnv 里重复 KEYCLOAK_HOSTNAME_URL（与 chart valueFrom 冲突）。
KEYCLOAK_STS="${AIRBYTE_KEYCLOAK_STS:-airbyte-abctl-keycloak}"
KEYCLOAK_PUBLIC_URL="${AIRBYTE_KEYCLOAK_PUBLIC_URL:-http://localhost:${ABCTL_PORT:-8000}/auth}"
echo "[fix-ingress] 钉死 Keycloak hostname → $KEYCLOAK_PUBLIC_URL …"
if kubectl get sts -n "$NS" "$KEYCLOAK_STS" >/dev/null 2>&1; then
  kubectl patch cm -n "$NS" airbyte-abctl-airbyte-env --type=merge \
    -p "{\"data\":{\"KEYCLOAK_HOSTNAME_URL\":\"$KEYCLOAK_PUBLIC_URL\"}}" >/dev/null 2>&1 || true
  # set env 用 plain value，覆盖 chart 注入的空 valueFrom；会滚动重启 STS
  kubectl set env sts/"$KEYCLOAK_STS" -n "$NS" \
    "KEYCLOAK_HOSTNAME_URL=$KEYCLOAK_PUBLIC_URL" \
    "KEYCLOAK_HOSTNAME_ADMIN_URL=$KEYCLOAK_PUBLIC_URL" >/dev/null
  echo "[fix-ingress] 等待 keycloak 就绪…"
  kubectl rollout status sts/"$KEYCLOAK_STS" -n "$NS" --timeout=180s || \
    echo "[fix-ingress] ⚠️ keycloak 滚动未在 180s 内完成，稍后自查"
  # 校验 Admin 跳转是否带 :8000
  sleep 2
  loc=$(curl -sI -m8 "http://localhost:${ABCTL_PORT:-8000}/auth/admin/" 2>/dev/null | awk 'tolower($1)=="location:"{print $2}' | tr -d '\r')
  echo "[fix-ingress] /auth/admin/ → Location: ${loc:-<none>}"
  if echo "${loc:-}" | grep -q "${ABCTL_PORT:-8000}"; then
    echo "[fix-ingress] ✅ Keycloak Admin hostname 正常"
  else
    echo "[fix-ingress] ⚠️ Admin 跳转仍可能丢端口；可 port-forward 8180 临时访问"
  fi
else
  echo "[fix-ingress] ⚠️ 找不到 STS $KEYCLOAK_STS，跳过 Keycloak hostname 修复"
fi
