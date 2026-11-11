---
id: non-proportional-hazards
name: Non-proportional hazards
type: concept
aliases: [NPH]
level: 2
summary: A hazard ratio that changes over time, as with delayed or cure-type effects, which breaks the single hazard ratio summary.
chapters: ['18']
home: sec-survival-nph
sections: [sec-survival-nph, sec-survival-power-loss, sec-survival-nph-tests, sec-survival-regulation]
prerequisites: [proportional-hazards]
related:
- {rel: uses, to: restricted-mean-survival-time}
- {rel: uses, to: weighted-log-rank-test}
equations: [eq-sv-rmst]
functions: [surv_nph_example, surv_pwexp_S]
results: []
lab: []
cites: [alexander2018hazards, hernan2010hazards, roychoudhury2021nph, magirr2019modestly]
---

## What it is
Hazards are non-proportional when the hazard ratio changes over time, so no single hazard ratio summarizes the treatment effect. [sec-survival-nph] Immunotherapy trials have taught oncologists that hazards need not be proportional. A treatment may do nothing for months and then produce durable responses in a minority. Curves overlap or cross early and separate late. [sec-survival-nph] One response is to change the estimand to the restricted mean survival time up to a horizon $\tau$ (eq-sv-rmst): [sec-survival-nph]

$$
\mathrm{RMST}(\tau) = \int_0^\tau S(t)\,dt.
$$

## Why it matters
The log-rank test loses power, and the Cox hazard ratio depends on how long the trial runs. [sec-survival-nph] No FDA or ICH document, to the authors' knowledge, sets a required method. [sec-survival-regulation] A cross-pharma straw-man guidance treats the choice of test and the plausible scenarios as a design-stage matter settled by simulation. [sec-survival-nph-tests]

## In the book
Three Bayesian responses: a piecewise treatment effect with a hierarchical prior, a mixture cure model, and the RMST estimand. [sec-survival-nph] With 300 patients per arm, a control hazard of 0.15 per year and the same treated survival of 0.57 at five years, power is 0.68 under a constant hazard ratio of 0.75 and 0.55 under a two-year delay, with 287 events in both. [sec-survival-power-loss]
FDA practice is to accept prespecified alternatives to the log-rank test as sensitivity analyses and to scrutinize post hoc ones. [sec-survival-regulation]

## Pitfalls
Choosing weights or a horizon after seeing the curves invalidates the type I error. [sec-survival-power-loss] Agreement with the agency at a pre-submission meeting matters more than the method. [sec-survival-regulation]

## Check yourself
- Q: Name three Bayesian responses. A: Piecewise effect, mixture cure model, RMST. [sec-survival-nph]
