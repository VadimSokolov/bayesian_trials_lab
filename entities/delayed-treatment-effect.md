---
id: delayed-treatment-effect
name: Delayed treatment effect
type: concept
aliases: [delayed effect, immunotherapy]
level: 2
summary: A benefit that appears only after a lag, typical of immunotherapy, which costs the log-rank test power.
chapters: ['18']
home: sec-survival-power-loss
sections: [sec-survival-nph, sec-survival-power-loss, sec-survival-nph-tests]
prerequisites: [non-proportional-hazards, log-rank-test]
related:
- {rel: uses, to: weighted-log-rank-test}
equations: []
functions: [fh_z]
results: []
lab: []
cites: [alexander2018hazards, harrington1982class, fleming1991counting]
---

## What it is
A delayed effect is one where treatment does nothing at first, then reduces the hazard. In the book's figure, treatment cuts the hazard by 40 percent only after a delay of one year. [sec-survival-nph] The power simulation below uses a different delayed scenario: no benefit for two years, then a hazard ratio of 0.583. [sec-survival-power-loss]

## Why it matters
The log-rank test loses power because early events carry weight but are uninformative about treatment. [sec-survival-nph]

## In the book
The simulation has 300 patients per arm, 5 years of follow-up and a control hazard of 0.15 per year. It compares a constant hazard ratio of 0.75 with no benefit for two years then a hazard ratio of 0.583. [sec-survival-power-loss] Treated survival at five years is 0.57 in both, and the number of events is similar. [sec-survival-power-loss] Power is 0.68 under the constant hazard ratio and 0.55 under the delayed path, with 287 events in both. [sec-survival-power-loss] Two responses: a weighted log-rank test, or a design that states the delayed-effect model with its simulation in the protocol. [sec-survival-power-loss]

## Pitfalls
Either choice must be made before the trial. [sec-survival-power-loss]

## Check yourself
- Q: Does the Schoenfeld calculation warn about delay? A: No, it assumes a single hazard ratio. [sec-survival-power-loss]
- Q: Do both scenarios reach the same final benefit? A: Yes, 0.57 treated survival at five years. [sec-survival-power-loss]
