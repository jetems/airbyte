# LOCAL_RUN.md — 用 abctl 从源码运行完整 Airbyte 企业版（jetems 二开）

> 本文档说明如何**从这个仓库的源代码**构建 `:dev` 镜像，并用 **abctl + Helm chart（charts/v2）**
> 在本地 kind 集群里跑起完整的 Airbyte 企业版（server + workload 层 + keycloak），
> 用于本地开发与测试，包括验证 jetems 的中文化与企业功能解锁。
>
> 阅读前请先读 [JETEMS_DEV.md](./JETEMS_DEV.md)。
>
> ℹ️ 历史说明：早期的 docker-compose 方案（`docker-compose.jetems.yml` / `.env.jetems`）已**退役**，
> 本地运行统一走 abctl。若在旧提交里看到那套编排，忽略即可。

---

## 0. 架构总览

```
┌──────────────────────────────────────────────────────────────┐
│                     源码构建链（Gradle）                       │
│  airbyte-api/*.yaml (OpenAPI spec)                            │
│       ↓ generate-client                                       │
│  airbyte-webapp/ (前端，pnpm build) ── 打包进 server 镜像       │
│       ↓                                                        │
│  各服务 :dockerBuildImage → 本地镜像 airbyte/<svc>:dev          │
│       （VERSION=dev → tag=dev；imageName 为单前缀，匹配 chart） │
└──────────────────────────────────────────────────────────────┘
                              ↓ kind load
┌──────────────────────────────────────────────────────────────┐
│              运行时（abctl + charts/v2/airbyte）               │
│  abctl local install --chart ./charts/v2 --values dev-values  │
│       ↓ 建 kind 集群 + 部署 Helm chart + 建 ingress            │
│  基础设施：postgres + temporal + minio（chart 内置，registry 拉）│
│  应用层：bootloader → server + worker + cron + workload-*      │
│  认证：keycloak + keycloak-setup（企业版，simple auth）        │
│  访问：http://localhost:8000（ingress → server，前端已内嵌）    │
└──────────────────────────────────────────────────────────────┘
```

### 关键事实（已勘察确认）

1. **前端构建集成在 server 构建**：`airbyte-server/build.gradle.kts` 的 webapp 集成任务会调用前端
   `pnpmBuild`，把产物打进 server 镜像——所以访问 server 即得完整 UI，chart 里 webapp 单独关闭。
2. **镜像名必须是单前缀 `airbyte/<svc>`**：chart v2 的 `repository` 是 `airbyte/server`、`airbyte/worker`…
   （见 `charts/v2/airbyte/values.yaml`）。Gradle 的 `docker { imageName = "server" }` + `io.airbyte.gradle.docker`
   插件正好产出 `airbyte/server:dev`。**不要**用 `airbyte/airbyte-server` 这种双前缀名（那是旧 compose 方案的）。
3. **tag 固定为 `dev`**：根 `.env` 里 `VERSION=dev`，chart `appVersion: dev`，`dev-values.jetems.yaml` 里 `image.tag: dev`——三者一致。
4. **企业解锁编译进镜像**：`AllEntitledClient`（全开 entitlement）+ `InstanceConfigurationHandler`
   强制 `licenseStatus=PRO` 已编译进 server/worker，所以 license 只需占位假值，无需真实 license。
5. **ingress 需修一次**：abctl 自建的 ingress 默认把 `/` 指向已关闭的 webapp → 503；需重写为
   `/ → server`、`/auth → keycloak`（`tools/jetems-abctl-fix-ingress.sh`，`jetems-abctl-up.sh` 会自动调用）。

### 需要构建的 12 个 `:dev` 镜像 → Gradle 模块

`tools/jetems-abctl-up.sh` 启动时会把这 12 个镜像 `kind load` 进集群，缺哪个就构建哪个：

| 镜像 `airbyte/<svc>:dev` | Gradle 模块 | 备注 |
|---|---|---|
| `server` | `:oss:airbyte-server` | **含前端**，构建最慢（触发 pnpmBuild） |
| `worker` | `:oss:airbyte-workers` | 同步执行 |
| `workload-api-server` | `:oss:airbyte-workload-api-server` | workload API |
| `workload-launcher` | `:oss:airbyte-workload-launcher` | 拉起 workload pod |
| `cron` | `:oss:airbyte-cron` | 定时调度 |
| `bootloader` | `:oss:airbyte-bootloader` | Flyway 迁移，**最先跑** |
| `keycloak` | `:oss:airbyte-keycloak` | 企业版认证 |
| `keycloak-setup` | `:oss:airbyte-keycloak-setup` | 初始化 realm/用户 |
| `db` | `:oss:airbyte-db:db-lib` | 初始化用 |
| `container-orchestrator` | `:oss:airbyte-container-orchestrator` | 同步 pod 编排 |
| `connector-sidecar` | `:oss:airbyte-connector-sidecar` | connector sidecar |
| `workload-init-container` | `:oss:airbyte-workload-init-container` | workload init |

> 基础设施镜像（postgres / temporal / minio）由 chart 从 registry 直接拉，**不需要本地构建**。

---

## 1. 环境准备

| 项 | 要求 | 安装/检查 |
|----|------|----------|
| **JDK 21** | 后端编译 | `sdk install java 21.0.8-tem`（sdkman） |
| **Node 20.19.0** | 前端构建（精确版本） | `nvm install 20.19.0` |
| **pnpm 8.6.12** | 前端包管理 | corepack 自动管理 |
| **Docker** | 镜像构建 + 承载 kind | `docker info` |
| **abctl** | 装/管本地集群 | `curl -LsfS https://get.airbyte.com | bash -` 或 [官方安装](https://docs.airbyte.com/using-airbyte/getting-started/oss-quickstart) |
| **kind** | 脚本用它 load 镜像进集群 | `brew install kind`（`jetems-abctl-up.sh` 直接调用 `kind`） |
| **kubectl** | 修 ingress / 查状态 | `brew install kubectl` |
| **Gradle 镜像** | 国内加速 | 已配 `~/.gradle/init.d/mirrors.gradle` |

```bash
# 每次新终端先激活 JDK 与前端 Node
source ~/.sdkman/bin/sdkman-init.sh && sdk use java 21.0.8-tem
export PATH=~/.nvm/versions/node/v20.19.0/bin:$PATH   # server 构建触发前端 pnpmBuild 时需要
```

---

## 2. 步骤 1：构建 `:dev` 镜像

```bash
cd /Volumes/data/projects/jetems/airbyte
source ~/.sdkman/bin/sdkman-init.sh && sdk use java 21.0.8-tem
export PATH=~/.nvm/versions/node/v20.19.0/bin:$PATH

# （可选）若各服务镜像 FROM 的 base-java-image 拉不到，再本地构建它：
# ./gradlew :oss:airbyte-base-java-image:dockerBuildImage --init-script ~/.gradle/init.d/mirrors.gradle

# server 镜像：会自动触发前端 pnpmBuild + 后端编译，首次约 10–20 分钟
./gradlew :oss:airbyte-server:dockerBuildImage --init-script ~/.gradle/init.d/mirrors.gradle

# 其余 11 个服务镜像（可分开或用一条命令并列）
./gradlew --init-script ~/.gradle/init.d/mirrors.gradle \
  :oss:airbyte-workers:dockerBuildImage \
  :oss:airbyte-workload-api-server:dockerBuildImage \
  :oss:airbyte-workload-launcher:dockerBuildImage \
  :oss:airbyte-cron:dockerBuildImage \
  :oss:airbyte-bootloader:dockerBuildImage \
  :oss:airbyte-keycloak:dockerBuildImage \
  :oss:airbyte-keycloak-setup:dockerBuildImage \
  :oss:airbyte-db:db-lib:dockerBuildImage \
  :oss:airbyte-container-orchestrator:dockerBuildImage \
  :oss:airbyte-connector-sidecar:dockerBuildImage \
  :oss:airbyte-workload-init-container:dockerBuildImage
```

构建完成后确认 12 个 `:dev` 镜像都在（**单前缀** `airbyte/<svc>:dev`）：

```bash
docker images | grep -E 'airbyte/(server|worker|workload-api-server|workload-launcher|cron|bootloader|keycloak|keycloak-setup|db|container-orchestrator|connector-sidecar|workload-init-container):dev'
```

> 只想改一处、重建单个服务时，重跑那一个模块的 `:dockerBuildImage` 即可，然后重跑步骤 2 的脚本（会重新 kind load）。

---

## 3. 步骤 2：一键装起本地环境

```bash
./tools/jetems-abctl-up.sh
```

脚本做三件事（见脚本头注释）：

1. `abctl local install --chart ./charts/v2/airbyte --values dev-values.jetems.yaml --port 8000 --low-resource-mode --no-browser`
   —— 建 kind 集群（默认名 `airbyte-abctl`）、部署 chart、建 ingress。
2. 等 kind 节点出现后，把上面 12 个 `airbyte/<svc>:dev` **kind load** 进集群
   （chart `pullPolicy: IfNotPresent`，镜像在节点里就不会去 Docker Hub 拉）。
3. 调 `tools/jetems-abctl-fix-ingress.sh` 修 ingress：`/ → server`、`/auth → keycloak`。

可用环境变量覆盖：`ABCTL_CLUSTER`（集群名）、`ABCTL_PORT`（默认 8000）。

> `abctl local install` 退出码非 0 通常只是某个 pod 健康等待超时（本地满栈 CPU 争抢下 server 启动慢），
> 脚本会继续修 ingress；稍等 pod 就绪后再访问即可。

---

## 4. 步骤 3：访问与验证

```bash
open http://localhost:8000
```

- **登录**（simple auth）：`admin@jetems.com` / `jetems-local-admin`
  （注意邮箱是 **`.com`**——这是 `jetems-abctl-up.sh` 完成时打印的登录信息；
  若登录不通，试 `dev-values.jetems.yaml` 里 `INITIAL_USER_EMAIL` 设的 `admin@jetems.local`）。
- **验证中文化**：登录后在**侧边栏底部**找 🌐 语言切换器（globe 图标，在深浅色主题切换旁），点击切换中/英文。
- **验证企业解锁**：顶部不应再有 “License is invalid” 横幅，企业功能（如 SSO、RBAC 等门禁项）可见。

查看集群状态：

```bash
export KUBECONFIG=~/.airbyte/abctl/abctl.kubeconfig
kubectl get pods -n airbyte-abctl
```

---

## 5. `dev-values.jetems.yaml` 关键点

完整文件见仓库根 `dev-values.jetems.yaml`，要点：

- `global.edition: enterprise` + `airbyteUrl: http://localhost:8000` + `image.tag: dev`。
- `global.enterprise.licenseKey`：占位假值即可（运行时已被源码绕过）。
- `webapp.enabled: false`：前端已打进 server 镜像，ingress 只路由到 server。
- `keycloak.enabled: true` + `keycloak.protocol: http`：集群内 keycloak 只服务 http，
  设 https 会让 keycloak-setup 报 `NotSslRecordException`。
- `keycloakSetup.extraEnv` 注入 `INITIAL_USER_EMAIL`：keycloak-setup Job 不合并 `global.env_vars`，必须单独注入。
- `server` 探针放宽（liveness 初始延迟 180s）：本地满栈 CPU 争抢下 server 启动慢，默认探针会误杀成 CrashLoop。
- `workloadApiServer` 探针关闭：模板硬编码查 management 端口 8085，但该端口未绑定（app 主端口 8007 正常）。
- 关掉评估用不到的可选服务（manifest-server / metrics / connector-rollout-worker / featureflag-server / temporal-ui），省构建。

---

## 6. 关于 ingress 修复（为什么需要、什么时候重跑）

- abctl 自建的 `ingress-abctl` **不归 Helm chart 管理**：
  - `helm upgrade` 不会动它（patch 不丢）。
  - `abctl local install` 会**重建**它（patch 丢失）→ **每次重装后需重跑** `tools/jetems-abctl-fix-ingress.sh`。
- 脚本幂等：整体替换 paths，重复执行结果一致。会自动 `curl localhost:8000/` 校验返回 200。

---

## 7. 仅验证前端（不起后端，最快看 UI/中文化）

只想快速看前端效果时，用 webapp 的 dev server：

```bash
cd airbyte-webapp
nvm use 20.19.0
corepack pnpm install
corepack pnpm generate-client                       # 用本仓库的 OpenAPI spec 生成客户端
REACT_APP_API_URL="http://localhost:8000" corepack pnpm start local   # 指向已起的后端
# 或不连后端仅看 UI：REACT_APP_API_URL="http://localhost:8000" npx vite
```

访问 `https://localhost:3000`（自签名 HTTPS，浏览器点继续）。语言切换器在**登录后**的侧边栏底部——
若后端没起、停在登录页则看不到侧边栏。

---

## 8. 常见问题

### Q: pod 一直 `ImagePullBackOff` / 起不来？
A: 多半是本地缺对应 `:dev` 镜像，或镜像名写成了双前缀。确认 `docker images | grep airbyte/…:dev` 里是
**单前缀** `airbyte/server:dev`（不是 `airbyte/airbyte-server:dev`），然后重跑 `./tools/jetems-abctl-up.sh` 重新 kind load。

### Q: 访问 `localhost:8000` 返回 503？
A: ingress 还指向已关闭的 webapp。重跑 `./tools/jetems-abctl-fix-ingress.sh`（重装后必做）。

### Q: server pod 反复 CrashLoop？
A: 本地满栈启动慢被探针误杀。`dev-values.jetems.yaml` 已放宽 server 探针；若仍不够，继续调大
`livenessProbe.initialDelaySeconds`。确认 temporal/postgres 已 Ready。

### Q: keycloak-setup 报 `NotSslRecordException`？
A: `keycloak.protocol` 必须是 `http`（dev-values 已设）。

### Q: 构建时前端 pnpmBuild 失败（Node 版本）？
A: 前端构建需 Node 20.19.0。构建 server 前确保 `export PATH=~/.nvm/versions/node/v20.19.0/bin:$PATH`。

### Q: Gradle 依赖下载失败（TLS 握手）？
A: 加 `--init-script ~/.gradle/init.d/mirrors.gradle` 走阿里云镜像。

### Q: 想彻底重来？
A: `abctl local uninstall`（删集群），再从步骤 2 重跑 `./tools/jetems-abctl-up.sh`。

---

## 9. 相关文件速查

| 文件 | 作用 |
|------|------|
| `tools/jetems-abctl-up.sh` | 一键装起：abctl install + kind load 12 镜像 + 修 ingress |
| `tools/jetems-abctl-fix-ingress.sh` | 重写 ingress paths（`/ → server`、`/auth → keycloak`） |
| `dev-values.jetems.yaml` | abctl/Helm 的 dev values（edition/镜像 tag/探针/关服务） |
| `charts/v2/airbyte/values.yaml` | chart 默认值（镜像 `repository` 名的来源） |
| `airbyte-server/build.gradle.kts` | 前端集成构建（buildWebapp）+ `docker { imageName = "server" }` |
| `airbyte-api/server-api/src/main/openapi/api.yaml` | OpenAPI spec（前端 generate-client 来源） |
| `airbyte-server/src/main/resources/application.yml` | server 配置（DB/Temporal/auth/端口） |
| `airbyte-webapp/vite.config.mts` | 前端 dev server 配置（端口 3000/HTTPS） |

---

## 附：当前环境已就绪

- ✅ JDK 21（sdkman）
- ✅ Node 20.19.0（nvm）
- ✅ pnpm 8.6.12（corepack）
- ✅ Gradle 镜像加速（`~/.gradle/init.d/mirrors.gradle`）
- ✅ jetems 前端中文化 + 企业解锁（已编译进 `:dev` 镜像）

**建议起步**：先按**第 7 节**纯前端快速验证中文化，再按**第 2–4 节**用 abctl 搭完整企业版环境。
