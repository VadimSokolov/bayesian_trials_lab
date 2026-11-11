---
id: phase-2-trial
name: Phase II trial
type: design
aliases: [phase II]
level: 1
summary: The phase where most drugs fail, asking whether the drug moves an endpoint at all and which dose to carry into Phase III.
chapters: ['2', '15']
home: sec-lifecycle-p2
sections: [2/key-points, sec-lifecycle-reading]
prerequisites: [drug-development]
related:
- {rel: precedes, to: phase-3-trial}
- {rel: uses, to: predictive-probability-of-success}
- {rel: uses, to: dose-finding}
equations: []
functions: []
results: []
lab: []
cites: [krams2003astin, sheiner1997]
---
## What it is
Phase II is where most drugs fail and where most of the value of a development program is created or destroyed. [sec-lifecycle-p2] Phase IIa is proof of concept, a small study asking whether the drug moves a clinical or biomarker endpoint. Phase IIb is dose ranging against placebo, to choose the dose for Phase III. [sec-lifecycle-p2]

## Why it matters
Bayesian methods have their strongest claim here, because the purpose is learning rather than confirming. [sec-lifecycle-p2] The natural output is a posterior over the dose-response curve and a predictive probability that Phase III will succeed, not a p-value. [sec-lifecycle-p2] The traditional design uses fixed-dose arms or a single-arm response test. [sec-lifecycle-reading]

## In the book
ASTIN tested a neutrophil inhibitory factor in acute ischemic stroke. Patients were allocated adaptively among many doses and placebo with a Bayesian dose-response model, and the design had rules to stop for futility or efficacy. [sec-lifecycle-p2] It found no effect and stopped early for futility at 966 patients according to the published report. [sec-lifecycle-p2] A conventional group sequential design with a futility rule could also have stopped early. [sec-lifecycle-p2]

## Pitfalls
A Phase III designed around the Phase II point estimate is usually underpowered. [sec-lifecycle-p2]

## Check yourself
- Q: What does Phase II ideally output? A: A posterior over the dose-response curve and a predictive probability of Phase III success. [sec-lifecycle-p2]
- Q: What was ASTIN's most valuable output? A: A fast, well-founded negative result. [sec-lifecycle-p2]
