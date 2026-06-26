/*
 * Copyright (c) 2020-2026 Airbyte, Inc., all rights reserved.
 */

package io.airbyte.commons.entitlements

import io.airbyte.commons.entitlements.models.Entitlement
import io.airbyte.commons.entitlements.models.EntitlementResult
import io.airbyte.commons.entitlements.models.Entitlements
import io.airbyte.commons.entitlements.models.NumericEntitlementResult
import io.airbyte.domain.models.EntitlementPlan
import io.airbyte.domain.models.OrganizationId

/**
 * JETEMS（本地二开/评估专用）：无条件授予所有 entitlement。
 *
 * 与 [NoEntitlementClient] 相反——所有 checkEntitlement/数值/连接器查询一律返回"已授权"，
 * 不依赖 license 或 Stigg。用于本地解锁全部企业功能门禁。
 *
 * ⚠️ 绕过 license 属于 ELv2 禁止的商用行为，仅限本地非商用评估。
 */
internal class AllEntitledClient : EntitlementClient {
  private val reason = "AllEntitledClient grants all entitlements (JETEMS local override)"

  override fun checkEntitlement(
    organizationId: OrganizationId,
    entitlement: Entitlement,
  ): EntitlementResult =
    EntitlementResult(
      featureId = entitlement.featureId,
      isEntitled = true,
      reason = reason,
      featureName = entitlement.name,
    )

  override fun getNumericEntitlement(
    organizationId: OrganizationId,
    entitlement: Entitlement,
  ): NumericEntitlementResult =
    NumericEntitlementResult(
      featureId = entitlement.featureId,
      hasAccess = true,
      value = null,
      isUnlimited = true,
      reason = reason,
    )

  override fun getEntitlements(organizationId: OrganizationId): List<EntitlementResult> =
    Entitlements.all.map {
      EntitlementResult(featureId = it.featureId, isEntitled = true, reason = reason, featureName = it.name)
    }

  override fun getEntitlementsForPlan(plan: EntitlementPlan): List<Entitlement> = Entitlements.all

  override fun getPlans(organizationId: OrganizationId): List<EntitlementPlanResponse> = emptyList()

  override fun addOrganization(
    organizationId: OrganizationId,
    plan: EntitlementPlan,
  ) {}

  override fun updateOrganization(
    organizationId: OrganizationId,
    plan: EntitlementPlan,
  ) {}
}
