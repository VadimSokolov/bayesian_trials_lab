---
id: gusto-trial
name: GUSTO
type: trial
aliases: [GUSTO trial]
level: 2
summary: A myocardial infarction trial of accelerated tPA against streptokinase that the book reanalyzes with priors built from two earlier megatrials at several weights.
chapters: ['22']
home: sec-reanalyses-gusto
sections: [22/the-trial-and-its-traditional-analysis, 22/the-bayesian-question]
prerequisites: [bayesian-reanalysis, normal-approximation-posterior]
related:
- {rel: illustrates, to: prior-data-conflict}
- {rel: illustrates, to: bayesian-borrowing}
- {rel: illustrates, to: confounding-by-indication}
equations: []
functions: [reanalysis_gusto]
results: []
lab: [15-reading-bayesian-trials]
cites: [gusto1993, brophy1995]
---

## What it is
GUSTO randomized 41,021 patients with acute myocardial infarction to four strategies, including accelerated tissue plasminogen activator (tPA) and two streptokinase arms. [22/the-trial-and-its-traditional-analysis]
Thirty-day mortality was 6.3 percent on accelerated tPA and 7.2 and 7.4 percent on the two streptokinase-only arms. [22/the-trial-and-its-traditional-analysis]
The prespecified comparison gave a 14 percent relative reduction in mortality (95 percent interval 5.9 to 21.3 percent), $p = 0.001$, an absolute benefit of one percentage point at a substantially higher drug cost. [22/the-trial-and-its-traditional-analysis]

## Why it matters
Brophy and Joseph asked what a cardiologist should have believed given the earlier megatrials GISSI-2 and ISIS-3. [22/the-bayesian-question]
They weighted the earlier trials at 100, 50 and 10 percent and concluded that the clinical superiority of tPA "remains uncertain". [22/the-bayesian-question]

## In the book
With GUSTO alone the probability that tPA lowers mortality was 0.9995, and 0.17, 0.44 and 0.98 at the three weights in Brophy and Joseph's arm model. [22/the-bayesian-question]
The book puts the prior on the risk difference, with the earlier trials at weight $w$, and `reanalysis_gusto()` reproduces both models. [22/the-bayesian-question]
In the book's difference model, that tPA lowers mortality at all is very probable under every weight (at least 0.968); the low probabilities in Brophy and Joseph's arm model come from pooling each arm's rate across trials. That it lowers mortality by a full percentage point is unlikely once the earlier trials count at half weight or more. [22/the-bayesian-question]
The models part company because pooling each arm's rate across trials absorbs the difference between trials into the difference between agents, the mechanism of Simpson's paradox. [22/the-bayesian-question]

## Pitfalls
Borrowing within-trial treatment contrasts avoids pooling dissimilar baseline mortality rates; an arm-level model needs trial-specific baseline risks and justified borrowing. [22/the-bayesian-question]
The decision to pay for tPA turns on whether the benefit is large enough to matter, and on the price of a life year. [22/the-bayesian-question]

## Check yourself
- Q: Does the book's difference model agree with the arm model on GUSTO alone? A: Yes, they part company as the earlier trials gain weight. [22/the-bayesian-question]
- Q: What question does the one-point threshold address? A: Whether the benefit is large enough to justify the price. [22/the-bayesian-question]
