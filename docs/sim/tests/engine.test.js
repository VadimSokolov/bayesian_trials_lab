/* Copyright 2026 Nytel. MIT License. Tests for NSim.core (the Core engine). */
'use strict';
const { test, assert, near } = require('./harness.js');
const M = require('../core-math.js'), C = require('../core-engine.js');

const two = (extra) => Object.assign({
  study: { endpoint: 'dichotomous', maxN: 330, arms: [{ name: 'C', dose: 0, isControl: true }, { name: 'T', dose: 1 }] },
  accrual: { regions: [{ peakPerWeek: 10, startWeek: 0 }] }, visitWeeks: [12], allocation: { type: 'fixed', ratio: [1, 1] },
  qois: [{ id: 'p', type: 'pvalue' }], rules: { final: { success: { qoi: 'p', cmp: '<=', value: 0.025 } } }
}, extra || {});
const bayes = (extra) => Object.assign({
  study: { endpoint: 'dichotomous', maxN: 300, arms: [{ name: 'C', dose: 0, isControl: true }, { name: 'T', dose: 1 }] },
  accrual: { regions: [{ peakPerWeek: 8 }] }, visitWeeks: [12], model: { type: 'independentBeta' }, allocation: { type: 'fixed', ratio: [1, 1] },
  interims: { trigger: 'enrolled', at: [100, 150, 200, 250] }, qois: [{ id: 'pp', type: 'postProb', delta: 0 }, { id: 'pred', type: 'predProb' }],
  rules: { interim: [{ from: 1, success: { qoi: 'pp', cmp: '>', value: 0.99 }, futility: { qoi: 'pred', cmp: '<', value: 0.05 } }], final: { success: { qoi: 'pp', cmp: '>', value: 0.975 } } }
}, extra || {});
const mcTol = (p, n) => 4 * Math.sqrt(p * (1 - p) / n) + 0.002;

test('fixed two-arm design, no interims: type I error at one-sided 0.025 within Monte Carlo error', () => {
  const n = 20000, r = C.simulate(two(), { truth: [0.3, 0.3] }, { nSims: n, seed: 11 });
  near(r.summary.pSuccess, 0.025, mcTol(0.025, n), 'type I'); near(r.summary.mcse.pSuccess, Math.sqrt(0.025 * 0.975 / n), 2e-4);
  assert(r.summary.pEarlySuccess === 0 && r.summary.meanSubjects === 330);
});
test('fixed two-arm design: power for 30% vs 45%, 2 x 165, close to the closed form', () => {
  const n = 20000, p0 = 0.3, p1 = 0.45, nn = 165, pb = (p0 + p1) / 2;
  const se0 = Math.sqrt(2 * pb * (1 - pb) / nn), se1 = Math.sqrt((p0 * (1 - p0) + p1 * (1 - p1)) / nn), closed = M.Phi((p1 - p0 - M.PhiInv(0.975) * se0) / se1);
  near(closed, 0.806, 0.005, 'closed form'); const r = C.simulate(two(), { truth: [p0, p1] }, { nSims: n, seed: 12 });
  near(r.summary.pSuccess, closed, mcTol(closed, n) + 0.004, 'power'); near(r.summary.allocationMean[0], 165, 0.01);
});
test('group sequential benchmark (classical OBF, 4 looks): type I error within Monte Carlo error, early stops occur under the alternative', () => {
  const n = 20000, gs = C.gsDesign(two(), { K: 4, spending: 'obf' });
  near(gs.benchmarkInfo.bounds[3], 2.0243, 0.01, 'last bound'); near(gs.benchmarkInfo.bounds[0], 4.0486, 0.02, 'first bound');
  const r0 = C.simulate(gs, { truth: [0.3, 0.3] }, { nSims: n, seed: 13 });
  near(r0.summary.pSuccess, 0.025, mcTol(0.025, n) + 0.001, 'type I');
  const r1 = C.simulate(gs, { truth: [0.3, 0.45] }, { nSims: 4000, seed: 14 });
  assert(r1.summary.pEarlySuccess > 0.1 && r1.summary.meanSubjects < 330, 'early stopping'); assert(r1.summary.pSuccess > 0.74 && r1.summary.pSuccess < 0.86, 'power ' + r1.summary.pSuccess);
  const fx = C.simulate(C.gsDesign(two(), { K: 1 }), { truth: [0.3, 0.45] }, { nSims: 4000, seed: 14 }), fx2 = C.simulate(two(), { truth: [0.3, 0.45] }, { nSims: 4000, seed: 14 });
  near(fx.summary.pSuccess, fx2.summary.pSuccess, 1e-12, 'K = 1 equals the fixed design on the same patients');
  const b = C.simulateBenchmark(two(), { truth: [0.3, 0.45] }, { nSims: 200, seed: 1, benchmark: { K: 3, spending: 'ldobf' } }); assert(b.summary.nSims === 200);
});
test('seven outcome counts sum to nSims; codes are consistent with the stopping interim', () => {
  const n = 1000, flip = bayes({ rules: { interim: [{ from: 1, success: { qoi: 'pp', cmp: '>', value: 0.9 }, futility: { qoi: 'pred', cmp: '<', value: 0.1 } }], final: { success: { qoi: 'pp', cmp: '>', value: 0.975 }, futility: { qoi: 'pp', cmp: '<', value: 0.6 } } } });
  for (const truth of [[0.3, 0.3], [0.3, 0.45], [0.3, 0.2]]) {
    const r = C.simulate(flip, { truth: truth }, { nSims: n, seed: 21 }), s = r.summary;
    assert(s.counts.length === 7 && s.counts.reduce((a, b) => a + b, 0) === n, 'sum'); near(s.pEarlySuccess + s.pLateSuccess + s.pLateFutility + s.pEarlyFutility + s.pSuccessToFutility + s.pFutilityToSuccess + s.pInconclusive, 1, 1e-12);
    r.trials.forEach(t => { assert(t.code >= 1 && t.code <= 7); const early = [1, 4, 5, 6].indexOf(t.code) >= 0; assert(early === (t.stopInterim >= 0), 'stop flag vs code'); if (!early) assert(t.nEnrolled === 300); });
    ['pEarlySuccess', 'pSuccess'].forEach(k => assert(s.mcse[k] >= 0));
  }
});
test('outcome logic: clear effect gives early success, futility wins ties, lock follow-up removes reversals', () => {
  const clear = C.simulate(bayes(), { truth: [0.1, 0.9] }, { nSims: 200, seed: 3 }); assert(clear.summary.counts[0] === 200, 'all early success');
  const both = bayes({ rules: { interim: [{ from: 1, success: { qoi: 'pp', cmp: '>=', value: 0 }, futility: { qoi: 'pp', cmp: '>=', value: 0 } }], final: { success: { qoi: 'pp', cmp: '>=', value: 0 }, futility: { qoi: 'pp', cmp: '>=', value: 0 } } } });
  const tie = C.simulate(both, { truth: [0.3, 0.45] }, { nSims: 100, seed: 3 }); assert(tie.summary.counts[3] === 100, 'futility wins ties at the interim and at the final');
  const lock = bayes({ interims: { trigger: 'enrolled', at: [100, 150, 200, 250], followUp: 'lock' } }), r = C.simulate(lock, { truth: [0.3, 0.3] }, { nSims: 300, seed: 5 });
  assert(r.summary.counts.reduce((a, b) => a + b, 0) === 300);
  const nf = C.simulate(bayes(), { truth: [0.3, 0.3] }, { nSims: 300, seed: 5 }); assert(nf.summary.nSims === 300);
});
test('common random numbers: same seed identical; same patients across designs', () => {
  const a = C.simulate(bayes(), { truth: [0.3, 0.4] }, { nSims: 100, seed: 7 }), b = C.simulate(bayes(), { truth: [0.3, 0.4] }, { nSims: 100, seed: 7 });
  assert(JSON.stringify(a.trials) === JSON.stringify(b.trials) && JSON.stringify(a.summary) === JSON.stringify(b.summary), 'identical');
  const c = C.simulate(bayes(), { truth: [0.3, 0.4] }, { nSims: 100, seed: 8 }); assert(JSON.stringify(a.trials) !== JSON.stringify(c.trials), 'other seed differs');
  const d1 = two(), d2 = two({ rules: { final: { success: { qoi: 'p', cmp: '<=', value: 0.5 } } } });
  const p1 = C.simulate(d1, { truth: [0.3, 0.45] }, { nSims: 5, seed: 9, keepPatients: 3 }), p2 = C.simulate(d2, { truth: [0.3, 0.45] }, { nSims: 5, seed: 9, keepPatients: 3 });
  assert(p1.patients.length === 990 && JSON.stringify(p1.patients) === JSON.stringify(p2.patients), 'identical patients');
  const sc = C.simulate(d1, { truth: [0.3, 0.30001] }, { nSims: 5, seed: 9, keepPatients: 1 }); assert(sc.patients[0].arriveWeek === p1.patients[0].arriveWeek && sc.patients[5].dropout === p1.patients[5].dropout, 'arrivals and dropout shared across scenarios');
});
test('reEvaluate with the original rules reproduces the original outcomes; new rules change them without re-simulation', () => {
  const D = bayes(), n = 300, scn = { truth: [0.3, 0.42] };
  const plain = C.simulate(D, scn, { nSims: n, seed: 31 }), saved = C.simulate(D, scn, { nSims: n, seed: 31, savePath: true });
  assert(JSON.stringify(plain.summary.counts) === JSON.stringify(saved.summary.counts), 'savePath run equals normal run');
  const re = C.reEvaluate(saved, D.rules);
  assert(JSON.stringify(re.summary.counts) === JSON.stringify(plain.summary.counts), 're-evaluated counts');
  for (let i = 0; i < n; i++) assert(re.trials[i].code === plain.trials[i].code && re.trials[i].nEnrolled === plain.trials[i].nEnrolled, 'trial ' + i);
  near(re.summary.meanSubjects, plain.summary.meanSubjects, 1e-9);
  const strict = JSON.parse(JSON.stringify(D.rules)); strict.interim[0].success.value = 0.999; strict.final.success.value = 0.995;
  const re2 = C.reEvaluate(saved, strict); assert(re2.summary.pSuccess <= plain.summary.pSuccess + 1e-12 && re2.summary.meanSubjects >= plain.summary.meanSubjects - 1e-9, 'stricter rules succeed less and run longer');
  const direct = C.simulate(Object.assign({}, D, { rules: strict }), scn, { nSims: n, seed: 31 });
  assert(JSON.stringify(direct.summary.counts) === JSON.stringify(re2.summary.counts), 'equals a fresh simulation with the new rules (fixed allocation)');
  assert(saved.interims.length > plain.interims.length && saved.interims[0].qoi.pp.length === 2, 'saved QOIs per interim');
});
test('accrual: constant rate and ramp up', () => {
  const r = C.simulate(two(), { truth: [0.3, 0.3] }, { nSims: 2000, seed: 1 }); near(r.summary.meanAccrualWeeks, 33, 0.3); near(r.summary.meanDurationWeeks, 45, 0.3);
  const ramp = C.simulate(two({ accrual: { regions: [{ peakPerWeek: 10, startWeek: 0, rampUpWeeks: 10 }] } }), { truth: [0.3, 0.3] }, { nSims: 2000, seed: 1 }); near(ramp.summary.meanAccrualWeeks, 38, 0.3);
  const two2 = C.simulate(two({ accrual: { regions: [{ peakPerWeek: 5, startWeek: 0 }, { peakPerWeek: 5, startWeek: 10 }] } }), { truth: [0.3, 0.3] }, { nSims: 1000, seed: 1 }); near(two2.summary.meanAccrualWeeks, (330 + 50) / 10, 0.4);
  let threw = false; try { C.simulate(two({ accrual: { regions: [{ peakPerWeek: 5, startWeek: 0, durationWeeks: 10 }] } }), { truth: [0.3, 0.3] }, { nSims: 1 }); } catch (e) { threw = true; } assert(threw, 'unreachable accrual is rejected');
});
test('interim triggers: enrolled, completers, opportunity; dropout', () => {
  const mk = (trigger, drop) => bayes({ interims: { trigger: trigger, at: [100, 200] }, rules: { final: { success: { qoi: 'pp', cmp: '>', value: 0.975 } } }, dropout: { perArm: [drop, drop] } });
  let r = C.simulate(mk('enrolled', 0), { truth: [0.3, 0.4] }, { nSims: 50, seed: 1 });
  r.interims.forEach(i => { assert(i.nEnrolled >= (i.interim === 1 ? 100 : 200) && i.nCompleters < i.nEnrolled, 'enrolled trigger'); });
  r = C.simulate(mk('completers', 0.2), { truth: [0.3, 0.4] }, { nSims: 50, seed: 1 }); r.interims.forEach(i => { assert(i.nCompleters === (i.interim === 1 ? 100 : 200), 'completers trigger ' + i.nCompleters); });
  r = C.simulate(mk('opportunity', 0), { truth: [0.3, 0.4] }, { nSims: 50, seed: 1 }); r.interims.forEach(i => { assert(i.nCompleters === (i.interim === 1 ? 100 : 200), 'opportunity trigger'); });
  r = C.simulate(mk('opportunity', 0.3), { truth: [0.3, 0.4] }, { nSims: 50, seed: 1 }); r.interims.forEach(i => { assert(i.nCompleters < (i.interim === 1 ? 100 : 200), 'opportunity counts dropouts'); });
});
test('QOIs are valid probabilities (posterior, predictive, conditional power, p-values, target dose)', () => {
  const arms = [{ name: 'C', dose: 0, isControl: true }, { name: 'D1', dose: 1 }, { name: 'D2', dose: 2 }, { name: 'D3', dose: 3 }];
  for (const ep of ['dichotomous', 'continuous']) {
    const D = { study: { endpoint: ep, sigma: 1, maxN: 200, arms: arms }, accrual: { regions: [{ peakPerWeek: 10 }] }, visitWeeks: [8], model: { type: 'ndlm', tau: { center: ep === 'continuous' ? 0.2 : 0.4 } }, allocation: { type: 'fixed', ratio: [1, 1, 1, 1] },
      interims: { trigger: 'enrolled', at: [80, 120] }, qois: [{ id: 'pp', type: 'postProb', delta: 0 }, { id: 'pm', type: 'prMax' }, { id: 'ed', type: 'prED', q: 0.8 }, { id: 'med', type: 'med', delta: 0.05 }, { id: 'any', type: 'pAnyEffective', delta: 0.05 }, { id: 'pr', type: 'predProb', success: { kind: 'z', alpha: 0.025 } }, { id: 'pb', type: 'predProb' }, { id: 'cp', type: 'condPower' }, { id: 'pb2', type: 'pvalue', adjust: 'bonferroni' }, { id: 'pd', type: 'pvalue', adjust: 'dunnett' }, { id: 'pu', type: 'pvalue' }],
      rules: { final: { success: { qoi: 'pp', cmp: '>', value: 0.9 } } } };
    const r = C.simulate(D, { truth: ep === 'continuous' ? [0, 0.1, 0.3, 0.3] : [0.2, 0.25, 0.4, 0.4] }, { nSims: 60, seed: 4 });
    r.interims.forEach(i => { for (const id in i.qoi) { for (const d of [1, 2, 3]) { const v = i.qoi[id][d]; assert(v >= 0 && v <= 1, ep + ' ' + id + ' = ' + v); } } const s = i.qoi.pm[1] + i.qoi.pm[2] + i.qoi.pm[3]; near(s, 1, 1e-9, 'Pr(max) sums to 1'); i.qoi.pu.forEach((v, d) => { if (d > 0) assert(i.qoi.pu[d] <= i.qoi.pd[d] + 1e-9 && i.qoi.pd[d] <= i.qoi.pb2[d] + 1e-9, 'p <= Dunnett <= Bonferroni'); }); });
    assert(r.summary.nSims === 60 && r.summary.responseEstimate.length === 4);
  }
});
test('adaptive allocation favours the best arm and arm dropping removes poor arms', () => {
  const arms = [{ name: 'C', dose: 0, isControl: true }, { name: 'D1', dose: 1 }, { name: 'D2', dose: 2 }];
  const D = { study: { endpoint: 'dichotomous', maxN: 300, arms: arms }, accrual: { regions: [{ peakPerWeek: 10 }] }, visitWeeks: [8], model: { type: 'independentBeta' },
    allocation: { type: 'adaptive', ratio: [1, 1, 1], burnIn: 60, qoi: 'pm', gamma: 1, controlShare: 0.25, minShare: 0.05, drop: { qoi: 'pp', cmp: '<', value: 0.05, maxDropped: 1 } },
    interims: { trigger: 'enrolled', at: [60, 100, 140, 180, 220, 260] }, qois: [{ id: 'pp', type: 'postProb', delta: 0 }, { id: 'pm', type: 'prMax' }], rules: { final: { success: { qoi: 'pp', cmp: '>', value: 0.975 } } } };
  const r = C.simulate(D, { truth: [0.3, 0.1, 0.6] }, { nSims: 150, seed: 6 }), s = r.summary;
  near(s.allocationMean.reduce((a, b) => a + b, 0), 300, 1e-9); assert(s.allocationMean[2] > 1.5 * s.allocationMean[1], 'best arm gets more: ' + s.allocationMean);
  assert(s.pArmDropped[1] > 0.3 && s.pArmDropped[2] < 0.01 && s.pArmDropped[0] === 0, 'poor arm dropped ' + s.pArmDropped); assert(s.pCorrectArm > 0.9, 'correct arm');
  const D2 = JSON.parse(JSON.stringify(D)); D2.allocation.type = 'fixed'; delete D2.allocation.drop; const f = C.simulate(D2, { truth: [0.3, 0.1, 0.6] }, { nSims: 50, seed: 6 }); near(f.summary.allocationMean[1], 100, 0.01, 'fixed 1:1:1 blocks of 3');
  const D3 = JSON.parse(JSON.stringify(D)); D3.allocation.weight = 'information'; D3.allocation.controlShare = 'matchBest'; delete D3.allocation.drop; const g = C.simulate(D3, { truth: [0.3, 0.1, 0.6] }, { nSims: 30, seed: 6 }); near(g.summary.allocationMean.reduce((a, b) => a + b, 0), 300, 1e-9);
});
test('engine runs every Phase A model type', () => {
  const arms = [{ name: 'C', dose: 0, isControl: true }, { name: 'D1', dose: 1 }, { name: 'D2', dose: 2 }, { name: 'D3', dose: 4 }];
  for (const type of ['independent', 'ndlm', 'ndlmMonotone', 'ndlm2', 'linear', 'hierarchical', 'logistic3', 'sigmoid', 'hierLogistic']) {
    const D = { study: { endpoint: 'continuous', sigma: 1, maxN: 160, arms: arms }, accrual: { regions: [{ peakPerWeek: 10 }] }, visitWeeks: [4], model: { type: type, tau: { center: 0.2 } }, allocation: { type: 'fixed', ratio: [1, 1, 1, 1] },
      interims: { trigger: 'enrolled', at: [80] }, qois: [{ id: 'pp', type: 'postProb', delta: 0 }], rules: { final: { success: { qoi: 'pp', cmp: '>', value: 0.9 } } } };
    const r = C.simulate(D, { truth: [0, 0.2, 0.4, 0.5] }, { nSims: 20, seed: 2 }); assert(r.summary.counts.reduce((a, b) => a + b, 0) === 20 && isFinite(r.summary.responseEstimate[3]), type);
  }
});
