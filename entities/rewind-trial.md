---
id: rewind-trial
name: REWIND
type: trial
aliases: [REWIND trial]
level: 2
summary: A dulaglutide cardiovascular outcomes trial with a marginal effect, used in the book as the case where the scheduled design beats continuous Bayesian monitoring.
chapters: ['21']
home: sec-cases-rewind
sections: [21/the-trial-as-conducted-1, 21/the-bayesian-reconstruction, 21/what-a-dmc-and-a-regulator-would-have-had-to-accept-1, sec-cases-rewind-prior, sec-cases]
prerequisites: [select-trial, hazard-ratio, skeptical-prior]
related:
- {rel: contrasts-with, to: select-reconstruction}
- {rel: illustrates, to: group-sequential-design}
equations: []
functions: [select_simulate, select_look_table, reanalysis_normal]
results: []
lab: [12-decisions, 15-reading-bayesian-trials]
cites: [gerstein2019dulaglutide, fda2008diabetescv]
---

## What it is
REWIND randomized 9,901 patients with type 2 diabetes to weekly dulaglutide or placebo, enrolling from August 2011 to August 2013, with a median follow-up of 5.4 years. [21/the-trial-as-conducted-1]
The primary composite occurred in 594 of 4,949 on dulaglutide and 663 of 4,952 on placebo: 1,257 events, hazard ratio 0.88, 95 percent interval 0.79 to 0.99, $p = 0.026$. [21/the-trial-as-conducted-1]
It was designed to show cardiovascular superiority with 90 percent power, not merely to exclude the 2008 margin. [21/the-trial-as-conducted-1]

## Why it matters
Information is almost identical to SELECT, but the effect is half the size on the log scale, 0.128 against 0.223, and the final standardized score is 2.27 rather than 3.98. [21/the-trial-as-conducted-1]
It is the unfavorable case, where the advantage of continuous monitoring should shrink. [sec-cases]

## In the book
The Bayesian rule declares efficacy in only part of the simulated trials, so its all-trial median is the maximum of 1,257 events. [21/the-bayesian-reconstruction]
The four-look design again has the highest power, and the e-value rule fails outright. [21/the-bayesian-reconstruction]
The book concludes that the scheduled design was the right choice if the expected effect was a hazard ratio near 0.88. [21/what-a-dmc-and-a-regulator-would-have-had-to-accept-1]
The final data are read with a normal approximation: log 0.88 with a standard error of about 0.058, under a flat prior and skeptical priors with standard deviations 0.2, 0.1 and 0.05. [sec-cases-rewind-prior]
The direction of the effect is robust to skepticism, and its size is not. [sec-cases-rewind-prior]

## Pitfalls
The reconstruction conditions on the observed hazard ratio, which barely cleared the bar. [21/what-a-dmc-and-a-regulator-would-have-had-to-accept-1]
Precision at the upper bound of the interval is a property of the full trial and cannot be got from half of it. [21/what-a-dmc-and-a-regulator-would-have-had-to-accept-1]

## Check yourself
- Q: Why does continuous monitoring help less here than in SELECT? A: The effect is half as large on the log scale, so the score only reaches 2.27. [21/the-trial-as-conducted-1]
- Q: What does the book still use Bayesian machinery for in REWIND? A: Reporting the final posterior for the hazard ratio under skeptical priors. [21/what-a-dmc-and-a-regulator-would-have-had-to-accept-1]
