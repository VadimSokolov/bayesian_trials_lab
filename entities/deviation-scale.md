---
id: deviation-scale
name: Deviation scale
type: concept
aliases: [three deviation scales, deviation scales]
level: 3
summary: Three scales of evidence, central limit, moderate deviation and large deviation, that set the bar on the squared standardized statistic for a fixed test, a Bayes rule and an anytime-valid rule.
chapters: ['11', '1', '7', '9']
home: 11/the-three-deviation-scales
sections: [11/set-up, 11/the-three-tolls, 11/where-the-surcharge-comes-from, 11/the-seventy-percent-result, 11/four-boundaries-compared, 11/the-sequential-power-calculation, sec-sequential]
prerequisites: [bayes-factor, ockham-penalty, wald-sprt, information-fraction]
related:
- {rel: uses, to: evidence-toll}
- {rel: uses, to: large-deviation}
- {rel: uses, to: villes-inequality}
equations: [eq-bf, eq-ockham-ch10, eq-md, eq-seqss]
functions: [gs_tolls]
results: [evidence_tolls_three_scales]
lab: []
cites: [schwarz1978estimating, ville1939etude, robbins1970statistical, polson2026evaluesbayesrisk]
---

## What it is

The chapter puts monitoring on one scale and gets three prices of evidence. A single look asks for a constant $z_\alpha^2$. The Bayes rule asks for a slowly growing $\log n + C$. The normal-mixture rule valid at every stopping time asks for approximately $\log n + C + 2\log(1/\alpha)$. These are large-information approximations. [sec-sequential]

The Bayes bar follows the moderate deviation relation, and the anytime-valid mixture rule rests on the Bayes factor with its Ockham penalty [11/set-up]:

$$
n\theta^2 \asymp \log n,
$$

$$
L_n = \log(1 + I_n\tau^2) \sim \log I_n
$$

$$
\mathrm{BF}_n = (1 + I_n\tau^2)^{-1/2} \exp\Bigl\{\frac{Z_n^2}{2}\cdot\frac{I_n\tau^2}{1+I_n\tau^2}\Bigr\}, \qquad
2\log \mathrm{BF}_n = Z_n^2 - L_n - \frac{Z_n^2}{1+q}, \qquad q = I_n\tau^2,
$$

The mean-path crossing approximation is

$$
n\,I\,\theta^2 = b_n^2,
$$

[11/the-sequential-power-calculation]

- Central limit, standard design: constant $z_\alpha^2$.
- Moderate deviation, Bayes: $\log n + C$, which grows slowly.
- Large deviation, anytime valid: $\log n + C + 2\log(1/\alpha)$.

[11/where-the-surcharge-comes-from]

## Why it matters

The Bayes bar is governed by the moderate deviation relation $n\theta^2 \asymp \log n$. Under it the type I error induced by a Bayes rule at threshold one tends to zero polynomially at a single analysis, rather than being pinned at a constant. [11/where-the-surcharge-comes-from]

## In the book

The mixture Bayes factor uses the Ockham penalty $L_n = \log(1 + I_n\tau^2) \sim \log I_n$, the price for integrating the parameter out. Under the null $\mathrm{BF}_n$ is a nonnegative martingale, so Ville's inequality bounds the chance it ever reaches $1/\alpha$. [11/set-up]

Three logarithms are easily run together. The $\log\log n$ of the iterated logarithm is the envelope of a random walk, the $\log n$ is the price of integrating a parameter out, and $\log(1/\alpha)$ is a quantity of evidence fixed by an error level. [11/four-boundaries-compared]

The mean-path crossing approximation is $n\,I\,\theta^2 = b_n^2$, the fixed-sample requirement with the power margin removed. [11/the-sequential-power-calculation]

## Pitfalls

- These are properties of the normal-mixture construction, not universal costs of anytime validity. [11/where-the-surcharge-comes-from]
- The mean-path approximation is not a median stopping time. [11/the-sequential-power-calculation]

## Check yourself

- Q: Which scale has a bar that grows like log n? A: The moderate deviation scale, the Bayes rule. [11/where-the-surcharge-comes-from]
- Q: What extra term does the anytime-valid scale add? A: $2\log(1/\alpha)$. [11/where-the-surcharge-comes-from]
