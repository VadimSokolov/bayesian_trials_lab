/* Copyright 2026 Nytel
 * MIT License. Permission is granted, free of charge, to any person obtaining a copy of this software to use, copy, modify, merge, publish and distribute it, provided this notice is kept. The software is provided "as is", without warranty of any kind.
 *
 * NSim.escalation: dose escalation (phase I) simulator. Plain script, one global (NSim), loads in a browser (script tag, Web Worker importScripts) and in Node (module.exports). Depends on NSim.math (core-math.js).
 *
 * Methods (design.method): '3+3', 'mTPI', 'mTPI2', 'i3+3', 'BOIN', 'CRM', 'BLRM' (alias 'N-CRM').
 *  - 3+3: standard rules, MTD = highest dose with at most 1 DLT in 6 (option allowDeescalate: go back one dose to complete 6 patients).
 *  - mTPI, mTPI2: Ji, Li and Bekele 2007; Guo et al. 2017. Beta(a, b) posterior, equivalence interval (target - epsilon1, target + epsilon2), unit probability mass (mTPI2: sub-intervals of equal width, truncated at 0 and 1). Dose elimination Pr(p > target) > 0.95 with at least 3 patients.
 *  - i3+3: Liu, Yin and Yuan 2020 (arXiv:1901.01303, sections 2.1 to 2.3). With the equivalence interval EI = [target - epsilon1, target + epsilon2]: escalate when y/n is below the EI, stay when it is inside, and when it is above the EI stay if (y-1)/n is below the EI, else de-escalate. Safety rules 1 and 2 are the Pr(p > target) > 0.95 elimination. Final selection: isotonic regression of the posterior means (y + 0.005)/(n + 0.01) (Beta(0.005, 0.005) prior, inverse posterior variance weights), among tried doses with an isotonic estimate at most target + epsilon2 the closest to target, ties to the lowest dose when above target and to the highest otherwise. The inverse-variance weighting is our reading of the paper, which only says that weights are the posterior variance.
 *  - BOIN: Liu and Yuan 2015. Boundaries lambdaE, lambdaD from phi1 = 0.6 target and phi2 = 1.4 target; elimination Pr(p > target) > 0.95 with at least 3 patients; MTD by weighted isotonic regression of (y + 0.05)/(n + 0.1) as in BOIN::select.mtd.
 *  - CRM: O'Quigley, Pepe and Fisher 1990, as dfcrm crm and crmsim. Power model p_j^exp(a) on a skeleton, a ~ N(0, priorVar), posterior on a grid, plug-in estimate at the posterior mean of a, next dose closest to target. restrict (default true): no escalation by more than one level and none right after a DLT.
 *  - BLRM / N-CRM: Neuenschwander, Branson and Gsponer 2008. logit p = alpha + exp(logBeta) log(d/dref), bivariate normal prior on (alpha, logBeta) (alpha can be fixed), grid posterior. Toxicity bands under/target/excess/unacceptable (cut points bands, default 0.16, 0.33, 0.60); a dose passes overdose control when Pr(excess or unacceptable) < overdoseLimit (default 0.25); next dose = min(dose with the highest Pr(target band), highest dose passing overdose control, escalation cap); no dose passing means all doses too toxic and the trial stops.
 *
 * Common design fields: doses (labels or values; required values for BLRM), target, cohortSize (3), maxCohorts (10 when maxN is absent), maxN, startDose (1-based, default 1), stop {maxAtMTD, allTooToxic (true)}, runIn {size, step} (escalate one level per DLT-free cohort of size patients until the first DLT), backfill {size, maxPerDose} (after each cohort, extra patients at the highest lower dose that is not eliminated or overly toxic and has fewer than maxPerDose patients), expansion {n} (extra patients at the selected dose after selection; they do not change the selection). For 3+3, run-in, backfill, maxCohorts and maxN do not apply.
 * Doses are 0-based inside results (arrays); cohort records use 1-based dose levels. DLTs are immediate and binary.
 *
 * Use: NSim.escalation.simulate(design, {truth: [p1, ..., pK]}, {nSims, seed}) returns pSelect, pNone, nPerDose, dltPerDose, meanN, meanDLT, pBand, pOverdose, pOverdoseAlloc, se and one example trial. One random stream per simulated trial (NSim.math.rngFor), so results are reproducible and independent of chunking.
 */
(function (root) {
  'use strict';
  var NSim = root.NSim = root.NSim || {};
  if (!NSim.math && typeof require === 'function') require('./core-math.js');
  var M = NSim.math;
  var E = {};
  var EPS = 1e-9;

  function num(v, d) { return (v == null || v === '' || isNaN(+v)) ? d : +v; }
  function bcdf(x, a, b) { return x <= 0 ? 0 : (x >= 1 ? 1 : M.betaCdf(x, a, b)); }
  function argmaxLast(a) { var b = 0, j; for (j = 1; j < a.length; j++) if (a[j] >= a[b] - 1e-12) b = j; return b; }

  /* ---------- BOIN boundaries and elimination ---------- */
  function boinBounds(target, phi1, phi2) {
    var le = Math.log((1 - phi1) / (1 - target)) / Math.log(target * (1 - phi1) / (phi1 * (1 - target)));
    var ld = Math.log((1 - target) / (1 - phi2)) / Math.log(phi2 * (1 - target) / (target * (1 - phi2)));
    return { lambdaE: le, lambdaD: ld };
  }
  var elimCache = {};
  // Returns f(n, y): true when Pr(p > target | y of n, Beta(a, b) prior) > cutoff. The smallest triggering y is cached per n.
  function elimFn(target, cutoff, a, b) {
    var key = target + '|' + cutoff + '|' + a + '|' + b, cache = elimCache[key] || (elimCache[key] = []);
    return function (n, y) {
      var m = cache[n], x;
      if (m === undefined) {
        m = n + 1;
        for (x = 0; x <= n; x++) if (1 - bcdf(target, a + x, b + n - x) > cutoff) { m = x; break; }
        cache[n] = m;
      }
      return y >= m;
    };
  }

  /* ---------- Rule tables: return 1 escalate, 0 stay, -1 de-escalate ---------- */
  function boinRule(target, phi1, phi2) {
    var b = boinBounds(target, phi1, phi2);
    return function (n, y) { var r = y / n; return r <= b.lambdaE + 1e-12 ? 1 : (r >= b.lambdaD - 1e-12 ? -1 : 0); };
  }
  function i33Rule(target, e1, e2) {
    return function (n, y) {
      var r = y / n, lo = target - e1, hi = target + e2;
      if (r < lo - EPS) return 1;
      if (r > hi + EPS) return (y - 1) / n < lo - EPS ? 0 : -1;
      return 0;
    };
  }
  // mTPI: intervals (0, t - e1), EI, (t + e2, 1). mTPI2: equal-width sub-intervals of width e1 + e2 on both sides of EI.
  function mtpiRule(target, e1, e2, a, b, v2) {
    var lo = Math.max(0, target - e1), hi = Math.min(1, target + e2), edges, eiIdx, i, w = e1 + e2, memo = {};
    if (!v2) { edges = [0, lo, hi, 1]; eiIdx = 1; }
    else {
      var left = [], right = [], x;
      for (x = lo - w; x > 1e-12; x -= w) left.unshift(x);
      for (x = hi + w; x < 1 - 1e-12; x += w) right.push(x);
      edges = [0].concat(left, [lo, hi], right, [1]); eiIdx = left.length + 1;
    }
    return function (n, y) {
      var key = n * 4096 + y, c = memo[key];
      if (c !== undefined) return c;
      var A = a + y, B = b + n - y, best = -1, bi = eiIdx, prev = 0, cur, upm;
      for (i = 0; i < edges.length - 1; i++) {
        cur = bcdf(edges[i + 1], A, B);
        upm = (cur - prev) / (edges[i + 1] - edges[i]); prev = cur;
        if (upm > best + 1e-12 || (i === eiIdx && upm > best - 1e-12)) { best = upm; bi = i; }
      }
      c = bi < eiIdx ? 1 : (bi > eiIdx ? -1 : 0);
      memo[key] = c; return c;
    };
  }

  // Weighted pool adjacent violators (non-decreasing).
  function pava(y, w) {
    var m = y.length, v = [], ww = [], cnt = [], k = 0, i, j, out = new Array(m);
    for (i = 0; i < m; i++) {
      v[k] = y[i]; ww[k] = w[i]; cnt[k] = 1; k++;
      while (k > 1 && v[k - 2] > v[k - 1]) {
        v[k - 2] = (ww[k - 2] * v[k - 2] + ww[k - 1] * v[k - 1]) / (ww[k - 2] + ww[k - 1]); ww[k - 2] += ww[k - 1]; cnt[k - 2] += cnt[k - 1]; k--;
      }
    }
    i = 0; for (j = 0; j < k; j++) for (var c = 0; c < cnt[j]; c++) out[i++] = v[j];
    return out;
  }
  // MTD selection as BOIN::select.mtd: eliminate by data, isotonic regression up to the highest tried admissible dose, closest to target.
  function selectIso(st, K, target, elim, minN) {
    var j, firstElim = K, hi = -1;
    for (j = 0; j < K; j++) if (st.n[j] >= minN && elim(st.n[j], st.y[j])) { firstElim = j; break; }
    if (firstElim === 0) return -1;
    for (j = 0; j < K; j++) if (st.n[j] > 0) hi = j;
    if (hi < 0) return -1;
    var nad = Math.min(hi, firstElim - 1), p = [], w = [], n, y;
    for (j = 0; j <= nad; j++) {
      n = st.n[j]; y = st.y[j];
      p.push((y + 0.05) / (n + 0.1));
      w.push(1 / ((y + 0.05) * (n - y + 0.05) / ((n + 0.1) * (n + 0.1) * (n + 1.1))));
    }
    var iso = pava(p, w), best = 0, bd = Infinity, d;
    for (j = 0; j <= nad; j++) { d = Math.abs(iso[j] + (j + 1) * 1e-10 - target); if (d < bd) { bd = d; best = j; } }
    return best;
  }

  // i3+3 MTD (Liu, Yin and Yuan 2020, section 2.3). Doses removed by the safety rules are not candidates.
  function selectI33(st, K, target, e2, elim, minN) {
    var j, firstElim = K, n, y;
    for (j = 0; j < K; j++) if (st.n[j] >= minN && elim(st.n[j], st.y[j])) { firstElim = j; break; }
    if (firstElim === 0) return -1;
    var p = [], w = [], a, b;
    for (j = 0; j < K; j++) {
      n = st.n[j]; y = st.y[j]; a = y + 0.005; b = n - y + 0.005;
      p.push(a / (a + b)); w.push((a + b) * (a + b) * (a + b + 1) / (a * b));
    }
    var iso = pava(p, w), best = -1, bd = Infinity, d, c = [];
    for (j = 0; j < Math.min(K, firstElim); j++) {
      if (!(st.n[j] > 0) || iso[j] > target + e2 + EPS) continue;
      d = Math.abs(iso[j] - target);
      if (d < bd - 1e-12) { bd = d; best = j; c = [j]; } else if (Math.abs(d - bd) <= 1e-12) c.push(j);
    }
    if (best < 0) return -1;
    return iso[best] > target ? c[0] : c[c.length - 1];
  }

  function ruleFactory(D, K) {
    var rule = D.rule, elim = D.elim, minN = D.elimMinN;
    return function () {
      var gone = new Uint8Array(K);
      return {
        // Safety elimination of every dose that now meets it (backfill can add data at a lower dose).
        update: function (st) {
          for (var j2 = 0; j2 < K; j2++) if (!gone[j2] && st.n[j2] >= minN && elim(st.n[j2], st.y[j2])) { for (var q = j2; q < K; q++) gone[q] = 1; break; }
        },
        decide: function (st, cur) {
          var n = st.n[cur], y = st.y[cur], j, d;
          if (gone[cur]) { j = cur; while (j >= 0 && gone[j]) j--; return { next: j, dec: 'DU' }; }
          if (n >= minN && elim(n, y)) {
            for (j = cur; j < K; j++) gone[j] = 1;
            return { next: cur === 0 ? -1 : cur - 1, dec: 'DU' };
          }
          d = rule(n, y);
          if (d > 0) return (cur === K - 1 || gone[cur + 1]) ? { next: cur, dec: 'S' } : { next: cur + 1, dec: 'E' };
          if (d < 0) return { next: cur > 0 ? cur - 1 : cur, dec: 'D' };
          return { next: cur, dec: 'S' };
        },
        allowed: function (st, j) { return !gone[j] && (st.n[j] === 0 || rule(st.n[j], st.y[j]) >= 0); },
        select: function (st) { return D.method === 'i3+3' ? selectI33(st, K, D.target, D.e2, elim, minN) : selectIso(st, K, D.target, elim, minN); }
      };
    };
  }

  /* ---------- CRM (dfcrm empiric model, grid posterior) ---------- */
  var crmCache = {};
  function crmGrid(skel, sd, G) {
    var key = skel.join(',') + '|' + sd + '|' + G, g = crmCache[key];
    if (g) return g;
    var K = skel.length, a = new Float64Array(G), lp = new Float64Array(G), A = [], B = [], P = [], j, i, h = 12 * sd / (G - 1), e, z;
    for (i = 0; i < G; i++) { a[i] = -6 * sd + i * h; lp[i] = -0.5 * (a[i] / sd) * (a[i] / sd); }
    for (j = 0; j < K; j++) {
      A[j] = new Float64Array(G); B[j] = new Float64Array(G); P[j] = new Float64Array(G);
      for (i = 0; i < G; i++) {
        e = Math.exp(a[i]); z = e * Math.log(skel[j]); // ln p = z <= 0
        A[j][i] = z; P[j][i] = Math.exp(z); B[j][i] = z > -1e-300 ? -745 : Math.log(-Math.expm1(z));
      }
    }
    g = crmCache[key] = { a: a, lp: lp, A: A, B: B, P: P, G: G, w: new Float64Array(G) };
    return g;
  }
  // Posterior of a given counts: mean, variance, weights (in grid.w, valid until the next call).
  function crmPost(grid, n, y, K) {
    var G = grid.G, w = grid.w, i, j, mx = -Infinity, s = 0, m = 0, v = 0, ll;
    for (i = 0; i < G; i++) {
      ll = grid.lp[i];
      for (j = 0; j < K; j++) if (n[j] > 0) ll += y[j] * grid.A[j][i] + (n[j] - y[j]) * grid.B[j][i];
      w[i] = ll; if (ll > mx) mx = ll;
    }
    for (i = 0; i < G; i++) { w[i] = Math.exp(w[i] - mx); s += w[i]; }
    for (i = 0; i < G; i++) { w[i] /= s; m += w[i] * grid.a[i]; }
    for (i = 0; i < G; i++) v += w[i] * (grid.a[i] - m) * (grid.a[i] - m);
    return { mean: m, variance: v };
  }
  function crmEstimate(D, grid, n, y, K) {
    var po = crmPost(grid, n, y, K), est = new Float64Array(K), j, i, ex = Math.exp(po.mean);
    for (j = 0; j < K; j++) {
      if (D.useMeanP) { var s = 0; for (i = 0; i < grid.G; i++) s += grid.w[i] * grid.P[j][i]; est[j] = s; }
      else est[j] = Math.pow(D.skeleton[j], ex);
    }
    return { est: est, mean: po.mean, variance: po.variance };
  }
  function crmNearest(est, target) { var b = 0, j; for (j = 1; j < est.length; j++) if (Math.abs(est[j] - target) < Math.abs(est[b] - target)) b = j; return b; }
  function crmFactory(D, K) {
    var grid = crmGrid(D.skeleton, D.priorSd, D.gridPoints);
    // Pr(p_1 > target) = Pr(a < ln(ln target / ln p_1)) from the posterior weights left in grid.w by the latest estimate.
    function tooToxic() {
      if (!(D.crmStopCut < 1)) return false;
      var lim = Math.log(Math.log(D.target) / Math.log(D.skeleton[0])), pToo = 0, i;
      for (i = 0; i < grid.G; i++) if (grid.a[i] < lim) pToo += grid.w[i];
      return pToo > D.crmStopCut;
    }
    return function () {
      var last = null;
      return {
        decide: function (st, cur, x, want) {
          var f = crmEstimate(D, grid, st.n, st.y, K), next;
          last = f;
          if (tooToxic()) return { next: -1, dec: 'stop' };
          next = crmNearest(f.est, D.target);
          return { next: next, dec: next > cur ? 'E' : (next < cur ? 'D' : 'S'), info: want ? { pTox: Array.prototype.slice.call(f.est) } : null };
        },
        allowed: function (st, j) { return !last || last.est[j] <= D.target + 1e-12; },
        select: function (st) {
          var f = crmEstimate(D, grid, st.n, st.y, K), idx = crmNearest(f.est, D.target), hi = -1, j;
          if (tooToxic()) return -1; // the toxicity stop also applies to the final selection
          if (D.selectTriedOnly) { for (j = 0; j < K; j++) if (st.n[j] > 0) hi = j; if (idx > hi) idx = hi; }
          return idx;
        }
      };
    };
  }

  /* ---------- BLRM / N-CRM (grid posterior) ---------- */
  var blrmCache = {};
  // Grid: Ga rows of alpha (one row when alpha is fixed) by Gb nodes of log beta, log beta uniform with spacing h. Likelihood on the grid, band probabilities by exact integration along log beta (p is monotone in log beta for a given alpha), so only the alpha direction is discretised.
  function blrmModel(D, K) {
    var key = JSON.stringify([D.doses, D.refDose, D.prior, D.fixAlpha, D.gridAlpha, D.gridBeta, D.bandCuts]), m = blrmCache[key];
    if (m) return m;
    var pr = D.prior, rho = pr.rho, Ga, Gb, al = [], lbv = [], lpr = [], i, k, j, z, s, t;
    if (D.fixAlpha != null) { Ga = 1; Gb = 401; al.push(D.fixAlpha); for (k = 0; k < Gb; k++) { t = -5 + 10 * k / (Gb - 1); lbv.push(pr.mu[1] + pr.sd[1] * t); lpr.push(-0.5 * t * t); } }
    else {
      Ga = D.gridAlpha; Gb = D.gridBeta;
      for (i = 0; i < Ga; i++) al.push(pr.mu[0] + pr.sd[0] * (-4 + 8 * i / (Ga - 1)));
      for (k = 0; k < Gb; k++) lbv.push(pr.mu[1] + pr.sd[1] * (-4 + 8 * k / (Gb - 1)));
      for (i = 0; i < Ga; i++) for (k = 0; k < Gb; k++) {
        s = -4 + 8 * i / (Ga - 1); t = -4 + 8 * k / (Gb - 1);
        lpr.push(-(s * s - 2 * rho * s * t + t * t) / (2 * (1 - rho * rho)));
      }
    }
    var G = Ga * Gb, L1 = [], L0 = [], eb = new Float64Array(Gb), ld = [], lc = D.bandCuts.map(M.logit);
    for (k = 0; k < Gb; k++) eb[k] = Math.exp(lbv[k]);
    for (j = 0; j < K; j++) {
      L1[j] = new Float64Array(G); L0[j] = new Float64Array(G); ld[j] = Math.log(D.doses[j] / D.refDose);
      for (i = 0; i < Ga; i++) for (k = 0; k < Gb; k++) {
        z = al[i] + eb[k] * ld[j];
        L1[j][i * Gb + k] = z > 0 ? -Math.log1p(Math.exp(-z)) : z - Math.log1p(Math.exp(z));
        L0[j][i * Gb + k] = z > 0 ? -z - Math.log1p(Math.exp(-z)) : -Math.log1p(Math.exp(z));
      }
    }
    m = blrmCache[key] = { Ga: Ga, Gb: Gb, G: G, al: al, lb0: lbv[0], h: lbv[1] - lbv[0], lpr: Float64Array.from(lpr), L1: L1, L0: L0, ld: ld, lc: lc, w: new Float64Array(G), C: new Float64Array(Gb), rowT: new Float64Array(Ga) };
    return m;
  }
  // Band probabilities per dose: bins[j*4 + b], b = under, target, excess, unacceptable.
  function blrmFit(D, mod, n, y, K) {
    var Ga = mod.Ga, Gb = mod.Gb, G = mod.G, w = mod.w, C = mod.C, h = mod.h, rowT = mod.rowT, i, j, k, m, mx = -Infinity, ll, row, T, Z = 0, ge = new Float64Array(K * 3), bins = new Float64Array(K * 4), x, c, f, r, pos, wk;
    for (i = 0; i < G; i++) {
      ll = mod.lpr[i];
      for (j = 0; j < K; j++) if (n[j] > 0) ll += y[j] * mod.L1[j][i] + (n[j] - y[j]) * mod.L0[j][i];
      w[i] = ll; if (ll > mx) mx = ll;
    }
    for (i = 0; i < G; i++) w[i] = Math.exp(w[i] - mx);
    for (i = 0; i < Ga; i++) {
      row = i * Gb; C[0] = 0;
      for (k = 1; k < Gb; k++) C[k] = C[k - 1] + 0.5 * h * (w[row + k - 1] + w[row + k]);
      T = C[Gb - 1]; Z += T; rowT[i] = T;
      if (T <= 0) continue;
      for (j = 0; j < K; j++) for (m = 0; m < 3; m++) {
        c = mod.lc[m] - mod.al[i];
        if (mod.ld[j] === 0) continue;
        r = c / mod.ld[j];
        if (mod.ld[j] > 0 && r <= 0) { ge[j * 3 + m] += T; continue; }
        if (mod.ld[j] < 0 && r <= 0) continue;
        x = Math.log(r); pos = (x - mod.lb0) / h;
        if (pos <= 0) f = 0; else if (pos >= Gb - 1) f = T;
        else { k = Math.floor(pos); wk = x - (mod.lb0 + k * h); f = C[k] + 0.5 * wk * (2 * w[row + k] + (w[row + k + 1] - w[row + k]) * wk / h); }
        ge[j * 3 + m] += mod.ld[j] > 0 ? T - f : f;
      }
    }
    for (j = 0; j < K; j++) { // dose at the reference dose: p = expit(alpha), integrate along the alpha grid with a trapezoid cdf
      if (mod.ld[j] !== 0) continue;
      var hA = Ga > 1 ? mod.al[1] - mod.al[0] : 1, CA = new Float64Array(Ga), TA, xa, pa, ka, wa;
      for (i = 1; i < Ga; i++) CA[i] = CA[i - 1] + 0.5 * hA * (rowT[i - 1] + rowT[i]);
      TA = CA[Ga - 1];
      for (m = 0; m < 3; m++) {
        xa = mod.lc[m];
        if (Ga === 1) f = xa > mod.al[0] ? 0 : Z;
        else {
          pa = (xa - mod.al[0]) / hA;
          if (pa <= 0) f = TA; else if (pa >= Ga - 1) f = 0;
          else { ka = Math.floor(pa); wa = xa - (mod.al[0] + ka * hA); f = TA - (CA[ka] + 0.5 * wa * (2 * rowT[ka] + (rowT[ka + 1] - rowT[ka]) * wa / hA)); }
          f = TA > 0 ? f * Z / TA : 0;
        }
        ge[j * 3 + m] = f;
      }
    }
    for (j = 0; j < K; j++) {
      var g0 = ge[j * 3] / Z, g1 = ge[j * 3 + 1] / Z, g2 = ge[j * 3 + 2] / Z;
      bins[j * 4] = Math.max(1 - g0, 0); bins[j * 4 + 1] = Math.max(g0 - g1, 0); bins[j * 4 + 2] = Math.max(g1 - g2, 0); bins[j * 4 + 3] = g2;
    }
    var pOver = new Float64Array(K), pTarget = new Float64Array(K);
    for (j = 0; j < K; j++) { pOver[j] = bins[j * 4 + 2] + bins[j * 4 + 3]; pTarget[j] = bins[j * 4 + 1]; }
    return { bins: bins, pOver: pOver, pTarget: pTarget };
  }
  function blrmChoose(D, f, K) { // returns { tgt, hiAdm, adm }
    var hiAdm = -1, j, adm = new Uint8Array(K);
    for (j = 0; j < K; j++) if (f.pOver[j] < D.overdoseLimit) { adm[j] = 1; hiAdm = j; }
    return { tgt: argmaxLast(f.pTarget), hiAdm: hiAdm, adm: adm };
  }
  function blrmFactory(D, K) {
    var mod = blrmModel(D, K);
    return function () {
      var lastAdm = null;
      return {
        decide: function (st, cur, x, want) {
          var f = blrmFit(D, mod, st.n, st.y, K), c = blrmChoose(D, f, K), next;
          lastAdm = c.adm;
          next = c.hiAdm < 0 ? -1 : Math.min(c.tgt, c.hiAdm);
          return { next: next, dec: next < 0 ? 'stop' : (next > cur ? 'E' : (next < cur ? 'D' : 'S')),
            info: want ? { pTox: null, pOver: Array.prototype.slice.call(f.pOver), pTarget: Array.prototype.slice.call(f.pTarget), admissible: Array.prototype.slice.call(c.adm) } : null };
        },
        allowed: function (st, j) { return !lastAdm || lastAdm[j] === 1; },
        select: function (st) {
          var f = blrmFit(D, mod, st.n, st.y, K), c = blrmChoose(D, f, K), idx, hi = -1, j;
          if (c.hiAdm < 0) return -1;
          idx = Math.min(c.tgt, c.hiAdm);
          if (D.selectTriedOnly) { for (j = 0; j < K; j++) if (st.n[j] > 0) hi = j; if (idx > hi) idx = hi; }
          return idx;
        }
      };
    };
  }

  /* ---------- Design preparation ---------- */
  function normMethod(m) {
    var s = String(m || '').toLowerCase().replace(/[\s_]/g, '');
    if (s === '3+3' || s === '3p3' || s === 'threeplusthree') return '3+3';
    if (s === 'mtpi') return 'mTPI';
    if (s === 'mtpi2' || s === 'mtpi-2') return 'mTPI2';
    if (s === 'i3+3' || s === 'i3p3') return 'i3+3';
    if (s === 'boin') return 'BOIN';
    if (s === 'crm') return 'CRM';
    if (s === 'blrm' || s === 'ncrm' || s === 'n-crm') return 'BLRM';
    return null;
  }
  function truthOf(sc) { return (sc && (sc.truth || sc.pTox || sc.pTrue || sc.p)) || null; }
  function defaultSkeleton(target, K) {
    var nu = Math.floor((K - 1) / 2), sk = [], j;
    for (j = 0; j < K; j++) sk.push(M.expit(M.logit(target) + 0.7 * (j - nu)));
    return sk;
  }
  function prepare(design, scenario) {
    var truth = truthOf(scenario), D = {}, st = design.stop || {}, K, j, errs = [];
    D.method = normMethod(design.method);
    if (!D.method) throw new Error('escalation: unknown method ' + design.method);
    if (!truth || !truth.length) throw new Error('escalation: scenario.truth (true DLT probabilities per dose) is required');
    K = D.K = truth.length;
    for (j = 0; j < K; j++) if (!(truth[j] >= 0 && truth[j] <= 1)) errs.push('truth must be in [0, 1]');
    D.truth = Array.prototype.slice.call(truth);
    D.target = num(design.target, 0.3);
    if (!(D.target > 0 && D.target < 1)) errs.push('target must be in (0, 1)');
    D.cohortSize = Math.max(1, Math.floor(num(design.cohortSize, 3)));
    D.maxN = num(design.maxN != null ? design.maxN : st.maxN, Infinity);
    D.maxCohorts = num(design.maxCohorts != null ? design.maxCohorts : st.maxCohorts, isFinite(D.maxN) ? Infinity : 10);
    D.start = Math.min(K, Math.max(1, Math.floor(num(design.startDose, 1)))) - 1;
    D.maxAtMTD = num(st.maxAtMTD != null ? st.maxAtMTD : design.maxAtMTD, Infinity);
    D.continueIfAllToxic = st.allTooToxic === false;
    D.doses = design.doses && design.doses.length === K ? design.doses.slice() : null;
    if (design.doses && design.doses.length !== K) errs.push('doses must have one entry per scenario dose (' + K + ')');
    var cuts = design.bands || [0.533 * D.target, 1.1 * D.target, 2 * D.target];
    D.bandCuts = cuts.slice(0, 3);
    D.doseBand = D.truth.map(function (p) { return p < D.bandCuts[0] ? 0 : (p < D.bandCuts[1] ? 1 : (p < D.bandCuts[2] ? 2 : 3)); });
    D.elimCutoff = num(design.elimCutoff, 0.95); D.elimMinN = num(design.elimMinN, 3);
    D.selectTriedOnly = design.selectTriedOnly;
    var ri = design.runIn;
    D.runIn = ri ? { size: Math.max(1, Math.floor(num(ri.size, 1))), step: Math.max(1, Math.floor(num(ri.step, 1))) } : null;
    var bf = design.backfill;
    D.backfill = bf && bf.enabled !== false ? { size: Math.max(1, Math.floor(num(bf.size, D.cohortSize))), maxPerDose: num(bf.maxPerDose, 12) } : null;
    var ex = design.expansion;
    D.expansion = ex ? Math.max(0, Math.floor(typeof ex === 'number' ? ex : num(ex.n, 0))) : 0;
    D.allowDeescalate = !!design.allowDeescalate;
    D.esc = null;
    var m = D.method, e1 = num(design.epsilon1, num(design.epsilon, 0.05)), e2 = num(design.epsilon2, num(design.epsilon, 0.05));
    var pa = num(design.priorA, 1), pb = num(design.priorB, 1);
    if (m === 'BOIN') {
      D.phi1 = num(design.phi1, 0.6 * D.target); D.phi2 = num(design.phi2, 1.4 * D.target);
      if (!(D.phi1 < D.target && D.target < D.phi2)) errs.push('need phi1 < target < phi2');
      D.rule = boinRule(D.target, D.phi1, D.phi2); D.elim = elimFn(D.target, D.elimCutoff, 1, 1);
    } else if (m === 'mTPI' || m === 'mTPI2') {
      D.rule = mtpiRule(D.target, e1, e2, pa, pb, m === 'mTPI2'); D.elim = elimFn(D.target, D.elimCutoff, pa, pb);
    } else if (m === 'i3+3') {
      D.e2 = e2; D.rule = i33Rule(D.target, e1, e2); D.elim = elimFn(D.target, D.elimCutoff, 1, 1);
    } else if (m === 'CRM') {
      D.skeleton = design.skeleton ? design.skeleton.slice() : defaultSkeleton(D.target, K);
      if (D.skeleton.length !== K) errs.push('skeleton must have one entry per dose');
      for (j = 0; j < D.skeleton.length; j++) if (!(D.skeleton[j] > 0 && D.skeleton[j] < 1)) errs.push('skeleton must be in (0, 1)');
      D.priorSd = design.priorSd != null ? +design.priorSd : Math.sqrt(num(design.priorVar, 1.34));
      D.gridPoints = Math.max(61, Math.floor(num(design.gridPoints, 241)));
      D.useMeanP = design.estimate === 'meanP';
      D.crmStopCut = design.stopTooToxic != null ? +design.stopTooToxic : 1; // dfcrm has no such stop; set 0.9 to stop when Pr(p1 > target) > 0.9
      if (design.stop && design.stop.allTooToxic === false) D.crmStopCut = 1;
      var rs = design.restrict !== false;
      D.esc = { maxStep: num(design.maxStep, rs ? 1 : Infinity), noAfterDLT: design.noEscalateAfterDLT != null ? !!design.noEscalateAfterDLT : rs, from: design.stepFrom === 'highest' ? 'highest' : 'current' };
    } else if (m === 'BLRM') {
      if (!D.doses) D.doses = D.truth.map(function (_, i) { return i + 1; });
      D.refDose = num(design.refDose, D.doses[Math.floor(K / 2)]);
      var pri = design.prior || {};
      D.prior = { mu: (pri.mu || [M.logit(D.target), 0]).slice(), sd: (pri.sd || [2, 1]).slice(), rho: num(pri.rho, 0) };
      D.fixAlpha = design.fixAlpha != null ? +design.fixAlpha : null;
      D.gridAlpha = Math.max(15, Math.floor(num(design.gridAlpha, 50))); D.gridBeta = Math.max(15, Math.floor(num(design.gridBeta, 50)));
      D.overdoseLimit = num(design.overdoseLimit, 0.25);
      if (D.selectTriedOnly == null) D.selectTriedOnly = true;
      D.esc = { maxStep: num(design.maxStep, 1), noAfterDLT: !!design.noEscalateAfterDLT, from: design.stepFrom === 'highest' ? 'highest' : 'current' };
      for (j = 0; j < K; j++) if (!(D.doses[j] > 0)) errs.push('BLRM needs positive dose values');
    }
    if (m === 'CRM' && D.selectTriedOnly == null) D.selectTriedOnly = false;
    if (errs.length) throw new Error('escalation: ' + errs.join('; '));
    if (m === '3+3') D.make = null;
    else D.make = m === 'CRM' ? crmFactory(D, K) : (m === 'BLRM' ? blrmFactory(D, K) : ruleFactory(D, K));
    return D;
  }
  E.validate = function (design, scenario) { try { prepare(design, scenario); return []; } catch (e) { return [e.message]; } };

  /* ---------- Trial runners ---------- */
  function newState(K) { return { n: new Int32Array(K), y: new Int32Array(K) }; }
  function addRecord(D, rec, o) { if (rec) { o.cohort = rec.length + 1; o.dose = o.doseIdx + 1; if (D.doses) o.doseValue = D.doses[o.doseIdx]; delete o.doseIdx; rec.push(o); } return o; }

  function finishTrial(D, st, sel, rng, rec, stopped, N, nExtra) {
    var K = D.K, x, m = 0;
    if (D.expansion > 0 && sel >= 0) {
      m = D.expansion; x = rng.binomial(m, D.truth[sel]);
      st.n[sel] += m; st.y[sel] += x; N += m;
      addRecord(D, rec, { type: 'expansion', doseIdx: sel, n: m, dlt: x, cumN: st.n[sel], cumDlt: st.y[sel], decision: 'expand' });
    }
    var dlt = 0, j; for (j = 0; j < K; j++) dlt += st.y[j];
    return { n: st.n, y: st.y, sel: sel, N: N, dlt: dlt, stopped: stopped, expansionN: m };
  }

  function trial3p3(D, rng, rec) {
    var K = D.K, st = newState(K), cur = D.start, toxicFrom = K, sel = -2, N = 0, x, esc, n, y;
    for (var guard = 0; guard < 10000; guard++) {
      x = rng.binomial(3, D.truth[cur]); st.n[cur] += 3; st.y[cur] += x; N += 3; n = st.n[cur]; y = st.y[cur];
      if (n === 3) esc = y === 0 ? 1 : (y === 1 ? 0 : -1); else esc = y <= 1 ? 1 : -1;
      var rc = addRecord(D, rec, { type: 'main', doseIdx: cur, n: 3, dlt: x, cumN: n, cumDlt: y, decision: esc > 0 ? 'E' : (esc === 0 ? 'S' : 'D') });
      if (esc === 0) { rc.next = cur + 1; continue; }
      if (esc > 0) {
        if (cur === K - 1 || cur + 1 >= toxicFrom) { sel = cur; rc.decision = 'select'; break; }
        cur++; rc.next = cur + 1; continue;
      }
      toxicFrom = Math.min(toxicFrom, cur);
      if (cur === 0) { sel = -1; rc.decision = 'stop'; break; }
      if (!D.allowDeescalate || st.n[cur - 1] >= 6) { sel = cur - 1; rc.decision = 'select'; break; }
      cur--; rc.next = cur + 1;
    }
    return finishTrial(D, st, sel, rng, rec, sel < 0, N);
  }

  function trial(D, rng, rec) {
    if (D.method === '3+3') return trial3p3(D, rng, rec);
    var K = D.K, st = newState(K), ad = D.make(), cur = D.start, N = 0, nCoh = 0, hi = cur, stopped = false;
    var runActive = !!D.runIn, size, x, next, r, rc, j, jj, base, bsz, bx, finished;
    // The next dose from the current data (the dose just treated is cur, with xc DLTs in the latest cohort).
    function pick(xc) {
      var rr = ad.decide(st, cur, xc, !!rec), nx = rr.next;
      if (nx < 0 && D.continueIfAllToxic) nx = 0;
      if (nx > cur && D.esc) {
        base = D.esc.from === 'highest' ? hi : cur;
        if (nx > base + D.esc.maxStep) nx = base + D.esc.maxStep;
        if (D.esc.noAfterDLT && xc > 0 && nx > cur) nx = cur;
      }
      rr.next = nx; return rr;
    }
    for (;;) {
      if (nCoh >= D.maxCohorts || N >= D.maxN) break;
      size = Math.min(runActive ? D.runIn.size : D.cohortSize, D.maxN - N);
      x = rng.binomial(size, D.truth[cur]);
      st.n[cur] += size; st.y[cur] += x; N += size; nCoh++; if (cur > hi) hi = cur;
      rc = addRecord(D, rec, { type: runActive ? 'run-in' : 'main', doseIdx: cur, n: size, dlt: x, cumN: st.n[cur], cumDlt: st.y[cur] });
      finished = nCoh >= D.maxCohorts || N >= D.maxN;
      if (runActive && x > 0) runActive = false;
      if (finished) { if (rc) rc.decision = 'end'; break; }
      if (runActive) { next = Math.min(cur + D.runIn.step, K - 1); r = { dec: 'run-in' }; }
      else { r = pick(x); next = r.next; }
      if (rc) { rc.decision = r.dec; rc.next = next + 1; if (r.info) rc.info = r.info; }
      if (next < 0) { stopped = true; break; }
      if (st.n[next] >= D.maxAtMTD) { if (rc) rc.decision = 'max-at-mtd'; break; }
      if (D.backfill && !runActive && N < D.maxN) {
        jj = -1;
        for (j = next - 1; j >= 0; j--) if (st.n[j] < D.backfill.maxPerDose && ad.allowed(st, j)) { jj = j; break; }
        if (jj >= 0) {
          bsz = Math.min(D.backfill.size, D.maxN - N); bx = rng.binomial(bsz, D.truth[jj]);
          st.n[jj] += bsz; st.y[jj] += bx; N += bsz;
          addRecord(D, rec, { type: 'backfill', doseIdx: jj, n: bsz, dlt: bx, cumN: st.n[jj], cumDlt: st.y[jj], decision: 'backfill' });
          // The backfill data count: rerun the safety elimination and the allocation decision before the next cohort.
          if (ad.update) ad.update(st);
          r = pick(x); next = r.next;
          if (rc) { rc.decision = r.dec; rc.next = next + 1; }
          if (next < 0) { stopped = true; break; }
          if (st.n[next] >= D.maxAtMTD) { if (rc) rc.decision = 'max-at-mtd'; break; }
        }
      }
      cur = next;
    }
    var sel = stopped ? -1 : ad.select(st);
    return finishTrial(D, st, sel, rng, rec, stopped || sel < 0, N);
  }

  /* One recorded trial (used by tests and the studio): returns { n, y, sel, N, dlt, stopped, cohorts }. */
  E.runTrial = function (design, scenario, opts) {
    var D = prepare(design, scenario), o = opts || {}, rng = M.rngFor(num(o.seed, 1), num(o.index, 0)), rec = [];
    var t = trial(D, rng, rec); t.cohorts = rec; t.selected = t.sel + 1; return t;
  };

  /* ---------- Simulation ---------- */
  E.simulate = function (design, scenario, opts) {
    var o = opts || {}, nSims = Math.max(1, Math.floor(num(o.nSims, 1000))), seed = num(o.seed, 1), D = prepare(design, scenario), K = D.K;
    var t0 = Date.now(), sel = new Float64Array(K), sn = new Float64Array(K), sn2 = new Float64Array(K), sy = new Float64Array(K), sy2 = new Float64Array(K);
    var none = 0, tN = 0, tN2 = 0, tD = 0, tD2 = 0, band = [0, 0, 0, 0], sOv = 0, sOv2 = 0, sOvN = 0, bandAlloc = [0, 0, 0, 0], i, j, t, ex = null, rec;
    for (i = 0; i < nSims; i++) {
      rec = i === 0 ? [] : null;
      t = trial(D, M.rngFor(seed, i), rec);
      if (i === 0) ex = { cohorts: rec, selected: t.sel + 1, n: Array.prototype.slice.call(t.n), dlt: Array.prototype.slice.call(t.y), stopped: t.stopped };
      if (t.sel >= 0) { sel[t.sel]++; band[D.doseBand[t.sel]]++; } else none++;
      var ov = 0;
      for (j = 0; j < K; j++) { sn[j] += t.n[j]; sn2[j] += t.n[j] * t.n[j]; sy[j] += t.y[j]; sy2[j] += t.y[j] * t.y[j]; if (D.doseBand[j] >= 2) ov += t.n[j]; bandAlloc[D.doseBand[j]] += t.n[j]; }
      sOv += ov; sOv2 += ov * ov; sOvN += ov * t.N;
      tN += t.N; tN2 += t.N * t.N; tD += t.dlt; tD2 += t.dlt * t.dlt;
    }
    function se(p) { return Math.sqrt(Math.max(p * (1 - p), 0) / nSims); }
    function seMean(s, s2) { var m = s / nSims; return Math.sqrt(Math.max(s2 / nSims - m * m, 0) / nSims); }
    var pSelect = [], nPer = [], dPer = [], seSel = [], seN = [], seD = [], pBand = {}, names = ['under', 'target', 'excess', 'unacceptable'], seBand = {};
    for (j = 0; j < K; j++) { pSelect.push(sel[j] / nSims); seSel.push(se(sel[j] / nSims)); nPer.push(sn[j] / nSims); seN.push(seMean(sn[j], sn2[j])); dPer.push(sy[j] / nSims); seD.push(seMean(sy[j], sy2[j])); }
    for (j = 0; j < 4; j++) { pBand[names[j]] = band[j] / nSims; seBand[names[j]] = se(band[j] / nSims); }
    var pOver = pBand.excess + pBand.unacceptable, tot = tN || 1, rA = sOv / tot, seA = Math.sqrt(Math.max((sOv2 - 2 * rA * sOvN + rA * rA * tN2) / nSims, 0) / nSims) / (tN / nSims || 1); // ratio estimator: patients at excess or unacceptable doses over all patients
    return {
      method: D.method, nSims: nSims, seed: seed, nDoses: K, truth: D.truth, doses: D.doses, target: D.target, bandCuts: D.bandCuts, doseBand: D.doseBand,
      pSelect: pSelect, pNone: none / nSims, pStoppedEarly: none / nSims, nPerDose: nPer, dltPerDose: dPer, meanN: tN / nSims, meanDLT: tD / nSims,
      pBand: pBand, pOverdose: pOver, pOverdoseAlloc: rA, pAllocBand: bandAlloc.map(function (v) { return v / tot; }),
      se: { pSelect: seSel, pNone: se(none / nSims), nPerDose: seN, dltPerDose: seD, meanN: seMean(tN, tN2), meanDLT: seMean(tD, tD2), pBand: seBand, pOverdose: se(pOver), pOverdoseAlloc: seA },
      example: ex, elapsedMs: Date.now() - t0
    };
  };

  /* ---------- Exact and utility functions ---------- */
  // Exact 3+3 (no de-escalation): probability of selecting each dose, expected patients and DLTs per dose.
  E.threePlusThreeExact = function (pTrue) {
    var K = pTrue.length, reach = 1, esc = [], reachP = [], nP = [], dP = [], pSel = [], j, p, q, p1, m = 0, dd = 0;
    for (j = 0; j < K; j++) {
      p = pTrue[j]; q = 1 - p; p1 = 3 * p * q * q; // Pr(exactly 1 DLT in 3)
      esc.push(q * q * q + p1 * q * q * q); reachP.push(reach);
      nP.push(reach * (3 + 3 * p1)); dP.push(reach * 3 * p * (1 + p1));
      reach *= esc[j]; m += nP[j]; dd += dP[j];
    }
    for (j = 0; j < K; j++) pSel.push(reachP[j] * esc[j] * (j + 1 < K ? 1 - esc[j + 1] : 1));
    return { pEscalate: esc, pSelect: pSel, pNone: 1 - esc[0], nPerDose: nP, dltPerDose: dP, meanN: m, meanDLT: dd };
  };
  // BOIN decision boundaries (BOIN::get.boundary) for n = cohortSize, 2 cohortSize, ... maxCohorts cohorts.
  E.boinBoundaries = function (target, opts) {
    var o = opts || {}, phi1 = num(o.phi1, 0.6 * target), phi2 = num(o.phi2, 1.4 * target), cs = num(o.cohortSize, 3), nc = num(o.maxCohorts, 10), cut = num(o.elimCutoff, 0.95);
    var b = boinBounds(target, phi1, phi2), el = elimFn(target, cut, 1, 1), rows = [], i, n, e, d, x, m;
    for (i = 1; i <= nc; i++) {
      n = i * cs; e = Math.floor(b.lambdaE * n + 1e-12); d = Math.ceil(b.lambdaD * n - 1e-12);
      m = null; for (x = 0; x <= n; x++) if (el(n, x)) { m = x; break; }
      rows.push({ n: n, escalateIfLE: e, deescalateIfGE: d, eliminateIfGE: n >= 3 ? m : null });
    }
    return { lambdaE: b.lambdaE, lambdaD: b.lambdaD, phi1: phi1, phi2: phi2, table: rows };
  };
  // Decision table for the rule-based designs: table[n][y] in 'E', 'S', 'D', 'DU' (eliminate), n = 1..maxN.
  E.decisionTable = function (design, maxN) {
    var D = prepare(Object.assign({}, design, { method: design.method }), { truth: [0.1, 0.2] }), out = [], n, y, row, d;
    if (!D.rule) throw new Error('escalation: decisionTable needs a rule-based method');
    for (n = 1; n <= (maxN || 24); n++) {
      row = [];
      for (y = 0; y <= n; y++) { if (n >= D.elimMinN && D.elim(n, y)) row.push('DU'); else { d = D.rule(n, y); row.push(d > 0 ? 'E' : (d < 0 ? 'D' : 'S')); } }
      out.push(row);
    }
    return out;
  };
  // CRM posterior for given data: { skeleton, target, priorVar | priorSd, level (1-based), tox } -> postMeanA, postVarA, ptox, next.
  E.crmFit = function (o) {
    var K = o.skeleton.length, sd = o.priorSd != null ? +o.priorSd : Math.sqrt(num(o.priorVar, 1.34)), grid = crmGrid(o.skeleton, sd, num(o.gridPoints, 801));
    var n = new Int32Array(K), y = new Int32Array(K), i;
    for (i = 0; i < o.level.length; i++) { n[o.level[i] - 1]++; y[o.level[i] - 1] += o.tox[i]; }
    var f = crmEstimate({ skeleton: o.skeleton, useMeanP: o.estimate === 'meanP' }, grid, n, y, K);
    return { postMeanA: f.mean, postVarA: f.variance, ptox: Array.prototype.slice.call(f.est), next: crmNearest(f.est, o.target) + 1 };
  };
  // BLRM posterior summary: design as for simulate (doses, prior, bands, overdoseLimit), data n[], y[] per dose -> bands per dose, pOver, pTarget, admissible, nextDose (1-based).
  E.blrmFit = function (design, n, y) {
    var K = n.length, D = prepare(Object.assign({}, design, { method: 'BLRM' }), { truth: new Array(K).fill(0.1) });
    var mod = blrmModel(D, K), f = blrmFit(D, mod, Int32Array.from(n), Int32Array.from(y), K), c = blrmChoose(D, f, K);
    return { bins: Array.prototype.slice.call(f.bins), pOver: Array.prototype.slice.call(f.pOver), pTarget: Array.prototype.slice.call(f.pTarget), admissible: Array.prototype.slice.call(c.adm),
      nextDose: c.hiAdm < 0 ? 0 : Math.min(c.tgt, c.hiAdm) + 1 };
  };

  NSim.escalation = E;
  if (typeof module !== 'undefined' && module.exports) module.exports = E;
})(typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : globalThis));
