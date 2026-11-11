---
id: trial-cost
name: Trial cost
type: concept
aliases: [cost of a trial]
level: 2
summary: The money a trial spends, split in the book into variable cost that scales with person-time and fixed cost that does not, so that early stopping saves only part of the budget.
chapters: ['21', '1', '9']
home: 21/trial-cost
sections: [sec-cases-worth, 21/summary-of-the-accounting]
prerequisites: [select-reconstruction]
related:
- {rel: uses, to: real-options}
equations: []
functions: []
results: []
lab: [12-decisions]
cites: [moore_pivotal_costs_2018]
---

## What it is
Moore and colleagues reviewed the pivotal trials of 59 novel agents approved by the FDA in 2015 and 2016. [21/trial-cost]
The median estimated cost of a pivotal trial was 19.0 million dollars, the costliest single trial was about 347 million, and the mean for the five cardiovascular pivotal trials was 157.2 million. [21/trial-cost]

## Why it matters
Cost is one of the currencies in which the book prices the SELECT saving. [sec-cases-worth]
The saving is not proportional to the whole budget: variable costs such as site payments, visits, monitoring, laboratory work and drug supply scale with person-time, while fixed costs such as protocol development, startup, regulatory work and the final analysis do not. [21/trial-cost]

## In the book
The book has no published cost for SELECT, which is far larger than the typical trial in that review. [21/trial-cost]
It takes the cardiovascular mean of 157 million dollars as the base case and 350 million and 600 million as scenarios for a larger trial, not as estimates for any particular trial. [21/trial-cost]
The modeled saving is the avoided share of person-time times the variable share, and the variable share is an assumption because the split is proprietary. [21/trial-cost]
For a trial of SELECT's size the modeled saving is of the order of tens to a couple of hundred million dollars. [21/trial-cost]

## Pitfalls
The figure leaves out the cost of longer exposure that a regulator might require to build the safety database, which would reduce the saving. [21/trial-cost]
The book ranks the cost row as an order of magnitude, a weaker basis than the events and patient-years rows. [21/summary-of-the-accounting]

## Check yourself
- Q: Why is the saving smaller than the avoided share of the budget? A: Only variable cost scales with person-time, and fixed cost does not. [21/trial-cost]
- Q: Is 157 million dollars the cost of SELECT? A: No, it is the cardiovascular mean from the review, used as a base case. [21/trial-cost]
