# Postgres

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

本页说明如何配置 **Postgres** 目标连接器。

:::info Direct Load

自 3.0.0 起，Postgres 目标采用 **Direct Load** 架构：数据直接写入最终表，不再经中间 raw 表，以提升性能并降低存储成本。迁移说明见 [Postgres Migration Guide](postgres-migrations.md#upgrading-to-300)。

:::

:::warning

Postgres 适合关系型业务库，**不是数仓**。仅建议用于小数据量（例如 < 10GB）或测试。大数据量请使用 BigQuery、Snowflake、Redshift 等。详见官方排障说明。

:::

## 前提条件

- Postgres **9.5+**
- Airbyte Cloud 仅支持 **SSL/TLS** 连接（默认 TLS）

需要准备：

- **Host**、**Port**（默认 5432）
- **Username** / **Password**
- **Default Schema Name**（可多个，逗号分隔，影响 search-path）
- **Database**
- （可选）**JDBC URL Params**

### 网络访问

确保 Airbyte 能访问数据库；VPC 内需放行相应 IP。Cloud 请将 [Airbyte IP](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## 步骤 1：准备数据库用户

用户需能建表、写行、建 schema。推荐专用用户：

```sql
CREATE USER airbyte_user WITH PASSWORD '<password>';
GRANT CREATE, TEMPORARY ON DATABASE <database> TO airbyte_user;
```

## 步骤 2：在 Airbyte 中配置

1. 选择已有库或新建用于落库的数据库
2. 「目标」→「+ 新建目标」→ **Postgres**
3. 填写主机、端口、库名、用户、密码、schema 等
4. 点击「设置目标」完成检测

命名规则遵循 [Postgres 标识符语法](https://www.postgresql.org/docs/current/sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS)。

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。

