# Incident.io

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

**Incident.io** 源连接器用于从 Incident.io 拉取数据并同步到目标端。

## 前提条件

- An Incident.io account with API access. You can sign up at [incident.io](https://incident.io/).
- An Incident.io API key. To create one, go to **Settings** → **API keys** in your Incident.io dashboard. When you create the key, choose which actions it can take. Keys can have account-level permissions, team-scoped permissions, or both. For this connector, the key needs read access to all resources you want to sync. The API key is shown only once, so store it somewhere safe.

更多信息 about the API, see the [Incident.io API reference](https://api-docs.incident.io/).

## 配置

| 输入 | 类型 | 说明 | 默认值 |
|-------|------|-------------|---------------|
| `api_key` | `string` | API Key。 API key to use. Find it at https://app.incident.io/settings/api-keys | |

## 数据流（Streams）

| 流名称 | 主键 | 分页 | 全量同步 | 增量同步 |
|-------------|-------------|------------|---------------------|----------------------|
| actions | id | No pagination | ✅ | ❌ |
| alerts | id | DefaultPaginator | ✅ | ❌ |
| catalog_types | id | No pagination | ✅ | ❌ |
| custom_fields | id | No pagination | ✅ | ❌ |
| escalations | id | DefaultPaginator | ✅ | ❌ |
| follow-ups | id | No pagination | ✅ | ❌ |
| incident_roles | id | No pagination | ✅ | ❌ |
| incident_statuses | id | No pagination | ✅ | ❌ |
| incident_timestamps | id | No pagination | ✅ | ❌ |
| incident_updates | id | DefaultPaginator | ✅ | ❌ |
| incidents | id | DefaultPaginator | ✅ | ❌ |
| schedules | id | DefaultPaginator | ✅ | ❌ |
| severities | id | No pagination | ✅ | ❌ |
| users | id | DefaultPaginator | ✅ | ❌ |
| workflows | id | No pagination | ✅ | ❌ |

## 设置指南

1. 在 Airbyte 中打开「源」→「+ 新建源」
2. 选择 **Incident.io** 并输入名称
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
