---
id: posterior-predictive-distribution
name: Posterior predictive distribution
type: concept
aliases: [predictive distribution]
level: 2
summary: The distribution of future data after averaging over the uncertainty about the parameter, wider than a plug-in prediction.
chapters: ['6', '15']
home: sec-predictive-dist
sections: [sec-bayes-summary]
prerequisites: [posterior-distribution]
related: []
equations: [eq-predictive]
functions: [dbetabinom]
results: []
lab: [07-interim-looks]
cites: []
---
## What it is
Decisions depend on what will happen next, such as how many of the next 50 patients will respond. The posterior predictive distribution averages the model for future data over the posterior: [sec-predictive-dist]

$$
p(\tilde y \mid y) = \int p(\tilde y \mid \theta)\, \pi(\theta \mid y)\, d\theta .
$$

## Why it matters
For a Beta$(a', b')$ posterior and $m$ future patients, the number of future responders follows a beta-binomial distribution with mean $m a' / (a' + b')$. [sec-predictive-dist]

The traditional analogue is a plug-in calculation: assume $p = \hat p$ and compute a binomial. It ignores the uncertainty in $\hat p$ and is too narrow. [sec-predictive-dist]

Futility rules and Goldilocks-type sample-size choices are built on it. [sec-predictive-dist] The same two-stage logic, draw the parameter from its posterior and then the future data from the model, gives the probability that a trial in progress will succeed at its final analysis. [sec-predictive-dist]

## In the book
After 45 of 100 and a flat prior, the treatment-arm posterior is Beta(46, 56). The next 50 patients are predicted with the beta-binomial function `dbetabinom`. [sec-predictive-dist] A prediction made as if $\hat p = 0.45$ were the truth would be overconfident by about 20 percent. [sec-predictive-dist] In Table 6.8 the predictive standard deviation is 4.27 against 3.52 for the plug-in binomial, and the 95% predictive interval is 14 to 31 responders. [sec-predictive-dist]

## Pitfalls
The predictive is for future data and the posterior is for the parameter. [sec-predictive-dist]

## Check yourself
- Q: Which is wider, the posterior predictive or the plug-in binomial? A: The posterior predictive, because it includes the uncertainty about $p$. [sec-predictive-dist]
- Q: What distribution gives the number of future responders from a Beta posterior? A: Beta-binomial. [sec-predictive-dist]
