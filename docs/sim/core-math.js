/* Copyright 2026 Nytel
 * MIT License. Permission is granted, free of charge, to any person obtaining a copy of this software to use, copy, modify, merge, publish and distribute it, provided this notice is kept. The software is provided "as is", without warranty of any kind.
 *
 * NSim.math: numerical core of the trial simulator. Plain script, one global (NSim), loads in a browser (script tag, Web Worker importScripts) and in Node (module.exports). No dependencies.
 *
 * Design
 * - Random numbers: mulberry32 uniform streams, one stream per simulated trial (streamFor), wrapped in an Rng object with normal, gamma, beta, binomial, Poisson and exponential samplers. Same seed gives the same numbers on every platform.
 * - Special functions: erf and the normal cdf by a positive-term series (|x| < 3) and a continued fraction (tails), so accuracy is near machine precision; Acklam quantile with a Halley step; Lanczos log-gamma; regularized incomplete beta by continued fraction.
 * - Small dense linear algebra (Cholesky) on row-major Float64Array matrices, a Laplace approximation helper, a 1-D and 2-D Simpson integrator, and an adaptive random-walk Metropolis sampler (Haario style adaptation during burn-in, fixed seed through the Rng) for nonlinear models.
 */
(function (root) {
  'use strict';
  var NSim = root.NSim = root.NSim || {};
  var M = {};
  var LN2PI = Math.log(2 * Math.PI), SQRT_PI = Math.sqrt(Math.PI);

  /* ---------- Normal distribution ---------- */
  function erfSeries(x) {
    var x2 = x * x, term = x, sum = x, n = 0;
    while (n < 300) { n++; term *= 2 * x2 / (2 * n + 1); sum += term; if (term < 1e-17 * sum) break; }
    return 2 / SQRT_PI * Math.exp(-x2) * sum;
  }
  function erfcCF(x) { // x >= 3
    var f = x;
    for (var k = 60; k >= 1; k--) f = x + (k / 2) / f;
    return Math.exp(-x * x) / (SQRT_PI * f);
  }
  M.erf = function (x) { var a = Math.abs(x), r = a < 3 ? erfSeries(a) : 1 - erfcCF(a); return x < 0 ? -r : r; };
  M.erfc = function (x) {
    if (x < 0) return 2 - M.erfc(-x);
    return x < 3 ? 1 - erfSeries(x) : erfcCF(x);
  };
  M.Phi = function (x) { return 0.5 * M.erfc(-x / Math.SQRT2); };
  M.PhiUpper = function (x) { return 0.5 * M.erfc(x / Math.SQRT2); };
  M.phi = function (x) { return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI); };
  var AC = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
  var AB = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
  var CC = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
  var CD = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];
  M.PhiInv = function (p) {
    if (p <= 0) return -Infinity; if (p >= 1) return Infinity;
    if (p > 0.5) return -M.PhiInv(1 - p);
    var x, q, r;
    if (p < 0.02425) { q = Math.sqrt(-2 * Math.log(p)); x = (((((CC[0] * q + CC[1]) * q + CC[2]) * q + CC[3]) * q + CC[4]) * q + CC[5]) / ((((CD[0] * q + CD[1]) * q + CD[2]) * q + CD[3]) * q + 1); }
    else { q = p - 0.5; r = q * q; x = (((((AC[0] * r + AC[1]) * r + AC[2]) * r + AC[3]) * r + AC[4]) * r + AC[5]) * q / (((((AB[0] * r + AB[1]) * r + AB[2]) * r + AB[3]) * r + AB[4]) * r + 1); }
    for (var i = 0; i < 2; i++) { var e = M.Phi(x) - p, u = e * Math.sqrt(2 * Math.PI) * Math.exp(x * x / 2); x = x - u / (1 + x * u / 2); }
    return x;
  };
  M.normCdf = function (x, mu, sd) { return M.Phi((x - mu) / sd); };
  M.normInv = function (p, mu, sd) { return mu + sd * M.PhiInv(p); };

  /* ---------- Gamma and beta functions ---------- */
  var LG = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  M.logGamma = function (x) {
    if (x < 0.5) return Math.log(Math.PI / Math.abs(Math.sin(Math.PI * x))) - M.logGamma(1 - x);
    x -= 1;
    var a = LG[0], t = x + 7.5;
    for (var i = 1; i < 9; i++) a += LG[i] / (x + i);
    return 0.5 * LN2PI + (x + 0.5) * Math.log(t) - t + Math.log(a);
  };
  M.logBeta = function (a, b) { return M.logGamma(a) + M.logGamma(b) - M.logGamma(a + b); };
  function betacf(a, b, x) {
    var qab = a + b, qap = a + 1, qam = a - 1, c = 1, d = 1 - qab * x / qap, h, m, m2, aa, del;
    if (Math.abs(d) < 1e-300) d = 1e-300; d = 1 / d; h = d;
    for (m = 1; m <= 500; m++) {
      m2 = 2 * m; aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < 1e-300) d = 1e-300; c = 1 + aa / c; if (Math.abs(c) < 1e-300) c = 1e-300; d = 1 / d; h *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < 1e-300) d = 1e-300; c = 1 + aa / c; if (Math.abs(c) < 1e-300) c = 1e-300; d = 1 / d; del = d * c; h *= del;
      if (Math.abs(del - 1) < 3e-16) break;
    }
    return h;
  }
  // Regularized incomplete beta function I_x(a, b) = Beta(a, b) cdf at x.
  M.betaCdf = function (x, a, b) {
    if (x <= 0) return 0; if (x >= 1) return 1;
    var bt = Math.exp(M.logGamma(a + b) - M.logGamma(a) - M.logGamma(b) + a * Math.log(x) + b * Math.log(1 - x));
    return x < (a + 1) / (a + b + 2) ? bt * betacf(a, b, x) / a : 1 - bt * betacf(b, a, 1 - x) / b;
  };
  M.betaPdf = function (x, a, b) { if (x <= 0 || x >= 1) return 0; return Math.exp((a - 1) * Math.log(x) + (b - 1) * Math.log(1 - x) - M.logBeta(a, b)); };
  // Beta quantile: safeguarded Newton on the cdf.
  M.betaInv = function (p, a, b) {
    if (p <= 0) return 0; if (p >= 1) return 1;
    var lo = 0, hi = 1, x = a / (a + b), i, f, pdf, xn;
    for (i = 0; i < 200; i++) {
      f = M.betaCdf(x, a, b) - p; if (f > 0) hi = x; else lo = x;
      pdf = M.betaPdf(x, a, b); xn = pdf > 0 ? x - f / pdf : (lo + hi) / 2;
      if (!(xn > lo && xn < hi)) xn = (lo + hi) / 2;
      if (Math.abs(xn - x) < 1e-14 * Math.max(x, 1e-300)) { x = xn; break; }
      x = xn;
    }
    return x;
  };
  M.expit = function (x) { return 1 / (1 + Math.exp(-x)); };
  M.logit = function (p) { return Math.log(p / (1 - p)); };

  // Numerically stable log(sum(exp(a[i]))) over the first n entries (default all).
  M.logsumexp = function (a, n) {
    n = n == null ? a.length : n;
    var m = -Infinity, i, s = 0;
    for (i = 0; i < n; i++) if (a[i] > m) m = a[i];
    if (m === -Infinity) return -Infinity;
    for (i = 0; i < n; i++) s += Math.exp(a[i] - m);
    return m + Math.log(s);
  };

  /* ---------- Seeded random streams ---------- */
  M.mulberry32 = function (seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  // Uniform stream for simulated trial (or sub-stream) s under master seed: hash mixing so neighbouring indices are unrelated.
  M.streamFor = function (seed, s) {
    var h = (seed ^ Math.imul(s + 1, 0x9E3779B1)) >>> 0;
    h = Math.imul(h ^ (h >>> 16), 0x85EBCA6B) >>> 0; h = Math.imul(h ^ (h >>> 13), 0xC2B2AE35) >>> 0; h = (h ^ (h >>> 16)) >>> 0;
    return M.mulberry32(h);
  };

  function Rng(u) { this.u = u; this.spare = NaN; }
  // Standard normal by the polar Box-Muller method (one spare value cached).
  Rng.prototype.normal = function () {
    if (this.spare === this.spare) { var s = this.spare; this.spare = NaN; return s; }
    var a, b, r, u = this.u;
    do { a = 2 * u() - 1; b = 2 * u() - 1; r = a * a + b * b; } while (r >= 1 || r === 0);
    var f = Math.sqrt(-2 * Math.log(r) / r); this.spare = b * f; return a * f;
  };
  Rng.prototype.exponential = function (rate) { return -Math.log(1 - this.u()) / (rate == null ? 1 : rate); };
  // Gamma(shape, 1) by Marsaglia and Tsang.
  Rng.prototype.gamma = function (shape) {
    if (shape < 1) return this.gamma(shape + 1) * Math.pow(this.u(), 1 / shape);
    var d = shape - 1 / 3, c = 1 / Math.sqrt(9 * d), x, v, u;
    for (;;) {
      do { x = this.normal(); v = 1 + c * x; } while (v <= 0);
      v = v * v * v; u = this.u();
      if (u < 1 - 0.0331 * x * x * x * x) return d * v;
      if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
    }
  };
  Rng.prototype.beta = function (a, b) { var x = this.gamma(a), y = this.gamma(b); return x / (x + y); };
  // Binomial: inversion for small n*p, otherwise exact beta splitting (Knuth) down to the inversion case.
  Rng.prototype.binomial = function (n, p) {
    if (n <= 0 || p <= 0) return 0; if (p >= 1) return n;
    var acc = 0, flip = false, n0 = n;
    if (p > 0.5) { p = 1 - p; flip = true; }
    for (;;) {
      if (n * p < 12 || n < 20) {
        var q = 1 - p, s = p / q, a = (n + 1) * s, r = Math.pow(q, n), u = this.u(), x = 0;
        while (u > r) { u -= r; x++; if (x > n) { x = n; break; } r *= (a / x - s); }
        acc += x; break;
      }
      var m = 1 + (n >> 1), X = this.beta(m, n + 1 - m);
      if (X >= p) { n = m - 1; p = p / X; }
      else { acc += m; n = n - m; p = (p - X) / (1 - X); }
      if (n <= 0 || p <= 0) { break; }
    }
    return flip ? (n0 - acc) : acc;
  };
  // Poisson: multiplication for small means, Hoermann PTRS for large.
  Rng.prototype.poisson = function (l) {
    if (l <= 0) return 0;
    if (l < 30) { var L = Math.exp(-l), k = 0, p = 1; do { k++; p *= this.u(); } while (p > L); return k - 1; }
    var slam = Math.sqrt(l), loglam = Math.log(l), b = 0.931 + 2.53 * slam, a = -0.059 + 0.02483 * b, invalpha = 1.1239 + 1.1328 / (b - 3.4), vr = 0.9277 - 3.6224 / (b - 2), U, V, us, kk;
    for (;;) {
      U = this.u() - 0.5; V = this.u(); us = 0.5 - Math.abs(U);
      kk = Math.floor((2 * a / us + b) * U + l + 0.43);
      if (us >= 0.07 && V <= vr) return kk;
      if (kk < 0 || (us < 0.013 && V > us)) continue;
      if (Math.log(V) + Math.log(invalpha) - Math.log(a / (us * us) + b) <= -l + kk * loglam - M.logGamma(kk + 1)) return kk;
    }
  };
  M.Rng = Rng;
  M.makeRng = function (seed) { return new Rng(M.mulberry32(seed)); };
  M.rngFor = function (seed, s) { return new Rng(M.streamFor(seed, s)); };

  /* ---------- Integration ---------- */
  M.integrate1D = function (f, a, b, n) {
    n = n || 200; if (n % 2) n++;
    var h = (b - a) / n, s = f(a) + f(b), i;
    for (i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
    return s * h / 3;
  };
  M.integrate2D = function (f, ax, bx, ay, by, nx, ny) {
    nx = nx || 60; ny = ny || 60; if (nx % 2) nx++; if (ny % 2) ny++;
    var hx = (bx - ax) / nx, hy = (by - ay) / ny, s = 0, i, j, wi, wj;
    for (i = 0; i <= nx; i++) {
      wi = (i === 0 || i === nx) ? 1 : (i % 2 ? 4 : 2);
      for (j = 0; j <= ny; j++) { wj = (j === 0 || j === ny) ? 1 : (j % 2 ? 4 : 2); s += wi * wj * f(ax + i * hx, ay + j * hy); }
    }
    return s * hx * hy / 9;
  };

  /* ---------- Dense linear algebra (row-major Float64Array, dimension d) ---------- */
  // Lower Cholesky factor, or null when A is not positive definite.
  M.chol = function (A, d) {
    var L = new Float64Array(d * d), i, j, k, s;
    for (i = 0; i < d; i++) {
      for (j = 0; j <= i; j++) {
        s = A[i * d + j];
        for (k = 0; k < j; k++) s -= L[i * d + k] * L[j * d + k];
        if (i === j) { if (!(s > 0)) return null; L[i * d + i] = Math.sqrt(s); } else L[i * d + j] = s / L[j * d + j];
      }
    }
    return L;
  };
  // Cholesky with a growing diagonal jitter, for positive semi-definite matrices.
  M.cholJitter = function (A, d) {
    var L = M.chol(A, d), i, t, tr = 0;
    if (L) return L;
    for (i = 0; i < d; i++) tr += A[i * d + i];
    var eps = 1e-12 * Math.max(tr / d, 1e-300);
    for (t = 0; t < 12; t++) {
      var B = Float64Array.from(A);
      for (i = 0; i < d; i++) B[i * d + i] += eps;
      L = M.chol(B, d); if (L) return L; eps *= 10;
    }
    return null;
  };
  M.solveLower = function (L, d, b) { var x = new Float64Array(d), i, k, s; for (i = 0; i < d; i++) { s = b[i]; for (k = 0; k < i; k++) s -= L[i * d + k] * x[k]; x[i] = s / L[i * d + i]; } return x; };
  M.solveUpperT = function (L, d, b) { var x = new Float64Array(d), i, k, s; for (i = d - 1; i >= 0; i--) { s = b[i]; for (k = i + 1; k < d; k++) s -= L[k * d + i] * x[k]; x[i] = s / L[i * d + i]; } return x; };
  M.cholSolve = function (L, d, b) { return M.solveUpperT(L, d, M.solveLower(L, d, b)); };
  M.cholLogDet = function (L, d) { var s = 0; for (var i = 0; i < d; i++) s += Math.log(L[i * d + i]); return 2 * s; };
  M.cholInverse = function (L, d) {
    var inv = new Float64Array(d * d), e = new Float64Array(d), j, i, col;
    for (j = 0; j < d; j++) { e.fill(0); e[j] = 1; col = M.cholSolve(L, d, e); for (i = 0; i < d; i++) inv[i * d + j] = col[i]; }
    return inv;
  };

  /* ---------- Laplace approximation ---------- */
  // Gaussian approximation to exp(logf) in d dimensions: Newton ascent with step halving, finite-difference derivatives.
  // Returns {mode, cov, logZ, converged}; logZ = log of the integral of exp(logf) under the approximation.
  M.laplace = function (logf, x0, opts) {
    opts = opts || {};
    var d = x0.length, x = Float64Array.from(x0), f = logf(x), it, i, j, maxIt = opts.maxIter || 100, tol = opts.tol || 1e-9, converged = false;
    if (!isFinite(f)) throw new Error('laplace: log density not finite at start');
    function grad(p) {
      var g = new Float64Array(d), h, xp, xm;
      for (var a = 0; a < d; a++) { h = 1e-5 * (1 + Math.abs(p[a])); xp = Float64Array.from(p); xm = Float64Array.from(p); xp[a] += h; xm[a] -= h; g[a] = (logf(xp) - logf(xm)) / (2 * h); }
      return g;
    }
    function hess(p) {
      var H = new Float64Array(d * d), f0 = logf(p), hs = new Float64Array(d), a, b, pp, pm, mp, mm;
      for (a = 0; a < d; a++) hs[a] = 1e-4 * (1 + Math.abs(p[a]));
      for (a = 0; a < d; a++) {
        for (b = 0; b <= a; b++) {
          if (a === b) { pp = Float64Array.from(p); pm = Float64Array.from(p); pp[a] += hs[a]; pm[a] -= hs[a]; H[a * d + a] = (logf(pp) - 2 * f0 + logf(pm)) / (hs[a] * hs[a]); }
          else {
            pp = Float64Array.from(p); pm = Float64Array.from(p); mp = Float64Array.from(p); mm = Float64Array.from(p);
            pp[a] += hs[a]; pp[b] += hs[b]; pm[a] += hs[a]; pm[b] -= hs[b]; mp[a] -= hs[a]; mp[b] += hs[b]; mm[a] -= hs[a]; mm[b] -= hs[b];
            H[a * d + b] = H[b * d + a] = (logf(pp) - logf(pm) - logf(mp) + logf(mm)) / (4 * hs[a] * hs[b]);
          }
        }
      }
      return H;
    }
    for (it = 0; it < maxIt; it++) {
      var g = grad(x), H = hess(x), negH = new Float64Array(d * d);
      for (i = 0; i < d * d; i++) negH[i] = -H[i];
      var L = M.cholJitter(negH, d); if (!L) break;
      var step = M.cholSolve(L, d, g), t = 1, xn = new Float64Array(d), fn = -Infinity, ok = false;
      for (j = 0; j < 30; j++) {
        for (i = 0; i < d; i++) xn[i] = x[i] + t * step[i];
        fn = logf(xn);
        if (isFinite(fn) && fn >= f - 1e-12) { ok = true; break; }
        t /= 2;
      }
      if (!ok) { converged = true; break; }
      var mx = 0; for (i = 0; i < d; i++) mx = Math.max(mx, Math.abs(t * step[i]) / (1 + Math.abs(x[i])));
      x = Float64Array.from(xn); f = fn;
      if (mx < tol) { converged = true; break; }
    }
    var H2 = hess(x), nH = new Float64Array(d * d);
    for (i = 0; i < d * d; i++) nH[i] = -H2[i];
    var L2 = M.cholJitter(nH, d);
    var cov = L2 ? M.cholInverse(L2, d) : null, logZ = L2 ? f + 0.5 * d * LN2PI - 0.5 * M.cholLogDet(L2, d) : NaN;
    return { mode: x, cov: cov, logZ: logZ, logf: f, converged: converged };
  };

  /* ---------- Adaptive random-walk Metropolis ---------- */
  // logpost(x: Float64Array) -> number. opts: rng (Rng, required), nDraws, burn, thin, cov0 (d*d proposal covariance start).
  // The proposal covariance adapts during burn-in (Haario: 2.38^2/d times the running covariance, plus a scale tuned to an acceptance rate near 0.25) and is frozen afterwards.
  // Returns {draws (nDraws*d, row-major), d, acc (post burn-in acceptance rate), x (last state), cov (sample covariance of draws), logp}.
  M.metropolis = function (logpost, x0, opts) {
    var d = x0.length, rng = opts.rng, nDraws = opts.nDraws || 1000, burn = opts.burn == null ? 500 : opts.burn, thin = opts.thin || 1;
    var x = Float64Array.from(x0), lp = logpost(x), i, k, it;
    if (!isFinite(lp)) throw new Error('metropolis: log posterior not finite at start');
    var cov = opts.cov0 ? Float64Array.from(opts.cov0) : (function () { var c = new Float64Array(d * d); for (var a = 0; a < d; a++) c[a * d + a] = 0.25; return c; })();
    var base = 2.38 * 2.38 / d, lam = 1, L = M.cholJitter(cov, d), prop = new Float64Array(d), z = new Float64Array(d);
    var mean = Float64Array.from(x), S = new Float64Array(d * d), cnt = 1, winAcc = 0, accPost = 0;
    var total = burn + nDraws * thin, draws = new Float64Array(nDraws * d), di = 0;
    function propose() {
      for (var a = 0; a < d; a++) z[a] = rng.normal();
      for (var a2 = 0; a2 < d; a2++) { var s = 0; for (var b = 0; b <= a2; b++) s += L[a2 * d + b] * z[b]; prop[a2] = x[a2] + Math.sqrt(lam) * s; }
    }
    for (it = 0; it < total; it++) {
      propose();
      var lp2 = logpost(prop), moved = false;
      if (lp2 > -Infinity && Math.log(rng.u()) < lp2 - lp) { for (k = 0; k < d; k++) x[k] = prop[k]; lp = lp2; moved = true; }
      if (it < burn) {
        if (moved) winAcc++;
        cnt++;
        var dl = new Float64Array(d);
        for (k = 0; k < d; k++) { dl[k] = x[k] - mean[k]; mean[k] += dl[k] / cnt; }
        for (i = 0; i < d; i++) for (k = 0; k < d; k++) S[i * d + k] += dl[i] * (x[k] - mean[k]);
        if ((it + 1) % 25 === 0) {
          var rate = winAcc / 25; winAcc = 0;
          lam *= rate < 0.1 ? 0.6 : (rate > 0.45 ? 1.5 : 1);
          if (it >= 49) {
            var C = new Float64Array(d * d);
            for (i = 0; i < d * d; i++) C[i] = base * S[i] / (cnt - 1);
            for (i = 0; i < d; i++) C[i * d + i] += 1e-8 * base * (1 + Math.abs(mean[i]));
            var Ln = M.cholJitter(C, d); if (Ln) L = Ln;
          }
        }
      } else {
        if (moved) accPost++;
        if ((it - burn + 1) % thin === 0) { for (k = 0; k < d; k++) draws[di * d + k] = x[k]; di++; }
      }
    }
    var m2 = new Float64Array(d), cv = new Float64Array(d * d), r;
    for (r = 0; r < nDraws; r++) for (k = 0; k < d; k++) m2[k] += draws[r * d + k] / nDraws;
    for (r = 0; r < nDraws; r++) for (i = 0; i < d; i++) for (k = 0; k < d; k++) cv[i * d + k] += (draws[r * d + i] - m2[i]) * (draws[r * d + k] - m2[k]) / Math.max(nDraws - 1, 1);
    return { draws: draws, d: d, acc: accPost / (nDraws * thin), x: x, cov: cv, logp: lp };
  };

  NSim.math = M;
  if (typeof module !== 'undefined' && module.exports) module.exports = M;
})(typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : globalThis));
