---
id: fda-bayesian-draft-guidance-2026
name: FDA Bayesian draft guidance 2026
type: regulation
aliases: [Bayesian draft guidance, Use of Bayesian Methodology in Clinical Trials of Drug and Biological Products]
level: 2
summary: The January 2026 FDA draft on Bayesian methods for drugs and biologics, covering success criteria, priors, borrowing, simulation and documentation.
chapters: ['3', '8', '23', B]
home: 3/use-of-bayesian-methodology-in-clinical-trials-of-drug-and-biological-products-draft-january-2026
sections: [sec-regulatory-changes, 3/key-points, sec-documents, sec-regulatory-force]
prerequisites: [posterior-probability-success-criterion, prior-distribution, type-i-error]
related:
- {rel: uses, to: clinical-trial-simulation}
- {rel: uses, to: prespecification}
- {rel: used-in, to: rebyota-trial}
equations: []
functions: []
results: []
lab: [07-interim-looks]
cites: [fda_bayesian_2026]
---
## What it is
A draft guidance for industry from CDER and CBER, issued in January 2026 under docket FDA-2025-D-3217 and marked as nonbinding. [3/use-of-bayesian-methodology-in-clinical-trials-of-drug-and-biological-products-draft-january-2026] Its scope is INDs, NDAs, BLAs and supplements, with a primary focus on Bayesian support for primary inference, and it does not apply to devices. [3/use-of-bayesian-methodology-in-clinical-trials-of-drug-and-biological-products-draft-january-2026] Success is stated as $\Pr(\delta > a \mid \text{data}) > c$. [sec-regulatory-changes]

## Why it matters
It describes three routes: calibration to a type I error rate, direct interpretation of posterior probabilities, and decision-theoretic or benefit-risk criteria. [sec-regulatory-changes] For trials with an overall frequentist plan, the familywise type I error rate is almost always required to be no greater than 0.025 one-sided. [3/use-of-bayesian-methodology-in-clinical-trials-of-drug-and-biological-products-draft-january-2026] It requires nothing by itself, since it is a draft. [3/use-of-bayesian-methodology-in-clinical-trials-of-drug-and-biological-products-draft-january-2026]

## In the book
- Priors: "It is always critical for Bayesian analyses to have a prespecified prior." [3/use-of-bayesian-methodology-in-clinical-trials-of-drug-and-biological-products-draft-january-2026]
- Borrowing needs strong justification and is judged by effective sample size, not type I error inflation. [3/use-of-bayesian-methodology-in-clinical-trials-of-drug-and-biological-products-draft-january-2026]
- Simulations "should comprehensively cover the plausible range of assumptions". [3/use-of-bayesian-methodology-in-clinical-trials-of-drug-and-biological-products-draft-january-2026]
- Reports should give software versions, code and MCMC seed numbers, and FDA requires no specific software. [3/use-of-bayesian-methodology-in-clinical-trials-of-drug-and-biological-products-draft-january-2026]

## Pitfalls
Calibration is this book's default for confirmatory adaptive designs without borrowing, not the draft's. [3/key-points] Never call a draft a requirement. [sec-regulatory-force]

## Check yourself
- Q: Does the draft require calibration to 0.025? A: No, calibration is one of three routes. [sec-regulatory-changes]
- Q: Which measure does the draft prefer for borrowing? A: Effective sample size and similar influence metrics. [3/use-of-bayesian-methodology-in-clinical-trials-of-drug-and-biological-products-draft-january-2026]
