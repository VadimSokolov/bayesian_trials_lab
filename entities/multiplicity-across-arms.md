---
id: multiplicity-across-arms
name: Multiplicity across arms
type: concept
aliases: [master protocol multiplicity, family of hypotheses]
level: 2
summary: The question of which comparisons in a platform form one family for error control, with FDA not recommending adjustment across unrelated drugs.
chapters: ['20', '10']
home: 20/multiplicity-across-arms
sections: [20/multiplicity-across-arms, 20/fda, 20/ema, 20/bayesian-error-control-across-arms]
prerequisites: [familywise-error-rate, multiplicity]
related:
- {rel: governed-by, to: fda-master-protocols-guidance-2026}
- {rel: governed-by, to: ema-platform-reflection-paper}
- {rel: uses, to: shared-control-arithmetic}
- {rel: uses, to: hierarchical-model}
equations: []
functions: []
results: []
lab: [10-platform-trials]
cites: [collignon2020, fda_master_protocols_2026, ema_platform_rp_2026, fda_bayesian_2026]
---
## What it is

A traditional trial with several arms and one control usually controls the familywise error rate at 0.025 by Bonferroni, Holm or Dunnett's step-down procedure. A platform raises the question of what the family is. [20/multiplicity-across-arms] Five unrelated drugs sharing a control would never be put in a common family in separate trials. [20/multiplicity-across-arms]

## Why it matters

FDA "generally does not recommend the use of multiplicity adjustments to strongly control the probability of making at least one type I error across the multiple comparisons of different drugs". The expected total number of type I errors is the same in independent trials or one trial. [20/fda] The draft keeps the adjustment for several doses of one drug, combination components or several endpoints, with the family defined before the data. [20/fda]

## In the book

EMA notes that errors are correlated, that the chance of at least one false positive may fall while several rise, and that tightening each level would need thresholds stricter than Bonferroni, so it offers larger control groups. [20/ema] A Bayesian platform moves the question: each arm has a criterion $\Pr(\delta > a \mid \text{data}) > c$, calibrated by simulation. [20/bayesian-error-control-across-arms] With exchangeable arms, shrinkage multiplies information by $1/w$, as in the table where each posterior standard deviation falls from 0.30 to 0.20. [20/bayesian-error-control-across-arms] The multiple $1/w$ is an upper bound that treats the common mean as known, and an arm far from its neighbors is shrunk toward them. [20/bayesian-error-control-across-arms]

## Pitfalls

Shrinkage across arms is most defensible for one drug class, doses or related subgroups, and is not a substitute for the multiplicity decision across unrelated drugs. [20/bayesian-error-control-across-arms]

## Check yourself

- Q: Which comparisons does FDA still adjust? A: Doses, combination components and endpoints of one drug. [20/fda]
- Q: What does the shared control do to the error count? A: Same mean, but errors correlate. [20/fda] [20/ema]
