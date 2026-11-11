---
id: ocean-a-outcomes-trial
name: OCEAN(a)-Outcomes
type: trial
aliases: [Lp(a)HORIZON]
level: 2
summary: A running olpasiran outcomes trial used to show how a sibling trial, Lp(a)HORIZON, moves its probability of success, read as an implicit Bayes factor.
chapters: ['21']
home: 21/what-a-lpahorizon-result-does-to-oceana
sections: [sec-cases-current]
prerequisites: [bayes-factor, hierarchical-model]
related: []
equations: []
functions: []
results: []
lab: [15-reading-bayesian-trials]
cites: [cho2026pelacarsen, novartis_horizon_2026, ctgov_ocean_a_2026, ctgov_horizon_2026]
---

## What it is
OCEAN(a)-Outcomes (olpasiran, Amgen) is a randomized, double-masked phase 3 trial with 7,297 participants and a primary endpoint of time to coronary heart disease death, myocardial infarction or urgent coronary revascularization. [sec-cases-current]
Its primary completion is estimated for March 2028. [sec-cases-current]

## Why it matters
When an analyst moves the probability that a related trial succeeds from $p_0$ to $p_1$ after a sibling reads out, the analyst has implicitly applied a Bayes factor, the ratio of posterior odds to prior odds. [21/what-a-lpahorizon-result-does-to-oceana]
The formula is
$$B = \frac{p_1/(1 - p_1)}{p_0/(1 - p_0)}.$$ [21/what-a-lpahorizon-result-does-to-oceana]

## In the book
Lp(a)HORIZON (pelacarsen, Novartis) enrolled 8,323 participants. [sec-cases-current]
Novartis announced on 4 September 2026 that its primary endpoint was not met, and full results followed on 7 November 2026. [sec-cases-current]
The full results reported a hazard ratio of 1.02 (95 percent interval 0.90 to 1.15) overall and 1.00 (0.87 to 1.15) among patients with Lp(a) of at least 90 mg/dL. [21/what-a-lpahorizon-result-does-to-oceana]
On a flat-prior normal approximation, a 10 percent or larger benefit is largely ruled out for pelacarsen at its depth of lowering. [21/what-a-lpahorizon-result-does-to-oceana]
The book could not confirm a published analyst estimate, so it uses an illustrative move from 50 to 20 percent, which is not a finding about any analyst. [21/what-a-lpahorizon-result-does-to-oceana]

## Pitfalls
HORIZON informs OCEAN(a) only to the extent that olpasiran's benefit is expected to track pelacarsen's. [21/what-a-lpahorizon-result-does-to-oceana]
A hierarchical model with the depth of lowering as a covariate makes that assumption explicit, which one revised probability does not. [21/what-a-lpahorizon-result-does-to-oceana]

## Check yourself
- Q: What does a drop from 50 to 20 percent imply about the evidence? A: An implicit Bayes factor, here an illustration only. [21/what-a-lpahorizon-result-does-to-oceana]
- Q: Does the HORIZON result decide OCEAN(a)? A: No, it helps only if the two drugs share how benefit scales with Lp(a) lowering. [21/what-a-lpahorizon-result-does-to-oceana]
