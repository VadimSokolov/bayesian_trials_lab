---
id: multiplicity
name: Multiplicity
type: concept
aliases: [multiple comparisons]
level: 1
summary: Multiplicity is the problem that every extra question a trial asks is another chance for luck to look like a discovery.
chapters: ['10']
home: sec-multiplicity
sections: [sec-multiplicity, sec-mult-cost, 10/what-counts-as-the-family, sec-mult-review, sec-mult-problem]
prerequisites: []
related:
- {rel: contrasts-with, to: shrinkage}
- {rel: governed-by, to: fda-multiple-endpoints-guidance-2022}
equations: []
functions: [decide_subset_cost, mult_simulate]
results: []
lab: [04-multiplicity]
cites: [ich_e9, fda_multiple_endpoints_2022]
---

## What it is

Most trials have a primary endpoint, several secondary ones, a few doses, some prespecified subgroups and an interim analysis or two. Each added question is another chance for luck to produce a result that looks like a discovery. Multiplicity is the name for this problem; the procedures that control it are among the most settled parts of trial statistics. [sec-multiplicity]

The family is defined by the claims the sponsor may make, not by the number of tests the statistician runs. A statistician who runs forty tests but whose protocol rests the claim on one prespecified comparison has a family of one. [sec-mult-problem]

## Why it matters

A sponsor who reports the best of twenty results as though it were the only one asked has not told the reader how the result was found. A regulator who approves on it has accepted a risk that nobody measured. [sec-multiplicity]

## In the book

ICH E9 lists three sources: multiple primary variables, multiple treatment comparisons, and repeated evaluation over time or interim analyses. [10/what-counts-as-the-family] Keeping K analyses open and guaranteeing 0.025 for the best of them makes the trial grow by the factor $((z_K + z_\beta)/(z_1 + z_\beta))^2$. [sec-mult-cost]

With twenty independent tests of a useless drug the chance of at least one significant result is about 0.40. [sec-mult-problem]

Exploratory endpoints, safety endpoints and descriptive subgroup displays are outside the family because no claim is made on them, and the protocol should say so. [10/what-counts-as-the-family]

## Pitfalls

- Dividing alpha among co-primary endpoints is unnecessary and costs power, because success on all of them is tested at the full level. [10/what-counts-as-the-family]
- Reviewers will ask for the family, the procedure, the interim spending and the status of secondaries if the primary fails, all before unblinding. [sec-mult-review]

## Check yourself

- Q: A protocol says the claim rests on one prespecified comparison, but the analyst runs forty tests. How big is the family? A: One, because the family is defined by the claims. [sec-mult-problem]
- Q: Does keeping many analyses open cost patients? A: Yes, by the factor $((z_K + z_\beta)/(z_1 + z_\beta))^2$, about 1.48 for five analyses and 2.38 for a hundred. [sec-mult-cost]
