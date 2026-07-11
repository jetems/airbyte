# Kafka

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

本页说明如何配置 **Kafka** 源连接器。

## 设置指南

### 步骤 1：准备 Kafka

使用 Kafka 源需要：

- [Kafka 集群 1.0 及以上](https://kafka.apache.org/quickstart)
- 允许 Airbyte 使用的账号读取目标 Topic，且 Topic 需在同步前已创建

### 步骤 2：在 Airbyte 中配置

常用配置项：

- **Bootstrap Servers**：用于建立初始连接的 `host:port` 列表
- **MessageFormat**：消息反序列化格式
  - **JSON**
  - **AVRO**：需配置 Schema Registry URL、反序列化策略，以及可选的注册表用户名/密码
- **Protocol**：与 Broker 通信协议
  - **PLAINTEXT**：无认证无加密
  - **SASL PLAINTEXT**：无加密，需 `SASL JAAS Config`
  - **SASL SSL**：加密；需 JAAS、SASL Mechanism，OAUTHBEARER 时还需 Token Endpoint
- **Subscription Method**
  - **Topic 列表**：逗号分隔的 `topic:partition`，每个分区对应一个流
  - **Topic 模式**：按模式匹配 Topic，每个匹配 Topic 成为一个流

建议按需设置：

- **Client ID**、**Group ID**
- **Test Topic**：用于检测是否可读消息
- **Polling Time**：每次同步轮询消息的超时（毫秒）

#### 开源 / 自托管

1. 打开「源」→「+ 新建源」
2. 选择 **Kafka** 并填写上述参数
3. 点击「设置源」

## 支持的同步模式

| 功能 | 是否支持 | 说明 |
|------|----------|------|
| Full Refresh Sync | 是 |  |
| Incremental - Append Sync | 是 |  |
| Namespaces | 否 |  |

## 支持的消息格式

- **JSON**：JSON 值消息（当前不支持 Schema Registry）
- **AVRO**：通过 Confluent API 反序列化，参见 [Confluent Avro 文档](https://docs.confluent.io/platform/current/schema-registry/serdes-develop/serdes-avro.html)

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。

