---
id: estimand
name: Estimand
type: concept
aliases: [estimand framework]
level: 2
summary: A precise description of the treatment effect that a trial is meant to measure, with five attributes including how intercurrent events are handled.
chapters: ['5', '4', '23']
home: 5/estimands-and-intercurrent-events
sections: [5/binary-and-time-to-event-outcomes-what-is-being-estimated, sec-randomization-protocol]
prerequisites: [intention-to-treat, intercurrent-event]
related:
- {rel: governed-by, to: ich-e9-r1}
equations: []
functions: []
results: []
lab: [06-fair-comparisons]
cites: [ich_e9_r1]
---
## What it is
The ICH E9(R1) addendum (Step 4, November 2019) asks the sponsor to define an estimand before the trial: "a precise description of the treatment effect reflecting the clinical question posed by a given clinical trial objective". [5/estimands-and-intercurrent-events]

It has five attributes: the population, the treatment conditions compared, the variable (endpoint), the population-level summary and the way [[intercurrent-event|intercurrent events]] are handled. [5/estimands-and-intercurrent-events]

## Why it matters
"The effect of the drug in patients who take it" differs from "the effect of prescribing it". A protocol that names the estimand tells the reviewer what the analysis can and cannot show. The strategy must match the label the sponsor hopes to obtain. [5/estimands-and-intercurrent-events]

## In the book
The addendum names five strategies: treatment policy, hypothetical, composite variable, while on treatment and principal stratum. Treatment policy and composite fit the randomization directly. Hypothetical and principal stratum need a model or assumptions. [5/estimands-and-intercurrent-events]

For nonlinear models the population-level summary is a choice between conditional and marginal effects, and the protocol should name it. [5/binary-and-time-to-event-outcomes-what-is-being-estimated] A Bayesian posterior must be for the stated estimand. A probability computed for one estimand and quoted for another is the same error as quoting an ITT p-value for a per-protocol claim. [5/estimands-and-intercurrent-events]

The protocol table asks for five attributes written down and one strategy per intercurrent event. [sec-randomization-protocol]

## Pitfalls
A trial with substantial discontinuation can give a valid answer to the treatment-policy question and a doubtful one to the hypothetical question. [5/estimands-and-intercurrent-events]

## Check yourself
- Q: How many attributes does an estimand have? A: Five. [5/estimands-and-intercurrent-events]
- Q: Is per-protocol one of the strategies? A: No. [5/estimands-and-intercurrent-events]
