---
id: continual-reassessment-method
name: Continual reassessment method
type: method
aliases: [CRM]
level: 2
summary: 'The first Bayesian phase 1 design: a one-parameter dose-toxicity curve through a skeleton is updated after each cohort to pick the next dose.'
chapters: ['17']
home: 17/the-continual-reassessment-method
sections: [17/comparing-the-designs, 17/protocol-language, sec-dose-blrm]
prerequisites: [three-plus-three-design, posterior-distribution, prior-distribution]
related:
- {rel: alternative-to, to: boin-design}
- {rel: uses, to: operating-characteristics}
equations: []
functions: [dose_crm, dose_simulate]
results: []
lab: [14-studio]
cites: [oquigley1990crm, goodman1995practical, oquigley1996continual, cheung2011dose, garrettmayer2006crm]
---

## What it is
The continual reassessment method (CRM) of O'Quigley, Pepe and Fisher was the first Bayesian design in phase 1. [17/the-continual-reassessment-method] It posits $p_d(a) = \pi_d^{\exp(a)}$ through $K$ doses, where $\pi_1 < \dots < \pi_K$ is a prespecified skeleton and $a$ has a prior, here $a \sim N(0, 1.34)$. [17/the-continual-reassessment-method] After each cohort the next dose is the one whose posterior mean DLT probability is closest to the target. [17/the-continual-reassessment-method] Two safety rules are standard: no skipping a dose and a stopping rule for an overly toxic lowest dose. [17/the-continual-reassessment-method]

## Why it matters
The protocol now names a skeleton and a prior, which the 3+3 never needed. [17/the-continual-reassessment-method] The posterior is one-dimensional, so a grid works and no MCMC is needed. [17/the-continual-reassessment-method]

## In the book
The skeleton (0.05, 0.12, 0.25, 0.40, 0.55, 0.70) is close to the truth in scenario A and wrong in B and C. [17/the-continual-reassessment-method] With 30 patients CRM selects the true MTD more often than the 3+3, but treats more patients at toxic doses. [17/comparing-the-designs] At 15 patients it is worse than the 3+3 in scenario B. [17/comparing-the-designs]

## Pitfalls
The skeleton is a shape, not the truth. A real simulation report should include scenarios in which it is badly wrong. [17/the-continual-reassessment-method] The one-parameter form is rigid. [17/the-continual-reassessment-method]

## Check yourself
- Q: What does the CRM need in the protocol that the 3+3 does not? A: A skeleton and a prior on its parameter. [17/the-continual-reassessment-method]
- Q: Does CRM beat the 3+3 at any sample size? A: No. At n = 15 it is worse in scenario B. [17/comparing-the-designs]
