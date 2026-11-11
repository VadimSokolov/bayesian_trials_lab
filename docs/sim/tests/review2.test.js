/* Copyright 2026 Nytel. MIT License. Regression tests for the second Codex review (R2 MAJOR 12 to 20, MINOR 5 and 6): studio rule mapping, predictive probability, tied optimum, report narratives and grid, logit mode, monotone summaries, backfill, CRM final stop, i3+3. */
'use strict';
const { test, assert, near } = require('./harness.js');
const M = require('../core-math.js'), C = require('../core-engine.js'), Mod = require('../models.js'), X = require('../escalation.js'), R = require('../report.js');
require('../studio.js');
const St = NSim.studio;

/* ---------- 12: any arm and every arm do not depend on the quantity ---------- */
test('R2-12: "any arm" is the smallest p-value and the largest probability; "every arm" the reverse', () => {
  assert(St.engineAgg({ agg: 'any', cmp: '<=' }) === 'min' && St.engineAgg({ agg: 'every', cmp: '<=' }) === 'max', 'p-value rule');
  assert(St.engineAgg({ agg: 'any', cmp: '>' }) === 'max' && St.engineAgg({ agg: 'every', cmp: '>' }) === 'min', 'probability rule');
  assert(St.engineAgg({ agg: 'best', cmp: '>' }) === 'best' && St.engineAgg({ agg: 'max', cmp: '>' }) === 'max', 'best arm, old saved value');
  // rates [.3, .3, .9]: the p-value of the third arm is tiny, so "any arm" wins nearly always and "every arm" almost never
  const S = St.blank(); S.study.arms = [{ name: 'C', dose: 0, isControl: true }, { name: 'A', dose: 1 }, { name: 'B', dose: 2 }, { name: 'D', dose: 3 }]; S.dropout = [0, 0, 0, 0]; S.allocation.ratio = [1, 1, 1, 1];
  S.scenarios = [{ name: 's', truth: [0.3, 0.3, 0.3, 0.9], sd: 1 }]; S.study.maxN = 200; S.model = { type: 'independent' };
  const win = (agg) => { S.rules.fs = { on: true, op: 'and', conds: [{ type: 'pvalue', delta: 0, vs: 'control', alpha: 0.025, adjust: 'none', q: 0.9, cmp: '<=', value: 0.025, agg: agg }] }; const b = St.buildDesign(S); return C.simulate(b.design, b.scenarios[0], { nSims: 200, seed: 3 }).summary.pSuccess; };
  assert(win('any') > 0.95, 'any arm ' + win('any')); assert(win('every') < 0.05, 'every arm ' + win('every'));
});

/* ---------- 13: predictive probability predicts the configured final rule ---------- */
test('R2-13: predictive probability follows the final cutoff, margin and prior, and unsupported rules are rejected', () => {
  const mk = (cut) => { const S = St.blank(); S.interims.at = [100]; S.rules.if = { on: true, op: 'and', conds: [{ type: 'predProb', delta: 0, vs: 'control', alpha: 0.025, adjust: 'none', q: 0.9, cmp: '<', value: 0.05, agg: 'any' }] }; S.rules.fs = { on: true, op: 'and', conds: [{ type: 'postProb', delta: 0, vs: 'control', alpha: 0.025, adjust: 'none', q: 0.9, cmp: '>', value: cut, agg: 'any' }] }; return S; };
  const pred = (cut) => { const b = St.buildDesign(mk(cut)); const q = b.design.qois.find(x => x.type === 'predProb'); assert(q.success.kind === 'bayes' && q.success.threshold === cut, 'success spec carries the cutoff'); return C.simulate(b.design, b.scenarios[1], { nSims: 150, seed: 5 }).interims.reduce((a, i) => a + i.qoi[Object.keys(i.qoi).find(k => k !== 'alloc')][1], 0); };
  assert(pred(0.5) > pred(0.999) + 1, 'a lower final cutoff gives a higher predictive probability');
  const S = mk(0.975); S.model = { type: 'independent' };
  let msg = ''; try { St.buildDesign(S); } catch (e) { msg = e.message; } assert(/independent beta-binomial/.test(msg), 'model rejected: ' + msg);
  const S2 = mk(0.975); S2.rules.fs.conds.push(JSON.parse(JSON.stringify(S2.rules.fs.conds[0])));
  msg = ''; try { St.buildDesign(S2); } catch (e) { msg = e.message; } assert(/exactly one condition/.test(msg), 'two final conditions rejected: ' + msg);
  const S3 = mk(0.975); S3.rules.fs.on = false;
  msg = ''; try { St.buildDesign(S3); } catch (e) { msg = e.message; } assert(/final success rule/.test(msg), 'no final rule rejected: ' + msg);
});

/* ---------- 14: tied optimal arms ---------- */
test('R2-14: P(correct arm) counts any optimal arm when the best arm is tied', () => {
  const D = { study: { endpoint: 'dichotomous', maxN: 400, arms: [{ name: 'C', dose: 0, isControl: true }, { name: 'a', dose: 1 }, { name: 'b', dose: 2 }, { name: 'c', dose: 3 }, { name: 'd', dose: 4 }] }, accrual: { regions: [{ peakPerWeek: 10 }] }, visitWeeks: [4], model: { type: 'independentBeta' },
    allocation: { type: 'fixed', ratio: [1, 1, 1, 1, 1] }, qois: [{ id: 'pp', type: 'postProb', delta: 0 }], rules: { final: { success: { qoi: 'pp', cmp: '>', value: 0.9 } } } };
  const r = C.simulate(D, { truth: [0.1, 0.1, 0.1, 0.6, 0.6] }, { nSims: 100, seed: 2 });
  const sel = r.trials.filter(t => t.selected === 3 || t.selected === 4).length / 100;
  near(r.summary.pCorrectArm, sel, 1e-12, 'matches the share that picked a tied best arm'); assert(r.summary.pCorrectArm > 0.9, 'tied best arms both count: ' + r.summary.pCorrectArm);
  assert(C.simulate(D, { truth: [0.1, 0.3, 0.3, 0.3, 0.3] }, { nSims: 20, seed: 2 }).summary.pCorrectArm === null, 'all arms tied: undefined');
});

/* ---------- 15: narratives use the saved selected arm and decisions, only to the stop ---------- */
test('R2-15: report narratives use the saved best arm and decision and end at the stopping analysis', () => {
  const design = { study: { endpoint: 'dichotomous', maxN: 240, arms: [{ name: 'Control', dose: 0, isControl: true }, { name: 'Low', dose: 1 }, { name: 'High', dose: 2 }] }, accrual: { regions: [{ peakPerWeek: 10 }] }, visitWeeks: [4], model: { type: 'independentBeta' },
    allocation: { type: 'fixed', ratio: [1, 1, 1] }, interims: { trigger: 'enrolled', at: [60, 120, 180] }, qois: [{ id: 'pp', type: 'postProb', delta: 0 }],
    rules: { interim: [{ from: 1, success: { qoi: 'pp', cmp: '>', value: 0.95, agg: 'best' } }], final: { success: { qoi: 'pp', cmp: '>', value: 0.975, agg: 'best' } } } };
  const sc = { name: 'Alt', truth: [0.2, 0.2, 0.7] }, res = C.simulate(design, sc, { nSims: 60, seed: 4, savePath: true });
  const early = res.trials.find(t => t.code === 1);
  assert(early, 'an early success exists');
  const ints = res.interims.filter(i => i.sim === early.sim);
  assert(ints.length === 3 && early.stopInterim < 2, 'savePath keeps the analyses after the stop (the case that was mis-narrated)');
  assert(ints.every(i => i.best === 1 || i.best === 2) && ints[early.stopInterim].decision === 1, 'saved best arm and decision');
  const html = R.build({ design, scenarios: [sc], results: [res], meta: { title: 't', seed: 4, nSims: 60 } });
  const text = html.replace(/<[^>]+>/g, ' ').replace(/&quot;/g, '"').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');
  const mine = new RegExp('Trial ' + (early.sim + 1) + ' in scenario "Alt" ended as early success[^]*?(?=Trial \\d+ in scenario|$)').exec(text);
  assert(mine, 'narrative for the early success is in the report');
  const n = (mine[0].match(/Interim \d+ \(week/g) || []).length;
  assert(n === early.stopInterim + 1, 'narrated ' + n + ' interims, stop at interim ' + (early.stopInterim + 1));
  assert(/stops for success/.test(mine[0]), 'the stop is narrated as a stop');
});

/* ---------- 16: logit mode ---------- */
test('R2-16: independent-logit mode converges (prior mean 5, SD 0.5, 0 of 100 gives -1.125)', () => {
  const c = Mod.prepare({ study: { endpoint: 'dichotomous', arms: [{ name: 'C', dose: 0, isControl: true }, { name: 'D', dose: 1 }] }, model: { type: 'independent', prior: { mean: 5, sd: 0.5 } } });
  const f = Mod.fit(c, { n: [100, 100], s: [0, 100], ss: [0, 0] }, M.makeRng(1), { nDraws: 0 });
  near(f.thetaMean[0], -1.12538, 1e-4, 'mode with 0/100');
  // the score vanishes at the reported mode, also for an extreme prior far from the data
  const sc = (t, n, s, m0, sd) => s - n / (1 + Math.exp(-t)) - (t - m0) / (sd * sd);
  near(sc(f.thetaMean[0], 100, 0, 5, 0.5), 0, 1e-7, 'score at the mode'); near(sc(f.thetaMean[1], 100, 100, 5, 0.5), 0, 1e-7, 'score at the mode, 100/100');
});

/* ---------- 17: monotone summaries do not depend on nDraws ---------- */
test('R2-17: ndlmMonotone constrained summaries are the same for any number of draws', () => {
  const c = Mod.prepare({ study: { endpoint: 'continuous', sigma: 1, arms: [{ name: 'C', dose: 0, isControl: true }, { name: 'D1', dose: 1 }, { name: 'D2', dose: 2 }, { name: 'D3', dose: 3 }] }, model: { type: 'ndlmMonotone', tau: { center: 0.2 } } });
  const data = { n: [200, 200, 200, 200], s: [0, 600, 400, 200], ss: [200, 1400, 1000, 600] };
  const a = Mod.fit(c, data, M.makeRng(1), { nDraws: 0 }), b = Mod.fit(c, data, M.makeRng(9), { nDraws: 700 });
  for (let d = 1; d <= 3; d++) { near(a.mean[d], b.mean[d], 1e-12, 'mean ' + d); near(a.sd[d], b.sd[d], 1e-12, 'sd ' + d); }
  assert(a.mean[1] <= a.mean[2] + 1e-9 && a.mean[2] <= a.mean[3] + 1e-9, 'increasing with nDraws 0: ' + a.mean.join(', '));
  near(a.mean[1], 2, 0.1, 'descending data pooled to about 2');
});

/* ---------- 18: backfill toxicity ---------- */
test('R2-18: backfill DLTs trigger the safety elimination and change the next dose', () => {
  // dose 1 is clean in the first cohort (0/3), then the backfill cohort at dose 1 has 3/3 DLTs: 3/6 at target 0.2 meets the elimination rule, so nothing may be treated above dose 1 afterwards
  const design = { method: 'BOIN', target: 0.2, cohortSize: 3, maxCohorts: 8, startDose: 1, backfill: { size: 3, maxPerDose: 12 } }, sc = { truth: [0.5, 0.2, 0.3, 0.4] };
  let found = 0;
  for (let i = 0; i < 3000 && found < 6; i++) {
    const t = X.runTrial(design, sc, { seed: 11, index: i }), cs = t.cohorts;
    const k = cs.findIndex(c => c.type === 'backfill' && c.dose === 1 && c.cumN === 6 && c.cumDlt === 3);
    if (k < 0 || cs[0].dlt !== 0 || cs[0].dose !== 1) continue;
    found++;
    assert(cs.slice(k + 1).every(c => c.dose <= 1), 'trial ' + i + ': cohort above the eliminated dose after backfill');
    assert(t.stopped && t.sel === -1, 'trial ' + i + ': stops with no dose selected');
  }
  assert(found >= 3, 'the situation occurs in the simulated trials: ' + found);
});

/* ---------- 19: CRM final selection obeys the toxicity stop ---------- */
test('R2-19: CRM with one cohort and 3 of 3 DLTs at dose 1 does not select dose 1 under a 0.9 stop', () => {
  const d = { method: 'CRM', target: 0.2, skeleton: [0.1, 0.2, 0.3], cohortSize: 3, maxCohorts: 1, stopTooToxic: 0.9 }, sc = { truth: [1, 1, 1] };
  const r = X.simulate(d, sc, { nSims: 50, seed: 1 });
  assert(r.pSelect[0] === 0 && r.pNone === 1, 'no dose selected: ' + r.pSelect.join(',') + ' none ' + r.pNone);
  const r2 = X.simulate(Object.assign({}, d, { maxCohorts: 2 }), sc, { nSims: 50, seed: 1 });
  assert(r2.pNone === 1, 'two cohorts: same result');
  const r3 = X.simulate(Object.assign({}, d, { stopTooToxic: undefined }), { truth: [0.05, 0.05, 0.05] }, { nSims: 50, seed: 1 });
  assert(r3.pNone === 0, 'a safe design still selects a dose');
});

/* ---------- 20: i3+3 as published ---------- */
test('R2-20: i3+3 allocation and final selection follow Liu, Yin and Yuan 2020 (sections 2.1 to 2.3)', () => {
  const t = (tg, n, e) => X.decisionTable({ method: 'i3+3', target: tg, epsilon: e == null ? 0.05 : e }, n);
  assert(t(0.2, 3, 0.02)[2][0] === 'E', '0/3 at target 0.2, EI [.18,.22]: escalate');
  assert(t(0.3, 4)[3][2] === 'D', '2/4 at target 0.3: de-escalate ((2-1)/4 = 0.25 is inside the EI)');
  assert(t(0.17, 3)[2][1] === 'S', 'paper case 2: 1/3 at target 0.17 stays');
  assert(t(0.3, 6)[5][3] === 'D', 'paper case 1: 3/6 at target 0.3 de-escalates');
  // final selection: only tried doses with isotonic estimate <= target + epsilon2 are candidates
  const dsg = { method: 'i3+3', target: 0.2, cohortSize: 3, maxCohorts: 1, startDose: 3 };
  const hot = X.simulate(dsg, { truth: [0.9, 0.9, 0.9, 0.9] }, { nSims: 30, seed: 2 });
  assert(hot.pSelect[2] === 0, 'a dose with observed rate far above target + epsilon2 is not selected: ' + hot.pSelect.join(','));
  const ok = X.simulate(Object.assign({}, dsg, { startDose: 1 }), { truth: [0, 0, 0, 0] }, { nSims: 30, seed: 2 });
  assert(ok.pSelect[0] === 1, 'a clean tried dose is selected');
});

/* ---------- MINOR 5: null grid rows keep nuisance values and the upper limit ---------- */
test('R2-minor-5: null grid rows keep nuisance values and upper limits; zero wins in ten trials is not "within target"', () => {
  const grid = { target: 0.025, rows: [{ control: 0.3, accrualMult: 1, dropout: 0.1, typeI: 0, mcse: 0, nSims: 10, ci95: [0, 0.2775], upper95: 0.2775 }, { control: 0.4, accrualMult: 1, dropout: 0.1, typeI: 0.02, mcse: 0.001, nSims: 20000, upper95: 0.022 }] };
  const design = { study: { endpoint: 'dichotomous', maxN: 100, arms: [{ name: 'C', dose: 0, isControl: true }, { name: 'T', dose: 1 }] }, accrual: { regions: [{ peakPerWeek: 10 }] }, visitWeeks: [4], allocation: { type: 'fixed', ratio: [1, 1] }, qois: [{ id: 'p', type: 'pvalue' }], rules: { final: { success: { qoi: 'p', cmp: '<=', value: 0.025 } } } };
  const sc = { name: 'Null', truth: [0.3, 0.3] }, res = C.simulate(design, sc, { nSims: 30, seed: 1 });
  const text = R.build({ design, scenarios: [sc], results: [res], nullGrid: grid, meta: { title: 't', seed: 1, nSims: 30 } }).replace(/<[^>]+>/g, ' ');
  assert(/control 0\.3, accrual x 1, dropout 0\.1/.test(text), 'nuisance values in the row label');
  assert(/0\.2775/.test(text) && /Upper 95% limit/.test(text), 'upper limit shown');
  assert(/estimate below target, upper limit above target/.test(text), 'zero wins in ten is not shown as controlled');
  assert(/within target/.test(text), 'a row whose upper limit is below the target is within target');
});

/* ---------- MINOR 6: pinned comparisons match scenarios by their parameters ---------- */
test('R2-minor-6: a kept run is matched to scenarios by true values, not by position', () => {
  const k = (t) => St.scnKey({ name: 'x', truth: t, sd: 1 });
  const kept = [k([0.3, 0.3]), k([0.3, 0.45]), k([0.3, 0.6])], now = [k([0.3, 0.6]), k([0.3, 0.45]), k([0.3, 0.9])];
  const m = St.pinMatch(kept, now);
  assert(m[0] === 2 && m[1] === 1 && m[2] === -1, 'matched ' + m.join(','));
  assert(St.scnKey({ name: 'a', truth: [0.3, 0.3], sd: 1 }) === St.scnKey({ name: 'renamed', truth: [0.3, 0.3], sd: 1 }), 'names do not matter');
});
