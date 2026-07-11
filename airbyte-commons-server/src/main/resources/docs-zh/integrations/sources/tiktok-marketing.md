# TikTok Marketing

> 本文档由 jetems 基于官方英文设置指南翻译（模型润色），技术标识符、命令与配置字段名请保持原文。

**TikTok Marketing** 源连接器用于从 TikTok Marketing 拉取数据并同步到目标端。

<HideInUI>

本页包含 TikTok Marketing 连接器的设置指南与参考信息。

</HideInUI>

## 前提条件

<!-- env:cloud -->

**For Airbyte Cloud:**

- A Tiktok Ads Business account with permission to access data from accounts you want to sync
<!-- /env:cloud -->

<!-- env:oss -->

**For Airbyte Open Source:**

For the Production environment (OAuth2.0):

- Access token
- Secret
- App ID

To access the Sandbox environment:

- Access token
- Advertiser ID
<!-- /env:oss -->

## 数据流（Streams）

| 流名称 | 主键 | 分页 | 全量同步 | 增量同步 |
|:------------------------------------------|:-------------|:-------------------------------------------|:------------|
| Advertisers                               | Prod,Sandbox | advertiser_id                              | No          |
| AdGroups                                  | Prod,Sandbox | adgroup_id                                 | Yes         |
| Ads                                       | Prod,Sandbox | ad_id                                      | Yes         |
| Campaigns                                 | Prod,Sandbox | campaign_id                                | Yes         |
| AdsReportsHourly                          | Prod,Sandbox | ad_id, stat_time_hour                      | Yes         |
| AdsReportsDaily                           | Prod,Sandbox | ad_id, stat_time_day                       | Yes         |
| AdsReportsLifetime                        | Prod,Sandbox | ad_id                                      | No          |
| AdvertisersReportsHourly                  | Prod         | advertiser_id, stat_time_hour              | Yes         |
| AdvertisersReportsDaily                   | Prod         | advertiser_id, stat_time_day               | Yes         |
| AdvertisersReportsLifetime                | Prod         | advertiser_id                              | No          |
| AdGroupsReportsHourly                     | Prod,Sandbox | adgroup_id, stat_time_hour                 | Yes         |
| AdGroupsReportsDaily                      | Prod,Sandbox | adgroup_id, stat_time_day                  | Yes         |
| AdGroupsReportsLifetime                   | Prod,Sandbox | adgroup_id                                 | No          |
| Audiences                                 | Prod,Sandbox | audience_id                                | No          |
| CampaignsReportsHourly                    | Prod,Sandbox | campaign_id, stat_time_hour                | Yes         |
| CampaignsReportsDaily                     | Prod,Sandbox | campaign_id, stat_time_day                 | Yes         |
| CampaignsReportsLifetime                  | Prod,Sandbox | campaign_id                                | No          |
| CreativeAssetsImages                      | Prod,Sandbox | image_id                                   | Yes         |
| CreativeAssetsMusic                       | Prod,Sandbox | music_id                                   | No          |
| CreativeAssetsPortfolios                  | Prod,Sandbox | creative_portfolio_id                      | No          |
| CreativeAssetsVideos                      | Prod,Sandbox | video_id                                   | Yes         |
| AdvertiserIds                             | Prod         | advertiser_id                              | No          |
| AdvertisersAudienceReportsDaily           | Prod         | advertiser_id, stat_time_day, gender, age  | Yes         |
| AdvertisersAudienceReportsByCountryDaily  | Prod         | advertiser_id, stat_time_day, country_code | Yes         |
| AdvertisersAudienceReportsByPlatformDaily | Prod         | advertiser_id, stat_time_day, platform     | Yes         |
| AdvertisersAudienceReportsLifetime        | Prod         | advertiser_id, gender, age                 | No          |
| AdGroupAudienceReportsDaily               | Prod,Sandbox | adgroup_id, stat_time_day, gender, age     | Yes         |
| AdGroupAudienceReportsByCountryDaily      | Prod,Sandbox | adgroup_id, stat_time_day, country_code    | Yes         |
| AdGroupAudienceReportsByPlatformDaily     | Prod,Sandbox | adgroup_id, stat_time_day, platform        | Yes         |
| AdsAudienceReportsDaily                   | Prod,Sandbox | ad_id, stat_time_day, gender, age          | Yes         |
| AdsAudienceReportsByCountryDaily          | Prod,Sandbox | ad_id, stat_time_day, country_code         | Yes         |
| AdsAudienceReportsByPlatformDaily         | Prod,Sandbox | ad_id, stat_time_day, platform             | Yes         |
| AdsAudienceReportsByProvinceDaily         | Prod,Sandbox | ad_id, stat_time_day, province_id          | Yes         |
| CampaignsAudienceReportsDaily             | Prod,Sandbox | campaign_id, stat_time_day, gender, age    | Yes         |
| CampaignsAudienceReportsByCountryDaily    | Prod,Sandbox | campaign_id, stat_time_day, country_code   | Yes         |
| CampaignsAudienceReportsByPlatformDaily   | Prod,Sandbox | campaign_id, stat_time_day, platform       | Yes         |
| SparkAds                                  | Prod         | spark_ads_post_id                          | No          |
| Pixels                                    | Prod         | pixel_id                                   | No          |
| PixelInstantPageEvents                    | Prod         | -                                          | No          |
| PixelEventsStatistics                     | Prod         | -                                          | No          |
| AdsReportsByCountryDaily                  | Prod         | ad_id, stat_time_day, country_code         | Yes         |
| AdsReportsByCountryHourly                 | Prod         | ad_id, stat_time_hour, country_code        | Yes         |
| AdGroupsReportsByCountryDaily              | Prod         | adgroup_id, stat_time_day, country_code    | Yes         |
| AdGroupsReportsByCountryHourly             | Prod         | adgroup_id, stat_time_hour, country_code   | Yes         |

## 设置指南

1. 在 Airbyte 中打开「源」→「+ 新建源」
2. 选择 **TikTok Marketing** 并输入名称
3. 按配置表填写认证信息（API Key / OAuth / 连接串 / 账号密码等）
4. 按需设置起始日期、资源范围、区域等可选项
5. 点击「设置源」完成检测并保存

<!-- env:cloud -->

**Airbyte Cloud：** 支持 OAuth 的连接器可优先使用「认证您的账户」一键授权。

<!-- /env:cloud -->

<!-- env:oss -->

**开源 / 自托管：** 在对应产品控制台创建 API Token 或服务账号，并按需配置回调 URL 与 IP 白名单。

<!-- /env:oss -->

## 支持的同步模式

以连接器检测结果为准，常见包括全量刷新（Full Refresh）与增量（Incremental）。

## IP 白名单

若使用 Airbyte Cloud 且组织限制访问 IP，请将 [Airbyte Cloud IP 地址](https://docs.airbyte.com/platform/operating-airbyte/ip-allowlist) 加入白名单。

## Changelog

> 完整变更记录见官方英文文档 Changelog 章节。
