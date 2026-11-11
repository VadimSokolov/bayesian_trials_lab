---
id: goldilocks-design
name: Goldilocks design
type: design
aliases: []
level: 3
summary: A trial that lets accrual run until two predictive probabilities say the sample is not too big and not too small, with thresholds calibrated by simulation.
chapters: ['14', '15']
home: sec-sim-goldilocks
sections: [sec-goldilocks, 14/dawn-a-success-threshold-that-moves-with-the-enrichment]
prerequisites: [predictive-probability-of-success, calibration]
related:
- {rel: used-in, to: dawn-trial}
- {rel: special-case-of, to: bayesian-adaptive-design}
equations: []
functions: [oc_calibrate, oc_predictive_matrix, oc_with_futility, prob_superior]
results: []
lab: [14-simulator, 09-adaptive-bayesian]
cites: [broglio2014goldilocks]
---
## What it is

The Goldilocks sample size design of Broglio, Connor and Berry does not fix its sample size [sec-sim-goldilocks]. At each look it computes $\mathrm{PP}_{\text{stop}}$, success if enrollment stops now and pending outcomes complete, and $\mathrm{PP}_{\max}$, success at the maximum sample size [sec-sim-goldilocks]. It stops enrolling for expected success when the first is high and stops for futility when the second is low [sec-sim-goldilocks].

## Why it matters

The sample size is an output, bounded by $N_{\max}$, and the thresholds are calibrated by simulating type I error, not derived [sec-sim-goldilocks]. The design replaces an interim efficacy boundary, a futility boundary and sample size re-estimation with one pre-specified rule [sec-goldilocks]. Its price is a random sample size, so budgets must be planned for the maximum [sec-goldilocks].

## In the book

With immediate outcomes $\mathrm{PP}_{\text{stop}}$ collapses to an indicator and only the $\mathrm{PP}_{\max}$ futility rule remains [sec-sim-goldilocks]. In the chapter 14 sketch, futility at $F = 0.05$ cuts the expected sample size under the null by more than half, at a cost in power largest at the design alternative 0.15 [sec-sim-goldilocks]. In the chapter 15 example, 30 of 50 against 15 of 50 stops enrollment, and equal rates of 18 of 50 stop for futility [sec-goldilocks]. DAWN's plan is a trial-sized version [sec-sim-goldilocks].

## Pitfalls

Stopping enrollment when the predictive probability is high is an efficacy decision and spends type I error [sec-goldilocks]. The look frequency and the delay length change the calibration [sec-goldilocks].

## Check yourself

- Q: Which predictive probability triggers futility? A: $\mathrm{PP}_{\max}$, when it is low [sec-goldilocks].
- Q: Does the design fix the sample size? A: No, it is an output bounded by $N_{\max}$ [sec-sim-goldilocks].
