---
id: sample-size
name: Sample size
type: concept
aliases: [sample size calculation]
level: 1
summary: The number of patients or events a trial needs, computed from two error rates and a guess about the treatment effect, and scaling as the inverse square of that effect.
chapters: ['9']
home: sec-power
sections: [9/two-errors-and-one-guess, 9/the-same-formula-for-three-kinds-of-endpoint, sec-power-cost]
prerequisites: [power, design-alternative]
related:
- {rel: governed-by, to: ich-e9-r1}
equations: [eq-ss-standard, eq-ss-cont, eq-ss-bin, eq-ss-events]
functions: [n_binary, n_continuous, events_schoenfeld, n_fixed]
results: []
lab: [03-errors-power]
cites: [schoenfeld1981, freedman1982logrank, moore_pivotal_costs_2018]
---

## What it is

Setting power equal to $1-\beta$ and solving gives

$$
n = \frac{(z_\alpha + z_\beta)^2}{I\,\theta^2}.
$$

This is eq-ss-standard. The numerator is the whole error specification, and the denominator is the science [9/two-errors-and-one-guess]. Halving the effect quadruples the sample size [9/two-errors-and-one-guess].

## Why it matters

The effect is the one input the trial has not informed, and the answer is most sensitive to it [9/two-errors-and-one-guess]. ICH E9 section 3.5 requires the protocol to give the calculation method and its assumptions [sec-power]. The sample size sentence in the protocol is a budget line [sec-power-cost].

## In the book

Endpoints differ only in what $I\theta^2$ means [9/the-same-formula-for-three-kinds-of-endpoint]. For events with 1:1 allocation, Schoenfeld gives

$$
d = \frac{4\,(z_\alpha+z_\beta)^2}{\log(\mathrm{HR})^2}.
$$

This is eq-ss-events. Moving from HR 0.50 to 0.80 multiplies the required events by 9.6, from 87 to 844, and HR 0.90 needs nearly 3,800 events at 90% power. The binary example, 30% against 45%, needs 214 per arm [9/the-same-formula-for-three-kinds-of-endpoint]. Moore and colleagues put the median cost of a pivotal trial at US\$19.0 million [sec-power-cost].

## Pitfalls

The binary formula is an approximation, and pooled-variance versions differ [9/the-same-formula-for-three-kinds-of-endpoint]. A time-to-event trial is complete when it has its events, and patient numbers need a second calculation [9/the-same-formula-for-three-kinds-of-endpoint].

## Check yourself

- Q: What happens to the required events if the hazard ratio moves from 0.50 to 0.80? A: They rise 9.6-fold, from 87 to 844 [9/the-same-formula-for-three-kinds-of-endpoint].
- Q: What are the two inputs besides the effect? A: The two error rates [9/two-errors-and-one-guess].
