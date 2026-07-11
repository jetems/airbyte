# Track PMS

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

**Track PMS** 源连接器用于从 Track PMS 拉取数据并同步到目标端。

网站：https://tnsinc.com/

## 前提条件

To use this connector, 需要 API credentials from your Track PMS account. Contact your Track PMS administrator or Track support to obtain your API key and secret. 更多信息, see the [Track authentication documentation](https://developer.trackhs.com/docs/authentication#authentication).

## 配置

| 输入 | 类型 | 说明 | 默认值 |
|-------|------|-------------|---------------|
| `customer_domain` | `string` | Your Track PMS domain. Enter the domain only, without `https://` or trailing paths. For example: `api.trackhs.com` or your customer-specific subdomain. |  |
| `api_key` | `string` | Your Track API key, used as the username for authentication. |  |
| `api_secret` | `string` | Your Track API secret, used as the password for authentication. |  |

## 数据流（Streams）

| 流名称 | 主键 | 分页 | 全量同步 | 增量同步 |
|-------------|-------------|------------|---------------------|----------------------|----------------------|
| accounting_accounts | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getledgeraccounts) |
| accounting_bills | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getbillscollection) |
| accounting_charges | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getaccountingchargescollection) |
| accounting_deposits | id | DefaultPaginator | ✅ |  ❌  | Undocumented |
| accounting_deposits_payments | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getdepositpayments) |
| accounting_items | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getitemscollection) |
| accounting_transactions | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getowneridtransactionscollection) |
| booking_fees | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getbookingfees) |
| charges | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getchargescollection) |
| companies | id | DefaultPaginator | ✅ |  ✅  | [Link](https://developer.trackhs.com/reference/getcompanies) |
| contacts | id | DefaultPaginator | ✅ |  ✅  | [Link](https://developer.trackhs.com/reference/getcontacts) |
| contacts_companies | contactId.companyId | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getcontactcompanies) |
| contacts_pii_redacted | id | DefaultPaginator | ✅ |  ✅  | [Link](https://developer.trackhs.com/reference/getcontacts) |
| contracts | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getownercontractcollection) |
| crm_company_attachment | company_id.id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getcompanyattachments) |
| crm_tasks | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/gettasks) |
| custom_fields | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getcustomfields) |
| date_groups | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getdategroupcollection) |
| documents | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getalldocuments) |
| folios | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getfolioscollection) |
| folios_logs | folio_id.id | DefaultPaginator | ✅ |  ❌  | Undocumented |
| folios_rules | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getfoliorulescollection) |
| folios_transactions | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getfolioidtransactionscollection) |
| fractionals | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/get-pms-fractionals) |
| fractionals_inventory | fraction_id.id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/get-pms-fractionals-fractionalid-invetories) |
| fractionals_owners | fraction_id.id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/get-pms-fractionals-owners) |
| groups | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getgroupscollection) |
| groups_blocks | group_id.id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getgroupblockmappingcollection) |
| groups_breakdown | group_id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getgroupbreakdown) |
| groups_tags | group_id.id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getgrouptagmappingcollection) |
| housekeeping_clean_types | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getcleantypes) |
| housekeeping_task_list | id | DefaultPaginator | ✅ |  ❌  | Undocumented |
| housekeeping_work_orders | id | DefaultPaginator | ✅ |  ✅  | [Link](https://developer.trackhs.com/reference/getworkorders) |
| lodging_types | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getlodgingtypescollection) |
| maintenance_problems | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getmaintenanceproblemscollection) |
| maintenance_work_orders | id | DefaultPaginator | ✅ |  ✅  | [Link](https://developer.trackhs.com/reference/getmaintworkorders) |
| nodes | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getnodes) |
| nodes_types | id | DefaultPaginator | ✅ |  ❌  | Undocumented |
| owners | id | DefaultPaginator | ✅ |  ✅  | [Link](https://developer.trackhs.com/reference/getownercollection) |
| owners_contracts | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getownercontractcollection) |
| owners_pii_redacted | id | DefaultPaginator | ✅ |  ✅  | [Link](https://developer.trackhs.com/reference/getownercollection) |
| owners_statements | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/get-pms-statements) |
| owners_statements_transactions | statement_id.id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getstatementtransactionscollection) |
| owners_units | ownerId.id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getownerunitscollection) |
| promo_codes | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getpromocodesv2) |
| quotes | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getquotescollectionv2) |
| rate_types | id | DefaultPaginator | ✅ |  ❌  | Undocumented |
| reservations | id | Elastic Search PIT | ✅ |  ✅  | [Link](https://developer.trackhs.com/reference/getreservations) |
| reservations_cancellation_policies | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getcancellationpolicies) |
| reservations_cancellation_reasons | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getcancellationreasons) |
| reservations_discount_reasons | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getdiscountreasons) |
| reservations_guarantee_policies | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/get-pms-reservations-policies-guaranties) |
| reservations_types | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getreservationtypes) |
| reservations_v2 | id | Elastic Search PIT | ✅ |  ✅  | [Link](https://developer.trackhs.com/reference/getreservations-1) |
| reviews | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getreviewscollection) |
| roles | id | DefaultPaginator | ✅ |  ❌  | Undocumented |
| suspend_code_reasons | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getsuspendcodereasons) |
| tags | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/gettagscollection) |
| tax_districts | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/gettaxdistrictscollection) |
| tax_policies | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/gettaxpolicycollection) |
| taxes | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/gettaxcollection) |
| travel_insurance_products | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/gettravelinsuranceproducts) |
| units | id | DefaultPaginator | ✅ |  ✅  | [Link](https://developer.trackhs.com/reference/getchannelunits) |
| units_amenities | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getunitamenities) |
| units_amenity_groups | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getunitamenitygroups) |
| units_bed_types | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getbedtypescollection) |
| units_blocks | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getunitblockscollection) |
| units_channel | unit_id.id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getunitchannelunitcollection) |
| units_daily_pricing_v2 | unit_id.rateTypeId | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getv2unitdailypricing) |
| units_daily_pricing_parent | id | DefaultPaginator | ✅ |  ✅  | [Link](https://developer.trackhs.com/reference/getchannelunits) |
| units_taxes | unit_id.id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getunitchanneltaxcollection) |
| units_taxes_parent | id | DefaultPaginator | ✅ |  ✅  | [Link](https://developer.trackhs.com/reference/getchannelunits) |
| units_types | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getunittypes-2) |
| units_types_daily_pricing_v2 | unit_type_id.rateTypeId | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getv2unittypedailypricing) |
| units_types_daily_pricing_parent | id | DefaultPaginator | ✅ |  ❌  | [Link](https://developer.trackhs.com/reference/getunittypes-2) |
| users | id | DefaultPaginator | ✅ |  ❌  | Undocumented |
| users_pii_redacted | id | DefaultPaginator | ✅ |  ❌  | Undocumented |

## 设置指南

1. 在 Airbyte 中打开「源」→「+ 新建源」
2. 选择 **Track PMS** 并输入名称
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
