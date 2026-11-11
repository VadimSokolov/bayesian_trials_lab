---
id: conjugate-prior
name: Conjugate prior
type: concept
aliases: [conjugacy]
level: 2
summary: A prior whose posterior belongs to the same family as the prior, so that updating reduces to simple arithmetic.
chapters: ['6']
home: sec-beta
sections: [sec-normal-normal, sec-updating, 6/the-bayesian-analysis, sec-protocol-bayes]
prerequisites: [beta-prior, likelihood]
related: []
equations: [eq-conjugate]
functions: [beta_post]
results: []
lab: [01-prior-posterior]
cites: []
---
## What it is
A prior is conjugate to the likelihood if the posterior belongs to the same family. For the Beta prior and a binomial likelihood the update is addition: add the responders to $a$ and the non-responders to $b$. [sec-beta]

$$
\theta \sim \mathrm{Beta}(a, b), \quad h \text{ heads}, \; t \text{ tails} \quad\Longrightarrow\quad \theta \mid y \sim \mathrm{Beta}(a + h,\; b + t).
$$

## Why it matters
Multiplying the prior kernel $\theta^{a-1}(1-\theta)^{b-1}$ by the likelihood kernel $\theta^{h}(1-\theta)^{t}$ gives $\theta^{a+h-1}(1-\theta)^{b+t-1}$, the kernel of Beta$(a+h, b+t)$. The normalizing constant is whatever makes it integrate to one, so nothing needs to be integrated by hand. [sec-beta]

For conjugate models, batch-wise updating is a running total of responders and non-responders. This makes interim analyses cheap: a handful of arithmetic operations. [sec-updating]

## In the book
In the two-group example, flat Beta(1,1) priors and 30 of 100 and 45 of 100 responders give Beta(31, 71) and Beta(46, 56). [6/the-bayesian-analysis]

For the log hazard ratio, a normal prior and a normal likelihood give a normal posterior with precision equal to the sum of the precisions. [sec-normal-normal]

## Pitfalls
Conjugacy is a convenience of form and says nothing about whether the prior is defensible. The protocol must still state and justify the prior. [sec-protocol-bayes]

## Check yourself
- Q: What is the Beta posterior after 8 responders and 2 non-responders from Beta(1,1)? A: Beta(9, 3), by adding. [sec-beta]
- Q: What adds in the normal-normal model? A: The precisions. [sec-normal-normal]
