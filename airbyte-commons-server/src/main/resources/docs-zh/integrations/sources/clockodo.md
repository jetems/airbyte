# Clockodo

> 本文档由 jetems 基于官方英文设置指南翻译，技术标识符与命令请保持原文。

Clockodo 工时与考勤源连接器。

## 配置

| 输入 | 类型 | 说明 | 默认值 |
|-------|------|-------------|---------------|
| `api_key` | `string` | API Key。 API key to use. Find it in the &#39;Personal data&#39; section of your Clockodo account. |  |
| `email_address` | `string` | Email Address. Your Clockodo account email address. Find it in your Clockodo account settings. |  |
| `external_application` | `string` | External Application Header. Identification of the calling application, including the email address of a technical contact person. Format: [name of application or company];[email address]. | Airbyte |
| `years` | `integer` | Year.  |  |
| `start_date` | `string` | Start Date.  |  |

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。
