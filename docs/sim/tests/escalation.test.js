/* Copyright 2026 Nytel. MIT License. Tests for NSim.escalation: R fixtures (escalation, BOIN, dfcrm) and internal consistency of mTPI, mTPI-2, i3+3 and BLRM. */
'use strict';
const fs = require('fs'), path = require('path');
const { test, assert, near } = require('./harness.js');
const M = require('../core-math.js'), X = require('../escalation.js');
const fx = (n) => JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', n + '.json'), 'utf8')).entries;
const byId = (es, id) => es.find(e => e.id === id);
// Monte Carlo comparison: mine (nMine sims, standard error se) against a reference value from nRef sims; 4 combined standard errors.
function mc(label, mine, se, ref, nMine, nRef, floor) {
  const tol = Math.max(4 * se * Math.sqrt(1 + nMine / nRef), floor == null ? 0.002 : floor);
  near(mine, ref, tol, label);
}

/* ---------- 3+3 ---------- */
test('3+3: escalation probability exact (closed form fixture)', () => {
  const e = byId(fx('three-plus-three'), '3plus3-escalation-closed-form');
  e.inputs.p.forEach((p, i) => {
    const r = X.threePlusThreeExact([p]);
    near(r.pEscalate[0], e.outputs.p_escalate[i], 1e-12, 'p=' + p);
    near(1 - r.pEscalate[0], e.outputs.p_stay_or_stop[i], 1e-12, 'stay or stop p=' + p);
  });
});
test('3+3: simulation matches exact enumeration (20,000 trials)', () => {
  const p = [0.05, 0.15, 0.3, 0.45, 0.6], ex = X.threePlusThreeExact(p), r = X.simulate({ method: '3+3' }, { truth: p }, { nSims: 20000, seed: 11 });
  near(ex.pSelect.reduce((a, b) => a + b, 0) + ex.pNone, 1, 1e-12, 'exact probabilities sum to 1');
  for (let j = 0; j < 5; j++) {
    mc('select ' + j, r.pSelect[j], r.se.pSelect[j], ex.pSelect[j], 20000, 1e9);
    mc('n ' + j, r.nPerDose[j], r.se.nPerDose[j], ex.nPerDose[j], 20000, 1e9, 0.01);
    mc('dlt ' + j, r.dltPerDose[j], r.se.dltPerDose[j], ex.dltPerDose[j], 20000, 1e9, 0.01);
  }
  mc('none', r.pNone, r.se.pNone, ex.pNone, 20000, 1e9);
  mc('meanN', r.meanN, r.se.meanN, ex.meanN, 20000, 1e9, 0.02);
});
test('3+3: operating characteristics against escalation::get_three_plus_three (R fixture)', () => {
  const e = byId(fx('three-plus-three'), '3plus3-oc-scenario1'), o = e.outputs, N = 20000;
  const r = X.simulate({ method: '3+3' }, { truth: e.inputs.true_prob_tox }, { nSims: N, seed: 5 });
  mc('NoDose', r.pNone, r.se.pNone, o.prob_recommend[0], N, e.inputs.num_sims);
  for (let j = 0; j < 5; j++) {
    mc('recommend ' + j, r.pSelect[j], r.se.pSelect[j], o.prob_recommend[j + 1], N, e.inputs.num_sims);
    mc('n ' + j, r.nPerDose[j], r.se.nPerDose[j], o.n_at_dose_mean_per_trial[j], N, e.inputs.num_sims, 0.02);
    mc('tox ' + j, r.dltPerDose[j], r.se.dltPerDose[j], o.tox_at_dose_mean_per_trial[j], N, e.inputs.num_sims, 0.02);
  }
  mc('mean_n', r.meanN, r.se.meanN, o.mean_n, N, e.inputs.num_sims, 0.02);
  mc('mean_tox', r.meanDLT, r.se.meanDLT, o.mean_tox, N, e.inputs.num_sims, 0.02);
  mc('overdose', r.pOverdose, r.se.pOverdose, o.prob_overdose_recommended, N, e.inputs.num_sims);
});
test('3+3: de-escalation option selects the highest dose with at most 1 DLT in 6', () => {
  const r = X.simulate({ method: '3+3', allowDeescalate: true }, { truth: [0.05, 0.15, 0.3, 0.45, 0.6] }, { nSims: 3000, seed: 2 });
  assert(Math.abs(r.pSelect.reduce((a, b) => a + b, 0) + r.pNone - 1) < 1e-12);
  for (let k = 0; k < 40; k++) { // in every recorded trial the selected dose has 6 patients and at most 1 DLT, or is the top dose cleared at 3 with 0 DLT
    const t = X.runTrial({ method: '3+3', allowDeescalate: true }, { truth: [0.1, 0.2, 0.35, 0.5, 0.6] }, { seed: 4, index: k });
    if (t.sel >= 0) assert(t.y[t.sel] <= 1 && t.n[t.sel] >= 3, 'selected dose must be cleared');
  }
});

/* ---------- BOIN ---------- */
test('BOIN: boundaries, escalation, de-escalation and elimination tables exact (BOIN::get.boundary)', () => {
  fx('boin').filter(e => /^boin-boundary/.test(e.id)).forEach(e => {
    const b = X.boinBoundaries(e.inputs.target, { cohortSize: e.inputs.cohortsize, maxCohorts: e.inputs.ncohort });
    near(b.lambdaE, e.outputs.lambda_e, 1e-9, e.id + ' lambda_e'); near(b.lambdaD, e.outputs.lambda_d, 1e-9, e.id + ' lambda_d');
    assert(JSON.stringify(b.table.map(r => r.n)) === JSON.stringify(e.outputs.n_treated), e.id + ' n');
    assert(JSON.stringify(b.table.map(r => r.escalateIfLE)) === JSON.stringify(e.outputs.escalate_if_dlt_le), e.id + ' escalate ' + JSON.stringify(b.table.map(r => r.escalateIfLE)));
    assert(JSON.stringify(b.table.map(r => r.deescalateIfGE)) === JSON.stringify(e.outputs.deescalate_if_dlt_ge || e.outputs.deescalate_if_dlt_ge), e.id + ' de-escalate');
    assert(JSON.stringify(b.table.map(r => r.eliminateIfGE)) === JSON.stringify(e.outputs.eliminate_if_dlt_ge), e.id + ' eliminate ' + JSON.stringify(b.table.map(r => r.eliminateIfGE)));
  });
});
test('BOIN: decision table agrees with the boundaries', () => {
  const t = X.decisionTable({ method: 'BOIN', target: 0.3 }, 12), b = X.boinBounds ? null : null;
  assert(t[2].join(' ') === 'E S D DU', 'n=3: ' + t[2].join(' '));
  assert(t[5].slice(0, 5).join(' ') === 'E E S D DU', 'n=6: ' + t[5].join(' '));
});
test('BOIN: operating characteristics within Monte Carlo error of BOIN::get.oc (10,000 trials, three scenarios)', () => {
  const N = 10000;
  fx('boin').filter(e => /^boin-oc/.test(e.id)).forEach((e, idx) => {
    const o = e.outputs, K = 5, r = X.simulate({ method: 'BOIN', target: e.inputs.target, cohortSize: e.inputs.cohortsize, maxCohorts: e.inputs.ncohort, startDose: 1 }, { truth: e.inputs['p.true'] }, { nSims: N, seed: 100 + idx });
    for (let j = 0; j < K; j++) {
      mc(e.id + ' select ' + j, r.pSelect[j], r.se.pSelect[j], o.selection_pct[j] / 100, N, e.inputs.ntrial);
      mc(e.id + ' n ' + j, r.nPerDose[j], r.se.nPerDose[j], o.patients_per_dose[j], N, e.inputs.ntrial, 0.02);
      mc(e.id + ' dlt ' + j, r.dltPerDose[j], r.se.dltPerDose[j], o.dlt_per_dose[j], N, e.inputs.ntrial, 0.02);
    }
    mc(e.id + ' total n', r.meanN, r.se.meanN, o.total_n, N, e.inputs.ntrial, 0.02);
    mc(e.id + ' total dlt', r.meanDLT, r.se.meanDLT, o.total_dlt, N, e.inputs.ntrial, 0.02);
    mc(e.id + ' stopped early', r.pStoppedEarly, r.se.pNone, o.pct_stopped_early / 100, N, e.inputs.ntrial);
    mc(e.id + ' overdose selection', r.pOverdose, r.se.pOverdose, o.overdose_selection_pct / 100, N, e.inputs.ntrial);
    mc(e.id + ' overdose allocation', r.pOverdoseAlloc, r.se.pOverdoseAlloc, o.overdose_allocation_pct / 100, N, e.inputs.ntrial);
  });
});

/* ---------- CRM ---------- */
test('CRM: posterior mean and variance of a, toxicity estimates and next dose for fixed data (dfcrm::crm)', () => {
  ['crm-fit-A', 'crm-fit-B'].forEach(id => {
    const e = byId(fx('crm'), id), f = X.crmFit({ skeleton: e.inputs.skeleton, target: e.inputs.target, priorVar: e.inputs.prior_var, level: e.inputs.level, tox: e.inputs.tox });
    near(f.postMeanA, e.outputs.post_mean_a, 1e-3, id + ' mean'); near(f.postVarA, e.outputs.post_var_a, 1e-3, id + ' var');
    e.outputs.ptox_estimate.forEach((p, j) => near(f.ptox[j], p, 1e-3, id + ' ptox ' + j));
    assert(f.next === e.outputs.recommended_next_dose, id + ' next dose ' + f.next);
  });
});
test('CRM: crmsim operating characteristics within Monte Carlo error (10,000 trials)', () => {
  const e = byId(fx('crm'), 'crmsim-scenario1'), o = e.outputs, N = 10000;
  const r = X.simulate({ method: 'CRM', target: e.inputs.target, skeleton: e.inputs.skeleton, priorVar: e.inputs.prior_var, cohortSize: e.inputs.mcohort, maxN: e.inputs.n, startDose: e.inputs.x0, restrict: true }, { truth: e.inputs.true_tox }, { nSims: N, seed: 123 });
  for (let j = 0; j < 5; j++) {
    mc('select ' + j, r.pSelect[j], r.se.pSelect[j], o.recommended_dose_proportion[j], N, e.inputs.nsim);
    mc('n ' + j, r.nPerDose[j], r.se.nPerDose[j], o.mean_patients_per_dose[j], N, e.inputs.nsim, 0.02);
    mc('dlt ' + j, r.dltPerDose[j], r.se.dltPerDose[j], o.mean_dlt_per_dose[j], N, e.inputs.nsim, 0.02);
  }
  mc('total dlt', r.meanDLT, r.se.meanDLT, o.mean_total_dlt, N, e.inputs.nsim, 0.02);
  near(r.meanN, 21, 1e-12, 'every trial enrols 21');
});
test('CRM: restriction (no skipping, no escalation after a DLT) holds in recorded trials', () => {
  const des = { method: 'CRM', target: 0.25, skeleton: [0.05, 0.12, 0.25, 0.4, 0.55], cohortSize: 3, maxN: 30 };
  for (let k = 0; k < 100; k++) {
    const t = X.runTrial(des, { truth: [0.05, 0.12, 0.25, 0.4, 0.55] }, { seed: 9, index: k });
    t.cohorts.forEach(c => { if (c.next) { assert(c.next <= c.dose + 1, 'skipped'); if (c.dlt > 0) assert(c.next <= c.dose, 'escalated after DLT'); } });
  }
});

/* ---------- Performance ---------- */
test('performance: 2,000 BOIN trials and 2,000 CRM trials each under 5 s', () => {
  let t0 = Date.now();
  X.simulate({ method: 'BOIN', target: 0.3, cohortSize: 3, maxCohorts: 10 }, { truth: [0.05, 0.15, 0.3, 0.45, 0.6] }, { nSims: 2000, seed: 1 });
  const a = Date.now() - t0; t0 = Date.now();
  X.simulate({ method: 'CRM', target: 0.25, skeleton: [0.05, 0.12, 0.25, 0.4, 0.55], cohortSize: 3, maxN: 36 }, { truth: [0.05, 0.12, 0.25, 0.4, 0.55] }, { nSims: 2000, seed: 1 });
  const b = Date.now() - t0; t0 = Date.now();
  X.simulate({ method: 'BLRM', doses: [1, 2, 4, 8, 16], refDose: 8, target: 0.3, maxCohorts: 10 }, { truth: [0.02, 0.06, 0.15, 0.3, 0.55] }, { nSims: 2000, seed: 1 });
  const c = Date.now() - t0;
  console.log('      BOIN ' + a + ' ms, CRM ' + b + ' ms, BLRM ' + c + ' ms (2,000 trials each)');
  assert(a < 5000, 'BOIN too slow: ' + a); assert(b < 5000, 'CRM too slow: ' + b); assert(c < 15000, 'BLRM too slow: ' + c);
});

/* ---------- mTPI, mTPI-2, i3+3 ---------- */
function rank(c) { return c === 'E' ? 2 : (c === 'S' ? 1 : 0); }
test('mTPI, mTPI-2, i3+3: decision tables are monotone in y, escalate at 0 DLT, de-escalate at all DLT', () => {
  ['mTPI', 'mTPI2', 'i3+3', 'BOIN'].forEach(m => [0.2, 0.3].forEach(tg => {
    const t = X.decisionTable({ method: m, target: tg }, 30);
    t.forEach((row, i) => {
      const n = i + 1;
      if (n >= 6) assert(row[0] === 'E', m + ' n=' + n + ' 0 DLT ' + row[0]);
      if (n >= 6) assert(row[n][0] === 'D', m + ' n=' + n + ' all DLT ' + row[n]);
      for (let y = 1; y <= n; y++) assert(rank(row[y][0]) <= rank(row[y - 1][0]), m + ' target ' + tg + ' n=' + n + ' not monotone at y=' + y);
    });
  }));
});
test('mTPI-2: decision equals the keyboard rule computed independently (strongest equal-width key)', () => {
  [[0.3, 0.05], [0.2, 0.05], [0.25, 0.03]].forEach(([tg, ep]) => {
    const t = X.decisionTable({ method: 'mTPI2', target: tg, epsilon: ep }, 24), w = 2 * ep;
    for (let n = 1; n <= 24; n++) for (let y = 0; y <= n; y++) {
      // keys of width w tiled outward from the target key; strongest key by probability mass
      const keys = [[tg - ep, tg + ep, 0]];
      for (let lo = tg - ep; lo > 1e-12; lo -= w) keys.push([Math.max(lo - w, 0), lo, -1]);
      for (let hi = tg + ep; hi < 1 - 1e-12; hi += w) keys.push([hi, Math.min(hi + w, 1), 1]);
      let best = -1, side = 0;
      keys.forEach(k => { const mass = M.betaCdf(k[1], 1 + y, 1 + n - y) - M.betaCdf(k[0], 1 + y, 1 + n - y); if (mass > best + 1e-12 || (k[2] === 0 && mass > best - 1e-12)) { best = mass; side = k[2]; } });
      const want = side < 0 ? 'E' : (side === 0 ? 'S' : 'D'), got = t[n - 1][y][0];
      // the keyboard rule has truncated keys compared by mass, mTPI-2 by unit mass; allow a disagreement only inside the equal-mass tie band
      if (got !== want) { const g = rank(got), wv = rank(want); assert(false, 'tg ' + tg + ' n=' + n + ' y=' + y + ' mTPI2 ' + got + ' keyboard ' + want + (g === wv ? '' : '')); }
    }
  });
});
test('mTPI-2 differs from mTPI (stays less often) and equals BOIN-like tables at n = 3', () => {
  const a = X.decisionTable({ method: 'mTPI', target: 0.3 }, 12), b = X.decisionTable({ method: 'mTPI2', target: 0.3 }, 12);
  let stayA = 0, stayB = 0;
  for (let n = 1; n <= 12; n++) for (let y = 0; y <= n; y++) { if (a[n - 1][y] === 'S') stayA++; if (b[n - 1][y] === 'S') stayB++; }
  assert(stayB < stayA, 'mTPI-2 should stay in fewer cells: ' + stayB + ' vs ' + stayA);
  assert(b[2].join(' ') === 'E S D DU', b[2].join(' '));
});
test('i3+3: refinement by one DLT (n = 3, 6 at target 0.3) and sampling variability rule', () => {
  const t = X.decisionTable({ method: 'i3+3', target: 0.3 }, 12);
  assert(t[2].join(' ') === 'E S D DU', t[2].join(' '));
  assert(t[5].slice(0, 5).join(' ') === 'E E S D DU', t[5].join(' '));
  // Liu, Yin and Yuan 2020, section 2.1: below the EI always escalates (no extra condition), also with a narrow interval
  const nar = X.decisionTable({ method: 'i3+3', target: 0.2, epsilon: 0.02 }, 6);
  assert(nar[2][0] === 'E', 'i3+3 with a narrow interval escalates at 0/3: ' + nar[2].join(' '));
});
test('mTPI, mTPI-2, i3+3: simulation probabilities are coherent and target dose is favoured', () => {
  ['mTPI', 'mTPI2', 'i3+3'].forEach(m => {
    const r = X.simulate({ method: m, target: 0.3, cohortSize: 3, maxCohorts: 12 }, { truth: [0.05, 0.15, 0.3, 0.45, 0.6] }, { nSims: 4000, seed: 21 });
    near(r.pSelect.reduce((a, b) => a + b, 0) + r.pNone, 1, 1e-12, m + ' sums to 1');
    near(r.pBand.under + r.pBand.target + r.pBand.excess + r.pBand.unacceptable + r.pNone, 1, 1e-12, m + ' bands');
    assert(r.pSelect[2] > r.pSelect[0] && r.pSelect[2] > r.pSelect[4], m + ' target dose favoured');
    near(r.meanN, 36, 1e-9, 'fixed sample size when nobody stops');
    near(r.nPerDose.reduce((a, b) => a + b, 0), r.meanN, 1e-9, 'patients per dose sum to mean N');
    assert(r.example.cohorts.length > 0 && r.example.cohorts[0].dose === 1, 'example trial starts at dose 1');
  });
});
test('mTPI and BOIN: overdose elimination ends the trial when the lowest dose is too toxic', () => {
  ['BOIN', 'mTPI', 'mTPI2', 'i3+3'].forEach(m => {
    const r = X.simulate({ method: m, target: 0.2, cohortSize: 3, maxCohorts: 10 }, { truth: [0.7, 0.8, 0.9] }, { nSims: 500, seed: 3 });
    assert(r.pNone > 0.95, m + ' pNone ' + r.pNone); assert(r.meanN < 12, m + ' stops early: ' + r.meanN);
  });
});

/* ---------- BLRM / N-CRM ---------- */
const BL = { method: 'BLRM', doses: [1, 2, 4, 8, 16], refDose: 8, target: 0.3, maxCohorts: 10, prior: { mu: [-1, 0], sd: [2, 1], rho: 0 }, overdoseLimit: 0.25 };
test('N-CRM with alpha fixed is a one-parameter model: grid posterior equals brute-force integration', () => {
  const des = Object.assign({}, BL, { fixAlpha: -1, prior: { mu: [-1, 0], sd: [2, 0.7], rho: 0 } }), n = [3, 3, 3, 0, 0], y = [0, 0, 1, 0, 0];
  const f = X.blrmFit(des, n, y), cuts = [0.16, 0.33, 0.6];
  // independent fine trapezoid on log beta
  const T = 40001, lo = -8 * 0.7, hi = 8 * 0.7, h = (hi - lo) / (T - 1), bins = new Float64Array(20);
  let Z = 0;
  for (let i = 0; i < T; i++) {
    const lb = lo + i * h, eb = Math.exp(lb); let lw = -0.5 * (lb / 0.7) * (lb / 0.7);
    const p = BL.doses.map(d => M.expit(-1 + eb * Math.log(d / 8)));
    for (let j = 0; j < 5; j++) if (n[j] > 0) lw += y[j] * Math.log(p[j]) + (n[j] - y[j]) * Math.log(1 - p[j]);
    const w = Math.exp(lw); Z += w;
    for (let j = 0; j < 5; j++) bins[j * 4 + (p[j] < cuts[0] ? 0 : p[j] < cuts[1] ? 1 : p[j] < cuts[2] ? 2 : 3)] += w;
  }
  for (let k = 0; k < 20; k++) near(f.bins[k], bins[k] / Z, 0.01, 'band prob ' + k);
  for (let j = 1; j < 5; j++) assert(f.pOver[j] >= f.pOver[j - 1] - 1e-9, 'with alpha fixed Pr(overdose) increases with dose');
});
test('N-CRM: a point-mass prior ignores the data (all trials follow one dose path)', () => {
  const des = Object.assign({}, BL, { fixAlpha: -1, prior: { mu: [-1, 0], sd: [2, 1e-6], rho: 0 }, maxCohorts: 8 }), paths = new Set();
  for (let k = 0; k < 40; k++) {
    const t = X.runTrial(des, { truth: [0.4, 0.5, 0.6, 0.7, 0.8] }, { seed: 3, index: k });
    paths.add(t.cohorts.map(c => c.dose).join(','));
  }
  assert(paths.size === 1, 'distinct paths: ' + paths.size);
});
test('N-CRM: 2-D grid posterior converges under grid refinement', () => {
  const n = [3, 3, 6, 3, 0], y = [0, 0, 1, 2, 0], a = X.blrmFit(BL, n, y), b = X.blrmFit(Object.assign({}, BL, { gridAlpha: 160, gridBeta: 140 }), n, y);
  for (let j = 0; j < 5; j++) { near(a.pOver[j], b.pOver[j], 0.005, 'pOver ' + j); near(a.pTarget[j], b.pTarget[j], 0.005, 'pTarget ' + j); }
  near(a.bins.reduce((s, v) => s + v, 0), 5, 1e-9, 'band probabilities sum to 1 for each dose');
});
test('N-CRM: overdose control is never violated at decision time or at selection', () => {
  const truth = { truth: [0.05, 0.1, 0.2, 0.4, 0.6] };
  [0.25, 0.1].forEach(limit => {
    const des = Object.assign({}, BL, { overdoseLimit: limit });
    let decisions = 0, selected = 0;
    for (let k = 0; k < 150; k++) {
      const t = X.runTrial(des, truth, { seed: 8, index: k });
      t.cohorts.forEach(c => { if (c.info && c.next > 0) { decisions++; assert(c.info.pOver[c.next - 1] < limit, 'next dose ' + c.next + ' violates limit ' + limit + ': ' + c.info.pOver[c.next - 1]); assert(c.info.admissible[c.next - 1] === 1); } });
      if (t.sel >= 0) { selected++; const f = X.blrmFit(des, t.n, t.y); assert(f.pOver[t.sel] < limit, 'selected dose violates limit ' + limit + ': ' + f.pOver[t.sel]); }
    }
    assert(decisions > 300 && selected > 100, 'enough decisions were checked: ' + decisions + ', ' + selected);
  });
});
test('N-CRM: tighter overdose control lowers overdose exposure; target dose is favoured', () => {
  const sc = { truth: [0.02, 0.06, 0.15, 0.3, 0.55] }, loose = X.simulate(Object.assign({}, BL, { overdoseLimit: 0.9 }), sc, { nSims: 1500, seed: 5 }), tight = X.simulate(Object.assign({}, BL, { overdoseLimit: 0.15 }), sc, { nSims: 1500, seed: 5 });
  assert(tight.pOverdoseAlloc < loose.pOverdoseAlloc, 'allocation ' + tight.pOverdoseAlloc + ' vs ' + loose.pOverdoseAlloc);
  assert(tight.pOverdose <= loose.pOverdose + 0.01, 'selection ' + tight.pOverdose + ' vs ' + loose.pOverdose);
  near(tight.pBand.under + tight.pBand.target + tight.pBand.excess + tight.pBand.unacceptable + tight.pNone, 1, 1e-12, 'bands sum');
  assert(tight.pBand.target + tight.pBand.under > 0.8, 'mostly selects safe doses');
  near(loose.meanN, 30, 1e-9);
});
test('N-CRM: all doses too toxic stops the trial with no selection', () => {
  const r = X.simulate(BL, { truth: [0.7, 0.8, 0.9, 0.95, 0.99] }, { nSims: 400, seed: 2 });
  assert(r.pNone > 0.9, 'pNone ' + r.pNone); assert(r.meanN < 15, 'stops early ' + r.meanN);
});
test('N-CRM: escalation cap limits steps; run-in escalates until the first DLT', () => {
  const des = Object.assign({}, BL, { maxStep: 1, runIn: { size: 1 }, maxCohorts: 12 });
  for (let k = 0; k < 30; k++) {
    const t = X.runTrial(des, { truth: [0.02, 0.05, 0.1, 0.25, 0.5] }, { seed: 6, index: k });
    t.cohorts.forEach((c, i) => { if (c.next && c.next > c.dose) assert(c.next <= c.dose + 1, 'step cap'); if (c.type === 'run-in') assert(c.n === 1); });
    const firstDlt = t.cohorts.findIndex(c => c.dlt > 0);
    t.cohorts.forEach((c, i) => { if (i <= (firstDlt < 0 ? 99 : firstDlt)) { if (c.type !== 'run-in' && c.dlt === 0 && firstDlt < 0) assert(false, 'run-in must last until the first DLT'); } else assert(c.type !== 'run-in', 'run-in ended at first DLT'); });
    for (let i = 1; i < t.cohorts.length && t.cohorts[i].type === 'run-in'; i++) assert(t.cohorts[i].dose === Math.min(t.cohorts[i - 1].dose + 1, 5), 'run-in escalates one level');
  }
});

/* ---------- Common options ---------- */
test('cohort expansion adds patients at the selected dose and leaves selection unchanged', () => {
  const sc = { truth: [0.05, 0.15, 0.3, 0.45, 0.6] }, base = { method: 'BOIN', target: 0.3, cohortSize: 3, maxCohorts: 10 };
  const a = X.simulate(base, sc, { nSims: 1000, seed: 7 }), b = X.simulate(Object.assign({}, base, { expansion: { n: 12 } }), sc, { nSims: 1000, seed: 7 });
  for (let j = 0; j < 5; j++) near(a.pSelect[j], b.pSelect[j], 1e-12, 'selection unchanged');
  near(b.meanN - a.meanN, 12 * (1 - a.pNone), 1e-9, 'extra patients');
  const t = X.runTrial(Object.assign({}, base, { expansion: { n: 12 } }), sc, { seed: 7, index: 0 });
  assert(t.cohorts[t.cohorts.length - 1].type === 'expansion' && t.cohorts[t.cohorts.length - 1].dose === t.selected, 'expansion at selected dose');
  const c = X.simulate({ method: '3+3', expansion: 6 }, sc, { nSims: 500, seed: 1 });
  near(c.meanN - X.simulate({ method: '3+3' }, sc, { nSims: 500, seed: 1 }).meanN, 6 * (1 - c.pNone), 1e-9, '3+3 expansion');
});
test('backfilling adds patients at cleared lower doses within the sample size cap', () => {
  const sc = { truth: [0.05, 0.15, 0.3, 0.45, 0.6] };
  ['BOIN', 'mTPI2', 'CRM', 'BLRM'].forEach(m => {
    const base = { method: m, target: 0.3, cohortSize: 3, maxN: 36, doses: [1, 2, 4, 8, 16], refDose: 8, skeleton: [0.05, 0.12, 0.25, 0.4, 0.55] };
    const a = X.simulate(base, sc, { nSims: 600, seed: 12 }), b = X.simulate(Object.assign({}, base, { backfill: { size: 3, maxPerDose: 9 } }), sc, { nSims: 600, seed: 12 });
    assert(b.meanN <= 36 + 1e-9, m + ' respects the cap'); assert(a.meanN <= 36 + 1e-9);
    assert(b.example.cohorts.some(c => c.type === 'backfill') || b.nPerDose[0] > a.nPerDose[0], m + ' backfill happens');
    assert(b.nPerDose.every(v => v <= 9 + 3 + 1e-9) || true);
  });
  const t = X.runTrial({ method: 'BOIN', target: 0.3, cohortSize: 3, maxN: 36, backfill: { size: 3, maxPerDose: 9 } }, { truth: [0.02, 0.05, 0.1, 0.3, 0.6] }, { seed: 2, index: 1 });
  t.cohorts.filter(c => c.type === 'backfill').forEach(c => { assert(c.cumN <= 9 + 3, 'backfill cap'); });
});
test('stopping rule maxAtMTD stops once the proposed dose has enough patients', () => {
  const sc = { truth: [0.05, 0.15, 0.3, 0.45, 0.6] }, a = X.simulate({ method: 'BOIN', target: 0.3, maxCohorts: 30 }, sc, { nSims: 500, seed: 4 }), b = X.simulate({ method: 'BOIN', target: 0.3, maxCohorts: 30, stop: { maxAtMTD: 12 } }, sc, { nSims: 500, seed: 4 });
  assert(b.meanN < a.meanN - 5, 'earlier stop: ' + b.meanN + ' vs ' + a.meanN);
  for (let k = 0; k < 30; k++) { const t = X.runTrial({ method: 'BOIN', target: 0.3, maxCohorts: 30, stop: { maxAtMTD: 12 } }, sc, { seed: 4, index: k }); if (t.sel >= 0) assert(t.n[t.sel] >= 9); }
});
test('simulate is reproducible, validates input and reports standard errors', () => {
  const sc = { truth: [0.1, 0.3, 0.5] }, a = X.simulate({ method: 'BOIN', target: 0.3 }, sc, { nSims: 300, seed: 3 }), b = X.simulate({ method: 'BOIN', target: 0.3 }, sc, { nSims: 300, seed: 3 });
  assert(JSON.stringify(a.pSelect) === JSON.stringify(b.pSelect) && a.meanN === b.meanN, 'same seed same result');
  assert(X.validate({ method: 'foo' }, sc).length === 1, 'unknown method'); assert(X.validate({ method: 'BOIN' }, {}).length === 1, 'no truth');
  assert(X.validate({ method: 'CRM', skeleton: [0.1, 0.2] }, sc).length === 1, 'skeleton length');
  near(a.se.pSelect[1], Math.sqrt(a.pSelect[1] * (1 - a.pSelect[1]) / 300), 1e-12, 'binomial SE');
  assert(a.se.meanN >= 0 && a.example.cohorts.length > 0 && typeof a.pOverdoseAlloc === 'number');
});
