---
id: gamma-poisson-shrinker
name: Gamma-Poisson shrinker
type: method
aliases: [GPS, MGPS]
level: 3
summary: An empirical Bayes method that shrinks noisy reporting ratios with a two-component gamma mixture and ranks signals by their geometric mean and fifth percentile.
chapters: ['13']
home: 13/the-gamma-poisson-shrinker
sections: [13/the-gamma-poisson-shrinker, 13/key-points]
prerequisites: [disproportionality-analysis, empirical-bayes, shrinkage]
related:
- {rel: contrasts-with, to: proportional-reporting-ratio}
- {rel: part-of, to: faers}
- {rel: alternative-to, to: adverse-event-hierarchy}
equations: [eq-safety-gps]
functions: [safety_gps, safety_gps_fit]
results: []
lab: []
cites: [dumouchel1999bayesian, szarfman2002use, bate1998bayesian, madigan2011bayesian, zorych2013disproportionality, berry2004accounting]
---
## What it is

Each pair has a true reporting ratio $\lambda_{ij}$, with $n_{ij} \sim \mathrm{Poisson}(\lambda_{ij} E_{ij})$. The ratios come from a mixture of two gamma distributions: [13/the-gamma-poisson-shrinker]

$$
\lambda \sim P\, \mathrm{Gamma}(\alpha_1, \beta_1) + (1 - P)\, \mathrm{Gamma}(\alpha_2, \beta_2),
$$

eq-safety-gps, with five parameters estimated from the whole table by maximum marginal likelihood. [13/the-gamma-poisson-shrinker] The posterior is again a two-component gamma mixture, with component $k$ becoming $\mathrm{Gamma}(\alpha_k + n, \beta_k + E)$. [13/the-gamma-poisson-shrinker]

Signals are ranked by $\mathrm{EBGM} = \exp(\mathbb{E}[\log \lambda \mid n])$ and screened on its fifth percentile, EB05. [13/the-gamma-poisson-shrinker]

## Why it matters

DuMouchel proposed it as the empirical Bayes method behind the FDA's data mining of its reports database. [13/the-gamma-poisson-shrinker] It ranks signals by evidence as well as by size. [13/key-points]

## In the book

With illustrative hyperparameters, the single report with a raw ratio of twenty is shrunk and its lower bound is well below one, so it is not a signal. [13/the-gamma-poisson-shrinker] Two pairs with the same raw ratio of four are treated differently: the pair with 40 reports has a high EB05 and is flagged, the pair with 12 less so. [13/the-gamma-poisson-shrinker] A screening rule of EB05 above 2 flags the pairs with $n = 12$ and $n = 40$ and nothing else. [13/the-gamma-poisson-shrinker]

## Pitfalls

- The illustrative values only show the mechanics. In a real analysis they are fitted to the whole table, because shrinkage is only as good as the estimated mixture. [13/the-gamma-poisson-shrinker]
- A high EB05 is a hypothesis, not evidence of causation. It does not correct for bias in the reporting mechanism. [13/the-gamma-poisson-shrinker]

## Check yourself

- Q: Does a raw ratio of 20 on one report survive shrinkage? A: No, its EB05 is well below one. [13/the-gamma-poisson-shrinker]
- Q: Two pairs share a raw ratio of 4, with 12 and 40 reports. Which has the higher EB05? A: The one with 40 reports. [13/the-gamma-poisson-shrinker]
