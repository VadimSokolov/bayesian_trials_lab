---
id: disproportionality-analysis
name: Disproportionality analysis
type: concept
aliases: [disproportionality]
level: 2
summary: Screening that flags drug and event pairs reported more often than their margins predict under independence.
chapters: ['13']
home: sec-safety-gps
sections: [sec-safety-gps, 13/the-traditional-measure, 13/the-gamma-poisson-shrinker, sec-safety]
prerequisites: [faers]
related:
- {rel: generalizes, to: proportional-reporting-ratio}
- {rel: generalizes, to: gamma-poisson-shrinker}
equations: []
functions: [safety_gps, safety_gps_fit]
results: []
lab: []
cites: [ema_gvp_ix_add1_2017, evans2001use, fda_reporting_forms]
---
## What it is

For each drug and event pair the table has an observed count $n_{ij}$ and an expected count $E_{ij}$ computed from the margins under independence. Disproportionality asks which pairs are reported more than the margins predict. [sec-safety-gps]

## Why it matters

Spontaneous report tables have no exposure denominators, so they cannot give incidence. Disproportionality is what they can offer. [sec-safety-gps] The EMA guideline accepts the proportional reporting ratio, the reporting odds ratio and the Bayesian and empirical Bayes measures as screening tools, and says a statistical signal is only a hypothesis to be assessed clinically. [sec-safety]

## In the book

The simplest statistics are the relative reporting ratio $n_{ij}/E_{ij}$ and its cousins. [13/the-traditional-measure] Their weakness is at the sparse end: one report against an expected count of 0.05 gives a ratio of twenty, and a table with millions of cells holds many such pairs by chance. [13/the-traditional-measure] The [[gamma-poisson-shrinker]] fixes this by shrinkage. [13/the-gamma-poisson-shrinker]

## Pitfalls

- A high score is a hypothesis for clinical assessment, not evidence of causation. [13/the-gamma-poisson-shrinker]

## Check yourself

- Q: Why is a raw ratio of 20 on one report not a signal? A: For a rare pair the ratio is dominated by noise, and shrinkage pulls it toward one. [13/the-traditional-measure]
