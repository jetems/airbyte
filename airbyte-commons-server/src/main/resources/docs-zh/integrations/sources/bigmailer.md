# BigMailer

> 本文档由 jetems 基于官方英文设置指南翻译，技术标识符与命令请保持原文。

BigMailer 邮件营销平台连接器，可同步品牌、联系人、列表、字段、分段与活动等数据。

## 配置

| 输入 | 类型 | 说明 | 默认值 |
|-------|------|-------------|---------------|
| `api_key` | `string` | API Key。 API key to use. You can create and find it on the API key management page in your BigMailer account. |  |

## 数据流（Streams）

| 流名称 | 主键 | 分页 | 全量同步 | 增量同步 |
|-------------|-------------|------------|---------------------|----------------------|
| brands | id | DefaultPaginator | ✅ |  ❌  |
| contacts | id | DefaultPaginator | ✅ |  ❌  |
| lists | id | DefaultPaginator | ✅ |  ❌  |
| fields | id | DefaultPaginator | ✅ |  ❌  |
| message-types | id | DefaultPaginator | ✅ |  ❌  |
| segments | id | DefaultPaginator | ✅ |  ❌  |
| bulk_campaigns | id | DefaultPaginator | ✅ |  ❌  |
| transactional_campaigns | id | DefaultPaginator | ✅ |  ❌  |
| suppression_lists |  | DefaultPaginator | ✅ |  ❌  |
| users | id | DefaultPaginator | ✅ |  ❌  |

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。
