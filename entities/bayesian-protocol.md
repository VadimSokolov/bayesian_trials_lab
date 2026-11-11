---
id: bayesian-protocol
name: Bayesian protocol
type: concept
aliases: []
level: 2
summary: 'A confirmatory protocol that keeps the traditional skeleton and changes the sections that depend on how evidence is summarized: prior, success criterion, interim rules and operating characteristics.'
chapters: ['23']
home: sec-protocol
sections: [23/traditional-first, 23/what-changes, 23/the-prior, 23/the-success-criterion-and-its-calibration, 23/interim-schedule-and-decision-rules, 23/adaptive-randomization, 23/safety-rules, 23/the-estimand]
prerequisites: [posterior-probability-success-criterion, prior-specification, estimand, operating-characteristics]
related:
- {rel: governed-by, to: fda-bayesian-draft-guidance-2026}
- {rel: governed-by, to: fda-adaptive-design-guidance-2019}
- {rel: uses, to: statistical-analysis-plan}
- {rel: uses, to: governance-firewall}
- {rel: uses, to: prespecification}
equations: []
functions: [select_simulate]
results: []
lab: [16-bayesian-protocol, 14-studio]
cites: [fda_bayesian_2026, fda2019adaptive, ich_e9_r1, polson2026bayesstandard]
---

## What it is
A Bayesian protocol shares most sections with a group sequential protocol and differs in a handful, and the handful is where reviewers will spend their time. [sec-protocol]
A traditional protocol states a null hypothesis, a one-sided type I error of 0.025, a fixed sample size or event count, scheduled interim looks and a stated multiplicity procedure. [23/traditional-first]

## Why it matters
Four things stay the same: the estimand, the default randomization, the calibration bar of one-sided familywise error 0.025, and the need to prespecify. [23/what-changes]
The sponsor owes the reviewer a simulation rather than a formula in each moved row. [23/what-changes]

## In the book
The prior is stated in full, with its effective sample size, the source of any informative component and a prespecified sensitivity analysis. [23/what-changes]
The success criterion is $\Pr(\delta > a \mid \text{data}) > c$, where $a$ is the minimum benefit and $c$ the minimum probability, both to be justified. [23/the-success-criterion-and-its-calibration]
The sample size becomes a maximum, and the looks are prescheduled with decision rules at each one. [23/what-changes]
Adaptive randomization, if used, belongs in the protocol with its limits: burn-in, floors, caps and analysis stratified by allocation period. [23/adaptive-randomization]
Safety can be stated as a posterior probability whose false-stop rate is simulated, and it sits outside the efficacy error budget. [23/safety-rules]
Nothing about the estimand is different, and the common error is to describe a convenient model in estimand language afterwards. [23/the-estimand]
Three rows carry most of the difference: interim looks, multiple arms and operating characteristics. [23/what-changes]

## Pitfalls
The protocol should not say "continuous monitoring": operating characteristics depend on when and how often the rule is evaluated. [23/interim-schedule-and-decision-rules]
Calibration is this book's default for confirmatory adaptive designs without borrowing, not FDA's universal requirement. [23/what-changes]

## Check yourself
- Q: Which section has no traditional counterpart? A: The prior. [23/the-prior]
- Q: What replaces the closed-form power calculation? A: The simulation report. [23/what-changes]
