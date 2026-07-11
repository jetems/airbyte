# Bitly

> 本文档由 jetems 基于官方英文设置指南翻译，技术标识符与命令请保持原文。

Bitly 是广泛使用的链接管理平台。通过 Bitly API 可实现链接定制、移动深度链接与点击分析等能力。

## 配置

| 输入 | 类型 | 说明 | 默认值 |
|------|------|------|--------|
| `api_key` | `string` | API Key。 |  |
| `start_date` | `string` | 起始日期。 |  |
| `end_date` | `string` | 结束日期。 |  |

在 [此处](https://app.bitly.com/settings/api/) 生成 API Key，或前往 Settings → Developer settings → API → Access token 创建访问令牌。

## 数据流（Streams）

| 流名称 | 主键 | 分页 | 全量同步 | 增量同步 |
|-------------|-------------|------------|---------------------|----------------------|
| bitlinks | id | DefaultPaginator | ✅ |  ✅  |
| bitlink_clicks |  | No pagination | ✅ |  ❌  |
| bsds |  | No pagination | ✅ |  ❌  |
| campaigns | guid | No pagination | ✅ |  ✅  |
| channels | guid | No pagination | ✅ |  ✅  |
| groups | guid | No pagination | ✅ |  ✅  |
| group_preferences | group_guid | No pagination | ✅ |  ❌  |
| group_shorten_counts |  | No pagination | ✅ |  ❌  |
| organizations | guid | No pagination | ✅ |  ✅  |
| organization_shorten_counts |  | No pagination | ✅ |  ❌  |
| qr_codes | id | No pagination | ✅ |  ✅  |

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。

