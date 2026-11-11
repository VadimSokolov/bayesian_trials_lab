---
id: astin-trial
name: ASTIN
type: trial
aliases: [ASTIN trial]
level: 2
summary: A Bayesian adaptive dose-response trial of a neutrophil inhibitor in acute ischemic stroke that stopped for futility at an interim.
chapters: ['17']
home: 17/astin-a-bayesian-adaptive-dose-response-trial-in-stroke
sections: [17/astin-a-bayesian-adaptive-dose-response-trial-in-stroke, sec-dose-response]
prerequisites: [dose-finding, posterior-distribution]
related:
- {rel: illustrates, to: phase-2-trial}
equations: []
functions: []
results: []
lab: [14-studio]
cites: [krams2003astin, grieve2005astin]
---

## What it is
The Acute Stroke Therapy by Inhibition of Neutrophils (ASTIN) trial was a Bayesian adaptive dose-response study of a neutrophil inhibitor in acute ischemic stroke. [17/astin-a-bayesian-adaptive-dose-response-trial-in-stroke]

## In the book
Rather than a few fixed doses, it modeled the dose-response curve over a wide range with a smoothing model, so each dose borrowed strength from its neighbors. [17/astin-a-bayesian-adaptive-dose-response-trial-in-stroke] The accumulating posterior chose later patients' doses, targeted the dose near maximum effect, and drove early stopping for efficacy or futility under prespecified rules. [17/astin-a-bayesian-adaptive-dose-response-trial-in-stroke] The trial stopped for futility at an interim analysis. [17/astin-a-bayesian-adaptive-dose-response-trial-in-stroke]

## Why it matters
The dose-finding model, allocation rule and stopping rule were all specified in advance and evaluated by simulation, as the 2026 FDA draft expects for a Bayesian design. [17/astin-a-bayesian-adaptive-dose-response-trial-in-stroke]

## Pitfalls
The book keeps the description general. The exact dynamic linear model and allocation criterion should be taken from the original papers. [17/astin-a-bayesian-adaptive-dose-response-trial-in-stroke]

## Check yourself
- Q: How did ASTIN share information across doses? A: A smoothing model of the dose-response curve. [17/astin-a-bayesian-adaptive-dose-response-trial-in-stroke]
- Q: How did it end? A: Stopped for futility at an interim. [17/astin-a-bayesian-adaptive-dose-response-trial-in-stroke]
