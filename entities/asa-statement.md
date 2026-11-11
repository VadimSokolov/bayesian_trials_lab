---
id: asa-statement
name: ASA statement on p-values
type: principle
aliases: [ASA statement, dirty dozen]
level: 1
summary: The American Statistical Association's 2016 consensus on what a p-value can and cannot show, read together with Goodman's list of twelve common misreadings.
chapters: ['7']
home: sec-evidence-asa
sections: [sec-evidence, sec-evidence-pvalue, sec-evidence-practice]
prerequisites: [p-value]
related: []
equations: []
functions: []
results: []
lab: [02-p-values]
cites: [wasserstein2016asa_pvalue, goodman2008dirty_dozen]
---

## What it is

The ASA statement (Wasserstein and Lazar, 2016) is the consensus statement of the profession on what a p-value can bear, and regulators and journals cite it [sec-evidence]. Goodman's "dirty dozen" lists twelve misreadings of the p-value [sec-evidence-asa]. A p-value is the probability of a test statistic at least as large as the observed one if the null hypothesis were true [sec-evidence-pvalue].

## Why it matters

Three misreadings recur in every trial team [sec-evidence-asa]. The fix the statement suggests is to surround the p-value, not to abolish it: a pre-specified primary analysis, an effect estimate with an interval, and an account of everything that was looked at [sec-evidence-asa].

## In the book

- "p = 0.03 means there is a 3% chance the null is true" is false. The p-value is a probability of data given the null, and the probability of the null needs a prior [sec-evidence-asa].
- "A non-significant result means there is no effect" is false. EOLIA reported p = 0.09, and a later Bayesian reanalysis put the probability that ECMO lowers mortality between 88% and 99%, depending on the prior [sec-evidence-asa].
- "p = 0.05 in one trial and p = 0.001 in another means the second effect is bigger" is false, because the p-value mixes effect size with trial size [sec-evidence-asa].

## Pitfalls

The p-value is not a bad tool. It underlies the type I error control that regulators require [sec-evidence-pvalue]. Trouble starts when it is asked a question it was not built for [sec-evidence-pvalue].

## Check yourself

- Q: A trial reports p = 0.03. Is there a 3% chance the drug does nothing? A: No. The p-value is about the data given the null, not the null given the data [sec-evidence-asa].
- Q: A trial has p = 0.09. Does the drug do nothing? A: Not necessarily. The trial only failed to clear the bar [sec-evidence-asa].
