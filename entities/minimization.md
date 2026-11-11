---
id: minimization
name: Minimization
type: method
aliases: [minimisation, Pocock-Simon minimization]
level: 2
summary: Each new patient is assigned to the arm that makes the total imbalance across several factors smaller, usually with probability 0.8, for small trials.
chapters: ['5']
home: 5/minimization
sections: [5/seeing-the-difference, 5/ignorability-of-the-assignment-mechanism]
prerequisites: [stratified-randomization]
related:
- {rel: uses, to: covariate-adjustment}
- {rel: contrasts-with, to: simple-randomization}
equations: []
functions: [assign_minimization]
results: []
lab: [06-fair-comparisons]
cites: [taves1974minimization, pocock1975sequential, scott2002minimization_review]
---
## What it is
Minimization is the method for small trials with many prognostic factors. Taves, and independently Pocock and Simon, proposed assigning each new patient in a way that depends on what has happened so far. Look at the patient's level of each factor, count earlier patients with those levels in each arm, and assign to the arm that makes the total imbalance smaller. [5/minimization]

## Why it matters
It balances the margins of each factor, for example the number of women in each arm, but not necessarily the combinations. [5/minimization] In the simulation it cut the imbalance in a known trait to a fraction of that under simple randomization. [5/seeing-the-difference]

## In the book
In its deterministic form it is not random at all, and anyone who knows the current counts can predict the next assignment. Pocock and Simon therefore assign to the preferred arm with probability $p$ above one half, 0.8 being common, and use a fair coin on ties. The function `assign_minimization` implements this. [5/minimization]

The analysis should include the minimization factors as covariates, because the assignment is not independent of them. [5/minimization] A Bayesian trial can use covariate-dependent assignments such as minimization without changing the likelihood. [5/ignorability-of-the-assignment-mechanism]

## Pitfalls
Minimization does nothing for a hidden trait. [5/seeing-the-difference] The deterministic version is predictable. [5/minimization]

## Check yourself
- Q: Why does minimization use a probability such as 0.8? A: Deterministic assignment can be predicted from the current counts. [5/minimization]
- Q: Does it balance combinations of factors? A: Not necessarily. It balances the margin of each factor. [5/minimization]
