# BoldSign

> 本文档由 jetems 基于官方英文设置指南翻译，技术标识符与命令请保持原文。

- 网站：https://app.boldsign.com/
- API 参考：https://developers.boldsign.com/api-overview/getting-started/?region=us

## 配置

| 输入 | 类型 | 说明 | 默认值 |
|------|------|------|--------|
| `api_key` | `string` | API Key。在 BoldSign 应用中打开 API 菜单 →「API Key」→「Generate API Key」，复制后粘贴到此处。 |  |
| `start_date` | `string` | 起始日期。 |  |

## 数据流（Streams）

| 流名称 | 主键 | 分页 | 全量同步 | 增量同步 |
|--------|------|------|----------|----------|
| documents | documentId | DefaultPaginator | ✅ | ✅ |
| brands | brandId | DefaultPaginator | ✅ | ❌ |
| senderIdentities | email | DefaultPaginator | ✅ | ❌ |
| teams | teamId | DefaultPaginator | ✅ | ✅ |
| templates | documentId | DefaultPaginator | ✅ | ✅ |
| users_list | userId | DefaultPaginator | ✅ | ✅ |
| custom_fields | customFieldId | DefaultPaginator | ✅ | ❌ |
| contacts | id | DefaultPaginator | ✅ | ❌ |

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。

