# ENTERPRISE_ANALYSIS.md — 企业版功能代码详细分析（jetems 二开参考）

> 本文档基于 `airbyte-platform` 源码深度分析企业版（Enterprise/Pro）功能的**完整代码实现、门禁机制、激活条件**。
> 所有结论源自源码（文件路径+行号），是二开决策的权威参考。
>
> 阅读前请先读 [JETEMS_DEV.md](./JETEMS_DEV.md)。⚠️ 第 6 节涉及许可证合规（ELv2），商用前需法务确认。

---

## 0. 核心结论（先看这个）

1. **企业版功能代码基本都在本仓库**（不是空壳）。8 大功能中 **6 个是完整真实实现**，只有 **2 个是 stub**（PrivateLink、AI Copilot 的后端）。
2. **门禁分两层**：License 层（`@RequiresAirbyteProEnabled`，决定 bean 激活）+ Entitlement 层（`EntitlementService.checkEntitlement()`，运行时按 org 检查）。
3. **License 验证极弱**：不校验签名、不校验过期，只看 JWT payload 里 `license` 字段是否等于 `"pro"`。而绝大多数企业功能门禁用的 `AirbyteProEnabledCondition` **只看 `AIRBYTE_EDITION`，完全不看 license key**。
4. **当前只需设 `AIRBYTE_EDITION=ee` 就能激活绝大多数企业版 bean**（license key 是什么不重要）。
5. **Entitlement 层是真正的运行时门禁**：业务代码在每个 API 入口调 `ensureEntitled(orgId, entitlement)`。社区版（`NoEntitlementClient`）全部返回 false，硬编码无法通过配置改变。
6. **合规风险**：强制解锁企业功能需绕过 license（ELv2 禁止）。合法路径是获取有效企业许可证（`AIRBYTE_LICENSE_KEY`）+ 设 `AIRBYTE_EDITION=ee`。

---

## 1. License 验证系统（门禁第一层）

### 1.1 模块结构

`airbyte-commons-license/` —— 仅 6 个 Kotlin 文件：

| 文件 | 作用 |
|------|------|
| `AirbyteLicense.kt` | License 数据类 + `LicenseType` 枚举 |
| `ActiveAirbyteLicense.kt` | `@Singleton` bean，启动时从 license key 解析 `AirbyteLicense` |
| `annotation/RequiresAirbyteProEnabled.kt` | 注解 → `AirbyteProEnabledCondition` |
| `annotation/RequiresVerifiedAirbyteProLicense.kt` | 注解 → 两个 Condition 叠加 |
| `condition/AirbyteProEnabledCondition.kt` | 只看 edition == ENTERPRISE |
| `condition/VerifiedProLicenseCondition.kt` | 看 `ActiveAirbyteLicense.isPro` |

### 1.2 License 数据类（`AirbyteLicense.kt:15`）

```kotlin
data class AirbyteLicense(
  val type: LicenseType,                       // PRO / INVALID / TRIAL / ENTERPRISE
  val expirationDate: Date? = null,            // JWT exp（毫秒）—— ⚠️ 从不校验是否过期
  val maxNodes: Int? = null,                   // 最大节点数
  val maxEditors: Int? = null,                 // 最大编辑者数
  val enterpriseConnectorIds: Set<UUID> = emptySet(),  // 授权的企业连接器
  val isEmbedded: Boolean = false,             // 嵌入式部署
  val stiggEntitlements: String? = null,       // 离线 Stigg entitlements JSON
)
```

### 1.3 License 加载与"验证"（`ActiveAirbyteLicense.kt:31-56`）

**唯一来源**：环境变量 `AIRBYTE_LICENSE_KEY`（无文件、无 API、无 license server）。

```kotlin
private fun extractLicense(): AirbyteLicense {
  val fragments = licenceKey.split(".")
  if (fragments.size != 3) return INVALID_LICENSE       // 必须是 3 段 JWT
  val body = fragments[1]                                 // 只取 payload
  val jwt = Jsons.deserialize(Base64.decode(body), LicenseJwt::class.java)
  if (jwt.license != null && jwt.exp != null) {          // 只要求 license + exp 非空
    return AirbyteLicense(jwt.license, ...)
  }
  return INVALID_LICENSE
}
```

**关键漏洞（设计上的）**：
- ❌ **不校验签名**（`fragments[2]` 被完全忽略）
- ❌ **不校验过期**（读了 `exp` 但从不检查）
- ✅ 只校验：3 段格式 + payload 能解码 + `license`/`exp` 非空

### 1.4 两个门禁 Condition（核心）

**`AirbyteProEnabledCondition`**（`condition/AirbyteProEnabledCondition.kt:18`）—— 最宽松，用得最多：
```kotlin
override fun matches(context): Boolean =
  context.getBean<AirbyteEdition>() == AirbyteEdition.ENTERPRISE
```
注释明确："目前即使没有验证过的 license 也会通过"。

**`VerifiedProLicenseCondition`**（`condition/VerifiedProLicenseCondition.kt:17`）—— 更严，但**无业务代码使用**：
```kotlin
override fun matches(context): Boolean =
  context.findBean<ActiveAirbyteLicense>()?.isPro ?: false
// isPro = (license.type == LicenseType.PRO)
```

| 维度 | `@RequiresAirbyteProEnabled` | `@RequiresVerifiedAirbyteProLicense` |
|------|:---:|:---:|
| 看 edition | ✅ 必须 ENTERPRISE | ✅ |
| 看 license key | ❌ | ✅（JWT 里 `license` 必须是 `"pro"`） |
| 业务代码使用 | ✅（5+ 处） | ❌（零使用，只有定义） |

### 1.5 LicenseType 枚举（`AirbyteLicense.kt:24`）

```kotlin
enum class LicenseType(@JsonValue val value: String) {
  PRO("pro"),          // 唯一让 isPro=true 的类型
  INVALID("invalid"),  // 解析失败兜底
  TRIAL("trial"),
  ENTERPRISE("enterprise"),  // 注意：enterprise 类型反而让 isPro=false！
}
```

⚠️ **反直觉坑**：真正的"企业版" license key（payload `license:"enterprise"`）会让 `VerifiedProLicenseCondition` 失败（因为 `isPro` 只认 `"pro"`）。`ENTERPRISE` 类型是给 Stigg 离线 entitlements 链路用的。

### 1.6 激活企业版 bean 的条件

**只需**：`AIRBYTE_EDITION=ee`（解析为 `ENTERPRISE`）。

```bash
# 这一行就能激活所有 @RequiresAirbyteProEnabled 的 bean
AIRBYTE_EDITION=ee
# license key 是什么无所谓（AirbyteProEnabledCondition 不看它）
```

`AIRBYTE_LICENSE_KEY` 仅在以下情况有意义：
- `EnterpriseEntitlementProvider` 读 `license.enterpriseConnectorIds`（企业连接器授权）
- `EntitlementClientFactory` 用 `license.stiggEntitlements` 构造离线 Stigg client

---

## 2. Entitlement 门禁系统（门禁第二层）

### 2.1 架构

`airbyte-commons-entitlements/` —— 运行时按组织检查功能权限。

```
业务代码 → EntitlementService.checkEntitlement(orgId, entitlement)
                              ↓
                     EntitlementClient（由 edition 决定）
              ┌───────────────┼───────────────┐
        NoEntitlementClient  StiggEnterprise  StiggCloud
        (COMMUNITY)         (ENTERPRISE)      (CLOUD)
        全返回 false         license 离线      远程 API
```

### 2.2 Client 选择逻辑（`EntitlementClientConfig.kt:42-51`）

```kotlin
@Singleton
fun entitlementClient(): EntitlementClient =
  when (airbyteConfig.edition) {
    COMMUNITY -> NoEntitlementClient()           // 全 false
    ENTERPRISE -> createStiggEnterpriseClient()  // 需 license.stiggEntitlements
    CLOUD -> createStiggCloudClient()            // 需 Stigg sidecar
  }
```

**Enterprise 版的回退**（`createStiggEnterpriseClient:91-109`）：若 license 为 null 或 `stiggEntitlements` 为空 → **退回 `NoEntitlementClient`**（全 false）。所以光设 edition=ee 但 license 没有合法 `stiggEntitlements`，Entitlement 层仍全部 false。

### 2.3 NoEntitlementClient（社区版，`NoEntitlementClient.kt:18`）

```kotlin
override fun checkEntitlement(orgId, entitlement): EntitlementResult =
  EntitlementResult(featureId, isEntitled = false, reason = "NoEntitlementClient grants no entitlements")
```

**硬编码 false，无法通过配置改变**。

### 2.4 EntitlementService（业务调用入口，`EntitlementService.kt:136-162`）

```kotlin
override fun checkEntitlement(orgId, entitlement): EntitlementResult =
  when (entitlement) {
    SsoEntitlement -> hasSsoConfigUpdateEntitlement(orgId)              // client || provider
    DestinationObjectStorageEntitlement -> ...                          // client || provider
    SelfManagedRegionsEntitlement -> ...                                // client || provider
    ConfigTemplateEntitlement -> ...                                    // client || provider
    else -> entitlementClient.checkEntitlement(orgId, entitlement)      // 仅 client
  }
```

- `ensureEntitled(orgId, entitlement)`：若 false 则抛 `LicenseEntitlementProblem`（HTTP 错误）。
- 4 个"遗留" entitlement 走 `client || provider`（任一 true 即通过），其余只查 client。

### 2.5 完整 Entitlement 清单（`EntitlementDefinitions.kt`）

**平台功能（17 个）**：

| Entitlement | featureId | 门禁方式 |
|-------------|-----------|---------|
| FasterSyncFrequency | feature-faster-sync-frequency | 后端保存校验 + 巡检 |
| FifteenMinuteSyncFrequency | feature-15-minute-sync-frequency | 后端保存校验 + 巡检 |
| DestinationObjectStorage | feature-destination-object-storage | client \|\| provider |
| Sso | feature-sso | client \|\| provider（每个 API 强制） |
| Orchestration | feature-orchestration | ensureEntitled |
| SelfManagedRegions | feature-self-managed-regions | client \|\| provider |
| PrivateLink | feature-privatelink | 前端（后端 API 是 stub） |
| PrivateLinkLimit | feature-privatelink-limit | 数值 |
| AiCopilot | feature-ai-copilot | 前端（后端 explainJob 是 stub） |
| MultipleWorkspaces | feature-multiple-workspaces | 前端 |
| Mappers | feature-mappers | 后端连接保存校验 |
| RbacRoles | feature-rbac-roles | 前端角色 UI（后端用 @Secured） |
| RejectedRecordsStorage | feature-rejected-records-storage | ensureEntitled |
| ConfigTemplate(embedded) | feature-embedded | client \|\| provider |
| UnlimitedConnections | feature-unlimited-n-connections | ensureEntitled |
| Groups | feature-groups | ensureEntitled（Enterprise 版短路放行） |
| OnDemandCapacity / CommittedDataWorkers | ... | ensureEntitled |

**企业连接器（9 个，`ConnectorEntitlement`）**：
destination-salesforce、source-netsuite、source-oracle、source-sap-hana、source-servicenow、source-sharepoint、source-sharepoint-lists、source-workday、source-db2。

### 2.6 EntitlementPlan 枚举（`EntitlementPlan.kt`）

计划定义但不静态绑定 entitlement（运行时查 Stigg paywall）：

| 枚举 | Stigg Plan ID | 类别 |
|------|---------------|------|
| CORE | plan-airbyte-core | Self-Managed |
| SME | plan-airbyte-sme | Self-Managed Enterprise |
| STANDARD / STANDARD_TRIAL | plan-airbyte-standard[-trial] | Cloud |
| PLUS | plan-airbyte-plus | Cloud |
| PRO | plan-airbyte-pro | Cloud（原 Teams） |
| FLEX | plan-airbyte-flex | Cloud Enterprise |
| EMBEDDED_* | plan-airbyte-embedded-* | Sonar/Embedded |

---

## 3. 各企业版功能代码实现详析

### 3.1 RBAC 细粒度角色 ✅ 完整实现

**代码完整性：真实实现，非 stub。**

- **角色定义**：`airbyte-commons-auth/.../roles/AuthRoleConstants.kt`（16 个角色：INSTANCE_ADMIN、ORGANIZATION_{ADMIN,EDITOR,RUNNER,READER,MEMBER}、WORKSPACE_{ADMIN,EDITOR,RUNNER,READER}）
- **角色继承**：`OrganizationAuthRole.kt` / `WorkspaceAuthRole.kt` 用 authority 等级（500/400/300/200/100）实现（admin 拥有 editor 权限）
- **权限检查**：`IntentSecurityRule.kt`（Micronaut SecurityRule）对比 `intents.yaml`（197 行，定义每个 Intent 允许的角色）
- **API**：`PermissionApiController.kt`（CRUD，每方法 `@Secured(ORGANIZATION_ADMIN, WORKSPACE_ADMIN)`）
- **门禁**：
  - 后端强制：`@Secured` + `@RequiresIntent`（真实 RBAC，非 entitlement）
  - `feature-rbac-roles` entitlement 仅控制**前端角色选项 UI 可见性**
  - 降级：`FeatureDegradationService.kt:93` 把 EDITOR/RUNNER/READER 降为 WORKSPACE_ADMIN

### 3.2 SSO 单点登录 ✅ 完整实现

**代码完整性：完整的 Keycloak + OIDC 集成。**

- **API**：`SSOConfigApiController.kt`（getSsoConfig/createSsoConfig/deleteSsoConfig/updateSsoCredentials/activateSsoConfig/validateSsoToken）
- **核心**：`SsoConfigDomainService.kt` —— 创建 Keycloak realm、import IdP、OIDC discovery、token 校验、email domain → org 映射、默认角色分配
- **Keycloak 客户端**：`AirbyteKeycloakClient`（REST 客户端）
- **OIDC 配置**：`OidcConfigFactory.kt`
- **部署**：`airbyte-keycloak/`（Dockerfile + themes）、`airbyte-keycloak-setup/`（自动化 realm/client/IdP 配置）
- **门禁**：
  - 每个 SSO API 方法第一行 `entitlementService.ensureEntitled(orgId, SsoEntitlement)`
  - `@Secured(ORGANIZATION_ADMIN)`
  - 前端：`FeatureItem.AllowUpdateSSOConfig`

### 3.3 映射器 Mappers ✅ 完整实现

**代码完整性：独立模块 `airbyte-mappers/`，4 类映射全部实现。**

- **哈希**：`HashingMapper.kt`（MD2/MD5/SHA-1/SHA-224/256/384/512）
- **加密**：`EncryptionMapper.kt`
- **过滤**：`FieldFilteringMapper.kt`（字段级）、`RowFilteringMapper.kt`（行级）
- **重命名**：`FieldRenamingMapper.kt`
- 还有 `DestinationCatalogGenerator.kt`（mapper 改写目标 catalog）、`ConfiguredMapperValidator.kt`
- **门禁**：`ConnectionEntitlementHelper.kt:64-68` 保存连接时若 catalog 含 mapper 且无 `MappersEntitlement` → 连接被锁定

### 3.4 PrivateLink 私有连接 ⚠️ API 是 stub

**代码完整性：数据层完整，但 HTTP API 控制器是空壳。**

- **API 控制器（STUB）**：`PrivateLinkController.kt` —— 5 个方法（create/list/delete/get/update）**全部 `throw ApiNotImplementedInOssProblem()`**
- **数据层（真实但未被调用）**：`PrivateLinkService.kt`（完整 CRUD）、`PrivateLinkRepository.kt`、6 个 DB 迁移
- **前端**：`airbyte-webapp/src/cloud/views/settings/privateLinks/`
- **结论**：前端 UI + 数据层齐全，但 REST 控制器空壳。调用会返回 "Not implemented"。**需补 controller 实现才能用**。

### 3.5 多工作区 ✅ 完整实现（前端门禁为主）

**代码完整性：后端创建逻辑完整。**

- **API**：`WorkspaceApiController.kt:63`（createWorkspace）
- **门禁**：
  - 后端：检查 `CreateOrganizationWorkspaces` intent（RBAC，非 entitlement）
  - 前端（主要限制）：`OrganizationWorkspacesPage.tsx:75` —— 第一个 workspace 无条件允许，第二个起需 `CreateMultipleWorkspaces` entitlement
  - 后端**没有** `ensureEntitled(MultipleWorkspacesEntitlement)` 调用（限制靠前端 + RBAC）

### 3.6 AI Copilot ⚠️ 后端是 stub

**代码完整性：前端完整，后端 explain API 是空壳。**

- **后端（STUB）**：`JobsApiController.kt:268`：
  ```kotlin
  @Post("/explain")
  override fun explainJob(...): JobExplainRead = throw ApiNotImplementedInOssProblem()
  ```
  无 `@Replaces` 的 Enterprise 实现。
- **前端（完整）**：`airbyte-webapp/src/area/connector/components/chat/`（完整 chat 组件库）、`AISyncFailureExplanation/`
- **结论**：前端 chat UI 齐全，但后端无 LLM 实现。**需补 controller 才能用**。

### 3.7 企业版连接器 ✅ 完整实现（多层强制）

**代码完整性：完整的多层门禁。**

- **运行时验证**：`LicenseEntitlementChecker.kt` —— 对 `enterprise=true` 的连接器查 entitlement，未授权抛 `LicenseEntitlementProblem`
- **连接校验**：`ConnectionEntitlementHelper.kt:124-134`
- **定时巡检**：`ConnectionEntitlementsValidator.kt`（`@Scheduled(fixedRate="1h")`）—— 每小时扫描，未授权连接 disable
- **双源合并**：`EntitlementService.kt:266-303` 合并 Stigg（Cloud）+ license（Enterprise）
- **前端**：`SelectConnector.tsx:247` 未授权弹升级提示

### 3.8 同步频率 ✅ 完整实现

**代码完整性：前后端完整门禁。**

- **后端保存校验**：`ConnectionScheduleHelper.kt:263` —— 根据两个 entitlement 决定最小频率
- **巡检降级**：`FeatureDegradationService.kt:96` 降级到 hourly
- **前端**：`useBasicFrequencyDropdownData.tsx:55` 控制频率选项

---

## 4. 功能完整性汇总表

| 功能 | 代码完整 | 后端门禁 | 激活方式 |
|------|:---:|:---:|------|
| RBAC 角色 | ✅ | @Secured + intent | edition=ee（后端强制本就有） |
| SSO | ✅ | ensureEntitled(Sso) | edition=ee + entitlement=true |
| Mappers | ✅ | 连接保存校验 | edition=ee + entitlement=true |
| PrivateLink | ⚠️ **API stub** | — | 需补 controller |
| 多工作区 | ✅ | 前端为主 | edition=ee（前端 feature） |
| AI Copilot | ⚠️ **后端 stub** | — | 需补 explainJob |
| 企业连接器 | ✅ | 多层 + 1h 巡检 | edition=ee + license 含 connectorIds |
| 同步频率 | ✅ | 保存校验 + 巡检 | edition=ee + entitlement=true |

---

## 5. 激活企业版功能的合法路径

### 路径 A：有效企业许可证（合规）

```bash
# 1. 获取合法的企业 license key（含 stiggEntitlements）
AIRBYTE_LICENSE_KEY="<合法的 enterprise JWT>"
AIRBYTE_EDITION=ee
# → EntitlementClientFactory 用 license.stiggEntitlements 构造离线 Stigg client
# → 所有有 entitlement 的功能解锁
```

### 路径 B：仅激活 bean（部分功能，不完整）

```bash
AIRBYTE_EDITION=ee
AIRBYTE_LICENSE_KEY=  # 空
# → @RequiresAirbyteProEnabled 的 bean 激活（EnterpriseActorDefinitionAccessValidator 等）
# → 但 Entitlement 层仍用 NoEntitlementClient（全 false），因为 license 无 stiggEntitlements
# → 结果：RBAC 后端生效，但 SSO/Mappers/企业连接器 等仍被 entitlement 拦截
```

### 路径 C：完全解锁（⚠️ 违反 ELv2，仅研究）

需改代码绕过 license/entitlement（ELv2 明确禁止"移除或绕过许可证校验"，JETEMS_DEV.md 6.1）。**不推荐，商用有法律风险**。

---

## 6. 关键文件索引

### License 系统
- `airbyte-commons-license/src/main/kotlin/io/airbyte/commons/license/AirbyteLicense.kt`
- `airbyte-commons-license/src/main/kotlin/io/airbyte/commons/license/ActiveAirbyteLicense.kt`
- `airbyte-commons-license/src/main/kotlin/io/airbyte/commons/license/condition/AirbyteProEnabledCondition.kt`
- `airbyte-commons-license/src/main/kotlin/io/airbyte/commons/license/condition/VerifiedProLicenseCondition.kt`

### Entitlement 系统
- `airbyte-commons-entitlements/src/main/kotlin/io/airbyte/commons/entitlements/EntitlementClientConfig.kt`（Factory）
- `airbyte-commons-entitlements/src/main/kotlin/io/airbyte/commons/entitlements/NoEntitlementClient.kt`
- `airbyte-commons-entitlements/src/main/kotlin/io/airbyte/commons/entitlements/EntitlementService.kt`
- `airbyte-commons-entitlements/src/main/kotlin/io/airbyte/commons/entitlements/models/EntitlementDefinitions.kt`
- `airbyte-commons-entitlements/src/main/kotlin/io/airbyte/commons/entitlements/FeatureDegradationService.kt`

### 各功能实现
- RBAC：`airbyte-commons-auth/src/main/kotlin/io/airbyte/commons/auth/roles/`、`permissions/IntentSecurityRule.kt`
- SSO：`airbyte-server/.../apis/controllers/SSOConfigApiController.kt`、`airbyte-domain/services/.../sso/SsoConfigDomainService.kt`
- Mappers：`airbyte-mappers/src/main/kotlin/io/airbyte/mappers/transformations/`
- PrivateLink（stub）：`airbyte-server/.../apis/controllers/PrivateLinkController.kt`
- AI Copilot（stub）：`airbyte-server/.../apis/controllers/JobsApiController.kt:268`
- 企业连接器：`airbyte-commons-entitlements/.../LicenseEntitlementChecker.kt`、`airbyte-cron/.../ConnectionEntitlementsValidator.kt`
- 同步频率：`airbyte-commons-server/.../handlers/helpers/ConnectionScheduleHelper.kt`

### 配置
- `airbyte-server/src/main/resources/application.yml:154-155`（edition、license-key）
- `.env.jetems`（jetems 本地运行配置）
