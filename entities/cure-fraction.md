---
id: cure-fraction
name: Cure fraction
type: concept
aliases: [cure model]
level: 3
summary: The share of treated patients effectively cured, modeled by a mixture in which the rest follow the control hazard.
chapters: ['18']
home: sec-survival-nph
sections: [sec-survival-nph, sec-survival-gamma]
prerequisites: [non-proportional-hazards]
related:
- {rel: alternative-to, to: restricted-mean-survival-time}
equations: []
functions: [surv_nph_example]
results: []
lab: []
cites: [boag1949cured, berkson1952, chen1999surviving]
---

## What it is
In a mixture cure model a fraction $\pi$ of treated patients are effectively cured and the rest follow the control hazard: $S_1(t) = \pi + (1-\pi)S_0(t)$. [sec-survival-nph] In the Berkson-Gage model the uncured have a survival function of their own, and following the control hazard is a special case. [sec-survival-nph] A Bayesian promotion-time cure model is a non-mixture alternative. [sec-survival-nph]

## Why it matters
The posterior for $\pi$ is the quantity a patient cares about. [sec-survival-nph]

## In the book
One scenario cures 20 percent of patients over a control arm with hazard 0.15 per year (median survival 4.6 years). [sec-survival-nph] In the cure-model scenario the five-year RMST difference is 0.30 years and the cumulative hazard ratio at 5 years is 0.73, against 0.51 and 0.60 for proportional hazards. [sec-survival-nph]

## Pitfalls
$\pi$ is identifiable only if follow-up is long enough for the curve to plateau. With immature data the prior dominates, and it must be stated. [sec-survival-nph]

## Check yourself
- Q: When is the cure fraction identifiable? A: When follow-up is long enough for the curve to plateau. [sec-survival-nph]
