---
id: maximum-tolerated-dose
name: Maximum tolerated dose
type: concept
aliases: [MTD]
level: 1
summary: The highest dose whose probability of a dose-limiting toxicity is acceptable, the target of classical phase 1 oncology trials.
chapters: ['17']
home: 17/why-the-mtd-is-a-poor-target-for-modern-agents
sections: [17/what-a-phase-1-trial-in-oncology-is-for, 17/the-rule, 17/operating-characteristics-by-simulation]
prerequisites: [phase-1-trial]
related:
- {rel: contrasts-with, to: project-optimus}
equations: []
functions: [dose_true_mtd]
results: []
lab: [14-studio]
cites: [fda_optimizing_dosage_2024, shah2021drugdosing, fourie2022dose]
---

## What it is
The maximum tolerated dose (MTD) is the highest dose whose probability of a dose-limiting toxicity (DLT) is acceptable. [17/what-a-phase-1-trial-in-oncology-is-for] The acceptable level is a target toxicity rate, commonly 0.20 to 0.33, and the chapter uses 0.25. [17/what-a-phase-1-trial-in-oncology-is-for] The true MTD in the book's scenarios is the highest dose with DLT probability at most 0.25. [17/operating-characteristics-by-simulation]

## Why it matters
For cytotoxic drugs, both efficacy and toxicity were expected to rise with dose, so the highest tolerable dose was expected to be the most active one. [17/what-a-phase-1-trial-in-oncology-is-for] The toxicity-only designs of the chapter all aim at this dose. [17/why-the-mtd-is-a-poor-target-for-modern-agents]

## Pitfalls
The MTD paradigm assumes that more is better until it hurts. [17/why-the-mtd-is-a-poor-target-for-modern-agents] That is a poor assumption for targeted therapies, immunotherapies and antibody-drug conjugates, where efficacy may plateau well below the MTD. [17/why-the-mtd-is-a-poor-target-for-modern-agents] A drug may be taken for months or years, and chronic low-grade toxicity can cause dose reductions that a short DLT window cannot show. [17/why-the-mtd-is-a-poor-target-for-modern-agents] A dose chosen as the MTD can then be both more toxic and no more effective than a lower one. [17/why-the-mtd-is-a-poor-target-for-modern-agents] The FDA's stated concern is that patients may be left on doses with more toxicity and no more benefit. [17/why-the-mtd-is-a-poor-target-for-modern-agents]

## Check yourself
- Q: Which dose is the true MTD in the book's scenario A? A: Dose 3. [17/operating-characteristics-by-simulation]
- Q: Why can the MTD be the wrong target for an antibody-drug conjugate? A: Efficacy may plateau below it, and chronic toxicity may force dose reductions. [17/why-the-mtd-is-a-poor-target-for-modern-agents]
