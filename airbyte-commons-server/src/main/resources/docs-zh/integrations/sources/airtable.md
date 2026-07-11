# Airtable

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

<HideInUI>

本页包含 [Airtable](https://airtable.com/api) 源连接器的设置指南与参考信息。

</HideInUI>

## 前提条件

- 有效的 Airtable 账户
- 具备以下 scope 的 [Personal Access Token](https://airtable.com/developers/web/guides/personal-access-tokens)：
  - `data.records:read`
  - `data.recordComments:read`
  - `schema.bases:read`

## 设置指南

### 步骤 1：在 Airtable 中准备

<!-- env:oss -->

#### 开源 / 自托管

1. 打开 https://airtable.com/create/tokens 创建令牌
2. 添加 scopes：`data.records:read`、`data.recordComments:read`、`schema.bases:read`
3. 选择需要的 Base（或允许全部）并创建令牌
4. 妥善保存令牌

<!-- /env:oss -->

### 步骤 2：在 Airbyte 中配置

<!-- env:cloud -->

#### Airbyte Cloud

1. [登录 Airbyte Cloud](https://cloud.airbyte.com/workspaces)
2. 「源」→「+ 新建源」→ 选择 **Airtable**
3. 输入名称
4. 推荐 **OAuth2.0** 一键授权；也可选择 **Personal Access Token** 粘贴令牌  
   若 OAuth 后出现 `400`/`401`，请在设置中重新「认证您的 Airtable 账户」
5. 点击「设置源」

<!-- /env:cloud -->

<!-- env:oss -->

#### 开源 / 自托管

1. 「源」→「+ 新建源」→ **Airtable**
2. 认证方式选 **Personal Access Token** 并填入令牌
3. 点击「设置源」

<!-- /env:oss -->

### 配置选项

- **并发线程数**：默认 5（范围约 2–40）。连接器会遵守 Airtable 每 Base 每秒 5 次请求的限流
- **将 Base ID 加入流名称**：多 Base 表名冲突时建议开启；开启后流名变化，需全量刷新

### 表重命名与删除

在 Airtable 中重命名已同步的表后，需重置 schema 并重新勾选才会继续同步到新表名。删除表后连接器会停止同步该表。

## 支持的同步模式

- 全量刷新 - 覆盖
- 全量刷新 - 追加

## 支持的数据流

通过 Metadata API 同步账户中可访问 Base 的全部表。增删改列后请在 Airbyte 中刷新源 schema。

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。

