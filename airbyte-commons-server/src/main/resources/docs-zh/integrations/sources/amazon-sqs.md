# Amazon SQS

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

## 概述

Amazon SQS 源对接 [SQS API](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/Welcome.html)，支持全量刷新，可在 Connector Builder 中以 low-code 查看。

## 开始使用

### 要求

- AWS IAM Access Key
- AWS IAM Secret Key
- AWS SQS Queue URL
- AWS Region
- Action target

### 设置指南

- [创建 IAM 密钥](https://aws.amazon.com/premiumsupport/knowledge-center/create-access-key/)
- [创建 SQS 队列](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-getting-started.html#step-create-queue)

在 Airbyte 中新建源 → 选择 **Amazon SQS** → 填写上述参数 →「设置源」。

### 支持的流（动作）

- [ReceiveMessage](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_ReceiveMessage.html)
- [QueueAttributes](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_GetQueueAttributes.html)

其它 Action 可能处于 beta，参数可能不同。

### 功能

| 功能 | 是否支持 | 说明 |
|------|----------|------|
| Full Refresh Sync | 是 |  |
| Incremental Sync | 否 |  |
| Namespaces | 否 |  |

### 性能注意

`ReceiveMessage` 在每账户每区域约每秒 2 次查找请求；遇限流会重试，持续失败则同步失败。

### 输出结构

每个配置的队列输出一个流，记录大致包含：

- `id`（UUIDv4 字符串）
- `body`（消息体字符串）
- 以及连接器附加的元数据字段（以实际 schema 为准）

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。

