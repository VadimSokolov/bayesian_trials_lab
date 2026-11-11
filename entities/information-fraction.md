---
id: information-fraction
name: Information fraction
type: concept
aliases: [information time]
level: 1
summary: The share of the planned total information that has accrued at an interim look, such as events observed over events planned.
chapters: ['11', A]
home: 11/spending-functions-and-the-information-fraction
sections: [11/spending-functions-and-the-information-fraction, 11/the-traditional-starting-point-one-look-one-test]
prerequisites: [interim-analysis]
related:
equations: []
functions: [gs_power, gs_spending_boundary]
results: []
lab: [07-interim-looks]
cites: [landemets1983]
---

## What it is

The information fraction is $t = n I / (N_{\max} I)$, the share of the planned total information that has accrued. [11/the-traditional-starting-point-one-look-one-test]

For a time-to-event endpoint, $t$ is the number of events observed divided by the number planned. For a binary endpoint with equal arms it is the fraction of the planned patients with outcome data. The final analysis is at $t = 1$. [11/the-traditional-starting-point-one-look-one-test]

## Why it matters

Real trials do not look at exact multiples of one quarter. A DMC meeting scheduled for the first Tuesday of a quarter may find 47 percent of the planned events, not 50, and a boundary computed for a $t$ that did not occur is wrong. [11/spending-functions-and-the-information-fraction]

## In the book

Lan-DeMets spending computes the boundary at each look from the realized information fraction. Four looks planned at $t = 0.4, 0.6, 0.8, 1$ have an O'Brien-Fleming-type boundary of 2.68 at the second look. If the second look takes place at $t = 0.55$, that boundary becomes 2.82 and the later ones move slightly. [11/spending-functions-and-the-information-fraction]

## Pitfalls

- The timing of looks must not depend on the observed treatment effect. [11/spending-functions-and-the-information-fraction]
- A trial that stops short of its planned size must decide in the protocol whether the remaining alpha is spent at the last look held. [11/spending-functions-and-the-information-fraction]

## Check yourself

- Q: What is $t$ for an event-driven trial when half of the planned events have been observed? A: One half, events observed over events planned. [11/the-traditional-starting-point-one-look-one-test]
- Q: May the look be moved because the interim effect looks good? A: No, timing must not depend on the observed effect. [11/spending-functions-and-the-information-fraction]
