#!/usr/bin/env bash
#
# 创建并推送发布 tag：YYYYMMDD-<commit-sha 前 6 位>
# 推送后将触发 .github/workflows/jetems-publish-images.yml
#
# 用法:
#   ./tools/jetems-create-release-tag.sh           # 创建并 push
#   ./tools/jetems-create-release-tag.sh --dry-run  # 只打印 tag 名
#   ./tools/jetems-create-release-tag.sh --local    # 只本地打 tag，不 push
#
set -euo pipefail

DRY_RUN=false
LOCAL_ONLY=false
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
    --local) LOCAL_ONLY=true ;;
    -h|--help)
      sed -n '2,12p' "$0"
      exit 0
      ;;
  esac
done

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "ERROR: not a git repository" >&2
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "WARNING: working tree is not clean. Tag will point at current HEAD commit only." >&2
fi

DATE_UTC="$(date -u +%Y%m%d)"
SHA6="$(git rev-parse --short=6 HEAD)"
TAG="${DATE_UTC}-${SHA6}"

# 校验格式
if ! [[ "$TAG" =~ ^[0-9]{8}-[0-9a-f]{6}$ ]]; then
  echo "ERROR: generated tag '$TAG' does not match YYYYMMDD-sha6" >&2
  exit 1
fi

echo "Tag:    $TAG"
echo "Commit: $(git rev-parse HEAD)"
echo "Date:   $DATE_UTC (UTC)"

if $DRY_RUN; then
  echo "(dry-run) not creating tag"
  exit 0
fi

if git rev-parse "$TAG" >/dev/null 2>&1; then
  echo "ERROR: tag '$TAG' already exists" >&2
  exit 1
fi

git tag -a "$TAG" -m "jetems platform release $TAG"
echo "Created annotated tag $TAG"

if $LOCAL_ONLY; then
  echo "Local only. Push with: git push origin $TAG"
  exit 0
fi

git push origin "$TAG"
echo "Pushed origin $TAG — GitHub Action jetems-publish-images should start."
