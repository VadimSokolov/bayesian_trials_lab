---
id: bayesian-adaptive-design
name: Bayesian adaptive design
type: design
aliases: [Bayesian adaptive trial]
level: 2
summary: A trial design that can meet the legal standard of evidence sooner and with fewer patients on inferior arms, through monitoring, joint handling of arms and prior information.
chapters: ['1', '14', '15', '23']
home: sec-decision-thesis
sections: [1/what-efficiency-looks-like-in-real-trials, 1/what-we-claim-and-what-we-do-not, 1/the-counterweight]
prerequisites: [decision-theory, type-i-error]
related:
- {rel: uses, to: deviation-scale}
- {rel: uses, to: shrinkage}
- {rel: uses, to: prior-distribution}
- {rel: used-in, to: remap-cap-trial}
- {rel: used-in, to: i-spy-2-trial}
- {rel: contrasts-with, to: group-sequential-design}
equations: []
functions: []
results: []
lab: [12-decisions]
cites: [polson2026bayesstandard, saville2016efficiencies, gordon2021remapcap, park2016ispy2]
---
## What it is
The book's thesis has two sentences. A regulator approves a drug on evidence that meets a legal standard, and a Bayesian adaptive design can meet it sooner and with fewer patients exposed to inferior arms. [sec-decision-thesis] The saving comes from monitoring, from handling multiple arms jointly and from prior information, not from a lower bar. [sec-decision-thesis]

## Why it matters
Four mechanisms are usually run together and the book keeps them apart. M1 is the deviation scale. M2 is one calibrated threshold for monitoring plus shrinkage for estimation. M3 is informative priors. M4 is optimal stopping under a sampling cost. [sec-decision-thesis] M2 and M4 rest on structure a regulator can verify by simulation, M3 on a judgment that must be defended, and M1 is a mathematical fact with a trade-off. [sec-decision-thesis]

## In the book
Saville and Berry simulated 5,000 programs in which one in ten treatments works. A traditional sequence needed 1,966 patients and 12.0 years; an adaptive platform needed 640 patients and 3.2 years. This is a simulation, not an empirical result. [1/what-efficiency-looks-like-in-real-trials] REMAP-CAP reported tocilizumab meeting its efficacy criterion with posterior probability 99.75 percent. [1/what-efficiency-looks-like-in-real-trials]

## Pitfalls
The book does not claim that a Bayesian design dominates. [1/what-we-claim-and-what-we-do-not] In the REWIND reconstruction the scheduled design acts more often, though the Bayes rule decides earlier when it decides. [1/the-counterweight] Every gain has a price: a prior to defend, simulations to run and a design that is more work to specify. [1/what-we-claim-and-what-we-do-not]

## Check yourself
- Q: Does the saving come from a lower bar? A: No, it does not. [sec-decision-thesis]
- Q: Where is a Bayesian design judged by the regulator? A: In simulated operating characteristics under a pre-specified design. [1/what-we-claim-and-what-we-do-not]
