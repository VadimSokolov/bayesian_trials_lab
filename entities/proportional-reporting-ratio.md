---
id: proportional-reporting-ratio
name: Proportional reporting ratio
type: method
aliases: [PRR]
level: 2
summary: A simple disproportionality statistic that flags a drug and event pair with a ratio of at least 2, chi-square at least 4 and three or more reports.
chapters: ['13']
home: 13/the-traditional-measure
sections: [13/the-traditional-measure, 13/the-gamma-poisson-shrinker, sec-safety]
prerequisites: [disproportionality-analysis]
related:
- {rel: contrasts-with, to: gamma-poisson-shrinker}
equations: []
functions: []
results: []
lab: []
cites: [evans2001use, vanpuijenbroek2002comparison, rothman2004reporting, ema_gvp_ix_add1_2017]
---
## What it is

The proportional reporting ratio, with the reporting odds ratio, is a cousin of the relative reporting ratio $n_{ij}/E_{ij}$, used with a confidence interval and a screening rule. [13/the-traditional-measure]

Evans and colleagues flagged a pair when the ratio is at least 2, the chi-square statistic at least 4 and there are at least three reports. A common variant asks for a lower confidence bound above 1 with at least three reports. [13/the-traditional-measure]

## Why it matters

The statistics are simple, transparent and still used, and the EMA guideline names them. [13/the-traditional-measure]

## In the book

The weakness is at the sparse end. For a rare pair the ratio is dominated by noise: one report against an expected count of 0.05 gives a ratio of twenty. [13/the-traditional-measure] A table with millions of cells will contain many such pairs by chance alone. [13/the-traditional-measure] The [[gamma-poisson-shrinker]] was built to handle this. [13/the-gamma-poisson-shrinker]

## Pitfalls

- A statistical signal is only a hypothesis to be assessed clinically, so a flag is not evidence of causation. [sec-safety]

## Check yourself

- Q: What three conditions did Evans and colleagues require for a flag? A: A ratio of at least 2, chi-square at least 4 and at least three reports. [13/the-traditional-measure]
- Q: Where does the ratio fail? A: For rare pairs, where it is dominated by noise. [13/the-traditional-measure]
