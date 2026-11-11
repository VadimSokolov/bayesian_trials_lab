/* Copyright 2026 Nytel. MIT License. Comparisons with R-generated fixtures in tests/fixtures/ (gsDesign, rpact, base R, RBesT). A missing fixture file is reported and skipped. */
'use strict';
const fs = require('fs'), path = require('path');
const { test, assert, near } = require('./harness.js');
const M = require('../core-math.js'), Mod = require('../models.js'), C = require('../core-engine.js');
function load(name) { const p = path.join(__dirname, 'fixtures', name + '.json'); return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')).entries : null; }
const binaryDesign = (N, p0, p1) => ({ study: { endpoint: 'dichotomous', maxN: N, arms: [{ name: 'C', dose: 0, isControl: true }, { name: 'T', dose: 1 }] }, accrual: { regions: [{ peakPerWeek: 20 }] }, visitWeeks: [4], allocation: { type: 'fixed', ratio: [1, 1] }, qois: [{ id: 'p', type: 'pvalue' }], rules: { final: { success: { qoi: 'p', cmp: '<=', value: 0.025 } } } });
const SPEND = { 'OBF classical': 'obf', 'Pocock classical': 'pocock', 'Lan-DeMets OF': 'ldobf', 'Lan-DeMets Pocock': 'ldpocock' };

test('fixture group-sequential.json: boundaries (gsDesign and rpact, 4 spending types, K = 2 to 5)', () => {
  const E = load('group-sequential'); if (!E) { console.log('      SKIP: group-sequential.json missing'); return; }
  let n = 0;
  E.forEach(e => {
    const type = SPEND[e.inputs.spending] || (/OBF classical/.test(e.id) ? 'obf' : /Pocock classical/.test(e.id) ? 'pocock' : /Lan-DeMets_OF/.test(e.id) ? 'ldobf' : /Lan-DeMets_Pocock/.test(e.id) ? 'ldpocock' : null);
    if (!type || !e.outputs.z_upper) return;
    const t = e.inputs.timing || e.inputs.informationRates, b = C.gsBounds(t, type, e.inputs.alpha);
    b.forEach((v, k) => near(v, e.outputs.z_upper[k], type === 'obf' || type === 'pocock' ? 0.01 : 0.006, e.id + ' look ' + (k + 1))); n++;
  });
  assert(n >= 24, 'compared ' + n + ' designs');
});
test('fixture group-sequential.json: simulated power of the benchmark design', () => {
  const E = load('group-sequential'); if (!E) { console.log('      SKIP'); return; }
  const e = E.find(x => x.id === 'gsDesign-binary-30v45-K4-OF'); if (!e) { console.log('      SKIP: entry missing'); return; }
  const N = 2 * Math.ceil(e.outputs.total_N_max / 2), gs = C.gsDesign(binaryDesign(N), { K: 4, spending: 'ldobf' }), r = C.simulate(gs, { truth: [0.3, 0.45] }, { nSims: 6000, seed: 41 });
  near(r.summary.pSuccess, e.inputs.power, 0.03, 'power of the group sequential design (fixture power ' + e.inputs.power + ')');
});
test('fixture fixed-sample.json: simulated power at the R sample sizes (nBinomial) and normal sample size', () => {
  const E = load('fixed-sample'); if (!E) { console.log('      SKIP: fixed-sample.json missing'); return; }
  const got = [];
  E.filter(e => /^nBinomial/.test(e.id)).forEach(e => {
    const N = 2 * Math.ceil(e.outputs.total_N_default / 2), r = C.simulate(binaryDesign(N), { truth: [e.inputs.p1, e.inputs.p2] }, { nSims: 8000, seed: 51 });
    near(r.summary.pSuccess, e.inputs.power, 4 * r.summary.mcse.pSuccess + 0.012, e.id); got.push(e.id);
  });
  const nn = E.find(e => e.id === 'nNormal-d0.5');
  if (nn) { const N = 2 * Math.ceil(nn.outputs.total_N_unrounded / 2), D = { study: { endpoint: 'continuous', sigma: 1, maxN: N, arms: [{ name: 'C', dose: 0, isControl: true }, { name: 'T', dose: 1 }] }, accrual: { regions: [{ peakPerWeek: 20 }] }, visitWeeks: [4], allocation: { type: 'fixed', ratio: [1, 1] }, qois: [{ id: 'p', type: 'pvalue' }], rules: { final: { success: { qoi: 'p', cmp: '<=', value: 0.025 } } } };
    const r = C.simulate(D, { truth: [0, 0.5], sd: 1 }, { nSims: 8000, seed: 52 }); near(r.summary.pSuccess, nn.inputs.power, 0.035, 'nNormal (z with estimated variance loses a little power)'); }
  assert(got.length >= 4, 'binomial entries compared: ' + got.length);
});
test('fixture beta-binomial.json: posterior, quantiles, thresholds, predictive probability', () => {
  const E = load('beta-binomial'); if (!E) { console.log('      SKIP: beta-binomial.json missing'); return; }
  const post = E.find(e => e.id === 'betabinom-posterior-prob'), o = post.outputs, i = post.inputs, A = i.a0 + i.r, B = i.b0 + i.n - i.r;
  near(1 - M.betaCdf(i.threshold, A, B), o['p_gt_0.5'], 1e-9); near(A / (A + B), o.post_mean, 1e-9); near(M.betaInv(0.025, A, B), o.q025, 1e-8); near(M.betaInv(0.975, A, B), o.q975, 1e-8);
  const c = Mod.prepare({ study: { endpoint: 'dichotomous', arms: [{ isControl: true, dose: 0 }, { dose: 1 }] }, model: { type: 'independentBeta', prior: { a: i.a0, b: i.b0 } } }), f = Mod.fit(c, { n: [i.n, i.n], s: [i.r, i.r], ss: [0, 0] }, M.makeRng(1), { nDraws: 40000 });
  near(f.mean[0], o.post_mean, 1e-9); let cnt = 0; for (let j = 0; j < 40000; j++) if (f.draws[j * 2] > i.threshold) cnt++; near(cnt / 40000, o['p_gt_0.5'], 0.008, 'engine posterior probability from draws');
  const th = E.find(e => e.id === 'betabinom-success-thresholds');
  th.inputs.n.forEach((n, k) => { const r = th.outputs.min_responses[k]; assert(1 - M.betaCdf(th.inputs.p0, 1 + r, 1 + n - r) >= th.inputs.thr && 1 - M.betaCdf(th.inputs.p0, r, 1 + n - r + 1) < th.inputs.thr, 'threshold n=' + n); });
  E.filter(e => /^betabinom-ppos/.test(e.id)).forEach(e => {
    const a = e.inputs.a0 + e.inputs.r_interim, b = e.inputs.b0 + e.inputs.n_interim - e.inputs.r_interim, m = e.inputs.nmax - e.inputs.n_interim, xmin = e.outputs.min_total_responses_for_success - e.inputs.r_interim;
    const lb = (x, y) => M.logGamma(x) + M.logGamma(y) - M.logGamma(x + y); let ppos = 0;
    for (let x = 0; x <= m; x++) { const pmf = Math.exp(M.logGamma(m + 1) - M.logGamma(x + 1) - M.logGamma(m - x + 1) + lb(a + x, b + m - x) - lb(a, b)); near(pmf, e.outputs.predictive_pmf_remaining_responses[x], 1e-9, 'pmf ' + x); if (x >= xmin) ppos += pmf; }
    near(ppos, e.outputs.ppos_posterior_rule, 1e-9, e.id);
  });
});
