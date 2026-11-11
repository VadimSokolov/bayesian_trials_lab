---
id: indirect-comparison
name: Indirect comparison
type: method
aliases: [tirzepatide chain, chained comparison, imputed placebo]
level: 2
summary: Estimating an effect against a common comparator by adding log effects from two trials, with a power-prior weight to discount the second.
chapters: ['19']
home: sec-borrowing-chain
sections: [sec-borrowing-chain, sec-borrowing-power]
prerequisites: [hazard-ratio, power-prior]
related:
- {rel: part-of, to: bayesian-borrowing}
equations: [eq-chain]
functions: []
results: []
lab: [09-adaptive-bayesian]
cites: [nicholls2025surpasscvot, gerstein2019dulaglutide, sattar2026imputed]
---
## What it is

No trial compared tirzepatide with placebo. SURPASS-CVOT compared tirzepatide with dulaglutide and REWIND compared dulaglutide with placebo [sec-borrowing-chain]. On the log scale the effects add:

$$
\log\mathrm{HR}_{T:P}=\log\mathrm{HR}_{T:D}+\log\mathrm{HR}_{D:P},
$$

with variances adding if the estimates are independent (eq-chain). [sec-borrowing-chain]

## Why it matters

A guideline committee asks how much tirzepatide lowers cardiovascular risk against no incretin therapy. The chain assembles an answer no trial gives. [sec-borrowing-chain]

## In the book

SURPASS-CVOT gave a hazard ratio of 0.92 (95.3% CI 0.83 to 1.01) and REWIND 0.88 (95% CI 0.79 to 0.99). At $a_0=1$ the chain gives 0.81 with interval 0.70 to 0.94. Dividing the REWIND variance by $a_0$ widens the interval to 0.67 to 0.98 at $a_0=0.5$ and 0.63 to 1.04 at $a_0=0.25$, so the benefit survives halving the weight but not quartering it. [sec-borrowing-chain] A published analysis used propensity-score adjustment to select 2055 of 9901 REWIND participants and found a hazard ratio of 0.72 (95% CI 0.55 to 0.94). [sec-borrowing-chain]

## Pitfalls

The chain assumes the dulaglutide effect in REWIND holds in the SURPASS-CVOT population, and the populations differ. The discount widens the interval and leaves the center, so it is the wrong correction if the effect differs. [sec-borrowing-chain] Neither analysis is a randomized comparison with placebo, and it supports a label discussion, not a primary efficacy claim. [sec-borrowing-chain]

## Check yourself

- Q: Predict the chained hazard ratio from 0.92 and 0.88. A: About 0.81. [sec-borrowing-chain]
- Q: What does lowering $a_0$ do to the estimate? A: Nothing, it only widens the interval. [sec-borrowing-chain]
