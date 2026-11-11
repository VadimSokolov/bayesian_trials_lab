---
id: proportional-hazards
name: Proportional hazards
type: concept
aliases: [proportional hazards assumption]
level: 2
summary: The assumption that the hazard ratio is constant over time, which makes a single hazard ratio a clean summary.
chapters: ['18']
home: sec-survival-nph
sections: [sec-survival-traditional, sec-survival-nph, sec-survival, sec-survival-power-loss, sec-survival-nph-tests]
prerequisites: [hazard-ratio, cox-model]
related:
- {rel: contrasts-with, to: non-proportional-hazards}
equations: []
functions: []
results: []
lab: []
cites: [struthers1986misspecified]
---

## What it is
Under proportional hazards the hazard ratio does not change over time, so a single hazard ratio is a clean summary. [sec-survival-traditional] The log-rank test is the score test of such a model. [sec-survival-traditional]

## Why it matters
Non-proportional hazards break the shortcut that information about a log hazard ratio is proportional to the number of events. [sec-survival] The Schoenfeld calculation assumes a single hazard ratio. [sec-survival-power-loss]

## In the book
The proportional scenario cuts a control hazard of 0.15 per year by 40 percent from the start. [sec-survival-nph] In a power simulation, a constant hazard ratio of 0.75 serves as the comparison for a delayed effect: the power is 0.68 under proportional hazards against 0.55 under the delayed effect, with the same number of events. [sec-survival-power-loss] Under proportional hazards the log-rank test beats the MaxCombo test, which beats the late-weighted test. [sec-survival-nph-tests]

## Pitfalls
When the hazard ratio changes, the Cox estimate becomes a censoring-dependent weighted average. [sec-survival-traditional]

## Check yourself
- Q: What breaks when hazards are not proportional? A: A single hazard ratio misdescribes the effect and the events-as-information shortcut fails. [sec-survival-nph]
