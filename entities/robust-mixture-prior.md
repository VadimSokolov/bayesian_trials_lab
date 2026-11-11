---
id: robust-mixture-prior
name: Robust mixture prior
type: method
aliases: [robust prior, robust MAP prior]
level: 2
summary: A mixture of an informative prior and a vague prior whose weights are updated by the data, so that borrowing fades when the current data conflict.
chapters: ['19', '8']
home: sec-borrowing-map
sections: [sec-borrowing-map, sec-borrowing-ess, sec-borrowing-belimumab, sec-borrowing-drift]
prerequisites: [meta-analytic-predictive-prior, conjugate-prior]
related:
- {rel: alternative-to, to: commensurate-prior}
- {rel: used-in, to: belimumab-pediatric-lupus}
- {rel: part-of, to: bayesian-borrowing}
equations: [eq-robust]
functions: [borrow_priors, borrow_ess_robust, borrow_robust_weight]
results: []
lab: [09-adaptive-bayesian]
cites: [schmidli2014robust]
---
## What it is

Schmidli and colleagues (2014) protect a MAP prior with a vague component:

$$
\pi_{\text{rob}}(\theta) = w\,\pi_{\text{MAP}}(\theta) + (1-w)\,\pi_{\text{vague}}(\theta).
$$

This is eq-robust. [sec-borrowing-map] The conjugate update of a mixture is a mixture of conjugate updates, with weights multiplied by the marginal likelihood of the current data under each component. [sec-borrowing-map]

## Why it matters

If the current control data look like the MAP prior, the weight stays on the informative component. If not, the weight moves to the vague component and the posterior reverts to the current data. [sec-borrowing-map] The posterior mixture weight says how much of the answer comes from outside the trial, so it is the quantity to report. [sec-borrowing-map]

## In the book

The weight $1-w$ on the vague component is a design choice, and 0.1 to 0.5 is the book's working range, not a figure from the literature. [sec-borrowing-map] In the drift example the prior is 0.8 Beta$(31,71)$ plus 0.2 Beta$(1,1)$ with a historical arm of 100 patients and 30 responders. [sec-borrowing-ess] Belimumab in pediatric lupus is the clearest regulatory example. [sec-borrowing-belimumab]

## Pitfalls

A robust prior learns agreement slowly. A control arm of 30 has a standard error of about 0.08, so a true rate 0.10 above the historical rate is within two standard errors and the weight barely moves. [sec-borrowing-map] At a ten point drift the robust prior still has a type I error above the power prior's. [sec-borrowing-drift]

## Check yourself

- Q: Where does the weight go if the current data conflict? A: To the vague component. [sec-borrowing-map]
- Q: Does it protect against a moderate drift in a control arm of 30? A: Very little. [sec-borrowing-ess]
