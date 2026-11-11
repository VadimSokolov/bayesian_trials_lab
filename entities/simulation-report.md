---
id: simulation-report
name: Simulation report
type: concept
aliases: []
level: 2
summary: 'The written and submitted account of a design''s simulated operating characteristics: aims, rules, calibration, scenarios, Monte Carlo error, prior sensitivity and code.'
chapters: ['14', '23']
home: sec-sim-report
sections: [sec-sim-software, sec-simulation, 14/where-the-calibration-noise-comes-from]
prerequisites: [operating-characteristics, clinical-trial-simulation]
related:
- {rel: governed-by, to: fda-adaptive-design-guidance-2019}
- {rel: governed-by, to: fda-bayesian-draft-guidance-2026}
- {rel: governed-by, to: cid-program}
equations: []
functions: [oc_simulate, oc_summarize]
results: []
lab: [14-studio]
cites: [fda2019adaptive, fda_bayesian_2026, ich_e20, morris2019simulation, dimairo2020adaptive]
---
## What it is

The simulation report is the deliverable of a Bayesian adaptive design, in the way the sample size calculation is the deliverable of a traditional one [sec-simulation]. The book maps its contents to the ADEMP framework of aims, data-generating mechanisms, estimands, methods and performance measures [sec-sim-report].

## Why it matters

The FDA 2019 guidance, the Bayesian draft and ICH E20 differ in detail and agree in substance [sec-sim-report]. They are drafts or guidance, not law, but a submission that omits what they list is unlikely to survive review without a good reason [sec-sim-report].

## In the book

The report states aims, the design as simulated, calibration, scenarios, estimand, performance measures, Monte Carlo error, prior, software and reproducibility, example trials and traceability [sec-sim-report]. In submitting, the FDA's Complex Innovative Trial Design paired meeting program expects a simulation report ahead of the meeting [sec-sim-software]. Reproducibility means fixing the generator and seed, recording versions, and archiving code and outputs [sec-sim-software].

## Pitfalls

Reports most often fall short on three items: enrolled versus completed patients, binding versus non-binding futility, and traceability between the simulated code and the protocol rules [sec-sim-report]. If the monitoring committee can ignore a futility recommendation, type I error must be calibrated with the futility rule ignored [sec-sim-report].

## Check yourself

- Q: What should be reported beside every simulated rate? A: Its Monte Carlo standard error [14/where-the-calibration-noise-comes-from].
- Q: What is the easiest way to keep code and protocol rules identical? A: Generate both from one specification [sec-sim-report].
