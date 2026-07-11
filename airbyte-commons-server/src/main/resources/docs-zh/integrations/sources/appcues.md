# Appcues

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

Appcues 产品引导与用户参与平台源连接器。

## 配置

| 输入 | 类型 | 说明 | 默认值 |
|-------|------|-------------|---------------|
| `username` | `string` | 用户名。  |  |
| `password` | `string` | 密码。  |  |
| `account_id` | `string` | Account ID. Account ID of Appcues found in account settings page (https://studio.appcues.com/settings/account) |  |
| `start_date` | `string` | 起始日期。  |  |

## 设置指南

1. 打开「源」→「+ 新建源」
2. 选择 **Appcues** 并输入名称
3. 填写配置表中的认证与参数
4. 点击「设置源」完成检测

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。
