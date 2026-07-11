# RentCast

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

**RentCast** 源连接器用于从 RentCast 拉取数据并同步到目标端。

## 配置

| 输入 | 类型 | 说明 | 默认值 |
|-------|------|-------------|---------------|
| `api_key` | `string` | API Key。  |  |
| `address` | `string` | Address. The full address of the property, in the format of Street, City, State, Zip. Used to retrieve data for a specific property, or together with the radius parameter to search for listings in a specific area |  |
| `city` | `string` | City. The name of the city, used to search for listings in a specific city. This parameter is case-sensitive |  |
| `state` | `string` | State. The 2-character state abbreviation, used to search for listings in a specific state. This parameter is case-sensitive |  |
| `zipcode` | `string` | Zip Code. The 5-digit zip code, used to search for listings in a specific zip code |  |
| `latitude` | `string` | Latitude. The latitude of the search area. Use the latitude/longitude and radius parameters to search for listings in a specific area |  |
| `longitude` | `string` | Longitude. The longitude of the search area. Use the latitude/longitude and radius parameters to search for listings in a specific area |  |
| `radius` | `string` | Radius. The radius of the search area in miles, with a maximum of 100. Use in combination with the latitude/longitude or address parameters to search for listings in a specific area |  |
| `property_type` | `string` | Property Type. The type of the property, used to search for listings matching this criteria : Single Family , Condo , Townhouse , Manufactured ,  Multi-Family , Apartment , Land , |  |
| `bedrooms` | `number` | Bedrooms. The number of bedrooms, used to search for listings matching this criteria. Use 0 to indicate a studio layout |  |
| `bath_rooms` | `integer` | Bath Rooms. The number of bathrooms, used to search for listings matching this criteria. Supports fractions to indicate partial bathrooms |  |
| `status` | `string` | Status. The current listing status, used to search for listings matching this criteria : Active or Inactive |  |
| `days_old` | `string` | Days Old. The maximum number of days since a property was listed on the market, with a minimum of 1 or The maximum number of days since a property was last sold, with a minimum of 1. Used to search for properties that were sold within the specified date range |  |
| `data_type_` | `string` | Data Type . The type of aggregate market data to return. Defaults to &quot;All&quot; if not provided : All , Sale , Rental |  |
| `history_range` | `string` | History Range. The time range for historical record entries, in months. Defaults to 12 if not provided |  |

## 设置指南

1. 在 Airbyte 中打开「源」→「+ 新建源」
2. 选择 **RentCast** 并输入名称
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
