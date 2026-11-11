---
id: seamless-phase-2-3-design
name: Seamless phase 2/3 design
type: design
aliases: [seamless design, seamless phase 2/3]
level: 3
summary: One protocol that selects a dose or regimen at an interim and continues into confirmation under a prespecified rule.
chapters: ['17']
home: 17/phase-23
sections: [17/phase-23, sec-dose-seamless]
prerequisites: [dose-finding, group-sequential-design, type-i-error]
related:
- {rel: governed-by, to: fda-adaptive-design-guidance-2019}
equations: []
functions: []
results: []
lab: [14-studio]
cites: [thall1988twostage, stallard2003sequential, bretz2009adaptive, berry2024optimal, fda2019adaptive]
---

## What it is
A conventional program has a phase 2 trial, a gap for analysis, a new protocol and new sites, then phase 3. A seamless phase 2/3 design merges them. A first stage compares several doses with a control and selects one or two on interim data. A second stage confirms under a prespecified rule. [17/phase-23]

## Why it matters
It removes the dead time between phases and uses the trial's own data to choose the dose. [17/phase-23] In an inferentially seamless design, first-stage data for the selected dose count in the final test, so the analysis must account for selection. In an operationally seamless design only second-stage data are used. [17/phase-23]

## In the book
FDA's 2019 guidance expects the selection rule, type I error control and the firewall for unblinded interim data to be written in advance. [17/phase-23] A simulation of the inferentially seamless case found that putting roughly 30 to 50 percent of patients in the first stage is close to optimal. [17/phase-23]

## Pitfalls
Power calculated for the eventually selected arm overstates design power, because the first stage sometimes advances the wrong arm. Simulate the selection. [17/phase-23] With a delayed first-stage endpoint, patients enrolled while it matures belong to the first-stage cost. [17/phase-23]

## Check yourself
- Q: What is the price of a seamless design? A: Design complexity, a prespecified selection rule and inferential adjustment. [17/phase-23]
