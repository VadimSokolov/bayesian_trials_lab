---
id: mtpi-design
name: mTPI design
type: method
aliases: [mTPI, mTPI-2]
level: 3
summary: Toxicity probability interval designs that pick the next dose by the posterior mass of underdosing, equivalence and overdosing intervals.
chapters: ['17']
home: 17/the-other-interval-designs-mtpi-mtpi-2-and-keyboard
sections: [17/the-other-interval-designs-mtpi-mtpi-2-and-keyboard]
prerequisites: [boin-design]
related:
- {rel: alternative-to, to: keyboard-design}
equations: []
functions: []
results: []
lab: [14-studio]
cites: [ji2007dose, ji2010modified, guo2017mtpi2, horton2017performance, zhou2018accuracy]
---

## What it is
The toxicity probability interval designs divide the DLT-rate axis into an underdosing interval, an equivalence interval around the target and an overdosing interval. [17/the-other-interval-designs-mtpi-mtpi-2-and-keyboard] The first version is Ji and colleagues (2007). [17/the-other-interval-designs-mtpi-mtpi-2-and-keyboard] The modified form, mTPI, computes the posterior mass of each interval divided by its width and moves toward the interval with the largest value. [17/the-other-interval-designs-mtpi-mtpi-2-and-keyboard] The mTPI-2 design changes how the intervals are formed, in response to a weakness of mTPI that its authors frame as an Ockham's razor problem. [17/the-other-interval-designs-mtpi-mtpi-2-and-keyboard]

## Why it matters
As with BOIN, the protocol carries a table of decisions by DLTs and number treated, and the logic can be checked by hand. [17/the-other-interval-designs-mtpi-mtpi-2-and-keyboard]

## In the book
Which design to choose is an empirical question answered by simulation. [17/the-other-interval-designs-mtpi-mtpi-2-and-keyboard] One study compared CRM, mTPI and BOIN on correct selection, allocation near the MTD and an accuracy index. [17/the-other-interval-designs-mtpi-mtpi-2-and-keyboard]

## Pitfalls
Such comparisons hold only in stated scenarios at stated sample sizes. The protocol should report the chosen design's own operating characteristics, including a badly placed target. [17/the-other-interval-designs-mtpi-mtpi-2-and-keyboard]

## Check yourself
- Q: What does mTPI divide by the interval width? A: The posterior probability mass of each interval. [17/the-other-interval-designs-mtpi-mtpi-2-and-keyboard]
