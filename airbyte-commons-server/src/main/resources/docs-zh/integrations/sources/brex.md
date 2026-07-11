# Brex

> 本文档由 jetems 基于官方英文设置指南翻译，技术标识符与命令请保持原文。

从 Brex API 同步用户、费用、交易、供应商与预算等数据。

## 配置

| 输入 | 类型 | 说明 | 默认值 |
|------|------|------|--------|
| `user_token` | `string` | User Token。在 Brex 控制台 Developer → Settings 生成，用于 API 鉴权。 |  |
| `start_date` | `string` | 起始日期。 |  |

## 数据流（Streams）

| 流名称 | 主键 | 分页 | 全量同步 | 增量同步 |
|-------------|-------------|------------|---------------------|----------------------|
| transactions | id | DefaultPaginator | ✅ |  ✅  |
| users | id | DefaultPaginator | ✅ |  ❌  |
| departments | id | DefaultPaginator | ✅ |  ❌  |
| vendors | id | DefaultPaginator | ✅ |  ❌  |
| expenses | id | DefaultPaginator | ✅ |  ✅  |
| budgets | budget_id | DefaultPaginator | ✅ |  ❌  |

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。

