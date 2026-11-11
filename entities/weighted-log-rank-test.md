---
id: weighted-log-rank-test
name: Weighted log-rank test
type: method
aliases: [weighted log rank]
level: 3
summary: A log-rank variant, with Fleming-Harrington weights or the MaxCombo maximum, that favors late events when an effect is delayed.
chapters: ['18']
home: sec-survival-nph-tests
sections: [sec-survival-power-loss, sec-survival-nph-tests]
prerequisites: [log-rank-test, delayed-treatment-effect]
related:
- {rel: alternative-to, to: restricted-mean-survival-time}
equations: []
functions: [fh_z]
results: []
lab: []
cites: [harrington1982class, fleming1991counting, lee2007versatility, lin2020alternative, magirr2019modestly]
---

## What it is
The Fleming-Harrington test multiplies each event time's contribution by $S(t)^\rho\{1 - S(t)\}^\gamma$, with $S$ the pooled Kaplan-Meier estimate. [sec-survival-nph-tests] $\rho = \gamma = 0$ is the ordinary log-rank test. $(0, 1)$ weights late events. [sec-survival-nph-tests] The MaxCombo test takes the largest of usually four standardized statistics with $\rho, \gamma \in \{0, 1\}$ and refers it to their multivariate normal distribution. [sec-survival-nph-tests]

## Why it matters
Under a delayed effect the weighted and MaxCombo tests have more power than the log-rank test. Under proportional hazards the order reverses: MaxCombo gives up a little, the late-weighted test more. [sec-survival-nph-tests] All three hold the level under identical curves. [sec-survival-nph-tests]

## In the book
Under a 2-year delay followed by hazard ratio 0.583, the log-rank test has power 0.55, against 0.80 for FH(0,1) and 0.74 for MaxCombo. [sec-survival-nph-tests] Under proportional hazards (HR 0.75) the figures are 0.67, 0.55 and 0.65 (a fresh simulation; the 0.68 on the non-proportional-hazards page differs by Monte Carlo error). [sec-survival-nph-tests] Under the null the levels are 0.024, 0.022 and 0.021. [sec-survival-nph-tests]

## Pitfalls
These test identical curves, and can reject when early harm and late benefit cancel, so significance need not mean patients did better. Modestly weighted tests were proposed to control that risk. [sec-survival-nph-tests] The primary test, weights and simulation go in the protocol before the curves are seen. [sec-survival-nph-tests]

## Check yourself
- Q: What weights does FH(0,1) favor? A: Late events. [sec-survival-nph-tests]
- Q: What does MaxCombo trade? A: A small power premium under proportional hazards for not knowing the shape. [sec-survival-nph-tests]
