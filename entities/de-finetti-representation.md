---
id: de-finetti-representation
name: de Finetti representation
type: principle
aliases: [de Finetti, de Finetti theorem]
level: 3
summary: An exchangeable sequence of binary outcomes is a mixture of independent coins, which produces both a parameter and a prior from one judgment.
chapters: ['6']
home: sec-exchangeability
sections: [6/key-points]
prerequisites: [exchangeability]
related:
- {rel: uses, to: prior-distribution}
equations: [eq-definetti]
functions: []
results: []
lab: []
cites: [definetti1937foresight, gelman2013bda, lindley1985]
---
## What it is
de Finetti's representation theorem says what an exchangeable sequence of binary outcomes looks like. If any number of further outcomes could be added and the sequence stays exchangeable, there is a probability distribution $\Pi$ on $[0,1]$ such that [sec-exchangeability]

$$
\mathbb{P}(y_1, \ldots, y_n) = \int_0^1 \prod_{i=1}^n \theta^{y_i} (1-\theta)^{1-y_i} \, d\Pi(\theta) .
$$

The mixing distribution $\Pi$ need not have a density. [sec-exchangeability]

## Why it matters
Read it as a mixture over the unknown response rate of independent-coin probabilities. The theorem does not assume a parameter and then a prior. It produces both from the single judgment of exchangeability. [sec-exchangeability]

The parameter $\theta$ is the limiting fraction of responders, and $\Pi$ is our uncertainty about it. [sec-exchangeability]

## In the book
The practical content is that "responses are Bernoulli($p$) given $p$" and the prior on $p$ come as a package. A protocol that specifies a likelihood without a prior has specified half of a Bayesian model. The traditional protocol specifies the likelihood half and handles the other half through the sampling distribution. [sec-exchangeability]

Gelman and colleagues and Lindley give the full treatment, including the proof and the link to subjective probability. [sec-exchangeability]

## Pitfalls
The theorem needs exchangeability, a judgment that can fail. [sec-exchangeability] The book uses it informally. [sec-exchangeability]

## Check yourself
- Q: Does the theorem assume a prior? A: No. It produces the parameter and the prior from exchangeability. [sec-exchangeability]
- Q: What is $\theta$ in the theorem? A: The limiting fraction of responders. [sec-exchangeability]
