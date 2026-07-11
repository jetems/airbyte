# Basecamp

> 本文档由 jetems 基于官方英文设置指南翻译，技术标识符与命令请保持原文。

Basecamp 项目管理与协作平台源连接器。

## 前提条件

- A Basecamp account on Basecamp 3 (accounts on Basecamp 2 and Basecamp Classic use a different API and aren't supported).
- Your Basecamp **Account ID**.
- A registered OAuth integration on 37signals Launchpad, which provides a **Client ID** and **Client secret**.
- A long-lived OAuth 2.0 **Refresh token** issued for that integration.

### Find your Account ID

Sign in to Basecamp and open any page in your account. The numeric segment immediately after the host in the URL is your account ID. For example, if the URL is `https://3.basecamp.com/1234567/projects`, your account ID is `1234567`. All API requests to Basecamp are scoped to this ID.

### Register an OAuth integration

1. Go to [37signals Launchpad integrations](https://launchpad.37signals.com/integrations) and click **New integration**.
2. Enter a name, your company, and a website or contact address. 37signals uses this information to contact integration owners, so provide values you can receive mail at.
3. For **Redirect URI**, enter any URL you control. The connector doesn't use this URL, but 37signals requires one. If you don't have one handy, use a placeholder like `https://example.com/oauth`.
4. Save the integration. Launchpad displays a **Client ID** and **Client secret**. Keep both values safe; you need them for the connector and to complete the OAuth flow.

### Obtain a refresh token

The connector refreshes its own access tokens at runtime, but you must supply a refresh token the first time you set up the source. To get one, complete a full OAuth 2.0 authorization code flow against 37signals Launchpad once, using the client ID and secret you just created.

Follow the steps in the [Basecamp authentication guide](https://github.com/basecamp/api/blob/master/sections/authentication.md) to exchange an authorization code for an access token and refresh token. The relevant endpoints are:

- Authorization: `https://launchpad.37signals.com/authorization/new`
- Token exchange: `https://launchpad.37signals.com/authorization/token`

Any OAuth 2.0 client library can perform this flow. If you'd prefer a ready-made tool, the community-maintained [basecampy3](https://github.com/phistrom/basecampy3) CLI walks you through the flow and prints the resulting tokens. Record the `refresh_token` value; that's what Airbyte needs.

Refresh tokens issued by 37signals do not expire unless you revoke the integration, so you can reuse the same value across syncs.

## 配置

| 输入 | 类型 | 说明 | 默认值 |
|-------|------|-------------|---------------|
| `account_id` | `number` | Your Basecamp Account ID. |  |
| `start_date` | `string` | Start date used for incremental streams. Records updated before this date aren't synced. |  |
| `client_id` | `string` | OAuth application Client ID from [37signals Launchpad](https://launchpad.37signals.com/integrations). |  |
| `client_secret` | `string` | OAuth application Client Secret。 |  |
| `client_refresh_token_2` | `string` | OAuth 2.0 refresh token obtained by completing the Launchpad authorization flow once. |  |

## 设置指南

在 Airbyte 中新建源，选择对应连接器，填写上述配置项后点击「设置源」。Cloud 与开源步骤类似：源 → + 新建源 → 选择连接器 → 填写凭证。

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。
