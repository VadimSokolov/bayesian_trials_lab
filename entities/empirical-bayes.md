---
id: empirical-bayes
name: Empirical Bayes
type: method
aliases: []
level: 2
summary: Estimate the hierarchy's parameters from the data and plug them in, as in fitting the between-arm spread by marginal likelihood.
chapters: ['10', '13']
home: 10/stein-efron-and-morris-and-the-batting-averages
sections: [10/stein-efron-and-morris-and-the-batting-averages, 10/what-the-hierarchical-reading-does-with-it]
prerequisites: [shrinkage, normal-normal-model]
related:
- {rel: special-case-of, to: hierarchical-model}
- {rel: uses, to: stein-estimator}
equations: []
functions: [shrink_eb_fit]
results: []
lab: [05-ulcer-trial]
cites: [efron1975data, efron1977steins]
---

## What it is

In the ulcer illustration the between-arm standard deviation $\tau_g$ is estimated by marginal likelihood and then treated as known. The fit is `shrink_eb_fit()` in the package. [10/what-the-hierarchical-reading-does-with-it]

Efron and Morris made the shrinkage idea concrete with batting averages shrunk toward the league mean. [10/stein-efron-and-morris-and-the-batting-averages]

## Why it matters

It gives a usable hierarchical estimate without choosing a hyperprior. [10/what-the-hierarchical-reading-does-with-it]

## In the book

The fit gives a between-arm standard deviation on the log odds scale that shrinks each arm roughly half way to the common mean. [10/what-the-hierarchical-reading-does-with-it]

## Pitfalls

- The estimate of $\tau_g$ rests on four arms, which is thin. A plug-in estimate treats it as known. [10/what-the-hierarchical-reading-does-with-it]
- A fully Bayesian analysis would integrate uncertainty in the hierarchy's parameters. The sensitivity to the prior scale is the first thing a reviewer will ask. [10/what-the-hierarchical-reading-does-with-it]
- The Stein theorem does not establish that this fit improves every arm or a clinical decision. [10/stein-efron-and-morris-and-the-batting-averages]

## Check yourself

- Q: How is tau_g obtained in the ulcer fit? A: By marginal likelihood. [10/what-the-hierarchical-reading-does-with-it]
- Q: What does a plug-in estimate ignore? A: The uncertainty in tau_g. [10/what-the-hierarchical-reading-does-with-it]
