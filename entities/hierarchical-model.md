---
id: hierarchical-model
name: Hierarchical model
type: method
aliases: [Bayesian hierarchical model, partial pooling]
level: 2
summary: A model in which group parameters are draws from a common distribution with estimated spread, so that groups borrow strength from one another.
chapters: ['19', '10']
home: sec-borrowing-hier
sections: [sec-borrowing-hier, sec-borrowing-basket, sec-borrowing-idea, sec-borrowing-rebyota]
prerequisites: [exchangeability, prior-distribution]
related:
- {rel: generalizes, to: meta-analytic-predictive-prior}
- {rel: used-in, to: basket-trial}
- {rel: uses, to: shrinkage}
- {rel: alternative-to, to: power-prior}
equations: [eq-hier, eq-shrink]
functions: [borrow_basket_posterior, borrow_map_prior]
results: []
lab: [09-adaptive-bayesian]
cites: [stein1956inadmissibility, skene1990, thall2003, berry2013bayesian]
---
## What it is

Two groups are exchangeable if nothing we know distinguishes the rate of one from that of the other. That does not make the rates equal. It makes their joint prior symmetric. [sec-borrowing-hier] The hierarchical model treats the group rates as conditionally independent draws from a common distribution with unknown parameters. For binary data from $K$ groups:

$$
y_k \mid p_k \sim \mathrm{Binomial}(n_k,p_k),\qquad \mathrm{logit}\,p_k \mid \mu,\tau_b \sim N(\mu,\tau_b^2),\qquad (\mu,\tau_b)\sim \pi(\mu,\tau_b).
$$

This is eq-hier. [sec-borrowing-hier] The spread $\tau_b$ controls borrowing: near zero the groups are nearly identical, and large $\tau_b$ leaves them nearly independent. [sec-borrowing-hier]

## Why it matters

Because $\tau_b$ is estimated, borrowing falls when the groups disagree. [sec-borrowing-hier] For a normal outcome the posterior mean is approximately a weighted average (eq-shrink), $\mathbb{E}[\theta_k \mid y] \approx \lambda_k \bar\theta + (1-\lambda_k)\hat\theta_k$ with $\lambda_k = \sigma_k^2/(\sigma_k^2+\tau_b^2)$, so a small group with a large $\sigma_k^2$ is shrunk more. [sec-borrowing-hier]

## In the book

The model is used in multicenter trials, where the groups are centers. In the eight-center topical-cream trial, centers had 5 to 37 patients per arm. [sec-borrowing-hier] It is also the basket trial model, and REBYOTA used it with dynamic borrowing from a phase 2b study. [sec-borrowing-basket] [sec-borrowing-rebyota]

## Pitfalls

Shrinkage lowers total error only under conditions, and an individual group can be estimated worse. [sec-borrowing-hier] With few groups $\tau_b$ is poorly estimated and the answer depends on its prior: with four historical trials, half-normal priors with scale 0.5 and 1.0 can give quite different borrowing. [sec-borrowing-hier]

## Check yourself

- Q: What happens to borrowing if the groups disagree? A: The posterior for $\tau_b$ moves up and borrowing falls. [sec-borrowing-hier]
- Q: Which groups are shrunk more? A: Small groups, which have large sampling variance. [sec-borrowing-hier]
