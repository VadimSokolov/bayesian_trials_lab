---
id: log-rank-test
name: Log-rank test
type: method
aliases: [log rank test]
level: 1
summary: 'The standard comparison of two survival curves: observed minus expected events in the treated arm, summed over event times.'
chapters: ['18']
home: sec-survival-traditional
sections: [sec-survival-traditional, sec-survival-power-loss, sec-survival, sec-survival-nph, sec-survival-nph-tests]
prerequisites: [kaplan-meier-estimator, hazard-ratio]
related:
- {rel: special-case-of, to: weighted-log-rank-test}
- {rel: alternative-to, to: restricted-mean-survival-time}
equations: []
functions: [fh_z]
results: []
lab: []
cites: [mantel1966, peto1972, harrington1982class]
---

## What it is
At each event time the log-rank test compares the observed number of events in the treated arm with the number expected if both arms shared one hazard, and sums the differences. [sec-survival-traditional] It is the score test of a proportional hazards model. [sec-survival-traditional]

## Why it matters
Most event-driven trials analyze with a log-rank test or a Cox model. [sec-survival] When randomization was stratified, the test should be stratified on the same factors. [sec-survival-traditional]

## In the book
Under a delayed effect the log-rank test loses power, because the early events it weights are uninformative about treatment. [sec-survival-nph] A simulation with 300 patients per arm and treated survival at 5 years of 0.57 in both scenarios compares a constant hazard ratio of 0.75 with a two-year delay then 0.583. [sec-survival-power-loss] Fleming-Harrington weights with $\rho = \gamma = 0$ give the ordinary log-rank test. [sec-survival-nph-tests]

## Pitfalls
The Schoenfeld calculation assumes a single hazard ratio and would not warn about the loss of power. [sec-survival-power-loss]

## Check yourself
- Q: Why does it lose power under a delayed effect? A: Early events carry weight but say nothing about the treatment. [sec-survival-nph]
