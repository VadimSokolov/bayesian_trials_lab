/* Copyright 2026 Nytel. MIT License. Tests for NSim.models. */
'use strict';
const { test, assert, near } = require('./harness.js');
const M = require('../core-math.js'), Mod = require('../models.js');
const arms = (k) => [{ name: 'C', dose: 0, isControl: true }].concat(Array.from({ length: k }, (_, i) => ({ name: 'D' + (i + 1), dose: i + 1 })));
const cont = (k, model) => Mod.prepare({ study: { endpoint: 'continuous', sigma: 1, arms: arms(k) }, model: model });
const dich = (k, model) => Mod.prepare({ study: { endpoint: 'dichotomous', arms: arms(k) }, model: model });

test('beta-binomial posterior is exact', () => {
  const c = dich(2, { type: 'independentBeta', prior: { a: 2, b: 3 } }), data = { n: [20, 20, 20], s: [6, 12, 15], ss: [0, 0, 0] };
  const f = Mod.fit(c, data, M.makeRng(1), { nDraws: 20000 });
  for (let d = 0; d < 3; d++) {
    const A = 2 + data.s[d], B = 3 + data.n[d] - data.s[d];
    near(f.mean[d], A / (A + B), 1e-12); near(f.sd[d], Math.sqrt(A * B / ((A + B) ** 2 * (A + B + 1))), 1e-12);
    let m = 0; for (let j = 0; j < 20000; j++) m += f.draws[j * 3 + d] / 20000; near(m, A / (A + B), 0.004, 'draw mean');
    let cnt = 0; for (let j = 0; j < 20000; j++) if (f.draws[j * 3 + d] > 0.5) cnt++; near(cnt / 20000, 1 - M.betaCdf(0.5, A, B), 0.01, 'Pr(p > 0.5)');
  }
});
test('normal-normal posterior is exact (conjugate normal-inverse-gamma)', () => {
  const c = cont(2, { type: 'independent', prior: { mean: 5, kappa: 2 }, sigmaPrior: { center: 1.5, weight: 4 } });
  const data = { n: [10, 20, 30], s: [10, 40, 90], ss: [20, 110, 330] };
  const f = Mod.fit(c, data, M.makeRng(2), { nDraws: 40000 });
  for (let d = 0; d < 3; d++) near(f.mean[d], (2 * 5 + data.s[d]) / (2 + data.n[d]), 1e-12, 'posterior mean');
  const an = 2 + 30, bn = (4 * 1.5 * 1.5 / 2) + 0.5 * (() => { let W = 0; for (let d = 0; d < 3; d++) { const yb = data.s[d] / data.n[d]; W += data.ss[d] - data.s[d] * yb + 2 * data.n[d] * (yb - 5) ** 2 / (2 + data.n[d]); } return W; })();
  near(f.post.an, an, 1e-12); near(f.post.bn, bn, 1e-10);
  near(f.thetaSd[1], Math.sqrt(bn / (an - 1) / 22), 1e-12);
  let m = 0, s2 = 0; for (let j = 0; j < 40000; j++) { const x = f.draws[j * 3 + 1]; m += x; s2 += x * x; } m /= 40000;
  near(m, f.mean[1], 0.01); near(Math.sqrt(s2 / 40000 - m * m), f.thetaSd[1], 0.02 * f.thetaSd[1]);
  let sg = 0; for (let j = 0; j < 40000; j++) sg += f.sigma[j] ** 2 / 40000; near(sg, bn / (an - 1), 0.03 * bn / (an - 1), 'sigma^2 mean');
});
test('logit-normal independent model matches the Laplace posterior mode', () => {
  const c = dich(1, { type: 'independent', prior: { mean: 0, sd: 1e3 } }), f = Mod.fit(c, { n: [50, 50], s: [10, 25], ss: [0, 0] }, M.makeRng(3), { nDraws: 0 });
  near(f.thetaMean[0], Math.log(10 / 40), 1e-3); near(f.thetaSd[0], Math.sqrt(1 / 10 + 1 / 40), 2e-3);
});
test('NDLM: tau -> 0 gives the pooled mean, tau large gives the independent fits', () => {
  const data = { n: [20, 20, 20, 20], s: [0, 5, 10, 20], ss: [20, 25, 30, 40] }, ybar = [0, 0.25, 0.5, 1];
  const lo = Mod.fit(cont(3, { type: 'ndlm', tau: { fixed: 1e-6 } }), data, M.makeRng(1), { nDraws: 0 });
  const pooled = (0.25 + 0.5 + 1) / 3; near(lo.thetaMean[0], 0, 1e-3, 'control separate');
  for (let d = 1; d <= 3; d++) near(lo.thetaMean[d], pooled, 2e-3, 'pooled');
  const hi = Mod.fit(cont(3, { type: 'ndlm', tau: { fixed: 1e3 } }), data, M.makeRng(1), { nDraws: 0 });
  for (let d = 0; d <= 3; d++) near(hi.thetaMean[d], ybar[d], 2e-3, 'independent');
  const ind = Mod.fit(cont(3, { type: 'independent' }), data, M.makeRng(1), { nDraws: 0 });
  for (let d = 0; d <= 3; d++) near(hi.thetaSd[d], ind.thetaSd[d], 0.05 * ind.thetaSd[d] + 1e-3, 'sd close to independent (plug-in sigma vs t marginal)');
});
test('NDLM posterior is a proper mixture over tau and draws agree with exact moments', () => {
  const data = { n: [20, 20, 20, 20, 20], s: [0, 4, 3, 12, 10], ss: [20, 22, 21, 33, 30] }, c = cont(4, { type: 'ndlm', tau: { center: 0.3 } });
  const f = Mod.fit(c, data, M.makeRng(5), { nDraws: 20000 });
  near(f.tauWeights.reduce((a, b) => a + b, 0), 1, 1e-9);
  for (let d = 0; d < 5; d++) { let m = 0; for (let j = 0; j < 20000; j++) m += f.draws[j * 5 + d] / 20000; near(m, f.mean[d], 0.01, 'draw mean ' + d); }
  // smoothing: dose-arm means are closer to each other than the raw means
  const raw = [0.2, 0.15, 0.6, 0.5]; const post = [1, 2, 3, 4].map(d => f.mean[d]);
  assert(Math.max(...post) - Math.min(...post) < Math.max(...raw) - Math.min(...raw), 'smoothed');
});
test('hierarchical model shrinks toward the grand mean', () => {
  const data = { n: [30, 30, 30, 30], s: [0, 0, 30, 60], ss: [30, 30, 60, 150] }, raw = [0, 0, 1, 2], grand = (0 + 1 + 2) / 3;
  const f = Mod.fit(cont(3, { type: 'hierarchical', tau: { fixed: 0.5 } }), data, M.makeRng(1), { nDraws: 0 });
  for (const d of [1, 3]) { const r = raw[d]; assert(Math.abs(f.thetaMean[d] - grand) < Math.abs(r - grand), 'arm ' + d + ' moves toward grand mean'); }
  near(f.thetaMean[2], grand, 0.05, 'middle arm stays near the grand mean');
  assert(f.thetaMean[1] < f.thetaMean[2] && f.thetaMean[2] < f.thetaMean[3], 'order kept');
  const g2 = Mod.fit(cont(3, { type: 'hierarchical', tau: { fixed: 5 } }), data, M.makeRng(1), { nDraws: 0 });
  assert(Math.abs(g2.thetaMean[3] - 2) < Math.abs(f.thetaMean[3] - 2), 'larger tau shrinks less');
});
test('monotone and second-order NDLM, linear model', () => {
  const data = { n: [25, 25, 25, 25, 25], s: [0, 10, 6, 14, 12], ss: [25, 35, 31, 39, 37] };
  const m = Mod.fit(cont(4, { type: 'ndlmMonotone', tau: { center: 0.4 } }), data, M.makeRng(2), { nDraws: 2000 });
  for (let j = 0; j < 2000; j++) for (let d = 2; d <= 4; d++) assert(m.draws[j * 5 + d] >= m.draws[j * 5 + d - 1] - 1e-12, 'monotone draw');
  assert(m.mean[2] >= m.mean[1] && m.mean[4] >= m.mean[3], 'monotone means');
  const lin = { n: [30, 30, 30, 30, 30], s: [0, 15, 30, 45, 60], ss: [30, 45, 60, 75, 90] };
  const l = Mod.fit(cont(4, { type: 'linear' }), lin, M.makeRng(3), { nDraws: 0 });
  for (let d = 0; d <= 4; d++) near(l.thetaMean[d], 0.5 * d, 0.02, 'linear fit');
  const s2 = Mod.fit(cont(4, { type: 'ndlm2', tau: { fixed: 1e-4 } }), lin, M.makeRng(3), { nDraws: 0 });
  for (let d = 1; d <= 4; d++) near(s2.thetaMean[d], 0.5 * d, 0.02, 'second order, tau -> 0 is linear in the dose arms');
});
test('dichotomous models use the logit normal approximation consistently', () => {
  const data = { n: [60, 60, 60, 60], s: [18, 24, 30, 36], ss: [0, 0, 0, 0] };
  const hi = Mod.fit(dich(3, { type: 'ndlm', tau: { fixed: 1e3 } }), data, M.makeRng(1), { nDraws: 4000 }), ind = Mod.fit(dich(3, { type: 'independentBeta' }), data, M.makeRng(1), { nDraws: 0 });
  for (let d = 0; d <= 3; d++) near(hi.mean[d], ind.mean[d], 0.01, 'tau large near independent beta');
  const lo = Mod.fit(dich(3, { type: 'ndlm', tau: { fixed: 1e-5 } }), data, M.makeRng(1), { nDraws: 0 });
  near(lo.thetaMean[1], lo.thetaMean[3], 1e-3, 'tau 0 pools dose arms');
});
test('nonlinear models (Metropolis): recover a 3-parameter logistic curve, warm start works', () => {
  const doses = [1, 2, 3, 4, 5], truth = [0].concat(doses.map(v => 1 * v / (v + 2.5)));
  const a = [{ name: 'C', dose: 0, isControl: true }].concat(doses.map(v => ({ name: 'D' + v, dose: v })));
  const data = { n: [], s: [], ss: [] }; truth.forEach(t => { data.n.push(300); data.s.push(300 * t); data.ss.push(300 * t * t + 300); });
  for (const type of ['logistic3', 'sigmoid', 'hierLogistic']) {
    const c = Mod.prepare({ study: { endpoint: 'continuous', sigma: 1, arms: a }, model: { type: type, tau: { center: 0.1 } } }), warm = {};
    const f = Mod.fit(c, data, M.makeRng(4), { nDraws: 1000, warm: warm });
    for (let d = 0; d < 6; d++) near(f.mean[d], truth[d], 0.15, type + ' arm ' + d);
    const f2 = Mod.fit(c, data, M.makeRng(5), { nDraws: 1000, warm: warm });
    for (let d = 0; d < 6; d++) near(f2.mean[d], f.mean[d], 0.1, type + ' warm start arm ' + d);
    assert(f.acc > 0.05 && f.acc < 0.8, 'acceptance ' + f.acc);
  }
});
