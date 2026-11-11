---
id: select-trial
name: SELECT
type: trial
aliases: [semaglutide cardiovascular outcomes trial, semaglutide]
level: 2
summary: A cardiovascular outcomes trial of semaglutide in adults with obesity, used in the book as the favorable case for pricing Bayesian monitoring in events, time and money.
chapters: ['21', '1', '9', '12']
home: sec-cases-select
sections: [21/the-trial-as-conducted, 21/three-monitoring-schemes-and-selects-own-design-one-error-rate, 21/what-the-monitoring-committee-would-have-seen, 21/what-a-dmc-and-a-regulator-would-have-had-to-accept, sec-cases]
prerequisites: [event-driven-trial, hazard-ratio]
related:
- {rel: illustrates, to: group-sequential-design}
- {rel: illustrates, to: e-value}
- {rel: illustrates, to: data-monitoring-committee}
- {rel: illustrates, to: clinical-trial}
equations: []
functions: [select_simulate, select_look_table]
results: []
lab: [12-decisions, 15-reading-bayesian-trials]
cites: [lincoff2023semaglutide, ryan2020select, polson2026bayesstandard]
---

## What it is
SELECT randomized 17,604 adults with overweight or obesity and established cardiovascular disease, without diabetes, to weekly semaglutide 2.4 mg or placebo, at 804 sites in 41 countries. [21/the-trial-as-conducted]
The primary endpoint was a composite of cardiovascular death, nonfatal myocardial infarction and nonfatal stroke, analyzed as time to first event. [21/the-trial-as-conducted]
It occurred in 569 of 8,803 patients on semaglutide and 701 of 8,801 on placebo: 1,270 events, hazard ratio 0.80 with a 95 percent confidence interval from 0.72 to 0.90. [21/the-trial-as-conducted]
Mean follow-up was 39.8 months. [21/the-trial-as-conducted]

## Why it matters
The book picks SELECT as the favorable case: a large effect, cleanly estimated, in a trial big enough for the asymptotics to apply. [sec-cases]
The reconstruction asks what each monitoring scheme would have needed at the same one-sided error of 2.5 percent. [21/the-trial-as-conducted]

## In the book
SELECT was designed for a hazard ratio of 0.83 with 90 percent power at one-sided 0.025, which calls for 1,225 planned events. [21/the-trial-as-conducted]
It planned one superiority interim analysis at two thirds of the planned events, which is 817, followed by the final analysis. [21/three-monitoring-schemes-and-selects-own-design-one-error-rate]
At the actual interim, at 831 events, the efficacy boundary was crossed and the data monitoring committee recommended continuing. [21/three-monitoring-schemes-and-selects-own-design-one-error-rate]
Crossing a boundary is necessary but not sufficient for stopping. [21/what-the-monitoring-committee-would-have-seen]
The book carries SELECT's actual two-look design through every comparison as a fourth rule beside the four-look O'Brien-Fleming design, the Bayesian rule and the e-value rule. [21/the-trial-as-conducted]
See [[select-reconstruction]] for the simulated medians.

## Pitfalls
Every number built on the reconstruction is a counterfactual, and nothing in the chapter claims that SELECT should have stopped early. [sec-cases]
A regulator may prefer the longer exposure for a drug intended for chronic use by people without diabetes. [21/what-a-dmc-and-a-regulator-would-have-had-to-accept]

## Check yourself
- Q: How many events did SELECT report, and how many did it plan? A: 1,270 reported against 1,225 planned. [21/the-trial-as-conducted]
- Q: Did the committee stop SELECT at the interim, where the boundary was crossed? A: No, it recommended continuing. [21/three-monitoring-schemes-and-selects-own-design-one-error-rate]
