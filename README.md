# Jetems Airbyte 平台

基于 [Airbyte Platform](https://github.com/airbytehq/airbyte-platform) 的**二次开发版数据集成平台**，用于将 API、数据库、文件等数据源同步到数仓、数据湖与业务库。

本仓库维护的是 **平台本身**（调度、API、Web UI、企业版能力、部署与镜像），**不包含**各 Connector 的实现源码。Connector 以 Docker 镜像形式在运行时从 Registry 拉取。

---

## 项目定位

| 维度 | 说明 |
|------|------|
| **上游** | `airbytehq/airbyte-platform`（平台） |
| **Connector 源码仓** | `airbytehq/airbyte`（本仓库不包含） |
| **本仓库** | jetems 二开：`jetems/airbyte` |
| **产品形态** | 自托管企业版能力栈（Keycloak、RBAC、Workload 等）+ 中文化 |

Airbyte 官方将连接器做成遵循 [Airbyte Protocol](https://docs.airbyte.com/understanding-airbyte/airbyte-protocol/) 的镜像；平台负责任务编排（Temporal）、配置与密钥、同步生命周期、Connector Builder 等。本项目在此基础上增加了面向国内使用与交付的能力。

---

## 二开能力概览

相对上游平台，jetems 当前主要增强包括：

### 1. 中文界面与连接器设置指南

- 前端 UI 中英文切换（`zh.json` / `I18nProvider`）
- 连接器右侧 **设置指南** 支持中文：优先读取仓库内 `docs-zh` 静态文档，缺失时回退官方英文
- 覆盖约 **700+** 篇源/目标/企业连接器说明（路径与官方 `docs/integrations` 对齐）

### 2. 企业版本地可运行

- 默认按 **企业版** 部署（Keycloak、Workload 全链路）
- 本地评估：entitlement 全开 + license 状态展示优化（详见开发规范；**商用须合规使用许可证**）

### 3. 本地一键开发环境（abctl）

- 使用 **abctl + kind + Helm charts/v2** 拉起完整栈
- 前端打入 `server` 镜像，ingress 路由 `/` → server、`/auth` → keycloak
- 脚本修复 abctl 默认 ingress 与 Keycloak hostname（避免 Admin 跳转丢端口）

### 4. 镜像发布到华为云 SWR

- 按 Tag 自动构建 **原生 amd64 + arm64** 平台镜像（不使用 QEMU）
- 推送到 `swr.cn-south-1.myhuaweicloud.com/jetems/airbyte/<服务>:<tag>`
- Tag 格式：`YYYYMMDD-<commit-sha前6位>`，例如 `20260711-a1b2c3`

---

## 架构一览

```
                         ┌──────────────────────────┐
  开发者 / 运维          │  abctl / Helm / SWR 镜像  │
                         └────────────┬─────────────┘
                                      │
     ┌────────────────────────────────┼────────────────────────────────┐
     │                         Kubernetes / kind                        │
     │  ┌─────────┐  ┌────────┐  ┌──────────┐  ┌───────────────────┐  │
     │  │ server  │  │ worker │  │ workload │  │ keycloak (+setup) │  │
     │  │(+webapp)│  │        │  │ api/launch│ │                   │  │
     │  └────┬────┘  └───┬────┘  └─────┬────┘  └─────────┬─────────┘  │
     │       │           │             │                  │            │
     │       └───────────┼─────────────┼──────────────────┘            │
     │                   │             │                               │
     │            Temporal / Postgres / MinIO                          │
     │                   │                                             │
     │         同步 Job 拉取 Connector 镜像                             │
     │         (airbyte/source-* · destination-*)                      │
     └─────────────────────────────────────────────────────────────────┘
```

**本仓库构建的是中间「平台服务」镜像**；Connector 镜像来自官方或私有镜像仓库。

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 后端 | Kotlin · Micronaut · Gradle 9 · JDK **21** |
| 前端 | React · TypeScript · pnpm **8.6.12** · Node **20** |
| 编排 | Temporal |
| 认证 | Keycloak（企业版） |
| 部署 | Helm charts/v2 · abctl · kind（本地） |
| 镜像 | Gradle 插件 `io.airbyte.gradle.docker`（Buildx） |

> 物理源码在仓库根下扁平目录（如 `airbyte-server/`），Gradle 模块名仍带 `:oss:` 前缀。

---

## 快速开始（本地开发）

完整步骤见 **[LOCAL_RUN.md](./LOCAL_RUN.md)**。摘要：

### 环境

- JDK 21、Node 20.19、pnpm 8.6.12、Docker、abctl、kind、kubectl

### 构建平台镜像（tag=`dev`）

```bash
source ~/.sdkman/bin/sdkman-init.sh && sdk use java 21.0.8-tem
export PATH=~/.nvm/versions/node/v20.19.0/bin:$PATH

./gradlew :oss:airbyte-server:dockerBuildImage \
  --init-script ~/.gradle/init.d/mirrors.gradle
# 其余服务见 LOCAL_RUN.md 中的 12 个镜像列表
```

### 一键拉起

```bash
./tools/jetems-abctl-up.sh
```

- 访问：http://localhost:8000  
- 默认登录：`admin@jetems.com` / `jetems-local-admin`  
- Keycloak Admin：http://localhost:8000/auth/admin/（`airbyteAdmin` / `airbyte123`）

配置见 `dev-values.jetems.yaml`。

---

## 发布镜像到华为云 SWR

文档：**[tools/JETEMS_IMAGE_PUBLISH.md](./tools/JETEMS_IMAGE_PUBLISH.md)**

```bash
# 1. 配置 GitHub Secrets：SWR_USERNAME / SWR_PASSWORD
# 2. 打 tag 并推送，触发 Actions（原生 amd64 + arm64，无 QEMU）
./tools/jetems-create-release-tag.sh
```

Tag 示例：`20260711-a1b2c3`  

镜像示例：

```text
swr.cn-south-1.myhuaweicloud.com/jetems/airbyte/server:20260711-a1b2c3
```

---

## 仓库与协作

```text
origin    → jetems/airbyte          # 二开推送目标
upstream  → airbytehq/airbyte-platform   # 仅 fetch / merge，禁止 push
```

开发规范（结构、i18n、扩展隔离、上游合并）：**[JETEMS_DEV.md](./JETEMS_DEV.md)**（Agent / 开发者必读）。

同步上游：

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

---

## 目录速查

| 路径 | 说明 |
|------|------|
| `airbyte-server/` | 主 API 与内嵌前端 |
| `airbyte-workers/` | 同步执行 |
| `airbyte-workload-*` | Workload 调度与启动 |
| `airbyte-webapp/` | 前端源码 |
| `airbyte-commons-server/` | 服务端公共逻辑；含 `docs-zh` 中文指南 |
| `charts/v2/airbyte/` | Helm Chart |
| `tools/jetems-*.sh` | 本地 abctl、打 tag、镜像发布 |
| `tools/jetems-docs-zh/` | 连接器中文文档工具 |
| `dev-values.jetems.yaml` | 本地企业版 dev 配置 |

---

## 文档索引

| 文档 | 内容 |
|------|------|
| [JETEMS_DEV.md](./JETEMS_DEV.md) | 二开规范、目录真相、i18n、合并规则 |
| [LOCAL_RUN.md](./LOCAL_RUN.md) | 本地 abctl 完整运行手册 |
| [tools/JETEMS_IMAGE_PUBLISH.md](./tools/JETEMS_IMAGE_PUBLISH.md) | SWR 多架构发布 |
| [tools/jetems-docs-zh/README.md](./tools/jetems-docs-zh/README.md) | 中文连接器文档 |
| [AGENTS.md](./AGENTS.md) | 上游 Agent 约定（注意与扁平目录差异） |
| [官方文档](https://docs.airbyte.com/) | Airbyte 产品与 Connector 使用说明 |

---

## 许可证

本仓库代码继承 Airbyte 相关开源许可（含 MIT / ELv2 等，见仓库内 `LICENSE` 与官方说明）。

**企业版能力与许可证相关改动仅限合法授权范围内使用。** 商用前请完成法务评估；不得违反 ELv2 等许可证限制。

上游漏洞报告请使用官方渠道：security@airbyte.io（勿在公开 issue 披露未修复漏洞）。

---

## 相关链接

- 上游平台：https://github.com/airbytehq/airbyte-platform  
- 连接器与协议仓：https://github.com/airbytehq/airbyte  
- 官方文档：https://docs.airbyte.com/  
- 官方产品站：https://airbyte.com/  
