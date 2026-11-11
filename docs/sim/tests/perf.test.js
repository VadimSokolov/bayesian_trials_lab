/* Copyright 2026 Nytel. MIT License. Timing of 1,000 trials for two typical designs (targets: (a) under 5 s, (b) under 60 s). */
'use strict';
const { test, assert } = require('./harness.js');
const C = require('../core-engine.js');
test('performance (a): two-arm dichotomous, 4 interims, independent model, 1,000 trials', () => {
  const D = { study: { endpoint: 'dichotomous', maxN: 300, arms: [{ name: 'C', dose: 0, isControl: true }, { name: 'T', dose: 1 }] }, accrual: { regions: [{ peakPerWeek: 8 }] }, visitWeeks: [12], model: { type: 'independentBeta' }, allocation: { type: 'fixed', ratio: [1, 1] },
    interims: { trigger: 'enrolled', at: [100, 150, 200, 250] }, qois: [{ id: 'pp', type: 'postProb', delta: 0 }, { id: 'pred', type: 'predProb' }],
    rules: { interim: [{ from: 1, success: { qoi: 'pp', cmp: '>', value: 0.99 }, futility: { qoi: 'pred', cmp: '<', value: 0.05 } }], final: { success: { qoi: 'pp', cmp: '>', value: 0.975 } } } };
  const t0 = Date.now(); C.simulate(D, { truth: [0.3, 0.45] }, { nSims: 1000, seed: 4 }); const ms = Date.now() - t0;
  console.log('      (a) ' + ms + ' ms'); assert(ms < 5000, 'too slow: ' + ms);
});
test('performance (b): 5 doses + control, NDLM, adaptive allocation, 6 interims, 1,000 trials', () => {
  const arms = [{ name: 'C', dose: 0, isControl: true }].concat([1, 2, 3, 4, 5].map(i => ({ name: 'D' + i, dose: i * 10 })));
  const D = { study: { endpoint: 'continuous', sigma: 1, maxN: 400, arms: arms }, accrual: { regions: [{ peakPerWeek: 8, rampUpWeeks: 10 }] }, visitWeeks: [12], model: { type: 'ndlm', tau: { center: 0.3 } },
    allocation: { type: 'adaptive', ratio: [2, 1, 1, 1, 1, 1], burnIn: 100, qoi: 'pm', gamma: 1, controlShare: 'matchBest', minShare: 0.05, drop: { qoi: 'pp', cmp: '<', value: 0.02, maxDropped: 3 } },
    interims: { trigger: 'enrolled', at: [100, 150, 200, 250, 300, 350] }, qois: [{ id: 'pp', type: 'postProb', delta: 0 }, { id: 'pm', type: 'prMax' }],
    rules: { interim: [{ from: 1, success: { qoi: 'pp', cmp: '>', value: 0.995 }, futility: { qoi: 'pm', cmp: '<', value: 0.0001 } }], final: { success: { qoi: 'pp', cmp: '>', value: 0.975 } } } };
  const t0 = Date.now(); C.simulate(D, { truth: [0, 0.1, 0.2, 0.4, 0.5, 0.5] }, { nSims: 1000, seed: 5 }); const ms = Date.now() - t0;
  console.log('      (b) ' + ms + ' ms'); assert(ms < 60000, 'too slow: ' + ms);
});
