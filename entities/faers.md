---
id: faers
name: FAERS
type: regulation
aliases: [spontaneous reports, FDA Adverse Event Reporting System]
level: 1
summary: The FDA Adverse Event Reporting System, a database of spontaneous reports in which the FDA screens for signals with disproportionality methods.
chapters: ['13']
home: sec-safety-gps
sections: [sec-safety-gps, sec-safety, 13/the-gamma-poisson-shrinker]
prerequisites: [safety-signal]
related:
- {rel: uses, to: disproportionality-analysis}
- {rel: uses, to: gamma-poisson-shrinker}
equations: []
functions: []
results: []
lab: []
cites: [fda_faers, fda_aems_2026, szarfman2002use, fda_reporting_forms]
---
## What it is

FAERS and the WHO's VigiBase together hold tens of millions of reports. [sec-safety-gps] The data are a sparse table of counts $n_{ij}$ of reports that mention drug $i$ and event $j$. [sec-safety-gps]

## Why it matters

Most rare adverse effects are first noticed in spontaneous reports, not in trials. [sec-safety-gps] The FDA applies disproportionality screening there, with empirical Bayes methods in use since the late 1990s. A successor system, AEMS, was announced in March 2026. [sec-safety]

## In the book

Reports come from voluntary submissions by clinicians and patients and mandatory reports from manufacturers. [sec-safety-gps] Neither gives exposure denominators and ascertainment is incomplete, so the table cannot give incidence. It can only say which pairs are reported more than the margins predict. [sec-safety-gps]

## Pitfalls

- Reporting is influenced by publicity, indication and the reporter. [13/the-gamma-poisson-shrinker]
- Bayesian machinery protects against noise in rare cells, not against bias in the reporting mechanism. [13/the-gamma-poisson-shrinker]

## Check yourself

- Q: Can a spontaneous report table give incidence? A: No, because it has no exposure denominators and ascertainment is incomplete. [sec-safety-gps]
