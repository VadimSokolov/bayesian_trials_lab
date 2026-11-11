---
id: prior-specification
name: Prior specification in the protocol
type: concept
aliases: [prior in the protocol]
level: 2
summary: 'What a protocol or analysis plan must state about the prior: its form, provenance, weight, comparison priors, sensitivity, robustness and success criterion.'
chapters: ['8', '23']
home: sec-priors-protocol
sections: [sec-priors-fda, sec-priors-device, 8/what-can-go-wrong, sec-priors-sidebyside]
prerequisites: [prior-distribution, effective-sample-size, sensitivity-analysis]
related:
- {rel: governed-by, to: fda-bayesian-draft-guidance-2026}
- {rel: uses, to: tipping-point-analysis}
equations: []
functions: []
results: []
lab: [16-bayesian-protocol]
cites: [fda_bayesian_2026, fda_bayesian_devices_2010, ich_e20, polson2026bayesstandard]
---

## What it is

A prior section of a protocol should contain seven items: the analysis prior with its implied distribution for the estimand, its provenance, its effective sample size, comparison priors, the sensitivity analysis with a tipping-point report, a robustness provision, and the success criterion with its calibration [sec-priors-protocol].

## Why it matters

The FDA draft says "It is always critical for Bayesian analyses to have a prespecified prior" [sec-priors-fda]. It distinguishes the analysis prior from design priors used only in simulation [sec-priors-fda]. It describes three routes for the success criterion: calibration, direct reading of the posterior, and benefit-risk criteria. Informative priors need greater justification [sec-priors-fda]. The draft leaves open how large an ESS is acceptable [sec-priors-fda].

## In the book

Four failures recur: a prior chosen after the data, a single published estimate treated as a prior, a flat prior mistaken for no prior, and a prior that matters presented as one that does not [8/what-can-go-wrong]. The 2010 device guidance is the final precedent: agree the prior with the Agency beforehand, and it allows type I error control at a less stringent level when prior information is used [sec-priors-device]. ICH E20 treats the prior in the same spirit in Section 5.3 [sec-priors-fda].

## Pitfalls

The draft is not binding, and a sponsor relying on it should say so in the briefing document [sec-priors-fda]. What stays the same is the standard of evidence: a calibrated confirmatory design uses the same one-sided 0.025 [sec-priors-sidebyside].

## Check yourself

- Q: Which prior enters the inference, the design prior or the analysis prior? A: The analysis prior [sec-priors-fda].
- Q: When may a sponsor read the posterior probability directly? A: Where the prior accurately reflects external data, by agreement with the Agency [sec-priors-fda].
