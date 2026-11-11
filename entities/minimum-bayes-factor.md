---
id: minimum-bayes-factor
name: Minimum Bayes factor
type: method
aliases: [calibrating the p-value, p-value calibration]
level: 2
summary: A bound on how strongly any prior in a stated class can make the data favor the alternative, used to calibrate a p-value.
chapters: ['7']
home: sec-evidence-calibration
sections: [7/a-worked-comparison, sec-evidence-sidebyside]
prerequisites: [bayes-factor, p-value]
related:
- {rel: contrasts-with, to: false-positive-risk}
equations: [eq-sbb]
functions: [min_bf]
results: []
lab: [02-p-values]
cites: [sellke2001calibration, benjamin2018redefine, johnson2013umpbt]
---

## What it is

Sellke, Bayarri and Berger showed that for $p < 1/e$ and a stated class of alternatives, the Bayes factor in favor of the null is at least [sec-evidence-calibration]:

$$
\mathrm{BF}_{01} \;\ge\; -e\, p \log p.
$$

This is eq-sbb. The class has a non-increasing hazard for $-\log p$ under the alternative. The bound is not a statement about every prior [sec-evidence-calibration].

## Why it matters

It says something that does not depend on a particular prior, at the cost of being generous to the alternative. With even prior odds it gives a lower bound on the posterior probability of the null [sec-evidence-calibration].

## In the book

A two-sided p-value of 0.05 corresponds at best to a Bayes factor of about 2.5 and a posterior probability of the null of at least 29%. So the common misreading of p = 0.05 as "95% sure the effect is real" overstates: even the alternative most favorable in the class gives at most 71% [sec-evidence-calibration]. At p = 0.01 the Bayes factor is at most 8 and the null keeps at least 11%. Only at p = 0.001 does it reach 53 [sec-evidence-calibration]. In a worked trial with Z = 2.8 the bound allows at most 13.6 for $\mathrm{BF}_{10}$ [7/a-worked-comparison].

## Pitfalls

The bound does not replace a design-specific calculation, and it understates what a reasonable analysis would find [sec-evidence-calibration]. It should be quoted with its class [sec-evidence-calibration]. The proposal to tighten thresholds for discovery is controversial and does not apply to regulatory trials [sec-evidence-calibration].

## Check yourself

- Q: What posterior probability of the null does p = 0.05 allow at the very least, from even odds? A: About 29% [sec-evidence-calibration].
- Q: Why is the bound generous to the alternative? A: It asks which alternative in the class would make the data look best for $H_1$ [sec-evidence-calibration].
