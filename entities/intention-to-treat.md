---
id: intention-to-treat
name: Intention to treat
type: principle
aliases: [ITT, ITT principle]
level: 1
summary: Analyze every randomized patient in the arm they were assigned to, whatever happened afterward, so the groups remain the ones the coin created.
chapters: ['5']
home: 5/the-itt-principle
sections: [sec-randomization-itt, 5/estimands-and-intercurrent-events]
prerequisites: [randomization]
related:
- {rel: special-case-of, to: estimand}
- {rel: contrasts-with, to: intercurrent-event}
- {rel: governed-by, to: ich-e9}
equations: []
functions: []
results: []
lab: [06-fair-comparisons]
cites: []
---
## What it is
The intention-to-treat (ITT) principle says to analyze every patient in the arm they were randomized to, whatever happened afterward. [5/the-itt-principle] ICH E9 section 5.2.1 says the primary analysis should include all randomized subjects, and that preserving the initial randomization in analysis is important in preventing bias. [5/the-itt-principle]

A patient assigned to the drug who never took a pill is still analyzed as a drug patient. [5/the-itt-principle]

## Why it matters
After randomization, patients stop the drug, take rescue medication, move away or die of something else. Dropping or moving them means the arms are no longer the groups the coin created. [sec-randomization-itt]

## In the book
The drug adds 10 percentage points to recovery for anyone who takes it. About 15 percent of the drug arm stops early, more often the sicker patients. Three analyses were compared on 4,000 patients in each of 300 trials: ITT, per-protocol and as-treated. [5/the-itt-principle]

ITT is diluted: it estimates the effect of assigning the drug. The per-protocol and as-treated analyses remove or reshuffle exactly the patients who differ in prognosis, and exceed what the drug does. [5/the-itt-principle]

ITT corresponds in spirit to the treatment-policy strategy of the [[estimand]] framework. [5/estimands-and-intercurrent-events]

## Pitfalls
Neither bias can be seen in the data of a single trial. [5/the-itt-principle] A per-protocol analysis is not among the five ICH E9(R1) strategies, because it drops patients on a post-randomization event. [5/estimands-and-intercurrent-events]

## Check yourself
- Q: Why is the ITT estimate smaller than the drug's effect in those who take it? A: About one in seven did not take it, so ITT estimates the effect of assignment. [5/the-itt-principle]
- Q: Does a per-protocol analysis err toward or away from the truth in the book's simulation? A: Above the truth, since the stoppers differ in prognosis. [5/the-itt-principle]
