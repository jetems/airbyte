# Sharetribe

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

**Sharetribe** 源连接器用于从 Sharetribe 拉取数据并同步到目标端。

## 前提条件

The source supports a number of API changes. 更多信息, checkout the website https://www.sharetribe.com/
This source uses the OAuth configuration for handling requests.

Once you create an account, log in and navigate to your sharetribe console.
In the sidebar, under the `Advanced` section, click on `Application` to create an application.
A client_ID and client_secret is required in order to setup a connection. Note down these credientials.
For more details about the API, check out https://www.sharetribe.com/api-reference/integration.html

## 配置

| 输入 | 类型 | 说明 | 默认值 |
|-------|------|-------------|---------------|
| `client_id` | `string` | Client ID。  |  |
| `client_secret` | `string` | Client Secret。  |  |
| `oauth_access_token` | `string` | Access Token。 The current access token. This field might be overridden by the connector based on the token refresh endpoint response. |  |
| `oauth_token_expiry_date` | `string` | Token expiry date. The date the current access token expires in. This field might be overridden by the connector based on the token refresh endpoint response. |  |

## 设置指南

1. 在 Airbyte 中打开「源」→「+ 新建源」
2. 选择 **Sharetribe** 并输入名称
3. 按配置表填写认证信息（API Key / OAuth / 连接串 / 账号密码等）
4. 按需设置起始日期、资源范围、区域等可选项
5. 点击「设置源」完成检测并保存

<!-- env:cloud -->

**Airbyte Cloud：** 支持 OAuth 的连接器可优先使用「认证您的账户」一键授权。

<!-- /env:cloud -->

<!-- env:oss -->

**开源 / 自托管：** 在对应产品控制台创建 API Token 或服务账号，并按需配置回调 URL 与 IP 白名单。

<!-- /env:oss -->

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。
