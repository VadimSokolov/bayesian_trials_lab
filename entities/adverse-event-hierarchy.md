---
id: adverse-event-hierarchy
name: Adverse event hierarchy
type: method
aliases: [hierarchical adverse event model]
level: 3
summary: A hierarchical model across adverse event terms that shrinks many rare events toward a common distribution before flagging.
chapters: ['13']
home: sec-safety-aggregate
sections: [sec-safety-aggregate, 13/the-gamma-poisson-shrinker]
prerequisites: [hierarchical-model, shrinkage]
related:
- {rel: part-of, to: aggregate-safety-assessment}
- {rel: alternative-to, to: gamma-poisson-shrinker}
- {rel: uses, to: false-discovery-rate}
equations: []
functions: []
results: []
lab: []
cites: [xia2011hierarchical, mehrotra2012flagging, berry2004accounting]
---
## What it is

A hierarchical model across adverse event terms, as in Xia, Ma and Carlin, shrinks the many rare events toward a common distribution before flagging. [sec-safety-aggregate] It works in the same way as the gamma-Poisson shrinker does for spontaneous reports. [sec-safety-aggregate]

## Why it matters

A trial reports many adverse event terms, so unadjusted flags multiply by chance. Berry and Berry borrow strength across adverse event categories within a trial, the within-trial version of the same remedy for multiplicity. [13/the-gamma-poisson-shrinker]

## In the book

After shrinkage a false discovery rate flag, such as the double FDR of Mehrotra and Adewale, limits the expected false-discovery proportion among flagged terms. Their procedure groups adverse events by body system. [sec-safety-aggregate]

## Pitfalls

- Shrinkage protects against noise in rare cells, not against bias. [13/the-gamma-poisson-shrinker]

## Check yourself

- Q: What does the hierarchy borrow across? A: Adverse event terms, shrinking rare ones toward a common distribution. [sec-safety-aggregate]
