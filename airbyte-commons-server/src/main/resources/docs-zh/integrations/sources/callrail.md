# CallRail

> 本文档由 jetems 基于官方英文设置指南翻译，技术标识符与命令请保持原文。

## 概述

CallRail 源支持 **全量刷新（Full Refresh）** 与 **增量同步（Incremental）**。

### 输出结构

可同步的核心流：

- [Calls](https://apidocs.callrail.com/#calls)
- [Companies](https://apidocs.callrail.com/#companies)
- [Text Messages](https://apidocs.callrail.com/#text-messages)
- [Users](https://apidocs.callrail.com/#users)

### 功能

| 功能 | 是否支持 |
|------|----------|
| Full Refresh Sync | 是 |
| Incremental - Append Sync | 是 |
| Incremental - Dedupe Sync | 是 |
| SSL 连接 | 否 |
| Namespaces | 否 |

## 开始使用

### 要求

- CallRail 账户
- CallRail API Token

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。

