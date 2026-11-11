---
id: posterior-distribution
name: Posterior distribution
type: concept
aliases: [posterior]
level: 1
summary: The distribution of the unknown parameter after seeing the data, obtained by multiplying the prior by the likelihood and rescaling.
chapters: ['6', A]
home: sec-bayes
sections: [sec-bayes-rule, sec-two-groups, sec-agree, 6/a-side-by-side, 6/the-bayesian-analysis, sec-bayes-summary, sec-normal-normal]
prerequisites: [bayes-rule, likelihood]
related:
- {rel: uses, to: sequential-updating}
- {rel: contrasts-with, to: p-value}
equations: [eq-bayes]
functions: [beta_post, grid_update, prob_superior]
results: []
lab: [01-prior-posterior]
cites: []
---
## What it is
The posterior is what is believed about the parameter after the data, $\pi(\theta \mid y)$. It is the prior times the likelihood, rescaled to integrate to one. [sec-bayes-rule]

Bayes rule gives the posterior:

$$
\pi(\theta \mid y) = \frac{p(y \mid \theta)\, \pi(\theta)}{\int p(y \mid \theta')\, \pi(\theta')\, d\theta'} \;\propto\; p(y \mid \theta)\, \pi(\theta),
$$

This is equation eq-bayes. [sec-bayes-rule]

## Why it matters
The traditional analysis answers whether the difference could be produced by chance alone. A trialist usually wants to know how likely it is that the new treatment is better and by how much. The posterior answers this directly. [sec-bayes]

Its statements are probabilities about the parameter given these data. A confidence interval is a statement about a procedure over repeated trials. [6/a-side-by-side]

## In the book
Put a flat Beta(1,1) prior on each arm of the running trial, 30 of 100 control and 45 of 100 treatment responders. The posteriors are Beta(31, 71) and Beta(46, 56). [6/the-bayesian-analysis]

There is no neat formula for the difference, so many samples are drawn from each posterior (Monte Carlo). The probability $\Pr(p_1 > p_0 \mid y)$ is 0.9855, against $1 - p = 0.9858$. [sec-bayes-summary]

The posterior also answers questions a p-value cannot: the probability that the effect exceeds a margin such as 5 or 10 percentage points. [6/the-bayesian-analysis]

## Pitfalls
With a flat prior and a nearly normal likelihood the posterior probability and one minus the one-sided p-value nearly coincide. The match is not a theorem of the model. It fails with an informative prior, a small sample or rates near 0 or 1. [sec-agree]

The same data under three normal priors gave 0.983, 0.975 and 0.958, so the prior must be specified before the data. [sec-normal-normal]

## Check yourself
- Q: After 45 of 100 responders and a flat prior, what is the posterior? A: Beta(46, 56). [6/the-bayesian-analysis]
- Q: Does a flat prior always make $1-p$ equal the posterior probability? A: No, only approximately, in nearly normal settings. [sec-agree]
