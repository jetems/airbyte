# Snowflake Cortex Destination

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

**Snowflake Cortex Destination** 目标连接器用于将 Airbyte 同步数据写入 Snowflake Cortex Destination。

## 前提条件

To use the Snowflake Cortex destination, 需要:

- An account with API access for OpenAI or Cohere (depending on which embedding method you want to use)
- A Snowflake account with support for vector type columns

You'll need the following information to configure the destination:

- **Embedding service API Key** - The API key for your OpenAI or Cohere account
- **Snowflake Account** - The account name for your Snowflake account
- **Snowflake User** - The user name for your Snowflake account
- **Snowflake Password** - The password for your Snowflake account
- **Snowflake Database** - The database name in Snowflake to load data into
- **Snowflake Warehouse** - The warehouse name in Snowflake to use
- **Snowflake Role** - The role name in Snowflake to use.

## 设置指南

1. 在 Airbyte 中打开「目标」→「+ 新建目标」
2. 选择 **Snowflake Cortex Destination** 并输入名称
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
