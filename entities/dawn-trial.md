---
id: dawn-trial
name: DAWN
type: trial
aliases: [DAWN trial]
level: 3
summary: A stroke thrombectomy trial 6 to 24 hours after onset whose Bayesian adaptive enrichment plan used predictive probability stopping and a threshold that rises with enrichment.
chapters: ['15', '14', '23']
home: 15/dawn-predictive-probability-for-expected-success-and-futility
sections: [14/dawn-a-success-threshold-that-moves-with-the-enrichment]
prerequisites: [predictive-probability-of-success, posterior-probability-success-criterion]
related:
- {rel: illustrates, to: goldilocks-design}
- {rel: illustrates, to: calibration}
equations: []
functions: []
results: []
lab: [09-adaptive-bayesian]
cites: [jovin2017dawn, stryker_dawn_sap_2017, nogueira2018thrombectomy]
---
## What it is

DAWN tested thrombectomy with the Trevo device in acute ischemic stroke 6 to 24 hours after onset, in patients with a mismatch between clinical deficit and infarct core [15/dawn-predictive-probability-for-expected-success-and-futility]. It used a Bayesian adaptive enrichment design [14/dawn-a-success-threshold-that-moves-with-the-enrichment].

## Why it matters

The statistical analysis plan makes predictive probability the stopping quantity, which is the [[goldilocks-design]] structure with a schedule of thresholds [15/dawn-predictive-probability-for-expected-success-and-futility].

## In the book

From 200 randomized patients, with at least 100 since the last enrichment, the trial stops for expected success if the predictive probability exceeds 95 percent at 200 and 250 patients, 90 percent at 300 and 350, 85 percent at 400, and 80 percent at 450 and 500 [15/dawn-predictive-probability-for-expected-success-and-futility]. It stops for futility if the predictive probability at the maximum sample size is under 10 percent [15/dawn-predictive-probability-for-expected-success-and-futility]. The thresholds fall as the sample grows, so an early stop needs more certainty than a late one [15/dawn-predictive-probability-for-expected-success-and-futility].

The baseline success threshold is 0.986 on the posterior probability of superiority, chosen by simulation, and it is raised if enrichment occurs [14/dawn-a-success-threshold-that-moves-with-the-enrichment]. The trial stopped at the first efficacy look with 206 patients and 49 percent against 13 percent functional independence [14/dawn-a-success-threshold-that-moves-with-the-enrichment].

## Pitfalls

Every branch of the design, enrich or not and stop or not, needs its threshold computed so that the error is controlled on all of them [14/dawn-a-success-threshold-that-moves-with-the-enrichment].

## Check yourself

- Q: Does the stopping threshold for expected success rise or fall as the sample grows? A: It falls, from 95 percent to 80 percent [15/dawn-predictive-probability-for-expected-success-and-futility].
- Q: What happens to the success threshold if enrichment occurs? A: It is raised [14/dawn-a-success-threshold-that-moves-with-the-enrichment].
