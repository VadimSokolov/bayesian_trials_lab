---
id: economic-futility-threshold
name: Economic futility threshold
type: concept
aliases: [PP star, PP*]
level: 3
summary: The predictive probability below which continuing a phase 2 trial no longer pays, derived from the cost of the remaining patients and the value of a true positive.
chapters: ['15']
home: 15/the-economic-threshold-pp
sections: []
prerequisites: [predictive-probability-monitoring]
related:
- {rel: uses, to: real-options}
equations: [eq-ppstar]
functions: [p2_pp_star]
results: []
lab: []
cites: []
---
## What it is

The thresholds 0.05 and 0.95 of phase 2 monitoring are conventions, and a decision-theoretic reading ties the futility threshold to money [15/the-economic-threshold-pp]. A false go costs $c_3$, the expected cost of a failed phase 3, a missed active drug forfeits $V$, and continuing costs the remaining patients $m c_2$ [15/the-economic-threshold-pp]. The myopic rule gives

$$
\mathrm{PP}^* = \frac{m c_2}{\rho V - (1-\rho) c_3},
$$

where $\rho$ is the probability that phase 3 succeeds given a phase 2 success [15/the-economic-threshold-pp].

## Why it matters

The threshold is small when the drug is valuable and the remaining phase 2 is cheap [15/the-economic-threshold-pp]. The futility threshold should be derived from economics, then judged by operating characteristics like any other threshold [15/the-economic-threshold-pp].

## In the book

The book uses two invented drugs, in millions of dollars, "for teaching, not taken from a real program" [15/the-economic-threshold-pp]. For the valuable drug the conventional 0.05 is more aggressive than the economics justify [15/the-economic-threshold-pp]. For the crowded indication the denominator is negative, so a phase 2 success does not justify going on to phase 3 and the trial should not be running at all [15/the-economic-threshold-pp].

## Pitfalls

The book's lesson is not that a particular number is right, only that the threshold follows from the economics [15/the-economic-threshold-pp]. The inputs are invented, so do not quote them as program data [15/the-economic-threshold-pp].

## Check yourself

- Q: When is PP* small? A: When the drug is valuable and the remaining phase 2 is cheap [15/the-economic-threshold-pp].
- Q: What does a negative denominator mean? A: A phase 2 success leads to a phase 3 of negative expected value [15/the-economic-threshold-pp].
