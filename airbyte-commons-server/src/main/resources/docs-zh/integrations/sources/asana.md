# Asana

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

<HideInUI>

本页包含 [Asana](https://www.asana.com) 源连接器的设置指南与参考信息。

</HideInUI>

## 前提条件

- 可访问待同步工作区、项目、任务、组合等资源的 Asana 账户
- 认证方式之一：
  - **OAuth**（Airbyte Cloud 推荐）：Cloud 可代管应用与令牌交换。若自行配置 OAuth，请注册 Asana OAuth 应用、使其对授权工作区可用，并启用 **Full permissions**，以便接受 Asana 的 `default` scope
  - **Personal Access Token**：按 [Asana PAT 文档](https://developers.asana.com/docs/personal-access-token) 创建；同步组织导出时请使用服务账号令牌

连接器只能同步**当前认证用户有权访问**的数据；只读许可或受限项目访问会同样限制同步范围。

## 设置指南

<!-- env:cloud -->

**Airbyte Cloud：**

1. [登录 Airbyte Cloud](https://cloud.airbyte.com/workspaces)
2. 左侧点击「源」
3. 点击「+ 新建源」
4. 选择 **Asana**
5. 输入源名称
6. 使用 OAuth 授权，或填写 Personal Access Token
7. （可选）填写 **Organization Export IDs** 以同步指定组织导出
8. 点击「设置源」

<!-- /env:cloud -->

<!-- env:oss -->

**开源 / 自托管：**

1. 打开本地 Airbyte
2. 「源」→「+ 新建源」
3. 选择 **Asana**，填写 PAT 或 OAuth 相关配置
4. （可选）Organization Export IDs
5. 点击「设置源」

<!-- /env:oss -->

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。

