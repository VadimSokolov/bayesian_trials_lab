---
id: wald-sprt
name: Wald's sequential test
type: method
aliases: [Wald SPRT, sequential probability ratio test]
level: 3
summary: Accumulate the log likelihood ratio and stop when it leaves an interval, giving the smallest expected sample size at fixed error rates but no maximum size.
chapters: ['11', '13']
home: sec-ch10-wald
sections: [sec-ch10-wald, sec-ch10-families]
prerequisites: [likelihood-ratio, type-i-error, type-ii-error]
related:
- {rel: special-case-of, to: bayes-sequential-decision-problem}
- {rel: alternative-to, to: group-sequential-design}
- {rel: uses, to: large-deviation}
equations: [eq-wald]
functions: []
results: []
lab: []
cites: [wald1945sequential, barnard1946sequential, wald1948optimum, whitehead1983triangular]
---

## What it is

For simple hypotheses $H_0$ and $H_1$, accumulate the log likelihood ratio $\Lambda_n = \sum_{i\le n} \log\{p_1(X_i)/p_0(X_i)\}$. Stop when it leaves $(\log B, \log A)$ with $A = (1-\beta)/\alpha$ and $B = \beta/(1-\alpha)$, accepting $H_1$ at the upper edge and $H_0$ at the lower. [sec-ch10-wald]

This is the posterior odds rule of a Bayesian with a two-point prior. Wald and Wolfowitz proved it has the smallest expected sample size under both hypotheses among tests with the same error probabilities. [sec-ch10-wald]

## Why it matters

It is the reference point for everything in sequential monitoring. [sec-ch10-wald]

## In the book

For a unit-variance normal mean, $H_0: \theta = 0$ against $H_1: \theta = 0.2$ with $\alpha = 0.025$ and $\beta = 0.10$, a fixed-sample test needs 263 patients. The Kullback-Leibler divergence is $\theta^2/2 = 0.02$ per patient, and Wald's approximation to the expected sample size under $H_1$ follows. [sec-ch10-wald]
$$
\mathbb{E}_1[T] \approx \frac{(1-\beta)\log\{(1-\beta)/\alpha\} + \beta \log\{\beta/(1-\alpha)\}}{\mathrm{KL}(P_1 \| P_0)}.
$$
[sec-ch10-wald]

Whitehead's triangular test is a closed alternative whose boundaries converge at the maximum information, so the trial always ends with a decision. [sec-ch10-families]

## Pitfalls

- The sample size has no upper bound. The 95th percentile under $H_1$ is above the fixed-sample size, and a few trials run several times longer. [sec-ch10-wald]
- It tests two simple hypotheses, whereas a trial's alternative is composite. The remedy is a prior on the effect and the mixture likelihood ratio. [sec-ch10-wald]

## Check yourself

- Q: Which hypotheses does the SPRT assume? A: Two simple hypotheses. [sec-ch10-wald]
- Q: Why do trials use group sequential designs instead? A: They have a hard end, a maximum sample size. [sec-ch10-wald]
