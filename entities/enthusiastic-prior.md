---
id: enthusiastic-prior
name: Enthusiastic prior
type: concept
aliases: []
level: 2
summary: A prior centered at the design alternative with the same spread as the skeptical prior, standing for the investigator who designed the trial.
chapters: ['8', '22']
home: sec-priors-three
sections: [sec-priors-remapcap, sec-priors-eolia]
prerequisites: [prior-distribution]
related:
- {rel: contrasts-with, to: skeptical-prior}
- {rel: used-in, to: remap-cap-trial}
- {rel: used-in, to: eolia-trial}
equations: []
functions: [normal_update, grid_update]
results: []
lab: [16-bayesian-protocol]
cites: [spiegelhalter1994bayesian, goligher2021anticoag, lawler2021anticoag]
---

## What it is

The enthusiastic prior is centered at the design alternative with the same spread as the skeptical one, $\theta \sim N(\theta_a, s^2)$, so that the prior probability that the effect is zero or harmful is 0.05. It represents the investigator who designed the trial [sec-priors-three].

## Why it matters

It is a calibration device and not an analysis prior [sec-priors-three]. If a trial is negative even under the enthusiastic prior, even the investigator must accept the drug is not delivering what it promised, which is the logic of a futility rule [sec-priors-three]. As a stress test, a conclusion that holds under a skeptical-to-neutral analysis prior and is not overturned by the optimist is hard to attack [sec-priors-remapcap].

## In the book

The multiplatform heparin trials pre-specified an enthusiastic prior as the sensitivity analysis, with a mean odds ratio of 1.75 (95% credible interval 0.74 to 4.15, prior probability of superiority 90%) [sec-priors-remapcap]. In EOLIA the posterior probability of any mortality benefit ranged from 88% under a strongly skeptical prior to 99% under an enthusiastic or published-study prior [sec-priors-eolia]. In the 508-event example the data carry about four times the weight of either reference prior, so the posterior ends close to the likelihood [sec-priors-three].

## Pitfalls

It expresses an informative position. Do not treat it as the primary analysis [sec-priors-three].

## Check yourself

- Q: What does a negative trial under the enthusiastic prior tell you? A: Even the investigator must accept the drug is not delivering [sec-priors-three].
- Q: In EOLIA, how far apart were the skeptic and the enthusiast? A: 88% against 99% posterior probability of benefit [sec-priors-eolia].
