# Braze

> 本文档由 jetems 基于官方英文设置指南翻译，技术标识符与命令请保持原文。

本页包含 Braze 源连接器的设置指南与参考信息。

## 前提条件

需要 Braze 账户，以便在配置时提供 `URL` 与 `Rest API Key`。

- `Rest API Key`：Braze Dashboard → Developer Console → API Settings → Rest API Keys
- `URL`：Braze Dashboard → Manage Settings → Settings → 你的应用名 → SDK Endpoint

## 在 Airbyte 中配置 Braze

### 适用于 Airbyte Cloud

1. [登录 Airbyte Cloud](https://cloud.airbyte.com/workspaces)。
2. 点击「源」→「+ 新建源」。
3. 在设置源页面选择 **Braze**。
4. 输入连接器名称。
5. 填写 REST API Key 与 URL（SDK Endpoint）。
6. 点击「设置源」。

### 适用于 Airbyte 开源 / 自托管

1. 打开 Airbyte 控制台。
2. 点击「源」→「+ 新建源」。
3. 选择 **Braze** 并填写 REST API Key 与 URL。
4. 点击「设置源」。

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。

