---
id: skeptical-prior
name: Skeptical prior
type: concept
aliases: []
level: 2
summary: A prior centered at no effect whose spread makes the chance of reaching the design alternative small, standing for a colleague who thinks the drug does nothing.
chapters: ['8', '22']
home: sec-priors-three
sections: [sec-priors-fda, 8/what-can-go-wrong, sec-priors-eolia]
prerequisites: [prior-distribution]
related:
- {rel: contrasts-with, to: enthusiastic-prior}
- {rel: governed-by, to: fda-bayesian-draft-guidance-2026}
- {rel: used-in, to: eolia-trial}
equations: []
functions: [normal_update, ess_events, grid_update]
results: []
lab: [16-bayesian-protocol]
cites: [spiegelhalter1994bayesian, spiegelhalter2004]
---

## What it is

Spiegelhalter, Freedman and Parmar proposed reporting a trial against reference priors, each standing for a recognizable audience [sec-priors-three]. For $\theta = -\log \mathrm{HR}$ the skeptical prior is $\theta \sim N(0, s^2)$ with $s = \theta_a / 1.645$, so that $\Pr(\theta > \theta_a) = 0.05$. It will concede only that the drug might work as hoped, with probability one in twenty [sec-priors-three].

## Why it matters

If a trial is positive even under the skeptical prior, the skeptic is convinced [sec-priors-three]. A skeptic requires a larger observed effect for the same posterior probability, which is how a Bayesian design can reproduce the early conservatism of an O'Brien-Fleming boundary [sec-priors-three]. The FDA draft says that "Skeptical priors express skepticism about the presence of very large treatment effects" [sec-priors-three].

## In the book

For 508 events and observed HR 0.80 ($\hat\theta = 0.223$, standard error 0.089, z = 2.51, one-sided p = 0.006), the skeptic with $N(0, 0.175^2)$ ends with a posterior probability of benefit of 0.988 and a posterior hazard ratio of 0.84 [sec-priors-three]. The prior is worth 131 events, a quarter of the trial [sec-priors-three]. In EOLIA, a strongly skeptical prior still put 88% on some benefit [sec-priors-eolia].

## Pitfalls

The spread is tied to the sponsor's own design alternative, so an optimistic sponsor has a correspondingly wide skeptic. The fair response to a reviewer who wants a different skeptic is sensitivity analysis, not an argument about whose skeptic is right [sec-priors-three]. A skeptical prior of ESS 131 in 508 events moves the estimate from 0.80 to 0.84, and the report should say so [8/what-can-go-wrong].

## Check yourself

- Q: What spread makes a skeptical prior skeptical? A: $s = \theta_a/1.645$, giving a 5% prior chance of reaching the design effect [sec-priors-three].
- Q: Does the skeptic's posterior move far in the 508-event example? A: Only from 0.80 to 0.84, and benefit stays above 0.975 [sec-priors-three].
