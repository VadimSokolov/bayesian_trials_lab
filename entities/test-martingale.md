---
id: test-martingale
name: Test martingale
type: concept
aliases: []
level: 2
summary: A nonnegative process that starts at one and whose expected next value equals its current value under the null, the wealth of a gambler who bets fairly.
chapters: ['12']
home: 12/test-martingales-and-villes-inequality
sections: [12/test-martingales-and-villes-inequality, 12/a-betting-martingale-for-a-binary-endpoint, sec-evalues-lr, 12/e-processes]
prerequisites: [e-value]
related:
- {rel: generalizes, to: likelihood-ratio}
- {rel: generalizes, to: mixture-method}
- {rel: generalizes, to: e-process}
- {rel: uses, to: villes-inequality}
equations: []
functions: [ev_betting_paths]
results: []
lab: [08-e-values]
cites: [shafer2011test, sokolova2026, wald1945sequential]
---
## What it is

Let $E_n$ be the gambler's wealth after $n$ observations, starting from $E_0 = 1$. If each bet is fair under the null, so that given the past the expected wealth after the next observation equals the wealth now, the process is a test martingale. [12/test-martingales-and-villes-inequality] If the expected wealth can only fall, it is a test supermartingale, and everything below holds for it too. [12/test-martingales-and-villes-inequality]

## Why it matters

[[villes-inequality|Ville's inequality]] bounds the probability that a test martingale ever crosses a high level, for the entire path. [12/test-martingales-and-villes-inequality] That is what lets the analyst look after every patient and stop for any reason. [12/test-martingales-and-villes-inequality]

## In the book

For a binary endpoint, patients enroll in matched pairs and $D_i = Y_{T,i} - Y_{C,i}$ is $+1$, $-1$ or $0$. [12/a-betting-martingale-for-a-binary-endpoint] With a betting fraction $\lambda$ the product $E_n = \prod (1 + \lambda D_i)$ is a test martingale for the composite null that the two arms have the same response probability. [12/a-betting-martingale-for-a-binary-endpoint] The common response probability never needs to be estimated. [12/a-betting-martingale-for-a-binary-endpoint]

A single-distribution [[likelihood-ratio]] is a test martingale, and so is any average of them, which gives the [[mixture-method]]. [sec-evalues-lr]

## Pitfalls

- Under the null the average wealth stays at one dollar, yet the typical path drifts down, because rare large excursions hold the average up. [12/a-betting-martingale-for-a-binary-endpoint]
- Not every sequential statistic is a martingale. The weaker notion is an [[e-process]]. [12/e-processes]

## Check yourself

- Q: A gambler's expected wealth after the next bet equals the wealth now under the null. What is the process called? A: A test martingale. [12/test-martingales-and-villes-inequality]
- Q: Under a true null, will most simulated wealth paths rise or fall? A: Most drift down, even though the average stays at one. [12/a-betting-martingale-for-a-binary-endpoint]
