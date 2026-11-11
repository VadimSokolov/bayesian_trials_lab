/* Copyright 2026 Nytel. MIT License. Tests for NSim.math. */
'use strict';
const { test, assert, near } = require('./harness.js');
const M = require('../core-math.js');

function moments(f, n) { let s = 0, s2 = 0; for (let i = 0; i < n; i++) { const x = f(); s += x; s2 += x * x; } const m = s / n; return { m: m, v: (s2 / n - m * m) * n / (n - 1) }; }
function checkSampler(name, f, mean, variance, n) {
  const r = moments(f, n);
  near(r.m, mean, 5 * Math.sqrt(variance / n), name + ' mean');
  near(r.v, variance, 0.06 * variance, name + ' variance');
}

test('normal cdf and quantile', () => {
  near(M.Phi(1.96), 0.9750021048517795, 1e-12); near(M.Phi(0), 0.5, 1e-15); near(M.Phi(-1), 0.15865525393145707, 1e-12);
  near(M.PhiUpper(5), 2.866515718791939e-7, 1e-18); near(M.PhiInv(0.975), 1.959963984540054, 1e-9); near(M.PhiInv(1e-8), -5.612001244174789, 1e-8);
  for (const p of [0.001, 0.2, 0.5, 0.9, 0.999999]) near(M.Phi(M.PhiInv(p)), p, 1e-12, 'roundtrip ' + p);
  near(M.normCdf(3, 1, 2), M.Phi(1), 1e-15); near(M.normInv(0.5, 3, 2), 3, 1e-12);
});
test('log-gamma, beta cdf and quantile', () => {
  near(M.logGamma(5), Math.log(24), 1e-12); near(M.logGamma(0.5), 0.5 * Math.log(Math.PI), 1e-12); { let lg = 0.5 * Math.log(Math.PI); for (let k = 0; k < 30; k++) lg += Math.log(k + 0.5); near(M.logGamma(30.5), lg, 1e-9); }
  near(M.betaCdf(0.3, 2, 5), 0.579825, 1e-9); near(M.betaCdf(0.5, 13, 9), 1 - 0.8083448410034, 1e-9);
  near(M.betaCdf(0.2, 3.5, 1.2), 1 - M.betaCdf(0.8, 1.2, 3.5), 1e-12);
  for (const [p, a, b] of [[0.025, 13, 9], [0.5, 0.5, 0.5], [0.99, 2, 30]]) near(M.betaCdf(M.betaInv(p, a, b), a, b), p, 1e-10, 'betaInv');
  near(M.logsumexp([1000, 1000]), 1000 + Math.log(2), 1e-12); assert(M.logsumexp([-Infinity, -Infinity]) === -Infinity);
});
test('samplers: means and variances', () => {
  const r = M.makeRng(12345), n = 60000;
  checkSampler('normal', () => r.normal(), 0, 1, n);
  checkSampler('gamma(2.5)', () => r.gamma(2.5), 2.5, 2.5, n); checkSampler('gamma(0.4)', () => r.gamma(0.4), 0.4, 0.4, n);
  checkSampler('beta(2,5)', () => r.beta(2, 5), 2 / 7, 10 / (49 * 8), n);
  checkSampler('binom(10,.3)', () => r.binomial(10, 0.3), 3, 2.1, n); checkSampler('binom(500,.4)', () => r.binomial(500, 0.4), 200, 120, n);
  checkSampler('binom(100,.9)', () => r.binomial(100, 0.9), 90, 9, n); checkSampler('binom(2000,.01)', () => r.binomial(2000, 0.01), 20, 19.8, n);
  checkSampler('poisson(4)', () => r.poisson(4), 4, 4, n); checkSampler('poisson(80)', () => r.poisson(80), 80, 80, n);
  checkSampler('exp(2)', () => r.exponential(2), 0.5, 0.25, n);
});
test('streams: same seed identical, different index independent', () => {
  const a = M.streamFor(7, 3), b = M.streamFor(7, 3), c = M.streamFor(7, 4);
  let same = true, diff = false;
  for (let i = 0; i < 100; i++) { const x = a(), y = b(), z = c(); if (x !== y) same = false; if (x !== z) diff = true; }
  assert(same && diff);
  let s = 0, s2 = 0, n = 20000; const u = M.streamFor(1, 1); for (let i = 0; i < n; i++) { const x = u(); s += x; s2 += x * x; }
  near(s / n, 0.5, 0.01); near(s2 / n - 0.25, 1 / 12, 0.005);
});
test('integrators', () => {
  near(M.integrate1D(Math.sin, 0, Math.PI, 200), 2, 1e-8); near(M.integrate2D((x, y) => x * y, 0, 1, 0, 1, 20, 20), 0.25, 1e-12);
  near(M.integrate1D(M.phi, -8, 8, 400), 1, 1e-9);
});
test('cholesky and Laplace approximation', () => {
  const A = Float64Array.from([4, 2, 2, 3]), L = M.chol(A, 2);
  near(L[0] * L[0], 4, 1e-12); near(L[2] * L[0], 2, 1e-12); near(L[2] * L[2] + L[3] * L[3], 3, 1e-12);
  const x = M.cholSolve(L, 2, [1, 2]); near(4 * x[0] + 2 * x[1], 1, 1e-12); near(2 * x[0] + 3 * x[1], 2, 1e-12);
  const S = [[2, 0.6], [0.6, 1]], det = 2 - 0.36, Sinv = [[1 / det, -0.6 / det], [-0.6 / det, 2 / det]], mu = [1, -2];
  const lp = p => { const a = p[0] - mu[0], b = p[1] - mu[1]; return -0.5 * (a * (Sinv[0][0] * a + Sinv[0][1] * b) + b * (Sinv[1][0] * a + Sinv[1][1] * b)); };
  const r = M.laplace(lp, [0, 0]);
  near(r.mode[0], 1, 1e-5); near(r.mode[1], -2, 1e-5); near(r.cov[0], 2, 1e-3); near(r.cov[1], 0.6, 1e-3); near(r.cov[3], 1, 1e-3);
  near(r.logZ, Math.log(2 * Math.PI) + 0.5 * Math.log(det), 1e-3);
});
test('Metropolis: correlated Gaussian target, fixed seed reproducible', () => {
  const Sinv = [[1 / 1.64, -0.6 / 1.64], [-0.6 / 1.64, 2 / 1.64]];
  const lp = p => { const a = p[0] - 1, b = p[1] + 2; return -0.5 * (a * (Sinv[0][0] * a + Sinv[0][1] * b) + b * (Sinv[1][0] * a + Sinv[1][1] * b)); };
  const run = () => M.metropolis(lp, [0, 0], { rng: M.makeRng(99), nDraws: 8000, burn: 1000, thin: 2 });
  const r = run(), r2 = run(); assert(r.draws[100] === r2.draws[100] && r.draws[7999] === r2.draws[7999], 'reproducible');
  let m0 = 0, m1 = 0, n = 8000; for (let i = 0; i < n; i++) { m0 += r.draws[2 * i] / n; m1 += r.draws[2 * i + 1] / n; }
  near(m0, 1, 0.15); near(m1, -2, 0.1); near(r.cov[0], 2, 0.4); near(r.cov[3], 1, 0.2); assert(r.acc > 0.1 && r.acc < 0.6, 'acceptance ' + r.acc);
});
