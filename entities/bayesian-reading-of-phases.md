---
id: bayesian-reading-of-phases
name: Bayesian reading of the phases
type: concept
aliases: []
level: 2
summary: Each phase updates a posterior and hands it to the next, so one probability model spans the whole development program.
chapters: ['2']
home: sec-lifecycle-reading
sections: [2/key-points]
prerequisites: [drug-development, posterior-distribution]
related:
- {rel: uses, to: predictive-probability-of-success}
equations: []
functions: []
results: []
lab: []
cites: []
---
## What it is
Each phase updates a posterior and hands it to the next. Phase I produces a posterior over the dose-toxicity curve that becomes the prior for dose selection in Phase II. Phase II produces a posterior over the dose-response curve, and its predictive distribution gives the probability that Phase III will succeed. Phase III produces the evidence for approval, and Phase IV keeps updating. [sec-lifecycle-reading]

## Why it matters
The distinction is not that the traditional path passes verdicts and the Bayesian path passes distributions. A Bayesian program specifies one probability model across the phases, so what one phase learns propagates into the predictive probabilities of the next, whereas the traditional path links phases through estimates and judgment. [sec-lifecycle-reading] The rest of the book is about the conditions (calibration, pre-specification, simulation) under which a regulator will accept the alternative. [sec-lifecycle-reading]

## In the book
The phase map pairs each phase with its question, traditional design and Bayesian method. [sec-lifecycle-reading]

- Phase I asks safe or not and which dose. The traditional design is 3+3 and the Bayesian method is model-based escalation. [sec-lifecycle-reading]
- Phase II asks whether it works and at which dose. Traditional designs are fixed-dose arms or a single-arm response test; Bayesian methods are dose-response models, predictive probability and adaptive allocation. [sec-lifecycle-reading]
- Phase III asks whether it is confirmed. The traditional design is fixed or group sequential at type I error 0.025; the Bayesian method is a posterior success criterion calibrated to error control, or borrowing. [sec-lifecycle-reading]
- Phase IV asks about harm after approval. Traditional tools are spontaneous reports and observational studies; Bayesian methods are empirical Bayes shrinkage and sequential monitoring. [sec-lifecycle-reading]


## Check yourself
- Q: What becomes the Phase II prior for dose selection? A: The Phase I posterior over the dose-toxicity curve. [sec-lifecycle-reading]
- Q: Do traditional programs pass information forward? A: Yes, through estimates, models and safety findings. [sec-lifecycle-reading]
