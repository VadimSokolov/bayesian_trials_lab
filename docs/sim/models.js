/* Copyright 2026 Nytel
 * MIT License. Permission is granted, free of charge, to any person obtaining a copy of this software to use, copy, modify, merge, publish and distribute it, provided this notice is kept. The software is provided "as is", without warranty of any kind.
 *
 * NSim.models: posterior inference for the final-endpoint dose-response models of the Core engine (Phase A). Plain script, one global (NSim), Node and browser.
 *
 * Interface
 *   var ctx = NSim.models.prepare(design);           // arms, doses, model spec with defaults
 *   var res = NSim.models.fit(ctx, data, rng, {nDraws, warm, updateWarm});
 *   data = {n[], s[], ss[]} per arm over completers: n subjects, s successes (dichotomous) or sum of outcomes (continuous), ss sum of squares (continuous).
 *   res  = {mean[], sd[] (response scale: probability or mean), thetaMean[], thetaSd[] (model scale: logit or mean), draws (Float64Array nDraws*K, row-major, response scale) or null, sigma (draws of the SD, continuous) or null, warm}
 *
 * Model types: independent (continuous: conjugate normal-inverse-gamma; dichotomous: logit-normal by Laplace), independentBeta (dichotomous, exact), ndlm (simple), ndlmMonotone, ndlm2 (second order), linear, hierarchical, logistic3 (3-parameter logistic), sigmoid (sigmoid Emax with Hill exponent), hierLogistic.
 *
 * Approximations (stated once here)
 * - Dichotomous endpoints in every model except independent and independentBeta: each arm's binomial likelihood is replaced by a normal likelihood for the empirical logit y = log((s + 0.5) / (n - s + 0.5)) with variance 1 / (s + 0.5) + 1 / (n - s + 0.5). Models are then fitted on the logit scale.
 * - Continuous endpoints in the same models: arm means ybar_d ~ N(theta_d, sigma2 / n_d). The within-arm sums of squares carry all the information on sigma2 that does not depend on the dose-response structure, so sigma2 | data is inverse-gamma with df = N - (arms with data); its posterior mean is plugged into the sampling variances and its draws are reported separately (sigma) for predictions. The uncertainty in sigma2 is therefore not propagated into the theta draws of these models.
 * - NDLM family (ndlm, ndlmMonotone, ndlm2, hierarchical, linear): the prior on theta is Gaussian given tau, so the posterior given tau is exact Gaussian (closed form, no Kalman recursion needed: the dense K x K covariance is used). tau^2 has an inverse-gamma prior (center and weight) and is integrated on a log-spaced grid with exact marginal likelihood weights. Doses are rescaled so that the mean gap between neighbouring doses is 1; tau is per mean gap. The control arm gets an independent normal prior (it is not smoothed).
 * - Monotone NDLM: draws from the unconstrained NDLM posterior are rejected until they are monotone (a posterior under a prior truncated to monotone curves). The tau weights are those of the untruncated model. After 200 failed tries a draw is projected by pool-adjacent-violators.
 * - Nonlinear models (logistic3, sigmoid, hierLogistic): adaptive random-walk Metropolis (fixed seed through the supplied Rng), 2 draws thinned from each retained pair; warm start from the previous fit of the same trial. Control is the dose 0 point of the curve. ED50 and Hill exponent have log-normal priors. hierLogistic integrates the per-dose offsets analytically (y_d ~ N(f_d, v_d + tau^2)) and then draws them from their conditional normal; the sum-to-zero constraint is not imposed.
 */
(function (root) {
  'use strict';
  var NSim = root.NSim = root.NSim || {};
  if (!NSim.math && typeof require === 'function') require('./core-math.js');
  var M = NSim.math;
  var Mod = {};
  var ALIAS = { 'independent-beta': 'independentBeta', 'beta-binomial': 'independentBeta', 'betabinomial': 'independentBeta', 'ndlm-simple': 'ndlm', 'simple-ndlm': 'ndlm', 'simple': 'ndlm', 'monotone': 'ndlmMonotone', 'ndlm-monotone': 'ndlmMonotone', 'second-order': 'ndlm2', 'ndlm-second-order': 'ndlm2', 'logistic': 'logistic3', '3pl': 'logistic3', 'emax': 'sigmoid', 'sigmoid-emax': 'sigmoid', 'hierarchical-logistic': 'hierLogistic' };
  Mod.types = ['independent', 'independentBeta', 'ndlm', 'ndlmMonotone', 'ndlm2', 'linear', 'hierarchical', 'logistic3', 'sigmoid', 'hierLogistic'];

  function igpar(c) { var w = c.weight == null ? 1 : c.weight; return { a: w / 2, b: w * c.center * c.center / 2 }; }

  Mod.prepare = function (design) {
    var st = design.study, arms = st.arms, K = arms.length, spec = {}, k, type;
    var src = design.model || {};
    for (k in src) spec[k] = src[k];
    type = ALIAS[spec.type] || spec.type || (st.endpoint === 'dichotomous' ? 'independentBeta' : 'independent');
    if (Mod.types.indexOf(type) < 0) throw new Error('unknown model type ' + spec.type);
    if (st.endpoint === 'continuous' && type === 'independentBeta') throw new Error('independentBeta needs a dichotomous endpoint');
    var dich = st.endpoint === 'dichotomous', sigma0 = st.sigma || 1;
    var isControl = new Uint8Array(K), ord = [], i, ctrl = -1;
    for (i = 0; i < K; i++) { isControl[i] = arms[i].isControl ? 1 : 0; if (isControl[i] && ctrl < 0) ctrl = i; else if (!isControl[i]) ord.push(i); }
    ord.sort(function (a, b) { return (arms[a].dose - arms[b].dose) || (a - b); });
    var D = ord.length, gap = 1;
    if (D > 1) gap = (arms[ord[D - 1]].dose - arms[ord[0]].dose) / (D - 1) || 1;
    var nu = new Float64Array(K);
    for (i = 0; i < K; i++) nu[i] = spec.nu ? spec.nu[i] : (isControl[i] ? 0 : arms[i].dose / gap);
    var pr = spec.prior || {};
    var m0 = pr.mean == null ? 0 : pr.mean, s0 = pr.sd == null ? (dich ? 2.5 : 100 * sigma0) : pr.sd;
    var tauSpec = spec.tau || {}, tc = tauSpec.center == null ? (dich ? 0.3 : 0.3 * sigma0) : tauSpec.center;
    var sg = spec.sigmaPrior || {}, bor = null;
    if (design.borrowing) {
      if (ctrl < 0) throw new Error('borrowing needs a control arm');
      if (['independent', 'independentBeta', 'ndlm', 'ndlmMonotone', 'ndlm2', 'hierarchical'].indexOf(type) < 0) throw new Error('borrowing needs a model in which the control is independent of the dose arms (not ' + type + ')');
      bor = B.prepare(design.borrowing, st);
    }
    return {
      borrow: bor,
      type: type, endpoint: st.endpoint, dich: dich, K: K, arms: arms, isControl: isControl, ctrl: ctrl, ord: ord, nu: nu, spec: spec,
      sigma0: sigma0, m0: m0, s0: s0, slopeSd: pr.slopeSd == null ? s0 : pr.slopeSd,
      kappa0: pr.kappa == null ? sigma0 * sigma0 / (s0 * s0) : pr.kappa,
      ba: pr.a == null ? 1 : pr.a, bb: pr.b == null ? 1 : pr.b,
      tau: { center: tc, weight: tauSpec.weight == null ? 1 : tauSpec.weight, fixed: tauSpec.fixed, grid: tauSpec.grid || 25, span: tauSpec.span || 5 },
      sigPrior: igpar({ center: sg.center == null ? sigma0 : sg.center, weight: sg.weight }),
      decreasing: spec.direction === 'decreasing',
      ed50: spec.ed50 || null
    };
  };

  /* ---------- helpers ---------- */
  function stats(draws, J, K) {
    var mean = new Float64Array(K), sd = new Float64Array(K), j, d, v;
    for (j = 0; j < J; j++) for (d = 0; d < K; d++) mean[d] += draws[j * K + d] / J;
    for (j = 0; j < J; j++) for (d = 0; d < K; d++) { v = draws[j * K + d] - mean[d]; sd[d] += v * v; }
    for (d = 0; d < K; d++) sd[d] = Math.sqrt(sd[d] / Math.max(J - 1, 1));
    return { mean: mean, sd: sd };
  }
  function sigmaPosterior(c, data) {
    var N = 0, kobs = 0, W = 0, d;
    for (d = 0; d < c.K; d++) if (data.n[d] > 0) { N += data.n[d]; kobs++; W += Math.max(0, data.ss[d] - data.s[d] * data.s[d] / data.n[d]); }
    var a = c.sigPrior.a + Math.max(0, N - kobs) / 2, b = c.sigPrior.b + W / 2;
    return { a: a, b: b, sig2: b / Math.max(a - 1, 0.5) };
  }
  function sigmaDraws(sp, rng, J) { var s = new Float64Array(J); for (var j = 0; j < J; j++) s[j] = Math.sqrt(sp.b / rng.gamma(sp.a)); return s; }
  // Normal working data (y, v) per arm and the list of arms with data.
  function workingData(c, data, sig2) {
    var y = new Float64Array(c.K), v = new Float64Array(c.K), obs = [], d, n, s;
    for (d = 0; d < c.K; d++) {
      n = data.n[d]; s = data.s[d];
      if (!(n > 0)) continue;
      obs.push(d);
      if (c.dich) { y[d] = Math.log((s + 0.5) / (n - s + 0.5)); v[d] = 1 / (s + 0.5) + 1 / (n - s + 0.5); }
      else { y[d] = s / n; v[d] = sig2 / n; }
    }
    return { y: y, v: v, obs: obs };
  }
  function finish(c, thetaMean, thetaSd, theta, J, sigma, warm) {
    var K = c.K, res = { type: c.type, K: K, thetaMean: thetaMean, thetaSd: thetaSd, draws: null, sigma: sigma || null, warm: warm || null, nDraws: J };
    var i, d, mean, sd;
    if (theta && J > 0) {
      var st1 = stats(theta, J, K);
      if (!thetaMean) { res.thetaMean = st1.mean; res.thetaSd = st1.sd; }
      if (c.dich) { for (i = 0; i < theta.length; i++) theta[i] = 1 / (1 + Math.exp(-theta[i])); }
      res.draws = theta;
      var st2 = stats(theta, J, K);
      mean = st2.mean; sd = st2.sd;
      if (!c.dich && thetaMean) { mean = thetaMean; sd = thetaSd; }
    } else {
      mean = new Float64Array(K); sd = new Float64Array(K);
      for (d = 0; d < K; d++) {
        if (c.dich) { var p = 1 / (1 + Math.exp(-thetaMean[d])); mean[d] = p; sd[d] = p * (1 - p) * thetaSd[d]; } else { mean[d] = thetaMean[d]; sd[d] = thetaSd[d]; }
      }
    }
    res.mean = mean; res.sd = sd;
    return res;
  }

  /* ---------- independent models ---------- */
  function fitIndependentNormal(c, data, rng, J) {
    var K = c.K, d, N = 0, W = 0, kobs = 0, k0 = c.kappa0, m0 = c.m0;
    var mn = new Float64Array(K), kn = new Float64Array(K);
    for (d = 0; d < K; d++) {
      var n = data.n[d], s = data.s[d];
      kn[d] = k0 + n; mn[d] = (k0 * m0 + s) / kn[d];
      if (n > 0) { N += n; kobs++; var yb = s / n; W += Math.max(0, data.ss[d] - s * yb) + k0 * n * (yb - m0) * (yb - m0) / (k0 + n); }
    }
    var an = c.sigPrior.a + N / 2, bn = c.sigPrior.b + W / 2, tm = new Float64Array(K), ts = new Float64Array(K), j;
    for (d = 0; d < K; d++) { tm[d] = mn[d]; ts[d] = Math.sqrt(bn / Math.max(an - 1, 0.5) / kn[d]); }
    var theta = null, sigma = null;
    if (J > 0) {
      theta = new Float64Array(J * K); sigma = new Float64Array(J);
      for (j = 0; j < J; j++) {
        var s2 = bn / rng.gamma(an); sigma[j] = Math.sqrt(s2);
        for (d = 0; d < K; d++) theta[j * K + d] = mn[d] + Math.sqrt(s2 / kn[d]) * rng.normal();
      }
    }
    var res = finish(c, tm, ts, theta, J, sigma, null);
    res.post = { an: an, bn: bn, mn: mn, kn: kn };
    return res;
  }
  function fitIndependentBeta(c, data, rng, J) {
    var K = c.K, d, A = new Float64Array(K), B = new Float64Array(K), mean = new Float64Array(K), sd = new Float64Array(K);
    for (d = 0; d < K; d++) {
      A[d] = c.ba + data.s[d]; B[d] = c.bb + data.n[d] - data.s[d];
      var t = A[d] + B[d]; mean[d] = A[d] / t; sd[d] = Math.sqrt(A[d] * B[d] / (t * t * (t + 1)));
    }
    var draws = null, j;
    if (J > 0) { draws = new Float64Array(J * K); for (j = 0; j < J; j++) for (d = 0; d < K; d++) draws[j * K + d] = rng.beta(A[d], B[d]); }
    var res = { type: c.type, K: K, mean: mean, sd: sd, thetaMean: null, thetaSd: null, draws: draws, sigma: null, warm: null, nDraws: J, post: { a: A, b: B } };
    return res;
  }
  // Logit-normal prior, binomial likelihood, Laplace approximation of each arm's logit.
  function fitIndependentLogit(c, data, rng, J) {
    var K = c.K, d, tm = new Float64Array(K), ts = new Float64Array(K), s0sq = c.s0 * c.s0, it;
    for (d = 0; d < K; d++) {
      var n = data.n[d], s = data.s[d], th = Math.log((s + 0.5) / (n - s + 0.5)), g, h, p;
      // The score is strictly decreasing in th, so the mode is its unique root: bracket it, then take Newton steps that stay inside the bracket (bisection when a step would leave it).
      var score = function (t) { return s - n / (1 + Math.exp(-t)) - (t - c.m0) / s0sq; }, lo = Math.min(th, c.m0) - 1, hi = Math.max(th, c.m0) + 1, ok = false;
      for (it = 0; it < 200 && score(lo) < 0; it++) lo -= 2 * (hi - lo);
      for (it = 0; it < 200 && score(hi) > 0; it++) hi += 2 * (hi - lo);
      th = Math.min(Math.max(th, lo), hi);
      for (it = 0; it < 500; it++) {
        p = 1 / (1 + Math.exp(-th)); g = s - n * p - (th - c.m0) / s0sq; h = -n * p * (1 - p) - 1 / s0sq;
        if (g > 0) lo = th; else hi = th;
        var nt = th - g / h; if (!(nt > lo && nt < hi)) nt = (lo + hi) / 2;
        if (Math.abs(nt - th) < 1e-12 || hi - lo < 1e-12) { th = nt; ok = true; break; }
        th = nt;
      }
      if (!ok && !(Math.abs(score(th)) < 1e-8)) throw new Error('independent logit mode did not converge');
      p = 1 / (1 + Math.exp(-th)); h = -n * p * (1 - p) - 1 / s0sq;
      tm[d] = th; ts[d] = 1 / Math.sqrt(-h);
    }
    var theta = null, j;
    if (J > 0) { theta = new Float64Array(J * K); for (j = 0; j < J; j++) for (d = 0; d < K; d++) theta[j * K + d] = tm[d] + ts[d] * rng.normal(); }
    return finish(c, tm, ts, theta, J, null, null);
  }

  /* ---------- Gaussian family (NDLM, linear, hierarchical) ---------- */
  function priorMoments(c, tau2, m, Sig) {
    var K = c.K, i, j, a, b, xi, xj, mn, mx, idx = c.ord, D = idx.length, s0sq = c.s0 * c.s0, type = c.type;
    Sig.fill(0); m.fill(c.m0);
    if (type === 'linear') {
      var xm = 0, xs = new Float64Array(K), s1 = c.slopeSd * c.slopeSd;
      for (i = 0; i < K; i++) xm += c.nu[i] / K;
      for (i = 0; i < K; i++) xs[i] = c.nu[i] - xm;
      for (i = 0; i < K; i++) for (j = 0; j < K; j++) Sig[i * K + j] = s0sq + s1 * xs[i] * xs[j];
      return;
    }
    for (i = 0; i < K; i++) if (c.isControl[i]) Sig[i * K + i] = s0sq;
    if (D === 0) return;
    var x0 = c.nu[idx[0]];
    for (a = 0; a < D; a++) {
      for (b = 0; b < D; b++) {
        i = idx[a]; j = idx[b]; xi = c.nu[i] - x0; xj = c.nu[j] - x0; mn = Math.min(xi, xj); mx = Math.max(xi, xj);
        if (type === 'hierarchical') Sig[i * K + j] = s0sq + (a === b ? tau2 : 0);
        else if (type === 'ndlm2') Sig[i * K + j] = s0sq + c.slopeSd * c.slopeSd * xi * xj + tau2 * (mn * mn * mx / 2 - mn * mn * mn / 6);
        else Sig[i * K + j] = s0sq + tau2 * mn;
      }
    }
  }
  function tauComponents(c) {
    var t = c.tau, out = [], g, G = t.grid;
    if (c.type === 'linear') return [{ tau2: 0, logw: 0 }];
    if (t.fixed != null) return [{ tau2: t.fixed * t.fixed, logw: 0 }];
    var ip = igpar({ center: t.center, weight: t.weight }), lc = Math.log(t.center), lg = M.logGamma(ip.a);
    for (g = 0; g < G; g++) {
      var lt = lc - t.span + 2 * t.span * g / (G - 1), tau2 = Math.exp(2 * lt);
      out.push({ tau2: tau2, logw: ip.a * Math.log(ip.b) - lg - ip.a * Math.log(tau2) - ip.b / tau2 });
    }
    return out;
  }
  function isMonotone(x, ord, dec) {
    for (var a = 1; a < ord.length; a++) { var df = x[ord[a]] - x[ord[a - 1]]; if (dec ? df > 0 : df < 0) return false; }
    return true;
  }
  function pav(x, ord, dec) {
    var n = ord.length, vals = [], w = [], i, k;
    for (i = 0; i < n; i++) { vals.push(dec ? -x[ord[i]] : x[ord[i]]); w.push(1); while (vals.length > 1 && vals[vals.length - 2] > vals[vals.length - 1]) { var v2 = vals.pop(), w2 = w.pop(); vals[vals.length - 1] = (vals[vals.length - 1] * w[w.length - 1] + v2 * w2) / (w[w.length - 1] + w2); w[w.length - 1] += w2; } }
    var out = [], q; for (q = 0; q < vals.length; q++) for (k = 0; k < w[q]; k++) out.push(vals[q]);
    for (i = 0; i < n; i++) x[ord[i]] = dec ? -out[i] : out[i];
  }
  function fitGaussian(c, data, rng, J) {
    var K = c.K, sp = null, sig2 = 1, g, i, j, k;
    if (!c.dich) { sp = sigmaPosterior(c, data); sig2 = sp.sig2; }
    var wd = workingData(c, data, sig2), obs = wd.obs, nO = obs.length, comps = tauComponents(c), G = comps.length;
    var m = new Float64Array(K), Sig = new Float64Array(K * K), logW = new Float64Array(G), post = [];
    for (g = 0; g < G; g++) {
      priorMoments(c, comps[g].tau2, m, Sig);
      var pm = Float64Array.from(m), pc = Float64Array.from(Sig), logML = 0;
      if (nO > 0) {
        var S = new Float64Array(nO * nO), r = new Float64Array(nO), a, b;
        for (a = 0; a < nO; a++) { r[a] = wd.y[obs[a]] - m[obs[a]]; for (b = 0; b < nO; b++) S[a * nO + b] = Sig[obs[a] * K + obs[b]] + (a === b ? wd.v[obs[a]] : 0); }
        var L = M.cholJitter(S, nO), alpha = M.cholSolve(L, nO, r), quad = 0;
        for (a = 0; a < nO; a++) quad += r[a] * alpha[a];
        logML = -0.5 * quad - 0.5 * M.cholLogDet(L, nO);
        for (k = 0; k < K; k++) { var s = 0; for (a = 0; a < nO; a++) s += Sig[k * K + obs[a]] * alpha[a]; pm[k] += s; }
        var Wm = new Float64Array(nO * K), col = new Float64Array(nO);
        for (k = 0; k < K; k++) { for (a = 0; a < nO; a++) col[a] = Sig[obs[a] * K + k]; var w = M.solveLower(L, nO, col); for (a = 0; a < nO; a++) Wm[a * K + k] = w[a]; }
        for (i = 0; i < K; i++) for (j = 0; j <= i; j++) { var t = 0; for (a = 0; a < nO; a++) t += Wm[a * K + i] * Wm[a * K + j]; pc[i * K + j] -= t; if (i !== j) pc[j * K + i] = pc[i * K + j]; }
      }
      logW[g] = comps[g].logw + logML; post.push({ mean: pm, cov: pc, L: null });
    }
    var lse = M.logsumexp(logW, G), w = new Float64Array(G), cum = new Float64Array(G), cs = 0;
    for (g = 0; g < G; g++) { w[g] = Math.exp(logW[g] - lse); cs += w[g]; cum[g] = cs; }
    var tm = new Float64Array(K), second = new Float64Array(K);
    for (g = 0; g < G; g++) for (k = 0; k < K; k++) { var mu = post[g].mean[k]; tm[k] += w[g] * mu; second[k] += w[g] * (post[g].cov[k * K + k] + mu * mu); }
    var ts = new Float64Array(K);
    for (k = 0; k < K; k++) ts[k] = Math.sqrt(Math.max(second[k] - tm[k] * tm[k], 0));
    var theta = null, sigma = null, mono = c.type === 'ndlmMonotone' && c.ord.length > 1, z = new Float64Array(K), x = new Float64Array(K);
    function drawFrom(u, rg) {
      var gi = 0; while (gi < G - 1 && u > cum[gi] * 0.9999999999) gi++;
      var pc2 = post[gi]; if (!pc2.L) pc2.L = M.cholJitter(pc2.cov, K);
      for (var a2 = 0; a2 < K; a2++) z[a2] = rg.normal();
      for (var a3 = 0; a3 < K; a3++) { var s2 = pc2.mean[a3]; for (var b3 = 0; b3 <= a3; b3++) s2 += pc2.L[a3 * K + b3] * z[b3]; x[a3] = s2; }
    }
    function drawAll(Jn, rg) {
      var th = new Float64Array(Jn * K), u0 = rg.u(), jj, kk;
      for (jj = 0; jj < Jn; jj++) {
        drawFrom((jj + u0) / Jn, rg);
        if (mono) {
          var tries = 0;
          while (!isMonotone(x, c.ord, c.decreasing) && tries < 200) { drawFrom(rg.u(), rg); tries++; }
          if (tries >= 200) pav(x, c.ord, c.decreasing);
        }
        for (kk = 0; kk < K; kk++) th[jj * K + kk] = x[kk];
      }
      return th;
    }
    if (J > 0) { theta = drawAll(J, rng); if (sp) sigma = sigmaDraws(sp, rng, J); }
    var res = (mono && theta) ? finish(c, null, null, theta, J, sigma, null) : finish(c, tm, ts, theta, J, sigma, null);
    if (mono) {
      // The constrained summaries come from a fixed number of draws on a private stream, so they do not depend on nDraws.
      var JS = 1000, th2 = drawAll(JS, M.makeRng(8675309)), st = stats(th2, JS, K), mn2 = st.mean, sd2 = st.sd, kq;
      res.thetaMean = st.mean; res.thetaSd = st.sd;
      if (c.dich) {
        for (kq = 0; kq < th2.length; kq++) th2[kq] = 1 / (1 + Math.exp(-th2[kq]));
        var st3 = stats(th2, JS, K); mn2 = st3.mean; sd2 = st3.sd;
      }
      res.mean = mn2; res.sd = sd2;
    }
    res.tauWeights = w; res.tau2 = comps.map(function (q) { return q.tau2; });
    return res;
  }

  /* ---------- Nonlinear dose-response models (Metropolis) ---------- */
  function fitCurve(c, data, rng, J, warm, updateWarm) {
    var K = c.K, sig2 = 1, sp = null, d, j, k, sigmoid = c.type === 'sigmoid', hier = c.type === 'hierLogistic';
    if (!c.dich) { sp = sigmaPosterior(c, data); sig2 = sp.sig2; }
    var wd = workingData(c, data, sig2), obs = wd.obs, nO = obs.length;
    var P = 3 + (sigmoid ? 1 : 0) + (hier ? 1 : 0), iH = sigmoid ? 3 : -1, iT = hier ? P - 1 : -1;
    var pos = []; for (d = 0; d < K; d++) if (c.nu[d] > 0) pos.push(c.nu[d]);
    pos.sort(function (a, b) { return a - b; });
    var edm = c.ed50 && c.ed50.mean != null ? c.ed50.mean : Math.log(pos.length ? pos[Math.floor(pos.length / 2)] : 1), eds = c.ed50 && c.ed50.sd != null ? c.ed50.sd : 1.5;
    var ip = igpar({ center: c.tau.center, weight: c.tau.weight }), lgA = M.logGamma(ip.a), s0sq = c.s0 * c.s0, LH = Math.log(8);
    function curve(par, d2) {
      var nu = c.nu[d2], ed = Math.exp(par[2]);
      if (sigmoid) { var h = Math.exp(par[3]); if (nu <= 0) return par[0]; var q = Math.pow(nu, h); return par[0] + (par[1] - par[0]) * q / (Math.pow(ed, h) + q); }
      return par[0] + par[1] * nu / (nu + ed);
    }
    function logpost(par) {
      var lp = -0.5 * (par[0] - c.m0) * (par[0] - c.m0) / s0sq - 0.5 * (par[1] - (sigmoid ? c.m0 : 0)) * (par[1] - (sigmoid ? c.m0 : 0)) / s0sq - 0.5 * (par[2] - edm) * (par[2] - edm) / (eds * eds), tau2 = 0, a, f, r, vv;
      if (sigmoid) { if (Math.abs(par[3]) > LH) return -Infinity; lp -= 0.5 * par[3] * par[3] / 0.25; }
      if (hier) { tau2 = Math.exp(2 * par[iT]); if (tau2 < 1e-10 || tau2 > 1e4) return -Infinity; lp += ip.a * Math.log(ip.b) - lgA - (ip.a + 1) * Math.log(tau2) - ip.b / tau2 + Math.log(2 * tau2); }
      if (!isFinite(par[2]) || Math.abs(par[2]) > 12) return -Infinity;
      for (a = 0; a < nO; a++) { d = obs[a]; f = curve(par, d); r = wd.y[d] - f; vv = wd.v[d] + (hier && !c.isControl[d] ? tau2 : 0); lp += -0.5 * r * r / vv - 0.5 * Math.log(vv); }
      return lp;
    }
    var x0 = new Float64Array(P), cov0 = new Float64Array(P * P), burn;
    if (warm && warm.x && warm.x.length === P) { x0 = Float64Array.from(warm.x); cov0 = Float64Array.from(warm.cov); burn = 150; }
    else {
      var ymin = Infinity, ymax = -Infinity, ym = 0, a0;
      for (a0 = 0; a0 < nO; a0++) { var yy = wd.y[obs[a0]]; ymin = Math.min(ymin, yy); ymax = Math.max(ymax, yy); ym += yy / nO; }
      if (nO === 0) { ymin = ymax = ym = c.m0; }
      var ys = Math.max(0.1, ymax - ymin, c.dich ? 0.5 : Math.sqrt(sig2 / Math.max(1, nO)));
      x0[0] = (c.ctrl >= 0 && data.n[c.ctrl] > 0) ? wd.y[c.ctrl] : ym; x0[1] = sigmoid ? ymax : (ymax - ymin) * (c.decreasing ? -1 : 1); x0[2] = edm;
      if (sigmoid) x0[3] = 0; if (hier) x0[iT] = Math.log(c.tau.center);
      var scales = [ys, 2 * ys, 1, 0.5, 0.5]; for (k = 0; k < P; k++) cov0[k * P + k] = 0.25 * scales[k] * scales[k];
      burn = 600;
      if (!isFinite(logpost(x0))) { x0[1] = 0; x0[0] = ym; }
    }
    var nd = Math.max(J, 300);
    var mc = M.metropolis(logpost, x0, { rng: rng, nDraws: nd, burn: burn, thin: 2, cov0: cov0 });
    if (warm && updateWarm !== false) { warm.x = mc.x; warm.cov = mc.cov; }
    var theta = new Float64Array(nd * K), par = new Float64Array(P);
    for (j = 0; j < nd; j++) {
      for (k = 0; k < P; k++) par[k] = mc.draws[j * P + k];
      var tau2 = hier ? Math.exp(2 * par[iT]) : 0;
      for (d = 0; d < K; d++) {
        var f = curve(par, d), zeta = 0;
        if (hier && !c.isControl[d]) {
          if (data.n[d] > 0) { var vd = wd.v[d], pr = 1 / tau2 + 1 / vd; zeta = ((wd.y[d] - f) / vd) / pr + rng.normal() / Math.sqrt(pr); } else zeta = Math.sqrt(tau2) * rng.normal();
        }
        theta[j * K + d] = f + zeta;
      }
    }
    var sigma = sp ? sigmaDraws(sp, rng, nd) : null;
    var res = finish(c, null, null, theta, nd, sigma, warm || null);
    res.acc = mc.acc;
    return res;
  }

  /* ---------- Historical borrowing for the control arm ---------- */
  // design.borrowing = {method, historical: [{n, r} | {n, mean, sd}], ...}; see the header of core-engine.js. A prior object has one of three kinds: 'beta' (mixture of Beta, dichotomous), 'norm' (mixture of normals for the control mean, continuous) or 'grid' (density of the control logit on a grid, dichotomous hierarchical).
  var B = Mod.borrow = {};
  var BALIAS = { hierarchical: 'hierarchical', map: 'hierarchical', power: 'power', 'power-prior': 'power', robust: 'robust', mixture: 'robust', 'robust-mixture': 'robust' };
  function expit(x) { return 1 / (1 + Math.exp(-x)); }
  function normLogPdf(x, m, s) { var z = (x - m) / s; return -0.5 * z * z - Math.log(s) - 0.9189385332046727; }
  function histPool(hist, dich, a0) {
    var N = 0, R = 0, Nw = 0, Rw = 0, sy = 0, ssw = 0, df = 0, i, h, w, r;
    for (i = 0; i < hist.length; i++) {
      h = hist[i]; w = Array.isArray(a0) ? a0[i] : a0; N += h.n; Nw += w * h.n;
      if (dich) { r = h.r != null ? h.r : (h.responses != null ? h.responses : h.s); if (r == null) throw new Error('borrowing.historical needs {n, r} for a dichotomous endpoint'); R += r; Rw += w * r; }
      else { if (h.mean == null) throw new Error('borrowing.historical needs {n, mean, sd} for a continuous endpoint'); sy += w * h.n * h.mean; if (h.sd != null && h.n > 1) { ssw += (h.n - 1) * h.sd * h.sd; df += h.n - 1; } }
    }
    return { N: N, R: R, Nw: Nw, Rw: Rw, mean: Nw > 0 ? sy / Nw : 0, sd: df > 0 ? Math.sqrt(ssw / df) : null };
  }
  function tauGrid(spec, scale0) {
    spec = spec || {};
    if (spec.fixed != null) return { v: [spec.fixed], w: [1] };
    if (spec.prior === 'grid' || spec.values) { var tw = spec.weights || spec.values.map(function () { return 1; }), ts = tw.reduce(function (a, b) { return a + b; }, 0); return { v: spec.values.slice(), w: tw.map(function (x) { return x / ts; }) }; }
    var sc = spec.scale == null ? scale0 : spec.scale, G = spec.grid || 40, v = [], w = [], g;
    for (g = 0; g < G; g++) { v.push(sc * M.PhiInv(0.5 + 0.5 * (g + 0.5) / G)); w.push(1 / G); } // equal-probability strata of the half-normal prior
    return { v: v, w: w };
  }
  function hierNorm(hist, bor, sigmaRef) {
    var tg = tauGrid(bor.tau, 0.5 * sigmaRef), mu = bor.mu || {}, m0 = mu.mean == null ? histPool(hist, false, 1).mean : mu.mean, s0 = mu.sd == null ? 100 * sigmaRef : mu.sd;
    var H = hist.length, G = tg.v.length, g, i, W = [], lw = [], mx = -Infinity, comps = { w: [], m: [], s: [] }, tauMean = 0;
    for (g = 0; g < G; g++) {
      var t2 = tg.v[g] * tg.v[g], P = 1 / (s0 * s0), Sy = m0 / (s0 * s0), Syy = m0 * m0 / (s0 * s0), lv = 0;
      for (i = 0; i < H; i++) { var v = t2 + hist[i].sd * hist[i].sd / hist[i].n; P += 1 / v; Sy += hist[i].mean / v; Syy += hist[i].mean * hist[i].mean / v; lv += Math.log(v); }
      var lml = -0.5 * (H * Math.log(2 * Math.PI) + lv + 2 * Math.log(s0) + Math.log(P) + Syy - Sy * Sy / P);
      lw.push(Math.log(tg.w[g]) + lml); mx = Math.max(mx, lw[g]);
      comps.m.push(Sy / P); comps.s.push(Math.sqrt(1 / P + t2));
    }
    var tot = 0; for (g = 0; g < G; g++) { W[g] = Math.exp(lw[g] - mx); tot += W[g]; }
    for (g = 0; g < G; g++) { comps.w.push(W[g] / tot); tauMean += W[g] / tot * tg.v[g]; }
    return { prior: { kind: 'norm', w: comps.w, m: comps.m, s: comps.s, sigmaRef: sigmaRef, inf: -1 }, tauMean: tauMean };
  }
  function hierGrid(hist, bor) {
    var tg = tauGrid(bor.tau, 1), mu = bor.mu || {}, m0 = mu.mean == null ? 0 : mu.mean, s0 = mu.sd == null ? 2 : mu.sd;
    var NG = 401, lo = -10, hi = 10, h = (hi - lo) / (NG - 1), eta = new Float64Array(NG), H = hist.length, i, g, q, k;
    var lik = [], yv = [], vv = [];
    for (i = 0; i < NG; i++) eta[i] = lo + i * h;
    for (k = 0; k < H; k++) {
      var r = hist[k].r != null ? hist[k].r : (hist[k].responses != null ? hist[k].responses : hist[k].s), n = hist[k].n, ll = new Float64Array(NG), mxl = -Infinity;
      for (i = 0; i < NG; i++) { var p = expit(eta[i]); ll[i] = r * Math.log(p) + (n - r) * Math.log(1 - p); if (ll[i] > mxl) mxl = ll[i]; }
      for (i = 0; i < NG; i++) ll[i] = Math.exp(ll[i] - mxl);
      lik.push(ll); yv.push(Math.log((r + 0.5) / (n - r + 0.5))); vv.push(1 / (r + 0.5) + 1 / (n - r + 0.5));
    }
    var Q = 61, entries = [], mxw = -Infinity, dens = new Float64Array(NG);
    for (g = 0; g < tg.v.length; g++) {
      var t2 = tg.v[g] * tg.v[g], te = Math.max(tg.v[g], 0.5 * h), P = 1 / (s0 * s0), Sy = m0 / (s0 * s0);
      for (k = 0; k < H; k++) { P += 1 / (t2 + vv[k]); Sy += yv[k] / (t2 + vv[k]); }
      var mh = Sy / P, Sg = 1 / Math.sqrt(P), dmu = 2 * Sg * 10 / (Q - 1);
      for (q = 0; q < Q; q++) {
        var muq = mh + 2 * Sg * (-5 + 10 * q / (Q - 1)), lg = Math.log(tg.w[g]) + normLogPdf(muq, m0, s0) + Math.log(dmu);
        for (i = 0; i < NG; i++) dens[i] = Math.exp(normLogPdf(eta[i], muq, te)) * h;
        for (k = 0; k < H; k++) { var sum = 0, L = lik[k]; for (i = 0; i < NG; i++) sum += L[i] * dens[i]; lg += Math.log(Math.max(sum, 1e-300)); }
        entries.push({ g: g, mu: muq, te: te, lw: lg }); if (lg > mxw) mxw = lg;
      }
    }
    var f = new Float64Array(NG), tot = 0, tauMean = 0, e;
    for (q = 0; q < entries.length; q++) {
      e = entries[q]; var w = Math.exp(e.lw - mxw); tot += w; tauMean += w * tg.v[e.g];
      for (i = 0; i < NG; i++) f[i] += w * Math.exp(normLogPdf(eta[i], e.mu, e.te));
    }
    for (i = 0; i < NG; i++) f[i] /= tot;
    return { prior: { kind: 'grid', eta: eta, h: h, f: f }, tauMean: tauMean / tot };
  }
  B.prepare = function (bor, st) {
    var dich = st.endpoint === 'dichotomous', method = BALIAS[bor.method], hist = bor.historical || [], a0 = bor.a0 == null ? 1 : bor.a0, i;
    if (!method) throw new Error('borrowing.method must be hierarchical, power or robust');
    if (method !== 'robust' || !bor.informative) { if (!hist.length) throw new Error('borrowing.historical is empty'); }
    var pool = hist.length ? histPool(hist, dich, a0) : null, init = bor.initial || { a: 1, b: 1 }, out = { method: method, dich: dich, info: {} }, sigmaRef = bor.sigma || (pool && pool.sd) || st.sigma || 1;
    function informative() {
      if (dich) { var inf = bor.informative; if (inf) return { a: inf.a, b: inf.b }; return { a: init.a + pool.Rw, b: init.b + pool.Nw - pool.Rw }; }
      var inf2 = bor.informative; if (inf2) return { m: inf2.mean, s: inf2.sd };
      return { m: pool.mean, s: sigmaRef / Math.sqrt(pool.Nw) };
    }
    if (method === 'power') {
      var c1 = informative(); out.prior = dich ? { kind: 'beta', w: [1], a: [c1.a], b: [c1.b], inf: 0 } : { kind: 'norm', w: [1], m: [c1.m], s: [c1.s], sigmaRef: sigmaRef, inf: 0 };
    } else if (method === 'robust') {
      var c2 = informative(), wv = bor.robustWeight != null ? bor.robustWeight : (bor.weight != null ? bor.weight : 0.1), vg = bor.vague || {};
      if (dich) out.prior = { kind: 'beta', w: [1 - wv, wv], a: [c2.a, vg.a == null ? 1 : vg.a], b: [c2.b, vg.b == null ? 1 : vg.b], inf: 0 };
      else out.prior = { kind: 'norm', w: [1 - wv, wv], m: [c2.m, vg.mean == null ? c2.m : vg.mean], s: [c2.s, vg.sd == null ? sigmaRef : vg.sd], sigmaRef: sigmaRef, inf: 0 };
      out.info.essInformative = { moment: B.ess(dich ? { kind: 'beta', w: [1], a: [c2.a], b: [c2.b] } : { kind: 'norm', w: [1], m: [c2.m], s: [c2.s], sigmaRef: sigmaRef }, 'moment') };
    } else {
      for (i = 0; i < hist.length; i++) if (!(hist[i].n > 0)) throw new Error('historical study needs n > 0');
      var hr = dich ? hierGrid(hist, bor) : hierNorm(hist, bor, sigmaRef);
      out.prior = hr.prior; out.info.tauMean = hr.tauMean;
    }
    out.essPrior = { moment: B.ess(out.prior, 'moment'), elir: B.ess(out.prior, 'elir') };
    return out;
  };

  /* ---------- prior and posterior summaries ---------- */
  B.moments = function (pr) {
    var mean = 0, m2 = 0, k, i;
    if (pr.kind === 'beta') { for (k = 0; k < pr.w.length; k++) { var t = pr.a[k] + pr.b[k], mk = pr.a[k] / t; mean += pr.w[k] * mk; m2 += pr.w[k] * (pr.a[k] * pr.b[k] / (t * t * (t + 1)) + mk * mk); } }
    else if (pr.kind === 'norm') { for (k = 0; k < pr.w.length; k++) { mean += pr.w[k] * pr.m[k]; m2 += pr.w[k] * (pr.s[k] * pr.s[k] + pr.m[k] * pr.m[k]); } }
    else { for (i = 0; i < pr.eta.length; i++) { var p = expit(pr.eta[i]), wi = pr.cw ? pr.cw[i] : pr.f[i] * pr.h; mean += wi * p; m2 += wi * p * p; } }
    return { mean: mean, sd: Math.sqrt(Math.max(m2 - mean * mean, 0)) };
  };
  // Prior effective sample size. 'moment': matches the mean and variance of the prior to a Beta (m(1-m)/v - 1) or to a normal (sigma^2 / v). 'elir': expected local information ratio of Neuenschwander et al. (2020), the prior information -(log f)'' over the Fisher information of one patient, averaged over the prior (on the mean scale; equals a + b for a Beta(a, b), and 1/s^2 times sigma^2 for a normal). The Morita (2008) method of RBesT is not implemented.
  B.ess = function (pr, method) {
    var mo = B.moments(pr), i, k, s = 0;
    if (method == null || method === 'moment') return pr.kind === 'norm' ? pr.sigmaRef * pr.sigmaRef / (mo.sd * mo.sd) : mo.mean * (1 - mo.mean) / (mo.sd * mo.sd) - 1;
    if (method !== 'elir') throw new Error('ESS method must be moment or elir');
    if (pr.kind === 'beta') {
      var N = 4000;
      for (i = 0; i < N; i++) {
        var p = (i + 0.5) / N, f = 0, f1 = 0, f2 = 0;
        for (k = 0; k < pr.w.length; k++) { var bk = pr.w[k] * M.betaPdf(p, pr.a[k], pr.b[k]), a = pr.a[k] - 1, b = pr.b[k] - 1, u = a / p - b / (1 - p); f += bk; f1 += bk * u; f2 += bk * (u * u - a / (p * p) - b / ((1 - p) * (1 - p))); }
        if (f > 1e-300) s += (f1 * f1 / f - f2) * p * (1 - p) / N;
      }
      return s;
    }
    if (pr.kind === 'norm') {
      var lo = Infinity, hi = -Infinity, NN = 8000;
      for (k = 0; k < pr.w.length; k++) { lo = Math.min(lo, pr.m[k] - 9 * pr.s[k]); hi = Math.max(hi, pr.m[k] + 9 * pr.s[k]); }
      var dx = (hi - lo) / NN;
      for (i = 0; i < NN; i++) {
        var x = lo + (i + 0.5) * dx, g = 0, g1 = 0, g2 = 0;
        for (k = 0; k < pr.w.length; k++) { var z = (x - pr.m[k]) / pr.s[k], nk = pr.w[k] * Math.exp(-0.5 * z * z) / (pr.s[k] * 2.5066282746310002), u2 = -z / pr.s[k]; g += nk; g1 += nk * u2; g2 += nk * (u2 * u2 - 1 / (pr.s[k] * pr.s[k])); }
        if (g > 1e-300) s += (g1 * g1 / g - g2) * dx;
      }
      return s * pr.sigmaRef * pr.sigmaRef;
    }
    // grid on the logit scale: i_p(p) s = -(g'' - (1 - 2p) g') / s with g = log f_eta - log s, s = p (1 - p)
    var n = pr.eta.length, h = pr.h, lf = new Float64Array(n);
    for (i = 0; i < n; i++) lf[i] = Math.log(Math.max(pr.f[i], 1e-300));
    for (i = 1; i < n - 1; i++) {
      var w2 = pr.f[i] * h; if (w2 < 1e-14) continue;
      var pp = expit(pr.eta[i]), ss = pp * (1 - pp), d1 = (lf[i + 1] - lf[i - 1]) / (2 * h), d2 = (lf[i + 1] - 2 * lf[i] + lf[i - 1]) / (h * h), gp = d1 - (1 - 2 * pp), gpp = d2 + 2 * ss;
      s += -(gpp - (1 - 2 * pp) * gp) / ss * w2;
    }
    return s;
  };
  B.cdf = function (pr, x) {
    var s = 0, k;
    if (pr.kind === 'beta') for (k = 0; k < pr.w.length; k++) s += pr.w[k] * M.betaCdf(x, pr.a[k], pr.b[k]);
    else if (pr.kind === 'norm') for (k = 0; k < pr.w.length; k++) s += pr.w[k] * M.Phi((x - pr.m[k]) / pr.s[k]);
    else throw new Error('cdf needs a beta or norm prior');
    return s;
  };
  B.quantile = function (pr, q) {
    var lo = pr.kind === 'beta' ? 0 : -1e6, hi = pr.kind === 'beta' ? 1 : 1e6, mid, it;
    if (pr.kind === 'norm') { lo = Infinity; hi = -Infinity; for (var k = 0; k < pr.w.length; k++) { lo = Math.min(lo, pr.m[k] - 12 * pr.s[k]); hi = Math.max(hi, pr.m[k] + 12 * pr.s[k]); } }
    for (it = 0; it < 100; it++) { mid = 0.5 * (lo + hi); if (B.cdf(pr, mid) < q) lo = mid; else hi = mid; }
    return 0.5 * (lo + hi);
  };
  // Exact posterior given n control patients with s successes (dichotomous) or mean s / n with sampling variance sig2 / n (continuous; sig2 is plugged in). Mixture weights are updated by the marginal likelihood of each component.
  B.posterior = function (pr, n, s, sig2) {
    var k, K = pr.w ? pr.w.length : 0, lw, mx = -Infinity, tot = 0, out;
    if (pr.kind === 'beta') {
      out = { kind: 'beta', w: [], a: [], b: [], inf: pr.inf }; lw = [];
      for (k = 0; k < K; k++) { out.a.push(pr.a[k] + s); out.b.push(pr.b[k] + n - s); lw.push(Math.log(pr.w[k]) + M.logBeta(out.a[k], out.b[k]) - M.logBeta(pr.a[k], pr.b[k])); mx = Math.max(mx, lw[k]); }
    } else if (pr.kind === 'norm') {
      out = { kind: 'norm', w: [], m: [], s: [], sigmaRef: pr.sigmaRef, inf: pr.inf }; lw = [];
      var v = n > 0 ? sig2 / n : Infinity, yb = n > 0 ? s / n : 0;
      for (k = 0; k < K; k++) {
        if (n > 0) { var prec = 1 / (pr.s[k] * pr.s[k]) + 1 / v; out.m.push((pr.m[k] / (pr.s[k] * pr.s[k]) + yb / v) / prec); out.s.push(Math.sqrt(1 / prec)); lw.push(Math.log(pr.w[k]) + normLogPdf(yb, pr.m[k], Math.sqrt(pr.s[k] * pr.s[k] + v))); }
        else { out.m.push(pr.m[k]); out.s.push(pr.s[k]); lw.push(Math.log(pr.w[k])); }
        mx = Math.max(mx, lw[k]);
      }
    } else {
      var NG = pr.eta.length, lp = new Float64Array(NG), cw = new Float64Array(NG), cum = new Float64Array(NG), i;
      for (i = 0; i < NG; i++) { var p = expit(pr.eta[i]); lp[i] = Math.log(Math.max(pr.f[i], 1e-300)) + s * Math.log(p) + (n - s) * Math.log(1 - p); if (lp[i] > mx) mx = lp[i]; }
      for (i = 0; i < NG; i++) { cw[i] = Math.exp(lp[i] - mx); tot += cw[i]; }
      var c = 0; for (i = 0; i < NG; i++) { cw[i] /= tot; c += cw[i]; cum[i] = c; }
      return { kind: 'grid', eta: pr.eta, h: pr.h, f: pr.f, cw: cw, cum: cum, inf: -1 };
    }
    for (k = 0; k < K; k++) { lw[k] = Math.exp(lw[k] - mx); tot += lw[k]; }
    for (k = 0; k < K; k++) out.w.push(lw[k] / tot);
    return out;
  };
  B.draw = function (post, rng) {
    var k, u;
    if (post.kind === 'grid') {
      var lo = 0, hi = post.cum.length - 1, mid; u = rng.u();
      while (hi - lo > 0) { mid = (lo + hi) >> 1; if (post.cum[mid] < u) lo = mid + 1; else hi = mid; }
      return expit(post.eta[lo] + (rng.u() - 0.5) * post.h);
    }
    u = rng.u(); k = 0; var cs = post.w[0];
    while (u > cs && k < post.w.length - 1) { k++; cs += post.w[k]; }
    return post.kind === 'beta' ? rng.beta(post.a[k], post.b[k]) : post.m[k] + post.s[k] * rng.normal();
  };
  // Replace the control arm of a fit by the borrowing posterior and attach diagnostics (res.borrow). Valid for models in which the control is independent of the dose arms (independent, independentBeta, ndlm family, hierarchical).
  B.apply = function (c, res, data, rng) {
    var K = c.K, ct = c.ctrl, n = data.n[ct], s = data.s[ct], b = c.borrow, sig2 = c.dich ? null : sigmaPosterior(c, data).sig2;
    var post = B.posterior(b.prior, n, s, sig2), mo = B.moments(post), j, J = res.draws ? res.nDraws : 0;
    res.mean[ct] = mo.mean; res.sd[ct] = mo.sd;
    if (res.thetaMean) { if (c.dich) { res.thetaMean[ct] = M.logit(mo.mean); res.thetaSd[ct] = mo.sd / (mo.mean * (1 - mo.mean)); } else { res.thetaMean[ct] = mo.mean; res.thetaSd[ct] = mo.sd; } }
    for (j = 0; j < J; j++) res.draws[j * K + ct] = B.draw(post, rng);
    var essPost = c.dich ? mo.mean * (1 - mo.mean) / (mo.sd * mo.sd) - 1 : sig2 / (mo.sd * mo.sd);
    res.borrow = { method: b.method, wInf: post.w && post.inf >= 0 ? post.w[post.inf] : null, essPost: essPost, nBorrowed: Math.max(0, essPost - n), nControl: n, essPrior: b.essPrior, tauMean: b.info.tauMean == null ? null : b.info.tauMean };
    return res;
  };

  /* ---------- Entry point ---------- */
  Mod.fit = function (c, data, rng, opts) {
    opts = opts || {};
    var J = opts.nDraws == null ? 1000 : opts.nDraws, res = fitModel(c, data, rng, opts, J);
    if (c.borrow) B.apply(c, res, data, rng);
    return res;
  };
  function fitModel(c, data, rng, opts, J) {
    switch (c.type) {
      case 'independent': return c.dich ? fitIndependentLogit(c, data, rng, J) : fitIndependentNormal(c, data, rng, J);
      case 'independentBeta': return fitIndependentBeta(c, data, rng, J);
      case 'logistic3': case 'sigmoid': case 'hierLogistic': return fitCurve(c, data, rng, J, opts.warm, opts.updateWarm);
      default: return fitGaussian(c, data, rng, J);
    }
  }
  Mod.fitDesign = function (design, data, rng, opts) { return Mod.fit(Mod.prepare(design), data, rng, opts); };

  NSim.models = Mod;
  if (typeof module !== 'undefined' && module.exports) module.exports = Mod;
})(typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : globalThis));
