# Breezometer

> 本文档由 jetems 基于官方英文设置指南翻译，技术标识符与命令请保持原文。

Breezometer 连接器可按指定位置查询环境信息，例如空气质量、花粉预报、当前与预报天气，以及野火相关数据。

## 前提条件

- Breezometer 账户
- `api_key`：可在 Breezometer 账户首页查看

## 支持的同步模式

Breezometer 连接器支持 **全量刷新（Full Refresh）**。

## 配置项（开源/自托管）

- API Key
- Latitude（纬度）
- Longitude（经度）
- Days to Forecast（预报天数）
- Hours to Forecast（预报小时数）
- Historic Hours（历史小时数）
- Radius（半径）

## 支持的数据流

- [Air Quality - Current](https://docs.breezometer.com/api-documentation/air-quality-api/v2/#current-conditions)
- [Air Quality - Forecast](https://docs.breezometer.com/api-documentation/air-quality-api/v2/#hourly-forecast)
- [Air Quality - Historical](https://docs.breezometer.com/api-documentation/air-quality-api/v2/#hourly-history)
- [Pollen - Forecast](https://docs.breezometer.com/api-documentation/pollen-api/v2/#daily-forecast)
- [Weather - Current](https://docs.breezometer.com/api-documentation/weather-api/v1/#current-conditions)
- [Weather - Forecast](https://docs.breezometer.com/api-documentation/weather-api/v1/#hourly-forecast)
- [Wildfire - Burnt Area](https://docs.breezometer.com/api-documentation/wildfire-tracker-api/v1/#burnt-area-api)
- [Wildfire - Locate](https://docs.breezometer.com/api-documentation/wildfire-tracker-api/v1/#current-conditions)

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。

