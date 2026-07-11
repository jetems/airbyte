# Calendly

> 本文档由 jetems 基于官方英文设置指南翻译，技术标识符与命令请保持原文。

Calendly 日程预约平台源连接器。

## 配置

| 输入 | 类型 | 说明 | 默认值 |
| ------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `api_key`    | `string` | API Key。 Go to Integrations → API &amp; Webhooks to obtain your bearer token. https://calendly.com/integrations/api_webhooks |               |
| `start_date` | `string` | Start date to sync scheduled events from.                                                                                    |               |

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。
