# Capsule Crm

> 本文档由 jetems 基于官方英文设置指南翻译，技术标识符与命令请保持原文。

Capsule CRM 客户关系管理源连接器。

## 配置

| 输入 | 类型 | 说明 | 默认值 |
|-------|------|-------------|---------------|
| `bearer_token` | `string` | Bearer Token. Bearer token to authenticate API requests. Generate it from the &#39;My Preferences&#39; &gt; &#39;API Authentication Tokens&#39; page in your Capsule account. |  |
| `start_date` | `string` | 起始日期。  |  |
| `entity` | `string` | Entity.  |  |

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。
