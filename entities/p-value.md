---
id: p-value
name: P-value
type: concept
aliases: [p value]
level: 1
summary: The probability, under the null and over repetitions of the trial, of a result at least as favorable to the drug as the one observed.
chapters: ['4', '7', A]
home: sec-testing-pvalue
sections: [sec-testing-sampling, 4/key-points, 4/andromeda-shock-what-not-significant-does-and-does-not-mean]
prerequisites: [sampling-distribution]
related:
- {rel: contrasts-with, to: posterior-probability-of-benefit}
- {rel: contrasts-with, to: confidence-interval}
- {rel: uses, to: one-sided-test}
equations: [eq-testing-pvalue]
functions: []
results: []
lab: [02-p-values, 00-are-they-different]
cites: [wasserstein2016asa_pvalue, goodman2008dirty_dozen]
---
## What it is
The ingredients are a null hypothesis $H_0$ (a zero average effect), a test statistic that is large when the data favor the drug, and the data. [sec-testing-pvalue] Then

$$
p \;=\; \mathbb{P}\bigl(\text{test statistic at least as favorable to the drug as the one observed} \;\bigm|\; H_0 \text{ true}\bigr) ,
$$

equation eq-testing-pvalue, with the probability taken over repetition of the trial. [sec-testing-pvalue] It answers: if nothing is going on, how often would luck look this good? [sec-testing-pvalue]

## Why it matters
Sloppy definitions drive misuse. A p-value of 0.014 does not mean a 1.4% chance that the drug does not work. [sec-testing-pvalue] It depends on the plan: the same 9 heads and 3 tails have different p-values under different stopping rules. [sec-testing-pvalue] It depends on how many questions were asked, and ICH E9 section 5.6 says multiplicity may necessitate an adjustment. [sec-testing-pvalue]

## In the book
In the simulated trial, about 1.0% of null reruns reach a difference of 0.15 or larger, and the p-values from the three methods range from 0.014 to 0.021. [sec-testing-sampling] The ANDROMEDA-SHOCK trial gave P = .06 with a hazard ratio of 0.75 (95% CI 0.55 to 1.02), which is inconclusive, not evidence of no effect. [4/andromeda-shock-what-not-significant-does-and-does-not-mean]

## Pitfalls
It mixes the effect size with the trial size. A large p-value is not evidence of no effect. [sec-testing-pvalue] The ASA statement collects these points and Goodman lists twelve misreadings. [sec-testing-pvalue]

## Check yourself
- Q: Is a p-value the probability the null is true? A: No, it is about the data given the hypothesis. [sec-testing-pvalue]
- Q: Why must interim looks be pre-specified? A: The p-value depends on the stopping rule and the number of analyses. [sec-testing-pvalue]
