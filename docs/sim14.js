/* Bayesian Clinical Trials Lab, module 14: core simulation functions. Plain script, one global: Sim14. Loads in a browser or in Node (module.exports). No dependencies.
 *
 * Design of the simulator
 * - Every simulated trial s has its own seeded random stream. It fixes, for each possible patient, the outcome under control (U0), the outcome under treatment (U1) and an allocation uniform (A).
 *   The same streams feed every design and every threshold (common random numbers).
 * - A trial path is simulated once to the full sample size and recorded at each look. Stopping rules only truncate the path, so thresholds can be changed or searched without re-simulating.
 * - Designs 1 and 2 (fixed, group sequential) always randomize 1:1 and use a pooled-variance z statistic. Design 3 (Bayesian) uses the allocation chosen by the user.
 * - Posterior probability Pr(p1 > p0 + margin | data) uses a normal approximation to the difference of two Beta posteriors.
 */
(function (root) {
  'use strict';
  var Sim14 = {};

  /* ---------- Normal distribution ---------- */
  // Complementary error function (Numerical Recipes erfcc, relative error below 1.2e-7).
  Sim14.erfc = function (x) {
    var z = Math.abs(x), t = 1 / (1 + 0.5 * z);
    var r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
    return x >= 0 ? r : 2 - r;
  };
  // Standard normal cdf and upper tail.
  Sim14.Phi = function (x) { return x === 0 ? 0.5 : (x > 0 ? 1 - 0.5 * Sim14.erfc(x / Math.SQRT2) : 0.5 * Sim14.erfc(-x / Math.SQRT2)); };
  Sim14.PhiUpper = function (x) { return x === 0 ? 0.5 : (x > 0 ? 0.5 * Sim14.erfc(x / Math.SQRT2) : 1 - 0.5 * Sim14.erfc(-x / Math.SQRT2)); };
  Sim14.phi = function (x) { return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI); };
  // Standard normal quantile (Acklam rational approximation plus one Halley step).
  Sim14.PhiInv = function (p) {
    if (p <= 0) return -Infinity; if (p >= 1) return Infinity;
    var a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
    var b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
    var c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
    var d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];
    var pl = 0.02425, q, r, x;
    if (p < pl) { q = Math.sqrt(-2 * Math.log(p)); x = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    else if (p <= 1 - pl) { q = p - 0.5; r = q * q; x = (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1); }
    else { q = Math.sqrt(-2 * Math.log(1 - p)); x = -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    for (var i = 0; i < 2; i++) {
      var e = (p < 0.5 ? Sim14.Phi(x) - p : -(Sim14.PhiUpper(x) - (1 - p))), u = e * Math.sqrt(2 * Math.PI) * Math.exp(x * x / 2);
      x = x - u / (1 + x * u / 2);
    }
    return x;
  };

  /* ---------- Seeded random streams ---------- */
  // mulberry32 uniform generator.
  Sim14.mulberry32 = function (seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  // Stream for simulated trial s under a master seed (hash mixing so that neighboring trials are unrelated).
  Sim14.streamFor = function (seed, s) {
    var h = (seed ^ Math.imul(s + 1, 0x9E3779B1)) >>> 0;
    h = Math.imul(h ^ (h >>> 16), 0x85EBCA6B) >>> 0; h = Math.imul(h ^ (h >>> 13), 0xC2B2AE35) >>> 0; h = (h ^ (h >>> 16)) >>> 0;
    return Sim14.mulberry32(h);
  };

  /* ---------- Settings ---------- */
  Sim14.defaults = {
    p0: 0.30, p1: 0.45, N: 300, K: 4,
    alloc: 'fixed',            // 'fixed' (1:1) or 'ts' (Thompson sampling)
    cap: 0.8, burnIn: 40,      // Thompson: allocation probability clipped to [1 - cap, cap]; first burnIn patients alternate
    a0: 1, b0: 1, a1: 1, b1: 1, // Beta priors per arm
    margin: 0, c: 0.975, f: 0.05,
    nsim: 2000, seed: 20260801,
    gs: 'ld',                  // 'ld' Lan-DeMets O'Brien-Fleming type spending, 'obf' classical O'Brien-Fleming shape
    alpha: 0.025
  };
  Sim14.withDefaults = function (P) { var o = {}, k; for (k in Sim14.defaults) o[k] = Sim14.defaults[k]; for (k in (P || {})) if (P[k] !== undefined) o[k] = P[k]; return o; };

  // Patients per arm at each look (equally spaced), as an array of K integers; total enrolled at look k is twice this.
  Sim14.looks = function (P) {
    var M = Math.floor(P.N / 2), out = [], prev = 0;
    for (var k = 1; k <= P.K; k++) { var m = Math.max(prev + 1, Math.round(M * k / P.K)); out.push(m); prev = m; }
    return out;
  };

  /* ---------- Posterior probability and z statistic ---------- */
  // Log-gamma (Lanczos), used by the exact Beta comparison.
  var LG = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
  function lgamma(x) {
    var y = x, t = x + 5.5, ser = 1.000000000190015;
    t -= (x + 0.5) * Math.log(t);
    for (var j = 0; j < 6; j++) ser += LG[j] / ++y;
    return -t + Math.log(2.5066282746310005 * ser / x);
  }
  function lbeta(a, b) { return lgamma(a) + lgamma(b) - lgamma(a + b); }
  // Exact Pr(X > Y) for independent X ~ Beta(a, b), Y ~ Beta(c, d), all four parameters positive integers: a finite sum with min(a, b, c, d) terms.
  function betaGreater(a, b, c, d) {
    var flip = false, t;
    // Four symmetries: swap (X,Y) with complement, or reflect both arms; pick the one with the fewest terms.
    var m = Math.min(a, b, c, d);
    if (m === c) { t = a; a = c; c = t; t = b; b = d; d = t; flip = true; }        // P(X>Y) = 1 - P(Y>X)
    else if (m === b) { t = a; a = b; b = t; t = c; c = d; d = t; flip = true; }  // P(X>Y) = 1 - P(1-X > 1-Y)
    else if (m === d) { t = a; a = d; d = t; t = b; b = c; c = t; }                // P(X>Y) = P(1-Y > 1-X)
    // now a is the smallest: P(Beta(a,b) > Beta(c,d)) = sum_{i<a} B(c+i, b+d) / ((b+i) B(1+i, b) B(c, d))
    var lb = lbeta(c, d), s = 0;
    for (var i = 0; i < a; i++) s += Math.exp(lbeta(c + i, b + d) - lb - lbeta(1 + i, b)) / (b + i);
    s = Math.min(1, Math.max(0, s));
    return flip ? 1 - s : s;
  }
  Sim14.betaGreater = betaGreater;
  var EXACT_MAX = 30;  // use the exact sum when every Beta parameter is a whole number and the smallest is at most this
  // Pr(p1 > p0 + margin | data) with independent Beta(a, b) priors. Exact when margin is 0 and the counts are small; otherwise a normal approximation to the Beta difference.
  Sim14.ppDiff = function (x0, n0, x1, n1, P, approx) {
    var A0 = P.a0 + x0, B0 = P.b0 + n0 - x0, A1 = P.a1 + x1, B1 = P.b1 + n1 - x1;
    if (!approx && !P.margin && A0 % 1 === 0 && B0 % 1 === 0 && A1 % 1 === 0 && B1 % 1 === 0 && Math.min(A0, B0, A1, B1) <= EXACT_MAX) return betaGreater(A1, B1, A0, B0);
    var s0 = A0 + B0, s1 = A1 + B1;
    var m = A1 / s1 - A0 / s0, v = A0 * B0 / (s0 * s0 * (s0 + 1)) + A1 * B1 / (s1 * s1 * (s1 + 1));
    return Sim14.Phi((m - P.margin) / Math.sqrt(v));
  };
  // Pooled-variance z statistic for p1 - p0 (zero when the pooled rate is 0 or 1).
  Sim14.zPooled = function (x0, n0, x1, n1) {
    var ph = (x0 + x1) / (n0 + n1), se = Math.sqrt(ph * (1 - ph) * (1 / n0 + 1 / n1));
    return se > 0 ? (x1 / n1 - x0 / n0) / se : 0;
  };

  /* ---------- Group sequential boundaries ---------- */
  // Equally spaced looks at information fractions t_k = k / K. One-sided upper boundaries on the z scale, no futility bound.
  var NG = 1400, ZLO = -8;
  function gsGrid(b) { var zs = new Float64Array(NG + 1), h = (b - ZLO) / NG; for (var i = 0; i <= NG; i++) zs[i] = ZLO + i * h; return { zs: zs, h: h }; }
  function trapW(i, h) { return (i === 0 || i === NG) ? h / 2 : h; }
  // Density of Z_{k} (restricted to no earlier crossing) on grid2, from the density g on grid1 (Z_{k-1} below b_{k-1}).
  function gsDensity(g1, G1, G2, tPrev, tNow) {
    var d = tNow - tPrev, sd = Math.sqrt(d), sp = Math.sqrt(tPrev), sn = Math.sqrt(tNow), out = new Float64Array(NG + 1), i, j;
    for (j = 0; j <= NG; j++) {
      var s = 0, zn = G2.zs[j] * sn;
      for (i = 0; i <= NG; i++) { var u = (zn - G1.zs[i] * sp) / sd; s += g1[i] * trapW(i, G1.h) * Math.exp(-0.5 * u * u); }
      out[j] = s * sn / (sd * Math.sqrt(2 * Math.PI));
    }
    return out;
  }
  function gsCrossAt(g1, G1, tPrev, tNow, b) {
    var d = Math.sqrt(tNow - tPrev), sp = Math.sqrt(tPrev), sn = Math.sqrt(tNow), s = 0;
    for (var i = 0; i <= NG; i++) s += g1[i] * trapW(i, G1.h) * Sim14.PhiUpper((b * sn - G1.zs[i] * sp) / d);
    return s;
  }
  // Probability of first crossing at each look for given upper bounds (null hypothesis).
  Sim14.gsCrossProbs = function (bounds) {
    var K = bounds.length, probs = [1 - Sim14.Phi(bounds[0])], G = gsGrid(bounds[0]), g = new Float64Array(NG + 1);
    for (var i = 0; i <= NG; i++) g[i] = Sim14.phi(G.zs[i]);
    for (var k = 1; k < K; k++) {
      var tP = k / K, tN = (k + 1) / K;
      probs.push(gsCrossAt(g, G, tP, tN, bounds[k]));
      if (k < K - 1) { var G2 = gsGrid(bounds[k]); g = gsDensity(g, G, G2, tP, tN); G = G2; }
    }
    return probs;
  };
  Sim14.ldSpend = function (t, alpha) { return 2 * (1 - Sim14.Phi(Sim14.PhiInv(1 - alpha / 2) / Math.sqrt(t))); };
  // Lan-DeMets O'Brien-Fleming type spending: alpha*(t) = 2 - 2 Phi(z_{alpha/2} / sqrt t), alpha = one-sided level.
  Sim14.gsBoundsLD = function (K, alpha) {
    alpha = alpha || 0.025;
    var spend = [], k;
    for (k = 1; k <= K; k++) spend.push(k === K ? alpha : Sim14.ldSpend(k / K, alpha));
    var bounds = [Sim14.PhiInv(1 - spend[0])], G = gsGrid(bounds[0]), g = new Float64Array(NG + 1), i;
    for (i = 0; i <= NG; i++) g[i] = Sim14.phi(G.zs[i]);
    for (k = 1; k < K; k++) {
      var tP = k / K, tN = (k + 1) / K, target = spend[k] - spend[k - 1], lo = 0, hi = 12;
      for (i = 0; i < 50; i++) { var mid = (lo + hi) / 2; if (gsCrossAt(g, G, tP, tN, mid) > target) lo = mid; else hi = mid; }
      var b = (lo + hi) / 2; bounds.push(b);
      if (k < K - 1) { var G2 = gsGrid(b); g = gsDensity(g, G, G2, tP, tN); G = G2; }
    }
    return bounds;
  };
  // Classical O'Brien-Fleming boundaries: b_k = c sqrt(K / k), with c chosen so the total one-sided Type I error is alpha.
  Sim14.gsBoundsOBF = function (K, alpha) {
    alpha = alpha || 0.025;
    function shape(c) { var b = []; for (var k = 1; k <= K; k++) b.push(c * Math.sqrt(K / k)); return b; }
    function total(c) { var p = Sim14.gsCrossProbs(shape(c)), s = 0; for (var i = 0; i < p.length; i++) s += p[i]; return s; }
    var lo = 1.5, hi = 5, saved = NG;
    NG = 400; // coarser grid: the search needs many evaluations and 3 decimals are enough here
    try { for (var i = 0; i < 24; i++) { var mid = (lo + hi) / 2; if (total(mid) > alpha) lo = mid; else hi = mid; } } finally { NG = saved; }
    return shape((lo + hi) / 2);
  };
  Sim14.gsBounds = function (P) { return P.gs === 'obf' ? Sim14.gsBoundsOBF(P.K, P.alpha) : Sim14.gsBoundsLD(P.K, P.alpha); };

  /* ---------- Simulation of trial paths ---------- */
  // Store of recorded paths, one row per simulated trial and one column per look.
  Sim14.newStore = function (nsim, K) {
    var n = nsim * K, F = function () { return new Float64Array(n); };
    return { nsim: nsim, K: K, fz: F(), fpp: F(), fx0: F(), fx1: F(), bn0: F(), bn1: F(), bx0: F(), bx1: F(), bpp: F(), done: 0 };
  };
  var bufU0 = null, bufU1 = null, bufA = null;
  function buffers(n) {
    if (!bufU0 || bufU0.length < n) { bufU0 = new Float64Array(n); bufU1 = new Float64Array(n); bufA = new Float64Array(n); }
  }
  function drawStreams(P, s) {
    var n = 2 * Math.floor(P.N / 2), r = Sim14.streamFor(P.seed, s);
    buffers(n);
    for (var j = 0; j < n; j++) { bufU0[j] = r(); bufU1[j] = r(); bufA[j] = r(); }
    return n;
  }
  // Thompson sampling allocation probability to treatment given the data so far, clipped to [1 - cap, cap].
  function tsWeight(P, x0, n0, x1, n1) {
    var w = Sim14.ppDiff(x0, n0, x1, n1, { a0: P.a0, b0: P.b0, a1: P.a1, b1: P.b1, margin: 0 }, n0 + n1 > 20);  // exact for the first few patients, fast approximation after
    return Math.min(P.cap, Math.max(1 - P.cap, w));
  }
  // Simulate trials s0 .. s1 - 1 into the store.
  Sim14.fill = function (P, st, s0, s1) {
    var K = P.K, m = Sim14.looks(P), M = m[K - 1], s, k, j, t;
    for (s = s0; s < s1; s++) {
      drawStreams(P, s);
      var base = s * K, x0 = 0, x1 = 0;
      k = 0;
      for (j = 0; j < M; j++) {
        if (bufU0[j] < P.p0) x0++;
        if (bufU1[j] < P.p1) x1++;
        if (j + 1 === m[k]) {
          var i = base + k, n = m[k];
          st.fx0[i] = x0; st.fx1[i] = x1; st.fz[i] = Sim14.zPooled(x0, n, x1, n); st.fpp[i] = Sim14.ppDiff(x0, n, x1, n, P);
          k++;
        }
      }
      if (P.alloc !== 'ts') {
        for (k = 0; k < K; k++) { var q = base + k; st.bn0[q] = m[k]; st.bn1[q] = m[k]; st.bx0[q] = st.fx0[q]; st.bx1[q] = st.fx1[q]; st.bpp[q] = st.fpp[q]; }
      } else {
        var n0 = 0, n1 = 0, y0 = 0, y1 = 0, T = 2 * M; k = 0;
        for (t = 0; t < T; t++) {
          var arm = (t < P.burnIn || n0 === 0 || n1 === 0) ? (t & 1) : (bufA[t] < tsWeight(P, y0, n0, y1, n1) ? 1 : 0);  // an empty arm is never left empty
          if (arm === 1) { if (bufU1[n1] < P.p1) y1++; n1++; } else { if (bufU0[n0] < P.p0) y0++; n0++; }
          if (t + 1 === 2 * m[k]) {
            var i2 = base + k;
            st.bn0[i2] = n0; st.bn1[i2] = n1; st.bx0[i2] = y0; st.bx1[i2] = y1; st.bpp[i2] = Sim14.ppDiff(y0, n0, y1, n1, P);
            k++;
          }
        }
      }
    }
    st.done = Math.max(st.done, s1);
  };
  // One example trial, patient by patient: arrays t (enrolled), pp (posterior probability), arm, resp, plus the look indices. Uses the same streams as fill().
  Sim14.tracePath = function (P, s) {
    var m = Sim14.looks(P), M = m[P.K - 1], T = 2 * M;
    drawStreams(P, s);
    var out = { t: [], pp: [], arm: [], resp: [], lookT: m.map(function (v) { return 2 * v; }), lookPP: [] };
    var n0 = 0, n1 = 0, y0 = 0, y1 = 0, t, k = 0;
    for (t = 0; t < T; t++) {
      var arm = P.alloc === 'ts' ? ((t < P.burnIn || n0 === 0 || n1 === 0) ? (t & 1) : (bufA[t] < tsWeight(P, y0, n0, y1, n1) ? 1 : 0)) : (t & 1), r;
      if (arm === 1) { r = bufU1[n1] < P.p1 ? 1 : 0; y1 += r; n1++; } else { r = bufU0[n0] < P.p0 ? 1 : 0; y0 += r; n0++; }
      var pp = (n0 > 0 && n1 > 0) ? Sim14.ppDiff(y0, n0, y1, n1, P) : 0.5;
      out.t.push(t + 1); out.pp.push(pp); out.arm.push(arm); out.resp.push(r);
      if (t + 1 === 2 * m[k]) { out.lookPP.push(pp); k++; }
    }
    return out;
  };

  /* ---------- Stopping rules and summaries ---------- */
  // Bayesian rule on one row: returns [lookIndex, success]. Efficacy if pp > c; futility if pp < f at an interim look.
  function bayesStop(pp, base, K, c, f) {
    for (var k = 0; k < K; k++) {
      var p = pp[base + k];
      if (p > c) return [k, 1];
      if (k < K - 1 && p < f) return [k, 0];
    }
    return [K - 1, 0];
  }
  // Bayesian rule applied to an array of posterior probabilities, one per look: returns [lookIndex, success].
  Sim14.bayesStopRow = function (pps, c, f) { return bayesStop(pps, 0, pps.length, c, f); };
  // Fraction of trials declared successes by the Bayesian rule at threshold c (futility f). Fast path for calibration.
  Sim14.bayesSuccessRate = function (st, c, f) {
    var K = st.K, cnt = 0, n = st.done;
    for (var s = 0; s < n; s++) if (bayesStop(st.bpp, s * K, K, c, f)[1]) cnt++;
    return cnt / n;
  };
  // Summaries for the three designs. Returns {fixed, gs, bayes, gsBounds, truth}; each design has succ, EN, stopHist (fractions by look),
  // inf (mean patients on the inferior arm, NaN when p0 = p1), estAll, estSucc, estEarly (mean estimate among successes before the last look), est and ok arrays.
  Sim14.summarize = function (P, st, opts) {
    var K = st.K, n = st.done, m = Sim14.looks(P), c = opts && opts.c != null ? opts.c : P.c, f = opts && opts.f != null ? opts.f : P.f;
    var gsb = (opts && opts.gsBounds) || Sim14.gsBounds(P), z975 = Sim14.PhiInv(1 - P.alpha);
    var infArm = P.p1 === P.p0 ? -1 : (P.p1 < P.p0 ? 1 : 0), names = ['fixed', 'gs', 'bayes'], R = {}, d;
    names.forEach(function (nm) { R[nm] = { succ: 0, EN: 0, stopHist: new Array(K).fill(0), inf: 0, est: new Float64Array(n), ok: new Uint8Array(n), estAll: 0, estSucc: 0, estEarly: 0, nSucc: 0, nEarly: 0 }; });
    for (var s = 0; s < n; s++) {
      var base = s * K, k, ok, i;
      for (d = 0; d < 3; d++) {
        var nm = names[d], r = R[nm], n0, n1, x0, x1;
        if (nm === 'fixed') { k = K - 1; ok = st.fz[base + k] > z975 ? 1 : 0; }
        else if (nm === 'gs') { k = K - 1; ok = 0; for (i = 0; i < K; i++) if (st.fz[base + i] > gsb[i]) { k = i; ok = 1; break; } }
        else { var bs = bayesStop(st.bpp, base, K, c, f); k = bs[0]; ok = bs[1]; }
        var q = base + k;
        if (nm === 'bayes') { n0 = st.bn0[q]; n1 = st.bn1[q]; x0 = st.bx0[q]; x1 = st.bx1[q]; } else { n0 = n1 = m[k]; x0 = st.fx0[q]; x1 = st.fx1[q]; }
        var e = (n1 > 0 ? x1 / n1 : 0) - (n0 > 0 ? x0 / n0 : 0);
        r.succ += ok; r.EN += n0 + n1; r.stopHist[k]++; r.est[s] = e; r.ok[s] = ok; r.estAll += e;
        if (infArm >= 0) r.inf += infArm === 1 ? n1 : n0;
        if (ok) { r.estSucc += e; r.nSucc++; if (k < K - 1) { r.estEarly += e; r.nEarly++; } }
      }
    }
    names.forEach(function (nm) {
      var r = R[nm];
      r.succ /= n; r.EN /= n; r.estAll /= n; r.inf = infArm >= 0 ? r.inf / n : NaN;
      r.estSucc = r.nSucc ? r.estSucc / r.nSucc : NaN; r.estEarly = r.nEarly ? r.estEarly / r.nEarly : NaN;
      r.stopHist = r.stopHist.map(function (v) { return v / n; });
    });
    R.gsBounds = gsb; R.truth = P.p1 - P.p0; R.n = n;
    return R;
  };

  /* ---------- Calibration ---------- */
  // Smallest threshold c (to 4 decimals, rounded up) such that the Bayesian rule's success rate on the stored paths is at most alpha.
  // The store must hold paths simulated under the null (p1 = p0). Bisection on c; the success rate is non-increasing in c, so common random numbers keep it monotone.
  Sim14.calibrate = function (st, f, alpha) {
    alpha = alpha || 0.025;
    var lo = 0.5, hi = 1 - 1e-12, i;
    if (Sim14.bayesSuccessRate(st, lo, f) <= alpha) return { c: lo, err: Sim14.bayesSuccessRate(st, lo, f), iters: 0 };
    for (i = 0; i < 60; i++) { var mid = (lo + hi) / 2; if (Sim14.bayesSuccessRate(st, mid, f) <= alpha) hi = mid; else lo = mid; }
    var c = Math.min(1 - 1e-12, Math.ceil(hi * 1e4) / 1e4);
    while (c < 1 - 1e-12 && Sim14.bayesSuccessRate(st, c, f) > alpha) c = Math.min(1 - 1e-12, c + 1e-4);
    return { c: c, err: Sim14.bayesSuccessRate(st, c, f), iters: i };
  };
  // Run a complete simulation synchronously (used by Node tests and small page computations).
  Sim14.run = function (P) {
    P = Sim14.withDefaults(P);
    var st = Sim14.newStore(P.nsim, P.K); Sim14.fill(P, st, 0, P.nsim);
    return { P: P, st: st, res: Sim14.summarize(P, st) };
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = Sim14;
  root.Sim14 = Sim14;
})(typeof window !== 'undefined' ? window : globalThis);
