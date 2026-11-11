---
id: likelihood
name: Likelihood
type: concept
aliases: [likelihood function]
level: 1
summary: The probability of the observed data viewed as a function of the unknown parameter; the Bayesian and traditional analyses share it.
chapters: ['6']
home: sec-bayes
sections: [sec-bayes-rule, 6/looking-does-not-change-the-posterior, sec-normal-normal, sec-beta, sec-exchangeability]
prerequisites: [bayes-rule]
related: []
equations: [eq-bayes]
functions: []
results: []
lab: [01-prior-posterior]
cites: [berger1988likelihood]
---
## What it is
The likelihood $p(y \mid \theta)$ is the probability of the observed result under each possible value of the unknown parameter. In the diagnostic example, $\mathbb{P}(+ \mid D)$ viewed as a function of the unknown state is the likelihood. [sec-bayes-rule]

The likelihood enters Bayes rule as the factor that multiplies the prior:

$$
\pi(\theta \mid y) = \frac{p(y \mid \theta)\, \pi(\theta)}{\int p(y \mid \theta')\, \pi(\theta')\, d\theta'} \;\propto\; p(y \mid \theta)\, \pi(\theta),
$$

This is equation eq-bayes. [sec-bayes-rule]

## Why it matters
The traditional analysis uses the same likelihood. The maximum likelihood estimate is the value of $\theta$ at which $p(y \mid \theta)$ peaks, and a z test is a calculation on its sampling distribution. The Bayesian adds only the prior and the multiplication. [sec-bayes-rule]

The likelihood principle says that, given the data, the evidence about $\theta$ depends on the data only through the likelihood function, not on the stopping rule or on results that might have been observed but were not. [6/looking-does-not-change-the-posterior]

## In the book
For a time-to-event trial with $d$ total events, the book uses the approximate likelihood $\hat\theta \mid \theta \sim N(\theta, 4/d)$ for $\theta = -\log \mathrm{HR}$. It is an approximation to the Cox partial likelihood in large samples. [sec-normal-normal]

For a binary endpoint, the likelihood of $h$ heads and $t$ tails is $\theta^{h}(1-\theta)^{t}$, which has the algebraic form of a Beta density. [sec-beta]

A protocol that specifies a likelihood without a prior has specified half of a Bayesian model. [sec-exchangeability]

## Pitfalls
Because the posterior depends on the data only through the likelihood, it is unchanged by the decision to look. The type I error of a stopping rule is a different matter, since it is a property of the procedure over repeated trials. [6/looking-does-not-change-the-posterior]

## Check yourself
- Q: Where does the likelihood peak for the traditional estimate? A: At the maximum likelihood estimate. [sec-bayes-rule]
- Q: Does the likelihood depend on the stopping rule? A: No, by the likelihood principle the evidence depends on the data only through it. [6/looking-does-not-change-the-posterior]
