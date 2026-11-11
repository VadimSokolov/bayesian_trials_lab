---
id: bayesian-time-machine
name: Bayesian time machine
type: method
aliases: [time machine, control smoothing]
level: 3
summary: A model that lets the control rate drift across calendar periods and borrows from neighboring periods with a smoothing parameter to use non-concurrent controls.
chapters: ['20']
home: 20/the-bayesian-time-machine
sections: [20/the-bayesian-time-machine, 20/how-big-is-the-bias-a-simulation, 20/regulatory-position]
prerequisites: [concurrent-control, hierarchical-model]
related:
- {rel: used-in, to: i-spy-2-trial}
- {rel: used-in, to: gbm-agile-trial}
- {rel: governed-by, to: fda-bayesian-draft-guidance-2026}
equations: []
functions: [platform_time_machine]
results: []
lab: [10-platform-trials]
cites: [saville2022, fda_bayesian_2026, jiang2023nonconcurrent, bofillroig2023use]
---
## What it is

The time machine lets the control rate drift as a random walk across calendar periods and estimates the current control rate by borrowing from neighboring periods, with a smoothing parameter $\sigma_s$ controlling how fast the rate may change. Small $\sigma_s$ pools almost everything and large $\sigma_s$ is nearly the concurrent-only estimate. [20/the-bayesian-time-machine] It is the idea of Saville and colleagues, used in I-SPY 2, proposed for GBM AGILE and Precision Promise, and cited in FDA's Bayesian draft. [20/the-bayesian-time-machine]

## Why it matters

When nothing changes, borrowing is nearly free. Under a step of 8 points in the last period, pooling is worse than the current period alone. [20/the-bayesian-time-machine]

## In the book

The book's code is an illustrative first-order Gaussian smoother over four periods of 100 control patients, not the published second-order model. [20/the-bayesian-time-machine] Three histories were simulated: constant, linear drift of 2 points per period, and an 8 point step in the last period. [20/the-bayesian-time-machine] The learned smoother, which must infer a break from four periods, is worse than the current period alone under the step. Only the loosest fixed smoothing improved on concurrent-only data, and that value was fixed with knowledge of the scenarios. [20/the-bayesian-time-machine]

## Pitfalls

Borrowing gains precision when history is stable and gives it back when history breaks. Three scenarios do not establish that it is better for other histories. [20/the-bayesian-time-machine] The simulation report must include a step change. [20/the-bayesian-time-machine]

## Check yourself

- Q: What does large $\sigma_s$ approximate? A: The concurrent-only estimate. [20/the-bayesian-time-machine]
- Q: Which history hurts pooling most? A: The step change in the last period. [20/the-bayesian-time-machine]
