---
id: ancova
name: ANCOVA
type: method
aliases: [change from baseline, analysis of covariance]
level: 2
summary: Regress the follow-up outcome on treatment and the baseline value, which multiplies the variance of the effect by about one minus R squared.
chapters: ['5']
home: 5/continuous-outcomes-ancova
sections: [5/change-from-baseline-or-ancova]
prerequisites: [covariate-adjustment]
related: []
equations: []
functions: [covadj_ancova_gain, covadj_variance_factors]
results: []
lab: []
cites: [senn2006change, vickers2001baseline, ema_covadj_2015, fda_covadj_2023]
---
## What it is
For a continuous outcome with a prognostic baseline covariate, the standard adjusted analysis is analysis of covariance: regress the outcome on treatment and the covariate, and read the treatment coefficient. [5/continuous-outcomes-ancova]

If the covariate explains a fraction $R^2$ of the outcome variance within arms, the variance of the effect and the sample size for a given power are multiplied by about $1 - R^2$. [5/continuous-outcomes-ancova]

## Why it matters
With a baseline-to-follow-up correlation $\rho$, the variance relative to the final-value analysis is 1 for the final value, $2(1 - \rho)$ for the change score and $1 - \rho^2$ for ANCOVA. The change score beats the final value only when $\rho > 0.5$, and ANCOVA is better than both at every $\rho$. [5/change-from-baseline-or-ancova]

## In the book
For 90 percent power at a two-sided 5 percent level and a difference of 0.4 standard deviations, the example has the baseline explaining 30 percent of the variance. The book uses `covadj_ancova_gain` for this calculation. [5/continuous-outcomes-ancova]

FDA says power and sample size can be based on adjusted or unadjusted methods, and that the unadjusted choice is often more conservative. [5/continuous-outcomes-ancova]

In ANCOVA, with baseline as a covariate in a linear model, the treatment effect is identical whether the outcome is the raw follow-up value or the change, so reporting on the change scale is a separate question from estimation. [5/change-from-baseline-or-ancova]

## Pitfalls
The gain applies to a planned adjusted analysis: the covariate must be committed to in the protocol. [5/continuous-outcomes-ancova] The change-score analysis is unbiased in a randomized trial, but it spends precision. [5/change-from-baseline-or-ancova]

## Check yourself
- Q: When does the change score beat the final value? A: Only when the baseline correlation exceeds 0.5. [5/change-from-baseline-or-ancova]
- Q: By what factor does ANCOVA scale the variance? A: About $1 - R^2$. [5/continuous-outcomes-ancova]
