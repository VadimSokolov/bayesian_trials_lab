---
id: prespecification
name: Prespecification
type: concept
aliases: []
level: 2
summary: Fixing the prior, thresholds, schedule and analysis before the data are seen, which separates a designed Bayesian trial from a post hoc reanalysis.
chapters: ['22', '23']
home: 22/prespecification
sections: [22/prior-choice, 23/interim-schedule-and-decision-rules, 23/the-statistical-analysis-plan-and-the-simulation-report, 23/the-success-criterion-and-its-calibration, 21/what-a-dmc-and-a-regulator-would-have-had-to-accept]
prerequisites: [prior-distribution]
related:
- {rel: contrasts-with, to: bayesian-reanalysis}
- {rel: governed-by, to: fda-bayesian-draft-guidance-2026}
equations: []
functions: []
results: []
lab: [16-bayesian-protocol, 15-reading-bayesian-trials]
cites: [fda_bayesian_2026, ich_e9]
---

## What it is
A trial's prespecified analysis is the one the protocol and statistical analysis plan fixed before the data were seen. [22/prespecification]
For GUSTO, EOLIA and ANDROMEDA-SHOCK that analysis was frequentist and fixed in advance. [22/prespecification]

## Why it matters
A Bayesian reanalysis is done after the results are known, by people who know them, so it is exploratory in ICH E9's sense. [22/prespecification]
The same discipline applies to a prospective Bayesian design: the FDA draft asks that the prior be stated and justified and that sensitivity be shown across a range. [22/prior-choice]
E9 says interim analyses should be carefully planned in advance and described in the protocol. [23/interim-schedule-and-decision-rules]

## In the book
The honest report lists every prior tried, and the book's tables show each row, including the pessimistic prior that gives the weakest result. [22/prespecification]
The recommended practice is to state each prior's mean and standard deviation, show the posterior across a range of them and say which readers each represents. [22/prior-choice]
The success criterion, the schedule, the prior and the stopping rule all go into the protocol and the statistical analysis plan, prospectively. [21/what-a-dmc-and-a-regulator-would-have-had-to-accept]
A Bayesian SAP that defers the prior or the success threshold to a later version has not prespecified the design. [23/the-statistical-analysis-plan-and-the-simulation-report]
The success criterion's a and c are justified, with calibration evidence or the agreed alternative route, before the data are seen. [23/the-success-criterion-and-its-calibration]

## Pitfalls
A reanalysis that reports one prior, chosen after the data, does not meet the standard. [22/prior-choice]
A look added after an external publication is a deviation from the simulated design. [23/interim-schedule-and-decision-rules]

## Check yourself
- Q: Why can a Bayesian reanalysis not be prespecified? A: Priors, thresholds and scale are chosen in the light of the answer. [22/prespecification]
- Q: What does a deferred success threshold do to a SAP? A: It means the design was not prespecified. [23/the-statistical-analysis-plan-and-the-simulation-report]
