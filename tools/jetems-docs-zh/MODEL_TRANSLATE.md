# 使用 AI 模型翻译（推荐）

Google 机译（`translate_batch.py --engine google`）适合冲量，**质量以对话内模型翻译为准**。

## 约定

1. 输出路径：`airbyte-commons-server/src/main/resources/docs-zh/integrations/{sources|destinations|enterprise-connectors}/<name>.md`
2. 与官方 path 对齐；保留：
   - 代码块、URL、环境变量、CLI 标志
   - `<!-- env:oss -->` / `<!-- env:cloud -->`
   - `<FieldAnchor>`、`<HideInUI>` 等标签
   - 图片路径 `/.gitbook/assets/...`
3. 文首可加简短说明（可选）：
   `> 本文档由 jetems 翻译自官方英文设置指南。`
4. Changelog 可压缩为一句「详见官方英文 Changelog」，避免超长表格。
5. 产品名保留英文：Airbyte、Postgres、Kafka、Asana 等。

## 续跑清单

```bash
# 未译列表（需网络）
comm -23 <(python3 tools/jetems-docs-zh/fetch_list.py --kind sources | sed 's|^|sources/|;s|\.md||' | sort) \
         <(ls airbyte-commons-server/src/main/resources/docs-zh/integrations/sources | sed 's|\.md||;s|^|sources/|' | sort)
```
