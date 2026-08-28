/*
 * Copyright (c) 2020-2026 Airbyte, Inc., all rights reserved.
 */

package io.airbyte.commons.entitlements

import io.airbyte.commons.entitlements.models.EntitlementResult
import io.airbyte.commons.entitlements.models.FeatureEntitlement
import io.airbyte.commons.entitlements.models.MappersEntitlement
import io.airbyte.commons.entitlements.models.SsoEntitlement
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
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertInstanceOf
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.io.TempDir
import java.nio.file.Path
import java.util.UUID
import kotlin.io.path.writeText

class EntitlementClientFactoryTest {
  private val org = OrganizationId(UUID.randomUUID())

  @Test
  fun `community edition denies all entitlements even when an entitlements file is set`(
    @TempDir tempDir: Path,
  ) {
    val file = writeEntitlementsFile(tempDir, mapOf(MappersEntitlement.featureId to true))
    val factory =
      EntitlementClientFactory(
        airbyteConfig = AirbyteConfig(edition = Configs.AirbyteEdition.COMMUNITY),
        airbyteStiggClientConfig = AirbyteStiggClientConfig(entitlementsFile = file.toString()),
        activeLicense = null,
      )

    val client = factory.entitlementClient()
    assertInstanceOf<StaticEntitlementClient>(client)
    assertFalse(client.checkEntitlement(org, MappersEntitlement).isEntitled)
    assertEquals(emptyList<EntitlementResult>(), client.getEntitlements(org))
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

  // JETEMS-START: 上游断言 license 缺失时回退 StaticEntitlementClient 且全部拒绝。
  // 本地覆盖下无论 license 内容如何，ENTERPRISE 一律创建 AllEntitledClient。
  // 恢复正规行为时：还原上游方法名，断言改回
  //   assertInstanceOf<StaticEntitlementClient>(client)
  //   assertFalse(client.checkEntitlement(org, MappersEntitlement).isEntitled)
  //   assertEquals(emptyList<EntitlementResult>(), client.getEntitlements(org))
  @Test
  fun `enterprise edition with no entitlements in license grants all via jetems AllEntitledClient`(
    @TempDir tempDir: Path,
  ) {
    val file = writeEntitlementsFile(tempDir, mapOf(MappersEntitlement.featureId to true))
    val license = AirbyteLicense(LicenseType.ENTERPRISE)
    val factory =
      EntitlementClientFactory(
        airbyteConfig = AirbyteConfig(edition = Configs.AirbyteEdition.ENTERPRISE),
        airbyteStiggClientConfig = AirbyteStiggClientConfig(entitlementsFile = file.toString()),
        activeLicense = ActiveAirbyteLicense("").also { it.license = license },
      )

    val client = factory.entitlementClient()
    assertInstanceOf<AllEntitledClient>(client)
    assertTrue(client.checkEntitlement(org, MappersEntitlement).isEntitled)
  }

  // 上游断言无 license 时回退 StaticEntitlementClient 且全部拒绝；同上，
  // 恢复时还原上游方法名与 StaticEntitlementClient 断言。
  @Test
  fun `enterprise edition with no active license grants all via jetems AllEntitledClient`(
    @TempDir tempDir: Path,
  ) {
    val file = writeEntitlementsFile(tempDir, mapOf(MappersEntitlement.featureId to true))
    val factory =
      EntitlementClientFactory(
        airbyteConfig = AirbyteConfig(edition = Configs.AirbyteEdition.ENTERPRISE),
        airbyteStiggClientConfig = AirbyteStiggClientConfig(entitlementsFile = file.toString()),
        activeLicense = null,
      )

    val client = factory.entitlementClient()
    assertInstanceOf<AllEntitledClient>(client)
    assertTrue(client.checkEntitlement(org, MappersEntitlement).isEntitled)
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
  }

  @Test
  fun `cloud edition with stigg disabled and no entitlements file denies all entitlements`() {
    val client =
      cloudClientWithStiggDisabled(AirbyteStiggClientConfig(enabled = false))

    assertInstanceOf<StaticEntitlementClient>(client)
    assertFalse(client.checkEntitlement(org, MappersEntitlement).isEntitled)
    assertEquals(emptyList<EntitlementResult>(), client.getEntitlements(org))
  }

  @Test
  fun `cloud edition with stigg disabled grants ids from the entitlements file`(
    @TempDir tempDir: Path,
  ) {
    val file = writeEntitlementsFile(tempDir, mapOf(MappersEntitlement.featureId to true))
    val client =
      cloudClientWithStiggDisabled(AirbyteStiggClientConfig(enabled = false, entitlementsFile = file.toString()))

    assertTrue(client.checkEntitlement(org, MappersEntitlement).isEntitled)
    assertFalse(client.checkEntitlement(org, SsoEntitlement).isEntitled)
  }

  @Test
  fun `cloud edition with stigg disabled and a missing entitlements file denies all entitlements`(
    @TempDir tempDir: Path,
  ) {
    val missing = tempDir.resolve("does-not-exist.yml")
    val client =
      cloudClientWithStiggDisabled(AirbyteStiggClientConfig(enabled = false, entitlementsFile = missing.toString()))

    assertFalse(client.checkEntitlement(org, MappersEntitlement).isEntitled)
    assertEquals(emptyList<EntitlementResult>(), client.getEntitlements(org))
  }

  @Test
  fun `cloud edition with stigg disabled and an empty entitlements file denies all entitlements`(
    @TempDir tempDir: Path,
  ) {
    val empty = tempDir.resolve("entitlements.yml")
    empty.writeText("")
    val client =
      cloudClientWithStiggDisabled(AirbyteStiggClientConfig(enabled = false, entitlementsFile = empty.toString()))

    assertFalse(client.checkEntitlement(org, MappersEntitlement).isEntitled)
    assertEquals(emptyList<EntitlementResult>(), client.getEntitlements(org))
  }

  @Test
  fun `cloud edition with stigg disabled skips unknown ids and honors false entries`(
    @TempDir tempDir: Path,
  ) {
    val file =
      writeEntitlementsFile(
        tempDir,
        mapOf(
          MappersEntitlement.featureId to true,
          "feature-does-not-exist" to true,
          SsoEntitlement.featureId to false,
        ),
      )
    val client =
      cloudClientWithStiggDisabled(AirbyteStiggClientConfig(enabled = false, entitlementsFile = file.toString()))

    assertTrue(client.checkEntitlement(org, MappersEntitlement).isEntitled)
    assertFalse(client.checkEntitlement(org, SsoEntitlement).isEntitled)
    assertFalse(client.checkEntitlement(org, FeatureEntitlement("feature-does-not-exist")).isEntitled)
  }

  private fun cloudClientWithStiggDisabled(config: AirbyteStiggClientConfig): EntitlementClient =
    EntitlementClientFactory(
      airbyteConfig = AirbyteConfig(edition = Configs.AirbyteEdition.CLOUD),
      airbyteStiggClientConfig = config,
      organizationService = mockk<OrganizationService>(),
    ).entitlementClient()

  private fun writeEntitlementsFile(
    dir: Path,
    entries: Map<String, Boolean>,
  ): Path {
    val file = dir.resolve("entitlements.yml")
    file.writeText(
      buildString {
        appendLine("entitlements:")
        entries.forEach { (id, granted) -> appendLine("  $id: $granted") }
      },
    )
    return file
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
