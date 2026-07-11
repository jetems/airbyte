# Height

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

**Height** 源连接器用于从 Height 拉取数据并同步到目标端。

网站：https://height.app

## 前提条件

配置 Height source connector, 需要 the Height API key that you could see once you login and navigate to https://height.app/xxxxx/settings/api, and copy your secret key
Website: https://height.app

API Documentation: https://height.notion.site/API-documentation-643aea5bf01742de9232e5971cb4afda

## 配置

| 输入 | 类型 | 说明 | 默认值 |
|-------|------|-------------|---------------|
| `api_key` | `string` | API secret which is copied from the settings page of height.app  |  |
| `start_date` | `string` | Start date for incremental sync supported streams |  |
| `search_query` | `string` | search_query. Search query to be used with search stream | task |

## 数据流（Streams）

| 流名称 | 主键 | 分页 | 全量同步 | 增量同步 |
|-------------|-------------|------------|---------------------|----------------------|
| workspace | id | No pagination | ✅ |  ✅  |
| lists | id | No pagination | ✅ |  ✅  |
| tasks | id | No pagination | ✅ |  ✅  |
| activities | id | No pagination | ✅ |  ✅  |
| field_templates | id | No pagination | ✅ |  ❌  |
| users | id | No pagination | ✅ |  ✅  |
| groups | id | No pagination | ✅ |  ✅  |
| search | id | No pagination | ✅ |  ✅  |

## 设置指南

1. 在 Airbyte 中打开「源」→「+ 新建源」
2. 选择 **Height** 并输入名称
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
