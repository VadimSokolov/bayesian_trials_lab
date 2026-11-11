---
id: utility-function
name: Utility function
type: concept
aliases: [utility]
level: 2
summary: An elicited value for each joint efficacy and toxicity outcome, averaged under the posterior to score a dose.
chapters: ['17', '15']
home: 17/a-bayesian-formulation-utility
sections: [17/a-bayesian-formulation-utility, 17/efftox-and-phase-12-designs]
prerequisites: [posterior-distribution, decision-theory]
related:
- {rel: uses, to: prior-elicitation}
equations: []
functions: []
results: []
lab: [14-studio]
cites: [polson2026simbayes]
---

## What it is
Let $\pi_E(x)$ be the probability of a favorable efficacy outcome at dose $x$ and $\pi_T(x)$ the probability of toxicity. [17/a-bayesian-formulation-utility] Elicit a utility for each of the four joint outcomes: efficacy without toxicity is best, no efficacy with toxicity worst. [17/a-bayesian-formulation-utility] The expected utility of a dose is the posterior average. A design picks the dose that maximizes it among acceptable doses, meeting a minimum efficacy and maximum toxicity bound at a stated posterior probability. [17/a-bayesian-formulation-utility]

## Why it matters
It states the benefit-risk trade-off directly, so the chosen dose can sit below the MTD. [17/a-bayesian-formulation-utility]

## In the book
In the illustrative curves, toxicity reaches 0.25 at dose 5, so the MTD is dose 5, but expected utility is highest at dose 4. The efficacy gain from 4 to 5 is small and the toxicity cost is not. [17/a-bayesian-formulation-utility] The numbers 100, 40, 0 and -60 are illustrative, not clinical. [17/a-bayesian-formulation-utility]

## Pitfalls
Utilities are elicited and subjective, and the winning dose depends on them. The protocol should record who elicited them, from whom, on what basis, and how the result changes if they change. [17/a-bayesian-formulation-utility]

## Check yourself
- Q: In the book's example, which dose maximizes expected utility? A: Dose 4, one below the MTD. [17/a-bayesian-formulation-utility]
