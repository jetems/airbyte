# 7shifts

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

7shifts 是面向餐饮的排班、薪资与员工留存应用。

## 配置

| 输入 | 类型 | 说明 | 默认值 |
|------|------|------|--------|
| `access_token` | `string` | Access Token。在 7shifts Developer Tools 中生成。 |  |
| `start_date` | `string` | 起始日期。 |  |

生成方式：Company Settings → Developer Tools → Access Token → Create Access Token。详见 [creating access tokens](https://developers.7shifts.com/reference/authentication#creating-access-tokens)。

## 数据流（Streams）

| 流名称 | 主键 | 分页 | 全量同步 | 增量同步 |
|--------|------|------|----------|----------|
| companies | id | DefaultPaginator | ✅ | ✅ |
| locations | id | DefaultPaginator | ✅ | ✅ |
| departments | id | DefaultPaginator | ✅ | ✅ |
| roles | id | DefaultPaginator | ✅ | ✅ |
| users | id | DefaultPaginator | ✅ | ✅ |
| wages |  | 无分页 | ✅ | ❌ |
| assignments |  | 无分页 | ✅ | ❌ |
| location_assignments |  | 无分页 | ✅ | ❌ |
| department_assignments |  | 无分页 | ✅ | ❌ |
| role_assignments |  | 无分页 | ✅ | ❌ |
| time_punches | id | DefaultPaginator | ✅ | ✅ |
| shifts | id | DefaultPaginator | ✅ | ✅ |

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。

