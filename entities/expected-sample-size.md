---
id: expected-sample-size
name: Expected sample size
type: concept
aliases: []
level: 2
summary: The average number of patients a design enrolls under a stated true effect, smaller than the maximum when the trial can stop early.
chapters: ['14']
home: 14/power-expected-sample-size-early-stopping-and-bias
sections: [14/the-group-sequential-design, sec-sim-report]
prerequisites: [operating-characteristics, group-sequential-design]
related:
- {rel: part-of, to: simulation-report}
- {rel: uses, to: clinical-trial-simulation}
equations: []
functions: [gs_crossing_prob, oc_simulate, oc_summarize, gs_power]
results: []
lab: [14-simulator]
cites: []
---
## What it is

The expected sample size E[N] is the average total enrollment under a stated truth. For a group sequential design, the differences between successive "not yet crossed" probabilities give the probability of stopping at each look, hence the expected sample size [14/the-group-sequential-design].

## Why it matters

It is the price side of stopping early. A fixed design uses all its patients, and a design that can stop uses fewer on average [14/power-expected-sample-size-early-stopping-and-bias].

## In the book

For the four-look Bayesian design with flat priors and a maximum of 160 per arm, the expected sample size under the null is below the maximum of 320 because the only way to stop early is a false success [14/power-expected-sample-size-early-stopping-and-bias]. Under the null E[N] is 317 of 320. At an effect of 0.15 the design has power 0.713, stops early in 57 percent of trials and has E[N] of 232 against 320 for the fixed design, about 28 percent fewer; the cost is about 8 points of power against the fixed design's 0.794 [14/power-expected-sample-size-early-stopping-and-bias]. Adding a futility rule at the first three looks cuts the null E[N] from 317 to 282 [14/power-expected-sample-size-early-stopping-and-bias]. The analytic O'Brien-Fleming design has E[N] of 263 [14/the-group-sequential-design].

## Pitfalls

Analytic expected sample size of a group sequential design counts completers, while a simulation that models accrual counts everyone enrolled, which is larger [sec-sim-report]. A report should give expected and maximum $N$ for enrolled patients, not only completers [sec-sim-report].

## Check yourself

- Q: Why is expected N under the null below the maximum when there is no futility rule? A: Because the only way to stop early is a false success [14/power-expected-sample-size-early-stopping-and-bias].
- Q: Which count is larger, completers or enrolled patients? A: Enrolled patients, because those still in the pipeline count when the trial stops [sec-sim-report].
