# LOCAL_RUN.md — 从源码运行完整 Airbyte 服务（jetems 二开）

> 本文档说明如何**从这个仓库的源代码**编译并运行完整的 Airbyte 服务（后端 + 前端），
> 用于本地开发与测试，特别是验证 jetems 前端中文化效果。
>
> 阅读前请先读 [JETEMS_DEV.md](./JETEMS_DEV.md)。

---

## 0. 架构总览

```
┌─────────────────────────────────────────────────────────┐
│                   源码构建链（Gradle）                    │
│  airbyte-api/*.yaml (OpenAPI spec)                       │
│       ↓ generate-client                                  │
│  airbyte-webapp/ (前端，pnpm build)                      │
│       ↓ 复制到 server/resources/webapp                   │
│  airbyte-server/ (后端 Kotlin 编译)                      │
│       ↓ distTar / dockerBuildImage                       │
│  airbyte-app.tar / Docker 镜像                           │
└─────────────────────────────────────────────────────────┘
                         ↓ 运行
┌─────────────────────────────────────────────────────────┐
│              运行时（需外部依赖 + 编排）                  │
│  外部依赖：PostgreSQL + Temporal（必需）                  │
│  核心服务：bootloader → server + cron + workers           │
│  访问：http://localhost:8000 (server，含打包的前端)       │
└─────────────────────────────────────────────────────────┘
```

### 关键事实（已勘察确认）

1. **前端构建集成在 server 构建**：`airbyte-server/build.gradle.kts` 的 `buildWebapp` 任务会调用前端的 `pnpmBuild`，把产物打包进 server
2. **OpenAPI spec 在本仓库**：`airbyte-api/server-api/src/main/openapi/api.yaml` —— 这是前端 `generate-client` 的 spec 来源
3. **每个服务有 Dockerfile**，基础镜像 `airbyte/airbyte-base-java-image`，运行入口 `airbyte-app/bin/${APPLICATION}`
4. **server 监听 8000**（Dockerfile EXPOSE 确认），前端打包进 server 后，访问 server 即得完整 UI
5. **本仓库无 docker-compose 编排** —— 需要我们自己提供 Postgres + Temporal + 服务启动

### 服务依赖矩阵

| 服务 | Postgres | Temporal | 作用 | 是否必需 |
|------|:---:|:---:|------|:---:|
| **bootloader** | ✅ | - | Flyway 数据库迁移 + 初始化（**必须最先跑**） | ✅ |
| **server** | ✅ | ✅ | REST API（含前端，端口 8000） | ✅ |
| **workers** | - | ✅ | 同步任务执行 | ✅ |
| **cron** | ✅ | ✅ | 定时调度 | ✅ |
| workload-api-server | ✅ | - | 工作负载 API | OSS 可选 |
| workload-launcher | - | - | K8s 任务启动 | 本地不需要 |
| featureflag-server | - | ✅ | 功能开关 | OSS 可选 |
| keycloak | - | - | 认证（OSS 可用简单认证替代） | 可选 |

**启动顺序**：Postgres → Temporal → **bootloader**（迁移）→ server + cron + workers

---

## 1. 环境准备

| 项 | 要求 | 安装/检查 |
|----|------|----------|
| **JDK 21** | 后端编译 | `sdk install java 21.0.8-tem`（sdkman） |
| **Node 20.19.0** | 前端构建（精确版本） | `nvm install 20.19.0` |
| **pnpm 8.6.12** | 前端包管理 | corepack 自动管理 |
| **Docker** | 运行依赖 + 镜像构建 | `docker info` |
| **Gradle 镜像** | 国内加速 | 已配 `~/.gradle/init.d/mirrors.gradle` |

```bash
# 每次新终端先激活
source ~/.sdkman/bin/sdkman-init.sh && sdk use java 21.0.8-tem
```

---

## 2. 方案 A：构建 Docker 镜像 + 自编 docker-compose 运行 ⭐ 推荐

最贴近生产、最完整的方案。Gradle 构建出各服务镜像，用 docker-compose 编排运行。

### 步骤 1：构建基础镜像和各服务镜像

```bash
cd /Volumes/data/projects/jetems/airbyte
source ~/.sdkman/bin/sdkman-init.sh && sdk use java 21.0.8-tem

# 1a. 构建 Java 基础镜像（所有服务镜像的 FROM 依赖，约 2 分钟）
./gradlew :oss:airbyte-base-java-image:dockerBuildImage --init-script ~/.gradle/init.d/mirrors.gradle

# 1b. 构建 server 镜像（会自动触发前端 pnpmBuild + 后端编译，首次约 10-20 分钟）
#     需确保 Node 20.19.0 在 PATH（前端构建用）
export PATH=~/.nvm/versions/node/v20.19.0/bin:$PATH
./gradlew :oss:airbyte-server:dockerBuildImage --init-script ~/.gradle/init.d/mirrors.gradle

# 1c. 构建其他必需服务镜像
./gradlew :oss:airbyte-bootloader:dockerBuildImage --init-script ~/.gradle/init.d/mirrors.gradle
./gradlew :oss:airbyte-cron:dockerBuildImage --init-script ~/.gradle/init.d/mirrors.gradle
./gradlew :oss:airbyte-workers:dockerBuildImage --init-script ~/.gradle/init.d/mirrors.gradle
```

> 构建产物是本地 Docker 镜像，用 `docker images | grep airbyte` 查看。

### 步骤 2：编写 docker-compose 编排

本仓库没有 docker-compose，需自建 `docker-compose.jetems.yml`（放在仓库根目录）。
以下是最小可运行编排的**模板**，需根据实际构建出的镜像 tag 调整：

```yaml
# docker-compose.jetems.yml —— jetems 本地源码运行编排（最小集）
# 注意：镜像 tag 需替换为 dockerBuildImage 实际产出的版本
version: "3.8"
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: docker
      POSTGRES_PASSWORD: docker
      POSTGRES_DB: airbyte
    ports: ["5432:5432"]
    volumes: ["airbyte-db:/var/lib/postgresql/data"]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U docker"]
      interval: 5s
      retries: 10

  temporal:
    image: temporalio/auto-setup:1.22
    environment:
      DB: postgres12
      DB_PORT: 5432
      POSTGRES_USER: temporal
      POSTGRES_PWD: temporal
      POSTGRES_SEEDS: temporal
    depends_on: { postgres: { condition: service_healthy } }
    ports: ["7233:7233"]

  bootloader:
    image: airbyte/airbyte-bootloader:dev   # ← 替换为实际 tag
    environment:
      DATABASE_URL: "jdbc:postgresql://postgres:5432/airbyte"
      DATABASE_USER: docker
      DATABASE_PASSWORD: docker
      RUN_DATABASE_MIGRATION_ON_STARTUP: "true"
    depends_on: { postgres: { condition: service_healthy } }

  server:
    image: airbyte/airbyte-server:dev       # ← 替换为实际 tag（含打包前端）
    environment:
      DATABASE_URL: "jdbc:postgresql://postgres:5432/airbyte"
      DATABASE_USER: docker
      DATABASE_PASSWORD: docker
      TEMPORAL_HOST: "temporal:7233"
      AIRBYTE_VERSION: "dev"
      # 简单认证（OSS，免 Keycloak）
      AUTH_MODE: "simple"
    ports: ["8000:8000"]
    depends_on:
      bootloader: { condition: service_completed_successfully }
      temporal: { condition: service_started }

  cron:
    image: airbyte/airbyte-cron:dev        # ← 替换为实际 tag
    environment:
      DATABASE_URL: "jdbc:postgresql://postgres:5432/airbyte"
      DATABASE_USER: docker
      DATABASE_PASSWORD: docker
      TEMPORAL_HOST: "temporal:7233"
    depends_on: { server: { condition: service_started } }

  workers:
    image: airbyte/airbyte-workers:dev     # ← 替换为实际 tag
    environment:
      DATABASE_URL: "jdbc:postgresql://postgres:5432/airbyte"
      DATABASE_USER: docker
      DATABASE_PASSWORD: docker
      TEMPORAL_HOST: "temporal:7233"
    depends_on: { server: { condition: service_started } }

volumes:
  airbyte-db:
```

> ⚠️ 以上是**起点模板**。实际运行可能需要根据 `application.yml` 的环境变量补充配置
> （如 `LOG_LEVEL`、`TRACKING_STRATEGY`、connector 相关等）。启动报错时按提示补全。

### 步骤 3：启动

```bash
# 启动全部（bootloader 完成迁移后 server 才起）
docker compose -f docker-compose.jetems.yml up -d

# 看 server 日志（确认迁移完成、启动成功）
docker compose -f docker-compose.jetems.yml logs -f server

# 访问（前端已打包进 server）
open http://localhost:8000
```

首次访问 `localhost:8000` 会进注册/登录页。用简单认证模式时，按页面提示创建账号。

### 验证中文化

登录后在**侧边栏底部**找 🌐 语言切换器（globe 图标，在深浅色主题切换旁），点击切换中/英文。

---

## 3. 方案 B：distTar 本地直接运行（不用 Docker 编排）

如果不想写 docker-compose，可以用 Gradle 的 `distTar` 打出应用包，配合本地 Postgres + Temporal 直接 `bin/airbyte-server` 运行。

```bash
cd /Volumes/data/projects/jetems/airbyte
source ~/.sdkman/bin/sdkman-init.sh && sdk use java 21.0.8-tem
export PATH=~/.nvm/versions/node/v20.19.0/bin:$PATH

# 1. 起 Postgres + Temporal（用 Docker 单独起）
docker run -d --name airbyte-pg -p 5432:5432 \
  -e POSTGRES_USER=docker -e POSTGRES_PASSWORD=docker -e POSTGRES_DB=airbyte \
  postgres:15

docker run -d --name airbyte-temporal -p 7233:7233 \
  --link airbyte-pg \
  -e DB=postgres12 -e DB_PORT=5432 -e POSTGRES_USER=temporal \
  -e POSTGRES_PWD=temporal -e POSTGRES_SEEDS=temporal \
  temporalio/auto-setup:1.22

# 2. 构建 server 的 distTar（含前端打包）
./gradlew :oss:airbyte-server:distTar --init-script ~/.gradle/init.d/mirrors.gradle
# 产物：airbyte-server/build/distributions/airbyte-app.tar

# 3. 解压并运行（设置环境变量指向本地 Postgres/Temporal）
mkdir -p /tmp/airbyte-server && tar xf airbyte-server/build/distributions/airbyte-app.tar -C /tmp/airbyte-server
cd /tmp/airbyte-server/airbyte-app-*/

DATABASE_URL="jdbc:postgresql://localhost:5432/airbyte" \
DATABASE_USER=docker DATABASE_PASSWORD=docker \
TEMPORAL_HOST="localhost:7233" AIRBYTE_VERSION=dev \
bin/airbyte-server

# 访问 http://localhost:8000
```

> 注意：方案 B 需**先手动跑 bootloader** 做数据库迁移（否则 server 启动会因表不存在失败）。
> bootloader 也用同样方式 distTar + bin/airbyte-bootloader 运行。

---

## 4. 方案 C：纯前端 dev server（仅验证 UI/中文化）

只想快速看前端效果，不需要完整后端。**这是验证中文化最快的方式。**

```bash
cd airbyte-webapp
nvm use 20.19.0
corepack pnpm install

# 前端 generate-client（用本仓库的 OpenAPI spec）
corepack pnpm generate-client

# 启动 dev server（HTTPS，端口 3000）
# 指向本地后端（方案 A/B 起的 server）
REACT_APP_API_URL="http://localhost:8000" corepack pnpm start local
# 或直接 npx vite（不连后端，仅看 UI）
REACT_APP_API_URL="http://localhost:8000" npx vite
```

访问 `https://localhost:3000`（自签名 HTTPS，浏览器点继续）。

---

## 5. 各方案对比

| | 方案 A（Docker compose） | 方案 B（distTar） | 方案 C（纯前端） |
|---|---|---|---|
| 完整度 | ✅ 完整服务 | ✅ 完整服务 | ⚠️ 仅前端 |
| 验证中文化 | ✅ 完整 | ✅ 完整 | ✅ UI 切换 |
| 配置复杂度 | 中（写 compose） | 高（手动起依赖+迁移） | 低 |
| 资源占用 | 高（多容器） | 中 | 低 |
| 贴近生产 | ✅ 最像 | 中 | 低 |
| **推荐场景** | **长期开发** | 调试单服务 | **快速看 UI** |

---

## 6. 常见问题

### Q: `dockerBuildImage` 失败，提示找不到 base-java-image？
A: 必须先构建基础镜像：`./gradlew :oss:airbyte-base-java-image:dockerBuildImage`。所有服务镜像 FROM 它。

### Q: server 启动报数据库连接失败？
A: 检查 Postgres 已起、`DATABASE_URL` 正确。bootloader 必须先成功完成迁移。

### Q: server 启动报 Temporal 连接失败？
A: Temporal 默认 `airbyte-temporal:7233`（容器名）。本地直接跑需设 `TEMPORAL_HOST=localhost:7233`。

### Q: 前端没显示中文 / 语言切换器看不到？
A: 切换器在**登录后**的侧边栏底部。若用方案 C 且后端没起，登录页本身没侧边栏——需先有可用后端。

### Q: 构建时前端 pnpmBuild 失败（Node 版本）？
A: 前端构建需 Node 20.19.0。构建 server 前确保 `export PATH=~/.nvm/versions/node/v20.19.0/bin:$PATH`。

### Q: Gradle 依赖下载失败（TLS 握手）？
A: 用 `--init-script ~/.gradle/init.d/mirrors.gradle` 走阿里云镜像。

---

## 7. 相关文件速查

| 文件 | 作用 |
|------|------|
| `airbyte-server/build.gradle.kts` (L122-213) | 前端集成构建逻辑（buildWebapp） |
| `airbyte-api/server-api/src/main/openapi/api.yaml` | OpenAPI spec（前端 generate-client 来源） |
| `airbyte-server/src/main/resources/application.yml` | server 配置（DB/Temporal/端口） |
| `airbyte-server/Dockerfile` | server 镜像构建（EXPOSE 8000） |
| `airbyte-webapp/scripts/start-dev.js` | 前端启动入口 |
| `airbyte-webapp/environments.json` | 前端后端环境配置 |
| `airbyte-webapp/vite.config.mts` | Vite 配置（端口 3000/HTTPS） |

---

## 附：当前环境已就绪

- ✅ JDK 21（sdkman）
- ✅ Node 20.19.0（nvm）
- ✅ pnpm 8.6.12（corepack）
- ✅ Gradle 镜像加速（`~/.gradle/init.d/mirrors.gradle`）
- ✅ jetems 前端中文化（已提交推送）

**建议起步**：先试**方案 C**快速验证中文化，再按**方案 A**搭完整环境。
