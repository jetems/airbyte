/*
 * Copyright (c) 2020-2026 Airbyte, Inc., all rights reserved.
 */

package io.airbyte.container.orchestrator

import ch.qos.logback.classic.Logger
import ch.qos.logback.classic.LoggerContext
import ch.qos.logback.classic.spi.ILoggingEvent
import ch.qos.logback.core.Appender
import com.fasterxml.jackson.core.JsonProcessingException
import io.airbyte.api.client.ApiException
import io.airbyte.commons.logging.logback.AirbyteFlexLogbackAppender
import io.airbyte.commons.logging.logback.CLOUD_OPERATIONS_JOB_LOGGER_NAME
import io.airbyte.commons.logging.logback.FLEX_OPERATIONS_JOB_LOGGER_NAME
import io.airbyte.commons.storage.GcsLogUploadTarget
import io.airbyte.commons.storage.LogUploadAuthorizationRefreshResult
import io.airbyte.micronaut.runtime.AirbyteContextConfig
import io.airbyte.persistence.job.models.ReplicationInput
import io.airbyte.workload.api.client.WorkloadApiClient
import io.airbyte.workload.api.domain.GcsDownscopedOAuthLogUploadAuthorization
import io.airbyte.workload.api.domain.LogDeliveryMode
import io.airbyte.workload.api.domain.LogUploadAuthorization
import io.github.oshai.kotlinlogging.KotlinLogging
import jakarta.inject.Inject
import jakarta.inject.Singleton
import org.slf4j.Logger.ROOT_LOGGER_NAME
import org.slf4j.LoggerFactory
import java.io.IOException

private val logger = KotlinLogging.logger {}

private const val FLEX_INITIALIZATION_FAILURE_MESSAGE =
  "Unable to initialize FLEX log delivery. Continuing with STANDARD operations-log delivery."

private enum class FailureStage(
  val label: String,
) {
  INITIAL_AUTHORIZATION("initial FLEX authorization"),
  FLEX_APPENDER_INSTALLATION("FLEX appender installation"),
  FLEX_RUNTIME_DELIVERY("FLEX runtime delivery"),
}

/** When the init-container selects FLEX delivery, changes only the remote operations-log appender; console and unrelated appenders remain active. */
@Singleton
class FlexLogAppenderInitializer internal constructor(
  private val replicationInput: ReplicationInput,
  private val contextConfig: AirbyteContextConfig,
  private val workloadApiClient: WorkloadApiClient,
  private val loggerContextProvider: () -> LoggerContext,
  private val appenderFactory:
    (GcsLogUploadTarget, () -> LogUploadAuthorizationRefreshResult, (String) -> Unit, () -> Unit) -> Appender<ILoggingEvent>,
  private val diagnostics: (String) -> Unit = { logger.warn { it } },
) {
  @Inject
  constructor(
    replicationInput: ReplicationInput,
    contextConfig: AirbyteContextConfig,
    workloadApiClient: WorkloadApiClient,
  ) : this(
    replicationInput = replicationInput,
    contextConfig = contextConfig,
    workloadApiClient = workloadApiClient,
    loggerContextProvider = { LoggerFactory.getILoggerFactory() as LoggerContext },
    appenderFactory = { target, refresh, onFailure, onStop ->
      AirbyteFlexLogbackAppender(target, refresh, onFailure, onStop)
    },
  )

  fun initialize() {
    if (readDeliveryMode() != LogDeliveryMode.FLEX) {
      return
    }

    var rootLogger: Logger? = null
    var standardAppender: Appender<ILoggingEvent>? = null
    var flexAppender: Appender<ILoggingEvent>? = null
    val topologyLock = Any()
    var installationCommitted = false
    var fallbackRestored = false

    fun restoreStandard(): Boolean =
      synchronized(topologyLock) {
        if (fallbackRestored) return false
        fallbackRestored = true
        val wasCommitted = installationCommitted
        flexAppender?.let { failedAppender ->
          try {
            rootLogger?.detachAppender(failedAppender)
          } catch (failure: Throwable) {
            handleCaughtFailure(failure)
          }
          if (failedAppender is AirbyteFlexLogbackAppender) {
            try {
              failedAppender.disableAfterFailure()
            } catch (failure: Throwable) {
              handleCaughtFailure(failure)
            }
          }
        }
        standardAppender?.let { fallbackAppender ->
          if (!fallbackAppender.isStarted) {
            try {
              fallbackAppender.start()
            } catch (failure: Throwable) {
              handleCaughtFailure(failure)
            }
          }
          try {
            if (fallbackAppender.isStarted) {
              if (rootLogger?.getAppender(CLOUD_OPERATIONS_JOB_LOGGER_NAME) !== fallbackAppender) {
                rootLogger?.addAppender(fallbackAppender)
              }
            } else {
              rootLogger?.detachAppender(fallbackAppender)
            }
          } catch (failure: Throwable) {
            handleCaughtFailure(failure)
          }
        }
        installationCommitted = false
        wasCommitted
      }

    val onDeliveryFailure: (String) -> Unit = {
      if (restoreStandard()) {
        reportFailure(FailureStage.FLEX_RUNTIME_DELIVERY)
      }
    }
    val onFlexStop: () -> Unit = {
      synchronized(topologyLock) {
        if (installationCommitted && !fallbackRestored) {
          standardAppender?.let { detachedStandard ->
            try {
              detachedStandard.stop()
            } catch (failure: Throwable) {
              handleCaughtFailure(failure)
              reportFailure(FailureStage.FLEX_RUNTIME_DELIVERY)
            }
          }
        }
      }
    }
    try {
      val loggerContext = loggerContextProvider()
      rootLogger = loggerContext.getLogger(ROOT_LOGGER_NAME)
      standardAppender = rootLogger.getAppender(CLOUD_OPERATIONS_JOB_LOGGER_NAME)

      val initialTarget =
        try {
          readInitialTarget()
        } catch (failure: Throwable) {
          handleCaughtFailure(failure)
          reportFailure(FailureStage.INITIAL_AUTHORIZATION)
          return
        } ?: return reportFailure(FailureStage.INITIAL_AUTHORIZATION)
      flexAppender = appenderFactory(initialTarget, { refreshAuthorization() }, onDeliveryFailure, onFlexStop)
      flexAppender.context = loggerContext
      flexAppender.name = FLEX_OPERATIONS_JOB_LOGGER_NAME
      flexAppender.start()
      check(flexAppender.isStarted)
      synchronized(topologyLock) {
        check(!fallbackRestored) { "FLEX log delivery failed during installation." }
        rootLogger.addAppender(flexAppender)
        standardAppender?.let(rootLogger::detachAppender)
        installationCommitted = true
      }
    } catch (failure: Throwable) {
      handleCaughtFailure(failure)
      restoreStandard()
      flexAppender?.let { failedAppender ->
        if (failedAppender.isStarted) {
          try {
            failedAppender.stop()
          } catch (cleanupFailure: Throwable) {
            handleCaughtFailure(cleanupFailure)
          }
        }
      }
      reportFailure(FailureStage.FLEX_APPENDER_INSTALLATION)
    }
  }

  private fun readDeliveryMode(): LogDeliveryMode =
    (replicationInput.additionalProperties["logDeliveryMode"] as? String)
      ?.let { inputMode -> LogDeliveryMode.entries.firstOrNull { it.name == inputMode } }
      ?: LogDeliveryMode.STANDARD

  private fun readInitialTarget(): GcsLogUploadTarget? =
    workloadApiClient
      .workloadLogUploadAuthorization(contextConfig.workloadId)
      ?.toSharedTarget()
      ?.takeIf { it.isValid() }

  private fun refreshAuthorization(): LogUploadAuthorizationRefreshResult =
    try {
      workloadApiClient
        .workloadLogUploadAuthorization(contextConfig.workloadId)
        ?.toSharedTarget()
        ?.takeIf { it.isValid() }
        ?.let(LogUploadAuthorizationRefreshResult::Refreshed)
        ?: LogUploadAuthorizationRefreshResult.TerminalFailure
    } catch (e: ApiException) {
      if (e.statusCode in 500..599) {
        LogUploadAuthorizationRefreshResult.RetryableFailure
      } else {
        LogUploadAuthorizationRefreshResult.TerminalFailure
      }
    } catch (_: JsonProcessingException) {
      LogUploadAuthorizationRefreshResult.TerminalFailure
    } catch (_: IOException) {
      LogUploadAuthorizationRefreshResult.RetryableFailure
    } catch (_: InterruptedException) {
      Thread.currentThread().interrupt()
      LogUploadAuthorizationRefreshResult.TerminalFailure
    } catch (_: Exception) {
      LogUploadAuthorizationRefreshResult.TerminalFailure
    }

  private fun LogUploadAuthorization.toSharedTarget(): GcsLogUploadTarget? =
    when (this) {
      is GcsDownscopedOAuthLogUploadAuthorization ->
        GcsLogUploadTarget(
          accessToken = accessToken,
          expiresAt = expiresAt,
          bucketName = bucketName,
          objectKeyPrefix = objectKeyPrefix,
        )
    }

  private fun reportFailure(stage: FailureStage) {
    try {
      diagnostics("$FLEX_INITIALIZATION_FAILURE_MESSAGE Failure stage: ${stage.label}.")
    } catch (failure: Throwable) {
      handleCaughtFailure(failure)
      // Diagnostics are best-effort and must not affect workload execution.
    }
  }

  private fun handleCaughtFailure(failure: Throwable) {
    if (failure is VirtualMachineError) throw failure
    if (failure is InterruptedException) Thread.currentThread().interrupt()
  }
}
