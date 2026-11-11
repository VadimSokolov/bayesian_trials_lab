---
id: cardiovascular-outcomes-trial
name: Cardiovascular outcomes trial
type: design
aliases: [CVOT]
level: 2
summary: A large event-driven trial whose primary endpoint is a composite of cardiovascular events, the setting for the book's SELECT, REWIND and SURPASS-CVOT cases.
chapters: ['21', '9']
home: sec-cases
sections: [sec-cases-select, sec-cases-side, sec-cases-current, 21/the-trial-as-conducted]
prerequisites: [event-driven-trial, hazard-ratio]
related:
- {rel: used-in, to: select-trial}
- {rel: used-in, to: rewind-trial}
- {rel: used-in, to: surpass-cvot}
- {rel: governed-by, to: fda-substantial-evidence-draft-2026}
- {rel: governed-by, to: fda-adaptive-design-guidance-2019}
equations: []
functions: [select_simulate]
results: []
lab: [12-decisions]
cites: [fda2008diabetescv, lincoff2023semaglutide, gerstein2019dulaglutide, nicholls2025surpasscvot]
---

## What it is
The chapter tests Bayesian monitoring on cardiovascular trials that were actually run, chosen to differ: SELECT, REWIND and SURPASS-CVOT. [sec-cases]
Their primary endpoints are composites of cardiovascular events analyzed as time to first event. [21/the-trial-as-conducted]
For new type 2 diabetes drugs, the 2008 FDA guidance asked for cardiovascular evidence, in practice comparing the upper bound of the 95 percent interval for the cardiovascular risk ratio against margins of 1.8 and 1.3. [sec-cases]

## Why it matters
A cardiovascular outcomes trial is usually the only trial behind the cardiovascular claim, which makes the one-trial-plus-confirmatory-evidence standard the one in play. [sec-cases]
They are event driven, so the question is how many events a monitoring rule needs. [21/the-trial-as-conducted]

## In the book
SELECT is the favorable case and REWIND the case where the scheduled design wins. [sec-cases]
Each case closes with what a data monitoring committee and a regulator would have had to accept. [sec-cases]
The side-by-side table says the traditional design wins for marginal effects and fixed looks, as in REWIND, and the Bayesian reconstruction wins for large effects with a committee that can commit to a plan, as in SELECT. [sec-cases-side]
Randomization, blinding, endpoint, firewall and the intention-to-treat estimand do not change. [sec-cases-side]
Several such trials are running now, among them PREVAIL with 9,541 participants. [sec-cases-current]

## Pitfalls
SELECT enrolled people without diabetes and is not governed by the 2008 diabetes guidance, which is REWIND's setting. [sec-cases]

## Check yourself
- Q: Where does the book say the scheduled design wins? A: Marginal effects and fixed looks, as in REWIND. [sec-cases-side]
- Q: Why is the substantial-evidence standard in play? A: A cardiovascular outcomes trial is usually the only trial behind the cardiovascular claim. [sec-cases]
