# Circleci

> 本文档由 jetems 基于官方英文设置指南翻译，技术标识符与命令请保持原文。

CircleCI 持续集成平台源连接器。

## 配置

| 输入 | 类型 | 说明 | 默认值 |
|-------|------|-------------|---------------|
| `api_key` | `string` | API Key。  |  |
| `org_id` | `string` | Organization ID. The org ID found in `https://app.circleci.com/settings/organization/circleci/xxxxx/overview` |  |
| `start_date` | `string` | 起始日期。  |  |
| `project_id` | `string` | Project ID found in the project settings, Visit `https://app.circleci.com/settings/project/circleci/ORG_SLUG/YYYYY`  |  |
| `workflow_id` | `array` | Workflow ID's of project pipelines, Could be seen in the URL of pipeline build, Example `https://app.circleci.com/pipelines/circleci/55555xxxxxx/7yyyyyyyyxxxxx/2/workflows/WORKFLOW_ID`  |  |
| `job_number` | `string` | Job Number of the workflow for `jobs` stream, Auto fetches from `workflow_jobs` stream, if not configured  | `2` |

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。
