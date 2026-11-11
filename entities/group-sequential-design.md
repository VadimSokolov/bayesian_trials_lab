---
id: group-sequential-design
name: Group sequential design
type: design
aliases: [interim looks]
level: 2
summary: A design with planned interim looks at fractions of the information, where boundaries keep the total type I error at its nominal level.
chapters: ['11', '14']
home: sec-sequential
sections: [sec-sequential, 11/why-repeated-testing-at-a-fixed-level-fails, 11/obrien-fleming-pocock-and-the-family-between-them, sec-ch10-families, 11/traditional-and-bayesian-monitoring-side-by-side, 11/the-traditional-starting-point-one-look-one-test, 11/spending-functions-and-the-information-fraction]
prerequisites: [interim-analysis, type-i-error, information-fraction]
related:
- {rel: uses, to: armitage-recursion}
- {rel: uses, to: obrien-fleming-boundary}
- {rel: uses, to: pocock-boundary}
- {rel: uses, to: spending-function}
- {rel: uses, to: futility-boundary}
- {rel: governed-by, to: fda-adaptive-design-guidance-2019}
- {rel: alternative-to, to: wald-sprt}
equations: []
functions: [gs_power, gs_boundary, gs_spending_boundary, gs_expected_information, gs_power_drift]
results: []
lab: [07-interim-looks]
cites: [wang1987approximately, pampallona1994group, emerson1989symmetric, kittelson1999unifying, emerson2007frequentist, whitehead1983triangular]
---

## What it is

A trial that looks at accumulating data needs a rule for stopping that keeps the type I error at its nominal level. In a group sequential trial the interim analyses are written at information fractions $t_1 < t_2 < \dots < t_K = 1$, and that is the whole of the design language the chapter needs. [11/the-traditional-starting-point-one-look-one-test]

ICH E9 calls group sequential designs the usual vehicle, because assessing grouped outcomes at periodic intervals is more practicable than continuous review. [sec-sequential]

## Why it matters

Every look is another chance for chance to produce a convincing-looking result. Every sequential method is a response to that inflation, and methods differ only in what they charge for the right to look. [11/why-repeated-testing-at-a-fixed-level-fails]

## In the book

Boundaries come from the Wang-Tsiatis family $b_k = c\, t_k^{\Delta - 1/2}$, with Pocock at $\Delta = 1/2$ and O'Brien-Fleming at $\Delta = 0$. The constant $c$ is found so that the crossing probabilities sum to 0.025 under the null. [11/obrien-fleming-pocock-and-the-family-between-them] The trade-off: Pocock inflates the sample size by about 18 percent and stops on average at 0.59 of the information, O'Brien-Fleming inflates it by about 2 percent and stops at 0.75. [11/obrien-fleming-pocock-and-the-family-between-them]

Other families include Armitage's plans, Whitehead's triangular test, futility boundaries added by Pampallona and Tsiatis, and the unified family of Kittelson and Emerson. A design is chosen by weighing maximum sample size, expected sample size and stopping probabilities, not by ranking families. [sec-ch10-families]

The final bar for four O'Brien-Fleming looks is 2.02 and the sample-size inflation is about 2 percent. [11/obrien-fleming-pocock-and-the-family-between-them]

## Pitfalls

- The number and timing of looks must be written down before the data are seen. [11/why-repeated-testing-at-a-fixed-level-fails]
- Where only a few looks at fixed fractions are planned and no prior information is used, the traditional design is hard to improve on. [11/traditional-and-bayesian-monitoring-side-by-side]

## Check yourself

- Q: What does a group sequential design fix in advance? A: The boundaries, or a spending function, at planned information fractions. [11/spending-functions-and-the-information-fraction]
- Q: Why is a fixed 1.96 cutoff at every look not a test? A: Looks are correlated but not identical, so the chance of at least one crossing exceeds 0.025 and grows with the number of looks. [11/why-repeated-testing-at-a-fixed-level-fails]
