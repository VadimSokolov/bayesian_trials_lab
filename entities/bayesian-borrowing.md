---
id: bayesian-borrowing
name: Bayesian borrowing
type: concept
aliases: [borrowing information, dynamic borrowing, static borrowing]
level: 2
summary: Using external or earlier data in the analysis of a trial through a prior, with the amount of borrowing fixed in advance or adjusted by the data.
chapters: ['19', '8']
home: sec-borrowing-idea
sections: [sec-borrowing-drift, sec-borrowing, sec-borrowing-traditional, sec-borrowing-sidebyside, sec-borrowing-guide, sec-borrowing-keypoints, sec-borrowing-external]
prerequisites: [prior-distribution, effective-sample-size]
related:
- {rel: generalizes, to: power-prior}
- {rel: generalizes, to: commensurate-prior}
- {rel: generalizes, to: meta-analytic-predictive-prior}
- {rel: contrasts-with, to: historical-control}
- {rel: uses, to: hierarchical-model}
- {rel: governed-by, to: fda-bayesian-draft-guidance-2026}
equations: []
functions: [borrow_priors, borrow_reject_prob, borrow_ess_robust]
results: []
lab: [09-adaptive-bayesian, 16-bayesian-protocol]
cites: [fda_bayesian_2026, pocock1976, ibrahim2000]
---
## What it is

Bayesian borrowing puts earlier data into the prior for the current trial's parameter. Borrowing a whole historical control arm of $n_h$ patients is a prior with effective sample size $n_h$ [[effective-sample-size|(effective sample size)]]. [sec-borrowing-idea]

The methods differ in what they assume about the current control rate $p_c$ and the historical rate $p_h$: they are equal (full pooling), close with a fixed discount (power prior), draws from a common distribution (hierarchical model, MAP prior), either like $p_h$ or unrelated (mixture priors), or tied by a parameter the data update (commensurate priors, normalized power priors). [sec-borrowing-idea] The first two are static and the last three are dynamic, and FDA uses the same split. [sec-borrowing-idea]

## Why it matters

Every patient who need not be randomized to control can be treated, or the trial can finish sooner. [sec-borrowing] Done well, borrowing recovers precision a small trial cannot supply, and done badly it can introduce substantial bias that the small trial cannot reveal. [sec-borrowing]

## In the book

A traditional trial uses prior data only before it starts, to choose the alternative, the control rate and the sample size, and then ignores it in the analysis. [sec-borrowing-traditional] The Bayesian design lets prior data enter the analysis through a prior on the control parameter. [sec-borrowing-sidebyside] REBYOTA and OPTIMIZER Smart are the two regulatory cases of dynamic and static borrowing. [sec-borrowing-idea]
In the book's simulation, 60 treated and 30 control patients borrow a historical arm of 100 patients with 30 responders: full pooling raises power from 0.43 to 0.79, and matching that without borrowing would take roughly 170 control patients instead of 30. [sec-borrowing-drift]

## Pitfalls

Borrowing is not free: the price is measurable by simulation, and the regulator will ask to see it before agreeing to the design. [sec-borrowing] The methods decide how much to rely on external data once it is admissible, and do not make inadmissible data admissible. [sec-borrowing-external]

## Check yourself

- Q: Which of the five relationships between $p_c$ and $p_h$ are static? A: Full pooling and a power prior with a fixed discount. [sec-borrowing-idea]
- Q: What is the effective sample size of borrowing a whole historical arm of $n_h$ patients? A: $n_h$. [sec-borrowing-idea]
