---
id: retatrutide-triumph-3
name: TRIUMPH-3
type: trial
aliases: [retatrutide]
level: 2
summary: A retatrutide trial in obesity with cardiovascular disease whose imprecise cardiovascular interval the book turns into posteriors under flat, discounted SELECT and skeptical priors.
chapters: ['21']
home: 21/retatrutide-in-triumph-3
sections: [sec-cases-current]
prerequisites: [normal-approximation-posterior, skeptical-prior]
related:
- {rel: uses, to: bayesian-borrowing}
- {rel: uses, to: power-prior}
- {rel: illustrates, to: prior-data-conflict}
equations: []
functions: [normal_update]
results: []
lab: [15-reading-bayesian-trials]
cites: [lilly_triumph23_2026, lincoff2023semaglutide]
---

## What it is
TRIUMPH-3 is an 80-week randomized phase 3 trial in obesity with established cardiovascular disease, with 1,946 participants in the registry and a registered primary outcome of percent change in body weight. [sec-cases-current]
Lilly announced topline results on 23 July 2026. [sec-cases-current]

## Why it matters
A class prior turns an imprecise cardiovascular interval into a posterior. [sec-cases-current]

## In the book
The announcement reports 44 five-component events on pooled retatrutide against 52 on placebo, hazard ratio 0.82 with interval 0.55 to 1.22. [21/retatrutide-in-triumph-3]
The three-component hazard ratio in the same announcement was 1.12 (0.64 to 1.96). [21/retatrutide-in-triumph-3]
The class prior is SELECT, hazard ratio 0.80 (0.72 to 0.90), discounted by inflating its variance: doubling for half weight, quadrupling for quarter weight. [21/retatrutide-in-triumph-3]
For contrast the book uses a skeptical normal prior with standard deviation 0.15 and a flat prior. [21/retatrutide-in-triumph-3]
The disagreement among the rows is the scientific question: whether a class effect measured with a three-component outcome in semaglutide carries over to a triple agonist and a five-component outcome. [21/retatrutide-in-triumph-3]

## Pitfalls
With 96 events in all, none of the rows is a confirmatory result. [21/retatrutide-in-triumph-3]
The three-component hazard ratio above 1 is a reason to give the class prior a low weight, not to hide it. [21/retatrutide-in-triumph-3]

## Check yourself
- Q: How is half weight for the SELECT prior implemented? A: By doubling its variance. [21/retatrutide-in-triumph-3]
- Q: Does the frequentist reading that benefit is not established conflict with the Bayesian one? A: No, it is a correct statement about the interval, and the Bayesian reading adds how much depends on the prior. [21/retatrutide-in-triumph-3]
