---
id: two-one-sided-tests
name: Two one-sided tests
type: method
aliases: [TOST]
level: 2
summary: A test of equivalence that rejects two one-sided nulls, one at each end of the equivalence interval, and declares equivalence only if both reject.
chapters: ['2', '4']
home: sec-lifecycle-be
sections: [4/equivalence]
prerequisites: [confidence-interval, one-sided-test]
related:
- {rel: alternative-to, to: posterior-distribution}
- {rel: part-of, to: equivalence-trial}
equations: []
functions: []
results: []
lab: []
cites: [schuirmann1987, fda_be_stat_2026, westlake1976symmetrical, hauck1984equivalence]
---
## What it is
TOST runs one one-sided test against each end of the equivalence margin, and equivalence is declared only if both reject. This is the same as the confidence interval lying entirely inside the margin. [4/equivalence] For bioequivalence it is applied to $\eta = \log\rho$ and is equivalent to checking that the 90 percent confidence interval lies inside $(\log 0.80, \log 1.25)$. [sec-lifecycle-be]

## Why it matters
Schuirmann's procedure gives the confidence-interval criterion a test form. Westlake had proposed a symmetric confidence interval for the same purpose. [sec-lifecycle-be] TOST is the standard in FDA's final guidance of May 2026. [sec-lifecycle-be]

## In the book
Under a reference prior each one-sided posterior tail probability equals the corresponding one-sided TOST p-value. If both p-values are below 0.05, the posterior probability of equivalence exceeds 0.90. [sec-lifecycle-be] The TOST p-value is the larger of the two one-sided p-values. [sec-lifecycle-be]

## Pitfalls
Most clinical efficacy trials that say equivalence mean noninferiority, and the one-sided test is the more common. Framing a trial as equivalence adds a lower-bound requirement that a noninferiority question does not need. [4/equivalence]

## Check yourself
- Q: When is equivalence declared by TOST? A: Only when both one-sided tests reject. [4/equivalence]
- Q: What is the TOST p-value reported for a data set? A: The larger of the two one-sided p-values. [sec-lifecycle-be]
