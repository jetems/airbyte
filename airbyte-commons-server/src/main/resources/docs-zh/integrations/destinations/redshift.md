# Redshift

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

Redshift 目标连接器将数据加载到 Amazon Redshift。

## 前提条件

- 集群连接信息
- 用户权限与（可选）S3 暂存桶

## 设置指南

1. 打开「目标」→「+ 新建目标」
2. 选择 **Redshift** 并输入名称
3. 填写主机/项目/桶、认证、默认 schema 或数据集等参数
4. 确认网络连通（VPC / 防火墙 / Cloud IP 白名单）
5. 点击「设置目标」完成检测

建议使用**专用服务账号**，仅授予写入目标库/桶所需的最小权限。

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。

