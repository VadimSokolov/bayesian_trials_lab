---
id: reproducibility
name: Reproducibility
type: concept
aliases: [simulation seed]
level: 1
summary: The practice that every simulation shows its seed beside the result, that Monte Carlo error is reported, and that stored output is regenerated deliberately.
chapters: [C, '14']
home: sec-software-repro
sections: [sec-software-example, sec-software-lab, 3/use-of-bayesian-methodology-in-clinical-trials-of-drug-and-biological-products-draft-january-2026]
prerequisites: [clinical-trial-simulation]
related:
- {rel: uses, to: simulation-report}
- {rel: part-of, to: bayesian-protocol}
equations: []
functions: [oc_simulate, oc_calibrate]
results: []
lab: [14-simulator]
cites: []
---
## What it is
Every simulation either calls `set.seed()` in the chunk or passes `seed =` to the package function, so the seed is visible next to the result. [sec-software-repro] Functions draw from R's global generator after the seed is set. [sec-software-repro]

## Why it matters
A chunk is repeatable, but its results depend on the order of the random calls inside it. [sec-software-repro] Monte Carlo results are reported with their Monte Carlo error. [sec-software-repro] A different seed gives values that differ in the third decimal place. [sec-software-example]

## In the book
- Quarto's freeze mechanism (`freeze: auto` in `_quarto.yml`) stores each chapter's output, so a rebuild reuses it unless the chapter source changed. [sec-software-repro]
- Slow chunks are knitr-cached, keyed to a checksum of the installed package. [sec-software-repro]
- To regenerate after a package change, reinstall it, delete the chapter's directory under `_freeze/` and its knitr cache, and render again. [sec-software-repro]
- The authors recommend recording `sessionInfo()` for exact reproduction. [sec-software-repro]
- The worked example uses 20,000 simulated trials per run with seeds 1, 3 and 2. [sec-software-example]

## Pitfalls
The calibration run's rejection proportion is the calibration target, not an error assessment, so a fresh null run with another seed is needed. [sec-software-example]

## Check yourself
- Q: Why check the type I error on a fresh run with another seed? A: The calibration run's rejection rate is the target, not an assessment. [sec-software-example]
- Q: What does FDA's Bayesian draft say to report about computing? A: Software versions, code and MCMC seed numbers. [3/use-of-bayesian-methodology-in-clinical-trials-of-drug-and-biological-products-draft-january-2026]
