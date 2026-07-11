/*
 * Copyright (c) 2020-2026 Airbyte, Inc., all rights reserved.
 * JETEMS: static Chinese connector setup guides (docs-zh/).
 */

package io.airbyte.jetems.docs

import io.airbyte.config.specs.RemoteDefinitionsProvider
import io.github.oshai.kotlinlogging.KotlinLogging
import io.micronaut.context.annotation.Value
import jakarta.inject.Singleton
import java.nio.charset.StandardCharsets
import java.nio.file.Files
import java.nio.file.Path
import java.util.Optional

private val log = KotlinLogging.logger {}

/**
 * Resolves jetems Chinese connector documentation markdown.
 *
 * Lookup order for a given docs.airbyte.com path (e.g. sources/airtable):
 * 1. Optional filesystem root [docsZhPath] / integrations / {path}.md
 * 2. Classpath resource docs-zh/integrations/{path}.md
 */
@Singleton
class JetemsConnectorDocumentationStore(
  @Value("\${airbyte.jetems.docs-zh-path:}") private val docsZhPath: String,
) {
  /**
   * @param documentationUrl e.g. https://docs.airbyte.com/integrations/sources/airtable
   * @return Chinese markdown if present
   */
  fun findChineseDoc(documentationUrl: String?): Optional<String> {
    if (documentationUrl.isNullOrBlank()) {
      return Optional.empty()
    }

    val relativePath = RemoteDefinitionsProvider.extractPathFromDocumentationUrl(documentationUrl)
    if (relativePath == null) {
      log.debug { "Jetems zh docs: cannot extract path from $documentationUrl" }
      return Optional.empty()
    }

    val resourceRelative = "docs-zh/integrations/$relativePath.md"

    // 1) External directory override (for hot-reload / large corpora not in the jar)
    if (docsZhPath.isNotBlank()) {
      val file = Path.of(docsZhPath).resolve("integrations").resolve("$relativePath.md")
      if (Files.isRegularFile(file)) {
        return try {
          Optional.of(Files.readString(file, StandardCharsets.UTF_8))
        } catch (e: Exception) {
          log.warn(e) { "Failed reading jetems zh doc from $file" }
          Optional.empty()
        }
      }
    }

    // 2) Classpath (packaged under resources/docs-zh/...)
    val stream =
      javaClass.classLoader.getResourceAsStream(resourceRelative)
        ?: javaClass.getResourceAsStream("/$resourceRelative")
    if (stream != null) {
      return try {
        stream.use { Optional.of(it.readBytes().toString(StandardCharsets.UTF_8)) }
      } catch (e: Exception) {
        log.warn(e) { "Failed reading jetems zh doc classpath $resourceRelative" }
        Optional.empty()
      }
    }

    log.debug { "Jetems zh docs: miss for $resourceRelative" }
    return Optional.empty()
  }

  fun isChineseLocale(locale: String?): Boolean {
    if (locale.isNullOrBlank()) return false
    return locale.trim().lowercase().startsWith("zh")
  }
}
