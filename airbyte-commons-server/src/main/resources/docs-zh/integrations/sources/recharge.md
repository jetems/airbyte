# Recharge

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

**Recharge** 源连接器用于从 Recharge 拉取数据并同步到目标端。

## 前提条件

Before setting up the Recharge source, ensure you have the following:

1.  **Recharge Account:**
    *   Permissions within your Recharge account to generate API tokens and access the data for the streams you intend to sync.
2.  **Recharge API Access Token:**
    *   You'll need an API Access Token with the appropriate permissions (scopes) for the data streams you wish to sync.
    *   Instructions for generating a token can be found here: [Recharge API Key Guide](https://developer.rechargepayments.com/docs/api-key-guide).
3.  **Recharge Plan:**
    *   Some streams are only available on specific Recharge plans (e.g., Pro, Custom). Ensure your plan supports the streams 需要. See the [Permissions & Plan Requirements](#api-token-permissions-scopes--plan-requirements) section for details.

## 数据流（Streams）

| 流名称 | 主键 | 分页 | 全量同步 | 增量同步 |
| :----------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- | :---------- | :-------------------- | :------------------- | :--------------------------- |
| Addresses          | [2021-11](https://developer.rechargepayments.com/2021-11/addresses)                                                                              | id          | ✅                    | ✅                   | ✅ Standard Plan             |
| Bundle Selections  | [2021-11](https://developer.rechargepayments.com/2021-11/bundle_selections)                                                                      | id          | ✅                    | ✅                   | 🎯 Pro and Custom plans only |
| Charges            | [2021-11](https://developer.rechargepayments.com/2021-11/charges)                                                                                | id          | ✅                    | ✅                   | ✅ Standard Plan             |
| Collections        | [2021-11](https://developer.rechargepayments.com/2021-11/collections)                                                                            | id          | ✅                    | ❌                   | ✅ Standard Plan             |
| Credit Adjustments | [2021-11](https://developer.rechargepayments.com/2021-11/credits)                                                                                | id          | ✅                    | ✅                   | 🎯 Pro and Custom plans only |
| Customers          | [2021-11](https://developer.rechargepayments.com/2021-11/customers)                                                                              | id          | ✅                    | ✅                   | ✅ Standard Plan             |
| Discounts          | [2021-11](https://developer.rechargepayments.com/2021-11/discounts)                                                                              | id          | ✅                    | ✅                   | ✅ Standard Plan             |
| Events             | [2021-11](https://developer.rechargepayments.com/2021-11/events)                                                                                 | id          | ✅                    | ✅                   | ✅ Standard Plan             |
| Metafields         | [2021-11](https://developer.rechargepayments.com/2021-11/metafields)                                                                             | id          | ✅                    | ❌                   | ✅ Standard Plan             |
| Onetimes           | [2021-11](https://developer.rechargepayments.com/2021-11/onetimes)                                                                               | id          | ✅                    | ✅                   | ✅ Standard Plan             |
| Orders             | [2021-11](https://developer.rechargepayments.com/2021-11/orders) / [2021-01 (Deprecated)](https://developer.rechargepayments.com/2021-01/orders) | id          | ✅                    | ✅                   | ✅ Standard Plan             |
| Payment Methods    | [2021-11](https://developer.rechargepayments.com/2021-11/payment_methods)                                                                        | id          | ✅                    | ❌                   | 🎯 Pro and Custom plans only |
| Plans             | [2021-11](https://developer.rechargepayments.com/2021-11/plans/plans_list)                                                                                  | id          | ✅                    | ❌                   | ✅ Standard Plan             |
| Shop               | [2021-01 (Deprecated)](https://developer.rechargepayments.com/2021-01#shop)                                                                      | id          | ✅                    | ❌                   | ✅ Standard Plan             |
| Subscriptions      | [2021-11](https://developer.rechargepayments.com/2021-11/subscriptions)                                                                          | id          | ✅                    | ✅                   | ✅ Standard Plan             |

## 设置指南

1. 在 Airbyte 中打开「源」→「+ 新建源」
2. 选择 **Recharge** 并输入名称
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
