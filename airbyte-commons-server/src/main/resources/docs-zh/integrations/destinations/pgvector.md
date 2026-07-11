# PGVector Destination

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

**PGVector Destination** 目标连接器用于将 Airbyte 同步数据写入 PGVector Destination。

## 前提条件

To use the PGVector destination, 需要:

- An account with API access depending on which embedding method you want to use.
- A Postgres DB with support for [pgvector](https://github.com/pgvector/pgvector).

You'll need the following information to configure the destination:

- **Embedding service API Key** - The API key for your embedding account and other params depending on your model.
- **Port** - The port number the server is listening on. Defaults to the PostgreSQL™ standard port
  number (5432).
- **Username**
- **Password**
- **Default Schema Name** - Specify the schema (or several schemas separated by commas) to be set in
  the search-path. These schemas will be used to resolve unqualified object names used in statements
  executed over this connection.
- **Database** - The database name. The default is to connect to a database with the same name as
  the user name.

#### Configure Network Access

Make sure your Postgres database can be accessed by Airbyte. If your database is within a VPC, you
may need to allow access from the IP you're using to expose Airbyte.

## 设置指南

1. 在 Airbyte 中打开「目标」→「+ 新建目标」
2. 选择 **PGVector Destination** 并输入名称
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
