---
id: restricted-mean-survival-time
name: Restricted mean survival time
type: method
aliases: [RMST]
level: 3
summary: The area under the survival curve up to a horizon, whose difference is the average event-free time gained and needs no proportional hazards.
chapters: ['18']
home: sec-survival-nph
sections: [sec-survival-nph, sec-survival-nph-tests, sec-survival-regulation, 18/exercises]
prerequisites: [kaplan-meier-estimator, non-proportional-hazards]
related:
- {rel: alternative-to, to: hazard-ratio}
- {rel: alternative-to, to: weighted-log-rank-test}
- {rel: uses, to: estimand}
equations: [eq-sv-rmst]
functions: [surv_rmst, surv_nph_example]
results: []
lab: []
cites: [royston2011rmst, royston2013, uno2014, irwin1949expectation, karrison1987restricted, trinquart2016rmst]
---

## What it is
$$
\mathrm{RMST}(\tau) = \int_0^\tau S(t)\,dt,
$$
the area under the survival curve up to horizon $\tau$ (eq-sv-rmst). Its posterior is computed from draws of the survival curve. [sec-survival-nph]

## Why it matters
The RMST difference is the average event-free time gained within $\tau$, in months or years, the unit patients and payers think in, and it does not require proportional hazards. [sec-survival-nph]

## In the book
The control arm, with hazard 0.15 per year, has RMST 3.52 years over five years. [sec-survival-nph] In 54 oncology trials with reconstructed patient data, the hazard ratio gave on average a larger effect than the RMST ratio (average ratio 1.11, with substantial variation), and the authors recommend routine RMST reporting. [sec-survival-nph-tests]

## Pitfalls
It requires a horizon. The choice of $\tau$ is part of the estimand and must be fixed in the protocol. [sec-survival-nph] A supportive RMST analysis chosen after a blinded look at the pooled curve would draw a regulatory objection. [18/exercises]

## Check yourself
- Q: What does the RMST difference measure? A: Average event-free time gained within $\tau$. [sec-survival-nph]
