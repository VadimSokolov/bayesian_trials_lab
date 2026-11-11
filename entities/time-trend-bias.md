---
id: time-trend-bias
name: Time trend bias
type: concept
aliases: [temporal drift, time trends]
level: 2
summary: Confounding of arm with calendar time when response drifts during enrollment, which inflates the type I error of response-adaptive randomization but not of blocked equal allocation.
chapters: ['16', '20']
home: sec-rar-drift
sections: [16/the-mechanism, 16/simulation, 16/the-fixes, sec-rar-reg]
prerequisites: [response-adaptive-randomization, type-i-error]
related:
- {rel: part-of, to: rar-critique}
- {rel: uses, to: concurrent-control}
- {rel: contrasts-with, to: fixed-allocation}
equations: []
functions: [rar_drift_sweep, rar_simulate]
results: []
lab: [14-studio, 09-adaptive-bayesian]
cites: [saville2022, villar2018timetrends]
---
## What it is

Suppose the background response rate rises during enrollment because the standard of care improves or the site mix changes [16/the-mechanism]. An arm that benefited from early luck receives more of the later patients, who respond better on any treatment, and looks better still [16/the-mechanism]. Nothing about the treatment has changed, and the comparison is confounded with calendar time [16/the-mechanism].

## Why it matters

This is the central practical objection to RAR in confirmatory trials, and the property that fixed allocation with permuted blocks was designed to defeat [16/the-mechanism].

## In the book

In a null trial of 400 patients with response 0.30 in both arms, the response rises linearly across enrollment by a drift $d$ [16/simulation]. Under equal allocation, drift is harmless even for a 30-point drift [16/simulation]. Under Thompson sampling the naive test's type I error climbs with the drift, and capped Thompson reduces but does not remove the problem [16/simulation]. Three fixes should be pre-specified as a package: stratify the analysis by enrollment period, use burn-in and a cap, and keep control allocation fixed [16/the-fixes]. A fourth route models the trend, as in the Bayesian time machine [16/the-fixes].

## Pitfalls

Stratifying costs power [16/the-fixes]. Even with stratification, plain Thompson keeps a type I error near 0.05, twice the nominal one-sided 0.025, until the critical value is calibrated by simulation [16/the-fixes]. A Bayesian analysis does not by itself solve the confounding, because the model must contain the drift [sec-rar-reg].

## Check yourself

- Q: Why is equal allocation immune to drift? A: Allocation does not depend on the outcomes, so each period contributes equally to both arms [16/simulation].
- Q: What does stratifying by enrollment period require? A: Allocation fixed within each period and arms compared only within a period [16/the-fixes].
