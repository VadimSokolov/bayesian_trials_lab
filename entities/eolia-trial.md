---
id: eolia-trial
name: EOLIA
type: trial
aliases: [EOLIA trial]
level: 2
summary: A trial of early ECMO in severe ARDS whose nonsignificant primary result the book reanalyzes, finding probable benefit under all four priors examined.
chapters: ['22', '7', '8', '11']
home: sec-reanalyses-eolia
sections: [22/the-trial-and-its-traditional-analysis-1, 22/the-bayesian-analysis, sec-reanalyses-share]
prerequisites: [normal-approximation-posterior, skeptical-prior, enthusiastic-prior]
related:
- {rel: illustrates, to: futility-boundary}
- {rel: illustrates, to: bayesian-reanalysis}
- {rel: illustrates, to: group-sequential-design}
- {rel: illustrates, to: asa-statement}
equations: []
functions: [reanalysis_eolia]
results: []
lab: [15-reading-bayesian-trials, 07-interim-looks]
cites: [combes2018, goligher2018]
---

## What it is
EOLIA randomized 249 patients with very severe acute respiratory distress syndrome to early venovenous ECMO or conventional ventilation. [22/the-trial-and-its-traditional-analysis-1]
Sixty-day mortality was 35 percent (44 of 124) with ECMO and 46 percent (57 of 125) in the control arm, relative risk 0.76 with 95 percent interval 0.55 to 1.04 and $p = 0.09$. [22/the-trial-and-its-traditional-analysis-1]
The design was group sequential with a two-triangle boundary and a maximum of 331 participants, and the trial stopped for futility at the fourth interim analysis. [22/the-trial-and-its-traditional-analysis-1]

## Why it matters
It was widely reported as negative, yet the reanalysis shows probable benefit after a nonsignificant primary analysis. [22/the-bayesian-analysis]
Of the 125 control patients, 35 (28 percent) crossed over to ECMO, which matters to a clinician reading the result. [22/the-trial-and-its-traditional-analysis-1]
A stopping rule can stop a trial despite a high probability of some benefit, because it asks whether the final criterion is likely to be met. [sec-reanalyses-share]

## In the book
Goligher and colleagues reported under a minimally informative prior a posterior relative risk of 0.78 (0.56 to 1.04) and a 96 percent probability of any mortality reduction. [22/the-bayesian-analysis]
The book's four priors on the log relative risk are flat, skeptical with $s_0 = 0.25$, skeptical with $s_0 = 0.15$ and enthusiastic, centered at 0.67 (the relative risk the design assumed). [22/the-bayesian-analysis]
Across the four priors Pr(RR<1) runs from 0.87 to 0.99, and Pr(RR<0.67) is 0.17 under the flat prior. [22/the-bayesian-analysis]
EOLIA did not rule out the effect it was designed to find, but made it less likely, and some benefit is probable under all four priors. [22/the-bayesian-analysis]
A probability of about 0.9 that the treatment helps is a strong argument for a hospital maintaining an ECMO program. [22/the-bayesian-analysis]

## Pitfalls
A nonsignificant result is nonrejection of the null, not evidence of no effect, and the interval already said as much. [22/the-bayesian-analysis]
The reanalysis does not make EOLIA a positive trial. [22/the-bayesian-analysis]

## Check yourself
- Q: Why does the book's relative risk differ from the published 0.76? A: The counts give an unadjusted value and the published one is adjusted. [22/the-bayesian-analysis]
- Q: Can a futility boundary and a high probability of benefit coexist? A: Yes, they answer different questions. [sec-reanalyses-share]
