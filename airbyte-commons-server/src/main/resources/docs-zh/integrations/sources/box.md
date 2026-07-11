# Box

> 本文档由 jetems 基于官方英文设置指南翻译，技术标识符与命令请保持原文。

Box 连接器可从 Box 云存储列出、访问并同步文件或文件夹，便于将 Box 数据与其它工具集成，实现自动化文件管理与分析。

## 认证

请按 [此指南](https://developer.box.com/guides/authentication/client-credentials/) 完成认证配置。

## 配置

| 输入 | 类型 | 说明 | 默认值 |
|------|------|------|--------|
| `client_id` | `string` | OAuth Client ID。 |  |
| `client_secret` | `string` | OAuth Client Secret。 |  |
| `user` | `number` | User。 |  |

## 数据流（Streams）

| 流名称 | 主键 | 分页 | 全量同步 | 增量同步 |
|--------|------|------|----------|----------|
| events |  | DefaultPaginator | ✅ | ❌ |
| sign_templates | id | DefaultPaginator | ✅ | ❌ |
| collections | id | DefaultPaginator | ✅ | ❌ |
| collection_items | id | DefaultPaginator | ✅ | ❌ |
| sign_request | id | DefaultPaginator | ✅ | ❌ |
| admin_logs | event_id | DefaultPaginator | ✅ | ❌ |
| files | id | DefaultPaginator | ✅ | ❌ |
| file_collaborations | id | DefaultPaginator | ✅ | ❌ |
| file_comments | id | DefaultPaginator | ✅ | ❌ |
| file_tasks | id | 无分页 | ✅ | ❌ |
| folders | id | DefaultPaginator | ✅ | ❌ |
| folder_collaborations | id | DefaultPaginator | ✅ | ❌ |
| recent_items | id | DefaultPaginator | ✅ | ❌ |
| trashed_items | id | DefaultPaginator | ✅ | ❌ |
| users | id | DefaultPaginator | ✅ | ❌ |

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。

