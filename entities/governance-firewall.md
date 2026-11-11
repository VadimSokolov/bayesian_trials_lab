---
id: governance-firewall
name: Governance and firewalls
type: concept
aliases: [firewall]
level: 2
summary: 'Who sees unblinded comparative data in an adaptive trial: an independent statistical center and a DMC see it, and the sponsor does not.'
chapters: ['23', '20']
home: 23/the-data-monitoring-committee-firewalls-and-who-sees-what
sections: [21/what-a-dmc-and-a-regulator-would-have-had-to-accept, 20/governance-firewalls-and-the-monitoring-board]
prerequisites: [data-monitoring-committee, interim-analysis]
related:
- {rel: part-of, to: bayesian-protocol}
- {rel: governed-by, to: fda-master-protocols-guidance-2026}
equations: []
functions: []
results: []
lab: [16-bayesian-protocol, 14-studio]
cites: [fda_dmc_2006, fda_master_protocols_2026, ema_platform_rp_2026]
---

## What it is
Adaptive trials need someone to see unblinded comparative data during the trial in order to apply the adaptation rules, and the sponsor must not. [23/the-data-monitoring-committee-firewalls-and-who-sees-what]
The integrity concern is that knowledge of interim results, or even of what decision was made, can change the behavior of investigators, patients and sponsor staff. [23/the-data-monitoring-committee-firewalls-and-who-sees-what]

## Why it matters
The FDA DMC guidance of 2006 remains the starting document, with a draft revision issued in February 2024. [23/the-data-monitoring-committee-firewalls-and-who-sees-what]
Nothing about the Bayesian rule changes the firewall; what changes is the number the committee reads. [21/what-a-dmc-and-a-regulator-would-have-had-to-accept]

## In the book
A workable arrangement has four parties. [23/the-data-monitoring-committee-firewalls-and-who-sees-what]
The independent statistical center holds the randomization code, runs the interim analyses and computes posterior and predictive probabilities. [23/the-data-monitoring-committee-firewalls-and-who-sees-what]
The DMC applies or overrides the rules, and the charter states that the prespecified rules are guides so the committee keeps its judgment on safety. [23/the-data-monitoring-committee-firewalls-and-who-sees-what]
The sponsor's blinded team receives only what the charter allows, and regulators may see more than the sponsor. [23/the-data-monitoring-committee-firewalls-and-who-sees-what]
The DMC should receive the simulation report or a summary, so its members know what the rules were designed to do. [23/the-data-monitoring-committee-firewalls-and-who-sees-what]

## Pitfalls
For response-adaptive randomization the allocation ratios themselves can reveal results. [23/the-data-monitoring-committee-firewalls-and-who-sees-what] The usual safeguard is a burn-in period of equal allocation before adaptation begins, with the statistical center and not the sponsor holding the algorithm. [20/governance-firewalls-and-the-monitoring-board]
Firewalls in a platform trial are more complex since arms enter and leave, and a sponsor of one arm should not see data of competing arms. [23/the-data-monitoring-committee-firewalls-and-who-sees-what]
A DMC asked to apply a rule it does not understand will either follow it blindly or ignore it. [23/the-data-monitoring-committee-firewalls-and-who-sees-what]

## Check yourself
- Q: Who computes the decision quantities? A: The independent statistical center. [23/the-data-monitoring-committee-firewalls-and-who-sees-what]
- Q: Does a Bayesian design change the firewall? A: No, it changes what the DMC reads. [21/what-a-dmc-and-a-regulator-would-have-had-to-accept]
