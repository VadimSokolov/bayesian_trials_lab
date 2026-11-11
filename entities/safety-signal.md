---
id: safety-signal
name: Safety signal
type: concept
aliases: [safety monitoring]
level: 1
summary: Evidence that a harm may be present, which arrives by the thousand from data collected for another purpose and is useless if it waits for significance.
chapters: ['13']
home: sec-safety
sections: [sec-safety, sec-safety-reg]
prerequisites: []
related:
- {rel: generalizes, to: e-value-safety-monitoring}
- {rel: generalizes, to: toxicity-monitoring}
- {rel: generalizes, to: disproportionality-analysis}
- {rel: governed-by, to: ind-safety-report}
equations: []
functions: [safety_bf_monitor, safety_rofecoxib, tox_bayes_boundary, tox_oc, tox_pocock_boundary]
results: []
lab: []
cites: [cfr21_312_32, fda_ind_safety_2025, fda_dmc_2006, ema_gvp_ix_add1_2017]
---
## What it is

Efficacy questions arrive one at a time and are asked of a trial built to answer them. Safety questions arrive by the thousand, are asked of data collected for another purpose, and are answered too late if they wait for statistical significance. [sec-safety]

## Why it matters

A trial is sized for its efficacy endpoint, so the rare adverse event that matters most is usually the one the trial is least able to detect. [sec-safety] After approval the signal arrives as a trickle of spontaneous reports. [sec-safety] Safety is therefore where continuous, cumulative reasoning is most natural. [sec-safety]

## In the book

The chapter covers the rofecoxib cumulative signal, continuous monitoring with a posterior probability and an e-value, empirical Bayes screening of spontaneous reports, and toxicity monitoring inside a trial. [sec-safety]

Neither the DMC guidance nor the IND safety guidance prescribes a statistical rule. 21 CFR 312.32 is a requirement about what to report and when, while the guidances recommend how to monitor. [sec-safety-reg]

## Pitfalls

- A statistical signal is only a hypothesis to be assessed clinically. [sec-safety]
- A shrinkage screen is a hypothesis generator and is not a basis for a safety report by itself. [sec-safety-reg]

## Check yourself

- Q: Why is the most important adverse event often the hardest to see in a trial? A: The trial is sized for the efficacy endpoint, so it is least able to detect the rare event. [sec-safety]
- Q: Does any guidance prescribe a statistical stopping rule for safety? A: No, neither the DMC guidance nor the IND safety guidance does. [sec-safety-reg]
