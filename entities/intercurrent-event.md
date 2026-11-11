---
id: intercurrent-event
name: Intercurrent event
type: concept
aliases: []
level: 2
summary: An event after treatment starts, such as stopping the drug, rescue medication, switching or death, that affects the interpretation or existence of the measurements.
chapters: ['5']
home: 5/estimands-and-intercurrent-events
sections: [5/the-itt-principle]
prerequisites: [intention-to-treat]
related:
- {rel: part-of, to: estimand}
- {rel: governed-by, to: ich-e9-r1}
equations: []
functions: []
results: []
lab: [06-fair-comparisons]
cites: [ich_e9_r1]
---
## What it is
Intercurrent events are events after treatment initiation that affect either the interpretation or the existence of the measurements. Examples are stopping the drug, taking rescue medication, switching treatment and death before the endpoint. [5/estimands-and-intercurrent-events]

## Why it matters
Each one needs an explicit strategy, written into the [[estimand]]. The addendum names five. [5/estimands-and-intercurrent-events]

- Treatment policy: effect of being assigned the drug, with whatever follows. [5/estimands-and-intercurrent-events]
- Hypothetical: effect if the event had not happened. [5/estimands-and-intercurrent-events]
- Composite variable: effect on a combined outcome. [5/estimands-and-intercurrent-events]
- While on treatment: effect up to the event. [5/estimands-and-intercurrent-events]
- Principal stratum: effect in patients who would not have the event. [5/estimands-and-intercurrent-events]

## In the book
The drug-discontinuation event of the ITT simulation illustrates the strategies. Treatment policy uses the outcome regardless of the event. The composite strategy counts stopping as failure. [5/estimands-and-intercurrent-events]

For a Bayesian analysis under treatment policy, the model is fit to all randomized patients by arm. This requires the outcome to remain defined after the event, and terminal events such as death may need another strategy. [5/estimands-and-intercurrent-events]

## Pitfalls
The hypothetical strategy needs a submodel for the unobserved outcome, with priors on the unidentifiable part, and this deserves a sensitivity analysis because the data cannot correct it. [5/estimands-and-intercurrent-events]

## Check yourself
- Q: Which two strategies compare the groups the coin made? A: Treatment policy and composite variable. [5/estimands-and-intercurrent-events]
- Q: Why does the hypothetical strategy need sensitivity analysis? A: It rests on a model for what would have happened, and the data cannot correct its prior. [5/estimands-and-intercurrent-events]
