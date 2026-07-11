# Uptick

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

**Uptick** 源连接器用于从 Uptick 拉取数据并同步到目标端。

## 前提条件

To use the Uptick connector, 需要:

- An Uptick account with API access enabled
- OAuth credentials (Client ID and Client Secret) generated from your Uptick instance
- Your Uptick instance URL (for example, `https://yourcompany.onuptick.com`)

To generate OAuth credentials, go to **Control Panel > Uptick API** in your Uptick instance and select **Create Application**. 更多信息, see the [Uptick API documentation](https://support.uptickhq.com/en/collections/9129536-uptick-api).

## 配置

| 输入 | 类型 | 说明 | 默认值 |
|-------|------|-------------|---------------|
| `base_url` | `string` | Your Uptick instance URL, for example `https://yourcompany.onuptick.com`. Do not include a trailing slash. |  |
| `client_id` | `string` | OAuth Client ID generated from Control Panel > Uptick API. |  |
| `client_secret` | `string` | OAuth Client Secret generated from Control Panel > Uptick API. |  |
| `username` | `string` | Email address for an Uptick user account with API access. |  |
| `password` | `string` | Password for the Uptick user account. |  |

## 设置指南

1. 在 Airbyte 中打开「源」→「+ 新建源」
2. 选择 **Uptick** 并输入名称
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
