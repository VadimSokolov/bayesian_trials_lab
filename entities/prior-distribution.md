---
id: prior-distribution
name: Prior distribution
type: concept
aliases: [prior]
level: 1
summary: The distribution a sponsor states for the treatment effect before the trial, which the traditional design hides inside its design alternative.
chapters: ['8', '6', '19']
home: sec-priors
sections: [sec-priors-implicit, sec-priors-sources, sec-priors-selection, 8/key-points]
prerequisites: [bayes-rule, likelihood]
related:
- {rel: generalizes, to: skeptical-prior}
- {rel: generalizes, to: enthusiastic-prior}
- {rel: generalizes, to: noninformative-prior}
- {rel: governed-by, to: fda-bayesian-draft-guidance-2026}
equations: [eq-events]
functions: [events_schoenfeld, prob_success]
results: []
lab: [16-bayesian-protocol]
cites: [ohagan2005assurance, polson2026bayesstandard]
---

## What it is

A prior is something a sponsor can state, justify, quantify and defend [sec-priors]. The Bayesian analysis is distinguished mainly by writing one of its assumptions down [sec-priors]. The traditional design has a prior of its own that rarely gets the name. Its protocol states alpha, power and a design alternative, and the prior column reads "Not stated" [sec-priors-implicit].

For example, the traditional design fixes the number of events for a hazard ratio design alternative $\theta_a$: [sec-priors-implicit]

$$
d = \frac{4(z_{\alpha} + z_{\beta})^2}{\theta_a^2}
$$

This is equation eq-events. [sec-priors-implicit]

## Why it matters

For time-to-event data with 1:1 allocation the design needs $d = \frac{4(z_{\alpha} + z_{\beta})^2}{\theta_a^2}$ events (eq-events). A hazard ratio of 0.75 gives $\theta_a = 0.288$ and 508 events [sec-priors-implicit]. The design alternative is a planning assumption that treats one value as known, and nobody believes it [sec-priors-implicit]. Averaging power over a stated prior gives assurance [sec-priors-implicit].

## In the book

Four sources recur: phase 2 data from the same program, the published literature and earlier programs, expert elicitation, and mechanistic models [sec-priors-sources]. Phase 2 is the most natural and the most misleading, because programs advance when phase 2 looks good. In a simulation, about a third of drugs advance, and a prior centered on their phase 2 estimate would be centered on more than twice the true effect on the log scale [sec-priors-selection]. In the illustration, advanced programs had a phase 2 hazard ratio of 0.71 and a true one of 0.86 [8/key-points].

## Pitfalls

The traditional analysis is not a bad choice for this reason. When a single test is run in a trial large enough that any reasonable prior is overwhelmed, it is simple and sufficient [sec-priors-implicit]. The numbers of the simulation are illustrative and not from any program [sec-priors-selection].

## Check yourself

- Q: Does the traditional design assume anything about the effect? A: It assigns no prior probability to any effect, but the power calculation treats one value as if it were known [sec-priors-implicit].
- Q: Why is a phase 2 estimate a risky prior center? A: Programs advance when it looks good, so it is biased upward [sec-priors-selection].
