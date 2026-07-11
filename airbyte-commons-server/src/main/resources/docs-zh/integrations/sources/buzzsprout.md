# Buzzsprout

> 本文档由 jetems 基于官方英文设置指南翻译，技术标识符与命令请保持原文。

Buzzsprout 播客托管平台连接器，用于同步播客、剧集与分析相关数据。

## 认证

请按官方文档完成 API Token / OAuth 配置（见英文原文中的认证章节链接）。

## 配置

| 输入 | 类型 | 说明 | 默认值 |
|-------|------|-------------|---------------|
| `api_key` | `string` | API Key。  |  |
| `podcast_id` | `string` | Podcast ID. Podcast ID found in `my/profile/api` |  |
| `start_date` | `string` | 起始日期。  |  |

## 数据流（Streams）

| 流名称 | 主键 | 分页 | 全量同步 | 增量同步 |
|-------------|-------------|------------|---------------------|----------------------|
| episodes | id | No pagination | ✅ |  ✅  |
| podcasts | id | No pagination | ✅ |  ❌  |

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。
