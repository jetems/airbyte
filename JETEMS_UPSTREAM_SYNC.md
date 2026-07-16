# JETEMS 上游同步保护手册

> **目的**：`git merge upstream/main` 时，**不覆盖、不删除** jetems 二开能力。  
> **配套脚本**：`./tools/jetems-verify-customizations.sh`（合并后必跑）。  
> **规范总览**：见 [JETEMS_DEV.md](./JETEMS_DEV.md)。

---

## 0. 铁律（每次同步必读）

1. **禁止**在冲突时一律 `git checkout --theirs` / `ours` 整文件覆盖。
2. **jetems 新增文件**（路径含 `jetems` / `docs-zh` / `zh.json`）若被标为 delete，**一律保留 ours**。
3. **上游文件里的侵入式改动**必须找 `JETEMS` / `JETEMS-START` / `JETEMS-END` 标记，**手工合并双方逻辑**。
4. 合并完成后必须跑：`./tools/jetems-verify-customizations.sh`，退出码非 0 **不得 push**。
5. 只 `push origin`，**永不 push upstream**。

---

## 1. 推荐同步流程

```bash
# 0) 工作区必须干净
git status   # 应为 nothing to commit

# 1) 可选：打保护 tag（方便回滚）
git tag "pre-upstream-sync-$(date +%Y%m%d)"

# 2) 拉取上游
git fetch upstream
git checkout main
git merge upstream/main
# 冲突时按第 2、3 节分类处理，禁止盲目 ours/theirs

# 3) 合并后强制校验（失败则修到通过）
./tools/jetems-verify-customizations.sh

# 4) i18n 完整性（上游若新增 en.json key）
# 缺翻译会 fallback 英文；批量补译可后续做，但不要丢 zh.json 文件本身
python3 tools/jetems-check-i18n-richtext.py || true

# 5) 改动相关模块验证
./gradlew :oss:airbyte-commons-entitlements:check \
          :oss:airbyte-commons-server:check \
          --init-script ~/.gradle/init.d/mirrors.gradle
cd airbyte-webapp && corepack pnpm lint

# 6) 提交
git add -A
git commit -m "merge: sync upstream/main into jetems fork

- 冲突处理说明：...
- 已确认多语言/企业版解锁/docs-zh 未被破坏
- jetems-verify-customizations.sh: PASS"
git push origin main
```

---

## 2. 文件分类与冲突策略

### A 类 — jetems 独占文件（上游不存在）

**策略：冲突/删除 → 一律保留，禁止被 merge 删掉。**

| 路径 | 能力 |
|------|------|
| `JETEMS_DEV.md` / `JETEMS_UPSTREAM_SYNC.md` / `LOCAL_RUN.md` / `ENTERPRISE_ANALYSIS.md` | 规范与文档 |
| `dev-values.jetems.yaml` / `dev-values.jetems-swr.yaml` | 本地/SWR 企业版部署 |
| `tools/jetems-*.sh` / `tools/jetems-*.py` / `tools/jetems-docs-zh/**` / `tools/JETEMS_IMAGE_PUBLISH.md` | 运维与文档工具 |
| `.github/workflows/jetems-publish-images.yml` | SWR 发布 CI |
| `airbyte-commons-entitlements/.../AllEntitledClient.kt` | 企业版 entitlement 全开 |
| `airbyte-commons-server/.../io/airbyte/jetems/docs/**` | 中文连接器文档 store + 测试 |
| `airbyte-commons-server/src/main/resources/docs-zh/**` | ~700+ 中文设置指南 |
| `airbyte-webapp/src/locales/zh.json` / `zh.errors.json` | 中文 UI |
| `airbyte-webapp/src/jetems/**` | LanguageToggle 等 |
| `airbyte-webapp/src/area/connectorBuilder/components/Builder/localizeCdkSchema.ts` | CDK schema 中文 |

### B 类 — 侵入式改动（上游也会改，高风险）

**策略：逐块合并。保留上游新逻辑 + 保留所有 `JETEMS*` 块。**  
合并后该文件内必须仍能 `rg 'JETEMS'` 命中。

| 路径 | 必须保留的二开点 |
|------|------------------|
| `.../EntitlementClientConfig.kt` | ENTERPRISE → `AllEntitledClient()`（非 `createStiggEnterpriseClient()`） |
| `.../EntitlementDefinitions.kt` | `Entitlements.all` 暴露 |
| `.../InstanceConfigurationHandler.kt` | `currentLicenseStatus()` 开头 `return LicenseStatus.PRO` |
| `.../ConnectorDocumentationHandler.kt` | 注入 `JetemsConnectorDocumentationStore` + locale=zh 优先 docs-zh |
| `.../ConnectorDocumentationHandlerTest.kt` | 对应 mock/用例 |
| `airbyte-api/.../openapi/config.yaml` | `ConnectorDocumentationRequestBody.locale` 字段 |
| `airbyte-server/.../application.yml` | `authentication: bearer` + `instance-admin.password` |
| `airbyte-webapp/.../I18nProvider.tsx` | zh bundle、`JetemsLocale`、`setLocale`、`messagesByLocale` |
| `airbyte-webapp/.../i18n/index.ts` | 导出 jetems locale 相关 API |
| `airbyte-webapp/.../useLocalStorage.ts` | locale 持久化 key（若有） |
| `airbyte-webapp/.../SideBar.tsx` | `LanguageToggle` import + 渲染 |
| `airbyte-webapp/.../connectorDocumentation.ts` | 请求带 `locale`；dev 下 zh 不走本地 EN docs |
| `airbyte-webapp/.../SchemaFormControl.tsx` | `localizeCdkSchemaTitle/Description` |
| `airbyte-webapp/.../MultiOptionControl.tsx` | 同上 |
| `airbyte-webapp/.../ObjectControl.tsx` | 若有 JETEMS 标记则保留 |
| 多个 Builder/UI 组件（见下表） | 硬编码 → i18n / jetems.* keys |
| `airbyte-db/db-lib/Dockerfile` | `postgres:17-alpine`（若上游回退 13/15，需按 jetems 意图保留 17 或再评估） |
| `airbyte-db/.../DatabaseConstants.kt` | `postgres:17-alpine` |
| `airbyte-base-java-image/build.gradle.kts` | SWR 发布 task 别名 |
| `tools/bin/check_images_exist.sh` | jetems 镜像检查改动 |
| `.github/workflows/gradle.yml` 等 CI | jetems 侧「关掉/改写」的 CI 行为（合并时对照 commit） |
| `README.md` | jetems 二开说明（与上游 README 手工拼） |

### B 类 — 前端侵入式 i18n 组件清单

合并这些文件时，搜索 `JETEMS` 与 `jetems.` / `formatMessage`：

- `SimpleAuthLoginForm.tsx`
- `AttemptLogs.tsx`
- `InputsView.tsx` / `StreamConfigView.tsx` / `WaitForSavingModal.tsx` / `PublishModal.tsx`
- `CustomHeader.tsx`（DatePicker）
- `FormDevToolsInternal.tsx`
- `ErrorDetails.tsx`
- `TagsTable.tsx`
- `OrganizationWorkspacesPage.tsx`

### C 类 — 内容型资源

| 资源 | 策略 |
|------|------|
| `zh.json` / `zh.errors.json` | **永不丢文件**。上游新增 `en.json` key → 可暂时缺中文（fallback en），后续补译；**禁止**用上游整文件覆盖 zh。 |
| `en.json` | 上游会大量更新。合并后保留上游新 key；**保留** jetems 新增的 `jetems.*` key（约 15 个）。 |
| `docs-zh/**` | 整树 jetems 资产。merge 若显示 deleted，全部 restore。 |
| OpenAPI 生成的 Java/TS 客户端 | 改完 `config.yaml` 后可能需要重新生成；勿手改生成物却丢 `locale` 字段语义。 |

---

## 3. 能力 ↔ 存活探针（人工也可对照）

| 二开能力 | 存活探针（任一失败 = 能力受损） |
|----------|--------------------------------|
| 中文 UI | 存在 `zh.json`；`I18nProvider` 含 `zhMessages`；`SideBar` 含 `LanguageToggle` |
| 连接器中文指南 | 存在 `JetemsConnectorDocumentationStore`；Handler 调用 `findChineseDoc`；`docs-zh` 目录非空；OpenAPI 有 `locale`；前端 hook 传 `locale` |
| CDK Builder 中文 | 存在 `localizeCdkSchema.ts`；`SchemaFormControl` import 该模块 |
| 企业版本地解锁 | 存在 `AllEntitledClient`；`EntitlementClientConfig` 创建它；`InstanceConfigurationHandler` 返回 `PRO` |
| 本地 abctl | 存在 `dev-values.jetems.yaml` + `tools/jetems-abctl-up.sh` |
| SWR 发布 | 存在 `jetems-publish-images.yml` + `tools/jetems-publish-images.sh` |
| PG17 | Dockerfile / DatabaseConstants 为 postgres 17 |

---

## 4. 冲突解决速查

| 场景 | 做法 |
|------|------|
| 新文件 only on ours，merge 提示 deleted by them | `git checkout --ours -- <path>` 再 `git add` |
| 同一函数上游重构 + 我们有 JETEMS 块 | 先接受上游结构，再把 JETEMS 块**重新贴到正确位置** |
| `I18nProvider` 大冲突 | 保留上游 `setMessageOverwrite`/LaunchDarkly 等逻辑；**必须**保留 zh import、`messagesByLocale`、`locale/setLocale` |
| `en.json` 大冲突 | 优先 theirs 再补回 `jetems.*` keys；或用 JSON merge 工具，**不要**丢 zh.json |
| entitlement / license 冲突 | 保留 AllEntitledClient 接线与 PRO 强制；在 commit message 注明「评估用途」 |
| 不确定 | **停下来问**；用 `pre-upstream-sync-*` tag 回退 |

---

## 5. 合并后最低验收

```bash
./tools/jetems-verify-customizations.sh   # 必须 PASS
rg -n 'JETEMS' \
  airbyte-commons-entitlements \
  airbyte-commons-server/src/main/kotlin \
  airbyte-webapp/src/core/services/i18n \
  airbyte-webapp/src/area/layout/SideBar
# 应有多处命中，且无「整文件被还原成纯上游、零 JETEMS」
```

可选冒烟：

- 启动后侧栏可切换中/英；
- 源连接器详情在中文下展示中文设置指南（或至少不 500）；
- 企业版无 “License is invalid” 横幅（评估环境）。

---

## 6. 维护本清单

新增二开时：

1. 优先**新文件/新包**（降低冲突面）。
2. 侵入上游文件必须加 `JETEMS-START` / `JETEMS-END`。
3. 更新本文件对应表格 + `tools/jetems-verify-customizations.sh` 探针。
4. 在 `JETEMS_DEV.md` 第 5 条标记规范下提交。

---

## 附：与上游的关系

```
origin    → jetems/airbyte          # 二开，push 目标
upstream  → airbytehq/airbyte-platform  # 只 fetch / merge
```

本仓库物理目录为根下扁平 `airbyte-server/` 等；Gradle 仍用 `:oss:` 前缀。详见 `JETEMS_DEV.md` §0。
