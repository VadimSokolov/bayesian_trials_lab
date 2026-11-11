/* Copyright 2026 Nytel
 * MIT License. Permission is granted, free of charge, to any person obtaining a copy of this software to use, copy, modify, merge, publish and distribute it, provided this notice is kept. The software is provided "as is", without warranty of any kind.
 *
 * NSim.calibrate: calibration of success thresholds to a Type I error target and a Type I error grid over nuisance parameters, on top of the public API of core-engine.js (simulate, reEvaluate). Motivation: FDA's 2026 Bayesian draft guidance (calibrate the success criteria so that familywise Type I error is at most 0.025 one-sided) and FDA's 2019 adaptive designs guidance (Type I error over a grid of nuisance parameters, AD2019 p23).
 *
 * calibrate(design, nullScenario, opts)
 * - Simulates the null scenario once with savePath (common random numbers), then bisects the threshold with reEvaluate (no re-simulation). The success rate is non-increasing in the threshold on the same paths, so the bisection is exact on those paths.
 * - opts.rule: 'final' tunes only the threshold of the first leaf of the final success rule (interim thresholds stay as given); 'shift' moves that threshold and every interim success threshold on the same QOI by one common amount (stricter means larger for > and >= rules, smaller for < and <= rules). opts.leaf picks another leaf of the final success group; opts.range [lo, hi] is the search range of the final threshold (default [0, 1], [0, 8] for a zstat QOI); opts.digits rounds the result to the stricter side (default 4); opts.tol bisection width (default 1e-4).
 * - The calibrated threshold is then confirmed with one fresh simulation at another seed (opts.confirmSeed, opts.confirmSims, default as nSims), and power is estimated at the calibrated rules for each alternative in opts.alternatives ([{name, truth, sd}], opts.powerSims default min(nSims, 4000)). Intervals are Wilson 95 percent intervals; mcse is sqrt(p (1 - p) / n).
 * - Familywise: the success rule of the design decides. With several dose arms and a rule that aggregates over arms (agg 'max', the default), the null scenario with equal true values on every arm gives the familywise rate. Futility rules are kept as given and reduce the rate. Allocation and arm-dropping rules are fixed by the saved run, as for reEvaluate, so calibrating a design whose allocation depends on the tuned QOI is only exact for fixed allocation.
 *
 * nullGrid(design, gridSpec, opts)
 * - gridSpec has arrays for any of: control (control response rate, or control mean for continuous; alias controlMean), sd (continuous), accrualMult (multiplier of every accrual region peak), dropout (dropout probability, all arms), drift. Full factorial by default, opts.mode 'oneAtATime' varies one parameter at a time from the first value of each. All arms get the control value, so the null holds at every grid point. Each point uses its own seed (opts.seed + 1000 * index), as AD2019 prefers.
 * - Time drift: the engine fixes the true outcome distribution per arm for the whole trial (scenario fields are only truth, sd and name) and draws each patient's outcome from it, so a drift in the control rate over calendar time cannot be expressed through the public API. gridSpec.drift is therefore not simulated: the result carries driftSupported false and a note. Engine change needed: a scenario field (for example scenario.drift, per-week or total change of the control response applied to every arm) used where runTrial computes yv[j] from arrival time.
 * - Rows: Type I error, mcse, ci95, upper95 (upper Wilson limit), expected N, flag (upper95 above the target) and, in max, the largest rate over the grid.
 *
 * mcSims(p, se) and mcSE(p, n) and mcGuidance(p, n): Monte Carlo sample size guidance, for example 0.025 with SE 0.001 needs 24,375 simulations.
 */
(function (root) {
  'use strict';
  var NSim = root.NSim = root.NSim || {};
  if (!NSim.core && typeof require === 'function') require('./core-engine.js');
  var C = NSim.core;
  var Z95 = 1.959963984540054;

  /* ---------- Monte Carlo guidance ---------- */
  function mcSE(p, n) { return Math.sqrt(p * (1 - p) / n); }
  function mcSims(p, se) { return Math.ceil(p * (1 - p) / (se * se) - 1e-9); }
  function wilson(p, n) {
    var z2 = Z95 * Z95, den = 1 + z2 / n, ctr = (p + z2 / (2 * n)) / den, h = Z95 * Math.sqrt(p * (1 - p) / n + z2 / (4 * n * n)) / den;
    return [Math.max(0, ctr - h), Math.min(1, ctr + h)];
  }
  function mcGuidance(p, n) {
    var tab = [0.002, 0.001, 0.0005].map(function (se) { return { se: se, nSims: mcSims(p, se) }; });
    return {
      p: p, nSims: n, mcse: mcSE(p, n), halfWidth95: Z95 * mcSE(p, n), nForSE: tab,
      note: 'Simulations needed for a Monte Carlo SE of ' + tab.map(function (r) { return r.se + ': ' + r.nSims; }).join(', ') + ' at a rate of ' + p + '. AD2019 p23: 100,000 simulations give a 95% interval of about +/- 0.1% at 0.025.'
    };
  }
  function measure(p, n, seed) {
    var ci = wilson(p, n);
    return { rate: p, mcse: mcSE(p, n), ci95: ci, upper95: ci[1], nSims: n, seed: seed };
  }

  /* ---------- Helpers ---------- */
  function clone(x) { return JSON.parse(JSON.stringify(x)); }
  function rawOf(design) { return design.__norm ? design.source : design; }
  function leaves(g, out) { if (!g) return out; if (g.conds) g.conds.forEach(function (c) { leaves(c, out); }); else out.push(g); return out; }
  function isUpper(cmp) { return cmp === '>' || cmp === '>='; }
  function withRules(design, rules) { var d = clone(rawOf(design)); d.rules = rules; return d; }

  /* ---------- Calibration ---------- */
  function calibrate(design, nullScenario, opts) {
    opts = opts || {};
    var t0 = Date.now(), target = opts.target == null ? 0.025 : opts.target, nSims = opts.nSims || 20000, seed = opts.seed == null ? 20260801 : opts.seed;
    var rule = opts.rule || 'final', tol = opts.tol || 1e-4, digits = opts.digits == null ? 4 : opts.digits;
    if (rule !== 'final' && rule !== 'shift') throw new Error("rule must be 'final' or 'shift'");
    var D = C.normalize(design), R = clone(D.rules);
    var fl = leaves(R.final.success, []), tuned = fl[opts.leaf || 0];
    if (!tuned) throw new Error('design has no final success rule to calibrate');
    var dir = isUpper(tuned.cmp) ? 1 : -1, qt = D.qoiById[tuned.qoi] && D.qoiById[tuned.qoi].type;
    var range = opts.range || (qt === 'zstat' ? [0, 8] : [0, 1]);
    var early = [];
    if (rule === 'shift') R.interim.forEach(function (r) { leaves(r.success, []).forEach(function (l) { if (l.qoi === tuned.qoi) early.push({ leaf: l, base: l.value }); }); });
    var baseFinal = tuned.value, lenient = dir > 0 ? range[0] : range[1], strict = dir > 0 ? range[1] : range[0];
    function clampX(x) { return Math.min(range[1], Math.max(range[0], x)); }
    function setX(x) { tuned.value = x; early.forEach(function (e) { e.leaf.value = clampX(e.base + (x - baseFinal)); }); }
    var tSim = Date.now(), saved = C.simulate(D, nullScenario, { nSims: nSims, seed: seed, savePath: true, keepInterims: false, keepTrials: false });
    var tBis = Date.now(), iterations = 0;
    // bisection variable u = dir * x grows with strictness
    function rateAtX(x) { iterations++; setX(x); return C.reEvaluate(saved, R).summary.pSuccess; }
    var feasible = true, xFinal;
    if (rateAtX(lenient) <= target) xFinal = lenient;
    else if (rateAtX(strict) > target) { feasible = false; xFinal = strict; }
    else {
      var lo = dir > 0 ? range[0] : -range[1], hi = dir > 0 ? range[1] : -range[0];
      while (hi - lo > tol && iterations < 200) { var mid = (lo + hi) / 2; if (rateAtX(dir * mid) <= target) hi = mid; else lo = mid; }
      var p10 = Math.pow(10, digits), uR = Math.ceil(hi * p10 - 1e-9) / p10;
      var uMax = dir > 0 ? range[1] : -range[0];
      if (uR > uMax) uR = uMax;
      xFinal = dir * uR;
      var guard = 0; while (rateAtX(xFinal) > target && xFinal !== dir * uMax && guard++ < 100) xFinal = clampX(xFinal + dir / p10);
    }
    setX(xFinal);
    var tCal = Date.now(), calRate = C.reEvaluate(saved, R).summary;
    var rulesCal = clone(R), designCal = withRules(design, rulesCal);
    var out = {
      target: target, rule: rule, feasible: feasible, nSims: nSims, seed: seed,
      threshold: { final: xFinal, early: early.map(function (e) { return e.leaf.value; }), baseFinal: baseFinal, baseEarly: early.map(function (e) { return e.base; }), qoi: tuned.qoi, cmp: tuned.cmp },
      rules: rulesCal, design: designCal, iterations: iterations
    };
    out.timings = { simulate: (tBis - tSim) / 1000, bisect: (tCal - tBis) / 1000 };
    out.calibration = measure(calRate.pSuccess, nSims, seed);
    out.calibration.expectedN = calRate.meanSubjects;
    var tConf = Date.now(), cSeed = opts.confirmSeed == null ? seed + 7919 : opts.confirmSeed, cN = opts.confirmSims || nSims;
    var conf = C.simulate(designCal, nullScenario, { nSims: cN, seed: cSeed, keepInterims: false, keepTrials: false });
    out.confirmation = measure(conf.summary.pSuccess, cN, cSeed);
    out.confirmation.expectedN = conf.summary.meanSubjects;
    out.confirmation.exceedsTarget = out.confirmation.ci95[0] > target;
    out.confirmation.zVsTarget = (conf.summary.pSuccess - target) / mcSE(target, cN);
    out.timings.confirm = (Date.now() - tConf) / 1000; out.timings.calibration = out.timings.simulate + out.timings.bisect;
    if (D.needDraws) out.drawResolution = 1 / D.J;
    var pN = opts.powerSims || Math.min(nSims, 4000), alts = opts.alternatives || [];
    out.power = alts.map(function (alt, i) {
      var sd = opts.powerSeed == null ? seed + 104729 + i : opts.powerSeed + i, r = C.simulate(designCal, alt, { nSims: pN, seed: sd, keepInterims: false, keepTrials: false }), m = measure(r.summary.pSuccess, pN, sd);
      return { name: alt.name || ('alternative ' + (i + 1)), truth: alt.truth, power: m.rate, mcse: m.mcse, ci95: m.ci95, nSims: pN, seed: sd, expectedN: r.summary.meanSubjects, pEarlySuccess: r.summary.pEarlySuccess };
    });
    out.guidance = mcGuidance(target, nSims);
    out.seconds = (Date.now() - t0) / 1000;
    return out;
  }

  /* ---------- Type I error grid ---------- */
  function nullGrid(design, gridSpec, opts) {
    opts = opts || {}; gridSpec = gridSpec || {};
    var t0 = Date.now(), target = opts.target == null ? 0.025 : opts.target, nSims = opts.nSims || 10000, seed = opts.seed == null ? 20260801 : opts.seed;
    var raw = rawOf(design), D = C.normalize(design), K = D.K, notes = [];
    var ctrlVals = gridSpec.control || gridSpec.controlMean || [opts.baselineControl != null ? opts.baselineControl : (D.dich ? 0.3 : 0)];
    var sdVals = gridSpec.sd || [null], accVals = gridSpec.accrualMult || [1], dropVals = gridSpec.dropout || [null];
    var driftRequested = !!(gridSpec.drift && gridSpec.drift.some(function (v) { return v !== 0; }));
    if (driftRequested) notes.push('Time drift in the control rate was requested but is not simulated: the engine has no per-patient or per-time truth (scenario fields are truth, sd, name only). Rows are for zero drift.');
    if (D.dich && gridSpec.sd) notes.push('sd is ignored for a dichotomous endpoint.');
    var dims = [['control', ctrlVals], ['sd', sdVals], ['accrualMult', accVals], ['dropout', dropVals]], points = [];
    if (opts.mode === 'oneAtATime') {
      var base = dims.map(function (d) { return d[1][0]; });
      points.push(base.slice());
      dims.forEach(function (d, i) { d[1].slice(1).forEach(function (v) { var p = base.slice(); p[i] = v; points.push(p); }); });
    } else {
      points = [[]];
      dims.forEach(function (d) { var next = []; points.forEach(function (p) { d[1].forEach(function (v) { next.push(p.concat([v])); }); }); points = next; });
    }
    var rows = [], i;
    for (i = 0; i < points.length; i++) {
      var pt = points[i], dsg = clone(raw), scn = { name: 'null ' + i, truth: new Array(K).fill(pt[0]) };
      if (pt[1] != null && !D.dich) scn.sd = pt[1];
      if (pt[2] !== 1) { dsg.accrual = clone(dsg.accrual || { regions: [{ peakPerWeek: 10, startWeek: 0 }] }); dsg.accrual.regions.forEach(function (r) { r.peakPerWeek *= pt[2]; }); }
      if (pt[3] != null) dsg.dropout = { perArm: pt[3] };
      var sd = seed + 1000 * i, res = C.simulate(dsg, scn, { nSims: nSims, seed: sd, keepInterims: false, keepTrials: false }), m = measure(res.summary.pSuccess, nSims, sd);
      rows.push({ index: i, control: pt[0], sd: pt[1] != null && !D.dich ? pt[1] : (D.dich ? null : (raw.study.sigma || 1)), accrualMult: pt[2], dropout: pt[3] != null ? pt[3] : (raw.dropout && raw.dropout.perArm != null ? raw.dropout.perArm : 0), drift: 0, typeI: m.rate, mcse: m.mcse, ci95: m.ci95, upper95: m.upper95, expectedN: res.summary.meanSubjects, nSims: nSims, seed: sd, flag: m.upper95 > target });
      if (opts.onProgress) opts.onProgress(i + 1, points.length);
    }
    var mx = rows.reduce(function (b, r) { return r.typeI > b.typeI ? r : b; }, rows[0]), mu = rows.reduce(function (b, r) { return r.upper95 > b.upper95 ? r : b; }, rows[0]);
    return {
      target: target, nSims: nSims, seed: seed, rows: rows, driftSupported: false, notes: notes,
      max: { typeI: mx.typeI, row: mx.index, upper95: mu.upper95, rowUpper: mu.index, nFlagged: rows.filter(function (r) { return r.flag; }).length, anyFlag: rows.some(function (r) { return r.flag; }) },
      guidance: mcGuidance(target, nSims), seconds: (Date.now() - t0) / 1000
    };
  }

  calibrate.calibrate = calibrate;
  calibrate.nullGrid = nullGrid;
  calibrate.mcSims = mcSims;
  calibrate.mcSE = mcSE;
  calibrate.mcGuidance = mcGuidance;
  calibrate.wilson = wilson;
  NSim.calibrate = calibrate;
  if (typeof module !== 'undefined' && module.exports) module.exports = calibrate;
})(typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : globalThis));
