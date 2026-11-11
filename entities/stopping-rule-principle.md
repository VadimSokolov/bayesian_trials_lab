---
id: stopping-rule-principle
name: Stopping rule principle
type: principle
aliases: [posterior does not depend on the stopping rule, likelihood principle]
level: 2
summary: The posterior after stopping at a data-dependent time equals the posterior from a sample of that size fixed in advance, so a Bayesian may look as often as desired.
chapters: ['11', '6']
home: 11/the-posterior-does-not-depend-on-the-stopping-rule
sections: [11/the-posterior-does-not-depend-on-the-stopping-rule, 11/traditional-and-bayesian-monitoring-side-by-side, sec-mult-selected, 11/why-repeated-testing-at-a-fixed-level-fails]
prerequisites: [posterior-distribution, likelihood, interim-analysis]
related:
- {rel: contrasts-with, to: group-sequential-design}
- {rel: contrasts-with, to: calibration}
- {rel: critiques, to: forking-paths}
equations: []
functions: []
results: []
lab: [07-interim-looks]
cites: [edwards1963bayesian, cornfield1966sequential, berry1987interim, berger1988likelihood, armitage1969]
---

## What it is

Let the trial stop at a random time $T$ determined by a rule that depends only on the data so far. The likelihood includes the probability that the rule would have continued until $T$ and stopped there. That factor depends only on the data, not on $\theta$, so it cancels in the posterior. [11/the-posterior-does-not-depend-on-the-stopping-rule]

The posterior after stopping at $T$ is exactly the one computed had the sample size been fixed at $T$ in advance. This is the likelihood principle in sequential form. [11/the-posterior-does-not-depend-on-the-stopping-rule]

## Why it matters

It is the foundation of the claim "you may look as often as you like". A frequentist $p$-value is a tail probability over other data sets that might have been seen, and which are possible depends on the stopping rule. [11/the-posterior-does-not-depend-on-the-stopping-rule]

## In the book

A trial ends with 15 responders among 20 patients and null response probability one half. Under a flat prior the posterior is Beta(16, 6) whether 20 was planned or enrollment continued until the fifth non-responder, while the $p$-values differ. [11/the-posterior-does-not-depend-on-the-stopping-rule]

In a simulation with prior $N(0, 0.5^2)$ and monitoring to $n = 400$ at a posterior probability of 0.975, the claim made at stopping matches the truth among trials that stop. Yet if the null is exactly true, the same rule declares benefit at about seven times the usual 2.5%. [11/the-posterior-does-not-depend-on-the-stopping-rule]

## Pitfalls

- Calibration under the prior and a type I error answer different questions. The first averages over the prior, the second conditions on one $\theta$. [11/the-posterior-does-not-depend-on-the-stopping-rule]
- The principle holds when the full sample path is reported. It does not remove the need to specify how a summary was chosen. [sec-mult-selected]

## Check yourself

- Q: Does the posterior change if the trial planned to stop at the fifth non-responder rather than at 20 patients? A: No, it is Beta(16, 6) in both cases. [11/the-posterior-does-not-depend-on-the-stopping-rule]
- Q: Does the frequentist error rate change with the stopping rule? A: Yes, the error rate belongs to the rule. [11/why-repeated-testing-at-a-fixed-level-fails]
