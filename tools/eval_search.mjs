#!/usr/bin/env node
// Evaluate the encyclopedia search on build/search_eval.json with the same ranking code as the site
// (docs/encyclopedia/rank.js). Reports recall@1, recall@5 and MRR for BM25 alone, semantic alone and hybrid.
//
// Query embeddings come from @huggingface/transformers in Node (the same ONNX model as the browser).
// One-time setup, outside the repo:  mkdir -p /tmp/st-eval && cd /tmp/st-eval && npm init -y && npm install @huggingface/transformers@4.3.2
//
// Usage: node tools/eval_search.mjs [--index DIR] [--cfg '{"wAlias":2}'] [--half 0|1|all] [--groups] [--misses] [--sweep FILE]
//   --index   index directory (default docs/encyclopedia/data/index)
//   --cfg     JSON overrides of the ranking parameters (on top of rank.js DEFAULTS and meta.json "search")
//   --half    evaluate only the tuning half (0), the report half (1) or all queries (default all)
//   --groups  also print the metrics per query group (q, alias, para, sec)
//   --misses  list hybrid queries whose target is not in the top 5
//   --sweep   JSON file with a list of cfg objects; prints one line of hybrid and BM25 metrics for each
//   --show    comma-free list of queries separated by '||': print the top 5 hybrid results for each (used to compare with the browser)
//   --json    print the metrics as JSON
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { DEFAULTS, buildIndex, parseEmb, bm25Scores, semanticScores, hybridRank, dedupe } from '../docs/encyclopedia/rank.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i < 0 ? d : (process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : true); };
const INDEX = path.resolve(arg('index', path.join(ROOT, 'docs/encyclopedia/data/index')));
const ST = process.env.ST_EVAL || '/tmp/st-eval';

const chunks = JSON.parse(fs.readFileSync(path.join(INDEX, 'chunks.json'), 'utf8'));
const meta = JSON.parse(fs.readFileSync(path.join(INDEX, 'meta.json'), 'utf8'));
const set = JSON.parse(fs.readFileSync(path.join(ROOT, 'build/search_eval.json'), 'utf8')).queries;
const half = arg('half', 'all');
const queries = set.filter((q) => half === 'all' || q.half === Number(half));
const bin = fs.readFileSync(path.join(INDEX, 'emb.bin'));
const emb = parseEmb(bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength), meta);

// query vectors, cached per model, prefix and pooling
async function queryVectors(qs) {
  const key = (meta.browser_model + '|' + (meta.query_prefix || '') + '|' + (meta.pooling || 'mean')).replace(/[^A-Za-z0-9]+/g, '_').slice(0, 120);
  const file = path.join(ST, `qcache-${key}.json`);
  const cache = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
  const need = qs.filter((q) => !cache[q]);
  if (need.length) {
    const { pipeline, env } = await import(pathToFileURL(path.join(ST, 'node_modules/@huggingface/transformers/dist/transformers.node.mjs')).href);
    env.cacheDir = path.join(ST, 'hf-cache');
    const ex = await pipeline('feature-extraction', meta.browser_model, { dtype: meta.dtype || 'q8' });
    for (const q of need) {
      const out = await ex((meta.query_prefix || '') + q, { pooling: meta.pooling || 'mean', normalize: true });
      cache[q] = Array.from(out.data);
    }
    fs.writeFileSync(file, JSON.stringify(cache));
  }
  return Object.fromEntries(qs.map((q) => [q, Float32Array.from(cache[q])]));
}
const showQs = arg('show', null) ? String(arg('show')).split('||') : [];
const QV = await queryVectors(queries.map((q) => q.query).concat(showQs));

const isHit = (q, c) => (c.kind === 'entity' ? q.entities.includes(c.ref) : q.sections.includes(c.ref));
const rankOf = (q, res) => { const i = res.findIndex((r) => isHit(q, r.chunk)); return i < 0 ? Infinity : i + 1; };

function runAll(cfg) {
  const idx = buildIndex(chunks, cfg);
  const per = queries.map((q) => {
    const bS = bm25Scores(idx, q.query, cfg.pool, cfg);
    const sS = semanticScores(emb, QV[q.query], cfg.pool);
    const b = bS.map((x) => x[0]), s = sS.map((x) => x[0]);
    const view = () => dedupe(chunks, hybridRank(chunks, bS, sS, cfg), 50);
    // single lists: no entity boost (rank order only)
    const single = (ids) => dedupe(chunks, ids.map((i, r) => [i, -r]), 50);
    return {
      q,
      bm25: rankOf(q, single(b)),
      sem: rankOf(q, single(s)),
      hybrid: rankOf(q, view()),
      top: view().slice(0, 3).map((r) => r.chunk.kind[0] + ':' + r.chunk.ref),
    };
  });
  return per;
}
const metric = (ranks) => ({
  n: ranks.length,
  r1: ranks.filter((r) => r <= 1).length / ranks.length,
  r5: ranks.filter((r) => r <= 5).length / ranks.length,
  mrr: ranks.reduce((a, r) => a + (r === Infinity ? 0 : 1 / r), 0) / ranks.length,
});
const summarize = (per) => Object.fromEntries(['bm25', 'sem', 'hybrid'].map((m) => [m, metric(per.map((p) => p[m]))]));
const f = (x) => x.toFixed(3);
const line = (m) => `R@1 ${f(m.r1)}  R@5 ${f(m.r5)}  MRR ${f(m.mrr)}`;

const cfg0 = { ...DEFAULTS, ...(meta.search || {}) };
const over = arg('cfg', null);
if (showQs.length) {
  const idx = buildIndex(chunks, cfg0);
  for (const q of showQs) {
    const res = dedupe(chunks, hybridRank(chunks, bm25Scores(idx, q, cfg0.pool, cfg0), semanticScores(emb, QV[q], cfg0.pool), cfg0), 5);
    console.log(JSON.stringify(q), '=>', res.map((r) => r.chunk.kind[0] + ':' + r.chunk.ref).join(' | '));
  }
  process.exit(0);
}
if (arg('sweep', null)) {
  for (const o of JSON.parse(fs.readFileSync(arg('sweep'), 'utf8'))) {
    const cfg = { ...cfg0, ...o };
    const s = summarize(runAll(cfg));
    console.log(JSON.stringify(o).padEnd(70), 'hybrid', line(s.hybrid), '| bm25', line(s.bm25));
  }
} else {
  const cfg = { ...cfg0, ...(over ? JSON.parse(over) : {}) };
  const per = runAll(cfg);
  const s = summarize(per);
  if (arg('json', false)) { console.log(JSON.stringify({ index: INDEX, half, cfg, all: s }, null, 1)); }
  else {
    console.log(`index ${INDEX}  model ${meta.browser_model}  queries ${queries.length} (half ${half})`);
    for (const m of ['bm25', 'sem', 'hybrid']) console.log(m.padEnd(7), line(s[m]));
    if (arg('groups', false)) {
      for (const g of ['q', 'alias', 'para', 'sec']) {
        const sub = per.filter((p) => p.q.group === g);
        const gs = summarize(sub);
        console.log(`  ${g.padEnd(6)} n=${String(sub.length).padEnd(3)}` + ['bm25', 'sem', 'hybrid'].map((m) => `${m} ${f(gs[m].r5)}/${f(gs[m].mrr)}`).join('  '));
      }
    }
    if (arg('misses', false)) for (const p of per) if (p.hybrid > 5) console.log('MISS', p.q.id, JSON.stringify(p.q.query.slice(0, 60)), 'want', p.q.entities.concat(p.q.sections).join(','), 'got', p.top.join(' '), 'rank', p.hybrid);
  }
}
