---
id: likelihood-ratio
name: Likelihood ratio
type: concept
aliases: []
level: 1
summary: The ratio of the density under an alternative to the density under the null, multiplied across observations, which is a test martingale when both are single distributions.
chapters: ['12']
home: 12/likelihood-ratios
sections: [12/likelihood-ratios, 12/mixtures]
prerequisites: [likelihood]
related:
- {rel: special-case-of, to: test-martingale}
- {rel: uses, to: wald-sprt}
equations: []
functions: []
results: []
lab: [08-e-values]
cites: [wald1945sequential]
---
## What it is

When the null and the alternative are each a single distribution, the likelihood ratio $\prod_i q(Y_i)/p_0(Y_i)$ is a test martingale. Under $p_0$ the expected ratio of densities is $\int (q/p_0)p_0 = 1$. [12/likelihood-ratios]

## Why it matters

This is Wald's SPRT statistic. For a simple alternative it is the best possible bet in the sense of growth. [12/likelihood-ratios]

## In the book

The limitation is that it requires committing to one alternative. A bet on a hazard ratio of 0.70 pays badly if the truth is 0.90. [12/likelihood-ratios] The remedy is to average over alternatives, which gives the [[mixture-method]]. [12/mixtures]

## Pitfalls

- Committing to one alternative makes the bet fragile when the true effect differs. [12/likelihood-ratios]

## Check yourself

- Q: Why is the likelihood ratio a test martingale under the null? A: Its expected value under the null density is the integral of $(q/p_0)p_0$, which is 1. [12/likelihood-ratios]
- Q: What is its main limitation? A: It commits to a single alternative. [12/likelihood-ratios]
