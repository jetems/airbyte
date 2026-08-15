/*
 * Copyright (c) 2020-2026 Airbyte, Inc., all rights reserved.
 */

package io.airbyte.commons.entitlements

import io.airbyte.commons.entitlements.models.EntitlementResult
import io.airbyte.commons.entitlements.models.FeatureEntitlement
import io.airbyte.commons.license.ActiveAirbyteLicense
import io.airbyte.commons.license.AirbyteLicense
import io.airbyte.commons.license.AirbyteLicense.LicenseType
import io.airbyte.config.Configs
import io.airbyte.data.services.OrganizationService
import io.airbyte.domain.models.OrganizationId
import io.airbyte.micronaut.runtime.AirbyteConfig
import io.airbyte.micronaut.runtime.AirbyteStiggClientConfig
import io.mockk.mockk
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertInstanceOf
import org.junit.jupiter.api.assertThrows
import java.util.UUID

class EntitlementClientFactoryTest {
  @Test
  fun `community edition`() {
    val factory =
      EntitlementClientFactory(
        airbyteConfig = AirbyteConfig(edition = Configs.AirbyteEdition.COMMUNITY),
        airbyteStiggClientConfig = AirbyteStiggClientConfig(),
        activeLicense = null,
      )
    assertInstanceOf<NoEntitlementClient>(factory.entitlementClient())
  }

  @Test
  fun `enterprise edition`() {
    val license =
      AirbyteLicense(
        type = LicenseType.ENTERPRISE,
        stiggEntitlements = EXAMPLE_ENTITLEMENTS_JSON,
      )
    val factory =
      EntitlementClientFactory(
        airbyteConfig = AirbyteConfig(edition = Configs.AirbyteEdition.ENTERPRISE),
        airbyteStiggClientConfig = AirbyteStiggClientConfig(),
        activeLicense = ActiveAirbyteLicense("").also { it.license = license },
      )

    val org = OrganizationId(UUID.randomUUID())
    val client = factory.entitlementClient()
    // JETEMS-START: ENTERPRISE 分支被本地覆盖为 AllEntitledClient（见 EntitlementClientConfig）。
    // 恢复正规 license 校验时：改回 assertInstanceOf<StiggEnterpriseEntitlementClient>，
    // 并还原下方 getEntitlements/checkEntitlement 断言（feature-c 不被授权）。
    assertInstanceOf<AllEntitledClient>(client)

    client.checkEntitlement(org, FeatureEntitlement("feature-a")).assertEntitled()
    client.checkEntitlement(org, FeatureEntitlement("feature-b")).assertEntitled()
    client.checkEntitlement(org, FeatureEntitlement("feature-c")).assertEntitled()
    // JETEMS-END
  }

  // JETEMS-START: 上游原名 `enterprise edition with no entitlements in license falls back to
  // NoEntitlementClient`。本地覆盖下无论 license 内容如何，ENTERPRISE 一律创建 AllEntitledClient。
  // 恢复正规行为时：改回 assertInstanceOf<NoEntitlementClient>(client) 并还原方法名。
  @Test
  fun `enterprise edition with no entitlements in license uses jetems AllEntitledClient`() {
    val license = AirbyteLicense(LicenseType.ENTERPRISE)
    val factory =
      EntitlementClientFactory(
        airbyteConfig = AirbyteConfig(edition = Configs.AirbyteEdition.ENTERPRISE),
        airbyteStiggClientConfig = AirbyteStiggClientConfig(),
        activeLicense = ActiveAirbyteLicense("").also { it.license = license },
      )

    val client = factory.entitlementClient()
    assertInstanceOf<AllEntitledClient>(client)
  }

  // 上游原名 `enterprise edition with no active license falls back to
  // NoEntitlementClient`。同上，恢复时改回 NoEntitlementClient 断言并还原方法名。
  @Test
  fun `enterprise edition with no active license uses jetems AllEntitledClient`() {
    val factory =
      EntitlementClientFactory(
        airbyteConfig = AirbyteConfig(edition = Configs.AirbyteEdition.ENTERPRISE),
        airbyteStiggClientConfig = AirbyteStiggClientConfig(),
        activeLicense = null,
      )

    val client = factory.entitlementClient()
    assertInstanceOf<AllEntitledClient>(client)
  }
  // JETEMS-END

  @Test
  fun `cloud edition`() {
    assertThrows<MissingStiggApiKey> {
      EntitlementClientFactory(
        airbyteConfig = AirbyteConfig(edition = Configs.AirbyteEdition.CLOUD),
        airbyteStiggClientConfig = AirbyteStiggClientConfig(enabled = true),
      ).entitlementClient()
    }
    assertThrows<MissingStiggSidecarHost> {
      EntitlementClientFactory(
        airbyteConfig = AirbyteConfig(edition = Configs.AirbyteEdition.CLOUD),
        airbyteStiggClientConfig = AirbyteStiggClientConfig(enabled = true, apiKey = "foo"),
      ).entitlementClient()
    }
    assertThrows<MissingStiggSidecarPort> {
      EntitlementClientFactory(
        airbyteConfig = AirbyteConfig(edition = Configs.AirbyteEdition.CLOUD),
        airbyteStiggClientConfig = AirbyteStiggClientConfig(enabled = true, apiKey = "foo", sidecarHost = "foo", sidecarPort = 0),
      ).entitlementClient()
    }
    assertThrows<MissingStiggSidecarPort> {
      EntitlementClientFactory(
        airbyteConfig = AirbyteConfig(edition = Configs.AirbyteEdition.CLOUD),
        airbyteStiggClientConfig = AirbyteStiggClientConfig(enabled = true, apiKey = "foo", sidecarHost = "foo", sidecarPort = -1),
      ).entitlementClient()
    }
    assertThrows<MissingOrganizationService> {
      EntitlementClientFactory(
        airbyteConfig = AirbyteConfig(edition = Configs.AirbyteEdition.CLOUD),
        airbyteStiggClientConfig = AirbyteStiggClientConfig(enabled = true, apiKey = "foo", sidecarHost = "foo", sidecarPort = 10000),
      ).entitlementClient()
    }
    val orgService = mockk<OrganizationService>()

    // normal cloud client
    assertInstanceOf<StiggCloudEntitlementClient>(
      EntitlementClientFactory(
        airbyteConfig = AirbyteConfig(edition = Configs.AirbyteEdition.CLOUD),
        airbyteStiggClientConfig = AirbyteStiggClientConfig(enabled = true, apiKey = "foo", sidecarHost = "foo", sidecarPort = 10000),
        organizationService = orgService,
      ).entitlementClient(),
    )

    // stigg disabled in cloud
    assertInstanceOf<NoEntitlementClient>(
      EntitlementClientFactory(
        airbyteConfig = AirbyteConfig(edition = Configs.AirbyteEdition.CLOUD),
        airbyteStiggClientConfig = AirbyteStiggClientConfig(enabled = false),
        organizationService = orgService,
      ).entitlementClient(),
    )
  }
}

private val EXAMPLE_ENTITLEMENTS_JSON =
  """
{
    "entitlements": {
      "feature-a": { "type": "BOOLEAN" },
      "feature-b": { "type": "BOOLEAN" }
    }
}  
  """.trimIndent()

private fun EntitlementResult.assertEntitled() {
  assertEquals(true, this.isEntitled)
}

private fun EntitlementResult.assertNotEntitled() {
  assertEquals(false, this.isEntitled)
}
