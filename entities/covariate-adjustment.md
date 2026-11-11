---
id: covariate-adjustment
name: Covariate adjustment
type: method
aliases: [adjusting for baseline covariates]
level: 2
summary: Using prespecified prognostic baseline covariates in the analysis of a randomized trial to gain precision without bias, the cheapest precision a trial can buy.
chapters: ['5', '23']
home: sec-randomization-covadj
sections: [5/binary-and-time-to-event-outcomes-what-is-being-estimated, 5/estimators-that-do-not-depend-on-the-model-being-right, 5/what-the-regulators-say, 5/the-bayesian-version, 5/where-else-adjustment-appears, 5/analyze-as-you-randomized, 5/do-not-test-baseline-balance]
prerequisites: [randomization, estimand]
related:
- {rel: generalizes, to: ancova}
equations: []
functions: [covadj_standardize, covadj_bayes_gcomp, covadj_sim_trial, covadj_sim_compare, covadj_true_marginal]
results: []
lab: []
cites: [fda_covadj_2023, ema_covadj_2015, senn1994baseline, kahan2012improper, greenland1999confounding, tsiatis2008covariate, hill2011bayesian]
---
## What it is
Randomization makes the unadjusted comparison unbiased, but not efficient. A baseline covariate that predicts the outcome explains part of the noise, so the analysis gives a narrower interval and more power from the same patients. It needs no prior, no interim look and no extra patients. [sec-randomization-covadj]

## Why it matters
FDA (May 2023, final, nonbinding) and EMA (adopted 26 February 2015) recommend prespecified adjustment, and neither requires it. [5/what-the-regulators-say] They differ on treatment-by-covariate interactions: FDA allows them if the primary estimate is the average effect, EMA says to leave them out. [5/what-the-regulators-say]

## In the book
For binary or time-to-event outcomes the odds ratio and hazard ratio are non-collapsible, so the conditional effect differs from the marginal one even without confounding. FDA's example has an odds ratio of 8.0 in each of two subgroups and 4.8 overall. [5/binary-and-time-to-event-outcomes-what-is-being-estimated] Standardization (g-computation) gives the marginal effect with the adjusted precision. [5/binary-and-time-to-event-outcomes-what-is-being-estimated]

In 500 simulated trials of 300 patients, the adjusted logistic coefficient centered on the conditional log odds ratio, while the standardized estimate shared the target of the unadjusted analysis with a smaller standard deviation. [5/binary-and-time-to-event-outcomes-what-is-being-estimated] Robust estimators remain valid when the working model is wrong. [5/estimators-that-do-not-depend-on-the-model-being-right]

The Bayesian version puts covariates in the outcome model and averages predictions over the trial sample. [5/the-bayesian-version] A fair benchmark for a Bayesian adaptive design is an adjusted traditional analysis. [5/the-bayesian-version]

## Pitfalls
- Do not test baseline balance: a baseline difference in a randomized trial is due to chance. [5/do-not-test-baseline-balance]
- Analyze as you randomized: include stratification factors. [5/analyze-as-you-randomized]
- Covariates measured after randomization should not be adjusted for. [5/what-the-regulators-say]

## Check yourself
- Q: Do the unadjusted and adjusted logistic odds ratios target the same quantity? A: Not necessarily: conditional and marginal effects differ without any confounding. [5/binary-and-time-to-event-outcomes-what-is-being-estimated]
- Q: Does either regulator require adjustment? A: No, both ask that whatever is done be prespecified. [5/what-the-regulators-say]
