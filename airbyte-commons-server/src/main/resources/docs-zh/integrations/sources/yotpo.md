# Yotpo

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

**Yotpo** 源连接器用于从 Yotpo 拉取数据并同步到目标端。

## 前提条件

配置 Yotpo source connector, 需要:

1. A Yotpo account with API access
2. Your Yotpo App Key (found in your Yotpo account settings)
3. An Access Token generated from the Yotpo API

## 数据流（Streams）

| 流名称 | 主键 | 分页 | 全量同步 | 增量同步 |
|------------------|--------------------------------------------------------------|-------------|-------|
| email_analytics  | Retrieves aggregated data for email metrics                  | No          | Data is grouped by metrics and can be filtered by date range |
| raw_data         | Returns detailed data about every email sent from Yotpo      | No          | Includes email recipient, delivery status, open/click events |
| reviews          | Retrieves product reviews                                    | Yes         | Uses `created_at` as cursor field with a lookback window of 31 days |
| unsubscribers    | Lists users who have unsubscribed from emails                | No          | Limited to 5000 responses per request, requires pagination for larger datasets |
| webhooks         | Lists all webhooks created for the account                   | No          | Includes webhook URL and event type information |
| webhook_events   | Lists available webhook event types                          | No          | Includes event names and descriptions |

## 设置指南

1. 在 Airbyte 中打开「源」→「+ 新建源」
2. 选择 **Yotpo** 并输入名称
3. 按配置表填写认证信息（API Key / OAuth / 连接串 / 账号密码等）
4. 按需设置起始日期、资源范围、区域等可选项
5. 点击「设置源」完成检测并保存

<!-- env:cloud -->

**Airbyte Cloud：** 支持 OAuth 的连接器可优先使用「认证您的账户」一键授权。

<!-- /env:cloud -->

<!-- env:oss -->

**开源 / 自托管：** 在对应产品控制台创建 API Token 或服务账号，并按需配置回调 URL 与 IP 白名单。

<!-- /env:oss -->

## 支持的同步模式

以连接器检测结果为准，常见包括全量刷新（Full Refresh）与增量（Incremental）。

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。
