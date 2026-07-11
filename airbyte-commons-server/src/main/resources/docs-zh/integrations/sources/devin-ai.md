# Devin AI

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

**Devin AI** 源连接器用于从 Devin AI 拉取数据并同步到目标端。

## 前提条件

- A Devin account with access to an organization.
- A Devin API key. All Devin API credentials use the `cog_` prefix. A [service user API key](https://docs.devin.ai/api-reference/authentication) is recommended for automation; a personal access token also works if your account has the closed beta enabled.
- Your Devin organization ID (uses the `org_` prefix).
- The principal behind your API key must have the Devin permissions required to read the streams you want to sync. Grant these permissions to the service user's role in **Enterprise settings → Roles**:
  - `ViewOrgSessions` — required for `sessions`, `sessions_insights`, and `session_messages`.
  - `ManageOrgPlaybooks` — required for `playbooks`.
  - `ManageOrgSecrets` — required for `secrets` (only metadata is returned; secret values are never exposed).
  - `ManageOrgKnowledge` — required for `knowledge_notes`.

For a full permission reference, see the [Devin Permissions & RBAC documentation](https://docs.devin.ai/api-reference/v3/overview).

## 设置指南

1. 在 Airbyte 中打开「源」→「+ 新建源」
2. 选择 **Devin AI** 并输入名称
3. 按配置表填写认证信息（API Key / OAuth / 连接串 / 账号密码等）
4. 按需设置起始日期、资源范围、区域等可选项
5. 点击「设置源」完成检测并保存

<!-- env:cloud -->

**Airbyte Cloud：** 支持 OAuth 的连接器可优先使用「认证您的账户」一键授权。

<!-- /env:cloud -->

<!-- env:oss -->

**开源 / 自托管：** 在对应产品控制台创建 API Token 或服务账号，并按需配置回调 URL 与 IP 白名单。

<!-- /env:oss -->

## 支持的同步模式

以连接器检测结果为准，常见包括全量刷新（Full Refresh）与增量（Incremental）。

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。
