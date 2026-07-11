# Apple Ads (Apple Search Ads)

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

本页包含 Apple Ads（Apple Search Ads）源连接器的设置指南与参考信息。

## 前提条件

- 具备可邀请 API 用户权限的 Apple Ads 管理员账户
- Apple Ads 组织 ID（`orgId`，界面中可见）；每个 Airbyte 源对应一个 `orgId`
- 为 API 用户生成的 OAuth **Client ID** 与 **Client Secret**（见步骤 1）

## 设置指南

### 步骤 1：在 Apple Ads 中创建 API 用户与 OAuth 凭证

连接器使用 OAuth 2 Client Credentials 访问 Campaign Management API。管理员需创建 API 用户、上传公钥并生成 client id/secret。完整流程见 [Implementing OAuth for the Apple Ads API](https://developer.apple.com/documentation/apple_ads/implementing-oauth-for-the-apple-search-ads-api)。概要：

1. 以管理员登录 Apple Ads → **Account Settings** → **User Management**
2. **Invite Users**，赋予 **API user** 角色
3. 生成公私钥，上传公钥，创建 client secret
4. 记录 **Client ID** 与 **Client Secret**

### 步骤 2：在 Airbyte 中配置

1. 「源」→「+ 新建源」→ **Apple Ads**
2. **Org Id**：填写 `orgId`
3. 填写 **Client ID**、**Client Secret**
4. **Start Date** / **End Date**：`YYYY-MM-DD`；End 为空则同步至今天。超出 Apple 报表可用窗口的日期可能无数据
5. **Time Zone**：`UTC` 或 `ORTZ`（组织时区），默认 UTC
6. **Lookback Window**：1–30，默认 30（匹配约 30 天归因窗口）
7. **Exponential Backoff Factor**：遇 429/500 时的退避强度，默认 5
8. （可选）**Number of Workers**：并行分区数 1–20，默认 2
9. （可选）**Token Refresh Endpoint**：仅在代理出站时覆盖默认 OAuth 端点
10. 点击「设置源」

## 支持的同步模式

- Full Refresh - Overwrite / Append
- Incremental - Append / Append + Deduped

## 支持的数据流

对象流与报表流以检测结果为准，字段详见 [Apple Ads API 参考](https://developer.apple.com/documentation/apple_ads)。

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。

