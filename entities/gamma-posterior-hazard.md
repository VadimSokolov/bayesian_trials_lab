---
id: gamma-posterior-hazard
name: Gamma posterior for a hazard
type: method
aliases: [gamma posterior]
level: 2
summary: For a constant hazard, a Gamma(a, b) prior and d events in exposure T give a Gamma(a + d, b + T) posterior.
chapters: ['18']
home: sec-survival-gamma
sections: [sec-survival-gamma, sec-survival-nph]
prerequisites: [conjugate-prior, time-to-event-endpoint]
related: []
equations: []
functions: [surv_gamma_hazard]
results: []
lab: []
cites: [holford1976life, breslow1974covariance, kalbfleisch1978nonparametric, ibrahim2001]
---

## What it is
For a single arm with constant hazard $\lambda$, $d$ events in total follow-up $T$ give likelihood $\lambda^d e^{-\lambda T}$ whatever the censoring pattern, if censoring is noninformative. [sec-survival-gamma] With a $\mathrm{Gamma}(a, b)$ prior the posterior is $\mathrm{Gamma}(a + d, b + T)$. The prior is worth $a$ events and $b$ years of exposure. [sec-survival-gamma]

## Why it matters
Dividing time into intervals with constant hazards gives independent gamma terms per interval. A random walk on $\log\lambda_k$ smooths the hazard and lets sparse late intervals borrow from earlier ones. [sec-survival-gamma] This piecewise exponential model underlies most Bayesian time-to-event analyses. [sec-survival-gamma]

## In the book
A control arm has 60 events in 400 patient-years, with a vague Gamma(0.01, 0.01) prior. [sec-survival-gamma] Median survival under the exponential model is $\log 2/\lambda$. Its posterior mean is not the plug-in $\log 2/0.15$, because the median is a reciprocal of the hazard, and its interval is asymmetric. [sec-survival-gamma] The posterior is transformed directly, with no delta method. [sec-survival-gamma] The posterior mean hazard is 0.150 (95% interval 0.114 to 0.190), and the posterior mean median is 4.7 years against the plug-in 4.62, with interval 3.6 to 6.1. [sec-survival-gamma]

## Pitfalls
A constant hazard is rarely realistic over years of follow-up. [sec-survival-gamma]

## Check yourself
- Q: What is the posterior after d events in T years of exposure with a Gamma(a, b) prior? A: Gamma(a + d, b + T). [sec-survival-gamma]
