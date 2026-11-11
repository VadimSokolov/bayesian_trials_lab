---
id: moderate-deviation-sample-size
name: Moderate deviation sample size
type: method
aliases: [moderate deviation, moderate deviation sample size equation]
level: 3
summary: A sample size equation from the Bayes decision rule that replaces the fixed critical value by a boundary growing like the square root of log n, giving larger fixed designs.
chapters: ['9', '11']
home: sec-power-md
sections: [9/the-fixed-n-test-has-no-memory-of-n, 9/the-power-function-and-the-sample-size-equation, 9/the-surprising-result, 9/many-parameters-and-many-endpoints, 9/where-the-saving-is-and-where-it-is-not, sec-power, sec-power-sidebyside]
prerequisites: [sample-size, bayes-factor, lindleys-paradox]
related:
- {rel: part-of, to: deviation-scale}
- {rel: contrasts-with, to: large-deviation}
- {rel: uses, to: prior-odds-constant}
equations: [eq-md-boundary, eq-md-power, eq-md-ss]
functions: [n_md, events_md, n_fixed]
results: [moderate_deviation_sample_size, moderate_deviation_select_comparison]
lab: [03-errors-power]
cites: [polson2026bayesstandard, polson2026evaluesbayesrisk]
---

## What it is

The Bayes-optimal boundary on the standardized scale is

$$
t_{\text{crit}} = \sqrt{\log n + C}\,\bigl(1 + o(1)\bigr), \qquad C = 2\log\frac{\pi_0/\pi_a}{\pi(\theta_0)\sqrt{2\pi/I(\theta_0)}},
$$

which is eq-md-boundary [9/the-fixed-n-test-has-no-memory-of-n]. Replacing $z_\alpha$ by it gives the sample size equation

$$
n\,I\,\theta^2 = \left(\sqrt{\log n + C} + z_\beta\right)^2 .
$$

This is eq-md-ss, solved by fixed-point iteration [9/the-power-function-and-the-sample-size-equation]. The matching power function (eq-md-power) is

$$
\text{Power}_n(\theta) = \Phi\!\left(\sqrt{nI}\,\theta - \sqrt{\log n + C}\right) + o(1), \qquad \theta > 0 \text{ for the one-sided benefit rule}.
$$

[9/the-power-function-and-the-sample-size-equation] For a unit-information prior with equal prior odds $C = 0$ and the boundary is $\sqrt{\log n}$. [9/the-fixed-n-test-has-no-memory-of-n]

## Why it matters

With $C = 0$ the boundary exceeds 1.96 for every $n$ above 46. It is 2.63 at $n = 1000$ and 3.03 at $n = 10{,}000$ [9/the-fixed-n-test-has-no-memory-of-n]. The result runs against the book's thesis: the fixed design is larger, not smaller [sec-power].

## In the book

At $\theta = 0.20$ the ratio to the textbook size is 1.30, about 30% larger. It is 1.52 at $\theta = 0.10$ and 1.73 at $\theta = 0.05$ [9/the-surprising-result]. The extra patients buy a type I error that falls with $n$ [9/the-surprising-result]. For $d$ parameters the boundary is $\sqrt{d\log n}$, which is 2.63, 3.72 and 4.55 for one to three at $n = 1000$ [9/many-parameters-and-many-endpoints]. The saving comes from monitoring, not from the fixed design [9/where-the-saving-is-and-where-it-is-not].

## Pitfalls

Calibrated to 0.025, the fixed-sample Bayesian design needs the same sample size as the traditional one [sec-power-sidebyside]. Any stated $C$ must name its unit, events or information [9/the-power-function-and-the-sample-size-equation]. The expression is asymptotic [9/the-fixed-n-test-has-no-memory-of-n].

## Check yourself

- Q: Does the moderate deviation design need fewer patients than the textbook design? A: No, about 30% more at $\theta = 0.20$ [9/the-surprising-result].
- Q: Where does the Bayesian saving lie? A: In monitoring [9/where-the-saving-is-and-where-it-is-not].
