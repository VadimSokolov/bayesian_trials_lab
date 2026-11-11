---
id: trailblazer-alz-2
name: TRAILBLAZER-ALZ 2
type: trial
aliases: []
level: 2
summary: A donanemab trial in early Alzheimer's disease with a biomarker-guided treatment duration and baseline tau strata, used to show how a Bayesian analysis could handle prespecified features.
chapters: ['21']
home: sec-cases-alz
sections: [21/the-trial-as-conducted-2, 21/two-prespecified-design-features, 21/what-a-dmc-and-a-regulator-would-have-had-to-accept-2]
prerequisites: [subgroup-analysis, estimand, hierarchical-model]
related:
- {rel: illustrates, to: prespecification}
- {rel: illustrates, to: shrinkage}
- {rel: illustrates, to: adaptive-enrichment}
equations: []
functions: []
results: []
lab: [15-reading-bayesian-trials]
cites: [sims2023donanemab]
---

## What it is
TRAILBLAZER-ALZ 2 randomized 1,736 participants with early symptomatic Alzheimer's disease to donanemab or placebo, with efficacy measured at 18 months (76 weeks). [21/the-trial-as-conducted-2]
It reported a 35 percent slowing of decline on the integrated Alzheimer's Disease Rating Scale in the prespecified low and medium tau population of 1,182 participants, and 22 percent in the combined population of 1,736. [21/the-trial-as-conducted-2]

## Why it matters
It is a different kind of case from SELECT: the traditional apparatus handled two prespecified features, and regulators accept them when specified in advance. [21/what-a-dmc-and-a-regulator-would-have-had-to-accept-2]

## In the book
The first feature is treatment duration guided by a biomarker: participants completed donanemab once they reached a prespecified level of amyloid plaque clearance, and 52 percent of the low and medium tau participants had reached it by one year. [21/two-prespecified-design-features]
The trial therefore estimates the effect of the strategy "stop when cleared" against placebo, and the estimand has to say so. [21/two-prespecified-design-features]
The second is baseline tau stratification, which does not change with accumulating results and is not an adaptive feature. [21/two-prespecified-design-features]
A prespecified hierarchical model could estimate effects in both strata, 1,182 in the low and medium tau stratum and 552 in the high tau stratum, with borrowing. [21/two-prespecified-design-features]
The weight on a stratum's own estimate is $\tau_b^2/(\tau_b^2 + s^2)$, so smaller strata and smaller between-stratum variance mean more shrinkage; the table in the book is illustrative, not the trial's estimates. [21/two-prespecified-design-features]

## Pitfalls
A hierarchical model that shrinks a null stratum toward a positive pooled effect raises the false-positive rate for that stratum. [21/what-a-dmc-and-a-regulator-would-have-had-to-accept-2]
Such a model needs a prespecified model, a rationale for exchangeability and a simulation of type I error where the effect is in one stratum only. [21/what-a-dmc-and-a-regulator-would-have-had-to-accept-2]

## Check yourself
- Q: Is the tau stratification an adaptation? A: No, tau is measured at baseline and the strata do not change with results. [21/two-prespecified-design-features]
- Q: What does a regulator worry about for the biomarker-guided duration? A: The estimand and the integrity of blinding. [21/what-a-dmc-and-a-regulator-would-have-had-to-accept-2]
