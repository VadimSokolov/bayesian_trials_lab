---
id: optimizer-smart-trial
name: OPTIMIZER Smart
type: trial
aliases: [OPTIMIZER Smart device trial, FIX-HF-5C]
level: 2
summary: A heart failure device trial analyzed with a fixed 30% Bayesian borrowing weight from an earlier study, without which the success criterion was missed.
chapters: ['19', '3']
home: sec-borrowing-optimizer
sections: [sec-borrowing-optimizer, sec-borrowing-drift, sec-borrowing-keypoints, sec-borrowing-idea]
prerequisites: [power-prior, posterior-probability-success-criterion]
related:
- {rel: illustrates, to: bayesian-borrowing}
- {rel: illustrates, to: borrowing-under-drift}
equations: []
functions: []
results: []
lab: [09-adaptive-bayesian]
cites: [fda_optimizer_ssed_2019, fda_bayesian_devices_2010]
---
## What it is

The OPTIMIZER Smart System (cardiac contractility modulation, Impulse Dynamics, PMA P180036) was reviewed by an FDA device panel on 4 December 2018 and approved on 21 March 2019 for heart failure patients in NYHA class III with ejection fraction 25 to 45%. [sec-borrowing-optimizer]

## Why it matters

The pivotal trial FIX-HF-5C randomized 160 patients 1:1 and used a Bayesian model with 30% fixed borrowing from 229 patients with ejection fraction above 25% in the earlier FIX-HF-5 study. The endpoint was the change in peak VO2 at 24 weeks, with success at posterior probability above 0.975. [sec-borrowing-optimizer]

## In the book

With borrowing the posterior probability was between 0.977 and 0.989 under four ways of handling missing data. FIX-HF-5C alone gave 0.957 and 0.960 under two imputation models, 0.916 for the complete-case analysis and 0.911 with last observation carried forward, below 0.975 in each. [sec-borrowing-optimizer] The success of the device therefore depended on the borrowed 30%. [sec-borrowing-optimizer]

## Pitfalls

If the earlier study overstated the effect, the conclusion rests on that overstatement. The FDA device guidance expects simulated operating characteristics under such discrepancies. [sec-borrowing-optimizer] The fixed weight is the device analogue of a power prior with $a_0=0.3$. [sec-borrowing-optimizer]

## Check yourself

- Q: Would the trial have met 0.975 without borrowing? A: No, the posterior probabilities were 0.911 to 0.960. [sec-borrowing-optimizer]
- Q: What kind of borrowing is a fixed 30% weight? A: Static. [sec-borrowing-idea]
