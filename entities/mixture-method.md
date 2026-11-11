---
id: mixture-method
name: Mixture method
type: method
aliases: [mixture e-value]
level: 3
summary: Averaging likelihood-ratio martingales over a distribution of alternatives to get an e-value that does not commit to one effect size.
chapters: ['12']
home: 12/mixtures
sections: [12/mixtures, sec-evalues-bf, sec-evalues-subsets]
prerequisites: [likelihood-ratio, test-martingale]
related:
- {rel: special-case-of, to: e-value}
- {rel: contrasts-with, to: bayes-factor}
- {rel: uses, to: prior-distribution}
equations: [eq-evalues-mix]
functions: [ev_mixture, ev_log_mixture]
results: []
lab: [08-e-values]
cites: [polson2026evaluesbayesrisk, polson2026evaluesmdp]
---
## What it is

If $L_n(\theta)$ is a likelihood-ratio martingale for each $\theta$ in the alternative, then for any mixing distribution $H$, [12/mixtures]

$$
E_n = \int L_n(\theta)\,dH(\theta)
$$

is again a test martingale, because an average of martingales with unit start is a martingale with unit start. [12/mixtures]

For a Gaussian trial with $X_i \sim N(\theta, 1)$, $S_n = \sum_{i\le n} X_i$ and $H_0:\theta \le 0$, mixing over a half-normal distribution with scale $\rho$ gives, with $A_n = n + \rho^{-2}$, [12/mixtures]

$$
E_n^{+} = \frac{2}{\rho\sqrt{A_n}}\exp\!\Bigl(\frac{S_n^2}{2A_n}\Bigr)\,\Phi\!\Bigl(\frac{S_n}{\sqrt{A_n}}\Bigr).
$$

This is eq-evalues-mix. [12/mixtures]

## Why it matters

Mixing removes the need to commit to one alternative. The scale $\rho$ plays the role of a prior standard deviation on the effect and is a design parameter. [12/mixtures] Ville's inequality holds for the whole composite null. [12/mixtures]

## In the book

The mixture e-value is a Bayes factor: the ratio of the marginal likelihood under a half-normal prior to the likelihood at the null value. [sec-evalues-bf] In the authors' sweep the integrated Bayes risk changes by only a few percent across $\rho$ from 0.10 to 0.32, so the threshold matters more than $\rho$. [12/mixtures]

An equal-weight mixture over $K$ prespecified subgroup analyses is a valid fixed-look e-value for the global null, but it loses to the Sidak maximum when the statistics are correlated. [sec-evalues-subsets]

## Pitfalls

- The fixed-look mixture has no time index, so applying its constant threshold repeatedly would eventually cross under the null with probability one. [sec-evalues-subsets]

## Check yourself

- Q: Why is an average of test martingales a test martingale? A: An average of martingales with unit start is a martingale with unit start. [12/mixtures]
- Q: Which matters more for cost, $\rho$ or the threshold? A: The threshold. [12/mixtures]
