---
id: equivalence-trial
name: Equivalence trial
type: design
aliases: [equivalence]
level: 2
summary: A trial asking that the difference lie inside a two-sided margin, analyzed by two one-sided tests or by an interval inside the margin.
chapters: ['4']
home: 4/equivalence
sections: [sec-testing-ni]
prerequisites: [noninferiority-trial, noninferiority-margin]
related:
- {rel: uses, to: two-one-sided-tests}
- {rel: generalizes, to: bioequivalence}
equations: []
functions: []
results: []
lab: []
cites: [dunnett1977equivalence]
---
## What it is
An equivalence trial asks for the difference to lie inside a two-sided margin, $-\log M<\gamma<\log M$ on the log scale, so the hazard ratio lies between $1/M$ and $M$. [4/equivalence] The standard analysis is two one-sided tests, one against each end of the margin, and equivalence is declared only if both reject. This is the same as the $(1-2\alpha)$ confidence interval lying entirely inside $(-\log M, \log M)$: 90% for the usual bioequivalence test at 0.05 per side, 95% at 0.025 per side. [4/equivalence]

## Why it matters
Putting the burden of proof on the claim of similarity, by reversing the roles of null and alternative, goes back to Dunnett and Gent for equivalence. [sec-testing-ni] Bioequivalence studies and some biosimilar comparisons use this form. [4/equivalence]

## In the book
Most clinical efficacy trials that say equivalence mean noninferiority, and the one-sided test is the more common. [4/equivalence] The upper bound of a two-sided 95% interval is the standard one-sided 0.025 noninferiority test, and noninferiority imposes no corresponding lower-bound requirement. [4/equivalence]

## Pitfalls
A sponsor who wants noninferiority should say so. Framing the trial as equivalence adds a lower-bound requirement that the question does not need. [4/equivalence]

## Check yourself
- Q: When is equivalence declared? A: Only if both one-sided tests reject. [4/equivalence]
- Q: How many bounds does noninferiority check? A: One, the upper bound. [4/equivalence]
