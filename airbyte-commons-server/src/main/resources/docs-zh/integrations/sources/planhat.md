# Planhat

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

**Planhat** 源连接器用于从 Planhat 拉取数据并同步到目标端。

## 配置

| 输入 | 类型 | 说明 | 默认值 |
| ----------- | -------- | ------------------------------------------------------------------------------------ | ------------- |
| `api_token` | `string` | API Token. Your Planhat [API Access Token](https://docs.planhat.com/#authentication) |               |

## 数据流（Streams）

| 流名称 | 主键 | 分页 | 全量同步 | 增量同步 |
| --------------- | ----------- | ---------------- | ------------------ | -------------------- |
| `assets`        | `_id`       | DefaultPaginator | ✅                 | ❌                   |
| `churn`         | `_id`       | DefaultPaginator | ✅                 | ❌                   |
| `companies`     | `_id`       | DefaultPaginator | ✅                 | ❌                   |
| `conversations` | `_id`       | DefaultPaginator | ✅                 | ❌                   |
| `custom_fields` | `_id`       | DefaultPaginator | ✅                 | ❌                   |
| `endusers`      | `_id`       | DefaultPaginator | ✅                 | ❌                   |
| `invoices`      | `_id`       | DefaultPaginator | ✅                 | ❌                   |
| `issues`        | `_id`       | DefaultPaginator | ✅                 | ❌                   |
| `licenses`      | `_id`       | DefaultPaginator | ✅                 | ❌                   |
| `nps`           | `_id`       | DefaultPaginator | ✅                 | ❌                   |
| `workflows`     | `_id`       | DefaultPaginator | ✅                 | ❌                   |
| `opportunities` | `_id`       | DefaultPaginator | ✅                 | ❌                   |
| `objectives`    | `_id`       | DefaultPaginator | ✅                 | ❌                   |
| `sales`         | `_id`       | DefaultPaginator | ✅                 | ❌                   |
| `tasks`         | `_id`       | DefaultPaginator | ✅                 | ❌                   |
| `tickets`       | `_id`       | DefaultPaginator | ✅                 | ❌                   |
| `users`         | `_id`       | DefaultPaginator | ✅                 | ❌                   |

## 设置指南

1. 在 Airbyte 中打开「源」→「+ 新建源」
2. 选择 **Planhat** 并输入名称
3. 按配置表填写认证信息（API Key / OAuth / 连接串 / 账号密码等）
4. 按需设置起始日期、资源范围、区域等可选项
5. 点击「设置源」完成检测并保存

<!-- env:cloud -->

**Airbyte Cloud：** 支持 OAuth 的连接器可优先使用「认证您的账户」一键授权。

<!-- /env:cloud -->

<!-- env:oss -->

**开源 / 自托管：** 在对应产品控制台创建 API Token 或服务账号，并按需配置回调 URL 与 IP 白名单。

<!-- /env:oss -->

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。
