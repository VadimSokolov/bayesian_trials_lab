/* Copyright 2026 Nytel. MIT License. Tests for NSim.calibrate (threshold calibration and the Type I error grid). */
'use strict';
const { test, assert, near } = require('./harness.js');
const C = require('../core-engine.js'), K = require('../calibrate.js');

// Two-arm Bayesian design with 4 looks (3 interims by completers plus the final), one common success threshold, as in module 14.
const bayes4 = () => ({
  study: { endpoint: 'dichotomous', maxN: 300, arms: [{ name: 'C', dose: 0, isControl: true }, { name: 'T', dose: 1 }] },
  accrual: { regions: [{ peakPerWeek: 8 }] }, visitWeeks: [12], model: { type: 'independentBeta' }, allocation: { type: 'fixed', ratio: [1, 1] },
  interims: { trigger: 'completers', at: [75, 150, 225], followUp: 'lock' }, qois: [{ id: 'pp', type: 'postProb', delta: 0 }], simulation: { nDraws: 800 },
  rules: { interim: [{ from: 1, success: { qoi: 'pp', cmp: '>', value: 0.975 } }], final: { success: { qoi: 'pp', cmp: '>', value: 0.975 } } }
});
const fixedP = (extra) => Object.assign({
  study: { endpoint: 'dichotomous', maxN: 200, arms: [{ name: 'C', dose: 0, isControl: true }, { name: 'T', dose: 1 }] },
  accrual: { regions: [{ peakPerWeek: 10 }] }, visitWeeks: [12], allocation: { type: 'fixed', ratio: [1, 1] },
  qois: [{ id: 'p', type: 'pvalue' }], rules: { final: { success: { qoi: 'p', cmp: '<=', value: 0.025 } } }
}, extra || {});
const NULL = { truth: [0.3, 0.3] }, ALT = { name: '30% vs 45%', truth: [0.3, 0.45] };
let shared = null;
const bigCal = () => shared || (shared = K.calibrate(bayes4(), NULL, { target: 0.025, rule: 'shift', nSims: 20000, seed: 5, alternatives: [ALT], powerSims: 2000 }));

test('Monte Carlo guidance: 0.025 with SE 0.001 needs 24,375 simulations; SE and half width are consistent', () => {
  assert(K.mcSims(0.025, 0.001) === 24375, 'sims ' + K.mcSims(0.025, 0.001));
  near(K.mcSE(0.025, 24375), 0.001, 1e-6); near(K.mcGuidance(0.025, 100000).halfWidth95, 0.00097, 2e-5, 'AD2019 +/- 0.1%');
  const g = K.mcGuidance(0.025, 20000); assert(g.nForSE.some(r => r.se === 0.001 && r.nSims === 24375) && /24375/.test(g.note));
});
test('calibrate, 4-look two-arm Bayesian design, 20,000 null trials: Type I error reaches 0.025 within MC error and the threshold rises above 0.975 (module 14: about 0.992)', () => {
  const r = bigCal();
  assert(r.feasible && r.threshold.final > 0.975 && r.threshold.early[0] === r.threshold.final, 'common threshold ' + r.threshold.final);
  near(r.threshold.final, 0.992, 0.004, 'module 14 value'); assert(r.threshold.final <= 0.9999);
  assert(r.calibration.rate <= 0.025 + 1e-12 && r.calibration.rate >= 0.025 - 4 * r.calibration.mcse, 'achieved ' + r.calibration.rate);
  near(r.confirmation.rate, 0.025, 4 * r.confirmation.mcse + r.drawResolution, 'fresh simulation'); assert(r.confirmation.seed !== r.calibration.seed && !r.confirmation.exceedsTarget);
  assert(r.calibration.ci95[0] < r.calibration.rate && r.calibration.ci95[1] > r.calibration.rate && r.calibration.mcse > 0);
  assert(r.power.length === 1 && r.power[0].power > 0.5 && r.power[0].power < 0.9 && r.power[0].mcse > 0, 'power ' + r.power[0].power);
  assert(/24375/.test(r.guidance.note) && r.iterations > 5 && r.iterations < 60);
  console.log('      threshold ' + r.threshold.final + ', type I ' + r.calibration.rate + ' (confirm ' + r.confirmation.rate + '), power ' + r.power[0].power.toFixed(3) + ', ' + r.iterations + ' evaluations');
});
test('performance: calibration (20,000 null simulations with saved paths plus the bisection) takes under 30 s', () => {
  const r = bigCal(); console.log('      simulate ' + r.timings.simulate.toFixed(1) + ' s, bisect ' + r.timings.bisect.toFixed(1) + ' s, confirm ' + r.timings.confirm.toFixed(1) + ' s, total ' + r.seconds.toFixed(1) + ' s');
  assert(r.timings.calibration < 30, 'calibration took ' + r.timings.calibration + ' s');
});
test('calibrate: stricter target gives a higher threshold; rule final is infeasible when early looks alone exceed the target; recalibrated design reproduces the rate', () => {
  const d = bayes4(); d.simulation.nDraws = 300; d.rules.interim[0].success.value = 0.995;
  const o = { rule: 'shift', nSims: 1500, seed: 3, confirmSims: 500, digits: 3 };
  const a = K.calibrate(d, NULL, Object.assign({ target: 0.05 }, o)), b = K.calibrate(d, NULL, Object.assign({ target: 0.01 }, o));
  assert(a.threshold.final < b.threshold.final, 'monotone in target: ' + a.threshold.final + ' < ' + b.threshold.final);
  assert(a.calibration.rate <= 0.05 && b.calibration.rate <= 0.01);
  const f = K.calibrate(d, NULL, { rule: 'final', target: 0.01, nSims: 1500, seed: 3, confirmSims: 300 });
  assert(f.threshold.early[0] === undefined && f.threshold.final <= 1);
  const same = C.simulate(a.design, NULL, { nSims: 1500, seed: 3, keepInterims: false }); near(same.summary.pSuccess, a.calibration.rate, 1e-12, 'same seed, calibrated design');
  const low = K.calibrate(d, NULL, { rule: 'final', target: 0.0001, nSims: 800, seed: 3, confirmSims: 100 }); assert(!low.feasible || low.calibration.rate <= 0.0001);
});
test('calibrate handles a p-value rule (smaller is stricter) and a z-statistic group sequential design', () => {
  const r = K.calibrate(fixedP(), NULL, { rule: 'final', target: 0.01, nSims: 20000, seed: 2, confirmSims: 20000 });
  assert(r.feasible && r.threshold.final < 0.025 && r.threshold.final > 0.003, 'p threshold ' + r.threshold.final); near(r.threshold.final, 0.01, 0.004, 'p threshold near the target');
  near(r.calibration.rate, 0.01, 4 * r.calibration.mcse + 0.001); near(r.confirmation.rate, 0.01, 4 * r.confirmation.mcse + 0.001);
  const gs = C.gsDesign(fixedP(), { K: 4, spending: 'obf' }), g = K.calibrate(gs, NULL, { rule: 'shift', target: 0.025, nSims: 10000, seed: 4, confirmSims: 10000, range: [0, 8] });
  near(g.threshold.final, 2.02, 0.12, 'last bound near the classical OBF 2.024 (shift moves every bound, so bounds are offset)'); near(g.confirmation.rate, 0.025, 4 * g.confirmation.mcse + 0.001);
});
test('nullGrid: one row per grid point, rows carry the nuisance values, expected N, MC SE and flags; maximum reported', () => {
  const gs = C.gsDesign(fixedP(), { K: 4, spending: 'obf' }), spec = { control: [0.1, 0.3, 0.5, 0.7], accrualMult: [0.5, 2], dropout: [0, 0.2], drift: [0, 0.1] };
  const g = K.nullGrid(gs, spec, { nSims: 3000, seed: 9, target: 0.025 });
  assert(g.rows.length === 4 * 2 * 2 && g.rows.every(r => r.mcse > 0 && r.upper95 >= r.typeI && r.expectedN <= 200 && r.expectedN > 100), 'rows');
  assert(g.driftSupported === false && g.notes.some(n => /drift/i.test(n)), 'drift note');
  assert(g.max.typeI === Math.max.apply(null, g.rows.map(r => r.typeI)) && g.max.nFlagged === g.rows.filter(r => r.flag).length);
  g.rows.forEach(r => assert(r.flag === (r.upper95 > 0.025), 'flag rule'));
  assert(new Set(g.rows.map(r => r.seed)).size === g.rows.length, 'different seed per point');
  assert(g.rows.every(r => r.typeI < 0.05), 'group sequential z design stays near 0.025 over the grid');
  const one = K.nullGrid(gs, spec, { nSims: 500, seed: 9, mode: 'oneAtATime' }); assert(one.rows.length === 1 + 3 + 1 + 1 + 0, 'oneAtATime rows ' + one.rows.length);
});
test('nullGrid flags correctly: threshold deliberately too low flags every point, a very strict one flags none', () => {
  const spec = { control: [0.2, 0.4, 0.6], dropout: [0, 0.15] };
  const loose = K.nullGrid(fixedP({ rules: { final: { success: { qoi: 'p', cmp: '<=', value: 0.1 } } } }), spec, { nSims: 2000, seed: 1 });
  assert(loose.rows.length === 6 && loose.rows.every(r => r.flag) && loose.max.nFlagged === 6 && loose.max.anyFlag && loose.max.typeI > 0.08, 'loose all flagged');
  const strict = K.nullGrid(fixedP({ rules: { final: { success: { qoi: 'p', cmp: '<=', value: 0.005 } } } }), spec, { nSims: 2000, seed: 1 });
  assert(strict.rows.every(r => !r.flag) && !strict.max.anyFlag && strict.max.typeI < 0.02, 'strict none flagged');
});
test('nullGrid for a continuous endpoint varies control mean and SD; the null holds at every point', () => {
  const d = fixedP({ study: { endpoint: 'continuous', sigma: 1, maxN: 120, arms: [{ name: 'C', dose: 0, isControl: true }, { name: 'T', dose: 1 }] } });
  const g = K.nullGrid(d, { controlMean: [-1, 0, 5], sd: [0.5, 2] }, { nSims: 2000, seed: 3 });
  assert(g.rows.length === 6 && g.rows.every(r => r.sd === 0.5 || r.sd === 2)); near(g.max.typeI, 0.025, 0.02, 'one-sided z test is near nominal at every point');
});
test('reproducibility: same seed gives identical calibration and grid; another seed differs', () => {
  const d = bayes4(); d.simulation.nDraws = 200; const o = { rule: 'shift', nSims: 400, seed: 11, confirmSims: 200, alternatives: [ALT], powerSims: 200 };
  const strip = (r) => { const x = JSON.parse(JSON.stringify(r)); delete x.timings; delete x.seconds; return JSON.stringify(x); };
  assert(strip(K.calibrate(d, NULL, o)) === strip(K.calibrate(d, NULL, o)), 'calibrate');
  assert(strip(K.calibrate(d, NULL, Object.assign({}, o, { seed: 12 }))) !== strip(K.calibrate(d, NULL, o)), 'other seed');
  const gp = (s) => { const g = K.nullGrid(fixedP(), { control: [0.2, 0.5], dropout: [0, 0.1] }, { nSims: 800, seed: s }); delete g.seconds; return JSON.stringify(g); };
  assert(gp(5) === gp(5) && gp(5) !== gp(6), 'grid');
});
