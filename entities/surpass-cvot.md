---
id: surpass-cvot
name: SURPASS-CVOT
type: trial
aliases: [SURPASS CVOT]
level: 2
summary: An active-comparator cardiovascular trial of tirzepatide against dulaglutide with a noninferiority margin, used to show what a Bayesian reading adds to a noninferiority result.
chapters: ['21', '4']
home: sec-cases-surpass
sections: [sec-cases]
prerequisites: [noninferiority-trial, noninferiority-margin, hazard-ratio]
related:
- {rel: uses, to: normal-approximation-posterior}
- {rel: illustrates, to: indirect-comparison}
equations: []
functions: [reanalysis_normal]
results: []
lab: [12-decisions]
cites: [nicholls2025surpasscvot, sattar2026imputed]
---

## What it is
SURPASS-CVOT randomized 13,299 adults with type 2 diabetes and established atherosclerotic cardiovascular disease, double blind and 1:1, to weekly tirzepatide (up to 15 mg) or dulaglutide 1.5 mg. [sec-cases-surpass]
The modified intention-to-treat population was 13,165 (6,586 on tirzepatide and 6,579 on dulaglutide). [sec-cases-surpass]
The primary hypothesis was noninferiority: the upper limit of the 95.3 percent confidence interval for the hazard ratio had to lie below 1.05, with superiority if it lay below 1.00. [sec-cases-surpass]

## Why it matters
Two active drugs change the question: the lesson is what the margin and a transportability assumption allow a Bayesian reading to say. [sec-cases]

## In the book
The primary outcome occurred in 801 patients (12.2 percent) on tirzepatide and 862 (13.1 percent) on dulaglutide, hazard ratio 0.92, interval 0.83 to 1.01. [sec-cases-surpass]
Noninferiority was established ($p = 0.003$) and superiority was not ($p = 0.09$). [sec-cases-surpass]
The Bayesian reading gives posterior probabilities for noninferiority, for superiority and for a reduction of at least 10 percent, on a continuous scale. [sec-cases-surpass]
Superiority "failed" because the upper limit of 1.01 sat just above 1.00, yet the probability that the hazard ratio is below one is high; the two statements are not competing. [sec-cases-surpass]
Tirzepatide was never tested against placebo here, so an indirect chain through dulaglutide fills the gap, and the transportability assumption from REWIND is the whole of the argument. [sec-cases-surpass]

## Pitfalls
Under a skeptical prior the posterior would be pulled toward one, so the flat-prior numbers are the upper end of what the data support. [sec-cases-surpass]
The book omits secondary and component hazard ratios that it has not checked against the full report. [sec-cases-surpass]

## Check yourself
- Q: Was superiority shown, and why might a Bayesian still find the result useful? A: No ($p = 0.09$), but the posterior probability of a hazard ratio below one is a direct statement a prescriber can weigh. [sec-cases-surpass]
- Q: What assumption carries the indirect comparison with placebo? A: Transportability from REWIND. [sec-cases-surpass]
