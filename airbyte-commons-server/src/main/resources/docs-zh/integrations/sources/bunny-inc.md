# Bunny Inc

> 本文档由 jetems 基于官方英文设置指南翻译，技术标识符与命令请保持原文。

Bunny.net（Bunny Inc）相关数据源连接器，用于同步 CDN / 存储等账号数据。

## 配置

| 输入 | 类型 | 说明 | 默认值 |
|-------|------|-------------|---------------|
| `apikey` | `string` | API Key。  |  |
| `subdomain` | `string` | Subdomain. The subdomain specific to your Bunny account or service. |  |
| `start_date` | `string` | 起始日期。  |  |

## 数据流（Streams）

| 流名称 | 主键 | 分页 | 全量同步 | 增量同步 |
|-------------|-------------|------------|---------------------|----------------------|
| accounts | id | DefaultPaginator | ✅ |  ❌  |
| accountBalances | id | DefaultPaginator | ✅ |  ❌  |
| contacts | id | DefaultPaginator | ✅ |  ❌  |
| entities | id | DefaultPaginator | ✅ |  ❌  |
| invoices | id | DefaultPaginator | ✅ |  ❌  |
| invoiceItems | id | DefaultPaginator | ✅ |  ❌  |
| payments | id | DefaultPaginator | ✅ |  ❌  |
| products | id | DefaultPaginator | ✅ |  ❌  |
| plans | id | DefaultPaginator | ✅ |  ❌  |
| quotes | id | DefaultPaginator | ✅ |  ❌  |
| quote_charges | id | DefaultPaginator | ✅ |  ❌  |
| subscriptions | id | DefaultPaginator | ✅ |  ❌  |
| subscriptionCharges | id | DefaultPaginator | ✅ |  ❌  |
| transactions | id | DefaultPaginator | ✅ |  ❌  |
| tenants | id | DefaultPaginator | ✅ |  ❌  |

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。
