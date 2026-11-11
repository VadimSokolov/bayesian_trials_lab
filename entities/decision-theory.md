---
id: decision-theory
name: Decision theory
type: concept
aliases: [statistical decision theory]
level: 2
summary: A framework in which a prior, a model for the data and a utility or loss together say when approving, stopping or continuing a trial beats waiting.
chapters: ['1', '11', '15']
home: sec-decision-decision
sections: [1/the-three-things-a-protocol-fixes, sec-decision-regulation]
prerequisites: [clinical-trial, posterior-distribution]
related:
- {rel: uses, to: prior-distribution}
- {rel: uses, to: utility-function}
- {rel: contrasts-with, to: p-value}
- {rel: generalizes, to: one-sided-test}
equations: [eq-ch01-rule]
functions: []
results: []
lab: [12-decisions]
cites: [fda_bayesian_2026, polson2026modaldoctor]
---
## What it is
A hypothesis test asks whether the data are surprising if the drug does nothing, and leaves the rest to judgment outside the statistics. The decision framework puts that judgment inside the model. [sec-decision-decision] It needs three ingredients: a prior for the treatment effect, a model for the data (the same likelihood as the traditional analysis), and a utility or loss that says what the outcomes are worth. [sec-decision-decision]

At a terminal analysis, suppose approving a drug that does not work costs $L_{\mathrm{I}}$ and failing to approve a drug that does work costs $L_{\mathrm{II}}$. With posterior probability $p$ that the drug works, approving is better when [sec-decision-decision]

$$
p > \frac{L_{\mathrm{I}}}{L_{\mathrm{I}} + L_{\mathrm{II}}}.
$$

This is equation eq-ch01-rule. [sec-decision-decision]

## Why it matters
The threshold depends only on the ratio of the two costs. If a false approval is thirty-nine times as costly as a missed drug, the threshold is 39/40 = 0.975, so the one-sided $\alpha = 0.025$ is an implicit statement of that ratio. [sec-decision-decision] With a flat prior and a normal likelihood, approving above 0.975 is the same as rejecting when $p < 0.025$. [sec-decision-decision]

## In the book
Every protocol fixes what is known going in, what will count as success, and what the sponsor may do along the way. [1/the-three-things-a-protocol-fixes] The regulator can judge a design by what it does under pre-specified truths, without sharing the sponsor's prior or utility. [1/the-three-things-a-protocol-fixes]

## Pitfalls
The displayed threshold is not an interim stopping rule. An interim decision must also compare both terminal losses with the sampling cost and the expected value of continuing. [sec-decision-decision]

## Check yourself
- Q: What threshold on the posterior probability corresponds to a cost ratio of 39 to 1? A: 39/40 = 0.975. [sec-decision-decision]
- Q: When do the Bayesian rule and the one-sided test agree? A: With a flat prior, a normal likelihood and a single look. [sec-decision-decision]
