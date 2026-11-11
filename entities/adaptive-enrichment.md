---
id: adaptive-enrichment
name: Adaptive enrichment
type: design
aliases: []
level: 3
summary: A design that starts with broad enrollment and restricts to responsive biomarker subgroups as interim data accumulate.
chapters: ['17']
home: sec-dose-enrich
sections: [sec-dose-enrich]
prerequisites: [subgroup-analysis, posterior-probability-of-benefit]
related:
- {rel: uses, to: multiplicity}
- {rel: governed-by, to: fda-bayesian-draft-guidance-2026}
equations: []
functions: []
results: []
lab: [14-studio]
cites: [polson2026simbayes, fda_bayesian_2026]
---

## What it is
When benefit or the best dose differs by a biomarker-defined subgroup, broad enrollment can dilute estimates, and one dose may be wrong for part of the population. [sec-dose-enrich] An enrichment design starts broad and restricts to responsive subgroups as data accumulate. [sec-dose-enrich] At each interim, the subgroup posterior probability of benefit $\Pr(\theta_g > 0 \mid \text{data})$ maps to one of three actions: continue broadly, restrict enrollment to promising subgroups, or stop. [sec-dose-enrich]

## Why it matters
The thresholds are calibrated by simulation, which is what the FDA draft Bayesian guidance asks for. [sec-dose-enrich]

## Pitfalls
The multiplicity cost is real: subgroup-by-interim looks multiply chances of a chance finding. [sec-dose-enrich] Hierarchical models that borrow across subgroups are the Bayesian answer. [sec-dose-enrich] For dose-finding, dose-selection and enrichment decisions are usually treated separately unless the trial is built for both. [sec-dose-enrich]

## Check yourself
- Q: Name the three interim actions. A: Continue broadly, restrict to promising subgroups, or stop. [sec-dose-enrich]
