---
id: phase-4-trial
name: Phase IV study
type: design
aliases: [phase IV, postmarketing]
level: 1
summary: 'Studies after approval: required postmarketing trials, surveillance of adverse events and confirmatory trials, where rare harms become visible.'
chapters: ['2', '13']
home: sec-lifecycle-p4
sections: [2/key-points, sec-lifecycle-reading]
prerequisites: [phase-3-trial]
related:
- {rel: uses, to: gamma-poisson-shrinker}
- {rel: uses, to: empirical-bayes}
- {rel: uses, to: safety-signal}
equations: []
functions: []
results: []
lab: []
cites: [bresalier2005approve, bombardier2000vigor, juni2004rofecoxib, dumouchel1999bayesian]
---
## What it is
Approval is not the end of learning. Phase IV comprises postmarketing studies required or agreed at approval, observational surveillance of adverse events, and confirmatory trials for drugs given accelerated approval on a surrogate endpoint. [sec-lifecycle-p4] Premarketing trials are often too small or too short to characterize rare harms. [sec-lifecycle-p4]

## Why it matters
Postmarketing surveillance is a sequential decision problem in which the action is to warn, restrict or withdraw, and the cost of waiting is counted in patients harmed. [sec-lifecycle-p4]

## In the book
Rofecoxib was approved in 1999 and withdrawn on 30 September 2004 after the APPROVe trial. In 2,586 patients with a history of colorectal adenoma it showed 46 confirmed thrombotic events on the drug against 26, rate ratio 1.92 (95% CI 1.19 to 3.11). [sec-lifecycle-p4] VIGOR had earlier shown fewer gastrointestinal events than naproxen but more myocardial infarctions. A cumulative meta-analysis found a clear excess of myocardial infarction at the end of 2000. [sec-lifecycle-p4]

Spontaneous reporting systems compare the observed count for a drug and event pair with the count expected under independence. The gamma-Poisson shrinker reports a posterior estimate, so an estimate from three reports is shrunk heavily toward the common distribution and one from three hundred is not. [sec-lifecycle-p4]

## Pitfalls
Evidence of harm can be in hand years before action. [2/key-points]

## Check yourself
- Q: How were the rofecoxib thrombotic events split in APPROVe? A: 46 on the drug against 26. [sec-lifecycle-p4]
- Q: Why shrink crude reporting ratios? A: They are unstable when counts are small. [sec-lifecycle-p4]
