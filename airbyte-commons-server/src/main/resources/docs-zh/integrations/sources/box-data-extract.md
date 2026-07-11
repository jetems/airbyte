# Box Data Extract

> 本文档由 jetems 基于官方英文设置指南翻译，技术标识符与命令请保持原文。

Box Data Extract 连接器可从 Box 云存储提取文件内容，并支持通过 Box AI 从文档中抽取数据，便于合同、贷款材料等场景的自动化入库。

<HideInUI>

本页包含 [Box Data Extract](https://developer.box.com/) 源连接器的设置指南与参考信息。

</HideInUI>

## 前提条件

需要 [Box 应用](https://app.box.com/developers/console)，并配置为 Client Credential Grants（CCG）。认证步骤见 [官方指南](https://developer.box.com/guides/authentication/client-credentials/)。

从应用配置中记录：

- `Client ID`：Box 应用 Client ID
- `Client Secret`：Box 应用 Client Secret

登录主体：

- `Box Subject Type`：`user` 或 `enterprise`（enterprise 使用应用服务账号；user 在允许模拟时以指定用户登录）
- `Box Subject ID`：enterprise 时填企业 ID；user 时填用户 ID

选择要处理的文件夹：

- `Folder ID`：目标文件夹
- `Recursive`：是否递归子文件夹

若使用 Box AI，还需配置：

- `Ask AI Prompt`
- `Extract AI Prompt`
- `Extract Structured AI Fields`（结构化抽取字段格式见 [开发者文档](https://developer.box.com/guides/box-ai/ai-tutorials/extract-metadata-structured/)）

## 设置指南

### 适用于 Airbyte Cloud

1. [登录 Airbyte Cloud](https://cloud.airbyte.com/workspaces)。
2. 点击「源」→「+ 新建源」。
3. 选择 **Box Data Extract**。
4. 输入名称并填写 Client ID、Client Secret、Subject、Folder 等字段。
5. 点击「设置源」。

### 适用于 Airbyte 开源 / 自托管

1. 打开 Airbyte 控制台。
2. 「源」→「+ 新建源」→ 选择 **Box Data Extract**。
3. 填写相同配置项并保存。

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。

