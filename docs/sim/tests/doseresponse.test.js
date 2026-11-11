/* Copyright 2026 Nytel. MIT License. Dose-response fixture (DoseFinding 1.4.2 fitMod): Emax and sigmoid Emax fits. The fixture holds least squares (maximum likelihood) estimates; the engine reports Bayesian posterior means, so two comparisons are made: (1) an ML fit by profile least squares on the individual observations (must reproduce fitMod), (2) the engine's logistic3 (= Emax) and sigmoid models with vague priors, posterior mean curve at the doses (differs from ML by shrinkage and by the posterior mean being taken, not the mode). */
'use strict';
const fs = require('fs'), path = require('path');
const { test, assert, near } = require('./harness.js');
const M = require('../core-math.js'), Mod = require('../models.js');
const E = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'dose-response.json'), 'utf8')).entries;
const emax = E.find(e => e.id === 'dosefinding-emax-fit'), sig = E.find(e => e.id === 'dosefinding-sigemax-fit');
const dat = emax.inputs.data, doses = [0, 0.5, 1, 2, 4];
const sq = (x) => x * x;
// Least squares (the ML under normal errors) by profiling: for given ED50 and Hill exponent the model is linear in (e0, eMax); ED50 and h are found by a log grid with three zoom refinements inside the DoseFinding bounds. (The Laplace helper was tried first and stalls at the start value on the sigmoid surface, which is nearly flat in h.)
function mlFit(model, bnds) {
  const ed = model === 'emax' ? bnds : bnds[0], hb = model === 'emax' ? [1, 1] : bnds[1], N = dat.length;
  function prof(e50, h) {
    let sg = 0, sy = 0, sgg = 0, sgy = 0; dat.forEach(r => { const g = r.dose === 0 ? 0 : Math.pow(r.dose, h) / (Math.pow(e50, h) + Math.pow(r.dose, h)); sg += g; sy += r.resp; sgg += g * g; sgy += g * r.resp; });
    const eMax = (sgy - sg * sy / N) / (sgg - sg * sg / N), e0 = (sy - eMax * sg) / N; let rss = 0;
    dat.forEach(r => { const g = r.dose === 0 ? 0 : Math.pow(r.dose, h) / (Math.pow(e50, h) + Math.pow(r.dose, h)); rss += sq(r.resp - e0 - eMax * g); });
    return { rss: rss, e0: e0, eMax: eMax, ed50: e50, h: h };
  }
  let lo1 = Math.log(ed[0]), hi1 = Math.log(ed[1]), lo2 = Math.log(hb[0]), hi2 = Math.log(hb[1]), best = null;
  for (let round = 0; round < 4; round++) {
    const G = model === 'emax' ? 400 : 60;
    for (let i = 0; i <= G; i++) for (let j = 0; j <= (model === 'emax' ? 0 : G); j++) { const f = prof(Math.exp(lo1 + (hi1 - lo1) * i / G), Math.exp(lo2 + (hi2 - lo2) * j / Math.max(G, 1))); if (!best || f.rss < best.rss) best = f; }
    const w1 = (hi1 - lo1) / G * 2, w2 = (hi2 - lo2) / G * 2, c1 = Math.log(best.ed50), c2 = Math.log(best.h);
    lo1 = Math.max(Math.log(ed[0]), c1 - w1); hi1 = Math.min(Math.log(ed[1]), c1 + w1); lo2 = Math.max(Math.log(hb[0]), c2 - w2); hi2 = Math.min(Math.log(hb[1]), c2 + w2);
  }
  return { th: best, pred: doses.map(d => best.e0 + best.eMax * (d === 0 ? 0 : Math.pow(d, best.h) / (Math.pow(best.ed50, best.h) + Math.pow(d, best.h)))) };
}
test('dose-response fixture: ML Emax (profile least squares on individual data) reproduces DoseFinding fitMod', () => {
  const f = mlFit('emax', emax.inputs.bnds), o = emax.outputs;
  near(f.th.e0, o.coef.e0, 0.01, 'e0'); near(f.th.eMax, o.coef.eMax, 0.01, 'eMax'); near(f.th.ed50 / o.coef.ed50, 1, 0.01, 'ED50 (ratio)');
  f.pred.forEach((p, i) => near(p, o.pred_at_doses[i], 0.005, 'fitted value at dose ' + doses[i]));
});
test('dose-response fixture: ML sigmoid Emax (profile least squares) reproduces DoseFinding fitMod sigEmax', () => {
  const f = mlFit('sigEmax', sig.inputs.bnds), o = sig.outputs;
  f.pred.forEach((p, i) => near(p, o.pred_at_doses[i], 0.003, 'fitted value at dose ' + doses[i]));
  near(f.th.h, o.coef.h, 0.05, 'Hill exponent (weakly identified with 3 observations per dose)');
});
function engineFit(type, extraModel) {
  const arms = doses.map((d, i) => ({ name: 'd' + d, dose: d, isControl: i === 0 })), n = [0, 0, 0, 0, 0], s = [0, 0, 0, 0, 0], ss = [0, 0, 0, 0, 0];
  dat.forEach(r => { const i = doses.indexOf(r.dose); n[i]++; s[i] += r.resp; ss[i] += r.resp * r.resp; });
  const c = Mod.prepare({ study: { endpoint: 'continuous', sigma: 0.1, arms: arms }, model: Object.assign({ type: type, prior: { mean: 0.5, sd: 10 }, ed50: { mean: Math.log(1.5), sd: 2 } }, extraModel || {}) });
  return Mod.fit(c, { n: n, s: s, ss: ss }, M.makeRng(12), { nDraws: 6000 });
}
test('dose-response fixture: engine posterior means (vague priors) vs ML fits, Emax and sigmoid Emax', () => {
  const fe = engineFit('logistic3'), fs2 = engineFit('sigmoid'), dEmax = [], dSig = [];
  doses.forEach((d, i) => { dEmax.push(fe.mean[i] - emax.outputs.pred_at_doses[i]); dSig.push(fs2.mean[i] - sig.outputs.pred_at_doses[i]); });
  console.log('      posterior mean minus ML at doses ' + doses.join(', ') + '; Emax: ' + dEmax.map(x => x.toFixed(3)).join(', ') + '; sigmoid Emax: ' + dSig.map(x => x.toFixed(3)).join(', '));
  // Emax: three parameters, vague priors, posterior mean equals ML to about 0.003 (nearly Gaussian posterior). Sigmoid Emax: the engine's prior on the Hill exponent is log-normal(0, 0.5), which pulls h from the ML value 1.95 toward 1 and moves the curve by up to 0.06 (two standard errors of a dose mean); with 3 observations per dose h is hardly identified by the data.
  dEmax.forEach((x, i) => assert(Math.abs(x) < 0.01, 'Emax at dose ' + doses[i] + ': ' + x));
  dSig.forEach((x, i) => assert(Math.abs(x) < 0.07, 'sigmoid Emax at dose ' + doses[i] + ': ' + x));
});
