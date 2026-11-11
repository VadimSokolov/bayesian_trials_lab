---
id: aggregate-safety-assessment
name: Aggregate safety assessment
type: concept
aliases: []
level: 2
summary: 'A sponsor safety review built from four layers: blinded pooled review, unblinded committee review, hierarchical models across terms, and a false discovery rate flag.'
chapters: ['13']
home: sec-safety-aggregate
sections: [sec-safety-aggregate, sec-safety, sec-safety-reg]
prerequisites: [safety-signal]
related:
- {rel: generalizes, to: blinded-pooled-review}
- {rel: generalizes, to: adverse-event-hierarchy}
- {rel: generalizes, to: maxsprt}
- {rel: governed-by, to: ind-safety-report}
equations: []
functions: []
results: []
lab: []
cites: [gould2017canary, xia2011hierarchical, mehrotra2012flagging, kulldorff2011maxsprt]
---
## What it is

A sponsor's safety review is not one statistic. Four layers sit side by side, and each answers a different question. [sec-safety-aggregate]

- [[blinded-pooled-review]] asks whether the overall event rate is higher than expected, without revealing the arms. [sec-safety-aggregate]
- The unblinded DMC review compares arms, with the boundaries and posterior rules of the monitoring and toxicity sections. [sec-safety-aggregate]
- A hierarchical model across adverse event terms shrinks many rare events toward a common distribution before flagging. [sec-safety-aggregate] See [[adverse-event-hierarchy]].
- A false discovery rate flag, such as the double FDR of Mehrotra and Adewale, limits the expected false-discovery proportion among flagged terms. [sec-safety-aggregate]

## Why it matters

Which layer is a trigger for action and which only a hypothesis for review is a decision for the safety plan to state, and the regulator will ask for it. [sec-safety-aggregate] The FDA guidance recommends reviewing accumulating events in aggregate and not one report at a time. [sec-safety]

## In the book

Outside the trial, surveillance of marketed products uses [[maxsprt]]. [sec-safety-aggregate] 21 CFR 312.32 lists an aggregate analysis showing more frequent events on drug than on control among the evidence that triggers an [[ind-safety-report]]. [sec-safety]

## Pitfalls

- No monitoring rule shortens or lengthens the reporting clocks. [sec-safety-reg]

## Check yourself

- Q: How many layers does the book list, and which one reveals no arm labels? A: Four. The blinded pooled review. [sec-safety-aggregate]
