# WordPress

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

**WordPress** 源连接器用于从 WordPress 拉取数据并同步到目标端。

<HideInUI>

本页包含 WordPress 连接器的设置指南与参考信息。

</HideInUI>

## 前提条件

- A self-hosted WordPress site (WordPress.org) with the [REST API](https://developer.wordpress.org/rest-api/) enabled (default on WordPress 4.7 and later).
- The site's domain name—for example, `my-site.example.com`.

:::note
This connector reads data from the public WordPress REST API. Most read endpoints for posts, pages, comments, categories, tags, and media are accessible without authentication. Endpoints that expose private data—such as plugins, themes, settings, and users with full details—require authentication.
:::

### Authentication

The connector sends HTTP Basic Authentication headers with each request. For public endpoints, you can leave the **Username** and **Password** fields at their default values.

To access authenticated endpoints such as plugins, themes, and settings, provide valid WordPress credentials. WordPress supports [Application Passwords](https://developer.wordpress.org/advanced-administration/security/application-passwords/) (available since WordPress 5.6), which are the recommended method for REST API authentication:

1. In your WordPress admin dashboard, go to **Users > Profile**.
2. Scroll to the **Application Passwords** section.
3. Enter a name for the application (for example, `Airbyte`) and click **Add New Application Password**.
4. Copy the generated password. Use your WordPress username and this application password as the connector credentials.

## 设置指南

1. 在 Airbyte 中打开「源」→「+ 新建源」
2. 选择 **WordPress** 并输入名称
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
