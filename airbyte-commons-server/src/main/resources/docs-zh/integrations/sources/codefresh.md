# Codefresh

> 本文档由 jetems 基于官方英文设置指南翻译，技术标识符与命令请保持原文。

Codefresh CI/CD 平台源连接器。

## 配置

| 输入 | 类型 | 说明 | 默认值 |
|-------|------|-------------|---------------|
| `api_key` | `string` | API Key。  |  |
| `account_id` | `string` | Account Id.  |  |
| `report_granularity` | `string` | Report Granularity.  |  |
| `report_date_range` | `array` | Report Date Range.  |  |
| `start_date` | `string` | 起始日期。  |  |

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。
