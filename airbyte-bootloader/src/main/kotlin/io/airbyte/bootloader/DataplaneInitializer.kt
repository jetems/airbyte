/*
 * Copyright (c) 2020-2026 Airbyte, Inc., all rights reserved.
 */

package io.airbyte.bootloader

import io.airbyte.commons.DEFAULT_ORGANIZATION_ID
import io.airbyte.config.Configs.AirbyteEdition
import io.airbyte.config.Dataplane
import io.airbyte.config.DataplaneClientCredentials
import io.airbyte.config.DataplaneGroup
import io.airbyte.data.services.DataplaneGroupService
import io.airbyte.data.services.DataplaneService
import io.airbyte.data.services.ServiceAccountsService
import io.airbyte.data.services.shared.DataplaneWithServiceAccount
import io.airbyte.micronaut.runtime.AirbyteAuthConfig
import io.airbyte.micronaut.runtime.AirbyteConfig
import io.airbyte.micronaut.runtime.AirbyteDataplaneGroupsConfig
import io.airbyte.micronaut.runtime.AirbyteWorkerConfig
import io.fabric8.kubernetes.client.KubernetesClient
import io.github.oshai.kotlinlogging.KotlinLogging
import jakarta.inject.Singleton
import java.util.UUID

private val log = KotlinLogging.logger {}

@Singleton
class DataplaneInitializer(
  private val dataplaneService: DataplaneService,
  private val groupService: DataplaneGroupService,
  private val serviceAccountsService: ServiceAccountsService,
  private val k8sClient: KubernetesClient,
  private val airbyteConfig: AirbyteConfig,
  private val airbyteAuthConfig: AirbyteAuthConfig,
  private val airbyteWorkerConfig: AirbyteWorkerConfig,
  private val airbyteDataplaneGroupsConfig: AirbyteDataplaneGroupsConfig,
) {
  /**
   * Bootstraps a default dataplane for an instance of Airbyte that does not have a valid dataplane.
   * This function will also create a default dataplane group if the configured default region does
   * not already exist as a dataplane group.
   * Note: if the instance already has valid dataplane credentials, this function does nothing.
   */
  fun createDataplaneIfNotExists() {
    // JETEMS-START: docker-compose 本地开发环境无 K8s，跳过 K8s secret 操作但保留数据库初始化
    // （见 JETEMS_DEV.md 第 2.1 条 —— 最小侵入式扩展；正常 K8s 环境行为不变）
    val k8sAvailable = k8sClient.namespace != null
    if (!k8sAvailable) {
      log.warn { "Kubernetes namespace not available — skipping K8s secret operations but still initializing dataplane DB records (non-K8s environment)." }
    }
    // 非 K8s 环境：跳过 K8s secret 的有效性检查（否则会因 namespace 为 null 抛异常）
    if (k8sAvailable && isValidServiceAccount()) {
      return
    }
    // JETEMS-END

    // Get or create the default dataplane group.
    val group = getOrCreateDefaultGroup()

    // Create the dataplane and store the secret.
    val dataplane = createDataplane(group)
    // JETEMS-START: 非 K8s 环境跳过 K8s secret 创建
    if (k8sAvailable) {
      createK8sSecret(dataplane)
    }
    // JETEMS-END

    // Cloud puts dataplane pods in the jobs namespace, so we need to copy the secret containing
    // the dataplane credentials to the jobs namespace.
    if (k8sAvailable && airbyteConfig.edition == AirbyteEdition.CLOUD &&
      airbyteWorkerConfig.job.kubernetes.namespace
        .isNotBlank()
    ) {
      log.info { "Copying secret ${airbyteAuthConfig.kubernetesSecret.name} to jobs namespace" }
      K8sSecretHelper.copySecretToNamespace(
        k8sClient,
        airbyteAuthConfig.kubernetesSecret.name,
        k8sClient.namespace,
        airbyteWorkerConfig.job.kubernetes.namespace,
      )
    }
  }

  private fun getOrCreateDefaultGroup(): DataplaneGroup {
    val defaultDataplaneGroupName = airbyteDataplaneGroupsConfig.defaultDataplaneGroupName
    groupService
      .listDataplaneGroups(listOf(DEFAULT_ORGANIZATION_ID), false)
      .find { it.name.equals(defaultDataplaneGroupName, ignoreCase = true) }
      ?.let { return it }

    log.info { "No default dataplane group found. Creating one with name $defaultDataplaneGroupName" }
    return groupService.writeDataplaneGroup(
      DataplaneGroup().apply {
        id = UUID.randomUUID()
        organizationId = DEFAULT_ORGANIZATION_ID
        name = defaultDataplaneGroupName
        enabled = true
        tombstone = false
      },
    )
  }

  private fun isValidServiceAccount(): Boolean {
    // Get the secret that stores the credentials.
    val secret = K8sSecretHelper.getAndDecodeSecret(k8sClient, airbyteAuthConfig.kubernetesSecret.name)

    // Check to see whether the secret contains credentials that match an existing service account.
    val clientId = secret?.get(airbyteAuthConfig.dataplaneCredentials.clientIdSecretKey)
    val clientSecret = secret?.get(airbyteAuthConfig.dataplaneCredentials.clientSecretSecretKey)

    if (clientId == null || clientSecret == null) {
      return false
    }

    try {
      serviceAccountsService.getAndVerify(UUID.fromString(clientId), clientSecret)
      return true
    } catch (_: Exception) {
      return false
    }
  }

  private fun createDataplane(group: DataplaneGroup): DataplaneWithServiceAccount {
    val dataplaneAndServiceAccount =
      dataplaneService.createDataplaneAndServiceAccount(
        dataplane =
          Dataplane().apply {
            id = UUID.randomUUID()
            dataplaneGroupId = group.id
            // Append the UUID to ensure names are unique.
            name = group.name + UUID.randomUUID()
            enabled = true
          },
        instanceScope = true,
      )
    log.info { "Successfully created dataplane ${dataplaneAndServiceAccount.dataplane.name} (${dataplaneAndServiceAccount.dataplane.id})" }

    return dataplaneAndServiceAccount
  }

  /**
   * Creates or updates a k8s secret [AirbyteBootloaderAuthConfiguration.AirbyteAuthKubernetesSecretConfiguration.name] with the [DataplaneClientCredentials].
   */
  private fun createK8sSecret(dataplaneWithServiceAccount: DataplaneWithServiceAccount) {
    val secretData =
      mapOf(
        airbyteAuthConfig.dataplaneCredentials.clientIdSecretKey to dataplaneWithServiceAccount.serviceAccount.id.toString(),
        airbyteAuthConfig.dataplaneCredentials.clientSecretSecretKey to dataplaneWithServiceAccount.serviceAccount.secret,
      )
    K8sSecretHelper.createOrUpdateSecret(k8sClient, airbyteAuthConfig.kubernetesSecret.name, secretData)
  }
}
