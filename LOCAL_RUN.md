# LOCAL_RUN.md — jetems 本地开发运行方案

> 本文档说明如何**在本地运行 airbyte-platform 进行开发与测试**，特别是验证 jetems 前端中文化效果。
>
> 阅读前请先读 [JETEMS_DEV.md](./JETEMS_DEV.md)。

---

## 0. 重要前提：这个仓库是什么

`airbyte-platform` 是 airbyte 的**平台源码仓库**，包含：
- ✅ `airbyte-webapp/` —— 前端源码（React + Vite）
- ✅ `airbyte-server/`、`airbyte-workers/` 等 —— 后端 Kotlin 源码（Gradle）
- ❌ **不含 docker-compose、不含部署编排、不含 Makefile**

这意味着**不能从这个仓库一键 `docker-compose up` 起完整 Airbyte**。
完整的本地 Airbyte 实例需要用官方工具 **abctl** 单独部署，详见下文。

---

## 1. 架构与端口约定

```
┌─────────────────────┐         ┌──────────────────────────┐
│  浏览器              │         │  Airbyte 实例（后端）      │
│  https://localhost:3000 │◀───────│  abctl 起的 K8s/Docker    │
│  （Vite dev server） │  proxy  │  http://localhost:8000    │
│  jetems 前端源码     │         │  Postgres+Temporal+Server │
└─────────────────────┘         └──────────────────────────┘
```

| 组件 | 地址 | 说明 |
|------|------|------|
| 前端 dev server | `https://localhost:3000` | Vite，HTTPS（自签名证书） |
| 后端 Airbyte API | `http://localhost:8000` | abctl 默认端口 |
| 前端 → 后端 | 经 `environments.json` 的 `local` 配置代理 | `https://local.airbyte.dev` 需配 hosts |

前端启动时会让你选后端环境（`local` / `oss` / `enterprise` / `cloud`），选 `local` 即连接本地后端。

---

## 2. 方案 A：完整本地运行（abctl + 前端源码）⭐ 推荐

这是验证中文化效果的**完整方案**：用 abctl 起一个标准 Airbyte 后端，再用本仓库的 jetems 前端源码连过去。

### 2.1 前置要求

| 项 | 要求 | 检查命令 |
|----|------|---------|
| Docker | 已运行，≥8GB 内存 | `docker info` |
| 磁盘 | ≥10GB 可用 | `df -h` |
| Node | **20.19.0**（精确） | `node -v`（用 nvm: `nvm use 20.19.0`） |
| pnpm | 8.6.12（corepack 管理） | `corepack pnpm -v` |
| abctl | 最新版（见下） | `abctl version` |

### 2.2 步骤 1：用 abctl 部署本地 Airbyte 后端

abctl 是 airbyte 官方的本地部署 CLI（取代旧的 docker-compose 方案），默认在 `localhost:8000` 提供服务。

```bash
# 安装 abctl（macOS arm64 示例，其他架构见官方文档）
# 方式一：Homebrew
brew install airbytehq/tap/abctl

# 方式二：手动下载
# 到 https://github.com/airbytehq/abctl/releases 下载对应架构的 zip，解压后放到 PATH

# 验证
abctl version

# 部署本地 Airbyte（首次会拉取镜像，约 5-10 分钟）
abctl local install
```

部署完成后：
- Airbyte UI: `http://localhost:8000`（这是**官方默认前端**，用于确认后端正常）
- 默认账号见 abctl 输出（通常是 `airbyte` / 随机密码，用 `abctl local credentials` 查看）

> 📖 官方文档：[OSS Quickstart](https://docs.airbyte.com/platform/using-airbyte/getting-started/oss-quickstart) | [abctl 说明](https://docs.airbyte.com/platform/deploying-airbyte/abctl)

### 2.3 步骤 2：配置 local.airbyte.dev 域名解析

前端 `local` 环境连接的是 `https://local.airbyte.dev`，需要让它指向本地：

```bash
# 加 hosts 记录（需 sudo）
echo "127.0.0.1 local.airbyte.dev" | sudo tee -a /etc/hosts
```

> 如果不想改 hosts，可直接在启动前端时用环境变量覆盖 API 地址（见步骤 4 的备注）。

### 2.4 步骤 3：安装前端依赖并生成 API 客户端

```bash
cd airbyte-webapp

# 确保 Node 20.19.0
nvm use 20.19.0

# 安装依赖（首次约 2-3 分钟）
corepack pnpm install

# 生成 API 客户端（从后端 OpenAPI spec + CDK schema）
# ⚠️ 此步骤需要：
#   1. 能访问 pypi.org（下载 airbyte-cdk schema）
#   2. 后端 OpenAPI spec 已就绪（见下方说明）
corepack pnpm generate-client
```

**⚠️ `generate-client` 的已知限制**：
- `scripts/load-declarative-schema.sh` 会从 PyPI 下载 `airbyte-cdk` 的 manifest schema
- orval 还需要后端的完整 OpenAPI spec 来生成 `src/core/api/generated/`
- 如果 generate-client 失败（缺少 spec），可临时从已运行的 abctl 实例导出 spec，或跳过（见方案 B）

### 2.5 步骤 4：启动前端 dev server

```bash
cd airbyte-webapp
nvm use 20.19.0

# 启动（会弹出环境选择，选 local）
corepack pnpm start local

# 或直接指定环境（跳过选择）
corepack pnpm start local
```

启动后访问 **`https://localhost:3000`**（注意是 HTTPS，浏览器会提示自签名证书不安全，点"继续前往"）。

> **不想改 hosts 的替代方式**：直接覆盖 API 地址
> ```bash
> REACT_APP_API_URL="http://localhost:8000" corepack pnpm start local
> ```

### 2.6 验证中文化效果

1. 页面加载后，看**侧边栏底部**（深浅色主题切换器旁），应有 🌐 **语言切换器**（globe 图标）
2. 首次访问若浏览器是中文环境，会自动显示中文
3. 点击切换器在 中文 / English 间切换，UI 文案即时变化
4. 刷新页面，语言偏好会被 localStorage 记住

---

## 3. 方案 B：前端独立预览（无后端，仅看 UI）

如果只想**快速看中文化和语言切换效果**，不需要真实数据交互，可跳过 generate-client 直接起 Vite。

> 注意：此方案下 API 调用会失败，页面会显示加载错误，但**登录页和语言切换器仍可验证**。

```bash
cd airbyte-webapp
nvm use 20.19.0
corepack pnpm install

# 直接起 Vite（绕过 generate-client，API 客户端为空但不阻塞 dev server）
# 指向任意地址即可（反正连不上）
REACT_APP_API_URL="http://localhost:8000" npx vite
```

访问 `https://localhost:3000`。能看到：
- ✅ 中英文切换（侧边栏 globe 图标，需先到登录后的页面）
- ✅ 翻译文案渲染
- ❌ 真实数据（API 不通）

---

## 4. 方案 C：连接现有 Airbyte 实例

如果你已有一个可访问的 Airbyte 实例（云端 / 内网 / abctl 部署在其他机器）：

```bash
cd airbyte-webapp
nvm use 20.19.0
corepack pnpm install
corepack pnpm generate-client   # 需要该实例的 OpenAPI spec 可达

# 用环境变量指向你的实例
REACT_APP_API_URL="https://your-airbyte.example.com" corepack pnpm start local
```

---

## 5. 常见问题排查

### Q: `corepack pnpm start` 卡在环境选择或报错？
A: 确认 Node 是 20.19.0（`nvm use 20.19.0`）。pnpm 的 `engines.node` 是精确版本。

### Q: `generate-client` 失败（下载 CDK schema 出错）？
A: 网络问题。`load-declarative-schema.sh` 从 pypi.org 下载。可：
- 配代理：`export HTTPS_PROXY=http://your-proxy:port`
- 或手动指定本地 schema：`CDK_MANIFEST_PATH=/path/to/schema.yaml corepack pnpm generate-client`

### Q: 页面打开是白屏 / 报 API 错误？
A: 后端没起或地址不对。确认 `http://localhost:8000` 能访问（abctl 已部署）。用 `REACT_APP_API_URL` 覆盖。

### Q: 语言切换器不显示？
A: 它在**登录后**的侧边栏底部（`SideBar.tsx`）。登录页本身没有侧边栏。先登录进主界面。

### Q: 切换中文后部分文案还是英文？
A: 正常。68 个 key 是占位符/专有名词（如邮箱示例、Airbyte、Slack、Plus/Pro），本就该保持英文。另外 connector spec 的动态字段标题来自后端，不在前端翻译范围。

### Q: HTTPS 自签名证书警告？
A: 正常。Vite 用 `@vitejs/plugin-basic-ssl`。浏览器点"高级 → 继续前往 localhost(不安全)"即可。

---

## 6. 相关文件速查

| 文件 | 作用 |
|------|------|
| `airbyte-webapp/scripts/start-dev.js` | 前端启动入口（选环境 → generate-client → vite） |
| `airbyte-webapp/environments.json` | 后端环境配置（local/oss/enterprise/cloud 的 apiUrl） |
| `airbyte-webapp/.env` | 前端环境变量（API URL 等） |
| `airbyte-webapp/vite.config.mts` | Vite 配置（端口 3000、HTTPS、locale 编译插件） |
| `airbyte-webapp/orval.config.ts` | API 客户端生成配置 |
| `airbyte-webapp/scripts/load-declarative-schema.sh` | CDK schema 下载脚本 |
| `airbyte-server/src/main/resources/application.yml` | 后端配置（Temporal/Postgres 连接，端口等） |

---

## 附：当前环境已就绪项

以下在本机已配置完成（见会话历史）：
- ✅ JDK 21（sdkman，后端编译用）
- ✅ Node 20.19.0（nvm，前端用）
- ✅ pnpm 8.6.12（corepack）
- ✅ Gradle 镜像（`~/.gradle/init.d/mirrors.gradle`）
- ✅ jetems 前端中文化（3 个 commit，已推送）

**待安装**：abctl（方案 A 需要）
