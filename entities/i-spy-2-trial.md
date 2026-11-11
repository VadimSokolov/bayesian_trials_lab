---
id: i-spy-2-trial
name: I-SPY 2
type: trial
aliases: [I-SPY 2 trial, I-SPY2]
level: 2
summary: A Bayesian platform for neoadjuvant breast cancer that graduates arms by predictive probability of success in a hypothetical phase 3 trial.
chapters: ['20', '10', '15', '16']
home: 20/i-spy-2-graduation-by-predictive-probability
sections: [20/i-spy-2-graduation-by-predictive-probability, 20/shared-control-arithmetic, 20/the-bayesian-time-machine]
prerequisites: [predictive-probability-of-success, response-adaptive-randomization]
related:
- {rel: illustrates, to: platform-trial}
- {rel: uses, to: bayesian-time-machine}
- {rel: contrasts-with, to: gbm-agile-trial}
equations: []
functions: [platform_predictive_graduation]
results: []
lab: [10-platform-trials]
cites: [park2016ispy2, berry2025, barker2009, wang2019ispy2, nanda2020effect]
---
## What it is

I-SPY 2 is a platform for neoadjuvant breast cancer that has enrolled since 2010 and was later reconfigured as I-SPY 2.2. The primary endpoint of each arm was pathologic complete response (pCR) at surgery, with MRI tumor volume used to predict pCR for patients still in follow-up. [20/i-spy-2-graduation-by-predictive-probability] Each therapy was evaluated in each of up to ten *signatures*, the subtype combinations that might become a regulatory indication. [20/i-spy-2-graduation-by-predictive-probability]

## Why it matters

An arm graduated in a signature when its Bayesian predictive probability of success in a hypothetical 300-patient, equally randomized phase 3 trial reached 85%. It was dropped if that probability fell below 10% in all ten signatures, and no arm took more than 120 patients. [20/i-spy-2-graduation-by-predictive-probability] This ties the decision to the confirmatory trial the platform feeds, which a posterior probability of benefit does not. [20/i-spy-2-graduation-by-predictive-probability]

## In the book

A simulation with 50 patients per arm and a phase 3 of 150 per arm tested at one-sided 0.025 compares predictive and posterior probability for four phase 2 results. [20/i-spy-2-graduation-by-predictive-probability] Randomization was response adaptive within a signature, with 20% held on control, and a time machine smoothed the control response over time. [20/i-spy-2-graduation-by-predictive-probability] The platform also tested combination regimens against the shared control. [20/i-spy-2-graduation-by-predictive-probability]

## Pitfalls

It is a phase 2 screening platform: a graduation is a decision to run a phase 3, not an approval, and its false positive rate was calibrated for a screening stage. [20/i-spy-2-graduation-by-predictive-probability] Because allocation adapts toward responsive subtypes, the raw difference should not be read as the treatment effect. [20/i-spy-2-graduation-by-predictive-probability]

## Check yourself

- Q: What predictive probability graduates an arm? A: 85%. [20/i-spy-2-graduation-by-predictive-probability]
- Q: Why use the predictive scale rather than posterior probability? A: It accounts for the size and power of the phase 3 that follows. [20/i-spy-2-graduation-by-predictive-probability]
