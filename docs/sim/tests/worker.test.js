/* Copyright 2026 Nytel. MIT License. Tests for the worker logic (chunking, progress, cancel, reEvaluate) run in Node. */
'use strict';
const { test, assert } = require('./harness.js');
const C = require('../core-engine.js'), W = require('../worker.js');
const D = { study: { endpoint: 'dichotomous', maxN: 200, arms: [{ name: 'C', dose: 0, isControl: true }, { name: 'T', dose: 1 }] }, accrual: { regions: [{ peakPerWeek: 10 }] }, visitWeeks: [8], model: { type: 'independentBeta' }, allocation: { type: 'fixed', ratio: [1, 1] },
  interims: { trigger: 'enrolled', at: [80, 140] }, qois: [{ id: 'pp', type: 'postProb' }], rules: { interim: [{ from: 1, success: { qoi: 'pp', cmp: '>', value: 0.99 } }], final: { success: { qoi: 'pp', cmp: '>', value: 0.975 } } } };
test('worker: chunked run equals one-shot run, reports progress, cancel, reEvaluate', async () => {
  const msgs = [], S = [{ name: 'a', truth: [0.3, 0.3] }, { name: 'b', truth: [0.3, 0.5] }];
  await W.runJob({ design: D, scenarios: S, opts: { nSims: 120, seed: 5, chunk: 50, savePath: true } }, m => msgs.push(m), () => false);
  const prog = msgs.filter(m => m.type === 'progress'), res = msgs.filter(m => m.type === 'result');
  assert(prog.length === 6 && prog[2].done === 120 && prog[5].overall === 1, 'progress'); assert(msgs[msgs.length - 1].type === 'done' && res.length === 2);
  const one = C.simulate(D, S[1], { nSims: 120, seed: 5 }); assert(JSON.stringify(one.summary) === JSON.stringify(res[1].summary), 'chunked equals one-shot');
  const out = []; await W.runJob({ type: 'reEvaluate', scenario: 1, rules: D.rules }, m => out.push(m)); assert(out[0].type === 'reEvaluated' && JSON.stringify(out[0].summary.counts) === JSON.stringify(res[1].summary.counts));
  const c = []; let n = 0; await W.runJob({ design: D, scenarios: [S[0]], opts: { nSims: 500, chunk: 50 } }, m => c.push(m), () => ++n > 2); assert(c[c.length - 1].type === 'cancelled' && c[c.length - 1].done === 100);
  const e = []; await W.runJob({ design: { study: {} }, scenarios: [S[0]] }, m => e.push(m)); assert(e[0].type === 'error');
});
