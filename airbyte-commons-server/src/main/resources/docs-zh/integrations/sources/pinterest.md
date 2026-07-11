# Pinterest

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

**Pinterest** 源连接器用于从 Pinterest 拉取数据并同步到目标端。

## 前提条件

<!-- env:cloud -->

When setting up the Pinterest source connector with Airbyte Cloud, be aware that Pinterest does not
allow configuring permissions during the OAuth authentication process. Therefore, the following
permissions will be requested during authentication:

- See all of your advertising data, including ads, ad groups, campaigns, etc.
- See your public boards, including group boards you join.
- See your secret boards.
- See all of your catalogs data.
- See your public Pins.
- See your secret Pins.
- See your user accounts and followers.

更多信息 on the scopes required for Pinterest OAuth, please refer to the
[Pinterest API Scopes documentation](https://developers.pinterest.com/docs/getting-started/scopes/#Read%20scopes).

<!-- /env:cloud -->

<!-- env:oss -->

配置 Pinterest source connector with Airbyte Open Source, 需要 your Pinterest
[App ID and secret key](https://developers.pinterest.com/docs/getting-started/set-up-app/) and the
[refresh token](https://developers.pinterest.com/docs/getting-started/authentication/#Refreshing%20an%20access%20token).

<!-- /env:oss -->

Different streams in this connector require different Pinterest OAuth scopes:

- **Account analytics** (`user_account_analytics`): Requires `user_accounts:read`.
- **Boards, board sections, and board pins**: Require `boards:read` and `pins:read`.
- **Ad accounts, campaigns, ad groups, ads, and their analytics**: Require `ads:read`.
- **Catalogs, catalog feeds, and catalog product groups**: Require `catalogs:read`.

If your Pinterest account has limited permissions, some streams may not return data. The connector
validates your connection using the `user_account_analytics` stream, which requires only the
`user_accounts:read` scope. This scope is available to all authenticated Pinterest users.

## 设置指南

1. 在 Airbyte 中打开「源」→「+ 新建源」
2. 选择 **Pinterest** 并输入名称
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
