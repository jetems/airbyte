#!/usr/bin/env python3
"""
Generate Chinese mappings for CDK declarative schema titles/descriptions.
Does NOT modify declarative_component_schema.yaml — only:
  - airbyte-webapp/src/area/connectorBuilder/components/Builder/localizeCdkSchema.ts
  - airbyte-webapp/src/locales/zh.json
"""
from __future__ import annotations

import json
import re
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
SCHEMA = ROOT / "airbyte-webapp/build/declarative_component_schema.yaml"
TS_OUT = ROOT / "airbyte-webapp/src/area/connectorBuilder/components/Builder/localizeCdkSchema.ts"
ZH_JSON = ROOT / "airbyte-webapp/src/locales/zh.json"

# High-quality translations for all schema titles (screenshot + full CDK catalog).
# Unlisted titles fall back to English (safe).
TITLE_ZH: dict[str, str] = {
    # --- Global config ---
    "Streams to Check": "要检测的数据流",
    "Stream Names": "数据流名称",
    "Dynamic Streams to Check": "要检测的动态数据流",
    "Dynamic Streams Check Configs": "动态数据流检测配置",
    "Dynamic Stream Name": "动态数据流名称",
    "Stream Count": "数据流数量",
    "Use Check Availability": "使用可用性检测",
    "Concurrency Level": "并发级别",
    "Default Concurrency": "默认并发数",
    "Max Concurrency": "最大并发数",
    "HTTP API Budget": "HTTP API 配额",
    "Policies": "策略",
    "Rate Limit Reset Header": "限流重置时间响应头",
    "Rate Limit Remaining Header": "剩余配额响应头",
    "Status Codes for Rate Limit Hit": "触发限流的状态码",
    "Fixed Window Call Rate Policy": "固定窗口调用速率策略",
    "Moving Window Call Rate Policy": "滑动窗口调用速率策略",
    "Unlimited Call Rate Policy": "无限调用速率策略",
    "Period": "周期",
    "Call Limit": "调用上限",
    "Matchers": "匹配器",
    "Rates": "速率列表",
    "Rate": "速率",
    "Limit": "上限",
    "Interval": "时间间隔",
    "integer": "整数",
    "string": "字符串",
    "number": "数字",
    "boolean": "布尔值",
    "Advanced": "高级",
    # Path-derived label (schema field has no title)
    "Ignore Stream Slicer Parameters On Paginated Requests": "分页请求时忽略数据流切片器参数",
    "Extractor": "提取器",
    # --- Stream config (screenshot) ---
    "API Endpoint URL": "API 端点 URL",
    "API Base URL": "API 基础 URL",
    "HTTP Method": "HTTP 方法",
    "HTTP Response Format": "HTTP 响应格式",
    "HTTP Requester": "HTTP 请求器",
    "Record Selector": "记录选择器",
    "Dpath Extractor": "Dpath 提取器",
    "Field Path": "字段路径",
    "Record Expander": "记录展开",
    "Primary Key": "主键",
    "Authenticator": "认证器",
    "Query Parameters": "查询参数",
    "Request Headers": "请求头",
    "URL Path": "URL 路径",
    "URL Base": "URL 基础路径",
    "Synchronous Retriever": "同步检索器",
    "Asynchronous Retriever": "异步检索器",
    "Retriever": "检索器",
    "Decoder": "解码器",
    "JSON": "JSON",
    "JSON Lines": "JSON Lines",
    "XML": "XML",
    "CSV": "CSV",
    "gzip": "gzip 压缩",
    "ZIP File": "ZIP 文件",
    "Bearer Token": "Bearer 令牌",
    "CSV": "CSV 格式",
    "JSON": "JSON 格式",
    "JSON Lines": "JSON Lines 格式",
    "Name": "名称",
    "OAuth2": "OAuth2 认证",
    "Schema": "数据模式",
    "Streams": "数据流列表",
    "XML": "XML 格式",
    "No Authentication": "无认证",
    "API Key Authenticator": "API Key 认证器",
    "Bearer Authenticator": "Bearer 认证器",
    "Bearer Token Authenticator": "Bearer Token 认证器",
    "Basic HTTP Authenticator": "HTTP Basic 认证器",
    "OAuth2": "OAuth2 认证",
    "JWT Authenticator": "JWT 认证器",
    "Session Token Authenticator": "会话 Token 认证器",
    "Selective Authenticator": "选择性认证器",
    "Custom Authenticator": "自定义认证器",
    "API Key": "API 密钥",
    "Username": "用户名",
    "Password": "密码",
    "Bearer Token": "Bearer 令牌",
    "Header Name": "请求头名称",
    "Header Prefix": "请求头前缀",
    "Headers": "请求头",
    "Inject API Key Into Outgoing HTTP Request": "将 API Key 注入出站 HTTP 请求",
    "Inject Into": "注入位置",
    "Query Properties": "查询属性",
    "Fetch Properties from Endpoint": "从端点获取属性",
    "Request Body": "请求体",
    "Request Body JSON Payload": "请求体 JSON 负载",
    "Request Body Payload (Non-JSON)": "请求体负载（非 JSON）",
    "Request Option": "请求选项",
    "Request Path": "请求路径",
    "Error Handler": "错误处理器",
    "Error Handlers": "错误处理器列表",
    "Use Cache": "使用缓存",
    "Partition Router": "分区路由器",
    "Record Filter": "记录过滤器",
    "Schema Normalization": "数据模式规范化",
    "Transform Before Filtering": "过滤前转换",
    "Pagination Strategy": "分页策略",
    "Default Paginator": "默认分页器",
    "No Pagination": "不分页",
    "Cursor Pagination": "游标分页",
    "Offset Increment": "偏移量递增",
    "Page Increment": "页码递增",
    "Page Size": "页大小",
    "Incremental Sync": "增量同步",
    "Datetime Based Cursor": "基于日期时间的游标",
    "Cursor Field": "游标字段",
    "Start Datetime": "开始日期时间",
    "End Datetime": "结束日期时间",
    "Datetime Format": "日期时间格式",
    "Cursor Datetime Formats": "游标日期时间格式",
    "Lookback Window": "回看窗口",
    "Step": "步长",
    "Parent Stream": "父数据流",
    "Substream Partition Router": "子流分区路由器",
    "List Partition Router": "列表分区路由器",
    "Multiple Partition Routers": "多分区路由器",
    "Transformations": "转换",
    "Add Fields": "添加字段",
    "Remove Fields": "移除字段",
    "Composite Key": "复合主键",
    "Single Key": "单主键",
    "Schema Loader": "数据模式加载器",
    "Inline Schema Loader": "内联数据模式加载器",
    "Json File Schema Loader": "JSON 文件数据模式加载器",
    "Dynamic Schema Loader": "动态数据模式加载器",
    "Custom Schema Loader": "自定义数据模式加载器",
    "Declarative Stream": "声明式数据流",
    "Full Refresh Stream": "全量刷新数据流",
    "Incremental Stream": "增量数据流",
    "Spec": "规格（Spec）",
    "Connection Specification": "连接规格",
    "Documentation URL": "文档 URL",
    "Advanced Auth": "高级认证",
    "Client ID": "客户端 ID",
    "Client Secret": "客户端密钥",
    "Refresh Token": "刷新令牌",
    "Access Token Value": "访问令牌值",
    "Scopes": "权限范围",
    "Token Refresh Endpoint": "令牌刷新端点",
    "Grant Type": "授权类型",
    "Path": "路径",
    "Method": "方法",
    "Value": "值",
    "Key": "键",
    "Fields": "字段",
    "Parameters": "参数",
    "Condition": "条件",
    "Predicate": "谓词",
    "Action": "操作",
    "File Path": "文件路径",
    "Schemas": "数据模式列表",
    "Base JSON Schema": "基础 JSON 数据模式",
    "Default Values": "默认值",
    "Error Message": "错误消息",
    "HTTP Codes": "HTTP 状态码",
    "Max Retry Count": "最大重试次数",
    "Backoff Strategies": "退避策略",
    "Constant Backoff": "固定退避",
    "Exponential Backoff": "指数退避",
    "Custom Backoff Strategy": "自定义退避策略",
    "Default Error Handler": "默认错误处理器",
    "Composite Error Handler": "组合错误处理器",
    "Response Filters": "响应过滤器",
    "Custom Error Handler": "自定义错误处理器",
    "Class Name": "类名",
    "Number of Records": "记录数",
    "Number of seconds": "秒数",
    "Weight": "权重",
    "Factor": "因子",
    "Minimum Wait Time": "最小等待时间",
    "Max Waiting Time in Seconds": "最大等待时间（秒）",
    "Failure Type": "失败类型",
    "Error Message Substring": "错误消息子串",
    "On No Records": "无记录时",
    "Stop Condition": "停止条件",
    "Cursor Value": "游标值",
    "Cursor Granularity": "游标粒度",
    "Outgoing Datetime Format": "输出日期时间格式",
    "Min Datetime": "最小日期时间",
    "Max Datetime": "最大日期时间",
    "Min-Max Datetime": "最小-最大日期时间",
    "Datetime": "日期时间",
    "Partition Values": "分区值",
    "Parent Key": "父键",
    "Parent Stream Config": "父数据流配置",
    "Parent Stream Configs": "父数据流配置列表",
    "Stream Config": "数据流配置",
    "Stream Parameters": "数据流参数",
    "Stream Template": "数据流模板",
    "Stream Group": "数据流组",
    "State Migrations": "状态迁移",
    "Custom Transformation": "自定义转换",
    "Custom Retriever": "自定义检索器",
    "Custom Requester": "自定义请求器",
    "Custom Record Extractor": "自定义记录提取器",
    "Custom Record Filter": "自定义记录过滤器",
    "Custom Pagination Strategy": "自定义分页策略",
    "Custom Partition Router": "自定义分区路由器",
    "Custom Decoder": "自定义解码器",
    "Custom Schema Normalization": "自定义数据模式规范化",
    "Custom State Migration": "自定义状态迁移",
    "Custom Validation Strategy": "自定义校验策略",
    "Custom Config Transformation": "自定义配置转换",
    "Login Path": "登录路径",
    "Login Requester": "登录请求器",
    "Session Token": "会话令牌",
    "Session Token Path": "会话令牌路径",
    "Session Request Header": "会话请求头",
    "Token Duration": "令牌有效期",
    "Token Expiry Date": "令牌过期日期",
    "Token Expiry Date Format": "令牌过期日期格式",
    "Token Expiry Property Name": "令牌过期属性名",
    "Refresh Token Property Name": "刷新令牌属性名",
    "Refresh Token Updater": "刷新令牌更新器",
    "Refresh Request Body": "刷新请求体",
    "Refresh Request Headers": "刷新请求头",
    "Access Token Property Name": "访问令牌属性名",
    "Client ID Property Name": "客户端 ID 属性名",
    "Client Secret Property Name": "客户端密钥属性名",
    "Grant Type Property Name": "授权类型属性名",
    "Secret Key": "密钥",
    "Algorithm": "算法",
    "Passphrase": "口令",
    "JWT Headers": "JWT 请求头",
    "JWT Payload": "JWT 负载",
    "Additional JWT Headers": "额外 JWT 请求头",
    "Additional JWT Payload Properties": "额外 JWT 负载属性",
    "Base64-encode Secret Key": "对密钥进行 Base64 编码",
    "Profile Assertion": "配置文件断言",
    "Use Profile Assertion": "使用配置文件断言",
    "API Token Template": "API 令牌模板",
    "API Retention Period": "API 保留期",
    "Field Name": "字段名",
    "Field Paths": "字段路径列表",
    "Field Pointers": "字段指针",
    "Key Path": "键路径",
    "Key Prefix": "键前缀",
    "Key Suffix": "键后缀",
    "Key to Snake Case": "键转蛇形命名",
    "Keys to Lower Case": "键转小写",
    "Keys Replace": "键替换",
    "Key transformation": "键转换",
    "Key/Value Pairs": "键值对",
    "Value Type": "值类型",
    "Value Mapping": "值映射",
    "New value": "新值",
    "Old value": "旧值",
    "Delete Origin Value": "删除原始值",
    "Replace Origin Record": "替换原始记录",
    "Remain Original Record": "保留原始记录",
    "Expand Records From Field": "从字段展开记录",
    "Flatten Fields": "展平字段",
    "Flatten Lists": "展平列表",
    "Dpath Flatten Fields": "Dpath 展平字段",
    "Group by Key": "按键分组",
    "Group Size": "分组大小",
    "Grouping Partition Router": "分组分区路由器",
    "Multiple Schema Loaders": "多数据模式加载器",
    "Schema Path": "数据模式路径",
    "Schema Field Type": "数据模式字段类型",
    "Schema Filter": "数据模式过滤器",
    "Schema Transformations": "数据模式转换",
    "Schema Type Identifier": "数据模式类型标识",
    "Property List": "属性列表",
    "Property Selector": "属性选择器",
    "Property Chunking": "属性分块",
    "Property Limit": "属性上限",
    "Property Limit Type": "属性上限类型",
    "Properties from Endpoint": "来自端点的属性",
    "Always Include Properties": "始终包含的属性",
    "Json Schema Property Selector": "JSON 数据模式属性选择器",
    "Config Components Resolver": "配置组件解析器",
    "Http Components Resolver": "HTTP 组件解析器",
    "Components Resolver": "组件解析器",
    "Parametrized Components Resolver": "参数化组件解析器",
    "Component Mapping Definition": "组件映射定义",
    "Configs Pointer": "配置指针",
    "Config Migration": "配置迁移",
    "Config Normalization Rules": "配置规范化规则",
    "Config Add Fields": "配置添加字段",
    "Config Remove Fields": "配置移除字段",
    "Definition Of Field To Add": "要添加的字段定义",
    "Interpolated Value": "插值",
    "Iterable": "可迭代对象",
    "Lazy Read Pointer": "延迟读取指针",
    "Use Parent Parameters": "使用父级参数",
    "Current Parent Key Value Identifier": "当前父键值标识符",
    "Current Partition Value Identifier": "当前分区值标识符",
    "Deduplicate Partitions": "分区去重",
    "Underlying Partition Router": "底层分区路由器",
    "Global Substream Cursor": "全局子流游标",
    "Client-side Incremental Filtering": "客户端增量过滤",
    "Allow Catalog Defined Cursor Field": "允许目录定义的游标字段",
    "Strict Start-End Time Comparison": "严格起止时间比较",
    "Date Range Clamping": "日期范围钳制",
    "Incrementing Count Cursor": "递增计数游标",
    "Start Value": "起始值",
    "Start From Page": "起始页",
    "Inject Offset on First Request": "首次请求注入偏移量",
    "Inject Page Number on First Request": "首次请求注入页码",
    "Inject Page Size Into Outgoing HTTP Request": "将页大小注入出站请求",
    "Inject Page Token Into Outgoing HTTP Request": "将页令牌注入出站请求",
    "Inject Partition Value Into Outgoing HTTP Request": "将分区值注入出站请求",
    "Inject Start Time Into Outgoing HTTP Request": "将开始时间注入出站请求",
    "Inject End Time Into Outgoing HTTP Request": "将结束时间注入出站请求",
    "Inject Start Value Into Outgoing HTTP Request": "将起始值注入出站请求",
    "Partition Field Start": "分区开始字段",
    "Partition Field End": "分区结束字段",
    "Pagination Reset": "分页重置",
    "Pagination Reset Limits": "分页重置限制",
    "Wait Time Extracted From Response Header": "从响应头提取等待时间",
    "Wait Until Time Defined In Response Header": "等待至响应头定义的时间",
    "Response Header": "响应头",
    "Response Header Name": "响应头名称",
    "Response Token Response Key": "响应令牌键",
    "Validate Session Path": "校验会话路径",
    "Validation Strategy": "校验策略",
    "Validate Adheres To Schema": "校验是否符合数据模式",
    "Dpath Validator": "Dpath 校验器",
    "Predicate Validator": "谓词校验器",
    "Predicate key": "谓词键",
    "Predicate value": "谓词值",
    "Refresh Token Error Status Codes": "刷新令牌错误状态码",
    "Refresh Token Error Key": "刷新令牌错误键",
    "Refresh Token Error Values": "刷新令牌错误值",
    "Expiration Duration": "过期时长",
    "Auth flow": "认证流程",
    "Auth flow type": "认证流程类型",
    "Authenticators": "认证器列表",
    "Authenticator Selection Path": "认证器选择路径",
    "Data Request Authentication": "数据请求认证",
    "OAuth Config Specification": "OAuth 配置规格",
    "OAuth input specification": "OAuth 输入规格",
    "OAuth output specification": "OAuth 输出规格",
    "OAuth server output specification": "OAuth 服务端输出规格",
    "OAuth user input": "OAuth 用户输入",
    "DeclarativeOAuth Connector Specification": "声明式 OAuth 连接器规格",
    "GraphQL Body": "GraphQL 请求体",
    "GraphQL Query Body": "GraphQL 查询体",
    "Json Object Body": "JSON 对象请求体",
    "Plain-text Body": "纯文本请求体",
    "URL-encoded Body": "URL 编码请求体",
    "Parser": "解析器",
    "CSV To File Extractor": "CSV 转文件提取器",
    "File Uploader": "文件上传器",
    "Download HTTP Response Format": "下载 HTTP 响应格式",
    "Record Merge Strategy": "记录合并策略",
    "State Delegating Stream": "状态委托数据流",
    "Conditional Streams": "条件数据流",
    "Stream Parameters Definition": "数据流参数定义",
    "Legacy To Per-partition-state Migration": "遗留到按分区状态迁移",
    "Block Simultaneous Syncs Action": "阻止同时同步",
    "Create or Update": "创建或更新",
    "Data Feed API": "数据馈送 API",
    "Extraction Regex": "提取正则",
    "Extra Fields": "额外字段",
    "Remap Field": "重映射字段",
    "Transformation to apply for extracted object keys by Dpath Flatten Fields": "Dpath 展平字段后对对象键的转换",
    "URL Path Pattern": "URL 路径模式",
    "HTTP Request Matcher": "HTTP 请求匹配器",
    "Composite Key of Nested Fields": "嵌套字段复合主键",
    "Backoff Time": "退避时间",
    "Backoff Strategies": "退避策略",
    "Incremental Dependency": "增量依赖",
    "Type Path": "类型路径",
    "Types Map": "类型映射",
}


# High-quality description translations (exact English match from schema).
DESC_ZH: dict[str, str] = {
    "Defines the streams to try reading when running a check operation.": "定义在执行连接器检测（check）操作时尝试读取的数据流。",
    "Names of the streams to try reading from when running a check operation.": "执行检测时尝试读取的数据流名称列表。",
    "(This component is experimental. Use at your own risk.) Defines the dynamic streams to try reading when running a check operation.": "（实验性功能，请谨慎使用。）定义在执行检测操作时尝试读取的动态数据流。",
    "Numbers of the streams to try reading from when running a check operation.": "执行检测时尝试读取的数据流数量。",
    "Enables stream check availability. This field is automatically set by the CDK.": "启用数据流可用性检测。此字段由 CDK 自动设置。",
    "The dynamic stream name.": "动态数据流名称。",
    "Defines the amount of parallelization for the streams that are being synced. The factor of parallelization is how many partitions or streams are synced at the same time. For example, with a concurrency_level of 10, ten streams or partitions of data will processed at the same time. Note that a value of 1 could create deadlock if a stream has a very high number of partitions.": "定义同步数据流时的并行度。并行因子表示可同时同步的分区或数据流数量。例如并发级别为 10 时，将同时处理 10 个数据流或数据分区。注意：若数据流分区数极高，值为 1 可能导致死锁。",
    "The amount of concurrency that will applied during a sync. This value can be hardcoded or user-defined in the config if different users have varying volume thresholds in the target API.": "同步过程中应用的并发量。可写死固定值，也可由用户在配置中定义，以便不同用户针对目标 API 使用不同的流量阈值。",
    "The maximum level of concurrency that will be used during a sync. This becomes a required field when the default_concurrency derives from the config, because it serves as a safeguard against a user-defined threshold that is too high.": "同步过程中允许的最大并发级别。当默认并发数来自用户配置时，此字段变为必填，用于防止用户将并发设置得过高。",
    "Defines how many requests can be made to the API in a given time frame. `HTTPAPIBudget` extracts the remaining call count and the reset time from HTTP response headers using the header names provided by `ratelimit_remaining_header` and `ratelimit_reset_header`. Only requests using `HttpRequester` are rate-limited; custom components that bypass `HttpRequester` are not covered by this budget.\n": "定义在给定时间范围内可向 API 发起的请求数量。`HTTPAPIBudget` 通过 `ratelimit_remaining_header` 与 `ratelimit_reset_header` 指定的 HTTP 响应头解析剩余调用次数与重置时间。仅使用 `HttpRequester` 的请求会计入配额；绕过 `HttpRequester` 的自定义组件不受此限制。",
    "List of call rate policies that define how many calls are allowed.": "定义允许调用次数的调用速率策略列表。",
    "The HTTP response header name that indicates when the rate limit resets.": "指示限流何时重置的 HTTP 响应头名称。",
    "The HTTP response header name that indicates the number of remaining allowed calls.": "指示剩余允许调用次数的 HTTP 响应头名称。",
    "List of HTTP status codes that indicate a rate limit has been hit.": "表示已触发限流的 HTTP 状态码列表。",
    # --- Schema Loader（数据模式页）---
    "One or many schema loaders can be used to retrieve the schema for the current stream. When multiple schema loaders are defined, schema properties will be merged together. Schema loaders defined first taking precedence in the event of a conflict.": "可使用一个或多个数据模式加载器获取当前数据流的数据模式。定义多个加载器时，模式属性会合并；发生冲突时，先定义的加载器优先。",
    "Loads a schema that is defined directly in the manifest file.": "加载直接在 manifest 文件中定义的数据模式。",
    "Loads the schema from a json file.": "从 JSON 文件加载数据模式。",
    "(This component is experimental. Use at your own risk.) Loads a schema by extracting data from retrieved records.": "（实验性功能，请谨慎使用。）通过从已检索记录中提取数据来加载数据模式。",
    "Schema Loader component whose behavior is derived from a custom code implementation of the connector.": "行为由连接器自定义代码实现决定的数据模式加载器组件。",
    "Describes a streams' schema. Refer to the <a href=\"https://docs.airbyte.com/understanding-airbyte/supported-data-types/\">Data Types documentation</a> for more details on which types are valid.": "描述数据流的数据模式。有效类型详见 [数据类型文档](https://docs.airbyte.com/understanding-airbyte/supported-data-types/)。",
    "Responsible for filtering fields to be added to json schema.": "负责过滤将写入 JSON 数据模式的字段。",
    "A list of transformations to be applied to the schema.": "要应用到数据模式的转换列表。",
    "(This component is experimental. Use at your own risk.) Identifies schema details for dynamic schema extraction and processing.": "（实验性功能，请谨慎使用。）标识动态数据模式提取与处理所需的细节。",
    "List of nested fields defining the schema field path to extract. Defaults to [].": "定义要提取的数据模式字段路径的嵌套字段列表。默认值为 []。",
    # --- Stream 配置页：分区路由器 / Advanced / 转换 等 tips ---
    "Used to iteratively execute requests over a set of values, such as a parent stream's records or a list of constant values.": "用于在一组值上迭代发起请求，例如父数据流的记录或一组常量值。",
    "Partition router that is used to retrieve records that have been partitioned according to records from the specified parent streams. An example of a parent stream is automobile brands and the substream would be the various car models associated with each branch.": "按指定父数据流的记录进行分区并检索子记录。例如父数据流为汽车品牌，子流为各品牌下的车型。",
    "A Partition router that specifies a list of attributes where each attribute describes a portion of the complete data set for a stream. During a sync, each value is iterated over and can be used as input to outbound API requests.": "通过属性列表描述数据流完整数据集的各个分区。同步时会遍历每个值，并可作为出站 API 请求的输入。",
    "A decorator on top of a partition router that groups partitions into batches of a specified size. This is useful for APIs that support filtering by multiple partition keys in a single request. Note that per-partition incremental syncs may not work as expected because the grouping of partitions might change between syncs, potentially leading to inconsistent state tracking.\n": "在分区路由器之上的装饰器，将分区按指定大小分批。适用于单次请求可按多个分区键过滤的 API。注意：按分区的增量同步可能不如预期，因为批次分组可能在同步之间变化，导致状态跟踪不一致。",
    "A decorator on top of a partition router that groups partitions into batches of a specified size. This is useful for APIs that support filtering by multiple partition keys in a single request. Note that per-partition incremental syncs may not work as expected because the grouping of partitions might change between syncs, potentially leading to inconsistent state tracking.": "在分区路由器之上的装饰器，将分区按指定大小分批。适用于单次请求可按多个分区键过滤的 API。注意：按分区的增量同步可能不如预期，因为批次分组可能在同步之间变化，导致状态跟踪不一致。",
    "Partition router component whose behavior is derived from a custom code implementation of the connector.": "行为由连接器自定义代码实现决定的分区路由器组件。",
    "If true, the partition router and incremental request options will be ignored when paginating requests. Request options set directly on the requester will not be ignored.": "为 true 时，分页请求会忽略分区路由器与增量请求选项。直接设置在请求器上的请求选项不会被忽略。",
    "Describes what triggers pagination reset and how to handle it.": "描述触发分页重置的条件以及如何处理。",
    "Describes what triggers pagination reset and how to handle it. If SPLIT_USING_CURSOR, the connector developer is accountable for ensuring that the records are returned in ascending order.": "描述触发分页重置的条件以及如何处理。若为 SPLIT_USING_CURSOR，连接器开发者需确保记录按升序返回。",
    "For APIs that require explicit specification of the properties to query for, this component will take a static or dynamic set of properties (which can be optionally split into chunks) and allow them to be injected into an outbound request by accessing stream_partition.extra_fields.": "适用于必须显式指定查询属性的 API。本组件接受静态或动态属性集（可分块），并通过 stream_partition.extra_fields 注入出站请求。",
    "For APIs that require explicit specification of the properties to query for, this component specifies which property fields and how they are supplied to outbound requests.": "适用于必须显式指定查询属性的 API。本组件指定属性字段及其如何提供给出站请求。",
    "Enables stream requests caching. When set to true, repeated requests to the same URL will return cached responses. Parent streams automatically have caching enabled. Only set this to false if you are certain that caching should be disabled, as it may negatively impact performance when the same data is needed multiple times (e.g., for scroll-based pagination APIs where caching causes duplicate records).": "启用数据流请求缓存。为 true 时，对同一 URL 的重复请求将返回缓存响应。父数据流默认启用缓存。仅在确定应禁用缓存时设为 false；若同一数据会被多次使用（例如滚动分页 API），禁用缓存可能影响性能并导致重复记录。",
    "Error handler component that defines how to handle errors.": "定义如何处理错误的错误处理器组件。",
    "A list of transformations to be applied to each output record.": "要应用到每条输出记录的转换列表。",
    "Array of state migrations to be applied on the input state": "要对输入状态应用的状态迁移数组",
    "(experimental) Describes how to fetch a file": "（实验性）描述如何获取文件",
    "Filter applied on a list of records.": "对记录列表应用的过滤器。",
    "Transformation which adds field to an output record. The path of the added field can be nested.": "向输出记录添加字段的转换。添加字段的路径可以嵌套。",
    "A transformation which removes fields from a record. The fields removed are designated using FieldPointers. During transformation, if a field or any of its parents does not exist in the record, no error is thrown.": "从记录中移除字段的转换。被移除字段由 FieldPointers 指定。转换时若字段或其父级不存在，不会抛出错误。",
    "Component defining how to handle errors. Default behavior includes only retrying server errors (HTTP 5XX) and too many requests (HTTP 429) with an exponential backoff.": "定义如何处理错误的组件。默认仅对服务器错误（HTTP 5XX）与请求过多（HTTP 429）使用指数退避重试。",
    "Error handler that sequentially iterates over a list of error handlers.": "按顺序遍历错误处理器列表的错误处理器。",
    "Error handler component whose behavior is derived from a custom code implementation of the connector.": "行为由连接器自定义代码实现决定的错误处理器组件。",
    "List of error handlers to iterate on to determine how to handle a failed response.": "用于判断如何处理失败响应的错误处理器列表。",
    "PartitionRouter component that describes how to partition the stream, enabling incremental syncs and checkpointing.": "描述如何对数据流分区的组件，以支持增量同步与检查点。",
    "Requester component that describes how to prepare HTTP requests to send to the source API.": "描述如何准备发往源 API 的 HTTP 请求的请求器组件。",
    "Component that describes how to extract records from a HTTP response.": "描述如何从 HTTP 响应中提取记录的组件。",
    "Paginator component that describes how to navigate through the API's pages.": "描述如何遍历 API 分页的分页器组件。",
    "Fields will be added if expression is evaluated to True.": "当表达式求值为 True 时添加字段。",
    "The predicate to filter a property by a property value. Property will be removed if it is empty OR expression is evaluated to True.,": "按属性值过滤属性的谓词。若属性为空或表达式求值为 True，则移除该属性。",
    "For APIs with restrictions on the amount of properties that can be requester per request, property chunking can be applied to make multiple requests with a subset of the properties.": "对于每次请求可查询属性数量有限制的 API，可使用属性分块，以属性子集发起多次请求。",
    "Defines how query properties will be grouped into smaller sets for APIs with limitations on the number of properties fetched per API request.": "定义如何将查询属性分组为更小的集合，适用于每次 API 请求可获取属性数量受限的场景。",
}



def escape_icu_angles(s: str) -> str:
    """Prevent formatjs from treating <word> in descriptions as ICU tags."""
    import re
    allowed = {"lnk", "b", "i", "code", "p", "br"}

    def repl(m: re.Match) -> str:
        full = m.group(0)
        name = m.group(1)
        cname = name[1:] if name.startswith("/") else name
        if cname.lower() in allowed:
            return full
        return full.replace("<", "'<'").replace(">", "'>'")

    return re.sub(r"</?([A-Za-z][A-Za-z0-9]*)(?:\s[^>]*)?/?>", repl, s)

def slug(title: str) -> str:
    s = re.sub(r"[^a-zA-Z0-9]+", "_", title).strip("_")
    return re.sub(r"_+", "_", s)[:100] or "empty"


def collect_schema_strings(schema: dict) -> tuple[set[str], dict[str, str]]:
    titles: set[str] = set()
    title_to_desc: dict[str, str] = {}
    defs = schema.get("definitions") or {}

    def add(t: str | None, desc: str | None = None) -> None:
        if not t:
            return
        titles.add(t)
        if desc and t not in title_to_desc:
            title_to_desc[t] = desc

    for _name, d in defs.items():
        if not isinstance(d, dict):
            continue
        add(d.get("title"), d.get("description"))
        for _pk, pv in (d.get("properties") or {}).items():
            if isinstance(pv, dict):
                add(pv.get("title"), pv.get("description"))
                for key in ("oneOf", "anyOf"):
                    for opt in pv.get(key) or []:
                        if isinstance(opt, dict):
                            add(opt.get("title"), opt.get("description"))
        for key in ("oneOf", "anyOf"):
            for opt in d.get(key) or []:
                if isinstance(opt, dict):
                    add(opt.get("title"), opt.get("description"))
                    ref = opt.get("$ref", "")
                    if ref.startswith("#/definitions/"):
                        rd = defs.get(ref.split("/")[-1], {})
                        add(rd.get("title"), rd.get("description"))

    # Labels derived from path names by displayName() when schema has no title
    titles.update(
        {
            "Dynamic Streams Check Configs",
            "Advanced",
            "Extractor",
            # SimpleRetriever.ignore_stream_slicer_parameters_on_paginated_requests (no title in YAML)
            "Ignore Stream Slicer Parameters On Paginated Requests",
        }
    )
    return titles, title_to_desc


def main() -> None:
    schema = yaml.safe_load(SCHEMA.read_text())
    titles, title_to_desc = collect_schema_strings(schema)

    title_map: dict[str, str] = {}
    for t in sorted(titles):
        title_map[t] = TITLE_ZH.get(t, t)

    # Descriptions: exact curated + fallback short Chinese using title
    desc_map: dict[str, str] = {}  # en_desc -> message_id
    desc_zh: dict[str, str] = {}  # message_id -> zh

    for en, zh in DESC_ZH.items():
        # Use enough of the English text to avoid collisions when many
        # descriptions share the same experimental/warning prefix.
        mid = f"connectorBuilder.cdkSchema.descExact.{slug(en[:120])}"
        # Disambiguate if still colliding after slug truncation.
        if mid in desc_zh and desc_zh[mid] != escape_icu_angles(zh):
            mid = f"{mid}_{abs(hash(en)) % 100000}"
        desc_map[en] = mid
        if en.endswith("\n"):
            desc_map[en.rstrip("\n")] = mid
        else:
            desc_map[en + "\n"] = mid
        desc_zh[mid] = escape_icu_angles(zh)

    for t, desc in sorted(title_to_desc.items()):
        if not desc:
            continue
        if desc in desc_map or desc.rstrip("\n") in desc_map:
            continue
        mid = f"connectorBuilder.cdkSchema.d.{slug(t)}"
        # disambiguate if collision
        if mid in desc_zh:
            mid = f"{mid}_{abs(hash(desc)) % 100000}"
        desc_map[desc] = mid
        title_zh = title_map.get(t, t)
        first = re.split(r"(?<=[.!?])\s+", desc.strip())[0]
        if len(first) > 200:
            first = first[:200] + "…"
        # Keep technical English first sentence under Chinese title for accuracy
        desc_zh[mid] = escape_icu_angles(f"【{title_zh}】{first}")

    # Write TypeScript
    lines = [
        "/**",
        " * JETEMS: CDK declarative schema title/description 中文覆盖。",
        " * 不修改 declarative_component_schema.yaml（由 CDK 版本拉取），不影响 schema 功能与校验。",
        " * 本文件可由 tools/jetems-gen-cdk-schema-zh.py 重新生成。",
        " */",
        'import { IntlShape } from "react-intl";',
        "",
        "const CDK_TITLE_MESSAGE_IDS: Record<string, string> = {",
    ]
    for t in sorted(title_map.keys()):
        mid = f"connectorBuilder.cdkSchema.t.{slug(t)}"
        lines.append(f"  {json.dumps(t)}: {json.dumps(mid)},")
    lines.append("};")
    lines.append("")
    lines.append("const CDK_DESCRIPTION_MESSAGE_IDS: Record<string, string> = {")
    for en, mid in sorted(desc_map.items(), key=lambda x: x[0]):
        lines.append(f"  {json.dumps(en)}: {json.dumps(mid)},")
    lines.append("};")
    lines.append(
        """
const isChineseLocale = (locale: string) => locale.toLowerCase().startsWith("zh");

export function localizeCdkSchemaTitle(intl: IntlShape, title: string | undefined): string | undefined {
  if (!title || !isChineseLocale(intl.locale)) {
    return title;
  }
  const messageId = CDK_TITLE_MESSAGE_IDS[title];
  if (!messageId) {
    return title;
  }
  return intl.formatMessage({ id: messageId, defaultMessage: title });
}

export function localizeCdkSchemaDescription(
  intl: IntlShape,
  description: string | undefined
): string | undefined {
  if (!description || !isChineseLocale(intl.locale)) {
    return description;
  }
  const normalized = description.replace(/\\s+$/, "");
  const exact =
    CDK_DESCRIPTION_MESSAGE_IDS[description] ||
    CDK_DESCRIPTION_MESSAGE_IDS[normalized] ||
    CDK_DESCRIPTION_MESSAGE_IDS[`${normalized}\\n`];
  if (exact) {
    return intl.formatMessage({ id: exact, defaultMessage: description });
  }
  for (const [en, messageId] of Object.entries(CDK_DESCRIPTION_MESSAGE_IDS)) {
    const enNorm = en.replace(/\\s+$/, "");
    if (normalized.startsWith(enNorm.slice(0, 100)) || enNorm.startsWith(normalized.slice(0, 100))) {
      return intl.formatMessage({ id: messageId, defaultMessage: description });
    }
  }
  return description;
}
"""
    )
    TS_OUT.write_text("\n".join(lines))

    # Update zh.json
    zh_data = json.loads(ZH_JSON.read_text())
    # remove old cdkSchema keys (previous generation)
    for k in list(zh_data.keys()):
        if k.startswith("connectorBuilder.cdkSchema."):
            del zh_data[k]
    for t, zh in title_map.items():
        zh_data[f"connectorBuilder.cdkSchema.t.{slug(t)}"] = escape_icu_angles(zh)
    for mid, zh in desc_zh.items():
        zh_data[mid] = zh
    ZH_JSON.write_text(json.dumps(zh_data, ensure_ascii=False, indent=2) + "\n")

    cjk = sum(1 for z in title_map.values() if re.search(r"[\u4e00-\u9fff]", z))
    pure_en = [t for t, z in title_map.items() if not re.search(r"[\u4e00-\u9fff]", z)]
    print(f"titles total: {len(title_map)}")
    print(f"titles with CJK: {cjk}")
    print(f"titles still EN: {len(pure_en)}")
    if pure_en:
        print("  EN leftovers:", pure_en[:30])
    print(f"descriptions: {len(desc_zh)}")
    print(f"wrote {TS_OUT.relative_to(ROOT)}")
    print(f"updated {ZH_JSON.relative_to(ROOT)} keys={len(zh_data)}")


if __name__ == "__main__":
    main()
