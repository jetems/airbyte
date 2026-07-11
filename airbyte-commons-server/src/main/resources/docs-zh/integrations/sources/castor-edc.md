# Castor Edc

> 本文档由 jetems 基于官方英文设置指南翻译，技术标识符与命令请保持原文。

Castor EDC 临床试验数据采集系统源连接器。

## 配置

| 输入 | 类型 | 说明 | 默认值 |
|-------|------|-------------|---------------|
| `url_region` | `string` | URL Region. The url region given at time of registration | uk |
| `client_id` | `string` | Client ID。 Visit `https://YOUR_REGION.castoredc.com/account/settings` |  |
| `client_secret` | `string` | Client Secret。 Visit `https://YOUR_REGION.castoredc.com/account/settings` |  |
| `start_date` | `string` | 起始日期。  |  |

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。
