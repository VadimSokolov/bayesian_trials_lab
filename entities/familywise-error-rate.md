---
id: familywise-error-rate
name: Familywise error rate
type: concept
aliases: [FWER]
level: 1
summary: The chance of at least one false positive among a family of hypotheses, which regulators expect to be controlled in the strong sense for claims.
chapters: ['10']
home: sec-mult-problem
sections: [sec-mult-problem, 10/what-counts-as-the-family, 10/what-the-guidance-asks-for, 10/what-shrinkage-does-not-do]
prerequisites: [multiplicity, type-i-error]
related:
- {rel: contrasts-with, to: false-discovery-rate}
- {rel: governed-by, to: fda-multiple-endpoints-guidance-2022}
equations: [eq-fwer]
functions: [mult_simulate]
results: []
lab: [04-multiplicity]
cites: [ich_e9, fda_multiple_endpoints_2022]
---

## What it is

Suppose a drug does nothing and we test it on $k$ independent endpoints, each at one-sided level $\alpha = 0.025$. The chance that at least one test crosses the bar is one minus the chance that none does. [sec-mult-problem]

$$
\Pr(\text{at least one false positive}) = 1 - (1-\alpha)^k .
$$

This probability is the familywise error rate when all $k$ null hypotheses are true. For $k=1$ it is 0.025 by design. [sec-mult-problem]

## Why it matters

With twenty independent tests of a useless drug the chance of at least one "significant" result is about 0.40. [sec-mult-problem] The FDA multiple endpoints guidance expects strong control of the familywise error rate for the endpoints that support a claim. [10/what-the-guidance-asks-for]

## In the book

Independence is neither the best nor the worst case. With a shared control group or positively correlated endpoints the probability is typically smaller, but false positives come in clumps. [sec-mult-problem]

The formula is about a drug that does nothing. What a regulator wants to prevent is a false claim, so the family is the set of hypotheses whose rejection would be presented as evidence supporting approval or labeling. [10/what-counts-as-the-family]

## Pitfalls

- The global null alone is not enough when checking strong control: simulation must cover mixed configurations where some hypotheses are true and others false. [10/what-the-guidance-asks-for]
- Shrinkage does not give a familywise guarantee. A rule with shrinkage must be calibrated by simulation if a regulator requires one. [10/what-shrinkage-does-not-do]

## Check yourself

- Q: What is the chance of at least one false positive for twenty tests at 0.025? A: About 0.40. [sec-mult-problem]
- Q: Do interim looks on the same endpoint belong to the cross-endpoint family procedures? A: They are handled by a group sequential boundary and then combined with the cross-endpoint procedures. [10/what-counts-as-the-family]
