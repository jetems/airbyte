# Microsoft Dataverse

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

**Microsoft Dataverse** 源连接器用于从 Microsoft Dataverse 拉取数据并同步到目标端。

## 前提条件

- A Microsoft Dataverse environment (included with Dynamics 365 or Power Apps)
- An [app registration](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/walkthrough-register-app-azure-active-directory) in Microsoft Entra ID (formerly Azure Active Directory) with a client secret
- The app registration must be added as an [application user](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/authenticate-oauth) in your Dataverse environment with at least read access to the tables you want to sync

## 设置指南

1. 在 Airbyte 中打开「源」→「+ 新建源」
2. 选择 **Microsoft Dataverse** 并输入名称
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
