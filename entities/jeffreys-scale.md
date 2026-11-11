---
id: jeffreys-scale
name: Jeffreys scale
type: concept
aliases: [Jeffreys table]
level: 3
summary: Jeffreys' criterion that the evidence bar for a normal mean grows with the sample size, restated in terms of the prior information q.
chapters: ['7']
home: sec-evidence-jeffreys
sections: [sec-evidence-calibration]
prerequisites: [bayes-factor, ockham-penalty]
related:
- {rel: alternative-to, to: two-bars}
equations: []
functions: [decide_jeffreys_table]
results: []
lab: []
cites: [jeffreys1939theory, kass1995bayes]
---

## What it is

Jeffreys derived the growth of the bar for a normal mean with the Cauchy prior he recommended on invariance grounds. To leading order in $n$ the Bayes factor in favor of the null is $K = \sqrt{\pi n/2}\,\exp(-t^2/2)$, which falls through one at $t_{\mathrm{crit}} = \sqrt{\log(\pi n/2)}$ [sec-evidence-jeffreys]. Kass and Raftery give the scale on which Bayes factors are usually read [sec-evidence-calibration].

## Why it matters

The table restates the criterion in terms of $q$ and sets it beside the exact bar of the normal-mixture rule, which the rest of the chapter uses [sec-evidence-jeffreys].

## In the book

This is a large-information approximation, not an identity. Evaluated exactly, the Cauchy Bayes factor at $t_{\mathrm{crit}}$ is not one at small $n$ [sec-evidence-jeffreys]. At $q = 10$ the two bars in the table are approximately 1.66 and 1.62 [sec-evidence-jeffreys].

## Pitfalls

Two cautions. The bar is a function of the prior scale through $q$, not of $n$ alone. With $\tau = 0.25$ the rows read at $q = n/16$ and the crossing with 1.96 arrives at the thousands of events [sec-evidence-jeffreys]. The statement that the fixed level is too lenient beyond a phase I cohort holds only for a unit-information prior [sec-evidence-jeffreys]. Second, the calculation prices a point null, and against an interval null the bar depends on the interval and priors chosen [sec-evidence-jeffreys].

## Check yourself

- Q: Does the Jeffreys bar depend on n alone? A: No, it depends on the prior scale through $q$ [sec-evidence-jeffreys].
- Q: Is $t_{\mathrm{crit}} = \sqrt{\log(\pi n/2)}$ exact? A: No, it is a large-information approximation [sec-evidence-jeffreys].
