/* Copyright 2026 Nytel. MIT License. Tests for NSim.report (the regulator-ready simulation report). */
'use strict';
const { test, assert } = require('./harness.js');
const C = require('../core-engine.js'), R = require('../report.js');

const design = {
  study: { endpoint: 'dichotomous', maxN: 300, arms: [{ name: 'Control', dose: 0, isControl: true }, { name: 'Low', dose: 1 }, { name: 'High', dose: 2 }] },
  accrual: { regions: [{ peakPerWeek: 10, startWeek: 0 }] }, visitWeeks: [12], dropout: { perArm: [0.05, 0.05, 0.05] },
  model: { type: 'independentBeta' }, borrowing: { method: 'robust', historical: [{ n: 80, r: 24 }], robustWeight: 0.2 },
  allocation: { type: 'fixed', ratio: [1, 1, 1] }, interims: { trigger: 'enrolled', at: [100, 150, 200, 250] },
  qois: [{ id: 'pp', type: 'postProb', delta: 0 }, { id: 'pred', type: 'predProb' }],
  rules: { interim: [{ from: 1, success: { qoi: 'pp', cmp: '>', value: 0.99 }, futility: { qoi: 'pred', cmp: '<', value: 0.1 } }], final: { success: { qoi: 'pp', cmp: '>', value: 0.975 } } }
};
const scenarios = [
  { name: 'Null', truth: [0.3, 0.3, 0.3], justification: 'No benefit in either dose.' },
  { name: 'Low effect', truth: [0.3, 0.35, 0.4], justification: 'Half of the planning effect.' },
  { name: 'Planning effect', truth: [0.3, 0.4, 0.5], justification: 'Effect seen in the phase 2 study.', source: 'Phase 2 report' }
];
const meta = { title: 'Test report', sponsor: 'Nytel', author: 'Test', date: '2026-11-08', engineVersion: C.version, seed: 77, nSims: 150, runTime: 3.2, objectives: ['Estimate power and Type I error.'], justifications: ['No benefit.', 'Half effect.', 'Phase 2 effect.'] };

let cache = null;
function build() {
  if (cache) return cache;
  const results = scenarios.map(s => C.simulate(design, s, { nSims: meta.nSims, seed: meta.seed }));
  const benchmark = scenarios.map(s => C.simulateBenchmark(design, s, { nSims: meta.nSims, seed: meta.seed, benchmark: { K: 3, spending: 'ldobf' } }));
  cache = { design, scenarios, results, benchmark, meta, calibration: { target: 0.025, achieved: 0.024, mcse: 0.004, parameter: 'final threshold', value: 0.975, nSims: 150 },
    nullGrid: { target: 0.025, rows: [{ label: 'control 0.2', typeI: 0.02, mcse: 0.004, nSims: 150 }, { label: 'control 0.5', typeI: 0.031, mcse: 0.005, nSims: 150 }, { label: 'control 0.8', result: results[0] }] },
    borrowingSensitivity: [{ label: 'robust weight 0.2', scenario: 'Null', result: results[0] }, { label: 'no borrowing', scenario: 'Null', pSuccess: 0.02, mcse: 0.004, priorEss: 0 }] };
  return cache;
}
const HEADINGS = ['Objectives and summary of results', '1. Design summary', '2. Scenarios', '3. Operating characteristics', '4. Adaptation', '5. Benchmark comparison', '6. Type I error control', '7. Prior and borrowing sensitivity', '8. Example trials', '9. Plots', '10. Implementation and reproducibility', '11. Limitations and interpretation'];

test('report: every section heading and guideline note is present, plots are inline SVG', () => {
  const html = R.build(build());
  HEADINGS.forEach(h => assert(html.indexOf('<h2>' + h + '</h2>') >= 0, 'heading ' + h));
  assert((html.match(/class="guide"/g) || []).length === HEADINGS.length, 'one guideline note per section');
  assert((html.match(/<svg /g) || []).length >= 5, 'at least five plots');
  assert(html.indexOf('Test report') >= 0 && html.indexOf('<section class="nsim-report"') === 0);
  assert(html.indexOf(String.fromCharCode(0x2014)) < 0 && R.toMarkdown(build()).indexOf(String.fromCharCode(0x2014)) < 0, 'no em dashes');
  assert(html.indexOf('not provided') < 0, 'justifications from meta are used');
});

test('report: every operating characteristic cell carries a Monte Carlo standard error', () => {
  const html = R.build(build());
  const cells = html.match(/<td data-k="oc"[^>]*>[^<]*<\/td>/g) || [];
  assert(cells.length > 60, 'many OC cells: ' + cells.length);
  cells.forEach(c => assert(/\(SE [0-9.]+\)/.test(c), 'cell without SE: ' + c));
  // Type I error row for the null scenario and power for the others
  assert(html.indexOf('<td>Type I error</td>') >= 0 && html.indexOf('<td>Power</td>') >= 0);
  // values agree with the engine summary
  const r = build().results[1].summary; assert(html.indexOf(r.pSuccess.toFixed(4) + ' (SE ' + r.mcse.pSuccess.toFixed(4) + ')') >= 0, 'power cell matches the summary');
});

test('report: benchmark differences are paired, narratives cover the three kinds, nothing is NaN', () => {
  const html = R.build(build());
  assert(html.indexOf('so the differences are paired') >= 0, 'paired note');
  assert(html.indexOf('Example 1: early success') >= 0 && html.indexOf('Example 3: late success') >= 0, 'narratives');
  assert(html.indexOf('Interim 1 (week') >= 0 && html.indexOf('rule') >= 0, 'interim sentences');
  assert(!/NaN|undefined|Infinity/.test(html), 'no NaN or undefined in the output');
  const md = R.toMarkdown(build());
  HEADINGS.forEach(h => assert(md.indexOf('## ' + h) >= 0, 'markdown heading ' + h));
  assert(md.indexOf('| Scenario |') >= 0 && md.indexOf('<svg') < 0);
});

test('report: sections without inputs say so, and the report still builds', () => {
  const a = build(), min = { design: a.design, scenarios: a.scenarios.map(s => ({ name: s.name, truth: s.truth })), results: a.results, meta: { title: 'Minimal' } };
  const html = R.build(min);
  assert(html.indexOf('Calibration: not run.') >= 0 && html.indexOf('Null grid: not run.') >= 0, 'type I not run');
  assert(html.indexOf('Not run. No benchmark results were supplied') >= 0 && html.indexOf('No prior or borrowing sensitivity results were supplied') >= 0);
  assert(html.indexOf('>not provided<') >= 0, 'missing justification flagged');
  const none = R.build({ design: a.design, scenarios: [], results: [], meta: {} });
  HEADINGS.forEach(h => assert(none.indexOf(h) >= 0, 'heading in empty report ' + h));
  const summaryOnly = R.build({ design: a.design, scenarios: a.scenarios, results: a.results.map(r => ({ summary: r.summary, seed: r.seed, nSims: r.nSims })), meta: {} });
  assert(summaryOnly.indexOf('trials not kept') >= 0 && !/NaN|undefined/.test(summaryOnly), 'summary-only results');
});

test('report: design hash is SHA-256, stable for the same JSON and independent of key order', async () => {
  assert(R.sha256('abc') === 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad', 'sha256 test vector');
  assert(R.sha256('') === 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'empty');
  assert(R.sha256('a'.repeat(1000)) === '41edece42d63e8d9bf515a9ba6932e1c20cbc9f5a5d134645adb5db1b9737ea3', 'long input over several blocks');
  const d = build().design, h = R.hashDesign(d);
  assert(/^[0-9a-f]{64}$/.test(h) && h === R.hashDesign(JSON.parse(JSON.stringify(d))), 'stable');
  const reordered = {}; Object.keys(d).reverse().forEach(k => { reordered[k] = d[k]; }); assert(R.hashDesign(reordered) === h, 'key order does not matter');
  const changed = JSON.parse(JSON.stringify(d)); changed.study.maxN = 301; assert(R.hashDesign(changed) !== h, 'different design, different hash');
  const normalized = C.normalize(d); assert(R.hashDesign(normalized) === h, 'normalized design hashes as its source');
  assert(await R.hashDesignAsync(d) === h, 'SubtleCrypto result equals the JS result');
  const html = R.build(build()); assert(html.indexOf(h) >= 0, 'hash printed in the implementation table');
  assert(R.build(build()) === html, 'build is deterministic');
});

test('report: checklist marks items covered, partial or missing and reacts to missing sections', () => {
  const a = build(), full = R.checklist(a), by = (cl, id) => cl.find(x => x.id === id).status;
  assert(full.length === 31 && full.every((x, i) => x.id === i + 1 && x.item && x.note !== undefined), '31 items');
  assert(full.counts.covered + full.counts.partial + full.counts.missing === 31);
  [2, 3, 5, 8, 9, 11, 13, 22].forEach(id => assert(by(full, id) === 'covered', 'item ' + id + ' ' + by(full, id)));
  assert(by(full, 15) === 'missing' || by(full, 15) === 'covered');
  const noBench = Object.assign({}, a); delete noBench.benchmark; assert(by(R.checklist(noBench), 2) === 'partial', 'no benchmark');
  const noGrid = Object.assign({}, a); delete noGrid.nullGrid; assert(by(R.checklist(noGrid), 5) === 'partial', 'no grid, calibration only');
  const noType = Object.assign({}, noGrid); delete noType.calibration; const nullFree = Object.assign({}, noType, { scenarios: a.scenarios.slice(1), results: a.results.slice(1), benchmark: a.benchmark.slice(1) });
  assert(by(R.checklist(nullFree), 5) === 'missing', 'no Type I error evidence at all');
  const noSens = Object.assign({}, a); delete noSens.borrowingSensitivity; assert(by(R.checklist(noSens), 22) === 'missing', 'no sensitivity for a Bayesian design');
  const noJust = Object.assign({}, a, { scenarios: a.scenarios.map(s => ({ name: s.name, truth: s.truth })), meta: Object.assign({}, a.meta, { justifications: null }) });
  assert(by(R.checklist(noJust), 3) === 'partial' && by(R.checklist(noJust), 27) === 'partial', 'missing justifications');
  const noTrials = Object.assign({}, a, { results: a.results.map(r => ({ summary: r.summary, seed: r.seed, nSims: r.nSims })) });
  assert(by(R.checklist(noTrials), 9) === 'partial' && by(R.checklist(noTrials), 11) === 'missing' && by(R.checklist(noTrials), 13) === 'missing', 'summary-only results');
  const empty = R.checklist({});
  assert(empty.length === 31 && empty.counts.covered <= 8 && by(empty, 1) === 'missing' && by(empty, 2) === 'missing' && by(empty, 28) === 'missing', 'empty input: almost nothing covered');
  const lowN = Object.assign({}, a, { meta: Object.assign({}, a.meta, { nSims: 500 }) }); assert(by(R.checklist(lowN), 7) === 'partial', 'fewer than 10,000 trials');
  const withChecklist = R.build(Object.assign({}, a, { meta: Object.assign({}, a.meta, { includeChecklist: true }) })); assert(withChecklist.indexOf('Checklist coverage') >= 0);
});

test('report: standalone document wraps the section with the print stylesheet', () => {
  const doc = R.document(R.build(build()));
  assert(doc.indexOf('<!doctype html>') === 0 && doc.indexOf('@media print') >= 0 && doc.indexOf('nsim-report') >= 0, 'document with css');
});
