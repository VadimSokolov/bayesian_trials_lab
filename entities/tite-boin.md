---
id: tite-boin
name: TITE-BOIN
type: method
aliases: [late-onset toxicity]
level: 3
summary: An interval design that assigns doses in real time while some enrolled patients still have pending toxicity data.
chapters: ['17']
home: 17/late-onset-toxicity-and-utility-based-interval-designs
sections: [17/late-onset-toxicity-and-utility-based-interval-designs, 17/randomized-dose-comparison-and-what-a-regulator-will-ask]
prerequisites: [boin-design]
related: []
equations: []
functions: []
results: []
lab: [14-studio]
cites: [cheung2000sequential, yuan2018titeboin, lin2020boin12, yuan2024dose]
---

## What it is
Late-onset toxicity means the outcome of each cohort is not known before the next is dosed. [17/late-onset-toxicity-and-utility-based-interval-designs] The time-to-event CRM of Cheung and Chappell uses the fraction of the observation window completed for patients without a DLT, while observed DLTs contribute full information, so enrollment need not pause. [17/late-onset-toxicity-and-utility-based-interval-designs] TITE-BOIN builds the same idea into the interval design. [17/late-onset-toxicity-and-utility-based-interval-designs]

## Why it matters
TITE-BOIN allows real-time dose assignment while some toxicity data are pending. It addresses late-onset toxicity, which is common for targeted agents and immunotherapy, and rapid accrual. [17/late-onset-toxicity-and-utility-based-interval-designs]

## In the book
BOIN12 is a related design for the efficacy-toxicity trade-off. It targets the optimal biologic dose and is simple enough that its decision rules can be tabulated in the protocol as BOIN's are. [17/late-onset-toxicity-and-utility-based-interval-designs] A review covers design strategies for dose-optimization trials, including the randomized comparison the FDA guidance recommends. [17/late-onset-toxicity-and-utility-based-interval-designs]

## Pitfalls
The reviewer will ask how late toxicities and dose reductions after cycle 1 are handled in the dose decision. [17/randomized-dose-comparison-and-what-a-regulator-will-ask]

## Check yourself
- Q: Why can enrollment continue under TITE-BOIN? A: Pending patients contribute partial information, so no pause is needed. [17/late-onset-toxicity-and-utility-based-interval-designs]
