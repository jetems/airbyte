#!/usr/bin/env bash
#
# 生成 Jetems 平台镜像 GitHub Release 说明（中文）。
#
# 环境变量:
#   DOCKER_TAG        必填，如 20260711-a1b2c3
#   DOCKER_REGISTRY   默认 swr.cn-south-1.myhuaweicloud.com/jetems
#   COMMIT_SHA        可选，完整 commit sha
#   OUTPUT            可选，写入文件路径；默认 stdout
#
# 用法:
#   DOCKER_TAG=20260711-abc123 ./tools/jetems-generate-release-notes.sh
#   DOCKER_TAG=... OUTPUT=notes.md ./tools/jetems-generate-release-notes.sh
#
set -euo pipefail

DOCKER_TAG="${DOCKER_TAG:-}"
DOCKER_REGISTRY="${DOCKER_REGISTRY:-swr.cn-south-1.myhuaweicloud.com/jetems}"
COMMIT_SHA="${COMMIT_SHA:-}"
OUTPUT="${OUTPUT:-}"

if [[ -z "$DOCKER_TAG" ]]; then
  echo "ERROR: DOCKER_TAG is required" >&2
  exit 1
fi

# name|中文简介
# 与 tools/jetems-publish-images.sh 的 DEFAULT_IMAGES 名称保持一致
IMAGES=(
  "airbyte-base-java-image|Java 运行时基础镜像（平台服务公共 base）"
  "server|主 REST API / 控制平面（配置、连接、作业编排入口）"
  "worker|同步与检查作业执行 Worker（Temporal 工作流）"
  "workload-api-server|Workload 生命周期 API（调度与状态）"
  "workload-launcher|在 Kubernetes 上拉起 Workload Pod"
  "cron|定时任务（清理、调度、维护类任务）"
  "bootloader|集群启动迁移与初始化（DB schema / 引导）"
  "keycloak|企业版身份认证（Keycloak SSO）"
  "keycloak-setup|Keycloak realm / 客户端一次性初始化"
  "db|Airbyte 元数据 Postgres 镜像"
  "container-orchestrator|容器编排（连接器运行时协调）"
  "connector-sidecar|连接器侧车（日志 / 状态 / 通信辅助）"
  "workload-init-container|Workload 初始化容器（启动前准备）"
)

remote_ref() {
  local name="$1"
  local tag="$2"
  # swr.../jetems/<name>:<tag>（无 airbyte/ 前缀）
  echo "${DOCKER_REGISTRY}/${name}:${tag}"
}

# 用单引号 heredoc 避免 markdown 反引号被 shell 当作命令替换
write_body() {
  local commit_line=""
  local blob_ref="main"
  if [[ -n "$COMMIT_SHA" ]]; then
    commit_line="**Git Commit**：\`${COMMIT_SHA}\`"
    blob_ref="$COMMIT_SHA"
  fi

  cat <<EOF
## Jetems 平台镜像发布

**版本标签**：\`${DOCKER_TAG}\`（同时覆盖 multi-arch \`latest\`）
**架构**：\`linux/amd64\` + \`linux/arm64\`（原生构建，无 QEMU）
**镜像仓库**：华为云 SWR \`${DOCKER_REGISTRY}\`
${commit_line}

本 Release 对应一次完整的 **Airbyte Platform（Jetems 二开）** 平台镜像发布。连接器镜像不在本仓库构建，仍由独立 connector 仓库发布。

### 使用说明

1. 登录华为云 SWR 后拉取（或配置集群 imagePullSecrets）。
2. Helm / abctl 部署时，将镜像仓库指向 \`${DOCKER_REGISTRY}\`。
3. **固定版本**：用 \`${DOCKER_TAG}\`；**滚动最新**：用 \`latest\`（每次发版会覆盖）。
4. 多架构 tag（无 \`-amd64\`/\`-arm64\` 后缀）会按节点架构自动选择。

\`\`\`bash
# 登录 SWR（示例）
docker login -u '<SWR_USERNAME>' swr.cn-south-1.myhuaweicloud.com

# 固定版本
docker pull $(remote_ref server "$DOCKER_TAG")
# 或始终拉最新发版
docker pull $(remote_ref server latest)
\`\`\`

### 镜像列表（multi-arch）

| 镜像 | 说明 | Pull |
|------|------|------|
EOF

  for entry in "${IMAGES[@]}"; do
    local name="${entry%%|*}"
    local desc="${entry#*|}"
    local ref
    ref="$(remote_ref "$name" "$DOCKER_TAG")"
    printf '| `%s` | %s | `docker pull %s` |\n' "$name" "$desc" "$ref"
  done

  cat <<EOF

### 完整引用（multi-arch）

\`\`\`text
EOF

  for entry in "${IMAGES[@]}"; do
    remote_ref "${entry%%|*}" "$DOCKER_TAG"
  done

  cat <<EOF
\`\`\`

### latest（multi-arch，每次发版覆盖）

\`\`\`text
EOF

  for entry in "${IMAGES[@]}"; do
    remote_ref "${entry%%|*}" "latest"
  done

  cat <<EOF
\`\`\`

### 单架构 tag（调试用）

每个镜像另有：

- \`…/<name>:${DOCKER_TAG}-amd64\` / \`…/<name>:${DOCKER_TAG}-arm64\`
- \`…/<name>:latest-amd64\` / \`…/<name>:latest-arm64\`

示例：

\`\`\`bash
docker pull $(remote_ref server "${DOCKER_TAG}-amd64")
docker pull $(remote_ref server "${DOCKER_TAG}-arm64")
docker pull $(remote_ref server latest-amd64)
docker pull $(remote_ref server latest-arm64)
\`\`\`

### 镜像说明详情

EOF

  for entry in "${IMAGES[@]}"; do
    local name="${entry%%|*}"
    local desc="${entry#*|}"
    cat <<EOF
#### \`${name}\`

${desc}

- multi-arch: \`$(remote_ref "$name" "$DOCKER_TAG")\`
- latest: \`$(remote_ref "$name" "latest")\`
- amd64: \`$(remote_ref "$name" "${DOCKER_TAG}-amd64")\` / \`$(remote_ref "$name" "latest-amd64")\`
- arm64: \`$(remote_ref "$name" "${DOCKER_TAG}-arm64")\` / \`$(remote_ref "$name" "latest-arm64")\`

EOF
  done

  cat <<EOF
### 相关文档

- 发布流程：[tools/JETEMS_IMAGE_PUBLISH.md](../blob/${blob_ref}/tools/JETEMS_IMAGE_PUBLISH.md)
- 创建 tag：\`./tools/jetems-create-release-tag.sh\`
- 项目说明：[README.md](../blob/${blob_ref}/README.md)

---

*由 GitHub Actions「Jetems Publish Platform Images」在 multi-arch manifest 合并成功后自动创建。*
EOF
}

if [[ -n "$OUTPUT" ]]; then
  write_body >"$OUTPUT"
  echo "Wrote release notes to $OUTPUT" >&2
else
  write_body
fi
