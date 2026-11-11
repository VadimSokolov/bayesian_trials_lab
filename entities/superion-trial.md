---
id: superion-trial
name: Superion
type: trial
aliases: [Superion device trial]
level: 3
summary: An interspinous spacer device trial whose Bayesian non-inferiority success threshold of 0.958 was set by simulation to control the type I error below 0.05.
chapters: ['14', '3']
home: 14/superion-a-device-threshold-of-0958
sections: [sec-sim-calibration, 14/choosing-a-and-c]
prerequisites: [posterior-probability-success-criterion]
related:
- {rel: illustrates, to: calibration}
- {rel: governed-by, to: fda-bayesian-draft-guidance-2026}
equations: []
functions: []
results: []
lab: []
cites: [fda_superion_ssed_2015, fda_bayesian_devices_2010]
---
## What it is

The Superion interspinous spacer trial (PMA P140004) randomized against a comparator device [14/superion-a-device-threshold-of-0958]. It used a Bayesian adaptive sample size of 250 to 350 evaluable patients, a non-inferiority margin of 10 percent and flat Beta(1,1) priors [14/superion-a-device-threshold-of-0958].

## Why it matters

Success required a posterior probability of non-inferiority of at least 0.958, a value chosen to control the type I error below 0.05 [14/superion-a-device-threshold-of-0958]. The stated power was 86.3 percent [14/superion-a-device-threshold-of-0958].

## In the book

The final modified intention-to-treat sample was 190 against 201 patients [14/superion-a-device-threshold-of-0958]. The posterior probability of non-inferiority was 0.9927, or 0.9944 per protocol, above the threshold, with approval on 20 May 2015 [14/superion-a-device-threshold-of-0958]. The book's lesson is that 0.958 is not a conventional number: it is what a simulation of this margin, prior, error budget and adaptive sample size returned [14/superion-a-device-threshold-of-0958].

## Pitfalls

The threshold makes sense only together with its margin, priors and adaptive sample size [14/choosing-a-and-c]. Calibrating a Bayesian threshold to a frequentist error rate by simulation is described in FDA's 2010 guidance on Bayesian statistics in medical device trials [14/superion-a-device-threshold-of-0958].

## Check yourself

- Q: Why 0.958 and not a conventional number? A: It came from simulating this trial's margin, prior and adaptive sample size to control type I error below 0.05 [14/superion-a-device-threshold-of-0958].
- Q: Did the trial clear the threshold? A: Yes, with a posterior probability of 0.9927 [14/superion-a-device-threshold-of-0958].
