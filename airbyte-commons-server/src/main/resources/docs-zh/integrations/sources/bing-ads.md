# Bing Ads

> 本文档由 jetems 基于官方英文设置指南翻译，技术标识符与命令请保持原文。

Microsoft Advertising（Bing Ads）源连接器用于同步广告账户、活动与报表数据。

## 前提条件

- Microsoft Advertising 账户
- 开发者令牌（Developer Token）
- OAuth 或其它受支持的认证方式（以连接器当前规格为准）

## 设置指南

### Airbyte Cloud

1. [登录 Airbyte Cloud](https://cloud.airbyte.com/workspaces)。
2. 「源」→「+ 新建源」→ 选择 **Bing Ads**。
3. 输入名称，按表单完成 OAuth/令牌配置。
4. 选择需要同步的报表与日期范围相关选项。
5. 点击「设置源」。

### 开源 / 自托管

步骤相同；若使用 OAuth，需在 Microsoft 端正确配置回调 URL（`https://your-airbyte-host/auth_flow` 或实例提示的地址）。

## 支持的同步模式

常见为全量与增量报表拉取，具体流与粒度以检测结果为准。

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。

