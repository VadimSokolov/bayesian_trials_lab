---
id: lindleys-paradox
name: Lindley's paradox
type: concept
aliases: [Lindley paradox]
level: 3
summary: 'A fixed p-value does not mean a fixed amount of evidence: holding p constant while the trial grows turns a rejection of the null into evidence for it.'
chapters: ['7']
home: sec-evidence-lindley
sections: [sec-evidence-implied, sec-evidence-bayestype1]
prerequisites: [bayes-factor, p-value, ockham-penalty]
related:
- {rel: precedes, to: two-bars}
equations: []
functions: [bf10_normal, posterior_null]
results: []
lab: []
cites: [lindley1957statistical, jeffreys1939theory, bartlett1957comment]
---

## What it is

Lindley, following Jeffreys, noticed that the Ockham penalty can turn a rejection of the null into evidence for the null [sec-evidence-lindley]. Take trials of increasing size that all end with a two-sided p-value of exactly 0.01, so $|Z_n| = 2.576$. The frequentist reading is the same each time. The Bayes factor is not, because the penalty keeps growing while $Z_n^2$ stays at 6.63 [sec-evidence-lindley].

## Why it matters

A fixed p-value threshold cannot mean a fixed amount of evidence as a trial grows [sec-evidence-lindley]. This is why very large trials sometimes find significant effects that are clinically trivial [sec-evidence-lindley]. The Bayesian remedy is to ask whether $\theta$ exceeds a clinically relevant $a$, not whether it is exactly zero [sec-evidence-lindley].

## In the book

With prior $N(0, 0.25^2)$ and prior probability 0.5 on the null, at $n = 100$ the Bayes factor is 6.5 and the posterior probability of the null is 13%. By $n = 10{,}000$ the Bayes factor is 1.1 and that probability is 48%. At $n = 10^6$ it is 90% [sec-evidence-lindley].

## Pitfalls

The paradox lives at sample sizes far larger than those of most confirmatory trials of a large effect, and with a vague prior on a point null. It also depends on the prior scale. Picking $\tau$ after seeing the data is the dishonest reaction [sec-evidence-lindley].

## Check yourself

- Q: Two trials both give p = 0.01, one with 100 patients and one with a million. Which has stronger evidence against the null? A: The smaller one. At $n = 10^6$ the posterior probability of the null is 90% [sec-evidence-lindley].
- Q: What does the Bayes factor do as n grows with p fixed? A: It first rises, then falls below one [sec-evidence-lindley].
