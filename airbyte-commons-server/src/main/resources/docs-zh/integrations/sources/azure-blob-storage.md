# Azure Blob Storage

> 本文档由 jetems 基于官方英文设置指南翻译，技术标识符与命令请保持原文。

Azure Blob Storage 源连接器用于从 Azure 对象存储读取 Blob 数据并同步到目标端。

## 前提条件

- Azure 存储账户与容器（Container）
- 访问凭证：连接字符串、SAS，或账户名 + 密钥（以配置表为准）
- 需要读取的路径前缀 / 文件格式信息（如 CSV、JSON、Parquet 等，取决于连接器配置）

## 设置指南

1. 打开「源」→「+ 新建源」，选择 **Azure Blob Storage**。
2. 输入名称。
3. 填写存储账户、容器、认证方式与路径/格式相关配置。
4. 点击「设置源」验证连接。

配置项详情与流发现结果以 UI 中的表单及「检测」结果为准。

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。

