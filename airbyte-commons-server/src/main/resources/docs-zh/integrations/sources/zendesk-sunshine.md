# Zendesk Sunshine

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

**Zendesk Sunshine** 源连接器用于从 Zendesk Sunshine 拉取数据并同步到目标端。

## 前提条件

- A Zendesk account on a plan that supports Custom Objects (Suite Team or higher, or Support Enterprise). See [Zendesk plan availability](https://developer.zendesk.com/api-reference/custom-data/introduction/).
- Custom Objects must be enabled in your Zendesk account. See Zendesk's [guide to enabling Custom Objects](https://developer.zendesk.com/documentation/custom-data/v2/getting-started-with-custom-objects/#activating-custom-objects).
- Your Zendesk subdomain (the part before `.zendesk.com` in your Zendesk URL).
- A start date for incremental syncs, in the format `YYYY-MM-DDT00:00:00Z`.
- One of the following authentication methods:
  - **OAuth2.0** (recommended for Airbyte Cloud): Client ID, Client Secret, and authorization through Airbyte's OAuth flow.
  - **API Token** (recommended for Airbyte Open Source): Your Zendesk email address and an API token.
  - **OAuth2.0 (Legacy)**: A manually generated OAuth access token.

## 设置指南

1. 在 Airbyte 中打开「源」→「+ 新建源」
2. 选择 **Zendesk Sunshine** 并输入名称
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
