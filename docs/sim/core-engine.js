/* Copyright 2026 Nytel
 * MIT License. Permission is granted, free of charge, to any person obtaining a copy of this software to use, copy, modify, merge, publish and distribute it, provided this notice is kept. The software is provided "as is", without warranty of any kind.
 *
 * NSim.core: the Core engine (Phase A) of the Bayesian Clinical Trials Lab simulator: continuous and dichotomous endpoints, up to 8 doses plus control, final-endpoint dose-response models (models.js), Poisson accrual with regions, dropout per arm, interims by enrolled, completers or opportunity counts, fixed or response-adaptive allocation, arm dropping, decision quantities and rules, the seven FACTS outcome codes.
 *
 * Design
 * - Common random numbers: simulated trial s has one seeded stream (core-math streamFor(seed, s)) that fixes, before any design decision, every patient's arrival time (inverse of the cumulative accrual intensity), dropout uniform, allocation uniform and a latent outcome under every arm. The same patients are therefore seen by every design, scenario threshold and rule set. Posterior draws use separate streams keyed by (seed, trial, analysis), so a path does not depend on whether it is simulated alone or with others.
 * - Time: a patient completes at arrival + final visit week (Phase A has one visit at the end). An interim is triggered by the count of enrolled patients, completers (non-dropouts who finished) or opportunity (finished or would have finished). Interim analyses use completers only. Allocation changes only at interims; arms are assigned lazily so the regime in force at each arrival is the right one.
 * - Path and rules: a trial path is the list of analyses (interims, plus the final analysis, plus the follow-up analysis after each possible early stop). Rules only read the saved QOIs of the path, so reEvaluate(saved, newRules) re-applies new thresholds without re-simulating (allocation and arm-dropping rules are fixed by the saved run). Use opts.savePath = true to keep complete paths (the trial then continues past decisions).
 * - Early stop: accrual stops, enrolled patients complete follow-up (or data are locked with interims.followUp = 'lock'), then the final rules are evaluated on all enrolled. Outcome codes: 1 early success, 2 late success, 3 late futility, 4 early futility, 5 success-to-futility flip-flop, 6 futility-to-success flip-flop, 7 inconclusive. Futility wins ties. Assumption (stated, not taken from FACTS text): an early stop whose follow-up analysis is neither success nor futility keeps its interim label (1 or 4); only a reversal to the opposite decision is a flip-flop.
 * - Historical borrowing for the control arm (opt-in, design.borrowing; models independent, independentBeta, ndlm family and hierarchical, where the control is a priori independent of the doses): {method: 'hierarchical' | 'power' | 'robust', historical: [{n, r} (dichotomous) or {n, mean, sd} (continuous)], ...}. 'hierarchical': study parameters exchangeable around mu with between-study SD tau; tau: {fixed} | {prior: 'halfNormal', scale} (default; scale 1 on the logit, 0.5 sigma for means) | {prior: 'grid', values, weights}; mu: {mean, sd}. Dichotomous: exact binomial historical likelihoods, mu and tau integrated on grids, the meta-analytic predictive prior of the control logit kept as a density on a grid (posterior exact by multiplying with the binomial likelihood). Continuous: normal mixture over the tau grid, exact. Dynamic borrowing: the tau posterior weights shrink the borrowing when the historical studies disagree. 'power': prior from the historical data with weight a0 (number or one per study), initial Beta(initial.a, initial.b) default (1, 1). 'robust': mixture (1 - robustWeight) informative + robustWeight vague, informative from historical (with a0) or given as informative {a, b} | {mean, sd}; vague {a, b} default Beta(1, 1), or {mean, sd} default N(informative mean, sigma^2); posterior mixture weights updated exactly by the marginal likelihood of each component. Continuous control posteriors treat sigma^2 as known at its posterior mean from the current data (sigma reference for the prior from borrowing.sigma, else the pooled historical SD). Each fit reports prior ESS (moment and ELIR of Neuenschwander et al. 2020, validated against RBesT) and, per analysis and trial, the posterior weight on the informative component (wInf, mixtures), the posterior ESS and the effective number of borrowed patients (posterior ESS minus control patients analysed, floored at 0); summary.borrowing has the means over trials. p-value, z and conditional power QOIs do not use borrowing. Morita ESS is not implemented.
 * - Approximations: predictive probability uses independent-arm normal or Beta approximations for the final Bayesian criterion and a thinned subset of posterior draws (default 250); conditional power uses the frequentist current-trend formula with information fraction (analysed completers) / maxN; p-values are one-sided z tests (no t correction); Dunnett adjustment is exact for the z statistics (one-factor structure of the many-to-one correlations, one-dimensional quadrature); Bonferroni multiplies by the number of dose arms.
 */
(function (root) {
  'use strict';
  var NSim = root.NSim = root.NSim || {};
  if (!NSim.math && typeof require === 'function') require('./core-math.js');
  if (!NSim.models && typeof require === 'function') require('./models.js');
  var M = NSim.math, Mod = NSim.models;
  var C = {};
  C.version = '0.1.0';
  var OUTCOMES = ['', 'Early Success', 'Late Success', 'Late Futility', 'Early Futility', 'Success-to-Futility', 'Futility-to-Success', 'Inconclusive'];
  C.outcomeNames = OUTCOMES;
  var DRAW_QOIS = { postProb: 1, prMax: 1, prED: 1, med: 1, pAnyEffective: 1, predProb: 1 };

  /* ---------- Accrual ---------- */
  function regionRate(r, t) {
    var u = t - (r.startWeek || 0);
    if (u < 0) return 0;
    var f = 1, up = r.rampUpWeeks || 0, dn = r.rampDownWeeks || 0;
    if (up > 0 && u < up) f = u / up;
    if (r.durationWeeks != null) {
      if (u >= r.durationWeeks) return 0;
      var left = r.durationWeeks - u;
      if (dn > 0 && left < dn) f = Math.min(f, left / dn);
    }
    return r.peakPerWeek * f;
  }
  var gridCache = {};
  function accrualGrid(acc, N) {
    var key = JSON.stringify([acc, N]);
    if (gridCache[key]) return gridCache[key];
    var dt = 0.05, Lam = [0], t = 0, rate0 = 0, rate1, i, regions = acc.regions;
    function rate(tt) { var s = 0; for (var q = 0; q < regions.length; q++) s += regionRate(regions[q], tt); return s; }
    rate0 = rate(0);
    while (Lam[Lam.length - 1] < N + 1 && t < 5000) {
      t += dt; rate1 = rate(t); Lam.push(Lam[Lam.length - 1] + 0.5 * (rate0 + rate1) * dt); rate0 = rate1;
    }
    if (Lam[Lam.length - 1] < N + 1) throw new Error('accrual profile cannot reach full accrual of ' + N + ' subjects within 5000 weeks');
    var g = { dt: dt, Lam: Float64Array.from(Lam) };
    if (Object.keys(gridCache).length > 50) gridCache = {};
    gridCache[key] = g;
    return g;
  }
  function invLam(g, E) {
    var L = g.Lam, lo = 0, hi = L.length - 1, mid;
    while (hi - lo > 1) { mid = (lo + hi) >> 1; if (L[mid] <= E) lo = mid; else hi = mid; }
    var d = L[hi] - L[lo];
    return (lo + (d > 0 ? (E - L[lo]) / d : 0)) * g.dt;
  }

  /* ---------- Design normalisation ---------- */
  function normGroup(g) {
    if (g == null) return null;
    if (Array.isArray(g)) return { op: 'and', conds: g.map(normGroup) };
    if (g.conds) return { op: g.op || 'and', conds: g.conds.map(normGroup) };
    return g;
  }
  function normRules(rules, qoiById) {
    var out = { interim: [], final: { success: null, futility: null } }, i;
    rules = rules || {};
    var ri = rules.interim;
    if (ri && !Array.isArray(ri)) ri = [{ from: 1, success: ri.success, futility: ri.futility }];
    (ri || []).forEach(function (r) { out.interim.push({ from: r.from || 1, success: normGroup(r.success), futility: normGroup(r.futility) }); });
    out.interim.sort(function (a, b) { return a.from - b.from; });
    out.final = { success: normGroup(rules.final && rules.final.success), futility: normGroup(rules.final && rules.final.futility) };
    function check(g) { if (!g) return; if (g.conds) g.conds.forEach(check); else if (!qoiById[g.qoi]) throw new Error('rule uses unknown QOI ' + g.qoi); }
    out.interim.forEach(function (r) { check(r.success); check(r.futility); });
    check(out.final.success); check(out.final.futility);
    return out;
  }
  C.normalize = function (design) {
    if (design.__norm) return design;
    var D = JSON.parse(JSON.stringify(design)), st = D.study, i;
    if (!st || !st.arms || !st.arms.length) throw new Error('design.study.arms required');
    D.__norm = true;
    D.K = st.arms.length; D.N = st.maxN; D.dich = st.endpoint === 'dichotomous';
    if (!D.dich && st.endpoint !== 'continuous') throw new Error('endpoint must be dichotomous or continuous');
    D.sign = st.higherIsBetter === false ? -1 : 1;
    D.ctrl = -1; D.nonCtrl = [];
    st.arms.forEach(function (a, k) { a.name = a.name || ('Arm ' + k); a.dose = a.dose == null ? k : a.dose; if (a.isControl && D.ctrl < 0) D.ctrl = k; else D.nonCtrl.push(k); });
    D.doseOrder = D.nonCtrl.slice().sort(function (a, b) { return (st.arms[a].dose - st.arms[b].dose) || (a - b); });
    D.accrual = D.accrual || { regions: [{ peakPerWeek: 10, startWeek: 0 }] };
    D.grid = accrualGrid(D.accrual, D.N);
    var vw = D.visitWeeks || [12]; D.V = vw[vw.length - 1];
    var pd = D.dropout && D.dropout.perArm; D.pDrop = new Float64Array(D.K);
    for (i = 0; i < D.K; i++) D.pDrop[i] = Array.isArray(pd) ? (pd[i] || 0) : (pd || 0);
    D.qois = (D.qois || []).slice(); D.qoiById = {};
    var al = D.allocation = D.allocation || { type: 'fixed' };
    al.type = al.type || 'fixed';
    al.ratio = al.ratio || new Array(D.K).fill(1);
    if (al.type === 'adaptive' && !al.qoi) { al.qoi = '__alloc'; D.qois.push({ id: '__alloc', type: 'prMax' }); }
    D.qois.forEach(function (q) { D.qoiById[q.id] = q; });
    if (al.type === 'adaptive' && !D.qoiById[al.qoi]) throw new Error('allocation.qoi unknown: ' + al.qoi);
    if (al.drop && !D.qoiById[al.drop.qoi]) throw new Error('allocation.drop.qoi unknown: ' + al.drop.qoi);
    D.rules = normRules(D.rules, D.qoiById);
    var it = D.interims = D.interims || {}; it.trigger = it.trigger || 'enrolled'; it.at = (it.at || []).slice(); it.followUp = it.followUp || 'continue';
    D.needDraws = D.qois.some(function (q) { return DRAW_QOIS[q.type]; });
    if ((D.needDraws || D.borrowing) && !D.model) D.model = {};
    D.hasModel = !!D.model; D.source = design;
    if (D.hasModel) { D.mctx = Mod.prepare(D); D.hasMcmc = ['logistic3', 'sigmoid', 'hierLogistic'].indexOf(D.mctx.type) >= 0; }
    D.J = (D.simulation && D.simulation.nDraws) || 1000;
    D.predDraws = (D.simulation && D.simulation.predDraws) || 250;
    return D;
  };

  /* ---------- Pre-drawn patients ---------- */
  var BUF = { N: 0, K: 0 };
  function drawTrial(D, seed, s) {
    var N = D.N, K = D.K, u = M.streamFor(seed, s), rng = new M.Rng(u), i, d;
    if (BUF.N < N || BUF.K < K) { BUF.N = Math.max(BUF.N, N); BUF.K = Math.max(BUF.K, K); BUF.arrive = new Float64Array(BUF.N); BUF.dropU = new Float64Array(BUF.N); BUF.allocU = new Float64Array(BUF.N); BUF.lat = new Float64Array(BUF.N * BUF.K); BUF.armv = new Int8Array(BUF.N); BUF.dropFlag = new Uint8Array(BUF.N); BUF.yv = new Float64Array(BUF.N); }
    var E = 0, g = D.grid;
    for (i = 0; i < N; i++) { E += -Math.log(1 - u()); BUF.arrive[i] = invLam(g, E); }
    for (i = 0; i < N; i++) BUF.dropU[i] = u();
    for (i = 0; i < N; i++) BUF.allocU[i] = u();
    if (D.dich) { for (i = 0; i < N * K; i++) BUF.lat[i] = u(); } else { for (i = 0; i < N * K; i++) BUF.lat[i] = rng.normal(); }
    return BUF;
  }

  /* ---------- Quantities of interest ---------- */
  function zOf(D, dat, d) {
    var c = D.ctrl, nd = dat.n[d], nc = dat.n[c];
    if (!(nd > 0 && nc > 0)) return 0;
    if (D.dich) {
      var ph = (dat.s[d] + dat.s[c]) / (nd + nc), se = Math.sqrt(ph * (1 - ph) * (1 / nd + 1 / nc));
      return se > 0 ? D.sign * (dat.s[d] / nd - dat.s[c] / nc) / se : 0;
    }
    var v = (Math.max(0, dat.ss[d] - dat.s[d] * dat.s[d] / nd) + Math.max(0, dat.ss[c] - dat.s[c] * dat.s[c] / nc)) / Math.max(nd + nc - 2, 1);
    var se2 = Math.sqrt(v * (1 / nd + 1 / nc));
    return se2 > 0 ? D.sign * (dat.s[d] / nd - dat.s[c] / nc) / se2 : 0;
  }
  function dunnettP(zd, lam) {
    var m = lam.length;
    var f = function (u) { var p = M.phi(u); for (var j = 0; j < m; j++) p *= M.Phi((zd - lam[j] * u) / Math.sqrt(1 - lam[j] * lam[j])); return p; };
    return Math.max(0, 1 - M.integrate1D(f, -8, 8, 64));
  }
  // Final-analysis success criterion on totals (used by predictive probability).
  function critMet(D, spec, nd, sd, nc, sc, sig2) {
    var sg = D.sign;
    if (spec.kind === 'z') {
      var zA = M.PhiInv(1 - (spec.alpha || 0.025)), se, z;
      if (D.dich) { var ph = (sd + sc) / (nd + nc); se = Math.sqrt(ph * (1 - ph) * (1 / nd + 1 / nc)); } else se = Math.sqrt(sig2 * (1 / nd + 1 / nc));
      z = se > 0 ? sg * (sd / nd - sc / nc) / se : 0;
      return z > zA;
    }
    var md, vd, mc, vc, delta = spec.delta || 0, zt = M.PhiInv(spec.threshold == null ? 0.975 : spec.threshold);
    if (D.dich) {
      var a0 = spec.a0 == null ? 1 : spec.a0, b0 = spec.b0 == null ? 1 : spec.b0, Ad = a0 + sd, Bd = b0 + nd - sd, Ac = a0 + sc, Bc = b0 + nc - sc, td = Ad + Bd, tc = Ac + Bc;
      md = Ad / td; vd = Ad * Bd / (td * td * (td + 1)); mc = Ac / tc; vc = Ac * Bc / (tc * tc * (tc + 1));
    } else { md = sd / nd; vd = sig2 / nd; mc = sc / nc; vc = sig2 / nc; }
    return (sg * (md - mc) - delta) / Math.sqrt(vd + vc) > zt;
  }
  function computeQois(D, dat, fit, rng, kind, probs) {
    var out = {}, K = D.K, c = D.ctrl, nc = D.nonCtrl, J = fit && fit.draws ? fit.nDraws : 0, dr = fit ? fit.draws : null, j, d, a, q, v, i;
    for (i = 0; i < D.qois.length; i++) {
      q = D.qois[i]; v = new Float64Array(K).fill(NaN); out[q.id] = v;
      var sgn = D.sign * (q.direction === 'less' ? -1 : 1), delta = q.delta || 0, absolute = q.vs === 'absolute' || c < 0;
      switch (q.type) {
        case 'postProb':
          for (a = 0; a < nc.length; a++) { d = nc[a]; var cnt = 0; for (j = 0; j < J; j++) { var e = absolute ? sgn * dr[j * K + d] : sgn * (dr[j * K + d] - dr[j * K + c]); if (e > delta) cnt++; } v[d] = cnt / J; }
          break;
        case 'prMax': {
          var cm = new Float64Array(K);
          for (j = 0; j < J; j++) { var best = -Infinity, bi = nc[0]; for (a = 0; a < nc.length; a++) { var val = D.sign * dr[j * K + nc[a]]; if (val > best) { best = val; bi = nc[a]; } } cm[bi]++; }
          for (a = 0; a < nc.length; a++) v[nc[a]] = cm[nc[a]] / J;
          break; }
        case 'prED': case 'med': case 'pAnyEffective': {
          var cm2 = new Float64Array(K), ord = D.doseOrder, qq = q.q == null ? 0.9 : q.q, any = 0;
          for (j = 0; j < J; j++) {
            var emax = -Infinity, ef = [];
            for (a = 0; a < ord.length; a++) { var ee = absolute ? D.sign * dr[j * K + ord[a]] : D.sign * (dr[j * K + ord[a]] - dr[j * K + c]); ef.push(ee); if (ee > emax) emax = ee; }
            if (q.type === 'prED') { if (emax > delta) { for (a = 0; a < ord.length; a++) if (ef[a] >= qq * emax) { cm2[ord[a]]++; break; } } }
            else { for (a = 0; a < ord.length; a++) if (ef[a] >= delta) { cm2[ord[a]]++; any++; break; } }
          }
          for (a = 0; a < ord.length; a++) v[ord[a]] = q.type === 'pAnyEffective' ? any / J : cm2[ord[a]] / J;
          break; }
        case 'zstat': for (a = 0; a < nc.length; a++) v[nc[a]] = zOf(D, dat, nc[a]); break;
        case 'pvalue': {
          var lam = [];
          if (q.adjust === 'dunnett') for (a = 0; a < nc.length; a++) { var n1 = dat.n[nc[a]], n0 = dat.n[c]; if (n1 > 0 && n0 > 0) lam.push(Math.sqrt(n1 / (n1 + n0))); }
          for (a = 0; a < nc.length; a++) {
            d = nc[a]; var z = zOf(D, dat, d), p = M.PhiUpper(z);
            if (q.adjust === 'bonferroni') p = Math.min(1, p * (q.m || nc.length));
            else if (q.adjust === 'dunnett') p = lam.length ? dunnettP(z, lam) : p;
            v[d] = p;
          }
          break; }
        case 'condPower': {
          var zA2 = M.PhiInv(1 - (q.alpha || 0.025)), t = Math.min(1, dat.nTot / D.N);
          for (a = 0; a < nc.length; a++) { d = nc[a]; var z2 = zOf(D, dat, d); v[d] = (kind !== 'interim' || t >= 0.9999 || t <= 0) ? (z2 > zA2 ? 1 : 0) : M.Phi((z2 / Math.sqrt(t) - zA2) / Math.sqrt(1 - t)); }
          break; }
        case 'predProb': {
          var spec = q.success || { kind: 'bayes', threshold: 0.975, delta: q.delta || 0 };
          var R = kind === 'interim' ? Math.max(0, D.N - dat.nTot) : 0;
          var s2hat = 1; if (!D.dich) { var W = 0, df = 0; for (d = 0; d < K; d++) if (dat.n[d] > 0) { W += Math.max(0, dat.ss[d] - dat.s[d] * dat.s[d] / dat.n[d]); df += dat.n[d] - 1; } s2hat = df > 0 ? W / df : (D.study.sigma || 1) * (D.study.sigma || 1); }
          if (R === 0 || J === 0) { for (a = 0; a < nc.length; a++) { d = nc[a]; v[d] = (dat.n[d] > 0 && dat.n[c] > 0 && critMet(D, spec, dat.n[d], dat.s[d], dat.n[c], dat.s[c], s2hat)) ? 1 : 0; } break; }
          var P = Math.min(J, D.predDraws), nf = new Float64Array(K), succ = new Float64Array(K), fs = new Float64Array(K), jj;
          for (d = 0; d < K; d++) nf[d] = Math.round(R * probs[d]);
          for (jj = 0; jj < P; jj++) {
            j = Math.floor((jj + 0.5) * J / P);
            var sg2 = fit.sigma ? fit.sigma[j] * fit.sigma[j] : s2hat;
            for (d = 0; d < K; d++) {
              if (nf[d] === 0) fs[d] = 0;
              else if (D.dich) fs[d] = rng.binomial(nf[d], dr[j * K + d]);
              else fs[d] = nf[d] * dr[j * K + d] + Math.sqrt(nf[d] * sg2) * rng.normal();
            }
            for (a = 0; a < nc.length; a++) { d = nc[a]; var ndT = dat.n[d] + nf[d], ncT = dat.n[c] + nf[c]; if (ndT > 0 && ncT > 0 && critMet(D, spec, ndT, dat.s[d] + fs[d], ncT, dat.s[c] + fs[c], sg2)) succ[d]++; }
          }
          for (a = 0; a < nc.length; a++) v[nc[a]] = succ[nc[a]] / P;
          break; }
        default: throw new Error('unknown QOI type ' + q.type);
      }
    }
    return out;
  }

  /* ---------- Rules ---------- */
  function cmp(x, op, y) {
    if (x !== x) return false;
    switch (op) { case '>': return x > y; case '>=': return x >= y; case '<': return x < y; case '<=': return x <= y; case '=': case '==': return x === y; }
    throw new Error('unknown comparison ' + op);
  }
  function aggVec(D, vec, agg, rec) {
    var a, v, nc = D.nonCtrl;
    if (typeof agg === 'number') return vec[agg];
    if (agg === 'best') return vec[rec.best];
    if (agg === 'min') { v = Infinity; for (a = 0; a < nc.length; a++) if (vec[nc[a]] < v) v = vec[nc[a]]; return v; }
    v = -Infinity; for (a = 0; a < nc.length; a++) if (vec[nc[a]] > v) v = vec[nc[a]];
    return v;
  }
  function evalNode(D, node, rec) {
    if (!node) return false;
    var a;
    if (node.conds) {
      var isAnd = node.op !== 'or';
      if (!node.conds.length) return false;
      for (a = 0; a < node.conds.length; a++) { var r = evalNode(D, node.conds[a], rec); if (isAnd && !r) return false; if (!isAnd && r) return true; }
      return isAnd;
    }
    var vec = rec.qoi[node.qoi];
    return vec ? cmp(aggVec(D, vec, node.agg == null ? 'max' : node.agg, rec), node.cmp, node.value) : false;
  }
  function ruleFor(D, k) { var r = null; for (var i = 0; i < D.rules.interim.length; i++) if (D.rules.interim[i].from <= k + 1) r = D.rules.interim[i]; return r; }
  // +1 success, -1 futility (wins ties), 0 continue.
  function decideInterim(D, k, rec) {
    var r = ruleFor(D, k);
    if (!r) return 0;
    if (evalNode(D, r.futility, rec)) return -1;
    if (evalNode(D, r.success, rec)) return 1;
    return 0;
  }
  function decideFinal(D, rec) {
    if (evalNode(D, D.rules.final.futility, rec)) return -1;
    if (evalNode(D, D.rules.final.success, rec)) return 1;
    return 0;
  }
  function classify(D, path) {
    var recs = path.recs, k;
    for (k = 0; k < recs.length; k++) {
      var dec = decideInterim(D, k, recs[k]);
      if (dec !== 0) {
        var fu = D.interims.followUp === 'lock' ? recs[k] : path.followups[k], fd = decideFinal(D, fu);
        var code = dec === 1 ? (fd === -1 ? 5 : 1) : (fd === 1 ? 6 : 4);
        return { code: code, stopK: k, dec: dec, fd: fd, rec: recs[k], an: fu };
      }
    }
    var f = path.final, fd2 = decideFinal(D, f);
    return { code: fd2 === 1 ? 2 : (fd2 === -1 ? 3 : 7), stopK: -1, dec: 0, fd: fd2, rec: f, an: f };
  }

  /* ---------- One simulated trial ---------- */
  function runTrial(D, scn, seed, s, opts) {
    var K = D.K, N = D.N, V = D.V, pd = drawTrial(D, seed, s), arrive = pd.arrive, dropU = pd.dropU, allocU = pd.allocU, lat = pd.lat;
    var arm = pd.armv, dropFlag = pd.dropFlag, yv = pd.yv, armN = new Int32Array(K), nAssigned = 0, i, a, d, k;
    var truth = scn.truth, sdv = new Float64Array(K), st = D.study, al = D.allocation, savePath = !!opts.savePath;
    for (d = 0; d < K; d++) sdv[d] = Array.isArray(scn.sd) ? scn.sd[d] : (scn.sd != null ? scn.sd : (st.sigma || 1));
    var mode = 'block', pattern = [], B = 1, blockStart = 0, probs = new Float64Array(K), cumP = new Float64Array(K), dropped = new Uint8Array(K), adaptive = false;
    function setBlock(R) {
      pattern = []; var tot = 0, r, d2;
      for (d2 = 0; d2 < K; d2++) { r = Math.round(R[d2]); for (var q = 0; q < r; q++) pattern.push(d2); tot += r; }
      if (!tot) throw new Error('allocation ratio is all zero');
      B = pattern.length; blockStart = nAssigned; mode = 'block';
      for (d2 = 0; d2 < K; d2++) probs[d2] = Math.round(R[d2]) / tot;
    }
    function setProbs(p) {
      var cs = 0, last = 0, d2;
      for (d2 = 0; d2 < K; d2++) { probs[d2] = p[d2]; cs += p[d2]; cumP[d2] = cs; if (p[d2] > 0) last = d2; }
      cumP[K - 1] = Math.max(cumP[K - 1], 2); mode = 'prob'; probs.lastPos = last;
    }
    setBlock(al.ratio);
    function assignRange(upto) {
      for (var j = nAssigned; j < upto; j++) {
        var ar, ui = allocU[j];
        if (mode === 'block') {
          var o = j - blockStart, b0 = blockStart + Math.floor(o / B) * B, e = Math.min(b0 + B, N), rank = 0;
          for (var m = b0; m < e; m++) if (allocU[m] < ui || (allocU[m] === ui && m < j)) rank++;
          ar = pattern[rank];
        } else {
          for (ar = 0; ar < K; ar++) if (ui < cumP[ar] && probs[ar] > 0) break;
          if (ar >= K) ar = probs.lastPos;
        }
        arm[j] = ar; armN[ar]++; dropFlag[j] = dropU[j] < D.pDrop[ar] ? 1 : 0;
        yv[j] = D.dich ? (lat[j * K + ar] < truth[ar] ? 1 : 0) : truth[ar] + sdv[ar] * lat[j * K + ar];
      }
      if (upto > nAssigned) nAssigned = upto;
    }
    function countArrived(T) { var lo = 0, hi = N; while (lo < hi) { var mid = (lo + hi) >> 1; if (arrive[mid] <= T) lo = mid + 1; else hi = mid; } return lo; }
    function gather(enr, T) {
      var dat = { n: new Float64Array(K), s: new Float64Array(K), ss: new Float64Array(K), nTot: 0 };
      for (var j = 0; j < enr; j++) if (arrive[j] + V <= T && !dropFlag[j]) { var ar = arm[j], y = yv[j]; dat.n[ar]++; dat.s[ar] += y; dat.ss[ar] += y * y; dat.nTot++; }
      return dat;
    }
    var warm = D.hasMcmc ? {} : null;
    function analyze(kind, enr, T, code) {
      var dat = gather(enr, T), fit = null, rng = null;
      var needFit = D.hasModel && (D.needDraws || kind !== 'interim');
      if (D.needDraws || needFit) rng = M.rngFor((seed ^ 0x5bd1e995) | 0, s * 64 + code);
      if (needFit) fit = Mod.fit(D.mctx, dat, rng, { nDraws: D.needDraws ? D.J : 0, warm: warm, updateWarm: kind === 'interim' });
      var qoi = computeQois(D, dat, fit, rng, kind, probs);
      var est = new Float64Array(K), sdE = new Float64Array(K), best = -1, bv = -Infinity;
      for (var d2 = 0; d2 < K; d2++) { est[d2] = fit ? fit.mean[d2] : (dat.n[d2] > 0 ? dat.s[d2] / dat.n[d2] : NaN); sdE[d2] = fit ? fit.sd[d2] : NaN; }
      for (var q = 0; q < D.nonCtrl.length; q++) { var dd = D.nonCtrl[q], val = D.sign * est[dd]; if (val > bv) { bv = val; best = dd; } }
      return { borrow: fit ? fit.borrow || null : null, qoi: qoi, est: est, sd: sdE, best: best, nComp: dat.nTot, nEnr: enr, time: T, armN: Int32Array.from(armN) };
    }
    function adapt(k2, rec) {
      var changed = false, nc = D.nonCtrl, a2, d2;
      if (al.drop && k2 + 1 >= (al.drop.minInterim || 1)) {
        var dv = rec.qoi[al.drop.qoi], cand = [], active = 0, nDrop = 0;
        for (a2 = 0; a2 < nc.length; a2++) { d2 = nc[a2]; if (dropped[d2]) nDrop++; else { active++; if (cmp(dv[d2], al.drop.cmp || '<', al.drop.value)) cand.push(d2); } }
        var asc = (al.drop.cmp || '<').charAt(0) === '<';
        cand.sort(function (x, y) { return asc ? dv[x] - dv[y] : dv[y] - dv[x]; });
        var maxD = al.drop.maxDropped == null ? K : al.drop.maxDropped;
        for (a2 = 0; a2 < cand.length && active > 1 && nDrop < maxD; a2++) { dropped[cand[a2]] = 1; active--; nDrop++; changed = true; }
      }
      if (al.type === 'adaptive' && rec.nEnr >= (al.burnIn || 0)) adaptive = true;
      if (adaptive) {
        var gam = al.gamma == null ? 1 : al.gamma, vec = rec.qoi[al.qoi], V2 = new Float64Array(K), sumV = 0, vmax = 0, na = 0, pr = new Float64Array(K);
        for (a2 = 0; a2 < nc.length; a2++) {
          d2 = nc[a2]; if (dropped[d2]) continue; na++;
          var W2 = vec[d2]; if (!(W2 > 0)) W2 = 0;
          var val2 = al.weight === 'information' ? W2 * rec.sd[d2] * rec.sd[d2] / (rec.armN[d2] + 1) : W2;
          V2[d2] = Math.pow(val2, gam); sumV += V2[d2]; if (V2[d2] > vmax) vmax = V2[d2];
        }
        var cShare = 0;
        if (D.ctrl >= 0) {
          if (al.controlShare === 'matchBest') cShare = sumV + vmax > 0 ? vmax / (sumV + vmax) : 1 / (na + 1);
          else if (typeof al.controlShare === 'number') cShare = al.controlShare;
          else { var rs = 0; for (d2 = 0; d2 < K; d2++) if (!dropped[d2]) rs += al.ratio[d2]; cShare = al.ratio[D.ctrl] / rs; }
          pr[D.ctrl] = cShare;
        }
        var Mnc = 1 - cShare, mS = al.minShare || 0;
        if (Mnc < na * mS) mS = Mnc / na;
        for (a2 = 0; a2 < nc.length; a2++) { d2 = nc[a2]; if (dropped[d2]) continue; var sh = sumV > 0 ? V2[d2] / sumV : 1 / na; pr[d2] = mS + (Mnc - na * mS) * sh; }
        setProbs(pr);
      } else if (changed) {
        var R = al.ratio.slice(); for (d2 = 0; d2 < K; d2++) if (dropped[d2]) R[d2] = 0; setBlock(R);
      }
    }
    var recs = [], followups = {}, nI = D.interims.at.length, trig = D.interims.trigger, compScan = 0, compCnt = 0, stopped = false, lastT = -1, fullDone = arrive[N - 1] + V;
    for (k = 0; k < nI; k++) {
      var target = D.interims.at[k], T, enr;
      if (target > N || target < 1) break;
      if (trig === 'enrolled') T = arrive[target - 1];
      else if (trig === 'opportunity') T = arrive[target - 1] + V;
      else {
        while (compScan < N && compCnt < target) { assignRange(compScan + 1); if (!dropFlag[compScan]) compCnt++; compScan++; }
        if (compCnt < target) break;
        T = arrive[compScan - 1] + V;
      }
      enr = Math.min(N, countArrived(T));
      if (enr >= N && T >= fullDone) break;
      assignRange(enr);
      var rec = analyze('interim', enr, T, k);
      rec.k = k; rec.droppedPre = Uint8Array.from(dropped); rec.probs = Float64Array.from(probs);
      recs.push(rec); lastT = T;
      if (!savePath) {
        if (decideInterim(D, k, rec) !== 0) {
          if (D.interims.followUp !== 'lock') followups[k] = analyze('followup', enr, Infinity, 32 + k);
          followups[k] = followups[k] || rec;
          followups[k].endTime = D.interims.followUp === 'lock' ? T : Math.max(T, arrive[enr - 1] + V);
          stopped = true; break;
        }
      }
      adapt(k, rec);
    }
    var path = { sim: s, recs: recs, followups: followups, final: null, arrive: null };
    if (savePath) {
      for (k = 0; k < recs.length; k++) {
        if (D.interims.followUp === 'lock') { followups[k] = recs[k]; recs[k].endTime = recs[k].time; }
        else { followups[k] = analyze('followup', recs[k].nEnr, Infinity, 32 + k); followups[k].endTime = Math.max(recs[k].time, arrive[recs[k].nEnr - 1] + V); }
      }
    }
    if (!stopped) {
      assignRange(N);
      var f = analyze('final', N, Infinity, 63);
      f.droppedPre = Uint8Array.from(dropped); f.probs = Float64Array.from(probs); f.endTime = fullDone; f.time = fullDone; f.accrualEnd = arrive[N - 1];
      path.final = f;
    }
    if (opts.patients) {
      var np = N, rows = [];
      for (i = 0; i < np; i++) rows.push({ id: i + 1, arm: arm[i], arriveWeek: arrive[i], completeWeek: arrive[i] + V, dropout: dropFlag[i], y: yv[i] });
      path.patients = rows;
    }
    path.arr = Float64Array.from(arrive.subarray(0, N)); // arrival times (the shared buffer is reused by the next trial)
    return path;
  }

  /* ---------- Trial records and summary ---------- */
  function trialRecord(D, scn, path, cls) {
    var rec = cls.rec, stop = cls.stopK >= 0, K = D.K, d;
    var nEnr = stop ? rec.nEnr : D.N, armNs = Array.from(rec.armN);
    var best = -1, bv = -Infinity;
    var t = { sim: path.sim, code: cls.code, outcome: OUTCOMES[cls.code], stopInterim: cls.stopK, nEnrolled: nEnr, armN: armNs, accrualWeeks: stop ? rec.time : path.arr[D.N - 1], durationWeeks: cls.an.endTime, borrow: cls.an.borrow ? { wInf: cls.an.borrow.wInf, essPost: cls.an.borrow.essPost, nBorrowed: cls.an.borrow.nBorrowed } : null, est: Array.from(cls.an.est), dropped: Array.from(rec.droppedPre) };
    for (var q = 0; q < D.nonCtrl.length; q++) { d = D.nonCtrl[q]; var val = D.sign * cls.an.est[d]; if (val > bv) { bv = val; best = d; } }
    t.selected = best;
    // P(correct arm): the selected arm counts when its true value equals the best true value, so tied optimal arms all count. With every arm tied there is no best arm and the value is undefined.
    var tv = -Infinity, tie = true, first = null;
    for (q = 0; q < D.nonCtrl.length; q++) { d = D.nonCtrl[q]; var tt = D.sign * scn.truth[d]; if (first === null) first = tt; else if (tt !== first) tie = false; if (tt > tv) tv = tt; }
    t.correct = tie ? null : (best >= 0 && D.sign * scn.truth[best] === tv ? 1 : 0);
    return t;
  }
  function mcse(p, n) { return Math.sqrt(p * (1 - p) / n); }
  C.summarize = function (D, scn, trials) {
    var n = trials.length, K = D.K, counts = new Array(8).fill(0), d, i, t;
    var sumN = 0, sumN2 = 0, dur = 0, accr = 0, aN = new Float64Array(K), aN2 = new Float64Array(K), est = new Float64Array(K), est2 = new Float64Array(K), estCnt = new Float64Array(K), drop = new Float64Array(K), corr = 0, corrN = 0, selBest = 0;
    var stopBy = new Array(D.interims.at.length).fill(0), early = 0;
    for (i = 0; i < n; i++) {
      t = trials[i]; counts[t.code]++; sumN += t.nEnrolled; sumN2 += t.nEnrolled * t.nEnrolled; dur += t.durationWeeks; accr += t.accrualWeeks;
      for (d = 0; d < K; d++) { aN[d] += t.armN[d]; aN2[d] += t.armN[d] * t.armN[d]; drop[d] += t.dropped[d]; if (t.est[d] === t.est[d]) { est[d] += t.est[d]; est2[d] += t.est[d] * t.est[d]; estCnt[d]++; } }
      if (t.correct !== null) { corrN++; corr += t.correct; }
      if (t.stopInterim >= 0) { stopBy[t.stopInterim]++; early++; }
    }
    var S = { scenario: scn.name || '', nSims: n, counts: counts.slice(1) }, P = {}, SE = {};
    var names = ['pEarlySuccess', 'pLateSuccess', 'pLateFutility', 'pEarlyFutility', 'pSuccessToFutility', 'pFutilityToSuccess', 'pInconclusive'];
    for (i = 0; i < 7; i++) { S[names[i]] = counts[i + 1] / n; }
    S.pSuccess = (counts[1] + counts[2]) / n; S.pFutility = (counts[3] + counts[4]) / n; S.pStoppedEarly = early / n;
    var meanN = sumN / n; S.meanSubjects = meanN; S.sdSubjects = Math.sqrt(Math.max(0, sumN2 / n - meanN * meanN) * n / Math.max(n - 1, 1));
    S.meanAccrualWeeks = accr / n; S.meanDurationWeeks = dur / n;
    S.allocationMean = Array.from(aN, function (v) { return v / n; });
    S.allocationSE = Array.from(aN, function (v, k) { var m = v / n; return Math.sqrt(Math.max(0, aN2[k] / n - m * m) / n); });
    S.responseEstimate = Array.from(est, function (v, k) { return estCnt[k] ? v / estCnt[k] : NaN; });
    S.responseEstimateSE = Array.from(est, function (v, k) { if (!estCnt[k]) return NaN; var m = v / estCnt[k]; return Math.sqrt(Math.max(0, est2[k] / estCnt[k] - m * m) / estCnt[k]); });
    S.pArmDropped = Array.from(drop, function (v) { return v / n; });
    S.pCorrectArm = corrN ? corr / corrN : null;
    S.stopByInterim = stopBy.map(function (v) { return v / n; });
    var mc = {};
    names.concat(['pSuccess', 'pFutility', 'pStoppedEarly']).forEach(function (nm) { mc[nm] = mcse(S[nm], n); });
    mc.meanSubjects = S.sdSubjects / Math.sqrt(n);
    S.mcse = mc;
    if (D.borrowing) {
      var bs = trials.filter(function (x) { return x.borrow; }), mw = 0, mn2 = 0, me = 0, nw = 0, pr = D.mctx.borrow;
      bs.forEach(function (x) { if (x.borrow.wInf != null) { mw += x.borrow.wInf; nw++; } mn2 += x.borrow.nBorrowed; me += x.borrow.essPost; });
      S.borrowing = { method: pr.method, essPrior: pr.essPrior, meanWeightInformative: nw ? mw / nw : null, meanNBorrowed: bs.length ? mn2 / bs.length : null, meanEssPosterior: bs.length ? me / bs.length : null, tauMean: pr.info.tauMean == null ? null : pr.info.tauMean };
    }
    S.pArmDroppedSE = S.pArmDropped.map(function (p) { return mcse(p, n); });
    S.pCorrectArmSE = corrN ? mcse(S.pCorrectArm, corrN) : null;
    S.facts = { 'Mean Subjects': S.meanSubjects, 'Ppn Early Success': S.pEarlySuccess, 'Ppn Late Success': S.pLateSuccess, 'Ppn Late Futility': S.pLateFutility, 'Ppn Early Futility': S.pEarlyFutility, 'Ppn Success-to-Futility': S.pSuccessToFutility, 'Ppn Futility-to-Success': S.pFutilityToSuccess, 'Ppn Inconclusive': S.pInconclusive, 'Ppn Success': S.pSuccess };
    return S;
  };

  /* ---------- Public simulation functions ---------- */
  C.prepareScenario = function (D, scenario) {
    if (!scenario.truth || scenario.truth.length !== D.K) throw new Error('scenario.truth needs one value per arm');
    return scenario;
  };
  // Simulate trials from..to-1; returns {trials, interims, paths (if savePath), patients}.
  C.runChunk = function (design, scenario, opts) {
    opts = opts || {};
    var D = C.normalize(design), scn = C.prepareScenario(D, scenario), seed = opts.seed == null ? 20260801 : opts.seed, from = opts.from || 0, to = opts.to == null ? opts.nSims : opts.to;
    var keepInterims = opts.keepInterims !== false, keepP = opts.keepPatients === true ? 10 : (opts.keepPatients || 0);
    var out = { trials: [], interims: [], paths: opts.savePath ? [] : null, patients: [] };
    for (var s = from; s < to; s++) {
      var path = runTrial(D, scn, seed, s, { savePath: opts.savePath, patients: s < keepP });
      var cls = classify(D, path), tr = trialRecord(D, scn, path, cls);
      out.trials.push(tr);
      if (keepInterims) path.recs.forEach(function (r) { var qq = {}; for (var id in r.qoi) qq[id] = Array.from(r.qoi[id]); out.interims.push({ sim: s, interim: r.k + 1, time: r.time, best: r.best, decision: decideInterim(D, r.k, r), nEnrolled: r.nEnr, nCompleters: r.nComp, armN: Array.from(r.armN), borrow: r.borrow ? { wInf: r.borrow.wInf, essPost: r.borrow.essPost, nBorrowed: r.borrow.nBorrowed } : null, qoi: qq }); });
      if (path.patients) path.patients.forEach(function (row) { if (row.id <= tr.nEnrolled) { row.sim = s; row.armName = D.study.arms[row.arm].name; out.patients.push(row); } });
      if (opts.savePath) { delete path.patients; out.paths.push(path); }
      if (opts.onProgress && ((s - from + 1) % (opts.progressEvery || 100) === 0)) opts.onProgress(s - from + 1, to - from);
    }
    return out;
  };
  C.simulate = function (design, scenario, opts) {
    opts = opts || {};
    var D = C.normalize(design), nSims = opts.nSims || 1000;
    var ch = C.runChunk(D, scenario, { seed: opts.seed, from: 0, to: nSims, savePath: opts.savePath, keepInterims: opts.keepInterims, keepPatients: opts.keepPatients, onProgress: opts.onProgress, progressEvery: opts.progressEvery });
    var res = { summary: C.summarize(D, scenario, ch.trials), design: D, scenario: scenario, seed: opts.seed == null ? 20260801 : opts.seed, nSims: nSims };
    res.trials = opts.keepTrials === false ? [] : ch.trials;
    res.interims = ch.interims; res.patients = ch.patients; if (opts.savePath) res.paths = ch.paths;
    return res;
  };
  // Re-apply new rules to saved complete paths (simulate with savePath: true). No patients are re-simulated.
  C.reEvaluate = function (saved, newRules) {
    if (!saved.paths) throw new Error('reEvaluate needs a result simulated with savePath: true');
    var D = Object.assign({}, saved.design);
    D.rules = normRules(newRules, D.qoiById);
    var trials = saved.paths.map(function (p) { return trialRecord(D, saved.scenario, p, classify(D, p)); });
    return { summary: C.summarize(D, saved.scenario, trials), trials: trials, design: D, scenario: saved.scenario, paths: saved.paths, nSims: trials.length };
  };

  /* ---------- Group sequential benchmark ---------- */
  var NG = 1400, ZLO = -8;
  function gsGrid(b) { var zs = new Float64Array(NG + 1), h = (b - ZLO) / NG; for (var i = 0; i <= NG; i++) zs[i] = ZLO + i * h; return { zs: zs, h: h }; }
  function trapW(i, h) { return (i === 0 || i === NG) ? h / 2 : h; }
  function gsDensity(g1, G1, G2, tPrev, tNow) {
    var dd = tNow - tPrev, sd = Math.sqrt(dd), sp = Math.sqrt(tPrev), sn = Math.sqrt(tNow), out = new Float64Array(NG + 1), i, j;
    for (j = 0; j <= NG; j++) {
      var s = 0, zn = G2.zs[j] * sn;
      for (i = 0; i <= NG; i++) { var u = (zn - G1.zs[i] * sp) / sd; s += g1[i] * trapW(i, G1.h) * Math.exp(-0.5 * u * u); }
      out[j] = s * sn / (sd * Math.sqrt(2 * Math.PI));
    }
    return out;
  }
  function gsCrossAt(g1, G1, tPrev, tNow, b) {
    var dd = Math.sqrt(tNow - tPrev), sp = Math.sqrt(tPrev), sn = Math.sqrt(tNow), s = 0;
    for (var i = 0; i <= NG; i++) s += g1[i] * trapW(i, G1.h) * M.PhiUpper((b * sn - G1.zs[i] * sp) / dd);
    return s;
  }
  // First-crossing probabilities at each look under the null for upper bounds on the standardized z scale; t = information fractions.
  C.gsCrossProbs = function (bounds, t) {
    var K = bounds.length, probs = [M.PhiUpper(bounds[0])], G = gsGrid(bounds[0]), g = new Float64Array(NG + 1), i;
    for (i = 0; i <= NG; i++) g[i] = M.phi(G.zs[i]);
    for (var k = 1; k < K; k++) {
      probs.push(gsCrossAt(g, G, t[k - 1], t[k], bounds[k]));
      if (k < K - 1) { var G2 = gsGrid(bounds[k]); g = gsDensity(g, G, G2, t[k - 1], t[k]); G = G2; }
    }
    return probs;
  };
  function spendFn(type, alpha) {
    if (type === 'ldobf') return function (t) { return 2 * M.PhiUpper(M.PhiInv(1 - alpha / 2) / Math.sqrt(t)); };
    if (type === 'ldpocock') return function (t) { return alpha * Math.log(1 + (Math.E - 1) * t); };
    return null;
  }
  var gsCache = {};
  // One-sided upper boundaries. type: 'ldobf' (Lan-DeMets O'Brien-Fleming type spending), 'ldpocock', 'obf' (classical c / sqrt(t)), 'pocock' (constant).
  C.gsBounds = function (t, type, alpha) {
    alpha = alpha || 0.025; type = type || 'ldobf';
    var key = JSON.stringify([t, type, alpha]); if (gsCache[key]) return gsCache[key].slice();
    var K = t.length, i, k, bounds;
    if (K === 1) bounds = [M.PhiInv(1 - alpha)];
    else if (type === 'obf' || type === 'pocock') {
      var shape = function (c) { return t.map(function (tk) { return type === 'obf' ? c / Math.sqrt(tk) : c; }); };
      var total = function (c) { var p = C.gsCrossProbs(shape(c), t), s = 0; for (var q = 0; q < p.length; q++) s += p[q]; return s; };
      var lo = 0.5, hi = 6, saved = NG; NG = 500;
      try { for (i = 0; i < 30; i++) { var mid = (lo + hi) / 2; if (total(mid) > alpha) lo = mid; else hi = mid; } } finally { NG = saved; }
      bounds = shape((lo + hi) / 2);
    } else {
      var sp = spendFn(type, alpha), spend = t.map(function (tk, q) { return q === K - 1 ? alpha : sp(tk); });
      bounds = [M.PhiInv(1 - spend[0])]; var G = gsGrid(bounds[0]), g = new Float64Array(NG + 1);
      for (i = 0; i <= NG; i++) g[i] = M.phi(G.zs[i]);
      for (k = 1; k < K; k++) {
        var target = spend[k] - spend[k - 1], lo2 = 0, hi2 = 12;
        for (i = 0; i < 50; i++) { var m2 = (lo2 + hi2) / 2; if (gsCrossAt(g, G, t[k - 1], t[k], m2) > target) lo2 = m2; else hi2 = m2; }
        var b = (lo2 + hi2) / 2; bounds.push(b);
        if (k < K - 1) { var G2 = gsGrid(b); g = gsDensity(g, G, G2, t[k - 1], t[k]); G = G2; }
      }
    }
    gsCache[key] = bounds.slice();
    return bounds;
  };
  // Group sequential benchmark design on the same simulated patients: control against one dose arm (default the highest dose), 1:1 fixed allocation, K equally spaced looks by completers, z statistic against the boundaries.
  C.gsDesign = function (base, o) {
    o = o || {};
    var Kl = o.K || 4, alpha = o.alpha || 0.025, type = o.spending || 'ldobf', D0 = JSON.parse(JSON.stringify(base.source || base)), st = D0.study, arms = st.arms, ctrl = -1, act = o.arm, i;
    arms.forEach(function (a, k) { if (a.isControl && ctrl < 0) ctrl = k; });
    if (act == null) { act = -1; arms.forEach(function (a, k) { if (!a.isControl && (act < 0 || a.dose > arms[act].dose)) act = k; }); }
    var N = st.maxN, at = [], t = [];
    for (i = 1; i <= Kl; i++) { var n = Math.round(N * i / Kl / 2) * 2; if (i === Kl) n = N; at.push(n); t.push(n / N); }
    var bounds = C.gsBounds(t, type, alpha);
    var ratio = new Array(arms.length).fill(0); ratio[ctrl] = 1; ratio[act] = 1;
    delete D0.model;
    D0.allocation = { type: 'fixed', ratio: ratio };
    D0.interims = { trigger: 'completers', at: at.slice(0, Kl - 1), followUp: 'continue' };
    D0.qois = [{ id: 'z', type: 'zstat' }];
    D0.rules = { interim: bounds.slice(0, Kl - 1).map(function (b, k) { return { from: k + 1, success: { qoi: 'z', cmp: '>=', value: b, agg: act } }; }), final: { success: { qoi: 'z', cmp: '>=', value: bounds[Kl - 1], agg: act } } };
    D0.benchmarkInfo = { type: type, K: Kl, alpha: alpha, bounds: bounds, t: t, arm: act };
    return D0;
  };
  C.simulateBenchmark = function (design, scenario, opts) {
    opts = opts || {};
    return C.simulate(C.gsDesign(design, opts.benchmark || design.benchmark), scenario, opts);
  };

  NSim.core = C;
  if (typeof module !== 'undefined' && module.exports) module.exports = C;
})(typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : globalThis));
