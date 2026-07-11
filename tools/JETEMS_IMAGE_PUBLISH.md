# Jetems 平台镜像发布（华为云 SWR）

## 目标

- **Tag 格式**：`YYYYMMDD-<commit-sha前6位>`，例：`20260711-a1b2c3`
- **架构**：**原生** `linux/amd64` + `linux/arm64`（**不使用 QEMU**）
- **仓库**：`swr.cn-south-1.myhuaweicloud.com/jetems/airbyte/<name>:<tag>`

## 构建策略（无 QEMU）

| Job | Runner | 动作 |
|-----|--------|------|
| `build` (amd64) | `ubuntu-latest` | 原生构建并推送 `*-amd64` |
| `build` (arm64) | `ubuntu-24.04-arm` | 原生构建并推送 `*-arm64` |
| `manifest` | `ubuntu-latest` | `docker buildx imagetools create` 合并 multi-arch |

不在 x86 上用 QEMU 模拟 arm，避免慢且不稳定。

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
swr.cn-south-1.myhuaweicloud.com/jetems/airbyte/server:20260711-a1b2c3
swr.cn-south-1.myhuaweicloud.com/jetems/airbyte/server:20260711-a1b2c3-amd64
swr.cn-south-1.myhuaweicloud.com/jetems/airbyte/server:20260711-a1b2c3-arm64
```

（Gradle 插件固定在 registry 后加 `airbyte/` 前缀。）

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

## 注意

1. 仓库需可用 **GitHub-hosted ARM runner**（`ubuntu-24.04-arm`）；私有仓请确认 plan 是否包含 ARM minutes
2. 全量构建仍可能较久（各架构并行，timeout 6h）
3. 基础镜像 `FROM` 需在对应架构可用（Docker Hub 官方 base / mirrored-keycloak）
