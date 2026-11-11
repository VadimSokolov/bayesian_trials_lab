---
id: posterior-probability-success-criterion
name: Posterior probability success criterion
type: concept
aliases: [success criterion, FDA success criterion, success threshold, posterior probability threshold]
level: 2
summary: A rule that declares success when the posterior probability that the treatment effect exceeds a threshold a is larger than a level c.
chapters: ['14', '6', '7', '23']
home: sec-sim-rule
sections: [sec-sim-inflation, 14/choosing-a-and-c]
prerequisites: [posterior-distribution, type-i-error]
related:
- {rel: governed-by, to: fda-bayesian-draft-guidance-2026}
- {rel: contrasts-with, to: p-value}
- {rel: used-in, to: superion-trial}
equations: []
functions: [oc_post_table, oc_simulate]
results: []
lab: [09-adaptive-bayesian, 14-simulator]
cites: [fda_bayesian_2026]
---
## What it is

The FDA Bayesian draft guidance describes a success criterion of the form $\Pr(\delta > a \mid \text{data}) > c$ [sec-sim-rule]. The treatment effect $\delta$ must exceed a threshold $a$ with posterior probability larger than a level $c$ [sec-sim-rule]. For two response rates, $\delta = p_1 - p_0$ [sec-sim-rule].

With independent Beta(1,1) priors the posterior in each arm is Beta$(1 + x_j, 1 + n_j - x_j)$, and the probability is a one-dimensional integral [sec-sim-rule].

## Why it matters

The rule has no type I error until $a$, $c$, the prior and the schedule of looks are all fixed, because the error rate belongs to the whole procedure, not to the posterior [sec-sim-rule]. With one look and a flat prior, $c = 0.975$ is roughly the familiar one-sided 2.5 percent test [sec-sim-rule]. Add a second look and the same $c$ is no longer a 2.5 percent test [sec-sim-rule].

## In the book

The threshold $a$ is a clinical quantity, the smallest effect worth having, and $c$ is a statistical quantity set by [[calibration]] [14/choosing-a-and-c]. The pivotal BNT162b2 trial used 0.995 at the interim analyses and 0.986 at the final one to keep the overall type I error at 2.5 percent [sec-sim-rule].

## Pitfalls

Reusing 0.975 at every look inflates the error. In the book's example the rule applied at any of four looks needs $c = 0.991$ to be a 2.5 percent test [sec-sim-inflation]. Examples with $a > 0$ depart from the draft's $a = 0$ calibrated superiority form; they show mechanics and are not a form the draft prescribes [14/choosing-a-and-c].

## Check yourself

- Q: Is $c = 0.975$ a 2.5 percent test when the trial looks four times? A: No. The book finds $c = 0.991$ gives 2.5 percent at four looks [sec-sim-inflation].
- Q: Which two quantities does the rule depend on besides the data? A: The effect threshold $a$ and the level $c$, plus the prior and the looks, which together fix the error rate [sec-sim-rule].
