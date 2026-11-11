---
id: phase-2-to-phase-3-optimism
name: Phase 2 to phase 3 optimism
type: concept
aliases: [phase 2 selection problem]
level: 2
summary: A phase 2 estimate that justified moving on is biased upward, so a phase 3 trial sized on it is underpowered and succeeds less often than its nominal power suggests.
chapters: ['9', '8']
home: sec-power-zia
sections: [sec-priors-selection, 9/what-the-regulator-sees-and-what-the-sponsor-can-do-wrong, 9/a-comparison, sec-evidence-practice]
prerequisites: [design-alternative, assurance]
related:
- {rel: contrasts-with, to: power}
equations: []
functions: [decide_pivotal_optimum, decide_pivotal_table]
results: []
lab: [03-errors-power]
cites: [zia2005]
---

## What it is

A drug is taken into phase III because phase II looked good. A design alternative equal to the phase II estimate is therefore biased upward, a trial sized on it is underpowered at the true effect, and its probability of success is better estimated by the assurance (power averaged over a realistic, shrunk prior) than by the 90% in the protocol [sec-power-zia]. In a simulation the same selection inflates a prior centered on the phase 2 estimate [sec-priors-selection].

## Why it matters

Planning on a shrunk estimate reports the probability of success the program will face, and the time to learn it is before the trial is funded [sec-power-zia]. For a phase 2 estimate of 0.14 with standard deviation 0.10, a 90% power trial has assurance well below that [9/a-comparison].

## In the book

Zia and colleagues examined 181 phase III studies in advanced solid tumors. Of these, 43 used regimens identical to those in 49 preceding phase II studies. Twelve of the 43 (28%) were positive, 81% had lower response rates than phase II, and the mean difference was 12.9 percentage points [sec-power-zia]. In a synthetic example, a flat posterior $N(0.30, 0.141^2)$ and a skeptical one $N(0.20, 0.115^2)$ give different optimal pivotal sizes, with the expected net present value flat from 400 to 800 per arm [sec-power-zia]. The costs, US\$20 million fixed plus US\$0.1 million per patient, and a US\$1 billion value are invented [sec-power-zia].

## Pitfalls

The study concerns chemotherapy in solid tumors, and other areas differ [sec-power-zia]. The 28% does not identify the fraction of ineffective treatments [sec-evidence-practice].

## Check yourself

- Q: What fraction of phase III trials repeating phase II regimens were positive? A: 28% (12 of 43) [sec-power-zia].
- Q: Which direction is the bias in a phase 2 estimate that justified a phase 3? A: Upward [sec-power-zia].
