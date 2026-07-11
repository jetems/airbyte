# Agile CRM

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

Agile CRM 客户关系管理源连接器。

## 配置

| 输入 | 类型 | 说明 | 默认值 |
|-------|------|-------------|---------------|
| `email` | `string` | Email Address. Your Agile CRM account email address. This is used as the username for authentication. |  |
| `domain` | `string` | Domain. The specific subdomain for your Agile CRM account |  |
| `api_key` | `string` | API Key。 API key to use. Find it at Admin Settings -&gt; API &amp; Analytics -&gt; API Key in your Agile CRM account. |  |

## 设置指南

1. 打开「源」→「+ 新建源」
2. 选择 **Agile CRM** 并输入名称
3. 填写配置表中的认证与参数
4. 点击「设置源」完成检测

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。
