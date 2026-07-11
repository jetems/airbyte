# Gmail

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

**Gmail** 源连接器用于从 Gmail 拉取数据并同步到目标端。

<HideInUI>

本页包含 Gmail 连接器的设置指南与参考信息。

</HideInUI>

## 前提条件

- A Google account with access to the mailbox you want to replicate.
- The OAuth scope `https://www.googleapis.com/auth/gmail.readonly`. The connector reads from Gmail and never modifies messages, labels, or settings.
<!-- env:oss -->
- For **Airbyte Open Source**: a Google Cloud project with the [Gmail API enabled](https://console.cloud.google.com/apis/library/gmail.googleapis.com), plus either an OAuth 2.0 client and refresh token, or a service account key.
<!-- /env:oss -->

## 配置

| 输入 | 类型 | 说明 | 默认值 |
|-------|------|-------------|---------------|
| `credentials` | `object` | Authentication. Credentials for connecting to the Gmail API. |  |
| `credentials.client_id` | `string` | Client ID。 Enter your Google application's Client ID。 See Google's documentation for more information. |  |
| `credentials.client_secret` | `string` | Client Secret。 Enter your Google application's Client Secret。 See Google's documentation for more information. |  |
| `credentials.client_refresh_token` | `string` | Refresh Token. Enter your Google application's refresh token. See Google's documentation for more information. |  |
| `credentials.service_account_info` | `string` | Service Account Information. The JSON key of the service account to use for authorization. |  |
| `include_spam_and_trash` | `boolean` | Include Spam &amp; Trash. Include drafts/messages from SPAM and TRASH in the results. Defaults to false. | false |
| `num_workers` | `integer` | Number of concurrent workers. Higher values result in faster syncs but may trigger rate limiting on lower-tier Gmail API quotas. Reduce this value if you see frequent rate-limit errors in sync logs. | 5 |
| `start_date` | `string` | UTC date and time in the format YYYY-MM-DDTHH:MM:SSZ. Only messages, threads, and drafts received on or after this date will be replicated. If unset, the full history is replicated. |  |

## 数据流（Streams）

| 流名称 | 主键 | 分页 | 全量同步 | 增量同步 |
|--------------------|:-----------:|-----------------------------|------------------------------------------------------------------------------------------|
| `profile`          | _(none)_    | Full Refresh                | The authenticated user's Gmail profile, including email address and history ID.          |
| `drafts`           | `id`        | Full Refresh                | Stub records (`id`, `message.id`, `message.threadId`) returned by `users.drafts.list`.   |
| `labels`           | `id`        | Full Refresh                | All Gmail labels, including system labels (e.g. `INBOX`, `SENT`) and user-created labels.|
| `labels_details`   | `id`        | Full Refresh                | Per-label metadata such as message and thread counts. Substream of `labels`.             |
| `messages`         | `id`        | Full Refresh                | Stub records (`id`, `threadId`) returned by `users.messages.list`.                       |
| `messages_details` | `id`        | Incremental on `internalDate` | Full message payloads, headers, snippet, and labels. Substream of `messages`.          |
| `threads`          | `id`        | Full Refresh                | Stub records (`id`, `historyId`) returned by `users.threads.list`.                       |
| `threads_details`  | `id`        | Full Refresh                | Per-thread details and the messages in each thread. Substream of `threads`.              |

## 设置指南

1. 在 Airbyte 中打开「源」→「+ 新建源」
2. 选择 **Gmail** 并输入名称
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
