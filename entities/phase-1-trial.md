---
id: phase-1-trial
name: Phase I trial
type: design
aliases: [phase I]
level: 1
summary: The first exposure of humans to a drug, asking about tolerability, pharmacokinetics and, in oncology, the maximum tolerated dose.
chapters: ['2', '17']
home: sec-lifecycle-p1
sections: [2/key-points, sec-lifecycle-reading]
prerequisites: [drug-development]
related:
- {rel: uses, to: bayesian-logistic-regression-model}
- {rel: uses, to: continual-reassessment-method}
- {rel: uses, to: overdose-control}
- {rel: contrasts-with, to: three-plus-three-design}
- {rel: uses, to: maximum-tolerated-dose}
- {rel: precedes, to: phase-2-trial}
- {rel: part-of, to: dose-finding}
equations: []
functions: [dose_three_plus_three]
results: []
lab: []
cites: [neuenschwander2008blrm, oquigley1990crm, babb1998ewoc, suntharalingam2006]
---
## What it is
Phase I is the first exposure of humans to the drug. In most therapeutic areas it enrolls 20 to 100 healthy volunteers; in oncology it enrolls patients for whom standard therapy has failed. [sec-lifecycle-p1] The questions are tolerability, pharmacokinetics, pharmacodynamics and, in oncology, the maximum tolerated dose. [sec-lifecycle-p1]

The traditional oncology design is the 3+3 rule: treat three patients at a dose, escalate if none has a dose-limiting toxicity, add three more if one does, and stop if two or more do. [sec-lifecycle-p1] It fits no dose-toxicity curve and so identifies a dose with little precision. [sec-lifecycle-p1] Model-based designs replace it, for example the Bayesian logistic regression model. After each cohort the posterior is updated and the next dose is chosen subject to a cap on the posterior probability of overdosing. [sec-lifecycle-p1]

## Why it matters
Phase I is a safety problem first. Phase I produces a posterior over the dose-toxicity curve that becomes the prior for dose selection in Phase II. [2/key-points] [sec-lifecycle-reading]

## In the book
In March 2006 six healthy volunteers in London received the first human doses of TGN1412 and two received placebo. Within hours all six who got the drug developed a cytokine storm with multiple organ failure. [sec-lifecycle-p1] The doses were given within minutes of one another, so the first reaction could not inform the others. Staggered dosing is now standard. [sec-lifecycle-p1]

## Pitfalls
A sequential design is a safety device before it is an efficiency device. [sec-lifecycle-p1]

## Check yourself
- Q: What does the 3+3 rule use? A: Only toxicity counts at the current dose. [2/key-points]
- Q: What did TGN1412 show? A: A design that cannot update between patients can be dangerous. [2/key-points]
