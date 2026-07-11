# Buildkite

> 本文档由 jetems 基于官方英文设置指南翻译，技术标识符与命令请保持原文。

Buildkite CI 源连接器。API 文档见 https://buildkite.com/docs/apis/rest-api 。认证使用 Bearer Token（https://buildkite.com/user/api-access-tokens）。

## 认证

请按官方文档完成 API Token / OAuth 配置（见英文原文中的认证章节链接）。

## 配置

| 输入 | 类型 | 说明 | 默认值 |
|-------|------|-------------|---------------|
| `api_key` | `string` | API Key。  |  |
| `start_date` | `string` | 起始日期。  |  |

## 数据流（Streams）

| 流名称 | 主键 | 分页 | 全量同步 | 增量同步 |
|-------------|-------------|------------|---------------------|----------------------|
| organizations | id | DefaultPaginator | ✅ |  ✅  |
| analytics_organizations_suites | id | DefaultPaginator | ✅ |  ❌  |
| organizations_pipelines | id | DefaultPaginator | ✅ |  ✅  |
| access-token | uuid | DefaultPaginator | ✅ |  ❌  |
| builds | id | DefaultPaginator | ✅ |  ✅  |
| organizations_clusters | id | DefaultPaginator | ✅ |  ✅  |
| organizations_builds | id | DefaultPaginator | ✅ |  ✅  |
| organizations_pipelines_builds | id | DefaultPaginator | ✅ |  ✅  |
| organizations_clusters_queues | id | DefaultPaginator | ✅ |  ✅  |
| organizations_clusters_tokens | id | DefaultPaginator | ✅ |  ✅  |
| organizations_emojis |  | DefaultPaginator | ✅ |  ❌  |
| user | id | DefaultPaginator | ✅ |  ✅  |

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。
