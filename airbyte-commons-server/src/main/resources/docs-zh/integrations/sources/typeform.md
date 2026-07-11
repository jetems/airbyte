# Typeform

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

Typeform 源连接器用于同步表单、回复、Webhook 与工作区等数据。

## 设置指南

### 步骤 1：准备 Typeform 凭证

<!-- env:oss -->

**开源 / 自托管：**

1. 登录 Typeform 账户
2. 打开账户设置中的 Personal tokens
3. 生成新令牌，勾选至少：`forms:read`、`responses:read`、`webhooks:read`、`workspaces:read`、`images:read`、`themes:read`  
   详见 [OAuth scopes](https://www.typeform.com/developers/get-started/scopes/)

<!-- /env:oss -->

<!-- env:cloud -->

**Airbyte Cloud：** 跳过本步，使用 OAuth 授权即可。

<!-- /env:cloud -->

### 步骤 2：在 Airbyte 中配置

<!-- env:cloud -->

**Cloud：**

1. [登录 Airbyte Cloud](https://cloud.airbyte.com/workspaces)
2. 「源」→「+ 新建源」→ **Typeform**
3. 点击「认证您的 Typeform 账户」完成 OAuth
4. （可选）**Start date**：Responses 流起始时间，格式 `YYYY-MM-DDT00:00:00Z`；不填则默认近一年
5. （可选）**Form IDs**：仅同步指定表单；表单 ID 可从分享链接 `/to/{id}` 中取得
6. 点击「设置源」

<!-- /env:cloud -->

<!-- env:oss -->

**开源 / 自托管：**

1. 「源」→「+ 新建源」→ **Typeform**
2. 在 **API Token** 中填入个人访问令牌
3. 按需填写 Start date、Form IDs
4. 点击「设置源」

<!-- /env:oss -->

## 支持的流与同步模式

| 流 | 主键 | 增量 | API |
|----|------|------|-----|
| Forms | id | 否 | [retrieve-form](https://developer.typeform.com/create/reference/retrieve-form/) |
| Responses | response_id | 是 | [retrieve-responses](https://developer.typeform.com/responses/reference/retrieve-responses) |
| Webhooks | id | 否 | [retrieve-webhooks](https://developer.typeform.com/webhooks/reference/retrieve-webhooks/) |
| Workspaces | id | 否 | [retrieve-workspaces](https://developer.typeform.com/create/reference/retrieve-workspaces/) |

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。

