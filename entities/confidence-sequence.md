---
id: confidence-sequence
name: Confidence sequence
type: method
aliases: []
level: 3
summary: A sequence of intervals that covers the true parameter at all sample sizes at once with probability at least 1 minus alpha, so it can be read at any stopping time.
chapters: ['12']
home: sec-evalues-p
sections: [sec-evalues-p, sec-evalues-reg, sec-evalues-pay]
prerequisites: [e-process, confidence-interval]
related:
- {rel: special-case-of, to: anytime-valid-inference}
equations: []
functions: []
results: []
lab: [08-e-values]
cites: [darling1967confidence, robbins1970statistical, lai1976confidence, jennison1984repeated, sokolova2026]
---
## What it is

A confidence sequence is a sequence of intervals $C_n$ such that $\mathbb{P}(\theta \in C_n \text{ for all } n) \ge 1-\alpha$. It is built by inverting the e-process over null values. [sec-evalues-p]

## Why it matters

It can be read at any time, including the time the data monitoring committee stopped the trial. [sec-evalues-p] The estimation principle in the Adaptive Designs guidance, that estimates be "sufficiently reliable", is what the confidence sequence is for. [sec-evalues-p]

## In the book

The idea goes back to Darling and Robbins, was studied by Lai, and has a group sequential counterpart in the repeated confidence interval of Jennison and Turnbull. [sec-evalues-p] A confidence sequence is wider than a fixed-sample interval at the same $n$. [sec-evalues-p]

The protocol wording in the chapter reports always-valid p-values and a 95 percent confidence sequence in the clinical study report at the final analysis. [sec-evalues-reg] The book suggests running an e-process beside a Bayesian rule and reporting the e-value, its always-valid p-value and a confidence sequence as a frequentist evidential record. [sec-evalues-pay]

## Pitfalls

- The extra width is the price of validity at every stopping time. [sec-evalues-p]

## Check yourself

- Q: Is a confidence sequence narrower or wider than a fixed-sample interval at the same $n$? A: Wider. [sec-evalues-p]
- Q: What can it be read at that a fixed interval cannot? A: Any time, including the time the DMC stopped the trial. [sec-evalues-p]
