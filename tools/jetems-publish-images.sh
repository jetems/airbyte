#!/usr/bin/env bash
#
# 在当前机器原生架构上构建平台镜像，推送到华为云 SWR（单架构 tag），
# 可选：合并 amd64+arm64 为多架构 manifest。
#
# 性能要点:
#   - base 镜像单独先编，其余 dockerBuildImage 一次 Gradle 调用（避免 N 次冷启动）
#   - Gradle daemon + parallel + build cache
#   - docker push 并行
#   - manifest 合并并行
#
# 镜像命名（SWR 组织 jetems，无 airbyte/ 中间路径）:
#   swr.cn-south-1.myhuaweicloud.com/jetems/<name>:<tag>           (multi-arch)
#   swr.cn-south-1.myhuaweicloud.com/jetems/<name>:latest          (multi-arch，每次发版覆盖)
#   swr.cn-south-1.myhuaweicloud.com/jetems/<name>:<tag>-amd64
#   swr.cn-south-1.myhuaweicloud.com/jetems/<name>:<tag>-arm64
#   swr.cn-south-1.myhuaweicloud.com/jetems/<name>:latest-amd64
#   swr.cn-south-1.myhuaweicloud.com/jetems/<name>:latest-arm64
# Gradle 本地仍构建为 airbyte/<name>:<tag>（插件固定），push 时 retag 到 jetems/<name>。
#
# 环境变量:
#   DOCKER_TAG        必填，发布 tag，如 20260711-a1b2c3（不要带 -amd64/-arm64）
#   DOCKER_ARCH       必填，amd64 或 arm64（原生架构）
#   DOCKER_REGISTRY   默认 swr.cn-south-1.myhuaweicloud.com/jetems
#   SWR_USERNAME / SWR_PASSWORD  可选
#   IMAGES            可选，覆盖模块列表
#   SKIP_PUSH         若为 1，只本地 build 不推送
#   CREATE_MANIFEST   若为 1，假设 -amd64/-arm64 均已推送，合并最终 tag
#   PUBLISH_LATEST    默认 1；设为 0 则不推 latest / latest-<arch>
#   PUSH_JOBS         并行 push 数，默认 4
#   MANIFEST_JOBS     并行 manifest 数，默认 4
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
PUSH_JOBS="${PUSH_JOBS:-4}"
MANIFEST_JOBS="${MANIFEST_JOBS:-4}"
PUBLISH_LATEST="${PUBLISH_LATEST:-1}"

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
  # DOCKER_REGISTRY 默认含组织名 jetems → swr.../jetems/<name>:<tag>
  echo "${DOCKER_REGISTRY}/${name}:${tag}"
}

nproc_safe() {
  if command -v nproc >/dev/null 2>&1; then
    nproc
  else
    sysctl -n hw.ncpu 2>/dev/null || echo 4
  fi
}

# ---------- 仅合并 multi-arch manifest ----------
if [[ "$CREATE_MANIFEST" == "1" ]]; then
  swr_login
  echo "Creating multi-arch manifests for tag=$DOCKER_TAG (parallel jobs=$MANIFEST_JOBS)"

  manifest_one() {
    local name="$1"
    local dest src_amd src_arm dest_latest
    dest="$(remote_ref "$name" "$DOCKER_TAG")"
    src_amd="$(remote_ref "$name" "${DOCKER_TAG}-amd64")"
    src_arm="$(remote_ref "$name" "${DOCKER_TAG}-arm64")"
    echo ">>> imagetools create $dest"
    if ! docker buildx imagetools create -t "$dest" "$src_amd" "$src_arm"; then
      echo ">>> FAIL $dest" >&2
      return 1
    fi
    echo ">>> OK $dest"
    # 每次发版同步 multi-arch latest（指向同一组 arch 镜像）
    if [[ "${PUBLISH_LATEST:-1}" == "1" ]]; then
      dest_latest="$(remote_ref "$name" "latest")"
      echo ">>> imagetools create $dest_latest (from same arch digests)"
      if ! docker buildx imagetools create -t "$dest_latest" "$src_amd" "$src_arm"; then
        echo ">>> FAIL $dest_latest" >&2
        return 1
      fi
      echo ">>> OK $dest_latest"
    fi
    return 0
  }
  export -f manifest_one remote_ref
  export DOCKER_REGISTRY DOCKER_TAG PUBLISH_LATEST

  FAILED_FILE="$(mktemp)"
  trap 'rm -f "$FAILED_FILE"' EXIT

  printf '%s\n' "${DEFAULT_IMAGES[@]}" | while IFS= read -r entry; do
    echo "${entry%%|*}"
  done | xargs -P "$MANIFEST_JOBS" -I{} bash -c '
    if ! manifest_one "$1"; then
      echo "$1" >> "'"$FAILED_FILE"'"
    fi
  ' _ {}

  if [[ -s "$FAILED_FILE" ]]; then
    echo "Manifest failed: $(tr '\n' ' ' <"$FAILED_FILE")" >&2
    exit 1
  fi
  echo "All multi-arch manifests created for $DOCKER_TAG"
  exit 0
fi

# ---------- 单架构原生构建 + 推送 ----------
if [[ -z "$DOCKER_ARCH" ]]; then
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
CPUS="$(nproc_safe)"
# 留 1 核给 OS/docker，至少 2
GRADLE_WORKERS=$(( CPUS > 2 ? CPUS - 1 : CPUS ))
[[ "$GRADLE_WORKERS" -lt 1 ]] && GRADLE_WORKERS=1

# 解析要构建的列表
IMAGES_LIST=("${DEFAULT_IMAGES[@]}")
if [[ -n "${IMAGES:-}" ]]; then
  IMAGES_LIST=()
  # shellcheck disable=SC2206
  raw=($IMAGES)
  for item in "${raw[@]}"; do
    if [[ "$item" == *"|"* ]]; then
      IMAGES_LIST+=("$item")
    else
      short="${item##*:oss:}"
      short="${short%%:dockerBuildImage}"
      short="${short##*airbyte-}"
      short="${short//\//-}"
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
echo "CPUS/WORKERS    = $CPUS / $GRADLE_WORKERS"
echo "PUSH_JOBS       = $PUSH_JOBS"
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
  --parallel
  --build-cache
  --max-workers="$GRADLE_WORKERS"
  -Dorg.gradle.jvmargs="-Xmx6g -XX:+UseParallelGC"
  -Dorg.gradle.caching=true
  -Dorg.gradle.parallel=true
  # 一次调用编多个模块：保留 daemon，第二次（base→rest）可复用
  --daemon
)

# 拆分：base 先编（其它 Java 镜像 FROM 依赖），其余一次 Gradle 批量编
BASE_ENTRIES=()
REST_ENTRIES=()
for entry in "${IMAGES_LIST[@]}"; do
  name="${entry%%|*}"
  if [[ "$name" == "airbyte-base-java-image" ]]; then
    BASE_ENTRIES+=("$entry")
  else
    REST_ENTRIES+=("$entry")
  fi
done

run_gradle_tasks() {
  local -a tasks=("$@")
  if [[ ${#tasks[@]} -eq 0 ]]; then
    return 0
  fi
  echo ""
  echo ">>> [native $DOCKER_ARCH] gradle batch (${#tasks[@]} tasks): ${tasks[*]}"
  # --continue：尽量编完所有镜像，再统一检查
  ./gradlew "${GRADLE_ARGS[@]}" --continue "${tasks[@]}"
}

BASE_TASKS=()
for entry in "${BASE_ENTRIES[@]+"${BASE_ENTRIES[@]}"}"; do
  [[ -n "$entry" ]] || continue
  BASE_TASKS+=("${entry#*|}")
done
REST_TASKS=()
for entry in "${REST_ENTRIES[@]+"${REST_ENTRIES[@]}"}"; do
  [[ -n "$entry" ]] || continue
  REST_TASKS+=("${entry#*|}")
done

BUILD_RC=0
if [[ ${#BASE_TASKS[@]} -gt 0 ]]; then
  if ! run_gradle_tasks "${BASE_TASKS[@]}"; then
    BUILD_RC=1
    echo "WARNING: base image gradle batch reported failures" >&2
  fi
fi
if [[ ${#REST_TASKS[@]} -gt 0 ]]; then
  if ! run_gradle_tasks "${REST_TASKS[@]}"; then
    BUILD_RC=1
    echo "WARNING: platform images gradle batch reported failures" >&2
  fi
fi

# tag + push（可并行）：版本 arch tag + latest-<arch>
tag_and_push_one() {
  local name="$1"
  local local_img="airbyte/${name}:${ARCH_TAG}"
  local remote_img remote_latest
  remote_img="$(remote_ref "$name" "$ARCH_TAG")"
  remote_latest="$(remote_ref "$name" "latest-${DOCKER_ARCH}")"

  if ! docker image inspect "$local_img" >/dev/null 2>&1; then
    echo ">>> MISSING local image $local_img" >&2
    return 1
  fi
  echo ">>> docker tag $local_img → $remote_img"
  docker tag "$local_img" "$remote_img"
  if [[ "$SKIP_PUSH" != "1" ]]; then
    echo ">>> docker push $remote_img"
    docker push "$remote_img"
  fi
  if [[ "${PUBLISH_LATEST:-1}" == "1" ]]; then
    echo ">>> docker tag $local_img → $remote_latest"
    docker tag "$local_img" "$remote_latest"
    if [[ "$SKIP_PUSH" != "1" ]]; then
      echo ">>> docker push $remote_latest"
      docker push "$remote_latest"
    fi
  fi
  echo ">>> OK $name"
  return 0
}
export -f tag_and_push_one remote_ref
export ARCH_TAG DOCKER_ARCH DOCKER_REGISTRY SKIP_PUSH PUBLISH_LATEST

FAILED_FILE="$(mktemp)"
OK_FILE="$(mktemp)"
trap 'rm -f "$FAILED_FILE" "$OK_FILE"' EXIT

printf '%s\n' "${IMAGES_LIST[@]}" | while IFS= read -r entry; do
  echo "${entry%%|*}"
done | xargs -P "$PUSH_JOBS" -I{} bash -c '
  if tag_and_push_one "$1"; then
    echo "$1" >> "'"$OK_FILE"'"
  else
    echo "$1" >> "'"$FAILED_FILE"'"
  fi
' _ {}

SUCCEEDED=()
FAILED=()
if [[ -s "$OK_FILE" ]]; then
  mapfile -t SUCCEEDED <"$OK_FILE"
fi
if [[ -s "$FAILED_FILE" ]]; then
  mapfile -t FAILED <"$FAILED_FILE"
fi

echo ""
echo "=========================================="
echo "Arch=$DOCKER_ARCH Succeeded (${#SUCCEEDED[@]}): ${SUCCEEDED[*]:-none}"
echo "Arch=$DOCKER_ARCH Failed (${#FAILED[@]}): ${FAILED[*]:-none}"
echo "Pushed tags: *-${ARCH_TAG}"
if [[ "$PUBLISH_LATEST" == "1" ]]; then
  echo "Also pushed: *:latest-${DOCKER_ARCH}"
fi
echo "Next: run on the other arch, then CREATE_MANIFEST=1 to merge version + latest"
# DOCKER_TAG was overwritten with ARCH_TAG for gradle; recover base from ARCH_TAG
BASE_TAG="${ARCH_TAG%-amd64}"
BASE_TAG="${BASE_TAG%-arm64}"
echo "Manifest tags would be: $BASE_TAG and latest"
echo "=========================================="

if [[ ${#FAILED[@]} -gt 0 ]] || [[ "$BUILD_RC" -ne 0 && ${#SUCCEEDED[@]} -eq 0 ]]; then
  exit 1
fi
if [[ ${#FAILED[@]} -gt 0 ]]; then
  exit 1
fi
