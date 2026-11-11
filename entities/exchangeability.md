---
id: exchangeability
name: Exchangeability
type: concept
aliases: []
level: 2
summary: The judgment that the probability of a set of outcomes does not depend on the order in which patients are listed.
chapters: ['6', '19']
home: sec-exchangeability
sections: [sec-updating, sec-ess]
prerequisites: []
related: []
equations: []
functions: []
results: []
lab: []
cites: [definetti1937foresight, gelman2013bda, lindley1985]
---
## What it is
Exchangeability is a weaker symmetry than independence: the probability assigned to a set of outcomes does not depend on the order of the patients. Eight tosses with four point up are equally probable in the order 1,0,1,0,1,0,1,0 and in 0,1,1,0,1,0,0,1. [sec-exchangeability]

Independent and identically distributed outcomes are always exchangeable, but not conversely. Exchangeability makes no reference to a parameter. It is a statement about beliefs concerning data not yet seen. [sec-exchangeability]

## Why it matters
Given $\theta$, outcomes are independent. But a trial does not have $\theta$. After 500 tosses with 499 point up, nobody believes the next toss is as uncertain as the first. [sec-exchangeability]

For the trialist, a response model and a prior come as a package, and the response model assumes exchangeability within each arm or within covariate strata. [sec-exchangeability]

## In the book
Exchangeability is a judgment about the patients, and it can fail. If patients enrolled in the first year differ from later ones, or sites differ, the order matters. Time trends, site effects and covariates relax it to "exchangeable within strata". [sec-exchangeability]

Batch-wise updating is valid because $y_1$ and $y_2$ are conditionally independent given $\theta$, which exchangeability delivers. [sec-updating]

## Pitfalls
The same judgment returns when information is borrowed from earlier studies. [sec-exchangeability] 

## Check yourself
- Q: Does exchangeability imply independence? A: No. Independent outcomes are exchangeable but not the reverse. [sec-exchangeability]
- Q: Can it fail? A: Yes, with time trends or site effects. [sec-exchangeability]
