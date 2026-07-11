# Amplitude

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

本页说明如何配置 Amplitude 源连接器。该连接器从若干 [Amplitude Analytics API](https://amplitude.com/docs/apis/analytics) 同步数据，包括 Dashboard REST API、Export API、Chart Annotations API 与 Behavioral Cohorts API。

## 前提条件

需要 Amplitude 的 **API Key** 与 **Secret Key**：

1. 在 Amplitude Analytics 顶部导航打开 **Organization Settings**
2. 选择 **Projects** → 目标项目
3. 复制 **API Key** 与 **Secret Key**

详见 [Manage your API keys and secret keys](https://amplitude.com/docs/admin/account-management/manage-your-api-keys-and-secret-keys)。

## 设置指南

1. 登录 Airbyte Cloud 或开源实例
2. 「源」→「+ 新建源」→ 选择 **Amplitude**
3. 输入名称
4. 填写 **API Key** 与 **Secret Key**
5. **Replication Start Date**：格式 `YYYY-MM-DDTHH:mm:ssZ`；留空则尽量同步全部历史
6. （可选）
   - **Data Region**：项目在 EU 数据中心时选 **EU Residency Server**，默认 Standard Server
   - **Request Time Range**：Events 流每次请求的时间窗（小时），数据量大导致超时可调小，默认 24
   - **Active Users Group by Country**：Active Users 流是否按国家分组；出错时可关闭，默认开启
7. 点击「设置源」

## 支持的数据流

- [Active Users Counts](https://amplitude.com/docs/apis/analytics/dashboard-rest#get-active-and-new-user-counts)（增量）
- [Annotations](https://amplitude.com/docs/apis/analytics/chart-annotations#get-all-chart-annotations)
- [Average Session Length](https://amplitude.com/docs/apis/analytics/dashboard-rest#get-average-session-length)（增量）
- [Cohorts](https://amplitude.com/docs/apis/analytics/behavioral-cohorts#get-all-cohorts)
- [Events](https://amplitude.com/docs/apis/analytics/export#response-schema)（增量）
- [Events List](https://amplitude.com/docs/apis/analytics/dashboard-rest#get-events-list)

需要更多端点可在 Airbyte 仓库提 issue。

## 支持的同步模式

- Full Refresh（全量刷新）
- Incremental（增量）

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。

