---
id: false-discovery-rate
name: False discovery rate
type: concept
aliases: [FDR]
level: 2
summary: The expected proportion of false rejections among the rejections, the target for screens and signal detection where no confirmatory claim is made.
chapters: ['10']
home: sec-mult-fdr
sections: [sec-mult-fdr]
prerequisites: [familywise-error-rate]
related:
- {rel: alternative-to, to: bonferroni-correction}
- {rel: uses, to: empirical-bayes}
equations: []
functions: []
results: []
lab: []
cites: [benjamini1995controlling, benjamini2001control, efron2008microarrays, berry1999multiple, scott2006exploration, scott2010multiplicity, mehrotra2012flagging]
---

## What it is

For hundreds of biomarkers, signatures or adverse event terms the aim is to find most of the real signals and tolerate a known share of false leads. Benjamini and Hochberg defined the false discovery rate as the expected proportion of false rejections among the rejections. [sec-mult-fdr]

Their step-up procedure orders the $p$-values, finds the largest $j$ with $p_{(j)} \le jq/m$, and rejects the hypotheses with the $j$ smallest $p$-values. It controls the rate at $q$ for independent $p$-values and under positive dependence. [sec-mult-fdr]

## Why it matters

False discovery rate control is used for screening, exploratory endpoints and signal detection. It is not used for a confirmatory claim, which stays under familywise control. [sec-mult-fdr]

## In the book

In a simulated screen of 1000 hypotheses, 100 with a true effect (a $z$ statistic centered at 3), all at level 0.025 and averaged over 1000 replications, the book compares the unadjusted test, Bonferroni, Holm and Benjamini-Hochberg. [sec-mult-fdr]

The Bayesian reading is Efron's two-groups model: each statistic comes from the null with probability $\pi_0$ and from an alternative otherwise. The local false discovery rate is the posterior probability of the null given the statistic. [sec-mult-fdr]

Scott and Berger show that if the prior probability of a true effect is learned from all hypotheses, the posterior imposes a penalty that grows with the number of hypotheses when few signals are present among many. The penalty relaxes as more signals appear. [sec-mult-fdr]

## Pitfalls

- Benjamini-Hochberg thresholds an estimate of the tail-area false discovery rate with the null proportion set to one. [sec-mult-fdr]
- Using it for a confirmatory claim would drop the familywise guarantee that guidance expects. [sec-mult-fdr]

## Check yourself

- Q: When is false discovery rate control the right target? A: For screens, exploratory endpoints and signal detection, not confirmatory claims. [sec-mult-fdr]
- Q: What is the local false discovery rate? A: The posterior probability of the null given the statistic in the two-groups model. [sec-mult-fdr]
