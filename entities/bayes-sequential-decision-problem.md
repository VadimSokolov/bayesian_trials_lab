---
id: bayes-sequential-decision-problem
name: Bayes sequential decision problem
type: concept
aliases: [Bayesian sequential decision]
level: 3
summary: Choosing a stopping time and terminal decision to minimize expected loss plus sampling cost, solved by backward induction on a sufficient statistic.
chapters: ['11', '15']
home: 11/the-bayes-sequential-decision-problem
sections: [11/the-bayes-sequential-decision-problem]
prerequisites: [decision-theory, posterior-distribution, stopping-rule-principle]
related:
- {rel: generalizes, to: wald-sprt}
- {rel: uses, to: backward-induction}
- {rel: contrasts-with, to: group-sequential-design}
equations: [eq-sequential-bellman]
functions: []
results: []
lab: []
cites: [sokolova2026bayesian]
---

## What it is

A design is a pair $(T, d)$: a stopping time $T \le N_{\max}$ adapted to the data and a terminal decision $d$. Let $\ell(\theta, d)$ be the terminal loss and $\kappa(\theta)$ the cost per enrolled patient. The Bayes rule minimizes expected total loss $\ell(\theta, d) + \kappa(\theta)\,T$ under the prior. [11/the-bayes-sequential-decision-problem]

With $V(n,S)$ the minimal expected future loss in state $(n, S)$:

$$
V(n,S) = \min\Bigl\{\min_d \mathbb{E}[\ell(\theta,d) \mid n, S],\;\; \mathbb{E}[\kappa(\theta) \mid n, S] + \mathbb{E}_{\text{pred}}\bigl[V(n+1, S+X_{n+1})\bigr]\Bigr\}.
$$

[11/the-bayes-sequential-decision-problem]

## Why it matters

The traditional design chooses the boundary to control a type I error and then asks what it costs. The Bayes design chooses the boundary to minimize expected loss and then asks what error rates it has. For error-calibrated use the second must be turned into the first by simulation. [11/the-bayes-sequential-decision-problem]

## In the book

A decision tree over $N_{\max}$ steps has exponentially many branches. Indexed by the sufficient statistic it becomes a table over states, filled by backward induction. For a single-arm binary endpoint the lattice has order $N_{\max}^2$ entries. [11/the-bayes-sequential-decision-problem]

The set of states where stopping is optimal is the stopping region, and its boundary is the Bayes boundary. The continuation region narrows toward the horizon because the option value of another observation shrinks. Early in the trial the boundary is wide, since a premature decision is expensive. [11/the-bayes-sequential-decision-problem]

## Pitfalls

- The exact shape of the continuation region depends on the loss and sampling cost, and it need not be triangular. [11/the-bayes-sequential-decision-problem]

## Check yourself

- Q: What makes the problem computable? A: The posterior depends on the data only through a sufficient statistic, so the state is $(n, S_n)$. [11/the-bayes-sequential-decision-problem]
- Q: Why does the continuation region narrow near the horizon? A: The option value of another observation shrinks with fewer remaining observations. [11/the-bayes-sequential-decision-problem]
