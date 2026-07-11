# DataGen

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

**DataGen** 源连接器用于从 DataGen 拉取数据并同步到目标端。

## 前提条件

No prerequisites are required to use this connector. DataGen generates data locally and does not connect to any external systems.

## 配置

| 输入 | 类型 | 说明 | 默认值 |
| :--- | :--- | :--- | :--- |
| **Data Generation Type** | enum | Incremental | The data generation pattern to use. Choose **Incremental**, **All Types**, or **Wide**. |
| **Max Record** | integer | 100 | The total number of records to generate. Minimum 1, maximum 100 billion. |
| **Max Concurrency** | integer | _(auto)_ | Maximum number of concurrent data generators. Leave empty to let Airbyte optimize performance automatically. |
| **Column Count** | integer | 50 | Wide mode only. The number of columns to generate, including the `id` column. Minimum 1, maximum 1000. |

## 设置指南

1. 在 Airbyte 中打开「源」→「+ 新建源」
2. 选择 **DataGen** 并输入名称
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
