# Auth0

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

Auth0 可为企业应用提供认证与授权。本源从 [Auth0 Management API](https://auth0.com/docs/api/management/v2) 拉取数据。

## 前提条件

- Auth0 账户（免费或付费）
- 按下方指南授权 Airbyte 访问 Management API（Machine-to-Machine 应用 + 适当权限）

## 设置指南

1. 在 Auth0 Dashboard 创建 Machine-to-Machine 应用，并授权 Management API
2. 授予读取用户、客户端、组织等所需 scope（以连接器所需权限为准）
3. 在 Airbyte 「源」→「+ 新建源」→ **Auth0**
4. 填写 Domain、Client ID、Client Secret 等
5. 点击「设置源」

## 常见数据流

包括 Users、Clients、Organizations、Connections 等（以检测结果为准）。官方端点索引见 Management API 文档。

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。

