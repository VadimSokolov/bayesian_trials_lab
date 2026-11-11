---
id: noninformative-prior
name: Noninformative prior
type: concept
aliases: [default prior, flat prior]
level: 2
summary: A prior with a very large variance that adds essentially no information on its own scale, but is vague only on one parameterization.
chapters: ['8']
home: sec-priors-three
sections: [sec-priors-flat, 8/independent-beta-priors-imply-an-extreme-prior-on-the-risk-difference, 8/flat-priors-on-logistic-coefficients, sec-priors-fda, 8/key-points, 8/what-can-go-wrong]
prerequisites: [prior-distribution]
related:
- {rel: alternative-to, to: conditional-means-prior}
- {rel: contrasts-with, to: skeptical-prior}
equations: []
functions: [cmp_samples]
results: []
lab: [16-bayesian-protocol]
cites: [jeffreys1946invariant, gelman2008weakly, simpson2017penalising, berger2006objective]
---

## What it is

A noninformative or reference prior, such as a normal with a very large variance, adds essentially no information. For a normal likelihood the posterior is the likelihood, and the posterior probability that $\theta > 0$ equals one minus the one-sided p-value [sec-priors-three]. In the 508-event example, a very large variance gives 0.994, which is one minus the p-value of 0.006 [sec-priors-three].

## Why it matters

"Noninformative" is a statement about one parameterization. A prior vague on a parameter is generally informative about every nonlinear function of it [sec-priors-flat]. The FDA draft says no single approach is universally preferred, and that such priors are not invariant to transformation [sec-priors-fda].

## In the book

Independent Jeffreys Beta(1/2, 1/2) or uniform Beta(1, 1) priors on two arms put 49 to 56 percent prior probability on a risk difference larger than 30 points in either direction [8/key-points]. A prior that says "no opinion" about each rate says the drug is very likely dramatically effective or harmful [8/independent-beta-priors-imply-an-extreme-prior-on-the-risk-difference]. A vague $N(0, 10^2)$ on logistic coefficients pushes mass to the boundaries because the inverse logit saturates [8/flat-priors-on-logistic-coefficients]. A weakly informative default such as a half-normal on a between-trial standard deviation is common for nuisance parameters [sec-priors-three].

## Pitfalls

A flat prior is a choice with implicit commitments on every other scale. Compute what it implies about the estimand before calling it neutral [8/what-can-go-wrong]. In a large trial with a normal likelihood the issue disappears [8/what-can-go-wrong].

## Check yourself

- Q: Under a flat prior and a normal likelihood, what is the posterior probability of benefit? A: One minus the one-sided p-value [sec-priors-three].
- Q: Why can independent uniform priors on two response rates be a problem? A: They imply a prior on the risk difference that favors extreme differences [8/independent-beta-priors-imply-an-extreme-prior-on-the-risk-difference].
