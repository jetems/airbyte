# Braintree

> 本文档由 jetems 基于官方英文设置指南翻译，技术标识符与命令请保持原文。

本页包含 Braintree 源连接器的设置指南与参考信息。

## 前提条件

需要 Braintree 的：

1. [Public Key](https://developer.paypal.com/braintree/articles/control-panel/important-gateway-credentials#public-key)
2. [Environment](https://developer.paypal.com/braintree/articles/control-panel/important-gateway-credentials#environment)
3. [Merchant ID](https://developer.paypal.com/braintree/articles/control-panel/important-gateway-credentials#merchant-id)
4. [Private Key](https://developer.paypal.com/braintree/articles/control-panel/important-gateway-credentials#private-key)

## 设置指南

在 Airbyte 中新建源，选择 **Braintree**，填写 Public Key、Private Key、Merchant ID 与 Environment，然后保存。

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。

