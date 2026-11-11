/* Copyright 2026 Nytel
 * MIT License. Permission is granted, free of charge, to any person obtaining a copy of this software to use, copy, modify, merge, publish and distribute it, provided this notice is kept. The software is provided "as is", without warranty of any kind.
 *
 * NSim.report: regulator-ready simulation report (Phase D). Works in the browser (one global NSim) and in Node (module.exports). No dependencies.
 *
 * API
 *   report.build(args)         -> HTML string: one <section class="nsim-report"> with inline SVG plots. Styles are in report.css.
 *   report.toMarkdown(args)    -> plain-text (Markdown) version of the same content, without plots.
 *   report.checklist(args)     -> array of the 31 regulatory checklist items with status 'covered' | 'partial' | 'missing' (array.counts has the totals).
 *   report.hashDesign(design)  -> SHA-256 hex of the canonical JSON of the design (sorted keys, so key order does not matter).
 *   report.hashDesignAsync(d)  -> same via SubtleCrypto when available, JS fallback otherwise.
 *   report.document(html, css) -> a complete HTML page around build() output (css text; in Node report.css is read when css is omitted).
 *
 * args = { design, scenarios, results, benchmark?, calibration?, nullGrid?, borrowingSensitivity?, meta }
 *   design      the design JSON (the raw JSON, or the normalized object returned in result.design; result.design.source is used when present).
 *   scenarios   [{name, truth: per arm, justification?, source?, type?: 'null'|'alternative', isNull?, sd?}]
 *   results     [NSim.core.simulate(...) result], one per scenario in the same order (or an object keyed by scenario name). Needs summary; trials and interims make the report fuller.
 *   benchmark   same shape as results, simulated with the same seed and nSims on the benchmark design (NSim.core.simulateBenchmark); the paired differences use the shared simulated patients.
 *   calibration {target, achieved?, mcse?, parameter?, value?, nSims?, method?, note?, ...} (any other keys are listed).
 *   nullGrid    {target, rows: [{label | params, typeI | pSuccess | alpha, mcse | se, nSims, note}]} or the rows array alone; a row may carry result (a simulate result) instead of the numbers.
 *   borrowingSensitivity  [{label, scenario?, priorEss?, essPosterior?, pSuccess?, mcse?, meanSubjects?, bias?, result?}]; a row with result is summarised from it.
 *   meta        {title, sponsor, author, date, engineVersion, seed, nSims, runTime, designHash, objectives, conclusions, limitations, evidence, justifications (array or object by scenario name), targetArm, preSpecified, includeChecklist}
 * Trials may carry effectCI: [lo, hi] (interval for the target treatment effect); the report then adds coverage. Without it coverage is shown as not recorded.
 * The treatment effect is the target arm minus the control arm on the endpoint scale (the target arm is meta.targetArm, else the highest dose).
 */
(function (root) {
  'use strict';
  var NSim = root.NSim = root.NSim || {};
  var R = {};
  R.version = '0.1.0';
  var Z95 = 1.959964;

  /* ---------- Small helpers ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function isNum(x) { return typeof x === 'number' && isFinite(x); }
  function f(x, d) { return isNum(x) ? x.toFixed(d == null ? 3 : d) : 'n/a'; }
  function arr(x) { return x == null ? [] : (Array.isArray(x) ? x : [x]); }
  function mean(a) { var s = 0; for (var i = 0; i < a.length; i++) s += a[i]; return a.length ? s / a.length : NaN; }
  function sd(a) { var m = mean(a), s = 0, i; if (a.length < 2) return NaN; for (i = 0; i < a.length; i++) s += (a[i] - m) * (a[i] - m); return Math.sqrt(s / (a.length - 1)); }
  function seOf(a) { return sd(a) / Math.sqrt(a.length); }
  function quantile(sorted, p) { var n = sorted.length; if (!n) return NaN; var h = (n - 1) * p, lo = Math.floor(h), hi = Math.ceil(h); return sorted[lo] + (h - lo) * (sorted[hi] - sorted[lo]); }
  // Standard error of a sample quantile from the binomial interval of order statistics (distribution free).
  function quantileSE(sorted, p) {
    var n = sorted.length, w = Z95 * Math.sqrt(n * p * (1 - p)), lo = Math.max(0, Math.floor(n * p - w)), hi = Math.min(n - 1, Math.ceil(n * p + w));
    return (sorted[hi] - sorted[lo]) / (2 * Z95);
  }
  function se(v, s, d, k) { return { t: f(v, d) + ' (SE ' + f(s, d) + ')', k: k || 'oc' }; }
  function na(why) { return { t: 'n/a' + (why ? ' (' + why + ')' : ''), k: 'na' }; }
  function plain(v) { return (v && typeof v === 'object' && !Array.isArray(v)) ? Object.keys(v).map(function (k) { return k + '=' + plain(v[k]); }).join(', ') : (Array.isArray(v) ? '[' + v.map(plain).join(', ') + ']' : String(v)); }

  /* ---------- SHA-256 (small JS implementation) ---------- */
  var K256 = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
  function utf8(str) {
    var out = [], i, c, d;
    for (i = 0; i < str.length; i++) {
      c = str.charCodeAt(i);
      if (c >= 0xd800 && c < 0xdc00 && i + 1 < str.length) { d = str.charCodeAt(i + 1); if (d >= 0xdc00 && d < 0xe000) { c = 0x10000 + ((c - 0xd800) << 10) + (d - 0xdc00); i++; } }
      if (c < 0x80) out.push(c);
      else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 63));
      else if (c < 0x10000) out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
      else out.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    }
    return out;
  }
  function sha256(str) {
    var bytes = utf8(str), l = bytes.length, h = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19], i, j;
    bytes.push(0x80); while (bytes.length % 64 !== 56) bytes.push(0);
    var hi = Math.floor(l / 0x20000000), lo = (l << 3) >>> 0;
    bytes.push((hi >>> 24) & 255, (hi >>> 16) & 255, (hi >>> 8) & 255, hi & 255, (lo >>> 24) & 255, (lo >>> 16) & 255, (lo >>> 8) & 255, lo & 255);
    var w = new Array(64);
    function rr(x, n) { return (x >>> n) | (x << (32 - n)); }
    for (i = 0; i < bytes.length; i += 64) {
      for (j = 0; j < 16; j++) w[j] = ((bytes[i + 4 * j] << 24) | (bytes[i + 4 * j + 1] << 16) | (bytes[i + 4 * j + 2] << 8) | bytes[i + 4 * j + 3]) | 0;
      for (j = 16; j < 64; j++) { var s0 = rr(w[j - 15], 7) ^ rr(w[j - 15], 18) ^ (w[j - 15] >>> 3), s1 = rr(w[j - 2], 17) ^ rr(w[j - 2], 19) ^ (w[j - 2] >>> 10); w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0; }
      var a = h[0], b = h[1], c = h[2], d = h[3], e = h[4], ff = h[5], g = h[6], hh = h[7];
      for (j = 0; j < 64; j++) {
        var S1 = rr(e, 6) ^ rr(e, 11) ^ rr(e, 25), ch = (e & ff) ^ (~e & g), t1 = (hh + S1 + ch + K256[j] + w[j]) | 0, S0 = rr(a, 2) ^ rr(a, 13) ^ rr(a, 22), mj = (a & b) ^ (a & c) ^ (b & c), t2 = (S0 + mj) | 0;
        hh = g; g = ff; ff = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
      }
      h[0] = (h[0] + a) | 0; h[1] = (h[1] + b) | 0; h[2] = (h[2] + c) | 0; h[3] = (h[3] + d) | 0; h[4] = (h[4] + e) | 0; h[5] = (h[5] + ff) | 0; h[6] = (h[6] + g) | 0; h[7] = (h[7] + hh) | 0;
    }
    return h.map(function (x) { return ('00000000' + (x >>> 0).toString(16)).slice(-8); }).join('');
  }
  function canon(x) {
    if (x === null || x === undefined) return 'null';
    if (typeof x === 'number') return isFinite(x) ? String(x) : 'null';
    if (typeof x === 'string' || typeof x === 'boolean') return JSON.stringify(x);
    if (Array.isArray(x) || (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView(x))) return '[' + Array.prototype.map.call(x, canon).join(',') + ']';
    var keys = Object.keys(x).filter(function (k) { return k !== '__norm' && x[k] !== undefined && typeof x[k] !== 'function'; }).sort();
    return '{' + keys.map(function (k) { return JSON.stringify(k) + ':' + canon(x[k]); }).join(',') + '}';
  }
  function designJson(design) { return canon(design && design.source ? design.source : design); }
  R.sha256 = sha256;
  R.hashDesign = function (design) { return sha256(designJson(design)); };
  R.hashDesignAsync = function (design) {
    var text = designJson(design), c = root.crypto || (typeof require === 'function' ? (function () { try { return require('crypto').webcrypto; } catch (e) { return null; } })() : null);
    if (c && c.subtle && typeof TextEncoder !== 'undefined') {
      return c.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(function (buf) { return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join(''); }, function () { return sha256(text); });
    }
    return Promise.resolve(sha256(text));
  };

  /* ---------- Rule and design text ---------- */
  var QOI_TEXT = { postProb: 'posterior probability that the effect exceeds the margin', pvalue: 'one-sided p-value', predProb: 'predictive probability of final success', prMax: 'posterior probability that the arm has the largest effect', prED: 'posterior probability of reaching the target effect fraction', med: 'posterior probability of being at or above the minimum effective dose', pAnyEffective: 'posterior probability that some dose is effective', condPower: 'conditional power', zstat: 'z statistic' };
  function condText(g) {
    if (!g) return '';
    if (Array.isArray(g)) g = { op: 'and', conds: g };
    if (g.conds) return g.conds.length === 1 ? condText(g.conds[0]) : '(' + g.conds.map(condText).join(g.op === 'or' ? ' OR ' : ' AND ') + ')';
    return g.qoi + (g.agg != null ? '[' + g.agg + ']' : '') + ' ' + g.cmp + ' ' + g.value;
  }
  function rulesList(rules) {
    var out = [], ri = rules && rules.interim;
    if (ri && !Array.isArray(ri)) ri = [{ from: 1, success: ri.success, futility: ri.futility }];
    arr(ri).forEach(function (r) { out.push({ from: r.from || 1, success: r.success, futility: r.futility }); });
    out.sort(function (a, b) { return a.from - b.from; });
    return out;
  }
  function qoiText(q) {
    var extra = []; ['delta', 'q', 'direction', 'adjust', 'vs'].forEach(function (k) { if (q[k] != null) extra.push(k + ' ' + q[k]); });
    if (q.success) extra.push('success ' + plain(q.success));
    return q.id + ': ' + (QOI_TEXT[q.type] || q.type) + (extra.length ? ' (' + extra.join(', ') + ')' : '');
  }
  function accrualText(acc) {
    var regs = acc && acc.regions || [{ peakPerWeek: 10 }];
    return regs.map(function (r, i) { return 'region ' + (i + 1) + ': ' + r.peakPerWeek + ' per week from week ' + (r.startWeek || 0) + (r.rampUpWeeks ? ', ramp up ' + r.rampUpWeeks + ' weeks' : '') + (r.durationWeeks != null ? ', open ' + r.durationWeeks + ' weeks' : '') + (r.rampDownWeeks ? ', ramp down ' + r.rampDownWeeks + ' weeks' : ''); }).join('; ');
  }

  /* ---------- Analysis of the inputs ---------- */
  function toList(x, scenarios) {
    if (x == null) return [];
    if (Array.isArray(x)) return x;
    if (x.summary) return [x];
    return scenarios.map(function (s, i) { return x[s.name] || x[i]; });
  }
  function armsOf(design) { return (design && design.study && design.study.arms) || []; }
  function ctxOf(args) {
    args = args || {};
    var design = args.design || {}, st = design.study || {}, meta = args.meta || {}, scenarios = arr(args.scenarios), results = toList(args.results, scenarios).filter(Boolean);
    var arms = armsOf(design), ctrl = -1, i;
    arms.forEach(function (a, k) { if (a.isControl && ctrl < 0) ctrl = k; });
    var tgt = -1;
    if (meta.targetArm != null) { tgt = typeof meta.targetArm === 'number' ? meta.targetArm : arms.findIndex(function (a) { return a.name === meta.targetArm; }); }
    if (tgt < 0) arms.forEach(function (a, k) { if (!a.isControl && (tgt < 0 || (a.dose == null ? k : a.dose) > (arms[tgt].dose == null ? tgt : arms[tgt].dose))) tgt = k; });
    var sign = st.higherIsBetter === false ? -1 : 1;
    var c = { args: args, design: design, study: st, meta: meta, arms: arms, ctrl: ctrl, tgt: tgt, sign: sign, scenarios: scenarios, results: results, hasDesign: !!(design && design.study) };
    c.nInterims = ((design.interims && design.interims.at) || []).length;
    c.bench = toList(args.benchmark, scenarios).filter(Boolean);
    c.hasBench = c.bench.length > 0 && c.bench.length === results.length;
    c.rows = scenarios.map(function (s, i) { return scenarioRow(c, s, i, results[i], c.bench[i]); });
    c.hasResults = results.length > 0 && c.rows.length > 0;
    c.hasTrials = c.rows.length > 0 && c.rows.every(function (r) { return r.trials.length > 0; });
    c.hasInterims = c.rows.some(function (r) { return r.res && r.res.interims && r.res.interims.length > 0; });
    c.hasNull = c.rows.some(function (r) { return r.isNull; });
    c.hasAlt = c.rows.some(function (r) { return !r.isNull; });
    c.nJust = c.rows.filter(function (r) { return !!r.justification; }).length;
    c.grid = normGrid(args.nullGrid);
    c.calib = args.calibration || null;
    c.sens = arr(args.borrowingSensitivity);
    c.nSims = meta.nSims != null ? meta.nSims : (results[0] && (results[0].nSims || (results[0].summary && results[0].summary.nSims)));
    c.seeds = c.rows.map(function (r) { return r.res && r.res.seed != null ? r.res.seed : meta.seed; });
    c.version = meta.engineVersion || (NSim.core && NSim.core.version) || null;
    c.hash = meta.designHash || (c.hasDesign ? R.hashDesign(design) : null);
    c.bayes = !!design.model || !!design.borrowing;
    c.narr = pickNarratives(c);
    return c;
  }
  function isNullScn(c, s) {
    if (s.isNull != null) return !!s.isNull;
    if (s.type) return /null/i.test(s.type);
    if (!s.truth || c.tgt < 0) return false;
    var ref = c.ctrl >= 0 ? s.truth[c.ctrl] : 0, any = false;
    for (var k = 0; k < s.truth.length; k++) { if (k === c.ctrl) continue; any = true; if (c.sign * (s.truth[k] - ref) > 1e-12) return false; }
    return any;
  }
  function scenarioRow(c, s, i, res, bres) {
    var meta = c.meta, just = s.justification;
    if (!just && meta.justifications) just = Array.isArray(meta.justifications) ? meta.justifications[i] : (meta.justifications[s.name] || meta.justifications[i]);
    var truthEff = s.truth && c.tgt >= 0 ? s.truth[c.tgt] - (c.ctrl >= 0 ? s.truth[c.ctrl] : 0) : NaN;
    var row = { i: i, s: s, name: s.name || ('Scenario ' + (i + 1)), res: res, bres: bres, justification: just || '', isNull: isNullScn(c, s), truthEff: truthEff, trials: (res && res.trials) || [] };
    row.st = res ? statsOf(c, row, res) : null;
    return row;
  }
  function statsOf(c, row, res) {
    var s = res.summary, tr = row.trials, n = s.nSims || tr.length, o = { n: n, s: s, p: s.pSuccess, pse: s.mcse && s.mcse.pSuccess != null ? s.mcse.pSuccess : Math.sqrt(s.pSuccess * (1 - s.pSuccess) / n) }, i;
    if (tr.length) {
      var ns = tr.map(function (t) { return t.nEnrolled; }).sort(function (a, b) { return a - b; });
      o.nMean = mean(ns); o.nSE = seOf(ns); o.nMin = ns[0]; o.nMax = ns[ns.length - 1];
      o.q = [0.05, 0.25, 0.5, 0.75, 0.95].map(function (p) { return { p: p, v: quantile(ns, p), se: quantileSE(ns, p) }; });
      o.ns = ns;
      var du = tr.map(function (t) { return t.durationWeeks; }); o.dMean = mean(du); o.dSE = seOf(du);
      var eff = [], cov = [];
      tr.forEach(function (t) {
        if (c.tgt < 0 || !t.est) return;
        var e = t.est[c.tgt] - (c.ctrl >= 0 ? t.est[c.ctrl] : 0);
        if (isNum(e)) { eff.push(e); if (t.effectCI && isNum(row.truthEff)) cov.push(t.effectCI[0] <= row.truthEff && row.truthEff <= t.effectCI[1] ? 1 : 0); }
      });
      if (eff.length && isNum(row.truthEff)) {
        o.effMean = mean(eff); o.bias = o.effMean - row.truthEff; o.biasSE = seOf(eff);
        var sq = eff.map(function (e) { return (e - row.truthEff) * (e - row.truthEff); }); o.mse = mean(sq); o.mseSE = seOf(sq); o.effSE = seOf(eff);
      }
      if (cov.length) { o.cov = mean(cov); o.covSE = Math.sqrt(o.cov * (1 - o.cov) / cov.length); }
    } else { o.nMean = s.meanSubjects; o.nSE = s.mcse && s.mcse.meanSubjects; o.dMean = s.meanDurationWeeks; }
    // stopping at each interim, split by direction of the early decision
    var K = c.nInterims, stopS = new Array(K).fill(0), stopF = new Array(K).fill(0);
    tr.forEach(function (t) { if (t.stopInterim >= 0 && t.stopInterim < K) { if (t.code === 1 || t.code === 5) stopS[t.stopInterim]++; else stopF[t.stopInterim]++; } });
    o.stopS = stopS.map(function (v) { return v / (n || 1); }); o.stopF = stopF.map(function (v) { return v / (n || 1); });
    return o;
  }
  function wilsonUp(p, n) { var z2 = Z95 * Z95, den = 1 + z2 / n; return Math.min(1, ((p + z2 / (2 * n)) + Z95 * Math.sqrt(p * (1 - p) / n + z2 / (4 * n * n))) / den); }
  function normGrid(g) {
    if (!g) return null;
    var rows = Array.isArray(g) ? g : g.rows, target = Array.isArray(g) ? null : g.target;
    if (!rows || !rows.length) return null;
    var out = rows.map(function (r, i) {
      var sm = r.result && r.result.summary, p = r.typeI != null ? r.typeI : (r.pSuccess != null ? r.pSuccess : (r.alpha != null ? r.alpha : (r.p != null ? r.p : (sm ? sm.pSuccess : NaN))));
      var n = r.nSims != null ? r.nSims : (sm ? sm.nSims : NaN), m = r.mcse != null ? r.mcse : (r.se != null ? r.se : (sm && sm.mcse ? sm.mcse.pSuccess : (isNum(n) ? Math.sqrt(p * (1 - p) / n) : NaN)));
      var nu = []; [['control', 'control'], ['sd', 'SD'], ['accrualMult', 'accrual x'], ['dropout', 'dropout']].forEach(function (k) { var v = r[k[0]]; if (v != null) nu.push(k[1] + ' ' + (Array.isArray(v) ? v.join('/') : v)); });
      var label = r.label || (r.params ? plain(r.params) : (nu.length ? nu.join(', ') : 'Row ' + (i + 1)));
      var up = r.upper95 != null ? r.upper95 : (r.ci95 ? r.ci95[1] : (isNum(p) && isNum(n) && n > 0 ? wilsonUp(p, n) : NaN));
      return { label: label, p: p, se: m, n: n, up: up, note: r.note || '' };
    });
    var tg = target != null ? target : (Array.isArray(g) ? null : g.alpha);
    return { rows: out, target: tg };
  }

  /* ---------- Narratives ---------- */
  function pickNarratives(c) {
    var want = [{ key: 'early', code: 1, label: 'early success' }, { key: 'futility', code: 4, label: 'futility stop' }, { key: 'late', code: 2, label: 'late success' }], out = {};
    want.forEach(function (w) {
      var best = null;
      c.rows.forEach(function (r) {
        if (!r.trials.length) return;
        var t = r.trials.find(function (x) { return x.code === w.code; });
        if (!t) return;
        // prefer alternative scenarios for success, null scenarios for futility, and the first match otherwise
        var score = (w.key === 'futility' ? (r.isNull ? 2 : 1) : (r.isNull ? 1 : 2));
        if (!best || score > best.score) best = { row: r, trial: t, score: score, label: w.label, key: w.key };
      });
      if (best) out[w.key] = best;
    });
    return out;
  }
  function aggVal(g, qoiMap, c) {
    var vec = qoiMap[g.qoi]; if (!vec) return NaN;
    var agg = g.agg == null ? 'max' : g.agg, v, k;
    function val(x) { return x == null ? NaN : x; }
    if (typeof agg === 'number') return val(vec[agg]);
    if (agg === 'best') return val(vec[c.tgt]);
    var nc = []; for (k = 0; k < vec.length; k++) if (k !== c.ctrl) nc.push(val(vec[k]));
    if (agg === 'min') { v = Infinity; nc.forEach(function (x) { if (x < v) v = x; }); return v; }
    v = -Infinity; nc.forEach(function (x) { if (x > v) v = x; }); return v;
  }
  function cmpOp(x, op, y) { if (!(x === x)) return false; switch (op) { case '>': return x > y; case '>=': return x >= y; case '<': return x < y; case '<=': return x <= y; default: return x === y; } }
  function evalG(g, qoiMap, c) {
    if (!g) return false;
    if (Array.isArray(g)) g = { op: 'and', conds: g };
    if (g.conds) { var isAnd = g.op !== 'or', r = isAnd; for (var i = 0; i < g.conds.length; i++) { var v = evalG(g.conds[i], qoiMap, c); if (isAnd && !v) return false; if (!isAnd && v) return true; } return g.conds.length ? r : false; }
    return cmpOp(aggVal(g, qoiMap, c), g.cmp, g.value);
  }
  function valuesText(g, qoiMap, c) {
    var ids = [];
    (function walk(x) { if (!x) return; if (Array.isArray(x)) x = { conds: x }; if (x.conds) x.conds.forEach(walk); else if (ids.indexOf(x.qoi) < 0) ids.push(x.qoi); })(g);
    return ids.map(function (id) { return id + ' = ' + f(aggVal({ qoi: id }, qoiMap, c), 3); }).join(', ');
  }
  function narrate(c, nar) {
    var r = nar.row, t = nar.trial, res = r.res, D = c.design, S = [], tname = c.arms[c.tgt] ? c.arms[c.tgt].name : 'the target arm', rules = rulesList(D.rules);
    var K = c.nInterims, trig = (D.interims && D.interims.trigger) || 'enrolled';
    S.push('Trial ' + (t.sim + 1) + ' in scenario "' + r.name + '" ended as ' + t.outcome.toLowerCase() + '. The truth in this scenario is ' + truthText(c, r.s) + '.');
    var ints = (res.interims || []).filter(function (x) { return x.sim === t.sim; });
    if (!ints.length && K) S.push('Interim details were not kept for this run.');
    ints = ints.filter(function (it) { return !(t.stopInterim >= 0 && it.interim > t.stopInterim + 1); });
    ints.forEach(function (it) {
      var qm = {}, cx = Object.assign({}, c, { tgt: it.best != null ? it.best : c.tgt }); Object.keys(it.qoi || {}).forEach(function (id) { qm[id] = it.qoi[id]; });
      var rule = null; rules.forEach(function (x) { if (x.from <= it.interim) rule = x; });
      var line = 'Interim ' + it.interim + ' (week ' + f(it.time, 1) + ', ' + it.nEnrolled + ' enrolled, ' + it.nCompleters + ' completed): ';
      if (!rule) { S.push(line + 'no interim rule applies, the trial continues.'); return; }
      var sOk = evalG(rule.success, qm, cx), fOk = evalG(rule.futility, qm, cx), parts = [];
      if (it.decision === 0) { sOk = false; fOk = false; } else if (it.decision === 1) { sOk = true; fOk = false; } else if (it.decision === -1) fOk = true; // the saved engine decision wins
      if (rule.futility) parts.push('futility rule ' + condText(rule.futility) + ' (' + valuesText(rule.futility, qm, cx) + ') is ' + (fOk ? 'met' : 'not met'));
      if (rule.success) parts.push('success rule ' + condText(rule.success) + ' (' + valuesText(rule.success, qm, cx) + ') is ' + (sOk ? 'met' : 'not met'));
      var dec = fOk ? 'The trial stops for futility.' : (sOk ? 'The trial stops for success.' : 'The trial continues.');
      S.push(line + parts.join('; ') + '. ' + dec);
    });
    if (t.stopInterim >= 0) S.push('Enrolment stopped at ' + t.nEnrolled + ' of ' + (c.study.maxN || t.nEnrolled) + ' planned patients, after ' + f(t.accrualWeeks, 1) + ' weeks of accrual. The trial ended at week ' + f(t.durationWeeks, 1) + '.');
    else S.push('No early stop. The trial enrolled all ' + t.nEnrolled + ' patients and ended at week ' + f(t.durationWeeks, 1) + '.');
    var eff = c.tgt >= 0 && t.est ? t.est[c.tgt] - (c.ctrl >= 0 ? t.est[c.ctrl] : 0) : NaN;
    S.push('Estimated effect of ' + tname + ' against control: ' + f(eff, 3) + ' (true value ' + f(r.truthEff, 3) + ').');
    return S;
  }
  function truthText(c, s) { return (s.truth || []).map(function (v, k) { return (c.arms[k] ? c.arms[k].name : 'arm ' + k) + ' ' + f(v, 3); }).join(', '); }

  /* ---------- SVG plots ---------- */
  var PAL = ['#0072B2', '#E69F00', '#009E73', '#CC79A7', '#56B4E9', '#D55E00', '#7A7A7A', '#8C6D31'];
  function niceTicks(lo, hi, n) {
    if (!(hi > lo)) { hi = lo + 1; }
    var raw = (hi - lo) / (n || 5), mag = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10)), r = raw / mag, step = (r < 1.5 ? 1 : r < 3.5 ? 2 : r < 7.5 ? 5 : 10) * mag, out = [];
    for (var v = Math.ceil(lo / step - 1e-9) * step; v <= hi + step * 1e-9; v += step) out.push(Math.round(v / step) * step);
    return out;
  }
  function tickLabel(v) { return String(Math.round(v * 1e6) / 1e6); }
  function svgWrap(w, h, body, title) { return '<svg class="plot" viewBox="0 0 ' + w + ' ' + h + '" width="100%" role="img" aria-label="' + esc(title) + '" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, Helvetica, Arial, sans-serif" font-size="11"><title>' + esc(title) + '</title><rect width="' + w + '" height="' + h + '" fill="#ffffff"/>' + body + '</svg>'; }
  function short(s, n) { s = String(s); return s.length > n ? s.slice(0, n - 1) + '.' : s; }
  function legend(items, x, y, w) {
    var out = '', cx = x, cy = y;
    items.forEach(function (it) {
      var tw = 22 + it.name.length * 6.2;
      if (cx + tw > x + w) { cx = x; cy += 16; }
      out += '<rect x="' + cx + '" y="' + (cy - 9) + '" width="10" height="10" fill="' + it.color + '"/><text x="' + (cx + 14) + '" y="' + cy + '" fill="#222">' + esc(it.name) + '</text>';
      cx += tw;
    });
    return out;
  }
  function frame(o) {
    // o: {w,h,l,r,t,b, y:{lo,hi,label,ticks}, xlabel, cats?, xScale?}
    var W = o.w, H = o.h, pw = W - o.l - o.r, ph = H - o.t - o.b, body = '', yt = o.y.ticks || niceTicks(o.y.lo, o.y.hi, 5);
    function Y(v) { return o.t + ph - (v - o.y.lo) / (o.y.hi - o.y.lo) * ph; }
    yt.forEach(function (v) { body += '<line x1="' + o.l + '" x2="' + (o.l + pw) + '" y1="' + Y(v) + '" y2="' + Y(v) + '" stroke="#e3e3e3"/><text x="' + (o.l - 6) + '" y="' + (Y(v) + 4) + '" text-anchor="end" fill="#444">' + tickLabel(v) + '</text>'; });
    body += '<line x1="' + o.l + '" x2="' + o.l + '" y1="' + o.t + '" y2="' + (o.t + ph) + '" stroke="#555"/><line x1="' + o.l + '" x2="' + (o.l + pw) + '" y1="' + (o.t + ph) + '" y2="' + (o.t + ph) + '" stroke="#555"/>';
    body += '<text transform="translate(14 ' + (o.t + ph / 2) + ') rotate(-90)" text-anchor="middle" fill="#222">' + esc(o.y.label) + '</text>';
    if (o.xlabel) body += '<text x="' + (o.l + pw / 2) + '" y="' + (H - 6) + '" text-anchor="middle" fill="#222">' + esc(o.xlabel) + '</text>';
    return { body: body, Y: Y, pw: pw, ph: ph, l: o.l, t: o.t };
  }
  function catX(fr, i, n) { return fr.l + (i + 0.5) / n * fr.pw; }
  function catLabels(fr, names, n, ybase) {
    var out = '';
    names.forEach(function (nm, i) { var x = catX(fr, i, n); out += '<text transform="translate(' + x + ' ' + (ybase + 12) + ') rotate(-25)" text-anchor="end" fill="#333">' + esc(short(nm, 18)) + '</text>'; });
    return out;
  }
  function plotSuccess(c) {
    var rows = c.rows.filter(function (r) { return r.st; }); if (!rows.length) return '';
    var W = 680, H = 330, o = { w: W, h: H, l: 56, r: 14, t: 14, b: 92, y: { lo: 0, hi: 1, label: 'Probability of success' } }, fr = frame(o), n = rows.length, body = fr.body, items = [{ name: 'Design', color: PAL[0] }], i;
    var tg = (c.grid && c.grid.target != null) ? c.grid.target : (c.calib && c.calib.target != null ? c.calib.target : null);
    if (tg != null) body += '<line x1="' + fr.l + '" x2="' + (fr.l + fr.pw) + '" y1="' + fr.Y(tg) + '" y2="' + fr.Y(tg) + '" stroke="#D55E00" stroke-dasharray="5 4"/><text x="' + (fr.l + fr.pw - 4) + '" y="' + (fr.Y(tg) - 4) + '" text-anchor="end" fill="#D55E00">target ' + tickLabel(tg) + '</text>';
    function pt(x, p, s, col, shape) { var lo = Math.max(0, p - Z95 * s), hi = Math.min(1, p + Z95 * s); return '<line x1="' + x + '" x2="' + x + '" y1="' + fr.Y(lo) + '" y2="' + fr.Y(hi) + '" stroke="' + col + '" stroke-width="1.6"/>' + (shape === 'sq' ? '<rect x="' + (x - 4) + '" y="' + (fr.Y(p) - 4) + '" width="8" height="8" fill="' + col + '"/>' : '<circle cx="' + x + '" cy="' + fr.Y(p) + '" r="4.5" fill="' + col + '"/>'); }
    var hasB = c.hasBench; if (hasB) items.push({ name: 'Benchmark', color: PAL[1] });
    rows.forEach(function (r, k) {
      var x = catX(fr, k, n), dx = hasB ? 8 : 0;
      body += pt(x - dx, r.st.p, r.st.pse, PAL[0], 'c');
      if (hasB && r.bres) body += pt(x + dx, r.bres.summary.pSuccess, r.bres.summary.mcse.pSuccess, PAL[1], 'sq');
    });
    body += catLabels(fr, rows.map(function (r) { return r.name + (r.isNull ? ' (null)' : ''); }), n, fr.t + fr.ph) + legend(items, 60, H - 10, 500);
    return svgWrap(W, H, body, 'Probability of success by scenario with 95 percent Monte Carlo intervals');
  }
  function plotSampleSize(c) {
    var rows = c.rows.filter(function (r) { return r.st && r.st.q; }); if (!rows.length) return '';
    var maxN = Math.max.apply(null, rows.map(function (r) { return r.st.nMax; })), minN = Math.min.apply(null, rows.map(function (r) { return r.st.nMin; }));
    var W = 680, H = 330, lo = Math.max(0, Math.floor(minN * 0.9 / 10) * 10), hi = Math.ceil(maxN * 1.03 / 10) * 10, fr = frame({ w: W, h: H, l: 56, r: 14, t: 14, b: 92, y: { lo: lo, hi: hi, label: 'Sample size (patients enrolled)' } }), n = rows.length, body = fr.body;
    rows.forEach(function (r, k) {
      var x = catX(fr, k, n), q = r.st.q, bw = Math.min(34, fr.pw / n * 0.5);
      body += '<line x1="' + x + '" x2="' + x + '" y1="' + fr.Y(q[0].v) + '" y2="' + fr.Y(q[4].v) + '" stroke="#333"/><line x1="' + (x - 7) + '" x2="' + (x + 7) + '" y1="' + fr.Y(q[0].v) + '" y2="' + fr.Y(q[0].v) + '" stroke="#333"/><line x1="' + (x - 7) + '" x2="' + (x + 7) + '" y1="' + fr.Y(q[4].v) + '" y2="' + fr.Y(q[4].v) + '" stroke="#333"/>';
      body += '<rect x="' + (x - bw / 2) + '" y="' + fr.Y(q[3].v) + '" width="' + bw + '" height="' + Math.max(1, fr.Y(q[1].v) - fr.Y(q[3].v)) + '" fill="#9CC4E4" stroke="#0072B2"/><line x1="' + (x - bw / 2) + '" x2="' + (x + bw / 2) + '" y1="' + fr.Y(q[2].v) + '" y2="' + fr.Y(q[2].v) + '" stroke="#003B5C" stroke-width="2"/><circle cx="' + x + '" cy="' + fr.Y(r.st.nMean) + '" r="3.5" fill="#D55E00"/>';
    });
    body += catLabels(fr, rows.map(function (r) { return r.name; }), n, fr.t + fr.ph) + legend([{ name: 'Box: 25th to 75th percentile, line: median, whiskers: 5th and 95th, dot: mean', color: '#9CC4E4' }], 60, H - 10, 600);
    return svgWrap(W, H, body, 'Distribution of sample size by scenario');
  }
  function plotStopping(c) {
    var K = c.nInterims, rows = c.rows.filter(function (r) { return r.st; }); if (!K || !rows.length) return '';
    var W = 680, H = 320, mx = 0;
    rows.forEach(function (r) { for (var k = 0; k < K; k++) mx = Math.max(mx, r.st.s.stopByInterim[k] || 0); });
    var hi = Math.max(0.1, Math.ceil(mx * 1.1 * 20) / 20), fr = frame({ w: W, h: H, l: 56, r: 14, t: 14, b: 70, y: { lo: 0, hi: hi, label: 'Probability of stopping at the interim' }, xlabel: 'Interim analysis' }), body = fr.body, items = [];
    var gw = fr.pw / K, bw = Math.min(26, gw * 0.8 / rows.length);
    rows.forEach(function (r, j) {
      var col = PAL[j % PAL.length]; items.push({ name: r.name, color: col });
      for (var k = 0; k < K; k++) { var v = r.st.s.stopByInterim[k] || 0, x = fr.l + k * gw + gw / 2 + (j - (rows.length - 1) / 2) * bw; body += '<rect x="' + (x - bw / 2 + 0.5) + '" y="' + fr.Y(v) + '" width="' + (bw - 1) + '" height="' + Math.max(0, fr.Y(0) - fr.Y(v)) + '" fill="' + col + '"/>'; }
    });
    for (var k = 0; k < K; k++) body += '<text x="' + (fr.l + k * gw + gw / 2) + '" y="' + (fr.t + fr.ph + 14) + '" text-anchor="middle" fill="#333">' + (k + 1) + '</text>';
    body += legend(items, 60, H - 24, 600);
    return svgWrap(W, H, body, 'Probability of stopping at each interim by scenario');
  }
  function plotAllocation(c) {
    var rows = c.rows.filter(function (r) { return r.st; }); if (!rows.length) return '';
    var K = c.arms.length || rows[0].st.s.allocationMean.length, W = 680, rh = 26, H = 40 + rows.length * rh + 40, l = 150, pw = W - l - 20, body = '', items = [];
    for (var a = 0; a < K; a++) items.push({ name: c.arms[a] ? c.arms[a].name : 'Arm ' + a, color: PAL[a % PAL.length] });
    [0, 0.25, 0.5, 0.75, 1].forEach(function (v) { body += '<line x1="' + (l + v * pw) + '" x2="' + (l + v * pw) + '" y1="10" y2="' + (20 + rows.length * rh) + '" stroke="#e3e3e3"/><text x="' + (l + v * pw) + '" y="' + (34 + rows.length * rh) + '" text-anchor="middle" fill="#444">' + v + '</text>'; });
    rows.forEach(function (r, j) {
      var am = r.st.s.allocationMean, tot = am.reduce(function (x, y) { return x + y; }, 0) || 1, x = l, y = 14 + j * rh;
      body += '<text x="' + (l - 8) + '" y="' + (y + 14) + '" text-anchor="end" fill="#222">' + esc(short(r.name, 22)) + '</text>';
      am.forEach(function (v, k) { var w = v / tot * pw; body += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + (rh - 6) + '" fill="' + PAL[k % PAL.length] + '"/>'; x += w; });
    });
    body += '<text x="' + (l + pw / 2) + '" y="' + (H - 22) + '" text-anchor="middle" fill="#222">Share of the mean total sample size</text>' + legend(items, l, H - 6, pw);
    return svgWrap(W, H + 6, body, 'Mean allocation per arm by scenario');
  }
  function plotEstimate(c) {
    var pts = c.rows.filter(function (r) { return r.st && r.st.effMean != null && isNum(r.truthEff); }); if (!pts.length) return '';
    var lo = Infinity, hi = -Infinity;
    pts.forEach(function (r) { var d = Z95 * r.st.effSE; lo = Math.min(lo, r.truthEff, r.st.effMean - d); hi = Math.max(hi, r.truthEff, r.st.effMean + d); });
    var pad = (hi - lo) * 0.08 || 0.1; lo -= pad; hi += pad;
    var W = 460, H = 360, ticks = niceTicks(lo, hi, 5), fr = frame({ w: W, h: H, l: 56, r: 14, t: 14, b: 50, y: { lo: lo, hi: hi, label: 'Mean estimated effect', ticks: ticks }, xlabel: 'True effect (target arm minus control)' }), body = fr.body;
    function X(v) { return fr.l + (v - lo) / (hi - lo) * fr.pw; }
    ticks.forEach(function (v) { body += '<text x="' + X(v) + '" y="' + (fr.t + fr.ph + 14) + '" text-anchor="middle" fill="#444">' + tickLabel(v) + '</text>'; });
    body += '<line x1="' + X(lo) + '" y1="' + fr.Y(lo) + '" x2="' + X(hi) + '" y2="' + fr.Y(hi) + '" stroke="#999" stroke-dasharray="5 4"/>';
    pts.forEach(function (r) { var x = X(r.truthEff), d = Z95 * r.st.effSE; body += '<line x1="' + x + '" x2="' + x + '" y1="' + fr.Y(r.st.effMean - d) + '" y2="' + fr.Y(r.st.effMean + d) + '" stroke="#0072B2" stroke-width="1.6"/><circle cx="' + x + '" cy="' + fr.Y(r.st.effMean) + '" r="4.5" fill="#0072B2"/>'; });
    return svgWrap(W, H, body, 'Mean estimated treatment effect against the true effect, dashed line is equality').replace('<svg class="plot"', '<svg class="plot" style="max-width:460px"');
  }
  function plotGrid(c) {
    var g = c.grid; if (!g) return '';
    var rows = g.rows.filter(function (r) { return isNum(r.p); }); if (!rows.length) return '';
    var mx = 0; rows.forEach(function (r) { mx = Math.max(mx, r.p + Z95 * (r.se || 0)); }); if (g.target != null) mx = Math.max(mx, g.target * 1.3);
    var hi = Math.max(0.01, mx * 1.1), W = 680, H = 320, fr = frame({ w: W, h: H, l: 56, r: 14, t: 14, b: 92, y: { lo: 0, hi: hi, label: 'Type I error' } }), n = rows.length, body = fr.body;
    if (g.target != null) body += '<line x1="' + fr.l + '" x2="' + (fr.l + fr.pw) + '" y1="' + fr.Y(g.target) + '" y2="' + fr.Y(g.target) + '" stroke="#D55E00" stroke-dasharray="5 4"/><text x="' + (fr.l + fr.pw - 4) + '" y="' + (fr.Y(g.target) - 4) + '" text-anchor="end" fill="#D55E00">target ' + tickLabel(g.target) + '</text>';
    rows.forEach(function (r, k) { var x = catX(fr, k, n), s = r.se || 0; body += '<line x1="' + x + '" x2="' + x + '" y1="' + fr.Y(Math.max(0, r.p - Z95 * s)) + '" y2="' + fr.Y(r.p + Z95 * s) + '" stroke="#0072B2" stroke-width="1.6"/><circle cx="' + x + '" cy="' + fr.Y(r.p) + '" r="4.5" fill="#0072B2"/>'; });
    body += catLabels(fr, rows.map(function (r) { return r.label; }), n, fr.t + fr.ph);
    return svgWrap(W, H, body, 'Type I error across the null grid with 95 percent Monte Carlo intervals');
  }

  /* ---------- Report model ---------- */
  function kv(rows) { return { type: 'kv', rows: rows }; }
  function P(t) { return { type: 'p', text: t }; }
  function table(head, rows, o) { o = o || {}; return { type: 'table', head: head, rows: rows, caption: o.caption, foot: o.foot, cls: o.cls }; }
  function justCell(r) { return r.justification ? r.justification : { t: 'not provided', k: 'miss' }; }
  function fmtRunTime(v) { return v == null ? 'not recorded' : (typeof v === 'number' ? (v < 120 ? f(v, 1) + ' seconds' : f(v / 60, 1) + ' minutes') : String(v)); }
  function modelText(c) {
    var D = c.design, out = [];
    if (D.model) out.push(plain(D.model)); else out.push('No Bayesian model (frequentist analysis)');
    return out.join('');
  }
  function sec(id, title, guide, blocks) { return { id: id, title: title, guide: guide, blocks: blocks.filter(Boolean) }; }

  function buildModel(args) {
    var c = ctxOf(args), meta = c.meta, D = c.design, st = c.study, sections = [], n;
    var arms = c.arms, armName = function (k) { return arms[k] ? arms[k].name : 'Arm ' + k; };
    var sims = c.nSims;

    /* Objectives and summary */
    var obj = arr(meta.objectives), key = [];
    var nullRows = c.rows.filter(function (r) { return r.isNull && r.st; }), altRows = c.rows.filter(function (r) { return !r.isNull && r.st; });
    if (nullRows.length) { var mx = nullRows.reduce(function (a, r) { return r.st.p > a.st.p ? r : a; }); key.push('Largest Type I error among the null scenarios: ' + f(mx.st.p, 4) + ' (SE ' + f(mx.st.pse, 4) + ') in "' + mx.name + '".'); }
    if (altRows.length) { var lo = altRows.reduce(function (a, r) { return r.st.p < a.st.p ? r : a; }), hi = altRows.reduce(function (a, r) { return r.st.p > a.st.p ? r : a; }); key.push('Power across the alternative scenarios runs from ' + f(lo.st.p, 3) + ' (SE ' + f(lo.st.pse, 3) + ', "' + lo.name + '") to ' + f(hi.st.p, 3) + ' (SE ' + f(hi.st.pse, 3) + ', "' + hi.name + '").'); }
    if (c.rows.some(function (r) { return r.st && isNum(r.st.nMean); }) && st.maxN) { var nm = c.rows.filter(function (r) { return r.st && isNum(r.st.nMean); }).map(function (r) { return r.st.nMean; }); key.push('Expected sample size runs from ' + f(Math.min.apply(null, nm), 1) + ' to ' + f(Math.max.apply(null, nm), 1) + ' against a maximum of ' + st.maxN + '.'); }
    if (c.grid) { var gm = c.grid.rows.reduce(function (a, r) { return r.p > a.p ? r : a; }); key.push('Largest Type I error over the null grid: ' + f(gm.p, 4) + ' (SE ' + f(gm.se, 4) + ') at ' + gm.label + '.'); }
    sections.push(sec('summary', 'Objectives and summary of results', 'Answers ICH E20 section 5.2 item 1 (key questions of the simulation study) and the summary of overall conclusions. Checklist items 1 and 26.', [
      obj.length ? { type: 'list', items: obj } : P('No objectives were supplied ). State the key questions the simulation study answers.'),
      key.length ? { type: 'list', items: key } : P('No results were supplied.'),
      meta.conclusions ? P(meta.conclusions) : null
    ]));

    /* 1 Design */
    var rows1 = [], ints = D.interims || {}, al = D.allocation || { type: 'fixed' };
    rows1.push(['Endpoint', (st.endpoint || 'not given') + (st.endpoint === 'continuous' && st.sigma != null ? ', SD ' + st.sigma : '') + (st.higherIsBetter === false ? ', lower is better' : ', higher is better')]);
    rows1.push(['Arms', arms.map(function (a, k) { return a.name + (a.isControl ? ' (control)' : ' (dose ' + (a.dose == null ? k : a.dose) + ')'); }).join('; ') || 'not given']);
    rows1.push(['Maximum sample size', st.maxN != null ? String(st.maxN) : 'not given']);
    rows1.push(['Accrual', accrualText(D.accrual)]);
    rows1.push(['Final visit (weeks)', String((D.visitWeeks || [12])[(D.visitWeeks || [12]).length - 1])]);
    var pd = D.dropout && D.dropout.perArm; rows1.push(['Dropout', pd == null ? 'none assumed' : (Array.isArray(pd) ? pd.map(function (v, k) { return armName(k) + ' ' + f(v, 3); }).join('; ') : f(pd, 3) + ' in every arm')]);
    rows1.push(['Analysis model and priors', modelText(c)]);
    if (D.borrowing) {
      var b0 = c.rows[0] && c.rows[0].res && c.rows[0].res.summary && c.rows[0].res.summary.borrowing, bt = 'method ' + D.borrowing.method + '; historical data ' + plain(D.borrowing.historical || []);
      if (b0 && b0.essPrior) bt += '; prior effective sample size ' + f(b0.essPrior.moment, 1) + ' (moment) and ' + f(b0.essPrior.elir, 1) + ' (ELIR)';
      rows1.push(['Historical borrowing (control arm)', bt]);
    }
    rows1.push(['Allocation', al.type === 'adaptive' ? 'Response-adaptive' + (al.burnIn != null ? ', burn-in ' + al.burnIn : '') + ', driven by ' + (al.qoi === '__alloc' ? 'Pr(arm is best)' : al.qoi) + (al.gamma != null ? ', power ' + al.gamma : '') + (al.controlShare != null ? ', control share ' + al.controlShare : '') + (al.minShare != null ? ', minimum share ' + al.minShare : '') : 'Fixed, ratio ' + (al.ratio || arms.map(function () { return 1; })).join(':')]);
    if (al.drop) rows1.push(['Arm dropping', 'Drop an arm when ' + al.drop.qoi + ' ' + al.drop.cmp + ' ' + al.drop.value + (al.drop.maxDropped != null ? ' (at most ' + al.drop.maxDropped + ' arms)' : '')]);
    rows1.push(['Interim schedule', (ints.at && ints.at.length) ? 'After ' + ints.at.join(', ') + ' patients ' + ({ enrolled: 'enrolled', completers: 'completed', opportunity: 'with a completed or possible final visit' }[ints.trigger || 'enrolled']) + '; after an early stop, ' + ((ints.followUp || 'continue') === 'lock' ? 'the data are locked' : 'enrolled patients finish follow-up') : 'No interim analyses (fixed design)']);
    var rl = rulesList(D.rules), ruleItems = [];
    rl.forEach(function (r) { ruleItems.push('From interim ' + r.from + ': ' + [r.success ? 'stop for success if ' + condText(r.success) : '', r.futility ? 'stop for futility if ' + condText(r.futility) + ' (futility wins ties)' : ''].filter(Boolean).join('; ')); });
    if (D.rules && D.rules.final) { if (D.rules.final.success) ruleItems.push('Final: success if ' + condText(D.rules.final.success)); if (D.rules.final.futility) ruleItems.push('Final: futility if ' + condText(D.rules.final.futility)); }
    rows1.push(['Decision rules', ruleItems.length ? { list: ruleItems } : 'none given']);
    rows1.push(['Decision quantities', arr(D.qois).filter(function (q) { return q.id !== '__alloc'; }).map(qoiText).join('; ') || 'none given']);
    if (D.simulation) rows1.push(['Posterior draws', plain(D.simulation)]);
    var designBlocks = [kv(rows1)];
    if (c.hasBench) { var bi = c.bench[0].design && c.bench[0].design.benchmarkInfo; designBlocks.push(P('Benchmark design compared on the same simulated patients: ' + (bi ? 'group sequential with ' + bi.K + ' equally spaced looks, ' + bi.type + ' spending, one-sided alpha ' + bi.alpha + ', control against ' + armName(bi.arm) + '.' : 'a non-adaptive design (see section 5).'))); }
    else designBlocks.push(P('No benchmark design was supplied. A benchmark with well-understood operating characteristics is expected (checklist item 2).'));
    sections.push(sec('design', '1. Design summary', 'Answers the overall description of the trial design and its options (FDA Adaptive Designs 2019; checklist items 2, 14 and 29: data-generating process, pre-specified decision rules).', designBlocks));

    /* 2 Scenarios */
    var multiSd = c.rows.some(function (r) { return r.s.sd != null; });
    var head2 = ['#', 'Scenario', 'Role', 'True value per arm', 'Target effect'].concat(multiSd ? ['SD'] : []).concat(['Justification', 'Source']);
    var rows2 = c.rows.map(function (r) { return [String(r.i + 1), r.name, r.isNull ? 'Null (no benefit)' : 'Alternative', truthText(c, r.s), f(r.truthEff, 3)].concat(multiSd ? [r.s.sd == null ? 'n/a' : plain(r.s.sd)] : []).concat([justCell(r), r.s.source || '']); });
    var blocks2 = [P('Data-generating process: each patient arrives by a Poisson process with the accrual profile above, drops out with the stated probability, and has an outcome drawn ' + (st.endpoint === 'dichotomous' ? 'as Bernoulli with the true response rate of the assigned arm' : 'from a normal distribution with the true mean of the assigned arm' + (st.sigma != null ? ' and SD ' + st.sigma : '')) + '. The same simulated patients are used for every design and scenario threshold (common random numbers).'),
      rows2.length ? table(head2, rows2, { caption: 'Scenarios. The target effect is the target arm (' + (c.tgt >= 0 ? armName(c.tgt) : 'none') + ') minus control.' }) : P('No scenarios were supplied.')];
    if (meta.evidence) blocks2.push(P('Evidence base for the scenarios: ' + meta.evidence));
    else blocks2.push(P('Evidence base for the scenarios (prior trials, literature, expert input) was not supplied ).'));
    sections.push(sec('scenarios', '2. Scenarios', 'Answers the set of parameter configurations and the justification of their adequacy (FDA Adaptive Designs 2019; ICH E20 5.2 item 4 on existing knowledge). Checklist items 3, 4, 15, 24 and 27.', blocks2));

    /* 3 Operating characteristics */
    var haveT = c.rows.length && c.rows.every(function (r) { return r.st && r.st.q; });
    var ocA = c.rows.filter(function (r) { return r.st; }).map(function (r) {
      var s = r.st, row = [r.name, r.isNull ? 'Type I error' : 'Power', se(s.p, s.pse, 4), s.nMean != null ? se(s.nMean, s.nSE, 1) : na('not kept')];
      if (s.q) { row.push(se(s.q[0].v, s.q[0].se, 0), se(s.q[2].v, s.q[2].se, 0), se(s.q[4].v, s.q[4].se, 0), { t: s.nMin + ' / ' + s.nMax, k: 'ext' }); } else row.push(na('trials not kept'), na('trials not kept'), na('trials not kept'), na('trials not kept'));
      return row;
    });
    var ocB = c.rows.filter(function (r) { return r.st; }).map(function (r) {
      var s = r.st;
      return [r.name, s.dSE != null ? se(s.dMean, s.dSE, 1) : na('trials not kept'), s.bias != null ? se(s.bias, s.biasSE, 4) : na('no estimates'), s.mse != null ? se(s.mse, s.mseSE, 5) : na('no estimates'), s.cov != null ? se(s.cov, s.covSE, 3) : na('intervals not recorded')];
    });
    var blocks3 = [];
    if (sims) {
      var h1 = Z95 * Math.sqrt(0.025 * 0.975 / sims), h5 = Z95 * Math.sqrt(0.25 / sims);
      blocks3.push(P('Each scenario used ' + sims + ' simulated trials. The 95 percent Monte Carlo half-width is about ' + f(h1, 4) + ' for a probability of 0.025 and ' + f(h5, 3) + ' for a probability of 0.5. Every cell below gives the Monte Carlo standard error (SE). ' + (sims < 100000 ? 'FDA Adaptive Designs 2019 gives 100,000 simulated trials per scenario as an example for Type I error (half-width about 0.001); this run is smaller.' : '')));
    }
    blocks3.push(ocA.length ? table(['Scenario', 'Measure', 'Pr(success)', 'Expected sample size', 'Sample size 5th pct', 'Sample size median', 'Sample size 95th pct', 'Min / max sample size'], ocA, { cls: 'oc', caption: '3a. Decision and sample size. Pr(success) counts early and late success. Minimum and maximum are extremes of the simulated trials and have no standard error.' }) : P('No results were supplied.'));
    if (ocB.length) blocks3.push(table(['Scenario', 'Expected duration (weeks)', 'Bias of effect estimate', 'MSE of effect estimate', 'Interval coverage'], ocB, { cls: 'oc', caption: '3b. Duration and estimation. The effect estimate is the target arm minus control at the analysis that ended the trial, so bias includes the effect of stopping early.' }));
    sections.push(sec('oc', '3. Operating characteristics', 'Answers the core frequentist operating characteristics, their distribution and Monte Carlo uncertainty (FDA Adaptive Designs 2019; ICH E20 on duration, MSE and distribution of results; ADEMP). Checklist items 8, 9, 10 and 11.', blocks3));

    /* 4 Adaptation */
    var K = c.nInterims, a4 = [], head4 = ['Scenario'];
    for (var k = 0; k < K; k++) head4.push('Stop for success at interim ' + (k + 1), 'Stop for futility at interim ' + (k + 1));
    var t4 = c.rows.filter(function (r) { return r.st; }).map(function (r) { var s = r.st, row = [r.name], n_ = s.n || 1; for (var q = 0; q < K; q++) { row.push(se(s.stopS[q], Math.sqrt(s.stopS[q] * (1 - s.stopS[q]) / n_), 3), se(s.stopF[q], Math.sqrt(s.stopF[q] * (1 - s.stopF[q]) / n_), 3)); } return row; });
    var head4b = ['Scenario'].concat(arms.map(function (a) { return 'Mean n, ' + a.name; })).concat(arms.map(function (a) { return 'Pr(arm dropped), ' + a.name; })).concat(['Pr(correct arm or dose)']);
    var t4b = c.rows.filter(function (r) { return r.st; }).map(function (r) { var s = r.st.s, row = [r.name]; arms.forEach(function (a, k) { row.push(se(s.allocationMean[k], s.allocationSE[k], 1)); }); arms.forEach(function (a, k) { row.push(se(s.pArmDropped[k], s.pArmDroppedSE ? s.pArmDroppedSE[k] : Math.sqrt(s.pArmDropped[k] * (1 - s.pArmDropped[k]) / r.st.n), 3)); }); row.push(s.pCorrectArm == null ? na('tied truth or one dose') : se(s.pCorrectArm, s.pCorrectArmSE, 3)); return row; });
    var blocks4 = [];
    if (K && t4.length) { blocks4.push(table(head4, t4, { cls: 'oc', caption: '4a. Stopping at each interim, split by the direction of the early decision.' })); } else blocks4.push(P(K ? 'No results were supplied.' : 'The design has no interim analyses, so no stopping probabilities apply.'));
    if (t4b.length) blocks4.push(table(head4b, t4b, { cls: 'oc', caption: '4b. Allocation, arm dropping and correct selection. Pr(correct arm or dose) is the share of trials whose best estimated arm is the truly best arm; it is not defined when the true arms are tied.' }));
    sections.push(sec('adaptation', '4. Adaptation', 'Answers the stopping, arm selection and allocation behaviour of the design by scenario. Checklist items 10 and 21.', blocks4));

    /* 5 Benchmark */
    var blocks5 = [];
    if (c.hasBench) {
      var t5 = c.rows.map(function (r, i) {
        var b = c.bench[i], bs = b.summary, s = r.st, same = r.trials.length && b.trials && b.trials.length === r.trials.length && (b.seed == null || r.res.seed == null || b.seed === r.res.seed), dP, dN, dD;
        function suc(t) { return t.code === 1 || t.code === 2 ? 1 : 0; }
        if (same) {
          var dp = r.trials.map(function (t, j) { return suc(t) - suc(b.trials[j]); }), dn = r.trials.map(function (t, j) { return t.nEnrolled - b.trials[j].nEnrolled; }), dd = r.trials.map(function (t, j) { return t.durationWeeks - b.trials[j].durationWeeks; });
          dP = se(mean(dp), seOf(dp), 4); dN = se(mean(dn), seOf(dn), 1); dD = se(mean(dd), seOf(dd), 1);
        } else {
          dP = se(s.p - bs.pSuccess, Math.sqrt(Math.pow(s.pse, 2) + Math.pow(bs.mcse.pSuccess, 2)), 4); dN = se(s.nMean - bs.meanSubjects, Math.sqrt(Math.pow(s.nSE || 0, 2) + Math.pow(bs.mcse.meanSubjects, 2)), 1); dD = na('not paired');
        }
        return [r.name, r.isNull ? 'Type I error' : 'Power', se(s.p, s.pse, 4), se(bs.pSuccess, bs.mcse.pSuccess, 4), dP, se(s.nMean, s.nSE, 1), se(bs.meanSubjects, bs.mcse.meanSubjects, 1), dN, dD];
      });
      var allPaired = c.rows.every(function (r, i) { var b = c.bench[i]; return r.trials.length && b.trials && b.trials.length === r.trials.length && (b.seed == null || r.res.seed == null || b.seed === r.res.seed); });
      blocks5.push(P(allPaired ? 'The benchmark was simulated on the same patients as the design (same seed, same trial index), so the differences are paired and their standard errors are smaller than those of the separate estimates.' : 'The benchmark and design results could not be paired trial by trial (different seeds, or trials not kept). Differences use unpaired standard errors where shown.'));
      blocks5.push(table(['Scenario', 'Measure', 'Design Pr(success)', 'Benchmark Pr(success)', 'Difference in Pr(success)', 'Design sample size', 'Benchmark sample size', 'Difference in sample size', 'Difference in duration (weeks)'], t5, { cls: 'oc', caption: 'Paired differences are design minus benchmark.' }));
    } else blocks5.push(P('Not run. No benchmark results were supplied. Run the benchmark design with the same seed and number of simulated trials to fill this section.'));
    sections.push(sec('benchmark', '5. Benchmark comparison', 'Answers the benchmark design with well-understood operating characteristics, compared on the same simulated patients (ICH E20 simulation section; FDA Adaptive Designs 2019). Checklist item 2.', blocks5));

    /* 6 Type I error control */
    var blocks6 = [], nr = c.rows.filter(function (r) { return r.isNull && r.st; });
    if (c.calib) {
      var cr = [], cb = c.calib, known = ['target', 'achieved', 'mcse', 'parameter', 'value', 'nSims', 'method', 'note'], lab = { target: 'Target Type I error', achieved: 'Achieved Type I error', mcse: 'Monte Carlo SE of the achieved value', parameter: 'Calibrated parameter', value: 'Calibrated value', nSims: 'Simulated trials', method: 'Method', note: 'Note' };
      known.forEach(function (kk) { if (cb[kk] != null) cr.push([lab[kk], String(cb[kk])]); });
      Object.keys(cb).forEach(function (kk) { if (known.indexOf(kk) < 0 && typeof cb[kk] !== 'function') cr.push([kk, plain(cb[kk])]); });
      blocks6.push(P('Calibration result:')); blocks6.push(kv(cr));
    } else blocks6.push(P('Calibration: not run.'));
    if (c.grid) {
      var tg = c.grid.target, gmax = c.grid.rows.reduce(function (a, r) { return r.p > a.p ? r : a; });
      var gt = c.grid.rows.map(function (r) {
        var flag = tg == null ? 'no target given' : (r.p <= tg ? (isNum(r.up) && r.up <= tg ? 'within target' : 'estimate below target, upper limit above target (not shown to be controlled)') : (r.p - Z95 * (r.se || 0) <= tg ? 'above target, within Monte Carlo error' : 'exceeds target'));
        return [r.label, se(r.p, r.se, 4), isNum(r.up) ? f(r.up, 4) : 'n/a', isNum(r.n) ? String(r.n) : 'n/a', { t: flag, k: /^(exceeds|estimate below)/.test(flag) ? 'flag' : 'ok' }, r.note || ''];
      });
      blocks6.push(table(['Null configuration', 'Type I error', 'Upper 95% limit', 'Simulated trials', 'Flag', 'Note'], gt, { cls: 'oc', caption: '6a. Null grid. Each row is a nuisance configuration with no beneficial effect.' }));
      blocks6.push(P('Maximum over the grid: ' + f(gmax.p, 4) + ' (SE ' + f(gmax.se, 4) + ') at ' + gmax.label + (tg != null ? ', against the target ' + tg + '.' : '.') + ' Justify that the grid covers the plausible range of nuisance values and is fine enough that Type I error between grid points is not larger (checklist item 5).'));
    } else blocks6.push(P('Null grid: not run.'));
    if (nr.length) blocks6.push(table(['Null scenario', 'Type I error', 'Simulated trials'], nr.map(function (r) { return [r.name, se(r.st.p, r.st.pse, 4), String(r.st.n)]; }), { cls: 'oc', caption: '6b. Type I error in the null scenarios of this run.' }));
    sections.push(sec('typeI', '6. Type I error control', 'Answers Type I error under a grid of nuisance values and the calibration of the design (FDA Adaptive Designs 2019; ICH E20; FDA Bayesian draft guidance). Checklist items 5 and 20.', blocks6));

    /* 7 Prior and borrowing sensitivity */
    var blocks7 = [];
    if (c.sens.length) {
      var t7 = c.sens.map(function (r, i) {
        var sm = r.result && r.result.summary, bo = sm && sm.borrowing, p = r.pSuccess != null ? r.pSuccess : (sm ? sm.pSuccess : NaN), m = r.mcse != null ? r.mcse : (sm && sm.mcse ? sm.mcse.pSuccess : NaN), ns = r.meanSubjects != null ? r.meanSubjects : (sm ? sm.meanSubjects : NaN), nse = r.meanSubjectsSE != null ? r.meanSubjectsSE : (sm && sm.mcse ? sm.mcse.meanSubjects : NaN);
        var ess = r.priorEss != null ? r.priorEss : (bo && bo.essPrior ? bo.essPrior.moment : NaN), ep = r.essPosterior != null ? r.essPosterior : (bo ? bo.meanEssPosterior : NaN);
        return [r.label || ('Row ' + (i + 1)), r.scenario || (sm && sm.scenario) || '', isNum(ess) ? f(ess, 1) : 'n/a', isNum(ep) ? f(ep, 1) : 'n/a', isNum(p) ? se(p, m, 4) : na(), isNum(ns) ? se(ns, nse, 1) : na(), r.bias != null ? se(r.bias, r.biasSE, 4) : na('not given')];
      });
      blocks7.push(table(['Prior or borrowing setting', 'Scenario', 'Prior effective sample size', 'Mean posterior effective sample size', 'Pr(success)', 'Expected sample size', 'Bias'], t7, { cls: 'oc', caption: 'Prior and borrowing sensitivity, including prior-data conflict scenarios. Prior effective sample size is the moment ESS.' }));
    } else blocks7.push(P(c.bayes ? 'Not run. No prior or borrowing sensitivity results were supplied. Vary the prior strength and include a scenario where the historical data and the new trial disagree.' : 'Not applicable to the design as given: it has no Bayesian model or borrowing. No sensitivity results were supplied.'));
    sections.push(sec('borrowing', '7. Prior and borrowing sensitivity', 'Answers prior-data conflict and prior sensitivity, with the prior effective sample size (FDA Bayesian draft guidance). Checklist items 19 and 22.', blocks7));

    /* 8 Narratives */
    var blocks8 = [], nk = ['early', 'futility', 'late'].filter(function (kk) { return c.narr[kk]; });
    if (nk.length) {
      blocks8.push(P('Three simulated trials, picked from the first matching trial of each kind. Each trial is one random draw and is not typical on its own.'));
      nk.forEach(function (kk) { var nar = c.narr[kk]; blocks8.push({ type: 'narrative', title: 'Example ' + (nk.indexOf(kk) + 1) + ': ' + nar.label, sentences: narrate(c, nar) }); });
      var miss = ['early', 'futility', 'late'].filter(function (kk) { return !c.narr[kk]; });
      if (miss.length) blocks8.push(P('No simulated trial of this kind was found: ' + miss.map(function (kk) { return { early: 'early success', futility: 'futility stop', late: 'late success' }[kk]; }).join(', ') + '.'));
    } else blocks8.push(P('No example trials could be drawn (trials were not kept in the results).'));
    sections.push(sec('narratives', '8. Example trials', 'Answers the example trials with different conclusions (FDA Adaptive Designs 2019; ICH E20 5.2 item 9). Checklist item 13.', blocks8));

    /* 9 Plots */
    var blocks9 = [], pl = [['Probability of success by scenario (power in alternatives, Type I error in nulls). Bars show 95 percent Monte Carlo intervals.', plotSuccess(c)], ['Distribution of the sample size by scenario.', plotSampleSize(c)], ['Probability of stopping at each interim.', plotStopping(c)], ['Allocation per arm.', plotAllocation(c)], ['Estimated effect against the true effect.', plotEstimate(c)], ['Type I error over the null grid.', plotGrid(c)]];
    pl.forEach(function (p, i) { if (p[1]) blocks9.push({ type: 'plot', svg: p[1], caption: 'Figure ' + (blocks9.length + 1) + '. ' + p[0] }); });
    if (!blocks9.length) blocks9.push(P('No plots could be drawn from the supplied results.'));
    sections.push(sec('plots', '9. Plots', 'Answers the graphical summaries expected with the tables (ICH E20 5.2 item 8; regulatory.md section 2). Checklist item 26.', blocks9));

    /* 10 Implementation */
    var hdr = ['Scenario', 'Simulated trials', 'Seed'];
    var t10 = c.rows.map(function (r, i) { return [r.name, String(r.st ? r.st.n : 'n/a'), String(c.seeds[i] == null ? 'not recorded' : c.seeds[i])]; });
    var mc = D.model && ['logistic3', 'sigmoid', 'hierLogistic'].indexOf(D.model.type) >= 0, sim = D.simulation || {};
    var kv10 = [
      ['Software', 'Bayesian Clinical Trials Lab simulator, engine NSim.core ' + (c.version || 'version not recorded') + ' (MIT license)'],
      ['Design hash (SHA-256 of the design JSON)', c.hash || 'not available'],
      ['Run time', fmtRunTime(meta.runTime)],
      ['Posterior computation', D.model ? (mc ? 'Metropolis sampling for the curve models, ' + (sim.nDraws || 1000) + ' posterior draws per analysis; convergence diagnostics were not recorded' : 'Exact or grid posterior (no MCMC), ' + (sim.nDraws || 1000) + ' posterior draws per analysis where draws are used') : 'Not applicable (no Bayesian model)'],
      ['Report date', meta.date || 'not recorded']
    ];
    var seedAll = c.seeds.filter(function (v) { return v != null; });
    var sameSeed = seedAll.length > 1 && seedAll.every(function (v) { return v === seedAll[0]; });
    var blocks10 = [kv(kv10), t10.length ? table(hdr, t10, { caption: 'Simulated trials and seeds per scenario.' }) : null,
      sameSeed ? P('All scenarios share one seed on purpose: trial s uses the stream (seed, s), so designs and scenarios see the same simulated patients. The trial streams are independent of each other. FDA Adaptive Designs 2019 prefers different seeds across scenarios when scenarios are independent comparisons; here the shared seed gives paired comparisons.') : null,
      { type: 'list', title: 'How to reproduce', items: ['Open the simulator studio and load the design JSON (its SHA-256 hash must match the one above).', 'Set the same scenarios, the number of simulated trials and the seed given above.', 'Run the simulation and compare the tables. The same engine version and seed give the same numbers.', 'In code: NSim.core.simulate(design, scenario, { nSims: ' + (sims || 'N') + ', seed: ' + (seedAll[0] != null ? seedAll[0] : 'SEED') + ' })'] }];
    sections.push(sec('implementation', '10. Implementation and reproducibility', 'Answers the code, seeds, software and reproducibility items (ICH E20 5.2 item 7; FDA Adaptive Designs 2019 on documented seeds and verification). Checklist items 6, 7, 16, 17, 18, 23 and 28.', blocks10));

    /* 11 Limitations */
    var lim = ['The engine approximates predictive probability with independent-arm normal or Beta approximations and a thinned set of posterior draws.', 'P-values are one-sided z tests without a t correction. Conditional power uses the current-trend formula.', 'Scenarios are fixed parameter values, so results show behaviour at those values and not an average over a design prior.', 'The results hold only under the assumptions in sections 1 and 2. The scenarios cover a finite set of configurations.'];
    arr(meta.limitations).forEach(function (t) { lim.push(t); });
    sections.push(sec('limitations', '11. Limitations and interpretation', 'Answers the aspects that limit the interpretation of the simulation results (ICH E20 5.2 item 10). Checklist item 25.', [{ type: 'list', items: lim }]));

    if (meta.includeChecklist) {
      var cl = R.checklist(args);
      sections.push(sec('checklist', 'Appendix. Checklist coverage', 'Status of the 31 items of the regulatory checklist for this report.', [P(cl.counts.covered + ' covered, ' + cl.counts.partial + ' partial, ' + cl.counts.missing + ' missing.'), table(['#', 'Item', 'Status', 'Note'], cl.map(function (r) { return [String(r.id), r.item, { t: r.status, k: 'st-' + r.status }, r.note]; }))]));
    }
    return { title: meta.title || 'Simulation report', meta: meta, sections: sections, ctx: c };
  }

  /* ---------- Renderers ---------- */
  function cellHtml(cell, tag) {
    if (cell && typeof cell === 'object') { if (cell.list) return '<' + tag + '><ul>' + cell.list.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></' + tag + '>'; return '<' + tag + ' data-k="' + esc(cell.k || '') + '" class="k-' + esc(cell.k || '') + '">' + esc(cell.t) + '</' + tag + '>'; }
    return '<' + tag + '>' + esc(cell) + '</' + tag + '>';
  }
  function blockHtml(b) {
    switch (b.type) {
      case 'p': return '<p>' + esc(b.text) + '</p>';
      case 'list': return (b.title ? '<h4>' + esc(b.title) + '</h4>' : '') + '<ul>' + b.items.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
      case 'kv': return '<table class="kv"><tbody>' + b.rows.map(function (r) { return '<tr>' + cellHtml(r[0], 'th') + cellHtml(r[1], 'td') + '</tr>'; }).join('') + '</tbody></table>';
      case 'table': return '<div class="tablewrap"><table class="' + (b.cls || '') + '">' + (b.caption ? '<caption>' + esc(b.caption) + '</caption>' : '') + '<thead><tr>' + b.head.map(function (h) { return '<th>' + esc(h) + '</th>'; }).join('') + '</tr></thead><tbody>' + b.rows.map(function (r) { return '<tr>' + r.map(function (x) { return cellHtml(x, 'td'); }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
      case 'plot': return '<figure class="plotfig">' + b.svg + '<figcaption>' + esc(b.caption) + '</figcaption></figure>';
      case 'narrative': return '<div class="narrative"><h4>' + esc(b.title) + '</h4><p>' + b.sentences.map(esc).join(' ') + '</p></div>';
    }
    return '';
  }
  R.build = function (args) {
    var m = buildModel(args), meta = m.meta, out = [];
    out.push('<section class="nsim-report" id="nsim-report">');
    out.push('<header class="rep-head"><h1>' + esc(m.title) + '</h1><p class="rep-meta">' + [meta.sponsor ? 'Sponsor: ' + esc(meta.sponsor) : '', meta.author ? 'Author: ' + esc(meta.author) : '', meta.date ? 'Date: ' + esc(meta.date) : ''].filter(Boolean).join(' | ') + '</p></header>');
    m.sections.forEach(function (s) {
      out.push('<section class="rep-sec" id="rep-' + s.id + '"><h2>' + esc(s.title) + '</h2><p class="guide">' + esc(s.guide) + '</p>' + s.blocks.map(blockHtml).join('') + '</section>');
    });
    out.push('</section>');
    return out.join('\n');
  };
  function mdCell(x) { return String(x && typeof x === 'object' ? (x.list ? x.list.join('; ') : x.t) : x).replace(/\|/g, '/').replace(/\n/g, ' '); }
  R.toMarkdown = function (args) {
    var m = buildModel(args), out = ['# ' + m.title, ''];
    var meta = m.meta, line = [meta.sponsor ? 'Sponsor: ' + meta.sponsor : '', meta.author ? 'Author: ' + meta.author : '', meta.date ? 'Date: ' + meta.date : ''].filter(Boolean).join(' | ');
    if (line) out.push(line, '');
    m.sections.forEach(function (s) {
      out.push('## ' + s.title, '', '_' + s.guide + '_', '');
      s.blocks.forEach(function (b) {
        if (b.type === 'p') out.push(b.text, '');
        else if (b.type === 'list') { if (b.title) out.push('**' + b.title + '**', ''); b.items.forEach(function (x) { out.push('- ' + x); }); out.push(''); }
        else if (b.type === 'kv') { out.push('| Item | Value |', '|---|---|'); b.rows.forEach(function (r) { out.push('| ' + mdCell(r[0]) + ' | ' + mdCell(r[1]) + ' |'); }); out.push(''); }
        else if (b.type === 'table') { if (b.caption) out.push('**' + b.caption + '**', ''); out.push('| ' + b.head.map(mdCell).join(' | ') + ' |', '|' + b.head.map(function () { return '---'; }).join('|') + '|'); b.rows.forEach(function (r) { out.push('| ' + r.map(mdCell).join(' | ') + ' |'); }); out.push(''); }
        else if (b.type === 'plot') out.push('(' + b.caption + ' Plot omitted in the plain-text version.)', '');
        else if (b.type === 'narrative') out.push('**' + b.title + '**', '', b.sentences.join(' '), '');
      });
    });
    return out.join('\n');
  };
  R.document = function (html, css) {
    if (css == null && typeof require === 'function') { try { css = require('fs').readFileSync(require('path').join(__dirname, 'report.css'), 'utf8'); } catch (e) { css = ''; } }
    return '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Simulation report</title><style>' + (css || '') + '</style></head><body>' + html + '</body></html>';
  };

  /* ---------- Checklist ---------- */
  var ITEMS = [
    [1, 'Key questions and objectives of the simulation study'], [2, 'Overall design description and design options, including a benchmark'], [3, 'Scenarios with justification of adequacy'], [4, 'Treatment effect range from null to alternative plus nuisance and operational parameters'],
    [5, 'Type I error under a grid of nuisance values, with the grid justified'], [6, 'Number of simulated trials per scenario and rationale, precision'], [7, 'Fewer iterations acceptable for power; 10,000 as a floor'], [8, 'Monte Carlo standard error for every performance measure'],
    [9, 'Core frequentist operating characteristics'], [10, 'Expected duration, MSE, probability of stopping at each interim'], [11, 'Distribution of results, not only means'], [12, 'Multiple endpoints simulated under the null with their correlation'],
    [13, 'Example single trials with different conclusions'], [14, 'Data-generating process specified'], [15, 'Evidence base for scenario choices'], [16, 'Seeds and reproducibility, different seeds across scenarios'],
    [17, 'Code with seeds, example call and starting seed'], [18, 'Software package named, custom code supplied'], [19, 'Bayesian: design prior distinct from analysis prior'], [20, 'Bayesian calibrated designs: Type I error, power, bias, MSE, coverage, width'],
    [21, 'Bayesian non-calibrated designs: Bayesian power, probability of correct decision'], [22, 'Prior-data conflict and prior sensitivity'], [23, 'MCMC settings and convergence'], [24, 'Scenarios and assumptions pre-specified, comprehensive, plausible'],
    [25, 'Limitations and clinical discussion of results'], [26, 'Summary of overall conclusions, graphs'], [27, 'Explicit link between clinical assumptions and results'], [28, 'Reviewers can verify by re-running'],
    [29, 'Pre-specified analysis software and methods for interim and final analysis'], [30, 'Simulation plan and detailed report for a CID meeting package'], [31, 'Reporting a completed trial: simulations as supplementary material']
  ];
  R.checklist = function (args) {
    var c = ctxOf(args), meta = c.meta, D = c.design, out = [], rl = rulesList(D.rules), hasRules = rl.length > 0 || !!(D.rules && D.rules.final && (D.rules.final.success || D.rules.final.futility));
    var allSE = c.hasResults && c.rows.every(function (r) { return r.res && r.res.summary && r.res.summary.mcse; });
    var seedAll = c.seeds.filter(function (v) { return v != null; }), hasSeeds = c.hasResults && seedAll.length === c.rows.length;
    var distinct = hasSeeds && seedAll.length > 1 && seedAll.some(function (v) { return v !== seedAll[0]; });
    var nNar = Object.keys(c.narr).length, mcmc = D.model && ['logistic3', 'sigmoid', 'hierLogistic'].indexOf(D.model.type) >= 0;
    var hasCov = c.rows.some(function (r) { return r.st && r.st.cov != null; });
    var sectionsPresent = [c.hasDesign, c.rows.length > 0, c.hasResults, c.hasResults && (c.nInterims > 0 || c.hasTrials), c.hasBench, !!(c.grid || c.calib), nNar > 0, hasSeeds && !!c.hash].filter(Boolean).length;
    function put(id, status, note) { out.push({ id: id, item: ITEMS[id - 1][1], status: status, note: note || '' }); }
    put(1, meta.objectives ? 'covered' : 'missing', meta.objectives ? 'Objectives text supplied.' : 'Supply meta.objectives.');
    put(2, c.hasDesign && c.hasBench ? 'covered' : (c.hasDesign ? 'partial' : 'missing'), c.hasDesign ? (c.hasBench ? 'Design and benchmark described.' : 'No benchmark design compared.') : 'No design.');
    put(3, !c.rows.length ? 'missing' : (c.nJust === c.rows.length ? 'covered' : 'partial'), !c.rows.length ? 'No scenarios.' : (c.nJust === c.rows.length ? 'Every scenario has a justification.' : (c.rows.length - c.nJust) + ' scenario(s) without justification.'));
    put(4, c.hasNull && c.hasAlt ? 'covered' : (c.rows.length ? 'partial' : 'missing'), c.hasNull && c.hasAlt ? 'Null and alternative scenarios present.' : (c.rows.length ? 'Only ' + (c.hasNull ? 'null' : 'alternative') + ' scenarios.' : 'No scenarios.'));
    put(5, c.grid && c.grid.rows.length > 1 ? 'covered' : (c.calib || c.hasNull ? 'partial' : 'missing'), c.grid ? 'Null grid with ' + c.grid.rows.length + ' rows.' : (c.calib || c.hasNull ? 'No null grid; Type I error only from calibration or null scenarios.' : 'No Type I error evidence.'));
    put(6, c.nSims ? 'covered' : 'missing', c.nSims ? c.nSims + ' simulated trials per scenario, precision stated.' : 'Number of simulated trials unknown.');
    put(7, !c.nSims ? 'missing' : (c.nSims >= 10000 ? 'covered' : 'partial'), c.nSims ? (c.nSims >= 10000 ? 'At least 10,000 simulated trials.' : 'Fewer than 10,000 simulated trials.') : 'Unknown.');
    put(8, allSE ? 'covered' : (c.hasResults ? 'partial' : 'missing'), allSE ? 'Standard error shown in every table cell.' : 'Some results lack standard errors.');
    put(9, c.hasTrials ? 'covered' : (c.hasResults ? 'partial' : 'missing'), c.hasTrials ? 'All measures computed from trials.' : (c.hasResults ? 'Summary only: no bias, MSE or sample size extremes.' : 'No results.'));
    put(10, c.hasTrials && (c.nInterims === 0 || c.hasResults) ? 'covered' : (c.hasResults ? 'partial' : 'missing'), c.hasTrials ? 'Duration, MSE and stopping by interim reported.' : (c.hasResults ? 'Duration and MSE need trial records.' : 'No results.'));
    put(11, c.hasTrials ? 'covered' : 'missing', c.hasTrials ? 'Sample size quantiles, minimum and maximum reported.' : 'Trial records not kept.');
    put(12, c.hasDesign ? 'covered' : 'missing', c.hasDesign ? 'Single endpoint design: not applicable.' : 'No design.');
    put(13, nNar === 3 ? 'covered' : (nNar > 0 ? 'partial' : 'missing'), nNar + ' of 3 example trials.');
    put(14, c.hasDesign && c.rows.length ? 'covered' : (c.hasDesign ? 'partial' : 'missing'), c.hasDesign ? 'Data-generating process stated in section 2.' : 'No design.');
    put(15, meta.evidence || c.rows.some(function (r) { return r.s.source; }) ? 'covered' : 'missing', meta.evidence ? 'Evidence text supplied.' : 'Supply meta.evidence or scenario sources.');
    put(16, !hasSeeds ? 'missing' : (distinct ? 'covered' : 'partial'), !hasSeeds ? 'Seeds not recorded.' : (distinct ? 'Seeds recorded, different across scenarios.' : 'Seed recorded; one shared seed (common random numbers).'));
    put(17, hasSeeds && c.nSims && c.hasDesign ? 'covered' : (hasSeeds ? 'partial' : 'missing'), 'Example call and starting seed in section 10.');
    put(18, c.version ? 'covered' : 'partial', c.version ? 'Engine version ' + c.version + ' named; code is open (MIT).' : 'Engine version not recorded.');
    put(19, !c.bayes ? 'covered' : (c.rows.length ? 'partial' : 'missing'), !c.bayes ? 'Not applicable: no Bayesian model.' : 'Analysis prior documented; scenarios are fixed values (point design priors).');
    put(20, !c.bayes ? 'covered' : (hasCov && c.hasTrials ? 'covered' : (c.hasTrials ? 'partial' : 'missing')), !c.bayes ? 'Not applicable: no Bayesian model.' : (hasCov ? 'Type I error, power, bias, MSE and coverage reported.' : 'No interval coverage or width recorded.'));
    put(21, !c.bayes ? 'covered' : (c.hasResults ? 'partial' : 'missing'), !c.bayes ? 'Not applicable: no Bayesian model.' : 'Probability of correct arm reported when defined; Bayesian power over a design prior not computed.');
    put(22, !c.bayes ? 'covered' : (c.sens.length > 1 ? 'covered' : (c.sens.length ? 'partial' : 'missing')), !c.bayes ? 'Not applicable: no Bayesian model.' : (c.sens.length ? c.sens.length + ' sensitivity row(s).' : 'No prior sensitivity results.'));
    put(23, !D.model ? 'covered' : (mcmc ? (meta.mcmcDiagnostics ? 'covered' : 'partial') : 'covered'), !D.model ? 'Not applicable: no Bayesian model.' : (mcmc ? 'Metropolis sampling; draws stated, convergence diagnostics not recorded.' : 'No MCMC: exact or grid posterior.'));
    put(24, meta.preSpecified ? 'covered' : (c.hash && c.rows.length ? 'partial' : 'missing'), meta.preSpecified ? 'Scenarios and assumptions stated as pre-specified.' : 'Design hash fixes the design; no statement that scenarios were pre-specified (meta.preSpecified).');
    put(25, meta.limitations ? 'covered' : (c.hasDesign ? 'partial' : 'missing'), meta.limitations ? 'Limitations supplied.' : 'Standard engine limitations only; add meta.limitations.');
    put(26, c.hasResults ? (meta.conclusions ? 'covered' : 'partial') : 'missing', c.hasResults ? (meta.conclusions ? 'Plots and conclusions text.' : 'Plots and key results; no conclusions text (meta.conclusions).') : 'No results.');
    put(27, c.nJust === c.rows.length && c.rows.length && c.hasResults ? 'covered' : (c.hasResults ? 'partial' : 'missing'), c.nJust === c.rows.length && c.rows.length ? 'Justifications sit next to results by scenario.' : 'Scenario justifications incomplete.');
    put(28, hasSeeds && c.hash && c.nSims && c.version ? 'covered' : (hasSeeds || c.hash ? 'partial' : 'missing'), hasSeeds && c.hash && c.nSims && c.version ? 'Seed, design hash, simulated trials and version given.' : 'Need seed, design hash, number of trials and version.');
    put(29, c.hasDesign && hasRules && c.version ? 'covered' : (c.hasDesign ? 'partial' : 'missing'), hasRules ? 'Decision rules listed in section 1.' : 'No decision rules.');
    put(30, sectionsPresent >= 8 ? 'covered' : (sectionsPresent >= 3 ? 'partial' : 'missing'), sectionsPresent + ' of 8 report parts present (design, scenarios, results, adaptation, benchmark, Type I, examples, reproducibility).');
    put(31, c.hasResults ? 'partial' : 'missing', 'This report can serve as supplementary material for a completed trial.');
    out.counts = { covered: 0, partial: 0, missing: 0 };
    out.forEach(function (r) { out.counts[r.status]++; });
    return out;
  };

  NSim.report = R;
  if (typeof module !== 'undefined' && module.exports) module.exports = R;
})(typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : globalThis));
