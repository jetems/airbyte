# Spotify Ads

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

**Spotify Ads** 源连接器用于从 Spotify Ads 拉取数据并同步到目标端。

## 配置

| 输入 | 类型 | 说明 | 默认值 |
|-------|------|-------------|---------------|
| `client_id` | `string` | Client ID。 The Client ID of your Spotify Developer application. |  |
| `client_secret` | `string` | Client Secret。 The Client Secret of your Spotify Developer application. |  |
| `refresh_token` | `string` | Refresh Token. The Refresh Token obtained from the initial OAuth 2.0 authorization flow. |  |
| `ad_account_id` | `string` | Ad Account ID. The ID of the Spotify Ad Account you want to sync data from. |  |
| `start_date` | `string` | Start Date. The date to start syncing data from, in YYYY-MM-DD format. |  |
| `fields` | `array` | Report Fields. List of fields to include in the campaign performance report. Choose from available metrics. | [IMPRESSIONS, CLICKS, SPEND, CTR, REACH, FREQUENCY, COMPLETION_RATE] |

## 设置指南

1. 在 Airbyte 中打开「源」→「+ 新建源」
2. 选择 **Spotify Ads** 并输入名称
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
