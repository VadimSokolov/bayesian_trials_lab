---
id: rebyota-trial
name: REBYOTA
type: trial
aliases: [REBYOTA trial, RBX2660, PUNCH CD3]
level: 2
summary: A phase 3 trial of a fecal microbiota product that used a Bayesian hierarchical model with dynamic borrowing from a phase 2b study.
chapters: ['19', '3', '14', '23']
home: sec-borrowing-rebyota
sections: [sec-borrowing-rebyota, sec-borrowing-guide, sec-borrowing-keypoints]
prerequisites: [hierarchical-model, posterior-probability-success-criterion]
related:
- {rel: illustrates, to: bayesian-borrowing}
- {rel: governed-by, to: fda-bayesian-draft-guidance-2026}
- {rel: illustrates, to: one-trial-with-confirmatory-evidence}
equations: []
functions: []
results: []
lab: [09-adaptive-bayesian]
cites: [fda_rebyota_briefing_2022, fda_bayesian_2026]
---
## What it is

REBYOTA (RBX2660) prevents recurrence of *Clostridioides difficile* infection after antibiotics and was approved on 30 November 2022. The sponsor first planned two phase 3 trials of about 300 patients each. After FDA's July 2013 enforcement discretion on fecal microbiota transplantation made enrollment difficult, it proposed a single phase 3 trial (study 2017-01, PUNCH CD3) plus a Bayesian integration of phase 2b study 2014-01. [sec-borrowing-rebyota]

## Why it matters

FDA wrote that the studies are generally exchangeable but not identical, and accepted a hierarchical model with dynamic borrowing, in which the amount borrowed depends on how similar the treatment effect is in the two studies. The January 2026 FDA draft guidance cites it as its example of borrowing from a previous trial of the same drug. [sec-borrowing-rebyota]

## In the book

Two success thresholds on the posterior probability of superiority were set as analogues of one-sided type I error rates of 0.025 (the usual level for one trial) and 0.00125 (a very persuasive single trial that could stand in for two), and after adjustment they were 0.9750338 and 0.9993275. The result was a success rate of 0.71 on RBX2660 against 0.57 on placebo (95% credible interval 0.02 to 0.24 for the difference), with posterior probability of superiority 0.991, meeting the one-trial threshold and missing the two-trial threshold. [sec-borrowing-rebyota] FDA requested a refined analysis aligning the success definition, the assessment period (9 weeks against 8 weeks) and the analysis populations. Both analyses reached the same conclusion. [sec-borrowing-rebyota]

## Pitfalls

The briefing document gives no borrowing weight or effective sample size, so the amount borrowed cannot be read from it. [sec-borrowing-rebyota]

## Check yourself

- Q: Did 0.991 meet the one-trial or the two-trial threshold? A: The one-trial threshold only. [sec-borrowing-rebyota]
- Q: What was the lesson? A: Data alignment, not the model. [sec-borrowing-rebyota]
