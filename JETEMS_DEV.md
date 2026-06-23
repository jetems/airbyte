# JETEMS_DEV.md — jetems 二次开发规范（AI Agent 必读）

> **本文件是 jetems 基于 airbytehq/airbyte-platform 二次开发的最高规范。**
> 任何 AI agent（或人类开发者）在本仓库工作时，**必须先读本文件**，并在所有改动中遵循。
>
> 与上游 `AGENTS.md` / `CLAUDE.md` 的关系：上游文档描述官方布局，本文件描述 jetems 二开约定。
> 两者冲突时，**上游代码结构事实优先**（见下文「项目结构真相」），**二开约定以本文件为准**。

---

## 0. 项目结构真相（必读，避免踩坑）

上游 `AGENTS.md` 描述的 `oss/airbyte-server`、`make build.oss` **与本仓库 main 分支的实际代码不符**：

| 事项 | 上游文档说法 | 本仓库实际情况 |
|------|------------|--------------|
| 物理目录 | `oss/airbyte-server/` | ❌ **扁平结构**，实际是根目录下 `airbyte-server/` |
| 构建命令 | `make build.oss` | ❌ 根目录**无 Makefile** |
| Gradle 模块路径 | `:oss:airbyte-server` | ✅ 正确（`settings.gradle.kts` 用 `projectDir` 重映射到扁平目录） |

**行动规则**：
- 改文件 → 直接改根目录的 `airbyte-server/`、`airbyte-webapp/` 等（**无 `oss/` 前缀**）
- 跑 Gradle → 任务名**必须带 `:oss:` 前缀**：`./gradlew :oss:airbyte-server:check`
- 不要相信上游 AGENTS.md 里的 `make xxx` 命令，全部改用 `./gradlew :oss:<module>:<task>`

### 远程仓库配置

```
origin    git@github-jetems:jetems/airbyte.git          # jetems 二开仓库（push 到这里）
upstream  https://github.com/airbytehq/airbyte-platform.git  # 上游官方（用于同步）
```

- **`origin` 的 host 是 `github-jetems`**（SSH 别名，见 `~/.ssh/config`），`HostName` 仍是 `github.com`，
  只是强制走 jetems 专用密钥。**不要改回 `git@github.com:`，否则会认证到错误账号。**
- 提交只 push 到 `origin`，**永远不要 push 到 `upstream`**。

### 技术栈版本（必须遵守，否则编译失败）

| 项 | 要求 | 说明 |
|----|------|------|
| JDK | **21**（CI/Dockerfile 均锁 21） | `sdk use java 21.0.8-tem`；用 JDK 25 会编译失败 |
| Gradle | 9.2.0（用 `./gradlew`） | 已配阿里云镜像于 `~/.gradle/init.d/mirrors.gradle` |
| 前端 | Node 20 + **pnpm 8.6.12** | 在 `airbyte-webapp/` 内用 `corepack pnpm ...` |

---

## 1. 上游同步与冲突处理【核心规则】

### 1.1 同步流程

定期从上游同步官方更新，**始终在干净的 `main` 上操作**：

```bash
git fetch upstream
git checkout main
git merge upstream/main          # 优先用 merge，保留二开历史；不要用 rebase（会丢失 jetems 提交的可追溯性）
```

### 1.2 冲突分类处理（强制）

遇到合并冲突时，**禁止盲目选择 "ours" 或 "theirs"**。必须按以下流程分类处理：

**第一步：判断冲突类型**

| 冲突类型 | 判断依据 | 处理方式 |
|---------|---------|---------|
| **A. 噪声冲突** | 仅空白/格式/import 顺序差异 | 直接重新格式化解决 |
| **B. 非功能性冲突** | 双方改动逻辑不重叠（如不同函数、不同 key） | 手动合并双方内容，保留全部改动 |
| **C. 功能性冲突** | 双方改了**同一逻辑/同一数据结构/同一 API 契约** | **必须进入第二步深入分析** |

**第二步：功能性冲突的强制分析（C 类）**

对每个功能性冲突，agent 必须在解决前完成以下分析，**并将分析写入 commit message**：

1. **上游改了什么**：读 upstream 侧的完整 diff 和上下文，理解其意图（修 bug？加功能？重构？）
2. **jetems 改了什么**：读 ours 侧的改动，明确二开目的
3. **冲突根因**：为什么两者不能自动合并（数据结构变了？语义变了？）
4. **合并方案**：如何同时满足上游意图和 jetems 需求（不能简单丢弃任一方）
5. **回归风险**：合并后可能影响的调用方、测试、其他模块

> **铁律**：C 类冲突若无法给出上述 5 点完整分析，**视为该冲突尚未解决，不得提交**。
> 宁可停下来向用户确认，也不要用一个"看起来能编译"的合并蒙混过关——
> 那几乎一定会在运行时引入隐蔽 bug。

### 1.3 同步后的强制验证

合并完成后，提交前必须运行（见第 7 条质量门禁）：
- 改到的每个后端模块：`./gradlew :oss:<module>:check`
- 前端改动：`cd airbyte-webapp && corepack pnpm lint && corepack pnpm test`

---

## 2. 新功能的隔离式扩展

为降低与上游合并的冲突面，**新增功能尽量不修改上游文件，而是新增包/文件**。

### 2.1 后端（Kotlin/Micronaut）

- **包名约定**：jetems 新增代码放在专属包路径下，如 `io.airbyte.jetems.<feature>`。
  不要把新类塞进上游的 `io.airbyte.server.handlers` 等包。
- **新模块 vs 新包**：
  - 小功能 → 在相关模块内新增 `jetems/` 子包（如 `airbyte-server/.../jetems/`）
  - 独立大功能 → 考虑新增 Gradle 子模块 `airbyte-jetems-<feature>/`，在 `settings.gradle.kts` 注册
- **扩展点优先**：优先用 Micronaut 的 `@Replaces`、配置覆盖、OpenAPI 新增 operation 等非侵入方式扩展，
  而非直接改上游类。
- **确需改上游文件时**：用最小改动原则，优先在原方法旁边新增重载/扩展，而不是重写原方法。

### 2.2 前端（React）

- **新增页面/组件**：放在 `airbyte-webapp/src/jetems/` 目录树下，不混入上游 `src/pages`、`src/components`。
- **新增路由**：在路由配置中追加 jetems 路由，不改动上游现有路由定义。
- **确需改上游组件时**：优先用 wrapper/HOC 包裹，而非改原文件内部。

> **原则**：让 `git merge upstream/main` 时，jetems 改动尽可能集中在**上游不会动的文件**里。
> 上游文件被改动越少，未来同步越轻松。

---

## 3. 前端多语言化（i18n）的保护规则【最易被覆盖，重点遵守】

### 3.1 现状与技术方案

- 国际化库：**`react-intl`（FormatJS）**，见 `airbyte-webapp/src/core/services/i18n/I18nProvider.tsx`
- 翻译文件：`airbyte-webapp/src/locales/en.json`（2612 行，扁平 key 如 `workspaces.title`）+ `en.errors.json`
- **上游目前只有英文**。jetems 的多语言化（中文等）是**完全新增的二开能力**。

### 3.2 多语言改造的正确姿势（避免被上游覆盖）

> **核心洞察**：`I18nProvider.tsx` 第 7-8 行**硬编码 import 了 `en.json`**，
> 且第 43-50 行 `mergedMessages` 已支持 `overwrittenMessages` 覆盖机制。
> 这是 jetems 多语言化的**正确切入点**。

**✅ 推荐：新增独立的 locale 文件 + 在 I18nProvider 注入，不修改 `en.json` 内容**

- 新建 `airbyte-webapp/src/locales/zh.json`、`zh.errors.json` 等 jetems 语言文件
  （这些是 jetems 新增文件，上游同步不会冲突）
- 在 `I18nProvider.tsx` 增加 locale 选择与对应 messages 加载逻辑
  （此文件改动需谨慎，见 3.3）
- jetems 自定义文案 key 统一加前缀 `jetems.`（如 `jetems.customFeature.title`），
  与上游 key 空间隔离

**❌ 禁止：直接修改 `en.json` 里上游已有的 key 的值**（会被上游同步覆盖）

### 3.3 `I18nProvider.tsx` 等共享文件的合并保护

这类文件上游也会频繁改动（新增 key、调整逻辑），是**冲突高发区**。合并时：

1. **逐行核对**：上游新增的 key/逻辑必须保留，jetems 的 locale 加载逻辑必须保留
2. **翻译完整性检查**：合并后必须运行检查，确保：
   - 上游新增的 key 在 jetems 语言文件中要么有翻译，要么有 fallback 机制
   - jetems 删除/重命名的 key 没有留下孤立引用
3. **回归测试**：合并后启动前端，切换语言验证无 `FormattedMessage` 缺失 key 的告警

> **铁律**：任何涉及 `src/locales/` 或 `src/core/services/i18n/` 的合并冲突，
> 解决后必须在 commit message 中说明"已确认多语言完整性未被破坏"。

---

## 4. 白标（Branding）改动集中化

logo / 产品名 / 主题色 / 品牌文案等白标改动，**必须集中管理，不得散落各处**。

### 4.1 集中化原则

- **主题色 / 设计 token**：集中在前端主题配置文件（如 tailwind/theme config），不内联在组件里
- **品牌文案**：统一用 i18n key（如 `general.airbyte` → 通过覆盖机制改为 jetems 品牌），
  不在组件里硬编码字符串
- **logo / 静态资源**：集中在 `airbyte-webapp/public/` 或 `src/assets/jetems/`，通过配置引用，不散落引用路径

### 4.2 与上游同步时的白标保护

上游更新可能引入新的硬编码 "Airbyte" 字样或新 logo 引用。合并后需扫描确认白标未被破坏：

```bash
# 合并后检查是否有新的、未走 i18n 的品牌硬编码
grep -rn "Airbyte" airbyte-webapp/src --include="*.tsx" --include="*.ts" | grep -v node_modules
```

---

## 5. 二开代码可识别标记

所有 jetems 二开代码必须**可被一眼识别**，便于未来 cherry-pick、审计、同步。

### 5.1 命名标记

| 维度 | 约定 |
|------|------|
| 后端包名 | `io.airbyte.jetems.*` |
| 后端类名 | 关键二开类加 `Jetems` 前缀或后缀（如 `JetemsAuthHandler`） |
| 前端目录 | `airbyte-webapp/src/jetems/` |
| 前端组件 | jetems 专属组件加 `Jetems` 前缀 |
| 配置 key | 自定义配置加 `jetems.` 前缀（如 `jetems.feature.x`） |
| i18n key | `jetems.*` 前缀 |
| Gradle 模块 | `airbyte-jetems-*` |

### 5.2 代码内注释标记

对上游文件做的**侵入式改动**（非新增文件），必须在改动处加注释标记，便于合并时定位：

```kotlin
// JETEMS-START: <简述二开目的>
... 改动内容 ...
// JETEMS-END
```

```tsx
{/* JETEMS-START: 中文 locale 加载 */}
...
{/* JETEMS-END */}
```

> 这些标记让 `git blame` 和合并冲突解决时能快速识别"哪些是 jetems 加的"。

---

## 6. 安全与许可证合规

### 6.1 许可证背景

本仓库基于 **MIT + ELv2** 双协议。ELv2 对商用有限制（特别是移除/修改许可证、绕过许可校验）。
jetems 二开若用于商业部署，**必须法务确认 ELv2 约束**。

### 6.2 硬性规则

- **不得移除或绕过**上游的 license 校验逻辑（`airbyte-commons-license/`），
  除非已确认法律授权。改动前先问用户。
- **不得在代码、commit、文档中写入任何密钥、token、凭证、个人数据**。
  配置示例用占位符（`<your-secret>`）。
- **不得改动 `LICENSE` 文件**，除非有明确法律授权。
- 新增依赖必须在 `deps.toml`（后端）或 `package.json`（前端）登记，
  并确认其许可证与 MIT/ELv2 兼容。

---

## 7. 质量门禁与提交规范

### 7.1 提交前必跑（按改动范围）

```bash
# 后端：每个改动过的模块
./gradlew :oss:<module>:spotlessApply     # 先格式化
./gradlew :oss:<module>:check             # 编译 + 测试 + 格式检查

# 前端
cd airbyte-webapp
corepack pnpm lint
corepack pnpm test
```

> 用 `--init-script ~/.gradle/init.d/mirrors.gradle` 确保依赖能拉取。

**铁律：任一检查不通过，不得提交、不得 push。**

### 7.2 Commit 规范

- 格式：`type(scope): subject`，type 用 `feat/fix/refactor/docs/chore/style/test`
- jetems 二开 commit 的 subject 或 body 中应能体现是二开改动
- **功能性冲突合并、i18n 合并、白标改动**的 commit，body 必须包含本规范要求的分析说明
  （见 1.2 第二步、3.3、4.2）

### 7.3 分支约定

- `main` → 跟随上游 + 稳定二开，保持随时可同步上游
- 二开功能开发 → `jetems/feature-<name>` 分支，完成后合并回 `main`
- 只 push 到 `origin`，**永不 push 到 `upstream`**

---

## 8. Agent 工作检查清单（每次任务结束前过一遍）

- [ ] 改动是否遵循了「隔离式扩展」（第 2 条）？新功能是否优先新增包/文件而非改上游？
- [ ] 是否动了 `src/locales/` 或 `src/core/services/i18n/`？若动了，多语言完整性是否已确认（第 3 条）？
- [ ] 白标改动是否集中管理（第 4 条）？合并后是否扫描了新的品牌硬编码？
- [ ] 所有 jetems 代码是否有可识别标记（包名/前缀/`JETEMS-START` 注释）（第 5 条）？
- [ ] 是否触碰了 license 校验、密钥、LICENSE 文件（第 6 条）？触碰前是否已确认授权？
- [ ] 是否跑了对应模块的 `spotlessApply` + `check` / 前端 `lint` + `test`（第 7 条）？
- [ ] commit message 是否符合规范，功能性冲突/i18n 合并是否写明了分析？

**若任一项未满足，视为任务未完成，不得宣告"已完成"。**

---

## 附：常用命令速查

```bash
# JDK 环境（新终端）
source ~/.sdkman/bin/sdkman-init.sh && sdk use java 21.0.8-tem

# 后端
./gradlew :oss:airbyte-server:spotlessApply --init-script ~/.gradle/init.d/mirrors.gradle
./gradlew :oss:airbyte-server:check --init-script ~/.gradle/init.d/mirrors.gradle
./gradlew :oss:airbyte-server:test --tests "*HandlerTest" --init-script ~/.gradle/init.d/mirrors.gradle

# 前端（在 airbyte-webapp/ 内）
corepack pnpm install
corepack pnpm lint
corepack pnpm test
corepack pnpm start

# 上游同步
git fetch upstream
git merge upstream/main
# → 按「第 1 条」处理冲突，按「第 7.1 条」跑验证后提交
```
