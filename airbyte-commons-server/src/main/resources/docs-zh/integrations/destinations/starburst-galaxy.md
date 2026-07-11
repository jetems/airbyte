# Starburst Galaxy destination user guide

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

**Starburst Galaxy destination user guide** 目标连接器用于将 Airbyte 同步数据写入 Starburst Galaxy destination user guide。

## 配置

| 输入 | 类型 | 说明 | 默认值 |
| :------------------------------- | :---------------------------- | :-----: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Starburst Galaxy                 | `Hostname`                    | string  | Required. Located in the **Connection info** section of the [view clusters](https://docs.starburst.io/starburst-galaxy/clusters/index.html#manage-clusters) pane in Starburst Galaxy.                                |
|                                  | `Port`                        | string  | Optional. Located in the **Connection info** section of the [view clusters](https://docs.starburst.io/starburst-galaxy/clusters/index.html#manage-clusters) pane in Starburst Galaxy. Defaults to `443`.             |
|                                  | `User`                        | string  | Required. Galaxy user found in the **Connection info** section of the [view clusters](https://docs.starburst.io/starburst-galaxy/clusters/index.html#manage-clusters) pane in Starburst Galaxy.                      |
|                                  | `Password`                    | string  | Required. Password for the specified Galaxy user.                                                                                                                                                                    |
|                                  | `Amazon S3 catalog`           | string  | Required. Name of the [Amazon S3 catalog](https://docs.starburst.io/starburst-galaxy/catalogs/s3.html) created in the Galaxy domain.                                                                                 |
|                                  | `Amazon S3 catalog schema`    | string  | Optional. The default Starburst Galaxy Amazon S3 catalog schema where tables are written to if the source does not specify a namespace. Each data stream is written to a table in this schema. Defaults to `public`. |
| Staging Object Store - Amazon S3 | `Bucket name`                 | string  | Required. Name of the bucket where the staging data is stored.                                                                                                                                                       |
|                                  | `Bucket path`                 | string  | Required. Sets the subdirectory of the specified S3 bucket used for storing staging data.                                                                                                                            |
|                                  | `Bucket region`               | string  | Required. Sets the region of the specified S3 bucket.                                                                                                                                                                |
|                                  | `Access key`                  | string  | Required. AWS/Minio credential.                                                                                                                                                                                      |
|                                  | `Secret key`                  | string  | Required. AWS/Minio credential.                                                                                                                                                                                      |
| General                          | `Purge staging Iceberg table` | boolean | Optional. Indicates that staging Iceberg table is purged after a data sync is complete. Enabled by default. Disable it for debugging purposes only.                                                                  |

## 设置指南

1. 在 Airbyte 中打开「目标」→「+ 新建目标」
2. 选择 **Starburst Galaxy destination user guide** 并输入名称
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
