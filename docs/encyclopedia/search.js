// Hybrid search over the entity pages and the book sections, all in the browser.
// BM25 works at once; semantic cosine (int8 vectors) joins when the query model has loaded.
// The two rankings are fused with reciprocal rank fusion. The ranking functions live in rank.js
// (shared with the Node evaluation tools/eval_search.mjs); the model id, query prefix and pooling come from meta.json.
import { esc } from './render.js';
import { DEFAULTS, tokens, buildIndex, parseEmb, rankHybrid } from './rank.js';

export { tokens };
const TRANSFORMERS_URL = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.2/+esm';

let chunks = null;
let idx = null;
let meta = null;
let cfg = DEFAULTS;
let loading = null;
let emb = null; // {scales: Float32Array, q: Int8Array, dims}
let embLoading = null;
let embedder = null;
export const state = { semantic: 'idle' }; // idle | loading | ready | failed
const listeners = new Set();
export const onState = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
const setState = (s) => { state.semantic = s; listeners.forEach((f) => f(s)); };

export function loadIndex() {
  if (loading) return loading;
  loading = Promise.all([
    fetch('data/index/chunks.json').then((r) => { if (!r.ok) throw new Error('index missing'); return r.json(); }),
    fetch('data/index/meta.json').then((r) => r.json()),
  ]).then(([c, m]) => {
    chunks = c;
    meta = m;
    cfg = { ...DEFAULTS, ...(m.search || {}) };
    idx = buildIndex(chunks, cfg);
    return chunks;
  });
  return loading;
}

// ---------- semantic ----------
export function loadSemantic() {
  if (embLoading) return embLoading;
  setState('loading');
  embLoading = (async () => {
    await loadIndex();
    const [buf, mod] = await Promise.all([
      fetch('data/index/emb.bin').then((r) => r.arrayBuffer()),
      import(TRANSFORMERS_URL),
    ]);
    emb = parseEmb(buf, meta);
    embedder = await mod.pipeline('feature-extraction', meta.browser_model, { dtype: meta.dtype || 'q8' });
    await embedQuery('warm up');
    setState('ready');
  })().catch((e) => { console.warn('semantic search unavailable:', e && e.message); setState('failed'); });
  return embLoading;
}

export async function embedQuery(text) {
  const out = await embedder((meta.query_prefix || '') + text, { pooling: meta.pooling || 'mean', normalize: true });
  return Float32Array.from(out.data);
}

// ---------- hybrid ----------
// Returns [{chunk, score}] best first. opts: {k, maxPerRef, useSemantic}
export async function search(q, opts = {}) {
  const { k = 10, maxPerRef = 1, useSemantic = true } = opts;
  await loadIndex();
  if (!q.trim()) return [];
  let qv = null;
  if (useSemantic && state.semantic === 'ready') {
    try { qv = await embedQuery(q); } catch (e) { /* BM25 only */ }
  }
  return rankHybrid({ chunks, idx, emb, q, qv, cfg, k, maxPerRef });
}

// ---------- snippets ----------
// Plain prose only: no LaTeX, backslash commands, braces or code fragments.
export function cleanText(text) {
  return String(text)
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .replace(/\\\[[\s\S]*?\\\]/g, ' ')
    .replace(/\\\([\s\S]*?\\\)/g, ' ')
    .replace(/\$[^$\n]*\$/g, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/\\[A-Za-z]+/g, ' ')
    .replace(/[\w.:]+\([^)]*\)/g, ' ')
    .replace(/[{}^_$\\|]/g, ' ')
    .replace(/(^|\s)#{1,6}\s/g, ' ')
    .replace(/(^|\s)c\s*\(/g, ' ')
    .split(/\s+/).filter((w) => w && !/["=<>]|::|->/.test(w) && !/^[(),;\[\]]+$/.test(w) && !/^[a-z]+\.[a-z_]+$/.test(w)).join(' ');
}

export function snippet(text, q, span = 30) {
  const terms = new Set(tokens(q));
  const words = cleanText(text).split(/\s+/).filter(Boolean);
  const lw = words.map((w) => tokens(w)[0]);
  let best = 0, bestScore = -1;
  for (let i = 0; i < words.length; i += 4) {
    let s = 0;
    for (let j = i; j < Math.min(i + span, words.length); j++) if (terms.has(lw[j])) s++;
    if (s > bestScore) { bestScore = s; best = i; }
  }
  return (best > 0 ? '... ' : '') + words.slice(best, best + span).join(' ') + (best + span < words.length ? ' ...' : '');
}

export function highlight(text, q) {
  const terms = new Set(tokens(q));
  return esc(text).replace(/[A-Za-z0-9]+/g, (w) => (terms.has(tokens(w)[0]) ? '<mark>' + w + '</mark>' : w));
}
