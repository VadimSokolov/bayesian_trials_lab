---
id: forking-paths
name: Forking paths
type: concept
aliases: [garden of forking paths]
level: 2
summary: 'Multiplicity hidden in analyst choices: even one test is many if which test was run depended on the data.'
chapters: ['10']
home: sec-mult-selected
sections: [sec-mult-selected, sec-mult-subgroups]
prerequisites: [multiplicity, subgroup-analysis, posterior-distribution]
related:
- {rel: contrasts-with, to: prespecification}
- {rel: uses, to: winners-curse}
equations: [eq-selected-lik]
functions: []
results: []
lab: [04-multiplicity]
cites: [gelman2014crisis]
---

## What it is

The analyst who sees a promising subgroup usually chose how to cut: age above or below 65, 60 or 70, tertiles or a threshold. Gelman and Loken called this the garden of forking paths. Even if the analyst ran only one test, the choice of which test depended on the data. [sec-mult-subgroups]

The effective number of comparisons is the number of tests that would have been run had the data looked different. The multiplicity is hidden in decisions, not in the number of $p$-values. [sec-mult-subgroups]

## Why it matters

A Bayesian analysis conditions on the data it is shown. The regulator sees a message $M = \varsigma(X)$, where the reporting rule $\varsigma$ is chosen by the sponsor. [sec-mult-selected] The protocol is the specification of $\varsigma$. [sec-mult-selected]

## In the book

If the sponsor reports the largest of $K$ independent components, the likelihood of the reported value $m$ is given below. [sec-mult-selected]

$$
\mathcal{L}_\varsigma(\theta; m) = \sum_{k=1}^{K} p(m \mid \theta_k) \prod_{j \ne k} F(m \mid \theta_j),
$$

with $F$ the distribution function of a component. For exchangeable components the ratio to the naive likelihood approaches $K$ in the upper tail. [sec-mult-selected]

With a common effect $\theta \sim N(0, 1)$ and only the maximum reported, the correct likelihood carries an extra factor $\Phi(m - \theta)^{K-1}$, which pulls the posterior down. [sec-mult-selected]

## Pitfalls

- The retort that optional stopping does not affect the posterior is correct only when the full sample path is reported. It is beside the point when the report is a summary chosen after the fact. [sec-mult-selected]
- The regulator cannot compute the correct posterior without knowing the reporting rule. [sec-mult-selected]

## Check yourself

- Q: Where does the multiplicity hide when only one test was run? A: In the choice of which test, which depended on the data. [sec-mult-subgroups]
- Q: What fixes the reporting rule for a regulator? A: The protocol. [sec-mult-selected]
