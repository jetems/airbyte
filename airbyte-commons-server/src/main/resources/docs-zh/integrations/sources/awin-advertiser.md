# Awin Advertiser

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

Awin 联盟广告（广告主）源连接器。

网站： https://www.awin.com/

## 配置

| 输入 | 类型 | 说明 | 默认值 |
|-------|------|-------------|---------------|
| `advertiserId` | `string` | advertiserId. Your Awin Advertiser ID. You can find this in your Awin dashboard or account settings. |  |
| `api_key` | `string` | API Key。 Your Awin API Key。 Generate this from your Awin account under API Credentials. |  |
| `step_increment` | `string` | Step Increment. The time window size for each API request in ISO8601 duration format. For the campaign performance stream, Awin API explicitly limits the period between startDate and endDate to 400 days maximum.  | P400D |
| `lookback_days` | `integer` | Lookback Days. Number of days to look back on each sync to catch any updates to existing records. |  |
| `start_date` | `string` | Start Date. Start date for data replication in YYYY-MM-DD format |  |

## 认证说明

请在对应产品控制台创建 API Key / Access Token，并授予只读或文档要求的最小权限。详情以官方 API 文档为准。

## 设置指南

1. 打开「源」→「+ 新建源」
2. 选择 **Awin Advertiser** 并输入名称
3. 填写配置表中的认证与参数
4. 点击「设置源」完成检测

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。
