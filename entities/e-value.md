---
id: e-value
name: E-value
type: concept
aliases: [e value, betting score]
level: 2
summary: A nonnegative statistic whose expectation under the null is at most one, read as the payoff of a fair bet against the null.
chapters: ['12']
home: sec-evalues-bets
sections: [sec-evalues-bets, 12/the-definition, sec-evalues-bf, 12/test-martingales-and-villes-inequality, 12/a-betting-martingale-for-a-binary-endpoint, sec-evalues-p]
prerequisites: [type-i-error]
related:
- {rel: generalizes, to: test-martingale}
- {rel: special-case-of, to: anytime-valid-inference}
- {rel: contrasts-with, to: bayes-factor}
- {rel: uses, to: likelihood-ratio}
equations: []
functions: [ev_betting_paths, ev_first_cross]
results: []
lab: [08-e-values]
cites: [shafer2011test, shafervovk2019game, vovk2021evalues, sokolova2026]
---
## What it is

An e-value for a null hypothesis $H_0$ is a nonnegative random variable $E$ whose expectation under every distribution in $H_0$ is at most one. [12/the-definition]

The name suggests a bet. A gambler stakes one dollar against the null, and if the null is true the expected wealth afterwards is at most one dollar. [12/the-definition] An observed e-value of 20 means the data multiplied by 20 an amount of evidence that is fair under the null. [12/the-definition]

## Why it matters

Markov's inequality turns an e-value into a test: reject $H_0$ when $E \ge 1/\alpha$. [12/the-definition] At $\alpha = 0.025$ the threshold is $E \ge 40$. [12/the-definition] For a single fixed sample this is only a new way of writing a test. The new thing is what happens when the data keep coming, because a sequence of e-values built as a [[test-martingale]] stays valid at every stopping time. [12/test-martingales-and-villes-inequality]

## In the book

A Bayes factor against a simple null is an e-value, because its expectation under the null is one. [sec-evalues-bf] The same number, say 40, is "strong evidence" on a Jeffreys scale and "a level 0.025 test" on the e-value scale. [sec-evalues-bf] The difference is one of calibration, not of statistic. [sec-evalues-bf]

In the binary two-arm trial the e-value is a product of terms $1 + \lambda D_i$, a bet against no particular prior. [12/a-betting-martingale-for-a-binary-endpoint] [sec-evalues-bf]

## Pitfalls

- A Bayes factor with a prior on a composite null parameter is not an e-value in general. [sec-evalues-bf]
- Most e-values are not Bayes factors, so the e-value framework is wider than Bayes factors. [sec-evalues-bf]
- A fixed-sample e-value converted by $p = \min(1, 1/E)$ is a valid but conservative p-value. [sec-evalues-p]

## Check yourself

- Q: A trial ends with $E = 20$. What is the most you can say about the null probability of such an outcome? A: At most 1/20, by Markov's inequality. [12/the-definition]
- Q: Is a Bayes factor of 3 enough to reject at a low error rate? A: No. Rejecting at 3 has a frequentist type I error as high as 1/3. [sec-evalues-bf]
