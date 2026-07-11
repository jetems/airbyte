# Paddle

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

**Paddle** 源连接器用于从 Paddle 拉取数据并同步到目标端。

网站：https://www.paddle.com/
API 参考：https://developer.paddle.com/api-reference/overview

## 配置

| 输入 | 类型 | 说明 | 默认值 |
|-------|------|-------------|---------------|
| `api_key` | `string` | API Key。 Your Paddle API Key。 You can generate it by navigating to Paddle &gt; Developer tools &gt; Authentication &gt; Generate API Key。 Treat this key like a password and keep it secure. |  |
| `environment` | `string` | Environment. The environment for the Paddle API, either &#39;sandbox&#39; or &#39;live&#39;. | api |
| `start_date` | `string` | 起始日期。  |  |

## 设置指南

1. 在 Airbyte 中打开「源」→「+ 新建源」
2. 选择 **Paddle** 并输入名称
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
