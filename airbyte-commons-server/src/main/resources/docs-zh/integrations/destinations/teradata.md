# Teradata

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

**Teradata** 目标连接器用于将 Airbyte 同步数据写入 Teradata。

## 前提条件

To use the Teradata destination connector, 需要:

- Access to a Teradata Vantage instance

  **Note:** If 需要 a new instance of Vantage, you can install a free version called Vantage Express in the cloud on [Google Cloud](https://quickstarts.teradata.com/vantage.express.gcp.html), [Azure](https://quickstarts.teradata.com/run-vantage-express-on-microsoft-azure.html), and [AWS](https://quickstarts.teradata.com/run-vantage-express-on-aws.html). You can also run Vantage Express on your local machine using [VMware](https://quickstarts.teradata.com/getting.started.vmware.html), [VirtualBox](https://quickstarts.teradata.com/getting.started.vbox.html), or [UTM](https://quickstarts.teradata.com/getting.started.utm.html).

You'll need the following information to configure the Teradata destination:

- **Host** - The host name of the Teradata Vantage instance.
- **Authorization Mechanism** - Specifies the Logon Mechanism, which determines the connection's authentication and encryption capabilities. The default value is `TD2`. This connector supports TD2, LDAP and BROWSER authentication mechanisms.
- **User** - The username to use to connect to the Teradata Vantage instance. The user must have the necessary permissions to create tables and write data. 
- **Password** - The password to use to connect to the Teradata Vantage instance.
- **SSL modes** - Specifies the mode for connections to the database. Refer to the [Teradata JDBC documentation](https://teradata-docs.s3.amazonaws.com/doc/connectivity/jdbc/reference/current/jdbcug_chapter_2.html#URL_SSLMODE) for more information. Enable SSL Connection option to use SSL mode.
- **Default Schema Name** - Specify the schema (or several schemas separated by commas) to be set in the search-path. These schemas will be used to resolve unqualified object names used in statements executed over this connection.
- **JDBC URL Params** (optional)
- **Query Band** (optional) - The [query band ](https://teradata-docs.s3.amazonaws.com/doc/connectivity/jdbc/reference/current/jdbcug_chapter_2.html#BGEGBBAA)is a set of name-value pairs that can be assigned to a Teradata database session. It helps identify the source of SQL requests originating from Airbyte. You can customize the query band to include relevant information such as application name, organization, and user identifiers.
  Each entry should be formatted as key=value, separated by semicolons (;). 
  Example: `appname=myApp;org=myOrganization;`

[Refer to this guide for more details](https://downloads.teradata.com/doc/connectivity/jdbc/reference/current/jdbcug_chapter_2.html#BGBHDDGB)

## 设置指南

1. 在 Airbyte 中打开「目标」→「+ 新建目标」
2. 选择 **Teradata** 并输入名称
3. 按配置表填写认证信息（API Key / OAuth / 连接串 / 账号密码等）
4. 按需设置起始日期、资源范围、区域等可选项
5. 点击「设置目标」完成检测并保存

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
