# Aviationstack

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

Aviationstack 航班与航空数据源连接器。

网站： https://aviationstack.com/dashboard

API 参考： https://aviationstack.com/documentation

## 配置

| 输入 | 类型 | 说明 | 默认值 |
|-------|------|-------------|---------------|
| `access_key` | `string` | Access Key. Your unique API key for authenticating with the Aviation API. You can find it in your Aviation account dashboard at https://aviationstack.com/dashboard |  |
| `start_date` | `string` | 起始日期。  |  |

## 设置指南

1. 打开「源」→「+ 新建源」
2. 选择 **Aviationstack** 并输入名称
3. 填写配置表中的认证与参数
4. 点击「设置源」完成检测

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。
