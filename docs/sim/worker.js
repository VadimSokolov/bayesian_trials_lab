/* Copyright 2026 Nytel
 * MIT License. Permission is granted, free of charge, to any person obtaining a copy of this software to use, copy, modify, merge, publish and distribute it, provided this notice is kept. The software is provided "as is", without warranty of any kind.
 *
 * Web Worker wrapper for NSim.core. Page side:
 *   var w = new Worker('sim/worker.js');
 *   w.postMessage({design: D, scenarios: [S1, S2], opts: {nSims: 1000, seed: 1, chunk: 50, savePath: false}});
 *   w.onmessage = e => { e.data.type: 'progress' {scenario, done, total, overall} | 'result' {scenario, summary, trials, interims, patients} | 'done' {results} | 'error' {message} };
 *   w.postMessage({cancel: true});                                  // stops after the current chunk
 *   w.postMessage({type: 'reEvaluate', scenario: 0, rules: R});     // boundary finding on the paths kept by a savePath run, no re-simulation
 * Simulation proceeds in chunks of opts.chunk trials (default 50) and yields to the event loop between chunks so progress and cancel messages are handled. Chunked results equal one-shot results (trial streams depend only on seed and trial index).
 * In Node the same logic is available as require('./worker.js').runJob(msg, post, isCancelled) (used by the tests).
 */
(function (root) {
  'use strict';
  var isWorker = typeof importScripts === 'function' && typeof WorkerGlobalScope !== 'undefined';
  if (isWorker) importScripts('core-math.js', 'models.js', 'core-engine.js');
  else if (!root.NSim || !root.NSim.core) require('./core-engine.js');
  var C = root.NSim.core, saved = {};
  var tick = function () { return new Promise(function (r) { setTimeout(r, 0); }); };

  async function runJob(msg, post, isCancelled) {
    try {
      if (msg.type === 'reEvaluate') {
        var sv = saved[msg.scenario || 0];
        if (!sv) throw new Error('no saved paths: run with opts.savePath = true first');
        var re = C.reEvaluate(sv, msg.rules);
        post({ type: 'reEvaluated', scenario: msg.scenario || 0, summary: re.summary });
        return;
      }
      var opts = msg.opts || {}, design = C.normalize(msg.design), scenarios = msg.scenarios || [msg.scenario], nSims = opts.nSims || 1000, chunk = opts.chunk || 50, results = [];
      for (var si = 0; si < scenarios.length; si++) {
        var trials = [], interims = [], patients = [], paths = opts.savePath ? [] : null;
        for (var from = 0; from < nSims; from += chunk) {
          if (isCancelled && isCancelled()) { post({ type: 'cancelled', scenario: si, done: from }); return; }
          var to = Math.min(nSims, from + chunk);
          var ch = C.runChunk(design, scenarios[si], { seed: opts.seed, from: from, to: to, savePath: opts.savePath, keepInterims: opts.keepInterims, keepPatients: opts.keepPatients });
          trials = trials.concat(ch.trials); interims = interims.concat(ch.interims); patients = patients.concat(ch.patients); if (paths) paths = paths.concat(ch.paths);
          post({ type: 'progress', scenario: si, done: to, total: nSims, overall: (si * nSims + to) / (scenarios.length * nSims) });
          await tick();
        }
        var summary = C.summarize(design, scenarios[si], trials), r = { type: 'result', scenario: si, summary: summary, trials: opts.keepTrials === false ? [] : trials, interims: interims, patients: patients };
        if (paths) saved[si] = { design: design, scenario: scenarios[si], paths: paths };
        results.push(r); post(r);
      }
      post({ type: 'done', results: results.map(function (r) { return { scenario: r.scenario, summary: r.summary }; }) });
    } catch (err) { post({ type: 'error', message: String(err && err.message || err) }); }
  }

  if (isWorker) {
    var cancelled = false;
    root.onmessage = function (e) {
      if (e.data && e.data.cancel) { cancelled = true; return; }
      cancelled = false; runJob(e.data, function (m) { root.postMessage(m); }, function () { return cancelled; });
    };
  }
  root.NSim.worker = { runJob: runJob };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.NSim.worker;
})(typeof self !== 'undefined' ? self : globalThis);
