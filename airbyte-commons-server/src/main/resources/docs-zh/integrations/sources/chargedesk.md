# Chargedesk

> 本文档由 jetems 基于官方英文设置指南翻译，技术标识符与命令请保持原文。

ChargeDesk 订阅与计费支持平台源连接器。

## 配置

| 输入 | 类型 | 说明 | 默认值 |
|-------|------|-------------|---------------|
| `password` | `string` | 密码。  |  |
| `username` | `string` | 用户名。  |  |
| `start_date` | `integer` | Start Date. Date from when the sync should start in epoch Unix timestamp |  |

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。
