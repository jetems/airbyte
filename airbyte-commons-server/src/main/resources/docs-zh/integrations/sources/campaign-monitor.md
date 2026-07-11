# Campaign Monitor

> 本文档由 jetems 基于官方英文设置指南翻译，技术标识符与命令请保持原文。

本源用于从 Campaign Monitor API 同步活动（campaign）等相关数据。

## 前提条件

需要 Campaign Monitor 账户的用户名与密码式认证：在账户设置页获取 API Key，将 API Key 填入 **username**，**password** 可填任意占位值。  
参考：https://www.campaignmonitor.com/api/v3-3/getting-started/

可配置 `start_date`，从该日期起复制数据。

## 设置连接器

1. 点击「源」→「+ 新建源」。
2. 源类型选择 **Campaign Monitor**。
3. 输入名称。
4. **username**：填入 API Key。
5. **password**：填入任意占位值。
6. **start_date**：UTC 的 `YYYY-MM-DD`，从此日期开始同步。
7. 点击「设置源」。

## 支持的同步模式

- Full Refresh（全量刷新）
- Incremental（增量）

## 配置

| 输入 | 类型 | 说明 | 默认值 |
|-------|------|-------------|---------------|
| `username` | `string` | Username.  |  |
| `password` | `string` | Password.  |  |
| `start_date` | `string` | start_date. Date from when the sync should start |  |

## 数据流（Streams）

| 流名称 | 主键 | 分页 | 全量同步 | 增量同步 |
|-------------|-------------|------------|---------------------|----------------------|
| clients | ClientID | No pagination | ✅ |  ❌  |
| admins | EmailAddress | No pagination | ✅ |  ❌  |
| client_details | ClientID | No pagination | ✅ |  ❌  |
| segments | SegmentID | No pagination | ✅ |  ❌  |
| templates | TemplateID | No pagination | ✅ |  ❌  |
| people | EmailAddress | No pagination | ✅ |  ❌  |
| tags | Name | No pagination | ✅ |  ❌  |
| subscriber_lists | ListID | No pagination | ✅ |  ❌  |
| suppression_lists | EmailAddress | DefaultPaginator | ✅ |  ❌  |
| sent_campaigns | CampaignID | DefaultPaginator | ✅ |  ✅  |
| draft_campaigns | CampaignID | No pagination | ✅ |  ❌  |
| scheduled_campaigns | CampaignID  | No pagination | ✅ |  ❌  |

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。

