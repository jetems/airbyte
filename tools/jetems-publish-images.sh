#!/usr/bin/env bash
#
# 在当前机器原生架构上构建平台镜像，推送到华为云 SWR（单架构 tag），
# 可选：合并 amd64+arm64 为多架构 manifest。
#
# 镜像命名（Airbyte 插件固定 airbyte/ 前缀）:
#   swr.cn-south-1.myhuaweicloud.com/jetems/airbyte/<name>:<tag>
#   swr.cn-south-1.myhuaweicloud.com/jetems/airbyte/<name>:<tag>-amd64
#   swr.cn-south-1.myhuaweicloud.com/jetems/airbyte/<name>:<tag>-arm64
#
# 环境变量:
#   DOCKER_TAG        必填，发布 tag，如 20260711-a1b2c3（不要带 -amd64/-arm64）
#   DOCKER_ARCH       必填，amd64 或 arm64（原生架构）
#   DOCKER_REGISTRY   默认 swr.cn-south-1.myhuaweicloud.com/jetems
#   SWR_USERNAME / SWR_PASSWORD  可选
#   IMAGES            可选，覆盖模块列表
#   SKIP_PUSH         若为 1，只本地 build 不推送
#   CREATE_MANIFEST   若为 1，假设 -amd64/-arm64 均已推送，合并最终 tag
#
# 用法（CI 在 amd64 / arm64 runner 上各跑一次）:
#   DOCKER_TAG=20260711-abc123 DOCKER_ARCH=amd64 ./tools/jetems-publish-images.sh
#   DOCKER_TAG=20260711-abc123 DOCKER_ARCH=arm64 ./tools/jetems-publish-images.sh
#   DOCKER_TAG=20260711-abc123 CREATE_MANIFEST=1 ./tools/jetems-publish-images.sh
#
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

DOCKER_TAG="${DOCKER_TAG:-}"
DOCKER_ARCH="${DOCKER_ARCH:-}"
DOCKER_REGISTRY="${DOCKER_REGISTRY:-swr.cn-south-1.myhuaweicloud.com/jetems}"
INIT_SCRIPT="$REPO_ROOT/tools/jetems-docker-publish.init.gradle"
SWR_HOST="${SWR_HOST:-swr.cn-south-1.myhuaweicloud.com}"
SKIP_PUSH="${SKIP_PUSH:-0}"
CREATE_MANIFEST="${CREATE_MANIFEST:-0}"

# Gradle 任务 → 本地镜像名 airbyte/<imageName>
# imageName 来自各模块 build.gradle.kts 的 docker { imageName = "..." }
DEFAULT_IMAGES=(
  "airbyte-base-java-image|:oss:airbyte-base-java-image:dockerBuildImage"
  "server|:oss:airbyte-server:dockerBuildImage"
  "worker|:oss:airbyte-workers:dockerBuildImage"
  "workload-api-server|:oss:airbyte-workload-api-server:dockerBuildImage"
  "workload-launcher|:oss:airbyte-workload-launcher:dockerBuildImage"
  "cron|:oss:airbyte-cron:dockerBuildImage"
  "bootloader|:oss:airbyte-bootloader:dockerBuildImage"
  "keycloak|:oss:airbyte-keycloak:dockerBuildImage"
  "keycloak-setup|:oss:airbyte-keycloak-setup:dockerBuildImage"
  "db|:oss:airbyte-db:db-lib:dockerBuildImage"
  "container-orchestrator|:oss:airbyte-container-orchestrator:dockerBuildImage"
  "connector-sidecar|:oss:airbyte-connector-sidecar:dockerBuildImage"
  "workload-init-container|:oss:airbyte-workload-init-container:dockerBuildImage"
)

if [[ -z "$DOCKER_TAG" ]]; then
  echo "ERROR: DOCKER_TAG is required (e.g. 20260711-a1b2c3)" >&2
  exit 1
fi

swr_login() {
  if [[ -n "${SWR_USERNAME:-}" && -n "${SWR_PASSWORD:-}" ]]; then
    echo "Logging in to $SWR_HOST ..."
    echo "$SWR_PASSWORD" | docker login -u "$SWR_USERNAME" --password-stdin "$SWR_HOST"
  else
    echo "SWR_USERNAME/SWR_PASSWORD not set — assuming already logged in to $SWR_HOST"
  fi
}

remote_ref() {
  local name="$1"
  local tag="$2"
  echo "${DOCKER_REGISTRY}/airbyte/${name}:${tag}"
}

# ---------- 仅合并 multi-arch manifest ----------
if [[ "$CREATE_MANIFEST" == "1" ]]; then
  swr_login
  echo "Creating multi-arch manifests for tag=$DOCKER_TAG"
  FAILED=()
  for entry in "${DEFAULT_IMAGES[@]}"; do
    name="${entry%%|*}"
    # skip base image from "required set" display only; still create manifest for all
    dest="$(remote_ref "$name" "$DOCKER_TAG")"
    src_amd="$(remote_ref "$name" "${DOCKER_TAG}-amd64")"
    src_arm="$(remote_ref "$name" "${DOCKER_TAG}-arm64")"
    echo ">>> imagetools create $dest"
    if docker buildx imagetools create -t "$dest" "$src_amd" "$src_arm"; then
      echo ">>> OK $dest"
      # also tag latest? no — user didn't ask
    else
      echo ">>> FAIL $dest" >&2
      FAILED+=("$name")
    fi
  done
  if [[ ${#FAILED[@]} -gt 0 ]]; then
    echo "Manifest failed: ${FAILED[*]}" >&2
    exit 1
  fi
  echo "All multi-arch manifests created for $DOCKER_TAG"
  exit 0
fi

# ---------- 单架构原生构建 + 推送 ----------
if [[ -z "$DOCKER_ARCH" ]]; then
  # auto-detect
  case "$(uname -m)" in
    x86_64|amd64) DOCKER_ARCH=amd64 ;;
    aarch64|arm64) DOCKER_ARCH=arm64 ;;
    *)
      echo "ERROR: cannot detect arch; set DOCKER_ARCH=amd64|arm64" >&2
      exit 1
      ;;
  esac
fi

if [[ "$DOCKER_ARCH" != "amd64" && "$DOCKER_ARCH" != "arm64" ]]; then
  echo "ERROR: DOCKER_ARCH must be amd64 or arm64 (got $DOCKER_ARCH)" >&2
  exit 1
fi

DOCKER_PLATFORM="linux/${DOCKER_ARCH}"
ARCH_TAG="${DOCKER_TAG}-${DOCKER_ARCH}"

# 解析要构建的列表
IMAGES_LIST=("${DEFAULT_IMAGES[@]}")
if [[ -n "${IMAGES:-}" ]]; then
  # IMAGES 为 "name|task name|task ..." 或仅 task；兼容只传 gradle 任务
  IMAGES_LIST=()
  # shellcheck disable=SC2206
  raw=($IMAGES)
  for item in "${raw[@]}"; do
    if [[ "$item" == *"|"* ]]; then
      IMAGES_LIST+=("$item")
    else
      # task only: derive name from task path crudely
      short="${item##*:oss:}"
      short="${short%%:dockerBuildImage}"
      short="${short##*airbyte-}"
      short="${short//\//-}"
      # map known
      case "$item" in
        *airbyte-workers*) short=worker ;;
        *db-lib*) short=db ;;
        *airbyte-server*) short=server ;;
        *base-java-image*) short=airbyte-base-java-image ;;
      esac
      IMAGES_LIST+=("${short}|${item}")
    fi
  done
fi

echo "=========================================="
echo "DOCKER_TAG      = $DOCKER_TAG"
echo "DOCKER_ARCH     = $DOCKER_ARCH (native)"
echo "DOCKER_PLATFORM = $DOCKER_PLATFORM"
echo "ARCH_TAG        = $ARCH_TAG"
echo "DOCKER_REGISTRY = $DOCKER_REGISTRY"
echo "IMAGES          = ${#IMAGES_LIST[@]}"
echo "=========================================="

if [[ "$SKIP_PUSH" != "1" ]]; then
  swr_login
fi

export DOCKER_TAG="$ARCH_TAG"
export DOCKER_PLATFORM
export VERSION="$ARCH_TAG"
# 不 export DOCKER_REGISTRY，避免插件 multi-arch + remote push

GRADLE_ARGS=(
  --init-script "$INIT_SCRIPT"
  -Dorg.gradle.jvmargs="-Xmx6g"
  --no-daemon
)

FAILED=()
SUCCEEDED=()

for entry in "${IMAGES_LIST[@]}"; do
  name="${entry%%|*}"
  task="${entry#*|}"
  echo ""
  echo ">>> [native $DOCKER_ARCH] build $name  ($task)  tag=$ARCH_TAG"
  if ./gradlew "${GRADLE_ARGS[@]}" "$task"; then
    local_img="airbyte/${name}:${ARCH_TAG}"
    remote_img="$(remote_ref "$name" "$ARCH_TAG")"
    echo ">>> docker tag $local_img → $remote_img"
    if ! docker image inspect "$local_img" >/dev/null 2>&1; then
      # 有的模块 imageName 不含路径前缀变化，再试
      echo "WARNING: local image $local_img not found, listing airbyte/*:${ARCH_TAG}" >&2
      docker images "airbyte/*:${ARCH_TAG}" || docker images | head -30 || true
    fi
    docker tag "$local_img" "$remote_img"
    if [[ "$SKIP_PUSH" != "1" ]]; then
      echo ">>> docker push $remote_img"
      docker push "$remote_img"
    fi
    SUCCEEDED+=("$name")
    echo ">>> OK $name"
  else
    FAILED+=("$name")
    echo ">>> FAIL $name" >&2
  fi
done

echo ""
echo "=========================================="
echo "Arch=$DOCKER_ARCH Succeeded (${#SUCCEEDED[@]}): ${SUCCEEDED[*]:-none}"
echo "Arch=$DOCKER_ARCH Failed (${#FAILED[@]}): ${FAILED[*]:-none}"
echo "Pushed tags: *- ${ARCH_TAG}"
echo "Next: run on the other arch, then CREATE_MANIFEST=1 to merge $DOCKER_TAG"
echo "=========================================="

if [[ ${#FAILED[@]} -gt 0 ]]; then
  exit 1
fi
