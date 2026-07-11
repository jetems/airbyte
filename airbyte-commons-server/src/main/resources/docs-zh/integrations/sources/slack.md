# Slack

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

<HideInUI>

本页包含 [Slack](https://www.slack.com) 源连接器的设置指南与参考信息。

</HideInUI>

## 前提条件

- 对活跃 Slack Workspace 的管理员权限
- **Slack App OAuth**（推荐）或 **Bot Token**

## 设置指南

### 步骤 1：准备 Slack

Airbyte 只能同步**已添加该 App 的频道**中的消息。

:::info
若使用 Bot Token，可跳过创建 App 的部分说明，直接将 Bot 加入频道。
:::

:::warning
**OAuth 限流提示：** 使用 OAuth 时，若收到 HTTP 429，连接器会暂时将 **Channel Messages** 与 **Threads** 降至约每分钟 1 次请求，连续成功 5 次后恢复。为避免拖慢其它流，可为这两条流单独建连接。使用 **Bot Token** 时不适用此 OAuth 专用限流。
:::

创建 Slack App 并授权：

1. 打开 [Apps](https://api.slack.com/apps) → **Create New App** → **From Scratch**
2. 命名并选择 Workspace
3. **OAuth & Permissions** → **Bot Token Scopes** 添加例如：

```
channels:history
channels:join
channels:read
files:read
groups:read
links:read
reactions:read
remote_files:read
team:read
usergroups:read
users:read
users.profile:read
```

4. **Install to Workspace**，复制 Bot User OAuth Token（Bot Token 认证时使用）
5. 在 Slack 中将 App 添加到需要同步的公开频道（桌面端可能需重启 Slack）

Bot Token 通常不过期，无需 refresh token。

### 步骤 2：在 Airbyte 中配置

<!-- env:cloud -->

**Cloud：**

1. 「源」→「新建源」→ **Slack**
2. 点击「认证您的 Slack 账户」完成授权
3. <FieldAnchor field="join_channels">按需开启 `join_channels`（自动加入公开频道；需要 `channels:join` scope）。关闭则需手动把 Bot 加到各频道</FieldAnchor>
4. <FieldAnchor field="start_date">**Start Date**：早于该日期的数据不抽取</FieldAnchor>
5. <FieldAnchor field="lookback_window">**Threads Lookback window (Days)**：线程回看天数</FieldAnchor>
6. 点击「设置源」

<!-- /env:cloud -->

<!-- env:oss -->

**开源 / 自托管：** 步骤类似，可粘贴 Bot Token 或配置 OAuth。

<!-- /env:oss -->

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。

