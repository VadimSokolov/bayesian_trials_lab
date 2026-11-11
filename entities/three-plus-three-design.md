---
id: three-plus-three-design
name: 3+3 design
type: method
aliases: [3+3, three plus three]
level: 1
summary: The rule-based phase 1 design that treats cohorts of three and escalates or stops by counting dose-limiting toxicities, with no model.
chapters: ['17']
home: sec-dose-33
sections: [17/what-a-phase-1-trial-in-oncology-is-for, 17/the-rule, 17/operating-characteristics-by-simulation, 17/what-six-patients-can-tell-you, 17/what-stays-the-same]
prerequisites: [maximum-tolerated-dose, dose-finding]
related:
- {rel: alternative-to, to: continual-reassessment-method}
- {rel: alternative-to, to: boin-design}
- {rel: contrasts-with, to: operating-characteristics}
equations: []
functions: [dose_three_plus_three, dose_simulate]
results: []
lab: [14-studio]
cites: [letourneau2009dose, reiner1999operating, lin2001statistical, iasonos2008comprehensive, dixon1948method, storer1989, simon1997accelerated]
---

## What it is
The 3+3 is a rule-based method with no model, and it is still the most commonly used phase 1 design. [17/the-rule] Treat three patients. With no DLT, move up. With one DLT in three, treat three more: at most one DLT in six means move up, two or more means stop. Two or more DLTs in the first three also means stop. The MTD is the dose below the stopping dose. [17/the-rule]

## Why it matters
It is easy to explain to a team and an ethics committee, needs no software, and never escalates after two DLTs in a cohort. [17/the-rule]

## In the book
Across the three scenarios the 3+3 finds the true MTD in only about half or fewer of trials, and in roughly half it recommends a dose below the MTD (47 percent in scenario A, 53 percent in B). [17/operating-characteristics-by-simulation] Its mean sample size is between about 10 and 19 patients, and about three or fewer patients are treated at toxic doses on average. [17/operating-characteristics-by-simulation] One DLT in six with a Beta(0.25, 0.75) prior gives a Beta(1.25, 5.75) posterior. [17/what-six-patients-can-tell-you]

## Pitfalls
The rule states no target toxicity rate, and the 3+3 forgets all previous doses when it moves. [17/operating-characteristics-by-simulation][17/what-six-patients-can-tell-you] Little information is gathered at the recommended dose. [17/operating-characteristics-by-simulation] It may still be reasonable for a well-understood toxicity profile and few doses. [17/what-stays-the-same]

## Check yourself
- Q: What happens after one DLT among the first three patients? A: Three more are treated at the same dose. [17/the-rule]
- Q: Why is the 3+3 called safe? A: Few patients are exposed at toxic doses, at the price of a low chance of finding the MTD. [17/what-stays-the-same]
