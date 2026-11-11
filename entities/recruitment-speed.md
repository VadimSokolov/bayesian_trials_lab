---
id: recruitment-speed
name: Recruitment and the value of speed
type: concept
aliases: [value of speed, recruitment]
level: 2
summary: Trials are slow because of accrual, and a gamma-Poisson posterior turns an enrollment count into a rate, while a recruit is worth the evidence it adds.
chapters: ['2', '21']
home: sec-lifecycle-recruitment
sections: []
prerequisites: [drug-development, posterior-distribution]
related:
- {rel: uses, to: conjugate-prior}
- {rel: uses, to: likelihood-ratio}
equations: []
functions: []
results: []
lab: []
cites: [daniels2004milken, uw1999progress, sokolova2026milken, morton1955linkage, genin1995lod, smith1996hpc1, ewing2012hoxb13]
---
## What it is
Most trials are slow because of accrual, not analysis, and the recruitment rate is the quantity a sponsor can least control. [sec-lifecycle-recruitment] The book models enrollment of eligible families as a Poisson process with rate $\lambda$ per week. With the reference prior $\mathrm{Gamma}(1/2, 0)$ and $n$ families seen in $t$ weeks, the posterior is $\mathrm{Gamma}(n + 1/2, t)$. [sec-lifecycle-recruitment]

## Why it matters
The same calculation, with a prior borrowed from earlier sites, turns a protocol's accrual assumption into a predictive distribution of the end date. [sec-lifecycle-recruitment] A rate is not the whole story, because a recruit is worth the evidence it contributes: count the information a patient contributes, not the patients. [sec-lifecycle-recruitment]

## In the book
In November 1995 Michael Milken asked on CNN's Larry King Live for families with several men affected by prostate cancer to volunteer. More than 3,000 people called. Within three weeks about 300 qualified families were in hand, where Johns Hopkins had recruited 90 families over ten years. [sec-lifecycle-recruitment] A LOD score is a log likelihood ratio, and log likelihood ratios add across independent families. [sec-lifecycle-recruitment]

## Pitfalls
The comparisons are conditional on assumed conventional rates, since the conventional pace is not known. [sec-lifecycle-recruitment] The value of the acceleration rests on labeled assumptions. [sec-lifecycle-recruitment] A maximized LOD of 3 does not automatically imply a Bayes factor of 1000. [sec-lifecycle-recruitment]

## Check yourself
- Q: What posterior follows $n$ families in $t$ weeks under the reference prior? A: $\mathrm{Gamma}(n + 1/2, t)$. [sec-lifecycle-recruitment]
- Q: Why can broader recruitment lower information per family? A: A broad appeal brings in phenocopies and families not linked to the locus, which dilute the expected LOD. [sec-lifecycle-recruitment]
