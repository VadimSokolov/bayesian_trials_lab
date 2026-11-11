---
id: scenario-grid
name: Scenario grid
type: concept
aliases: [worst case]
level: 2
summary: The set of assumed truths a simulation study runs the frozen design against, including the null space, nuisance parameters, operations and misspecification.
chapters: ['14']
home: sec-sim-grid
sections: [14/type-i-error-across-the-null-space, 14/the-null-boundary]
prerequisites: [clinical-trial-simulation, operating-characteristics]
related:
- {rel: part-of, to: simulation-report}
- {rel: uses, to: calibration}
- {rel: governed-by, to: fda-bayesian-draft-guidance-2026}
equations: []
functions: [oc_simulate, oc_summarize, oc_calibrate]
results: []
lab: [14-simulator]
cites: [fda2019adaptive, fda_bayesian_2026]
---
## What it is

A simulation study is a set of scenarios, and the scenarios decide whether the report convinces [sec-sim-grid]. The book lists efficacy, nuisance, operational, misspecification and sampled-effect scenarios [sec-sim-grid]. The "worst case" type I error is the maximum over a set of models the sponsor decides to consider, and the report should state what set that is [sec-sim-grid].

## Why it matters

The error constraint covers the whole null space, not one point [14/type-i-error-across-the-null-space]. A reviewer can read "controlled at a given level" as "everywhere the null is true" [14/type-i-error-across-the-null-space].

## In the book

Efficacy scenarios include the global null, the design alternative, an intermediate alternative at half the design effect, and a large effect [sec-sim-grid]. For a binary endpoint the nuisance parameter is the control rate [sec-sim-grid]. If the maximum falls at the edge of the grid, the grid was too small [sec-sim-grid].

In the worked example the type I error was simulated across a grid of control rates with $p_1 = p_0$, and the worst-case threshold is the largest of the thresholds each rate needs [14/type-i-error-across-the-null-space]. The supremum over the composite null is attained on the boundary $p_1 = p_0$ for this monotone rule [14/the-null-boundary].

## Pitfalls

A nonmonotone rule, such as one that selects among arms or borrows an external control, has no such guarantee and needs a grid in every nuisance dimension [14/the-null-boundary]. Tuning a design to a scenario table is legitimate only if the final design is frozen and revalidated on fresh seeds [sec-sim-grid].

## Check yourself

- Q: Where is the supremum of the type I error over $p_1 \le p_0$ for the monotone rule? A: On the boundary $p_1 = p_0$ [14/the-null-boundary].
- Q: What does a maximum at the grid edge tell you? A: The grid was too small [sec-sim-grid].
