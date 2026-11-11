---
id: response-adaptive-randomization
name: Response-adaptive randomization
type: design
aliases: [RAR, adaptive randomization]
level: 2
summary: Allocation that shifts toward the arm that is looking better as outcomes accrue, trading some information for benefit to patients inside the trial.
chapters: ['16', '23']
home: sec-rar
sections: [16/where-rar-fits, sec-rar-reg, sec-rar-practice, 16/the-multi-arm-case, 16/reproducing-the-critique, sec-rar-drift]
prerequisites: [randomization, multi-armed-bandit, fixed-allocation]
related:
- {rel: uses, to: thompson-sampling}
- {rel: governed-by, to: fda-adaptive-design-guidance-2019}
equations: []
functions: [rar_simulate, rar_two_arm, rar_four_arm, rar_alloc_probs]
results: []
lab: [09-adaptive-bayesian, 14-studio]
cites: [thompson1933, robertson2023response, wathen2017simulation]
---
## What it is

Response-adaptive randomization (RAR) lets the odds shift toward the treatment that is looking better [sec-rar]. Thompson's motive in 1933 was ethical: to spare patients from being "sacrificed" to the inferior treatment [sec-rar]. In operations research it is a multi-armed bandit problem [sec-rar].

## Why it matters

It asks a randomized trial to do two jobs. The comparison is cleanest when allocation is fixed and balanced, while a bandit maximizes benefit inside the study by abandoning the losing arm [sec-rar].

## In the book

In a two-arm trial of 400 patients (0.30 against 0.45), Thompson sampling put 87 percent on the better arm but cut power from 88 percent to 61 percent [16/reproducing-the-critique]. In a four-arm trial with a fixed control share of one quarter, a burn-in and a cap, the adaptive design put about half of 600 patients on the best arm and had higher power for the best arm against control than equal allocation [16/the-multi-arm-case]. The book's conditions for a case for RAR: several experimental arms, a fast endpoint, a trial large enough to converge but small in population, a fixed control share with concurrent controls, and an exploratory or seamless role [16/where-rar-fits].

## Pitfalls

For a confirmatory two-arm trial, use fixed allocation [sec-rar-practice]. The EMA draft of October 2026 concludes that RAR is not supported in confirmatory platform trials [sec-rar-reg]. A fixed control share alone does not establish regulatory acceptability [sec-rar-reg]. Drift in calendar time is the failure that matters most ([[time-trend-bias]]) [sec-rar].

## Check yourself

- Q: In which setting does the book find the best case for RAR? A: Several experimental arms with a shared control held at a fixed share [16/the-multi-arm-case].
- Q: What does a two-arm confirmatory trial call for? A: Fixed allocation [sec-rar-practice].
