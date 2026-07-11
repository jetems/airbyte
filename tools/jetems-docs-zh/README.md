# jetems-docs-zh — 连接器中文设置指南语料

## 目标

为连接器「设置指南」提供静态中文 Markdown（`docs-zh/integrations/**`），
与官方英文路径对齐。运行时：`locale=zh` 优先读中文，缺失则回退英文。

## 翻译质量策略（推荐）

| 方式 | 适用 | 说明 |
|------|------|------|
| **`model_translate_all.py` / 对话内模型**（推荐） | 准确度优先 | 结构化中文设置指南，`manifest.engine=model` |
| `translate_batch.py --engine google` | 不推荐 | 机译快但不稳 |
| `translate_batch.py --engine openai` | 有 API Key 时 | 可选 |

全量补齐（仅处理尚无中文稿的连接器）：

```bash
python3 tools/jetems-docs-zh/model_translate_all.py
```

约定详见 [MODEL_TRANSLATE.md](./MODEL_TRANSLATE.md)。

**状态（仓库）**：`docs-zh` 已覆盖官方 integrations 目录 **705** 篇（sources + destinations + enterprise，排除 migrations），均为 `engine=model`。

## 目录约定

```
airbyte-commons-server/src/main/resources/docs-zh/
  integrations/
    sources/<name>.md
    destinations/<name>.md
    enterprise-connectors/<name>.md
  manifest.json          # 可选：path / en_sha / translated_at
```

对应英文源：

`https://raw.githubusercontent.com/airbytehq/airbyte/master/docs/integrations/...`

## 批量拉取英文清单

```bash
# 需要网络；列出 sources 下全部 md 文件名
python3 tools/jetems-docs-zh/fetch_list.py --kind sources
```

## 翻译注意

- 保留代码块、URL、环境变量名、命令
- 保留 `<!-- env:oss -->` / `<!-- env:cloud -->` 标记
- 保留 `<FieldAnchor field="...">` 等 HTML（前端字段聚焦依赖）
- 保留图片相对路径（`/.gitbook/assets/...`）

## Phase 2 脚本

- `top_connectors.yaml` — Top 源/目标清单（Phase 2a）
- `fetch_list.py` — 从 GitHub API 列出文档
- `sync_one.py` — 下载单篇英文（人工/机译后写入 docs-zh）
- `translate_batch.py` — **批量 EN→ZH**（默认 Google/`deep-translator`；可选 OpenAI 兼容 API）

```bash
# Top 清单（可断点续跑，按 en_sha 跳过未变文件）
python3 tools/jetems-docs-zh/translate_batch.py --top

# 全量机译（仅作冲量/兜底；质量优先请用对话内模型翻译，见 MODEL_TRANSLATE.md）
# nohup python3 -u tools/jetems-docs-zh/translate_batch.py --all \
#   > /tmp/jetems-docs-zh-all.log 2>&1 &

# 只译一篇
python3 tools/jetems-docs-zh/translate_batch.py --path sources/postgres --force

# 使用 OpenAI 兼容接口（OPENAI_API_KEY 或 XAI_API_KEY）
JETEMS_DOCS_MODEL=gpt-4o-mini python3 tools/jetems-docs-zh/translate_batch.py --all --engine openai
```

进度查看：

```bash
tail -f /tmp/jetems-docs-zh-all.log
# 已生成篇数
find airbyte-commons-server/src/main/resources/docs-zh/integrations -name '*.md' | wc -l
```

## 配置

可选环境 / Micronaut 配置，覆盖 classpath：

```yaml
airbyte:
  jetems:
    docs-zh-path: /path/to/docs-zh   # 内含 integrations/ 子目录
```
