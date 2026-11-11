---
id: prognostic-covariate-adjustment
name: Prognostic covariate adjustment
type: method
aliases: [PROCOVA, digital twin]
level: 2
summary: A method that builds a prognostic score from external data and uses it as a baseline covariate in a randomized analysis, cutting variance without borrowing outcomes.
chapters: ['19']
home: sec-borrowing-procova
sections: [sec-borrowing-procova, sec-borrowing-guide, sec-borrowing-keypoints]
prerequisites: [covariate-adjustment, randomization]
related:
- {rel: contrasts-with, to: bayesian-borrowing}
equations: []
functions: []
results: []
lab: [09-adaptive-bayesian]
cites: [ema_procova_2022, fda_covadj_2023, unlearn_mmrm_2024]
---
## What it is

Prognostic covariate adjustment (PROCOVA) builds a prognostic model of the control-arm outcome from external data, such as historical trial data. Each participant's predicted outcome, the "digital twin" prediction under control, is then a baseline covariate in the randomized analysis. [sec-borrowing-procova]

## Why it matters

The treatment effect is still estimated by comparing randomized arms, so the analysis stays valid, and the covariate absorbs outcome variation, so variance falls. [sec-borrowing-procova] No assumption about the stability of the control arm over time is made. [sec-borrowing-procova] The method is often the first to propose to a regulator wary of external controls. [sec-borrowing-procova]

## In the book

The EMA's CHMP adopted a qualification opinion in September 2022 for phase 2 and 3 trials with continuous outcomes. The model is fixed before the trial, and with an independently developed, pre-specified score PROCOVA can preserve asymptotic type I error control despite poor prediction. [sec-borrowing-procova] The contrast is that PROCOVA uses external data to sharpen a randomized comparison, whereas borrowing uses them to replace part of it. [sec-borrowing-procova] It is a special case of covariate adjustment with a single prognostic score. [sec-borrowing-procova]

## Pitfalls

Precision gains depend on prognostic performance, and small trials need suitable finite-sample inference. [sec-borrowing-procova] It gives up less and so buys less than a full borrowing design. [sec-borrowing-procova]

## Check yourself

- Q: Does PROCOVA borrow control outcomes? A: No, it uses external data only to build a score. [sec-borrowing-procova]
- Q: What does the sponsor gain? A: Variance reduction, which can become a smaller sample size. [sec-borrowing-procova]
