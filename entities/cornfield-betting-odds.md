---
id: cornfield-betting-odds
name: Cornfield and the betting odds of 1966
type: history
aliases: [Cornfield]
level: 3
summary: In 1966 Cornfield proposed relative betting odds as a sequential stopping criterion, an early form of the mixture e-value that lost to alpha spending.
chapters: ['12']
home: 12/cornfield-and-the-betting-odds-of-1966
sections: [12/cornfield-and-the-betting-odds-of-1966]
prerequisites: [likelihood-ratio]
related:
- {rel: precedes, to: mixture-method}
- {rel: contrasts-with, to: spending-function}
- {rel: special-case-of, to: test-martingale}
equations: []
functions: []
results: []
lab: [08-e-values]
cites: [cornfield1966bayesian, cornfield1969bayesian, cornfield1966sequential, shafer2011test, vovk2021evalues]
---
## What it is

Cornfield proposed what he called relative betting odds as a sequential stopping criterion. The odds are the likelihood ratio of the alternative to the null, accumulated as the data arrive and averaged over a prior on the alternative. [12/cornfield-and-the-betting-odds-of-1966] His companion argument was that the stopping rule should not change the strength of the evidence. [12/cornfield-and-the-betting-odds-of-1966]

## Why it matters

For a simple null the betting odds are a [[test-martingale]], so [[villes-inequality|Ville's inequality]] bounds the probability that they ever cross a high level. That guarantee does not need his argument. [12/cornfield-and-the-betting-odds-of-1966]

## In the book

His proposal lost to alpha spending for a reason that is not statistical. Betting odds require a declared prior on the alternative, and the reviewer has to accept it. [12/cornfield-and-the-betting-odds-of-1966] The [[mixture-method]] of the chapter makes the same trade. [12/cornfield-and-the-betting-odds-of-1966] The regulatory conversation about registering the prior is the modern version of that objection. [12/cornfield-and-the-betting-odds-of-1966]

Shafer and colleagues connect test martingales, Bayes factors and p-values, and Vovk and Wang develop calibration and combination rules for e-values. [12/cornfield-and-the-betting-odds-of-1966]

## Check yourself

- Q: Why did Cornfield's betting odds lose to alpha spending? A: They need a declared prior on the alternative that the reviewer must accept. [12/cornfield-and-the-betting-odds-of-1966]
- Q: What makes the odds valid at any stopping time for a simple null? A: They are a test martingale, so Ville's inequality applies. [12/cornfield-and-the-betting-odds-of-1966]
