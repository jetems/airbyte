# Jetems 平台镜像发布（华为云 SWR）

## 目标

- **Tag 格式**：`YYYYMMDD-<commit-sha前6位>`，例：`20260711-a1b2c3`
- **架构**：**原生** `linux/amd64` + `linux/arm64`（**不使用 QEMU**）
- **仓库**：`swr.cn-south-1.myhuaweicloud.com/jetems/<name>:<tag>`（**无** `airbyte/` 中间路径）
- **latest**：每次发版同时推送 multi-arch `…/<name>:latest`（以及 `latest-amd64` / `latest-arm64`），覆盖上一版

## 构建策略（无 QEMU）

| Job | Runner | 动作 |
|-----|--------|------|
| `build` (amd64) | `ubuntu-latest` | 原生构建并推送 `*-amd64` |
| `build` (arm64) | `ubuntu-24.04-arm` | 原生构建并推送 `*-arm64` |
| `manifest` | `ubuntu-latest` | `docker buildx imagetools create` 合并 multi-arch |
| `release` | `ubuntu-latest` | 创建/更新 **GitHub Release**（全部镜像链接 + 中文介绍） |

不在 x86 上用 QEMU 模拟 arm，避免慢且不稳定。

## GitHub Release

`manifest` 成功后自动创建 Release：

- **标题**：`Jetems Platform <YYYYMMDD-sha6>`
- **正文**：由 `tools/jetems-generate-release-notes.sh` 生成，包含：
  - 版本 / 架构 / 仓库说明
  - 全部平台镜像 multi-arch pull 命令与用途简介
  - 单架构 `-amd64` / `-arm64` 调试 tag
- **权限**：`contents: write`（`GITHUB_TOKEN`）
- **重跑**：同 tag 再次发布会更新 Release 正文

本地预览说明：

```bash
DOCKER_TAG=20260711-abc123 ./tools/jetems-generate-release-notes.sh
```

## 触发方式

```bash
./tools/jetems-create-release-tag.sh
```

或 GitHub Actions → **Jetems Publish Platform Images** → Run workflow。

## Secrets

| Secret | 说明 |
|--------|------|
| `SWR_USERNAME` | SWR 登录用户（控制台「登录指令」） |
| `SWR_PASSWORD` | 登录密钥 |

SWR 需有命名空间 **`jetems`**（区域 `cn-south-1`）。

## 镜像示例

```text
swr.cn-south-1.myhuaweicloud.com/jetems/server:20260711-a1b2c3
swr.cn-south-1.myhuaweicloud.com/jetems/server:latest
swr.cn-south-1.myhuaweicloud.com/jetems/server:20260711-a1b2c3-amd64
swr.cn-south-1.myhuaweicloud.com/jetems/server:20260711-a1b2c3-arm64
swr.cn-south-1.myhuaweicloud.com/jetems/server:latest-amd64
swr.cn-south-1.myhuaweicloud.com/jetems/server:latest-arm64
```

本地 Gradle 仍产出 `airbyte/<name>:<tag>`；发布脚本 **retag** 为 `jetems/<name>:<tag>` 再 push（去掉 `airbyte/`）。  
设 `PUBLISH_LATEST=0` 可关闭 latest 推送。
## 默认构建列表

base-java-image、server、worker、workload-api-server、workload-launcher、cron、bootloader、keycloak、keycloak-setup、db、container-orchestrator、connector-sidecar、workload-init-container。

## 本地（单架构）

```bash
export DOCKER_TAG=20260711-abc123
export DOCKER_ARCH=amd64   # 或 arm64，须与本机一致
export SWR_USERNAME=...
export SWR_PASSWORD=...
./tools/jetems-publish-images.sh

# 两架构都推送后，合并 manifest：
CREATE_MANIFEST=1 DOCKER_TAG=20260711-abc123 ./tools/jetems-publish-images.sh
```

## 实现要点

1. **不设** `docker.registry` 给 Gradle 插件（否则会强制 multi-arch + QEMU 路径）
2. 单架构：`DOCKER_PLATFORM=linux/<arch>`，build 到本地 `airbyte/<name>:<tag>-<arch>`
3. `docker tag` + `docker push` 到 SWR 的 `*-amd64` / `*-arm64`
4. `imagetools create` 生成最终 multi-arch tag

## 性能优化（已落地）

| 项 | 之前 | 现在 | 收益 |
|----|------|------|------|
| Gradle 调用 | 每个镜像 `./gradlew` 一次（×13） | base 一次 + 其余 **一次批量** | **最大**：省掉重复配置/依赖解析 |
| Gradle 缓存 | 几乎无跨 run 复用 | `setup-gradle` + `--build-cache` + `~/.gradle` 缓存 | 二次发布明显加快 |
| 并行编译 | 默认偏保守 | `--parallel` + `--max-workers` | 吃满 runner 多核 |
| docker push | 串行 | `xargs -P 4` 并行 | 缩短上传尾部 |
| imagetools | 串行 | 并行 manifest | 节省数分钟 |
| 清盘 | `free-disk-space` 全量 action | 轻量 `rm` + `docker prune` | 常省 5–15min |
| checkout | 全量 / fetch-depth 0 | `fetch-depth: 1`；manifest/release sparse `tools` | 减克隆体积 |
| Node/webapp | 每次冷装 | 仍会编译 webapp（server 依赖）；Gradle/依赖缓存可间接加速 |

### 仍可继续挖的空间（未改代码）

1. **只发变更镜像**：`workflow_dispatch` 已支持 `images=` 子集；文档/脚本变更不必全量 13 个
2. **Docker layer cache**：把 buildx cache 推到 SWR 或 GH cache（需改插件/build 路径，收益视 Dockerfile 而定）
3. **更大 runner**：GitHub larger runners / 自建机（CPU+磁盘），编译 wall-time 近似线性下降
4. **S3 Gradle remote build cache**：若配置 `PLATFORM_BUILD_CACHE_*`（见 `gradle.yml`），可与 OSS 开发构建共享缓存
5. **拆 matrix 按镜像并行**：每个镜像一个 job 可并行，但冷启动×N 与分钟计费上升，一般不如「单 job 批量 Gradle」划算

### 局部发布（最快）

```bash
# 只重建 server + worker
# Actions → Run workflow → images:
#   server|:oss:airbyte-server:dockerBuildImage worker|:oss:airbyte-workers:dockerBuildImage
```

## 注意

1. 仓库需可用 **GitHub-hosted ARM runner**（`ubuntu-24.04-arm`）；私有仓请确认 plan 是否包含 ARM minutes
2. 全量构建仍可能较久（各架构并行，timeout 6h）；二次发布因 Gradle 缓存应明显快于首次
3. 基础镜像 `FROM` 需在对应架构可用（Docker Hub 官方 base / mirrored-keycloak）
4. **`airbyte-base-java-image`** 使用任务 `dockerJavaBaseImage`（不是默认 `dockerBuildImage`）；发版时 tag 取自 `DOCKER_TAG`，本地开发仍用 `.version`（如 `3.3.13`）。业务镜像 Dockerfile 里的 `FROM airbyte/airbyte-base-java-image:3.3*` 仍拉 Docker Hub 公共 base，与 SWR 上的 jetems base 发布相互独立。
