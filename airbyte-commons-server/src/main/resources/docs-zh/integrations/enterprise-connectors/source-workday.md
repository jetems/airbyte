# Source Workday

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

**Source Workday** 为企业版连接器，提供增强的数据同步能力（具体以授权与规格为准）。

<HideInUI>

本页包含 Source Workday 连接器的设置指南与参考信息。

</HideInUI>

## 前提条件

- Workday tenant - The Organization ID for your Workday environment. This can be found by logging into your Workday account and going to My Account > Organization ID
- Workday hostname - The endpoint for connecting into your Workday environment. This can be found by logging into your Workday instance and searching “Public Web Service” in the search bar and selecting the appropriate report. Use the ellipse (...) button to select **Web Service > View WSDL**
- Workday username and password - A user account that has the necessary permissions to access the reports you want to sync.
- Report IDs - Each report in Workday has a unique Report ID.

## 设置指南

1. 在 Airbyte 中打开「源/目标」→「+ 新建源」
2. 选择 **Source Workday** 并输入名称
3. 按配置表填写认证信息（API Key / OAuth / 连接串 / 账号密码等）
4. 按需设置起始日期、资源范围、区域等可选项
5. 点击「设置源」完成检测并保存

<!-- env:cloud -->

**Airbyte Cloud：** 支持 OAuth 的连接器可优先使用「认证您的账户」一键授权。

<!-- /env:cloud -->

<!-- env:oss -->

**开源 / 自托管：** 在对应产品控制台创建 API Token 或服务账号，并按需配置回调 URL 与 IP 白名单。

<!-- /env:oss -->

## 支持的同步模式

以连接器检测结果为准，常见包括全量刷新（Full Refresh）与增量（Incremental）。

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。
