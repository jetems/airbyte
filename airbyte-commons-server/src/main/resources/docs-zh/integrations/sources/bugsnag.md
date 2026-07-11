# Bugsnag

> 本文档由 jetems 基于官方英文设置指南翻译，技术标识符与命令请保持原文。

Bugsnag 是面向移动与其它应用的错误监控与上报服务。

## 配置

| 输入 | 类型 | 说明 | 默认值 |
|-------|------|-------------|---------------|
| `auth_token` | `string` | Auth Token。 Personal auth token for accessing the Bugsnag API. Generate it in the My Account section of Bugsnag settings. |  |
| `start_date` | `string` | 起始日期。  |  |

## 数据流（Streams）

| 流名称 | 主键 | 分页 | 全量同步 | 增量同步 |
|-------------|-------------|------------|---------------------|----------------------|
| organizations | id | DefaultPaginator | ✅ |  ❌  |
| projects | id | DefaultPaginator | ✅ |  ✅  |
| saved_searches | id | No pagination | ✅ |  ❌  |
| saved_searches_usage_summary |  | No pagination | ✅ |  ❌  |
| errors | id | DefaultPaginator | ✅ |  ✅  |
| events | id | DefaultPaginator | ✅ |  ✅  |
| pivots | event_field_display_id.project_id | No pagination | ✅ |  ❌  |
| supported_integrations | key | No pagination | ✅ |  ❌  |
| collaborators | id | No pagination | ✅ |  ❌  |
| teams | id | DefaultPaginator | ✅ |  ❌  |
| event_fields | display_id.project_id | No pagination | ✅ |  ❌  |
| releases | id | DefaultPaginator | ✅ |  ✅  |
| trace_fields | display_id.project_id | No pagination | ✅ |  ❌  |

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。
