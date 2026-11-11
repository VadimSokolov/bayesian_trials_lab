---
id: boin-design
name: Bayesian optimal interval design
type: method
aliases: [BOIN]
level: 2
summary: A model-assisted phase 1 design whose escalate, stay or de-escalate decisions come from fixed boundaries on the observed DLT rate.
chapters: ['17']
home: 17/the-bayesian-optimal-interval-design
sections: [17/comparing-the-designs, 17/protocol-language, 17/boin-and-fdas-fit-for-purpose-determination]
prerequisites: [three-plus-three-design, maximum-tolerated-dose]
related:
- {rel: alternative-to, to: continual-reassessment-method}
- {rel: governed-by, to: fda-fit-for-purpose-determination}
equations: []
functions: [dose_boin_bounds, dose_boin, dose_simulate]
results: []
lab: [14-studio]
cites: [liu_boin_2015, yuan_boin_2016, lin_boin_combo_2017, fda_fit_for_purpose_2025]
---

## What it is
BOIN of Liu and Yuan is derived from a Bayesian argument, but at the bedside it is a table. [17/the-bayesian-optimal-interval-design] The observed DLT rate at a dose is compared with two fixed boundaries: escalate if it is at most $\lambda_e$, de-escalate if at least $\lambda_d$, otherwise stay. [17/the-bayesian-optimal-interval-design] The boundaries minimize the chance of a wrong decision between three simple hypotheses, at the target, at $0.6\,\Gamma$ and at $1.4\,\Gamma$. [17/the-bayesian-optimal-interval-design] They do not depend on the dose or the number treated. [17/the-bayesian-optimal-interval-design]

## Why it matters
The protocol carries a grid of DLT counts and patient numbers, like the 3+3, so no software is needed on the day. [17/the-bayesian-optimal-interval-design]

## In the book
With cohorts of three and the book's target DLT rate, the rule is to escalate on zero DLTs and de-escalate on one or more (at a target of 0.30, one DLT in three means stay). [17/the-bayesian-optimal-interval-design] A dose is eliminated with all higher ones if the posterior probability that its DLT rate exceeds the target is above 0.95. [17/the-bayesian-optimal-interval-design] With 30 patients BOIN selects the true MTD more often than the 3+3. [17/comparing-the-designs] At 15 patients it is about level with the 3+3 in scenario B. [17/comparing-the-designs]

## Pitfalls
FDA's determination concerns a context of use and does not exempt a sponsor from simulations for its own trial. [17/the-bayesian-optimal-interval-design]

## Check yourself
- Q: With cohorts of three, what does BOIN do after one DLT? A: De-escalate at the book's target (at a target of 0.30, one DLT in three means stay). [17/the-bayesian-optimal-interval-design]
- Q: What must the protocol attach for BOIN? A: The boundaries, the elimination rule and a simulation report. [17/protocol-language]
