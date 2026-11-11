---
id: statistical-analysis-plan
name: Statistical analysis plan
type: concept
aliases: [SAP]
level: 2
summary: The document finalized before unblinding that carries the model, prior, computation and decision rules, with a separate simulation report as the central deliverable for a Bayesian design.
chapters: ['23', '14']
home: 23/the-statistical-analysis-plan-and-the-simulation-report
sections: [23/the-prior, 23/the-success-criterion-and-its-calibration]
prerequisites: [prespecification, operating-characteristics]
related:
- {rel: part-of, to: bayesian-protocol}
- {rel: governed-by, to: fda-bayesian-draft-guidance-2026}
- {rel: uses, to: simulation-report}
equations: []
functions: [oc_simulate, oc_calibrate, oc_summarize]
results: []
lab: [14-studio, 16-bayesian-protocol]
cites: [fda_bayesian_2026, mueller1995optimal]
---

## What it is
The SAP is finalized before unblinding, and for a Bayesian design it carries the exact model, the likelihood, the parameterization of the prior, the computation, the handling of missing data and intercurrent events, the full set of success criteria and the sensitivity analyses. [23/the-statistical-analysis-plan-and-the-simulation-report]
The computation covers software, sampler, chains, burn-in, convergence diagnostics and seeds. [23/the-statistical-analysis-plan-and-the-simulation-report]

## Why it matters
The Bayesian draft asks for all of this "as early as possible" and says FDA does not require any particular software. [23/the-statistical-analysis-plan-and-the-simulation-report]
A Bayesian SAP that defers the prior or the success threshold to a later version has not prespecified the design. [23/the-statistical-analysis-plan-and-the-simulation-report]

## In the book
The simulation report is a separate document and for a complex adaptive design the central one; it replaces the closed-form power calculation for the reviewer. [23/the-statistical-analysis-plan-and-the-simulation-report]
It contains the design as simulated, the scenarios, operating characteristics, Monte Carlo error, a comparison with a simpler design, sensitivity to the prior and the code, seeds and software environment. [23/the-statistical-analysis-plan-and-the-simulation-report]
A type I error of 0.024 estimated from a thousand runs is not evidence that it is below 0.025. [23/the-statistical-analysis-plan-and-the-simulation-report]
The worked chunk simulates a binary-endpoint trial with four looks at 50, 100, 150 and 200 under the null of 30 percent response in both arms, calibrates the threshold, and validates it on a fresh null run and on an alternative of 30 against 45 percent. [23/the-statistical-analysis-plan-and-the-simulation-report]
The report is versioned and the protocol references a version by date, so the simulated design is demonstrably the design that was run. [23/the-statistical-analysis-plan-and-the-simulation-report]

## Pitfalls
The temptation in an adaptive design is to leave details to be fixed at an interim, and E20 says the opposite. [23/the-statistical-analysis-plan-and-the-simulation-report]
The rejection proportion in the calibration run is the target, not an error assessment. [23/the-statistical-analysis-plan-and-the-simulation-report]

## Check yourself
- Q: Why validate the calibrated threshold on a fresh null run? A: The calibration run's rejection proportion is the target and not an error assessment. [23/the-statistical-analysis-plan-and-the-simulation-report]
- Q: Does FDA require particular software? A: No. [23/the-statistical-analysis-plan-and-the-simulation-report]
