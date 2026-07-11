# Blogger

> 本文档由 jetems 基于官方英文设置指南翻译，技术标识符与命令请保持原文。

Google Blogger 是 Google 提供的免费博客平台，便于创建与管理博客，并与其它 Google 服务集成。

## 配置

| 输入 | 类型 | 说明 | 默认值 |
|-------|------|-------------|---------------|
| `client_id` | `string` | Client ID。  |  |
| `client_secret` | `string` | Client Secret。  |  |
| `client_refresh_token` | `string` | Refresh Token。  |  |

## 数据流（Streams）

| 流名称 | 主键 | 分页 | 全量同步 | 增量同步 |
|-------------|-------------|------------|---------------------|----------------------|
| users | id | DefaultPaginator | ✅ |  ❌  |
| blogs | id | DefaultPaginator | ✅ |  ❌  |
| posts |  | DefaultPaginator | ✅ |  ❌  |
| pages | id | DefaultPaginator | ✅ |  ❌  |
| comments | id | DefaultPaginator | ✅ |  ❌  |

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。

