# Bluetally

> 本文档由 jetems 基于官方英文设置指南翻译，技术标识符与命令请保持原文。

用于从 Bluetally 拉取资产与员工数据的连接器。

## 配置

| 输入 | 类型 | 说明 | 默认值 |
|------|------|------|--------|
| `api_key` | `string` | API Key。用于访问 BlueTally API。可在账户设置 →「API Keys」→「Create API Key」生成。 |  |
| `start_date` | `string` | 起始日期。 |  |

## 数据流（Streams）

| 流名称 | 主键 | 分页 | 全量同步 | 增量同步 |
|--------|------|------|----------|----------|
| assets | id | DefaultPaginator | ✅ | ✅ |
| employees | id | DefaultPaginator | ✅ | ✅ |

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。

