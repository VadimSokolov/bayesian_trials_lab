---
id: anytime-valid-inference
name: Anytime-valid inference
type: concept
aliases: [always valid p-value, optional stopping]
level: 2
summary: Inference whose error guarantee holds at every stopping time, however the looks were chosen, built from e-values and test martingales.
chapters: ['12']
home: sec-evalues
sections: [sec-evalues, sec-evalues-gap, sec-evalues-p, sec-evalues-pay, sec-evalues-reg, sec-evalues-surcharge, sec-evalues-practice]
prerequisites: [type-i-error, interim-analysis]
related:
- {rel: contrasts-with, to: group-sequential-design}
- {rel: uses, to: e-value}
- {rel: uses, to: villes-inequality}
- {rel: governed-by, to: fda-adaptive-design-guidance-2019}
equations: []
functions: [ev_naive_false_alarm, select_simulate]
results: []
lab: [08-e-values]
cites: [ville1939etude, wald1945sequential, robbins1970statistical, shafervovk2019game, shafer2021testing, vovk2021evalues, sokolova2026, polson2026evaluesbayesrisk, polson2026evaluesmdp]
---
## What it is

A group sequential design is a promise made in advance: the number of looks, their timing and the boundary at each are fixed in the protocol. [sec-evalues] Anytime-valid methods give a guarantee that does not depend on the schedule. [sec-evalues] The central object is the [[e-value]]. [sec-evalues]

## Why it matters

Four situations leave the plan behind: an unplanned look, an external publication, continuous review, and extending the trial. [sec-evalues-gap] A guarantee that is a property of the data path covers all of them. [sec-evalues-gap] If the schedule is known and will be kept, a group sequential design is the more powerful choice. [sec-evalues-gap]

## In the book

A naive z test at the 0.025 level applied at every look inflates the false positive rate as looks increase. [sec-evalues-gap] The e-value rule, monitored after every observation, stays within its bound by [[villes-inequality]]. [sec-evalues-gap]

The always-valid p-value is $p_n = \min(1, 1/\max_{m\le n} E_m)$. [sec-evalues-p] It is nonincreasing in $n$. [sec-evalues-p] The validity costs the [[surcharge]]. [sec-evalues-surcharge]

No FDA or ICH guidance names e-values, test martingales or anytime-valid inference as of November 2026. [sec-evalues] A sponsor proposing one is proposing a method and should expect to justify it in a CID paired meeting. [sec-evalues] The book knows of no confirmatory drug trial that has used an e-process as its primary analysis. [sec-evalues-practice]

## Pitfalls

- The protection is against optional stopping only. It does not repair bias from unblinding, selective data collection or invalid model changes. [sec-evalues-reg]
- A posterior is coherent under any stopping rule, but a decision rule calibrated to type I error under a stated monitoring scheme is not. [sec-evalues-pay]

## Check yourself

- Q: A DMC adds a fifth, unscheduled look after the trial's own interim signal. Does a classical boundary schedule cover it? A: No. A look triggered by an interim signal in the trial's own data is outside the guarantee. [sec-evalues-gap]
- Q: When should a sponsor not pay for anytime validity? A: When the monitoring schedule is under its control and will be kept. [sec-evalues-pay]
