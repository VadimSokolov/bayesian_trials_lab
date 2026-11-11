---
id: battle-trial
name: BATTLE
type: trial
aliases: [BATTLE trial]
level: 3
summary: A biopsy-mandated trial in pretreated advanced non-small cell lung cancer that moved allocation toward treatments performing better within biomarker groups.
chapters: ['16']
home: 16/battle
sections: [sec-rar-practice]
prerequisites: [response-adaptive-randomization]
related:
- {rel: illustrates, to: time-trend-bias}
equations: []
functions: []
results: []
lab: []
cites: [kim2011battle, zhou2008bayesian_biomarker, trippa2012glioblastoma]
---
## What it is

BATTLE was a biopsy-mandated trial of pretreated advanced non-small cell lung cancer with about 255 patients and four treatments: erlotinib, vandetanib, erlotinib plus bexarotene, and sorafenib [16/battle]. After an initial period of equal randomization, a Bayesian probit model moved allocation toward the treatments performing better within biomarker groups [16/battle].

## Why it matters

It is described as the first completed biomarker-based, adaptively randomized trial in this disease [16/battle]. It shows RAR used among several arms within biomarker strata [16/battle].

## In the book

The book also cites an earlier Bayesian adaptive randomization design for recurrent glioblastoma, evaluated retrospectively on four phase 2 trials [16/battle]. The lesson drawn is the caution of the multi-arm and time-trend sections: allocation inside small biomarker strata moves on little data [16/battle].

## Pitfalls

Because allocation moves on little data in small strata, the burn-in, the cap and an analysis that respects calendar time matter more, not less [16/battle]. The book's guidance for such designs is a fixed control share, a burn-in, capped probabilities and concurrent controls [sec-rar-practice].

## Check yourself

- Q: What preceded the adaptive allocation in BATTLE? A: An initial period of equal randomization [16/battle].
- Q: Why is RAR in small biomarker strata risky? A: Allocation moves on little data [16/battle].
