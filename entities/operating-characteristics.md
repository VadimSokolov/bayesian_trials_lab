---
id: operating-characteristics
name: Operating characteristics
type: concept
aliases: []
level: 2
summary: 'How often a trial design declares success or stops under assumed true effects: type I error, power, expected sample size, early stopping and bias.'
chapters: ['14', '23']
home: sec-simulation
sections: [sec-sim-traditional, 14/power-expected-sample-size-early-stopping-and-bias, 14/the-fixed-sample-design, 14/the-group-sequential-design, 14/type-i-error-across-the-null-space, 14/what-goes-in-the-traditional-sap]
prerequisites: [type-i-error, power]
related:
- {rel: uses, to: clinical-trial-simulation}
- {rel: governed-by, to: fda-adaptive-design-guidance-2019}
- {rel: part-of, to: simulation-report}
equations: []
functions: [n_binary, gs_boundary, gs_crossing_prob, gs_power, oc_simulate, oc_summarize]
results: []
lab: [14-simulator, 09-adaptive-bayesian]
cites: [fda2019adaptive, obrienfleming1979]
---
## What it is

A regulator who is asked to accept a design wants to know how often it will go wrong and how often it will go right [sec-simulation]. The answers are the design's operating characteristics. For a fixed-sample trial a formula gives them in a line, and for a group sequential trial a short numerical integration does [sec-simulation].

## Why it matters

For designs with response-adaptive allocation, arm dropping, borrowing or predictive stopping, a closed formula is usually unavailable [sec-simulation]. The operating characteristics then come from running the design many times against assumed truths, and the written result is the [[simulation-report]] [sec-simulation].

## In the book

For a two-arm binary trial with control rate 0.30 and treatment rate 0.45, the fixed design needs 160 per arm [14/the-fixed-sample-design]. Its exact type I error is 0.0252 and exact power is 0.794 [14/the-fixed-sample-design]. Adding looks at 40, 80 and 120 per arm with an O'Brien-Fleming boundary is still analytic, with no random numbers drawn [14/the-group-sequential-design].

For the four-look Bayesian design the book reports power, expected total sample size, probability of stopping early for success or futility, and the bias of the estimate at stopping [14/power-expected-sample-size-early-stopping-and-bias].

## Pitfalls

Reporting only the type I error at the design null reports the easy half [14/type-i-error-across-the-null-space]. The error must hold over the whole null space [14/type-i-error-across-the-null-space]. A bias table is needed because the final estimate is taken at a favorable moment when a trial stops on good data [14/power-expected-sample-size-early-stopping-and-bias].

## Check yourself

- Q: When can operating characteristics be computed without random numbers? A: For fixed and group sequential designs, where the answer is analytic [14/the-group-sequential-design].
- Q: Why does a Bayesian adaptive design usually need simulation? A: Because adaptations leave the standard normal setting and no closed formula exists [14/what-goes-in-the-traditional-sap].
