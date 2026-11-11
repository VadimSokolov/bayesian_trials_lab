---
id: multi-arm-multi-stage-design
name: Multi-arm multi-stage design
type: design
aliases: [MAMS, MAMS trial]
level: 2
summary: A group sequential platform design in which every research arm is compared with a shared control at each interim look, and arms that fail a pre-specified bar are dropped.
chapters: ['20']
home: 20/the-frequentist-platform-multi-arm-multi-stage-designs
sections: [20/the-frequentist-platform-multi-arm-multi-stage-designs, 20/traditional-against-bayesian-platforms-what-differs]
prerequisites: [group-sequential-design, hazard-ratio]
related:
- {rel: special-case-of, to: platform-trial}
- {rel: used-in, to: stampede-trial}
- {rel: contrasts-with, to: i-spy-2-trial}
equations: []
functions: []
results: []
lab: [10-platform-trials]
cites: [royston2003novel, royston2011lackofbenefit, stallard2003sequential, wason2012optimal, sydes2009, magirr2012, robertson2023online]
---
## What it is

The multi-arm multi-stage (MAMS) design follows the logic of a group sequential trial with one change: at each interim look every research arm is compared with the control, and arms that fail a pre-specified bar are dropped while the others continue. [20/the-frequentist-platform-multi-arm-multi-stage-designs] The MAMS design for time-to-event outcomes, with stopping for lack of benefit on an intermediate outcome, was introduced by Royston and colleagues in 2003. [20/the-frequentist-platform-multi-arm-multi-stage-designs]

## Why it matters

Three features carry over to every platform: an intermediate outcome first, concurrent controls only, and new arms by amendment. [20/the-frequentist-platform-multi-arm-multi-stage-designs] Early stages use a lenient hazard-ratio cutoff that tightens, so arms with no sign of benefit leave at a fraction of the cost. The intermediate outcome need not be a validated surrogate. [20/the-frequentist-platform-multi-arm-multi-stage-designs]

## In the book

General MAMS methods calibrate boundaries through the joint distribution of test statistics across stages and arms to control a chosen error rate such as the pairwise or familywise rate. [20/the-frequentist-platform-multi-arm-multi-stage-designs] The cutoffs were derived under proportional hazards, and non-proportional hazards need an appropriate summary measure and delayed-effect simulations. [20/the-frequentist-platform-multi-arm-multi-stage-designs] Online error-rate control methods exist for hypotheses that arrive over time. [20/the-frequentist-platform-multi-arm-multi-stage-designs] STAMPEDE is the standing example. [20/the-frequentist-platform-multi-arm-multi-stage-designs]

## Pitfalls

A MAMS error calculation for a fixed family assumes the family is known, so for added arms the family must be chosen and justified. [20/the-frequentist-platform-multi-arm-multi-stage-designs]

## Check yourself

- Q: What happens at each interim look? A: Each arm is compared with control, and arms that fail the bar are dropped. [20/the-frequentist-platform-multi-arm-multi-stage-designs]
- Q: Is the Bayesian machinery required for a platform? A: No, STAMPEDE shows it is optional. [20/the-frequentist-platform-multi-arm-multi-stage-designs]
