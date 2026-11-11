---
id: efftox
name: EffTox
type: method
aliases: [phase 1/2 design, phase 12 designs]
level: 3
summary: A phase 1/2 design of Thall and Cook that models efficacy and toxicity by dose and picks the acceptable dose with the best trade-off.
chapters: ['17']
home: 17/efftox-and-phase-12-designs
sections: [17/efftox-and-phase-12-designs, 17/late-onset-toxicity-and-utility-based-interval-designs]
prerequisites: [utility-function, maximum-tolerated-dose]
related:
- {rel: alternative-to, to: continual-reassessment-method}
equations: []
functions: []
results: []
lab: [14-studio]
cites: [thall2004, thall1998, houede2010, thall2015rar, thall2016, thall2024, polson2026simbayes]
---

## What it is
EffTox of Thall and Cook models efficacy and toxicity probabilities as functions of dose. Efficacy has a quadratic logistic form, so the curve can turn down. Toxicity has a monotone logistic form. A copula links the two outcomes in a patient. [17/efftox-and-phase-12-designs] Instead of utilities for four outcomes, the original design elicits a trade-off contour in the plane of $(\pi_T, \pi_E)$ through pairs of equally desirable probabilities. [17/efftox-and-phase-12-designs] The next cohort gets the acceptable dose with the highest desirability. [17/efftox-and-phase-12-designs]

## Why it matters
The trial can state what it says about the dose-response, with a distribution of efficacy and toxicity at the chosen dose. [17/efftox-and-phase-12-designs]

## In the book
Three things differ from toxicity-only designs. An efficacy endpoint must be observable fast enough to use during the trial. Samples are larger, usually 40 to a few hundred. The contour or utility elicitation must be defended. [17/efftox-and-phase-12-designs]

## Pitfalls
Early efficacy readouts that are only surrogates bring a surrogacy question into the dose decision. [17/efftox-and-phase-12-designs] The decisions need each cohort's outcome before the next is dosed, which is the late-onset problem. [17/late-onset-toxicity-and-utility-based-interval-designs]

## Check yourself
- Q: What does EffTox elicit instead of four utilities? A: A trade-off contour of equally desirable efficacy and toxicity pairs. [17/efftox-and-phase-12-designs]
- Q: What typical sample size does it need? A: 40 to a few hundred. [17/efftox-and-phase-12-designs]
