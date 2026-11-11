---
id: overdose-control
name: Escalation with overdose control
type: method
aliases: [overdose control, EWOC]
level: 3
summary: A dose-escalation rule that picks the highest dose whose posterior probability of overdosing stays within a feasibility bound.
chapters: ['17']
home: 17/escalation-with-overdose-control
sections: [17/escalation-with-overdose-control, sec-dose-blrm]
prerequisites: [continual-reassessment-method]
related:
- {rel: uses, to: bayesian-logistic-regression-model}
equations: []
functions: []
results: []
lab: [14-studio]
cites: [babb1998ewoc, neuenschwander2008blrm]
---

## What it is
Escalation with overdose control (EWOC) changes the criterion for the next dose. [17/escalation-with-overdose-control] Instead of the dose whose estimated DLT rate is closest to the target, it chooses the highest dose for which the posterior probability of overdosing does not exceed a feasibility bound $\eta$. [17/escalation-with-overdose-control] The bound often starts at 0.25 and is raised as the trial proceeds. [17/escalation-with-overdose-control]

## Why it matters
A dose with some chance of being too toxic is not the one most likely to be chosen. This builds a patient-safety constraint into the decision and was an early attempt to give ethical control a formal expression. [17/escalation-with-overdose-control]

## In the book
The Bayesian logistic regression model applies the same idea to interval probabilities of the DLT rate. [17/escalation-with-overdose-control] In the worked example the admissible-dose bound is 0.25 on the probability of overdosing. [sec-dose-blrm]

## Pitfalls
With either design the decisions rest on a posterior that depends strongly on the prior. The FDA draft on Bayesian methodology says the prior should be justified and subjected to sensitivity analysis. [17/escalation-with-overdose-control]

## Check yourself
- Q: How does EWOC differ from CRM in choosing a dose? A: It bounds the posterior probability of overdose instead of picking the dose closest to target. [17/escalation-with-overdose-control]
