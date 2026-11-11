# Bayesian Clinical Trials: encyclopedia and knowledge graph

A static website on top of the book "Bayesian Clinical Trials and Personalized Medicine, Volume I: Bayesian Clinical Trials" (Sokolova, Sokolov and Polson, 2026; HTML edition https://vsokolov.org/bayesian_clinical_trials_v1/, DOI https://doi.org/10.5281/zenodo.24122875). It has one short page per concept, method, design, trial, regulation and principle, linked by prerequisites, with section-level pointers into the book, equations, R functions of the bayestrials package, links to the companion lab (https://nytel.ai/testing/), a graph view, study paths, and an optional LLM tutor.

## Layout

- `SCHEMA.md`: entity file format (YAML frontmatter plus Markdown body).
- `entities/*.md`: the entity pages (written by other agents).
- `build/skeleton.json`: the extracted book (chapters, sections, equations, functions, results, lab modules). Made by `tools/extract.py`.
- `build/vocab.json`: planned entity ids; ids without a page become stub nodes.
- `build/fixtures/`: six sample entities from chapters 6 and 15 for development.
- `tools/build_site.py`: turns the entities and the skeleton into the site data.
- `tools/build_index.py`: builds the search index (chunks and embeddings) in `docs/encyclopedia/data/index/`.
- `site/`: the static site (`index.html`, `app.js`, `render.js`, `search.js`, `ask.js`, `llm.js`, `tutor.js`, `style.css`, `data/`, `vendor/`, `llms.txt`).
- `vendor/socratic-tutor/`: the vendored tutoring skill (see Attribution).

## Rebuild

```
python3 tools/extract.py                  # book -> build/skeleton.json (needs the book sources)
python3 tools/build_site.py               # entities/ -> site/data/kg.json, graph.json, site/llms.txt
python3 tools/build_site.py --entities build/fixtures   # development data from the fixtures
```

Needs Python 3 and PyYAML. Unknown entity ids, section keys, equation ids, functions, results and lab ids are reported as warnings on stderr and in `build/site_warnings.txt`; the build does not fail.

## Serve locally

```
cd site && python3 -m http.server 8000
```

Open http://localhost:8000/. The site needs HTTP (it fetches `data/kg.json`), so opening `index.html` as a file will not work. For GitHub Pages, publish the `site/` folder. There is no browser build step. Libraries load from jsDelivr and esm.sh at pinned versions: KaTeX 0.19.1 (with auto-render), marked 18.2.0, DOMPurify 3.4.17, cytoscape 3.35.0, @anthropic-ai/sdk 1.8.0.

## Data files

- `site/data/kg.json`: book metadata, parts and chapters (summary, key terms, section list), a section map (key to number, title, URL), catalogued results, lab modules, and all entities. Each entity has the frontmatter fields, the Markdown body, resolved section chips, reverse edges (`needed_for`, `related_in`), equations with TeX, function titles, usage and descriptions, results and lab modules. Entities without a page are included with `stub: true`.
- `site/data/graph.json`: plain `nodes` and `edges`. Edge kind `prerequisite` runs from the prerequisite to the dependent; kind `related` carries a `rel` label.
- `site/llms.txt`: what the site is, how to cite the book, where the data files are.

## Routes

`#/` home, `#/search?q=` search and smart search (`#/ask` redirects here), `#/e/<id>` entity, `#/c/<n>` chapter, `#/graph` (optional `?focus=<id>`), `#/path/<id>` study path, `#/type/<type>` entries by type.

## The tutor

Open it from any written entity page with "Study with a tutor" (the drawer also has an "Ask" tab for questions about the current page).

- Socratic tutor: the skill map is the target entity plus its closest prerequisites (up to 10 by depth). Levels 0 to 5 are saved per entity in localStorage (`kg.level.<id>`). The system prompt holds the adapted skill text, the full pages of the subskill entities and a table that maps section keys to book URLs. The model is told to teach only from those pages, cite sections as links, use the "Check yourself" questions and lab modules as exercises, ask one question at a time, and report a level change on its own line as `LEVEL entity-id N`, which the interface reads and hides.
- Ask about this page: grounded Q&A over the current entity and its neighbors.
- Model: always Claude Haiku 5.5 through the site's proxy (readers do not enter keys); adaptive thinking, effort low.
- API key (optional): without one, calls go through the site's proxy. With one, calls go from the browser directly to Anthropic with the official `@anthropic-ai/sdk` and `dangerouslyAllowBrowser: true`. The key is kept in memory and is written to localStorage only if the reader ticks "Remember my key in this browser". It never goes to this site or the proxy. Readers should use a key with a spend limit.
- "Copy tutor prompt" copies the full system prompt and a first message, to paste into claude.ai without a key. "Save state" and "Resume" store the conversation and levels in localStorage.
- Conversations are kept in memory per entity and mode; they are lost on reload unless saved.

## Tests

Playwright checks used during development live outside the repo in `/tmp/pwtest/kg_site.js` (pages, math, chips, widths 1300 and 450) and `/tmp/pwtest/kg_tutor.js` (the tutor with a mocked SDK; no real API call).

## Attribution

The tutoring method is adapted from the socratic-tutor skill in Jane Street's agent_skills (MIT license): https://github.com/janestreet/agent_skills. The original text and license are in `vendor/socratic-tutor/` and are copied to `site/vendor/socratic-tutor/` at build time; the site loads the skill file at run time and replaces its guard and session-start sections with site-specific instructions.

## Search and smart search

Everything runs in the browser except the optional Claude call. One search page, `#/search?q=`, reached from the search box in the header or on the home page. (`#/ask` redirects to it; there is no chat.)

Rebuild the index after `entities/` or `build/skeleton.json` change:

```
python3 tools/build_index.py
```

It needs PyYAML, numpy and sentence-transformers (model `BAAI/bge-small-en-v1.5`, cached in `~/.cache/huggingface`). It writes `docs/encyclopedia/data/index/`: `chunks.json` (with a context line and aliases per chunk; entity pages, one chunk each or split at `## ` headings above 300 words; book sections in windows of about 225 words with 40 words of overlap), `emb.bin` (one float32 scale per chunk, then int8 vectors of 384 dimensions) and `meta.json`. The files are about 4.0 MB (about 1.5 MB gzipped on GitHub Pages).

Free results are hybrid: BM25 over the chunks runs at once; the query is embedded in the browser by transformers.js 4.3.2 (`Xenova/bge-small-en-v1.5`, quantized, with the bge query prefix and CLS pooling, both read from `meta.json`, loaded from jsDelivr and Hugging Face on the first search, about 25 MB, then cached by the browser) and compared with the stored vectors. The two rankings are fused by min-max normalized scores (weights in `meta.json`, see Search quality), entity pages get a boost, and results are deduplicated by page or section. If the model cannot load, BM25 results are shown alone. Browser-model and Python query embeddings agree (cosine 0.995 to 0.998 on ten test queries; the browser model is the quantized one).

Smart search (`ask.js`) finds content in the book; it does not write answers. It runs by itself when the query looks like a question (ends with "?" or starts with how, what, when, why, which, is, are, can, should, does, do), or when the reader presses the quiet "Smart search" button. It is one single-turn Claude call, with no threads:

- The top 20 retrieved chunks go in the user message as a compact numbered list (title, section number, kind, about 60 words of snippet, capped at about 1,800 tokens), followed by the question.
- The system prompt is stable and cached (`cache_control` ephemeral): role (a librarian for this book, never answers from outside knowledge), rules, and a compact map of the book built from `kg.json`. It is about 3,400 tokens.
- The reply is structured JSON (`output_config.format`, json_schema): `pointer` (one or two sentences saying where the book answers) and up to 6 `results` (`n`, `why` of at most 15 words), best first. The page shows the pointer, then the ranked passages (entity page, or book section with its "§15.2.2" number), then the free results under a divider. The number `n` is checked against the list, so a made-up passage cannot appear.
- If the call fails, the free results stay and one short notice is shown. A proxy 429 (rate limit or daily budget) is shown as the proxy wrote it. Results are cached in memory per question, so going back does not pay twice.
- Usage is one tiny grey line under the passages (tokens and approximate cost).

## The proxy for visitors

Visitors need no key and cannot enter one: `llm.js` always creates the SDK client with `baseURL` set to the proxy, model `claude-haiku-5-5`.

SDK 1.8.0 sends its key as `Authorization: Bearer`, which the Worker's CORS rules do not allow, so `llm.js` removes that header and sends the placeholder as `x-api-key` (which the Worker allows).

Cost (cache reads at 10% and cache writes at 125% of the input price): Haiku 5.5 is $0.10 per million input tokens and $0.50 per million output, Sonnet 5.5 $2 and $10, Opus 5.5 $4 and $20. A Haiku smart search sends about 6,000 input tokens (about 3,400 of them the cached system prompt) and gets about 300 back: about $0.0009 on the first call after the cache expires and about $0.0005 when the system prompt is read from the cache. In the Worker's budget terms that is about 3,000 smart searches per $3 of daily cap.

"Copy tutor prompt" in the tutor drawer builds the full prompt for claude.ai and needs no key.

## Search quality

The free search is measured on a fixed test set, `build/search_eval.json` (60 queries, made by `python3 tools/make_search_eval.py` from the entities and the skeleton, no randomness). Groups: 20 "Check yourself" questions from entity bodies (target: that entity), 15 aliases and abbreviations such as PPoS, CRM, MAP prior (target: the entity), 15 hand-written paraphrases of entity summaries (target: the entity or its home section), 10 sentences from the middle of book sections (target: the section). A query counts as answered when a result of the right entity or section appears; results are deduplicated per page or section as on the search page. Each query has a `half` flag (by hash); weights were tuned on half 0 (25 queries) and are reported on half 1 (35 queries) as well as on all 60.

`tools/eval_search.mjs` runs the same ranking code as the site (`docs/encyclopedia/rank.js`, imported by `search.js`) over the index files, with query vectors from `@huggingface/transformers` in Node (the same quantized ONNX model as the browser). Rerun:

```
mkdir -p /tmp/st-eval && cd /tmp/st-eval && npm init -y && npm install @huggingface/transformers@4.3.2   # once, outside the repo
node tools/eval_search.mjs --groups --misses          # the index in docs/encyclopedia/data/index
node tools/eval_search.mjs --index DIR --cfg '{"wSem":0.5}' --half 1   # another index or other weights
```

Hybrid results on all 60 queries, one change at a time (R@1 / R@5 / MRR):

| Setup | Hybrid | BM25 alone | Semantic alone |
|---|---|---|---|
| Before: MiniLM, plain chunks, RRF | 0.533 / 0.733 / 0.632 | 0.617 / 0.867 / 0.724 | 0.267 / 0.467 / 0.374 |
| + context line in the embedded text | 0.567 / 0.783 / 0.663 | same | 0.267 / 0.533 / 0.396 |
| + alias field weight 2, abbreviation expansion | 0.583 / 0.783 / 0.672 | 0.650 / 0.883 / 0.753 | same |
| bge-small-en-v1.5 instead of MiniLM (RRF) | 0.617 / 0.783 / 0.697 | same | 0.433 / 0.600 / 0.507 |
| + min-max score fusion, semantic weight 0.3, entity boost 1.5, alias weight 3 (final) | 0.800 / 0.933 / 0.854 | 0.667 / 0.883 / 0.767 | same |

Final setup by half: half 0 (tuning) 0.480 / 0.640 / 0.577 before and 0.680 / 0.840 / 0.742 after; half 1 (held out) 0.571 / 0.800 / 0.672 before and 0.886 / 1.000 / 0.934 after. By group, hybrid R@5 / MRR before and after: Check yourself 0.800 / 0.769 and 1.000 / 1.000, aliases 1.000 / 0.839 and 1.000 / 1.000, paraphrases 0.400 / 0.382 and 0.733 / 0.570, book sections 0.700 / 0.424 and 1.000 / 0.770. The Check yourself and section queries are quoted from the indexed text, so they are near the ceiling; the paraphrases are the honest measure of how well the search finds things in other words.

Tried and not kept: the context line as a BM25 field (BM25 R@5 0.867 to 0.850); expanding every alias, not only abbreviations (hybrid MRR 0.672 to 0.652); e5-small-v2 (hybrid 0.800 / 0.917 / 0.847 with the final weights, below bge); doc2query with three generated questions per chunk from claude-haiku-5-5, as a BM25 field and also embedded (hybrid 0.750 / 0.933 / 0.831 and 0.733 / 0.933 / 0.820, below 0.800 / 0.933 / 0.854; the questions are kept in `build/doc2query.json` and `python3 tools/build_index.py --dq` uses them; `tools/doc2query.py` made them for about 0.4 USD). With a 60-query set one query moves R@5 by 0.017, so differences of one or two queries are not evidence.

The ranking parameters live in `meta.json` under `search` (written by `build_index.py`, defaults in `rank.js`), so they can be changed without touching the browser code.
