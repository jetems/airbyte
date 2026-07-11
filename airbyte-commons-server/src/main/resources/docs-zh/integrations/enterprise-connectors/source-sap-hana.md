# Source SAP HANA

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

**Source SAP HANA** 为企业版连接器，提供增强的数据同步能力（具体以授权与规格为准）。

<HideInUI>

本页包含 Source SAP HANA 连接器的设置指南与参考信息。

</HideInUI>

## 配置

| 输入 | 类型 | 说明 | 默认值 |
|-------|------|-------------|---------------|
| `host` | string | Hostname of the database. | |
| `port` | integer | Port of the database. | `443` |
| `username` | string | The username which is used to access the database. | |
| `password` | string | The password associated with the username. | |
| `schemas` | array | The list of schemas to sync from. Defaults to user. Case sensitive. | |
| `jdbc_url_params` | string | Additional properties to pass to the JDBC URL string when connecting to the database formatted as 'key=value' pairs separated by the symbol '&'. | |
| `encryption` | object | The encryption method with is used when communicating with the database. | `{"encryption_method": "unencrypted"}` |
| `tunnel_method` | object | Whether to initiate an SSH tunnel before connecting to the database, and if so, which kind of authentication to use. | `{"tunnel_method": "NO_TUNNEL"}` |
| `cursor` | object | Configures how data is extracted from the database. | `{"cursor_method": "user_defined"}` |
| `checkpoint_target_interval_seconds` | integer | How often (in seconds) a stream should checkpoint, when possible. | `300` |
| `concurrency` | integer | Maximum number of concurrent queries to the database. | `1` |
| `check_privileges` | boolean | When enabled, the connector will query each table individually to check access privileges during schema discovery. | `true` |

## 设置指南

1. 在 Airbyte 中打开「源/目标」→「+ 新建源」
2. 选择 **Source SAP HANA** 并输入名称
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
