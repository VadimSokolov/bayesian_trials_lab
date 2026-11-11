// Core ranking functions for the encyclopedia search: no DOM, no network. Used by search.js (browser)
// and by tools/eval_search.mjs (Node), so the evaluation runs the same scoring as the site.
//
// BM25 is computed over weighted fields (title, aliases, context line, body, generated questions).
// Semantic scoring is a cosine over int8 vectors. The two ranked lists are fused by weighted reciprocal rank fusion.

export const STOP = new Set('a an and are as at be by for from has have how in is it its of on or that the this to was what when which who why with does do did can should would about into than then there their these those'.split(' '));

// Defaults; meta.json may carry a "search" object that overrides them, and the evaluation can override both.
export const DEFAULTS = {
  k1: 1.4, b: 0.75,
  wTitle: 2, wAlias: 0, wCtx: 0, wBody: 1, wDq: 0, // field weights
  expand: 'none',   // alias expansion of query tokens: 'none' | 'abbr' | 'all'
  wExp: 0.5,        // weight of an expansion token relative to a query token
  fusion: 'rrf',    // 'rrf' (reciprocal rank fusion) | 'score' (min-max normalized scores)
  rrfK: 60, wBm: 1, wSem: 1, entityBoost: 1.15, pool: 100,
};

export function stem(w) {
  if (w.length > 4 && w.endsWith('ies')) return w.slice(0, -3) + 'y';
  if (w.length > 4 && /(s|x|z|ch|sh)es$/.test(w)) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1);
  return w;
}

export function tokens(s) {
  const out = [];
  for (const w of String(s).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').split(/[^a-z0-9]+/)) {
    if (!w || STOP.has(w)) continue;
    out.push(stem(w));
  }
  return out;
}

const isAbbr = (a) => /[A-Z].*[A-Z]|\d/.test(a) && !/\s/.test(a);

// idx = {tf: Map[], len: number[], inv: Map, avgLen, N, alias: Map(token or phrase -> [name tokens])}
export function buildIndex(chunks, cfg = DEFAULTS) {
  const inv = new Map();
  const tfs = [], lens = [];
  const alias = new Map();
  chunks.forEach((ch, i) => {
    const tf = new Map();
    let len = 0;
    const add = (text, w) => {
      if (!text || !w) return;
      for (const t of tokens(text)) { tf.set(t, (tf.get(t) || 0) + w); len += w; }
    };
    add(ch.title, cfg.wTitle);
    add(ch.al, cfg.wAlias);
    add(ch.cx, cfg.wCtx);
    add(ch.text, cfg.wBody);
    add(ch.dq, cfg.wDq);
    for (const t of tf.keys()) { if (!inv.has(t)) inv.set(t, []); inv.get(t).push(i); }
    tfs.push(tf); lens.push(len);
    if (ch.kind === 'entity' && ch.al && cfg.expand !== 'none') {
      const name = tokens(ch.title);
      for (const a of ch.al.split('; ')) {
        if (cfg.expand === 'abbr' && !isAbbr(a)) continue;
        const at = tokens(a);
        const key = at.join(' ');
        if (!key || (at.length === name.length && at.every((x, j) => x === name[j]))) continue;
        if (!alias.has(key)) alias.set(key, new Set());
        for (const t of name) alias.get(key).add(t);
      }
    }
  });
  const avgLen = lens.reduce((a, d) => a + d, 0) / Math.max(lens.length, 1);
  return { tf: tfs, len: lens, inv, avgLen, N: chunks.length, alias };
}

// Query term weights: query tokens weigh 1; if a single query token, or the whole query, equals an alias,
// the tokens of the entity name are added with weight cfg.wExp.
export function queryTerms(idx, q, cfg = DEFAULTS) {
  const qt = tokens(q);
  const w = new Map();
  for (const t of qt) w.set(t, 1);
  if (cfg.expand !== 'none' && idx.alias.size) {
    const keys = new Set(qt);
    keys.add(qt.join(' '));
    for (const k of keys) {
      const ex = idx.alias.get(k);
      if (ex) for (const t of ex) if (!w.has(t)) w.set(t, cfg.wExp);
    }
  }
  return w;
}

export function bm25Scores(idx, q, k, cfg = DEFAULTS) {
  const { N } = idx, k1 = cfg.k1, b = cfg.b;
  const score = new Map();
  for (const [t, qw] of queryTerms(idx, q, cfg)) {
    const list = idx.inv.get(t);
    if (!list) continue;
    const idf = Math.log(1 + (N - list.length + 0.5) / (list.length + 0.5));
    for (const i of list) {
      const f = idx.tf[i].get(t);
      score.set(i, (score.get(i) || 0) + qw * idf * (f * (k1 + 1)) / (f + k1 * (1 - b + b * idx.len[i] / idx.avgLen)));
    }
  }
  return [...score].sort((a, b2) => b2[1] - a[1]).slice(0, k);
}
export const bm25 = (idx, q, k, cfg = DEFAULTS) => bm25Scores(idx, q, k, cfg).map((x) => x[0]);

// emb.bin: count float32 scales, then count*dims int8 values.
export function parseEmb(buf, meta) {
  const n = meta.count, d = meta.dims;
  return { scales: new Float32Array(buf, 0, n), q: new Int8Array(buf, n * 4, n * d), dims: d, n };
}

export function semanticScores(emb, qv, k) {
  const { n, dims: d } = emb;
  const sims = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let s = 0;
    const o = i * d;
    for (let j = 0; j < d; j++) s += qv[j] * emb.q[o + j];
    sims[i] = s * emb.scales[i];
  }
  return Array.from({ length: n }, (_, i) => i).sort((a, b) => sims[b] - sims[a]).slice(0, k).map((i) => [i, sims[i]]);
}
export const semantic = (emb, qv, k) => semanticScores(emb, qv, k).map((x) => x[0]);

// lists: [{ids, w}] ranked lists with weights. Returns [[chunk index, score]] best first.
export function fuse(chunks, lists, cfg = DEFAULTS) {
  const fused = new Map();
  for (const { ids, w } of lists) ids.forEach((i, r) => fused.set(i, (fused.get(i) || 0) + w / (cfg.rrfK + r + 1)));
  return [...fused].map(([i, s]) => [i, s * (chunks[i].kind === 'entity' ? cfg.entityBoost : 1)]).sort((a, b) => b[1] - a[1]);
}

// Keep the best chunk per page or section. Returns [{chunk, score}].
export function dedupe(chunks, ranked, k, maxPerRef = 1) {
  const seen = new Map();
  const out = [];
  for (const [i, s] of ranked) {
    const c = chunks[i];
    const key = c.kind + ':' + c.ref;
    const n = seen.get(key) || 0;
    if (n >= maxPerRef) continue;
    seen.set(key, n + 1);
    out.push({ chunk: c, score: s });
    if (out.length >= k) break;
  }
  return out;
}

// Fuse BM25 scored list [[i, score]] and semantic scored list (or null). Returns [[chunk index, score]] best first.
export function hybridRank(chunks, bmS, semS, cfg = DEFAULTS) {
  if (cfg.fusion === 'score') {
    const fused = new Map();
    const bmax = bmS.length ? bmS[0][1] : 1;
    for (const [i, s] of bmS) fused.set(i, cfg.wBm * s / bmax);
    if (semS && semS.length) {
      const hi = semS[0][1], lo = semS[semS.length - 1][1];
      for (const [i, s] of semS) fused.set(i, (fused.get(i) || 0) + cfg.wSem * (s - lo) / Math.max(hi - lo, 1e-9));
    }
    return [...fused].map(([i, s]) => [i, s * (chunks[i].kind === 'entity' ? cfg.entityBoost : 1)]).sort((a, b) => b[1] - a[1]);
  }
  const lists = [{ ids: bmS.map((x) => x[0]), w: cfg.wBm }];
  if (semS) lists.push({ ids: semS.map((x) => x[0]), w: cfg.wSem });
  return fuse(chunks, lists, cfg);
}

// One call for the whole hybrid ranking. qv may be null (BM25 only).
export function rankHybrid({ chunks, idx, emb, q, qv, cfg = DEFAULTS, k = 10, maxPerRef = 1 }) {
  const bmS = bm25Scores(idx, q, cfg.pool, cfg);
  const semS = qv && emb ? semanticScores(emb, qv, cfg.pool) : null;
  return dedupe(chunks, hybridRank(chunks, bmS, semS, cfg), k, maxPerRef);
}
