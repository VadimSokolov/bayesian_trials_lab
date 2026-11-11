---
id: kaplan-meier-estimator
name: Kaplan-Meier estimator
type: method
aliases: [Kaplan and Meier]
level: 1
summary: A model-free estimate of the survival function that handles censoring, and the curve every report of a time-to-event trial draws.
chapters: ['18']
home: sec-survival-traditional
sections: [sec-survival-traditional, sec-survival-nph-tests, sec-survival-nph, sec-survival-gamma]
prerequisites: [time-to-event-endpoint]
related: []
equations: []
functions: [surv_pwexp_S]
results: []
lab: []
cites: [kaplan1958nonparametric]
---

## What it is
The Kaplan-Meier estimate of $S(t)$ handles censoring without a model. [sec-survival-traditional] It is the curve every report of a time-to-event trial draws. [sec-survival-traditional]

## Why it matters
It displays the data before any treatment comparison. The comparison itself uses the log-rank test or the Cox model. [sec-survival-traditional]

## In the book
The Fleming-Harrington weights use the pooled Kaplan-Meier estimate: each event time is weighted by $S(t)^\rho\{1 - S(t)\}^\gamma$. [sec-survival-nph-tests] Survival curves in the book's scenarios overlap or cross early and separate late under a delayed effect. [sec-survival-nph]

## Pitfalls
Censoring must be noninformative for the likelihood results the book gives. [sec-survival-gamma] A single curve difference may hide a changing hazard ratio. [sec-survival-nph]

## Check yourself
- Q: Does the estimator need a parametric model? A: No. [sec-survival-traditional]
- Q: What happens to patients still event-free at cutoff? A: They are censored. [sec-survival-traditional]
