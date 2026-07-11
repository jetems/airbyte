# Postgres

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

Postgres 源连接器支持表/视图复制，以及 CDC、xmin 等多种增量方式（以当前版本功能为准）。

## 前提条件

- Postgres 实例与可读账号
- 按需开启逻辑复制 / 复制槽（CDC 时）
- 网络放行 Airbyte 访问

## 设置指南

1. 打开「源」→「+ 新建源」
2. 选择 **Postgres** 并输入名称
3. 按表单填写认证信息与同步参数（API Key / OAuth / 连接串等）
4. 按需设置起始日期、资源范围等可选项
5. 点击「设置源」完成检测

<!-- env:cloud -->

**Airbyte Cloud：** 支持 OAuth 的连接器可优先使用「认证您的账户」一键授权。

<!-- /env:cloud -->

<!-- env:oss -->

**开源 / 自托管：** 在对应 SaaS 控制台创建 API Token / 服务账号，并配置回调或 IP 白名单（如需要）。

<!-- /env:oss -->

## 支持的同步模式

以连接器检测结果为准，常见包括全量刷新与增量同步。

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。

