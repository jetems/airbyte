# Zenloop

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

**Zenloop** 源连接器用于从 Zenloop 拉取数据并同步到目标端。

## 前提条件

<!-- env:cloud -->

**For Airbyte Cloud:**

1. [Log into your Airbyte Cloud](https://cloud.airbyte.com/workspaces).
2. Click **Sources** and then click **+ New source**.
3. On the Set up the source page, select **Zenloop** from the Source type dropdown.
4. Enter the name for the Zenloop connector.
5. Enter your **API token**
6. For **Date from**, enter the date in YYYY-MM-DDTHH:mm:ssZ format. The data added on and after this date will be replicated.
7. Enter your **Survey ID**. Zenloop Survey ID. Can be found <a href="https://app.zenloop.com/settings/api">here</a>. Leave empty to pull answers from all surveys. (Optional)
8. Enter your **Survey Group ID**. Zenloop Survey Group ID. Can be found by pulling All Survey Groups via SurveyGroups stream. Leave empty to pull answers from all survey groups. (Optional)
9. Click **Set up source**.
<!-- /env:cloud -->

<!-- env:oss -->

**For Airbyte Open Source:**

1. Navigate to the Airbyte Open Source dashboard.
2. Click **Sources** and then click **+ New source**.
3. On the Set up the source page, select **Zenloop** from the Source type dropdown.
4. Enter the name for the Zenloop connector.
5. Enter your **API token**
6. For **Date from**, enter the date in YYYY-MM-DDTHH:mm:ssZ format. The data added on and after this date will be replicated.
7. Enter your **Survey ID**. Zenloop Survey ID. Can be found <a href="https://app.zenloop.com/settings/api">here</a>. Leave empty to pull answers from all surveys. (Optional)
8. Enter your **Survey Group ID**. Zenloop Survey Group ID. Can be found by pulling All Survey Groups via SurveyGroups stream. Leave empty to pull answers from all survey groups. (Optional)
9. Click **Set up source**.
<!-- /env:oss -->

## 设置指南

1. 在 Airbyte 中打开「源」→「+ 新建源」
2. 选择 **Zenloop** 并输入名称
3. 按配置表填写认证信息（API Key / OAuth / 连接串 / 账号密码等）
4. 按需设置起始日期、资源范围、区域等可选项
5. 点击「设置源」完成检测并保存

<!-- env:cloud -->

**Airbyte Cloud：** 支持 OAuth 的连接器可优先使用「认证您的账户」一键授权。

<!-- /env:cloud -->

<!-- env:oss -->

**开源 / 自托管：** 在对应产品控制台创建 API Token 或服务账号，并按需配置回调 URL 与 IP 白名单。

<!-- /env:oss -->

## 支持的同步模式

以连接器检测结果为准，常见包括全量刷新（Full Refresh）与增量（Incremental）。

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。
