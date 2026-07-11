# Cal.com

> 本文档由 jetems 基于官方英文设置指南翻译，技术标识符与命令请保持原文。

Cal.com 日程与预约平台连接器，可同步事件类型、预约、日程等，便于写入数仓或 CRM。

## 配置

| 输入 | 类型 | 说明 | 默认值 |
|-------|------|-------------|---------------|
| `orgId` | `string` | Organization ID.  |  |
| `api_key` | `string` | API Key。 API key to use. Find it at https://cal.com/account |  |

## 数据流（Streams）

| 流名称 | 主键 | 分页 | 全量同步 | 增量同步 |
|-------------|-------------|------------|---------------------|----------------------|
| event_types | id | DefaultPaginator | ✅ |  ❌  |
| my_profile | id | No pagination | ✅ |  ❌  |
| schedules | id | DefaultPaginator | ✅ |  ❌  |
| calendars | externalId | No pagination | ✅ |  ❌  |
| bookings | id | DefaultPaginator | ✅ |  ❌  |
| conferencing | id | No pagination | ✅ |  ❌  |

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。
