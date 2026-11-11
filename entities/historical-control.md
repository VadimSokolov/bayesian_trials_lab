---
id: historical-control
name: Historical control
type: concept
aliases: [external control, externally controlled trial]
level: 2
summary: A control group taken from outside the current randomized comparison, such as an earlier trial or registry, whose use ICH E10 and regulators treat with caution.
chapters: ['19']
home: sec-borrowing-external
sections: [sec-borrowing-external, sec-borrowing-traditional, sec-borrowing-nsclc, sec-borrowing-guide]
prerequisites: [clinical-trial, confounding-by-indication]
related:
- {rel: contrasts-with, to: concurrent-control}
equations: []
functions: []
results: []
lab: [09-adaptive-bayesian]
cites: [ich_e10, pocock1976, fda_external_controls_2023, mhra_external_controls_2025, ema_external_controls_2025, ghadessi2020roadmap, fda_rare_diseases_2023]
---
## What it is

In a single-arm trial the effect is judged against what is expected without treatment, and that expectation comes from a published control arm, a registry, earlier trials or routine care. ICH E10 calls this the externally controlled trial and lists it among five kinds of control group. [sec-borrowing-external] Assignment is not randomized and the controls may be nonconcurrent, so the design is regarded as suitable only when the effect is large relative to the variability of the natural course. [sec-borrowing-external]

## Why it matters

In a small or pediatric rare-disease trial the number of eligible patients may not support a conventional-size randomized control arm at all. [sec-borrowing-traditional]

## In the book

Three mechanisms make an external control misleading: selection, time and measurement. Each gives a bias and not a variance, so a larger external sample does not help. [sec-borrowing-external] Pocock (1976) listed conditions for combining historical and randomized controls: same treatment, same protocol, same institutions where possible, same prognostic factors and no unexplained outcome differences. [sec-borrowing-external] FDA issued a draft guidance on externally controlled trials in February 2023, and the MHRA and EMA followed in 2025 with a draft guideline and a concept paper. Both stress pre-specification and fitness for purpose. [sec-borrowing-external] Propensity-score methods decide how much external data enters, but cannot repair covariates that were not measured. [sec-borrowing-external]

## Pitfalls

Matching on measured covariates removes only the measured bias, as the NSCLC case study shows. [sec-borrowing-nsclc] The FDA rare-diseases guidance reserves external controls for specific circumstances. [sec-borrowing-external]

## Check yourself

- Q: Why does a larger external sample not fix an external control? A: The three mechanisms produce bias, not variance. [sec-borrowing-external]
- Q: Which source gave the classic list of conditions for historical controls? A: Pocock (1976). [sec-borrowing-external]
