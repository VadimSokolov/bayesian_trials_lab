/* Copyright 2026 Nytel. MIT License. Tests for historical borrowing for the control arm (NSim.models.borrow and design.borrowing in the Core engine): RBesT fixture (borrowing.json), type I error under prior-data conflict, tau limits of the hierarchical prior. */
'use strict';
const fs = require('fs'), path = require('path');
const { test, assert, near } = require('./harness.js');
const M = require('../core-math.js'), Mod = require('../models.js'), C = require('../core-engine.js');
const B = Mod.borrow, DICH = { endpoint: 'dichotomous' }, CONT = { endpoint: 'continuous', sigma: 2 };
const fx = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'borrowing.json'), 'utf8')).entries;
const entry = (id) => fx.find(e => e.id === id);
const robust = () => B.prepare({ method: 'robust', informative: { a: 12, b: 28 }, robustWeight: 0.2 }, DICH);
const binom = (n, x, p) => Math.exp(M.logGamma(n + 1) - M.logGamma(x + 1) - M.logGamma(n - x + 1) + x * Math.log(p) + (n - x) * Math.log(1 - p));

test('RBesT fixture: robust mixture prior (mean, sd, quantiles, cdf)', () => {
  const o = entry('rbest-robust-prior').outputs, b = robust(), mo = B.moments(b.prior);
  near(mo.mean, o.mean, 1e-9, 'mean'); near(mo.sd, o.sd, 1e-9, 'sd');
  near(B.quantile(b.prior, 0.025), o.q025, 1e-6, 'q025'); near(B.quantile(b.prior, 0.5), o.q50, 1e-6, 'q50'); near(B.quantile(b.prior, 0.975), o.q975, 1e-5, 'q975 (RBesT root finder is accurate to about 1e-6)'); near(B.cdf(b.prior, 0.3), o['cdf_at_0.3'], 1e-9, 'cdf');
});
test('RBesT fixture: prior effective sample size (moment and ELIR; Morita not implemented)', () => {
  const o = entry('rbest-ess').outputs, b = robust();
  near(B.ess({ kind: 'beta', w: [1], a: [12], b: [28] }, 'moment'), o.beta_12_28.moment, 1e-9); near(B.ess({ kind: 'beta', w: [1], a: [12], b: [28] }, 'elir'), o.beta_12_28.elir, 1e-6);
  near(b.essPrior.moment, o.robust.moment, 1e-8, 'moment ESS of the mixture'); near(b.essPrior.elir, o.robust.elir, 1e-4, 'ELIR ESS of the mixture');
  assert(o.robust.morita > b.essPrior.moment && o.robust.moment < o.robust.elir, 'RBesT ordering moment < ELIR < Morita');
});
test('RBesT fixture: posterior of the robust prior after 12 responses in 20 (weights updated exactly)', () => {
  const o = entry('rbest-posterior').outputs, p = B.posterior(robust().prior, 20, 12), mo = B.moments(p);
  near(p.w[0], o.weights[0], 1e-9); near(p.w[1], o.weights[1], 1e-9); assert(p.a[0] === o.a[0] && p.a[1] === o.a[1] && p.b[0] === o.b[0] && p.b[1] === o.b[1], 'component parameters');
  near(mo.mean, o.mean, 1e-9); near(B.quantile(p, 0.025), o.q025, 5e-5, 'q025 (RBesT root finder tolerance)'); near(B.cdf(p, o.q025), 0.025, 5e-5, 'cdf at the RBesT q025'); near(B.quantile(p, 0.5), o.q50, 5e-5); near(B.quantile(p, 0.975), o.q975, 5e-5); near(1 - B.cdf(p, 0.5), o['p_gt_0.5'], 1e-9);
});
// Exact operating characteristics by enumeration of the binomial counts.
function oc2S(n1, n2, prior2, thr) {
  const NP = 1500, pg = Array.from({ length: NP }, (_, i) => (i + 0.5) / NP), F1 = [], f2 = [], ok = [];
  for (let x = 0; x <= n1; x++) F1.push(pg.map(p => M.betaCdf(p, 1 + x, 1 + n1 - x)));
  for (let x = 0; x <= n2; x++) { const q = B.posterior(prior2, n2, x); f2.push(pg.map(p => { let s = 0; for (let k = 0; k < q.w.length; k++) s += q.w[k] * M.betaPdf(p, q.a[k], q.b[k]); return s; })); }
  for (let x1 = 0; x1 <= n1; x1++) { ok.push([]); for (let x2 = 0; x2 <= n2; x2++) { let s = 0; for (let i = 0; i < NP; i++) s += f2[x2][i] * (1 - F1[x1][i]); ok[x1].push(s / NP >= thr); } }
  return (p1, p2) => { let s = 0; for (let x1 = 0; x1 <= n1; x1++) for (let x2 = 0; x2 <= n2; x2++) if (ok[x1][x2]) s += binom(n1, x1, p1) * binom(n2, x2, p2); return s; };
}
test('RBesT fixture: oc2S decision operating characteristics (exact enumeration)', () => {
  const e = entry('rbest-oc2s'), oc = oc2S(40, 20, robust().prior, 0.975);
  e.inputs.scenarios.forEach((s, i) => near(oc(s.pc, s.pt), e.outputs.prob_success[i], 0.0015, 'scenario ' + i)); // RBesT oc(pc, pt): first argument is the n1 = 40 arm with the vague prior
});
test('RBesT fixture: oc1S operating characteristics and cutoff count', () => {
  const e = entry('rbest-oc1s'), pr = robust().prior;
  let cut = -1; for (let x = 0; x <= 30; x++) if (1 - B.cdf(B.posterior(pr, 30, x), 0.3) >= 0.95) { cut = x; break; }
  assert(cut === e.outputs.decision_cutoff_count, 'cutoff ' + cut);
  e.inputs.p.forEach((p, i) => { let s = 0; for (let x = cut; x <= 30; x++) s += binom(30, x, p); near(s, e.outputs.prob_success[i], 1e-6, 'p = ' + p); });
});
const twoArm = (nC, nT, bor, extra) => Object.assign({
  study: { endpoint: 'dichotomous', maxN: nC + nT, arms: [{ name: 'C', dose: 0, isControl: true }, { name: 'T', dose: 1 }] }, accrual: { regions: [{ peakPerWeek: 20 }] }, visitWeeks: [4],
  allocation: { type: 'fixed', ratio: [nC, nT] }, model: { type: 'independentBeta' }, borrowing: bor, simulation: { nDraws: 1000 }, qois: [{ id: 'pp', type: 'postProb', delta: 0 }], rules: { final: { success: { qoi: 'pp', cmp: '>=', value: 0.975 } } } }, extra || {});
test('engine with robust borrowing reproduces the oc2S operating characteristics (simulation)', () => {
  // arm "T" (n = 40, vague prior) plays RBesT arm 1 with rate pc; the control arm (n = 20, robust prior) plays arm 2 with rate pt; success: P(arm 1 > arm 2) >= 0.975
  const e = entry('rbest-oc2s'), D = twoArm(20, 40, { method: 'robust', informative: { a: 12, b: 28 }, robustWeight: 0.2 });
  D.rules.final.success = { qoi: 'pp', cmp: '>=', value: 0.975 }; D.qois = [{ id: 'pp', type: 'postProb', delta: 0, direction: 'greater' }];
  [0, 3].forEach(i => {
    const s = e.inputs.scenarios[i], r = C.simulate(D, { truth: [s.pt, s.pc] }, { nSims: 4000, seed: 71 + i });
    near(r.summary.allocationMean[0], 20, 1.5, 'control size'); // allocation is not exactly 20 : 40 in every trial
    near(r.summary.pSuccess, e.outputs.prob_success[i], 4 * r.summary.mcse.pSuccess + 0.012, 'scenario ' + i);
  });
});
test('type I error under prior-data conflict rises with borrowing strength and falls with the robust weight', () => {
  const hist = [{ n: 100, r: 30 }, { n: 100, r: 30 }], truth = [0.42, 0.42], sim = (bor, seed) => C.simulate(twoArm(60, 60, bor), { truth: truth }, { nSims: 3000, seed: seed }).summary;
  const none = sim(null, 5).pSuccess, pw = [0.25, 0.5, 1].map(a0 => sim({ method: 'power', historical: hist, a0: a0 }, 5).pSuccess);
  const rb = [0.05, 0.4, 0.9].map(w => sim({ method: 'robust', historical: hist, robustWeight: w }, 5));
  console.log('      type I error (true control 0.42, historical 0.30): no borrowing ' + none.toFixed(3) + '; power prior a0 = 0.25, 0.5, 1: ' + pw.map(x => x.toFixed(3)).join(', ') + '; robust weight 0.05, 0.4, 0.9: ' + rb.map(x => x.pSuccess.toFixed(3)).join(', '));
  assert(none < pw[0] && pw[0] < pw[1] && pw[1] < pw[2], 'type I error must rise with a0');
  assert(rb[0].pSuccess > rb[1].pSuccess && rb[1].pSuccess > rb[2].pSuccess, 'type I error must fall with the robust weight');
  assert(rb[2].pSuccess < none + 0.03 && pw[2] > 0.15, 'conflict inflates the power prior but not the heavily robustified prior');
  assert(rb[0].borrowing.meanWeightInformative > rb[2].borrowing.meanWeightInformative && rb[0].borrowing.meanNBorrowed > rb[2].borrowing.meanNBorrowed, 'diagnostics follow the robust weight');
});
test('diagnostics: posterior weight on the informative component drops with prior-data conflict', () => {
  const bor = { method: 'robust', informative: { a: 12, b: 28 }, robustWeight: 0.2 };
  const agree = C.simulate(twoArm(60, 60, bor), { truth: [0.3, 0.3] }, { nSims: 300, seed: 3 }).summary.borrowing, conflict = C.simulate(twoArm(60, 60, bor), { truth: [0.6, 0.6] }, { nSims: 300, seed: 3 }).summary.borrowing;
  assert(agree.meanWeightInformative > 0.9 && conflict.meanWeightInformative < 0.4, 'weights ' + agree.meanWeightInformative + ' vs ' + conflict.meanWeightInformative);
  assert(agree.meanNBorrowed > conflict.meanNBorrowed && agree.meanNBorrowed > 20, 'borrowed ' + agree.meanNBorrowed + ' vs ' + conflict.meanNBorrowed);
  near(agree.essPrior.elir, 25.66, 0.01, 'ELIR ESS reported'); const t = C.simulate(twoArm(60, 60, bor), { truth: [0.3, 0.3] }, { nSims: 5, seed: 3 }).trials[0]; assert(t.borrow && t.borrow.wInf > 0, 'trial record has borrow diagnostics');
});
test('hierarchical borrowing (dichotomous): tau near 0 equals pooling, tau large equals no borrowing', () => {
  const hist = [{ n: 50, r: 15 }, { n: 60, r: 20 }, { n: 80, r: 22 }], R = 57, N = 190, n = 100, s = 40;
  const post = (tau) => B.moments(B.posterior(B.prepare({ method: 'hierarchical', historical: hist, tau: { fixed: tau } }, DICH).prior, n, s));
  const pooled = B.moments(B.posterior({ kind: 'beta', w: [1], a: [1 + R], b: [1 + N - R] }, n, s)), lo = post(0.001), hi = post(30), flat = s / n;
  near(lo.mean, pooled.mean, 0.003, 'tau = 0.001 vs pooled beta posterior'); near(lo.sd, pooled.sd, 0.002);
  near(hi.mean, flat, 0.004, 'tau = 30 vs no borrowing'); near(hi.sd, Math.sqrt(flat * (1 - flat) / n), 0.003);
  const mid = post(0.3).mean; assert(mid > lo.mean && mid < hi.mean, 'tau = 0.3 lies between: ' + mid);
  const dyn = B.prepare({ method: 'hierarchical', historical: hist, tau: { prior: 'halfNormal', scale: 0.5 } }, DICH);
  assert(dyn.essPrior.moment > 5 && dyn.essPrior.moment < 190 && dyn.info.tauMean > 0, 'dynamic borrowing: prior ESS ' + dyn.essPrior.moment);
  const conflict = B.moments(B.posterior(dyn.prior, 100, 60)); assert(conflict.mean > 0.5, 'data dominate under conflict: ' + conflict.mean);
});
test('hierarchical borrowing (continuous): normal-normal closed forms, tau limits, ESS', () => {
  const hist = [{ n: 50, mean: 1, sd: 2 }, { n: 60, mean: 1.5, sd: 2 }, { n: 80, mean: 0.8, sd: 2 }], n = 40, ybar = 2.5, sig2 = 4;
  const post = (tau) => B.moments(B.posterior(B.prepare({ method: 'hierarchical', historical: hist, tau: { fixed: tau } }, CONT).prior, n, ybar * n, sig2));
  const pooledMean = (50 * 1 + 60 * 1.5 + 80 * 0.8) / 190, lo = post(1e-6), hi = post(1e3);
  near(lo.mean, (190 * pooledMean + n * ybar) / (190 + n), 1e-3, 'tau -> 0: pooled'); near(lo.sd, Math.sqrt(4 / 230), 1e-3);
  near(hi.mean, ybar, 1e-3, 'tau large: no borrowing'); near(hi.sd, Math.sqrt(4 / n), 1e-3);
  const dyn = B.prepare({ method: 'hierarchical', historical: hist, tau: { prior: 'halfNormal', scale: 1 } }, CONT); assert(dyn.essPrior.moment > 2 && dyn.essPrior.elir > 2, 'ESS ' + JSON.stringify(dyn.essPrior));
});
test('power prior and robust normal mixture: ESS, exact posterior, brute-force check', () => {
  const hist = [{ n: 50, mean: 1, sd: 2 }, { n: 50, mean: 1.5, sd: 2 }], pw = B.prepare({ method: 'power', historical: hist, a0: 0.5 }, CONT);
  near(pw.essPrior.moment, 50, 1e-9); near(pw.essPrior.elir, 50, 1e-6, 'power prior ESS = a0 * N');
  const bd = B.prepare({ method: 'power', historical: [{ n: 50, r: 15 }, { n: 50, r: 20 }], a0: 0.4 }, DICH); near(bd.essPrior.moment, 2 + 0.4 * 100, 1e-9); near(bd.essPrior.elir, 2 + 0.4 * 100, 1e-6);
  const rb = B.prepare({ method: 'robust', historical: hist, robustWeight: 0.3 }, CONT), n = 30, ybar = 3, sig2 = 4, po = B.posterior(rb.prior, n, n * ybar, sig2);
  let Z = 0, m1 = 0, m2 = 0; const lo = -30, hi = 30, NG = 60000, dx = (hi - lo) / NG;
  for (let i = 0; i < NG; i++) { const x = lo + (i + 0.5) * dx; let pr = 0; for (let k = 0; k < 2; k++) pr += rb.prior.w[k] * Math.exp(-0.5 * ((x - rb.prior.m[k]) / rb.prior.s[k]) ** 2) / rb.prior.s[k]; const f = pr * Math.exp(-0.5 * (ybar - x) ** 2 * n / sig2); Z += f; m1 += f * x; m2 += f * x * x; }
  const mo = B.moments(po); near(mo.mean, m1 / Z, 1e-6); near(mo.sd, Math.sqrt(m2 / Z - (m1 / Z) ** 2), 1e-6);
  assert(rb.essPrior.elir > rb.essPrior.moment, 'robust ELIR ESS exceeds the moment ESS');
});
test('engine: continuous endpoint with hierarchical borrowing, unsupported model rejected', () => {
  const hist = [{ n: 50, mean: 0, sd: 1 }, { n: 60, mean: 0.1, sd: 1 }];
  const D = { study: { endpoint: 'continuous', sigma: 1, maxN: 120, arms: [{ name: 'C', dose: 0, isControl: true }, { name: 'T', dose: 1 }] }, accrual: { regions: [{ peakPerWeek: 20 }] }, visitWeeks: [4], allocation: { type: 'fixed', ratio: [1, 1] }, model: { type: 'independent' }, borrowing: { method: 'hierarchical', historical: hist, tau: { prior: 'halfNormal', scale: 0.3 } }, simulation: { nDraws: 500 }, qois: [{ id: 'pp', type: 'postProb' }], rules: { final: { success: { qoi: 'pp', cmp: '>', value: 0.975 } } } };
  const r = C.simulate(D, { truth: [0, 0], sd: 1 }, { nSims: 200, seed: 8 }); assert(r.summary.borrowing && r.summary.borrowing.meanNBorrowed > 5, 'borrowed ' + (r.summary.borrowing && r.summary.borrowing.meanNBorrowed));
  assert(r.summary.borrowing.meanWeightInformative === null && r.summary.borrowing.tauMean > 0, 'hierarchical has no mixture weight, reports tau');
  let err = null; try { C.simulate(Object.assign({}, D, { model: { type: 'sigmoid' } }), { truth: [0, 0] }, { nSims: 2 }); } catch (e) { err = e; } assert(err && /borrowing/.test(err.message), 'sigmoid rejected');
  const noB = C.simulate(Object.assign({}, D, { borrowing: undefined }), { truth: [0, 0], sd: 1 }, { nSims: 200, seed: 8 }); assert(!noB.summary.borrowing, 'no borrowing summary without borrowing');
});
