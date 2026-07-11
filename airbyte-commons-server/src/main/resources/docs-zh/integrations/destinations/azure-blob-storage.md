# Azure Blob Storage

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

**Azure Blob Storage** 目标连接器用于将 Airbyte 同步数据写入 Azure Blob Storage。

## 配置

| 输入 | 类型 | 说明 | 默认值 |
| :------------------------------------------- | :-----: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Azure Blob Storage Endpoint Domain Name     | string  | This is Azure Blob Storage endpoint domain name. Leave default value \(or leave it empty if run container from command line\) to use Microsoft native one.                |
| Azure Blob Storage Container Name           | string  | A name of the Azure Blob Storage container. If not exists - will be created automatically. If leave empty, then will be created automatically airbytecontainer+timestamp. |
| Azure Blob Storage Account Name             | string  | The account's name of the Azure Blob Storage.                                                                                                                             |
| Azure Blob Storage Account Key               | string  | Azure Blob Storage account key. If this is set, the `Shared Access Signature`, `Azure Tenant ID`, `Azure Client ID`, and `Azure Client Secret` fields must not be set. Example: `abcdefghijklmnopqrstuvwxyz/0123456789+ABCDEFGHIJKLMNOPQRSTUVWXYZ/0123456789%++sampleKey==`.                                     |
| Shared Access Signature                     | string  | Azure Blob Storage shared access signature (SAS). If this is set, the `Azure Blob Storage Account Key`, `Azure Tenant ID`, `Azure Client ID`, and `Azure Client Secret` fields must not be set. Example: `sv=2025-01-01&ss=b&srt=co&sp=abcdefghijk&se=2026-01-31T07:00:00Z&st=2025-01-31T20:30:29Z&spr=https&sig=YWJjZGVmZ2hpamthYmNkZWZnaGlqa2FiY2RlZmdoaWp%3D`.                  |
| Azure Tenant ID                             | string  | Azure Active Directory (Entra ID) tenant ID. Required for Entra ID authentication. If this is set, `Azure Client ID` and `Azure Client Secret` must also be set. Example: `12345678-1234-1234-1234-123456789012`.                                                      |
| Azure Client ID                             | string  | Azure Active Directory (Entra ID) client ID. Required for Entra ID authentication. If this is set, `Azure Tenant ID` and `Azure Client Secret` must also be set. Example: `87654321-4321-4321-4321-210987654321`.                                                       |
| Azure Client Secret                         | string  | Azure Active Directory (Entra ID) client secret. Required for Entra ID authentication. If this is set, `Azure Tenant ID` and `Azure Client ID` must also be set.                                                                                                        |
| Azure Blob Storage Target Blob Size (MB)    | integer | How large each blob should be, in megabytes. Example: 500. After a blob exceeds this size, the connector will start writing to a new blob, and increment the part number. |
| Format                                       | object  | Format specific configuration. See below for details.                                                                                                                     |

## 设置指南

1. 在 Airbyte 中打开「目标」→「+ 新建目标」
2. 选择 **Azure Blob Storage** 并输入名称
3. 按配置表填写认证信息（API Key / OAuth / 连接串 / 账号密码等）
4. 按需设置起始日期、资源范围、区域等可选项
5. 点击「设置目标」完成检测并保存

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
