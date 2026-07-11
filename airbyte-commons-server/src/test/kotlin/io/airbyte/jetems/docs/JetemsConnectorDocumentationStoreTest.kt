/*
 * Copyright (c) 2020-2026 Airbyte, Inc., all rights reserved.
 */

package io.airbyte.jetems.docs

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test

internal class JetemsConnectorDocumentationStoreTest {
  private val store = JetemsConnectorDocumentationStore(docsZhPath = "")

  @Test
  fun `isChineseLocale accepts zh variants`() {
    assertTrue(store.isChineseLocale("zh"))
    assertTrue(store.isChineseLocale("zh-CN"))
    assertTrue(store.isChineseLocale("ZH-TW"))
    assertFalse(store.isChineseLocale("en"))
    assertFalse(store.isChineseLocale(null))
    assertFalse(store.isChineseLocale(""))
  }

  @Test
  fun `findChineseDoc loads airtable sample from classpath`() {
    val doc =
      store.findChineseDoc("https://docs.airbyte.com/integrations/sources/airtable")
    assertTrue(doc.isPresent)
    assertTrue(doc.get().contains("前提条件") || doc.get().contains("设置指南"))
  }

  @Test
  fun `findChineseDoc returns empty for unknown connector`() {
    val doc =
      store.findChineseDoc("https://docs.airbyte.com/integrations/sources/this-connector-does-not-exist-xyz")
    assertTrue(doc.isEmpty)
  }

  @Test
  fun `findChineseDoc returns empty for non-docs url`() {
    assertTrue(store.findChineseDoc("https://example.com/foo").isEmpty)
    assertEquals(true, store.findChineseDoc(null).isEmpty)
  }
}
