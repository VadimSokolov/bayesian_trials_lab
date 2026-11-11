---
id: select-reconstruction
name: SELECT reconstruction
type: concept
aliases: [reconstruction]
level: 3
summary: A simulation that replays SELECT under four monitoring rules held to one error rate and reports when each would have decided, as medians among successes and over all trials.
chapters: ['21', '12', '9']
home: 21/three-monitoring-schemes-and-selects-own-design-one-error-rate
sections: [21/what-the-saving-would-be-worth-in-calendar-time-and-exposure, 21/what-the-monitoring-committee-would-have-seen, 21/what-a-dmc-and-a-regulator-would-have-had-to-accept, sec-cases-limits, sec-cases-side]
prerequisites: [select-trial, obrien-fleming-boundary, calibration, e-value, skeptical-prior]
related:
- {rel: uses, to: group-sequential-design}
- {rel: uses, to: posterior-probability-success-criterion}
- {rel: contrasts-with, to: rewind-trial}
equations: []
functions: [select_simulate, select_look_table, select_month_of_events]
results: [select_reconstruction_medians]
lab: [12-decisions, 07-interim-looks, 08-e-values]
cites: [polson2026bayesstandard, ryan2020select]
---

## What it is
The reconstruction holds SELECT's hazard ratio at 0.80 and compares four rules at the same one-sided type I error of 2.5 percent. [21/three-monitoring-schemes-and-selects-own-design-one-error-rate]
The first is a four-look O'Brien-Fleming design at 25, 50, 75 and 100 percent of events, with boundaries 4.049, 2.863, 2.337 and 2.024. [21/three-monitoring-schemes-and-selects-own-design-one-error-rate]
The second stops when a posterior probability of benefit under a normal prior with scale 0.25 passes a threshold calibrated by simulation on a fine event grid. [21/three-monitoring-schemes-and-selects-own-design-one-error-rate]
The third stops when a mixture e-value reaches 40. [21/three-monitoring-schemes-and-selects-own-design-one-error-rate]
The fourth is SELECT's own design, one interim at 817 events and a final analysis at 1,225. [21/three-monitoring-schemes-and-selects-own-design-one-error-rate]

## Why it matters
Speed means nothing unless the rules carry the same type I error under the monitoring each uses. [21/three-monitoring-schemes-and-selects-own-design-one-error-rate]
A posterior rule at the conventional threshold of 0.975, monitored on the same grid, has a type I error well above 2.5 percent, so a claim of speed without the error is an artifact. [21/three-monitoring-schemes-and-selects-own-design-one-error-rate]

## In the book
Among simulated trials that declare efficacy, the Bayesian rule stops at a median of 464 events, the e-value rule at 612 and the four-look design at 952. [21/three-monitoring-schemes-and-selects-own-design-one-error-rate]
Over all trials, counting a trial that never crosses as ending at its maximum, the Bayesian median is 486 events. [21/three-monitoring-schemes-and-selects-own-design-one-error-rate]

## Pitfalls
The calibration holds for a stated grid and horizon, not for literally continuous monitoring, and monitoring off the grid needs recalibration. [sec-cases-limits]
Nobody observed a SELECT that stopped early, and the conditional medians describe only the paths that crossed. [sec-cases-limits]

## Check yourself
- Q: Why is the Bayesian conditional median smaller than the mean-path crossing? A: A rule that can act at any moment stops early on paths where noise has helped. [21/three-monitoring-schemes-and-selects-own-design-one-error-rate]
- Q: Which rule has less power, the calibrated Bayesian rule or the group sequential designs? A: The Bayesian rule has a little less power, the price of monitoring on a fine grid. [21/three-monitoring-schemes-and-selects-own-design-one-error-rate]
