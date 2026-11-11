---
id: andromeda-shock-trial
name: ANDROMEDA-SHOCK
type: trial
aliases: [ANDROMEDA SHOCK]
level: 2
summary: A septic shock trial comparing capillary refill and lactate targeting, reanalyzed on the hazard ratio scale under five priors to show the EOLIA pattern again.
chapters: ['22', '4', '7']
home: sec-reanalyses-andromeda
sections: [sec-reanalyses-share]
prerequisites: [normal-approximation-posterior, hazard-ratio, skeptical-prior]
related:
- {rel: illustrates, to: bayesian-reanalysis}
- {rel: illustrates, to: sensitivity-analysis}
- {rel: illustrates, to: utility-function}
equations: []
functions: [reanalysis_andromeda]
results: []
lab: [15-reading-bayesian-trials]
cites: [hernandez2019, zampieri2020]
---

## What it is
ANDROMEDA-SHOCK randomized 424 adults with septic shock in 28 intensive care units to an 8-hour resuscitation targeting capillary refill time or serum lactate. [sec-reanalyses-andromeda]
Twenty-eight-day mortality was 34.9 percent (74 of 212) in the capillary refill arm and 43.4 percent (92 of 212) in the lactate arm, hazard ratio 0.75 with 95 percent interval 0.55 to 1.02 and $p = 0.06$. [sec-reanalyses-andromeda]

## Why it matters
It shows the same pattern as EOLIA: the primary test did not reject the null, yet sizeable benefits stayed compatible with the data. [sec-reanalyses-share]
A cheaper, faster strategy that is probably better need not clear $p < 0.05$ to be adopted. [sec-reanalyses-andromeda]

## In the book
Zampieri and colleagues used four priors on the odds ratio and found a posterior probability of benefit above 90 percent under all of them. [sec-reanalyses-andromeda]
The book works on the hazard ratio scale with five normal priors: flat, neutral (standard deviation 0.35), skeptical (0.15), pessimistic (mean log 1.1, standard deviation 0.15) and optimistic (mean log 0.8, standard deviation 0.20). [sec-reanalyses-andromeda]
Its pessimistic row gives a lower probability of benefit than Zampieri's, which is not a contradiction because priors, scale and model differ. [sec-reanalyses-andromeda]
Capillary refill needs a finger and a stopwatch, and lactate needs a laboratory. [sec-reanalyses-andromeda]

## Pitfalls
Our hazard ratio rows are not a replication of Zampieri's odds-ratio table. [sec-reanalyses-andromeda]
A hazard ratio of 1.1 is a ten percent higher instantaneous hazard, not a ten percent higher probability of death. [sec-reanalyses-andromeda]
Whether to adopt the strategy needs a utility function, a measured cost difference and a mapping to absolute mortality, which the posterior probabilities do not supply. [sec-reanalyses-andromeda]

## Check yourself
- Q: How much prior skepticism does the result tolerate? A: The table of five priors shows it; a sufficiently concentrated prior at no effect also lowers the probability of benefit. [sec-reanalyses-andromeda]
- Q: Why is the choice of strategy not settled by the posterior alone? A: It also needs costs and utilities. [sec-reanalyses-andromeda]
