# Captain Data

> 本文档由 jetems 基于官方英文设置指南翻译，技术标识符与命令请保持原文。

Captain Data 自动化数据抓取平台源连接器。

## 前提条件

Api key and project UID are mandate for this connector to work, It could be generated from the dashboard settings (ref - https://app.captaindata.co/settings).

## 设置指南

1. 在 Airbyte 中打开「源」→「+ 新建源」。
2. 选择本连接器并输入名称。
3. 按上方配置表填写认证与连接参数。
4. 点击「设置源」完成检测与保存。

Airbyte Cloud 与开源/自托管步骤相同；OAuth 类连接器在 Cloud 上通常可一键授权。

## 支持的同步模式

具体以连接器检测结果为准，常见包括全量刷新（Full Refresh）与增量（Incremental）。

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。
