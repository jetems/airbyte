# Alpaca Broker API

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

Alpaca Broker API 证券经纪数据源连接器。

网站： https://broker-app.alpaca.markets/dashboard

## 配置

| 输入 | 类型 | 说明 | 默认值 |
|-------|------|-------------|---------------|
| `environment` | `string` | Environment. The trading environment, either &#39;live&#39;, &#39;paper&#39; or &#39;broker-api.sandbox&#39;. | broker-api.sandbox |
| `username` | `string` | 用户名。 API Key ID for the alpaca market |  |
| `password` | `string` | 密码。 Your Alpaca API Secret Key。 You can find this in the Alpaca developer web console under your account settings. |  |
| `start_date` | `string` | 起始日期。  |  |
| `limit` | `string` | Limit. Limit for each response objects | 20 |

## 设置指南

1. 打开「源」→「+ 新建源」
2. 选择 **Alpaca Broker API** 并输入名称
3. 填写配置表中的认证与参数
4. 点击「设置源」完成检测

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。
