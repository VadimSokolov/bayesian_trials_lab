---
id: shrinkage
name: Shrinkage
type: method
aliases: [shrinkage estimator, partial pooling]
level: 2
summary: A hierarchical model pulls each group's estimate toward the common mean in proportion to how little information it carries, paying for multiplicity in the estimate.
chapters: ['10', '22']
home: sec-mult-shrinkage
sections: [sec-mult-shrinkage, 10/the-idea, 10/what-shrinkage-does-not-do, 10/what-the-hierarchical-reading-does-with-it, 10/key-points, sec-mult-platform]
prerequisites: [multiplicity, normal-normal-model, exchangeability]
related:
- {rel: uses, to: hierarchical-model}
- {rel: alternative-to, to: bonferroni-correction}
- {rel: generalizes, to: stein-estimator}
- {rel: uses, to: empirical-bayes}
equations: [eq-mult-hier, eq-mult-shrink]
functions: [shrink_eb_fit, shrink_logodds, shrink_post_prob]
results: []
lab: [05-ulcer-trial]
cites: [gelman2012multiple, gelman2000types, berry2004accounting]
---

## What it is

A Bonferroni correction raises the evidence required for each result independently of what the others say. A hierarchical model treats the effects as draws from a common distribution. [10/the-idea]

$$
\hat\theta_j \mid \theta_j \sim N(\theta_j, s_j^2), \qquad \theta_j \mid \mu, \tau_g \sim N(\mu, \tau_g^2),
$$

For fixed $\mu$ and $\tau_g$ the posterior mean is a weighted average of the group's own estimate and the common mean. [10/the-idea]

$$
\mathbb{E}[\theta_j \mid y] = (1-B_j)\,\hat\theta_j + B_j\,\mu, \qquad B_j = \frac{s_j^2}{s_j^2 + \tau_g^2}.
$$

This is partial pooling. [10/the-idea]

## Why it matters

A group with a small standard error stays near its own estimate. A group with little information is pulled toward the mean. [10/the-idea] The correction for looking at many things is built into the estimate. [10/the-idea]

## In the book

In the ulcer illustration, $\tau_g$ is estimated by marginal likelihood with `shrink_eb_fit()`, and each arm is shrunk roughly half way to the common mean. [10/what-the-hierarchical-reading-does-with-it]

I-SPY 2 and REMAP-CAP handle multiplicity by modeling and a demanding threshold, not by familywise adjustment. [10/key-points]

## Pitfalls

- Shrinkage does not control the familywise error rate. A regulator who requires it needs the rule calibrated by simulation. [10/what-shrinkage-does-not-do]
- With one truly active group among many nulls, shrinkage works against it. A heavier-tailed or mixture distribution can help. [10/what-shrinkage-does-not-do]
- The amount of pooling depends on the exchangeability assumption, the form of the group effects and the hyperprior. [10/the-idea]
- Shrinking across unrelated drugs borrows from the wrong place. [sec-mult-platform]

## Check yourself

- Q: When $\tau_g$ is small, what does the model reproduce? A: The pooled analysis. [10/the-idea]
- Q: Where does shrinkage pay for looking at many groups, compared with Bonferroni? A: In the estimate, not the threshold. [10/key-points]
