---
id: dose-finding
name: Dose finding
type: concept
aliases: [dose escalation]
level: 1
summary: Choosing the dose to carry into later trials, a problem with little data, sequential decisions and large consequences.
chapters: ['17', '2']
home: sec-dose
sections: [sec-dose-33, sec-dose-model, sec-dose-optimus, sec-dose-compare]
prerequisites: [phase-1-trial, posterior-distribution]
related:
- {rel: part-of, to: drug-development}
- {rel: uses, to: operating-characteristics}
equations: []
functions: [dose_scenarios, dose_simulate]
results: []
lab: [14-studio]
cites: [fda_optimizing_dosage_2024, fda_dose_response_1994]
---

## What it is
Every drug that reaches a confirmatory trial has already been given a dose, chosen on very little data. [sec-dose] A first-in-human trial may enroll twelve to thirty patients, and the dose is carried into trials of hundreds or thousands. [sec-dose]

## Why it matters
If the dose is too high, patients are harmed and the product may need a later dose reduction. If it is too low, an effective drug is lost. [sec-dose] The statistical problem is small in sample size and large in consequence, which is the clearest case for a Bayesian design. [sec-dose]

## In the book
The chapter starts with the 3+3 design and simulates it. [sec-dose] It then adds the continual reassessment method, the Bayesian optimal interval design and escalation with overdose control, each judged on the same scenarios. [sec-dose] It moves to designs that weigh efficacy against toxicity, then to seamless designs. [sec-dose] Five real development programs close the chapter. [sec-dose]

## Pitfalls
A dose-escalation design is a decision rule fixed before the first patient and judged by its operating characteristics. [sec-dose-compare] Safety oversight by a committee with the power to override stays in place for every design. [sec-dose-compare]

## Check yourself
- Q: What changes when moving from the 3+3 to model-based designs? A: The rule can use all the data, the question can be benefit-risk, and the regulator sees a simulation report. [sec-dose-compare]
- Q: Which FDA guidance of August 2024 restated that dose should rest on more than the highest tolerable level? A: The oncology dosage optimization guidance. [sec-dose]
