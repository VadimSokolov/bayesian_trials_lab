---
id: monte-carlo-error
name: Monte Carlo error in calibration
type: concept
aliases: [calibration noise, Monte Carlo standard error]
level: 2
summary: The binomial sampling noise in a simulated rate, which also makes the calibrated threshold an estimate that needs enough trials and a fresh-seed check.
chapters: ['14']
home: 14/where-the-calibration-noise-comes-from
sections: [14/type-i-error-across-the-null-space]
prerequisites: [calibration]
related:
- {rel: part-of, to: simulation-report}
equations: []
functions: [oc_calibrate, oc_max_pp, oc_simulate]
results: []
lab: [14-simulator]
cites: []
---
## What it is

The Monte Carlo standard error of a simulated rejection probability is $\sqrt{p(1-p)/B}$ for $B$ trials [14/where-the-calibration-noise-comes-from]. The calibrated $c$ is itself a quantile of a simulated distribution, so it inherits this noise [14/where-the-calibration-noise-comes-from].

## Why it matters

A design calibrated on a small simulation can be miscalibrated on the fresh data that will decide the trial [14/where-the-calibration-noise-comes-from]. A reported "0.0252 against a target of 0.025" with no standard error invites the question of whether it is a violation [14/where-the-calibration-noise-comes-from].

## In the book

At $p = 0.025$, $B = 10{,}000$ gives 0.0016, which is 6 percent of the target [14/where-the-calibration-noise-comes-from]. With $B = 100{,}000$ it is 0.0005, and showing an error of 0.0250 within $\pm 0.0005$ needs about 380{,}000 trials [14/where-the-calibration-noise-comes-from]. The experiment calibrates $c$ on $B$ trials with 30 seeds and evaluates each on 400,000 fresh null trials [14/where-the-calibration-noise-comes-from]. In the null grid, an excess of a fraction of a point at the worst grid point was under two standard errors, so probably noise [14/type-i-error-across-the-null-space].

## Pitfalls

The validation estimate is unbiased, but the calibration estimate is not, because it was chosen to hit the target [14/where-the-calibration-noise-comes-from].

## Check yourself

- Q: How many calibration trials at minimum? A: At least $10^5$, and more near a boundary one must defend [14/where-the-calibration-noise-comes-from].
- Q: Why validate on a different seed? A: The calibration estimate was chosen to hit the target, so only fresh data give an unbiased error estimate [14/where-the-calibration-noise-comes-from].
