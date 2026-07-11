# Twilio Taskrouter

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

**Twilio Taskrouter** 源连接器用于从 Twilio Taskrouter 拉取数据并同步到目标端。

## 前提条件

Twilio Taskroute HTTP requests to the REST API are protected with HTTP Basic authentication. You will use your Twilio Account SID as the username and your Auth Token as the password for HTTP Basic authentication. You will also have to use your Workspace ID as the sid if you wish to access a particular workspace or it's subresources.

You can find your Account SID and Auth Token on your [dashboard](https://www.twilio.com/user/account) by scrolling down the console once you have created a Twilio account.
You can find [Taskrouter](https://console.twilio.com/develop/explore) in the Explore Products page under Solutions in the list. Click on it to expand a panel in the sidebar and click on Workspaces to be taken to your created workspaces. Each workspace has it's unique ID as SID with which you can access the streams.

See [docs](https://www.twilio.com/docs/taskrouter/api) for more details.

## 设置指南

1. 在 Airbyte 中打开「源」→「+ 新建源」
2. 选择 **Twilio Taskrouter** 并输入名称
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
