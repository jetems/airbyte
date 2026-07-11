# Amazon Seller Partner

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

Amazon Selling Partner（SP-API）源连接器用于同步卖家订单、库存、报表等数据。

## 前提条件

- Amazon Seller Central 卖家账户
- SP-API 应用与 LWA 凭证（Client ID / Client Secret / Refresh Token）
- 正确的 Marketplace / 区域端点配置

## 设置指南

1. 按 Amazon 文档创建 SP-API 应用并完成授权，取得 refresh token
2. 在 Airbyte 「源」→「+ 新建源」→ **Amazon Seller Partner**
3. 填写 LWA 凭证、AWS 区域/Marketplace、起始日期等
4. 按需选择报表类型与同步流
5. 点击「设置源」

## 支持的同步模式

常见为全量与增量（视具体流而定），以检测结果为准。

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。

