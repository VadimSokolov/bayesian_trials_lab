---
id: design-alternative
name: Design alternative
type: concept
aliases: []
level: 1
summary: The effect size a trial is built to detect, the most consequential and least certain input to the sample size.
chapters: ['9']
home: 9/sensitivity-to-the-design-alternative
sections: [9/what-the-regulator-sees-and-what-the-sponsor-can-do-wrong, sec-power-zia]
prerequisites: [power]
related:
- {rel: governed-by, to: ich-e9-r1}
equations: []
functions: [n_fixed]
results: []
lab: [03-errors-power]
cites: [zia2005]
---

## What it is

The design alternative $\theta_d$ is the effect the sample size is built to detect. ICH E9 section 3.5 names two ways to choose it: the smallest effect that would be clinically relevant, or the effect the sponsor anticipates [9/sensitivity-to-the-design-alternative].

## Why it matters

Because $n$ scales as $1/\theta^2$, a halving of $\theta$ from 0.20 to 0.10 takes the information requirement from 263 to 1,051 [9/sensitivity-to-the-design-alternative]. A design for the minimal clinically important difference is conservative, but it does not establish that the effect exceeds the minimum, since the null tested is still zero [9/sensitivity-to-the-design-alternative]. A design for the anticipated effect is optimistic and, if wrong, produces a failed trial [9/sensitivity-to-the-design-alternative]. The sponsor's pick is a prior elicitation the protocol never calls by that name [9/sensitivity-to-the-design-alternative].

## In the book

Reviewers see common failures: the assumed effect is the observed effect of a small phase 2 trial, biased upward by selection; variability is taken from the same small trial; the control event rate comes from a historical cohort; no sensitivity analysis is given [9/what-the-regulator-sees-and-what-the-sponsor-can-do-wrong]. A sound protocol gives a table of power at 70%, 80%, 100% and 120% of the design alternative [9/what-the-regulator-sees-and-what-the-sponsor-can-do-wrong]. Only 28% of phase III trials repeating phase II regimens were positive [sec-power-zia].

## Pitfalls

A design alternative equal to the phase 2 estimate is biased upward, so a trial sized on it is underpowered at the true effect [sec-power-zia].

## Check yourself

- Q: What happens to the information required when the design effect halves from 0.20 to 0.10? A: It rises from 263 to 1,051 [9/sensitivity-to-the-design-alternative].
- Q: Does designing for the minimal clinically important difference show the effect exceeds it? A: No, the null tested is still zero [9/sensitivity-to-the-design-alternative].
