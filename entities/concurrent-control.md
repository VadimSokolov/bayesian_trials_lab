---
id: concurrent-control
name: Concurrent control
type: concept
aliases: [non-concurrent control, concurrently eligible control]
level: 2
summary: Control patients randomized while an arm was open, and eligible for it, as opposed to non-concurrent controls randomized earlier.
chapters: ['20']
home: 20/concurrent-and-non-concurrent-controls
sections: [20/concurrent-and-non-concurrent-controls, 20/regulatory-position, 20/how-big-is-the-bias-a-simulation, 20/the-bayesian-time-machine, 20/governance-firewalls-and-the-monitoring-board]
prerequisites: [clinical-trial, type-i-error]
related:
- {rel: contrasts-with, to: historical-control}
- {rel: governed-by, to: fda-master-protocols-guidance-2026}
- {rel: governed-by, to: ema-platform-reflection-paper}
- {rel: uses, to: bayesian-time-machine}
equations: []
functions: [platform_drift_simulation, platform_time_machine]
results: []
lab: [10-platform-trials]
cites: [dodd2021platform, fda_master_protocols_2026, ema_platform_rp_2026, krotka2023ncc, lee2020including, bofillroig2022model]
---
## What it is

Concurrent controls are those randomized while the arm was open. Non-concurrent controls were randomized before it opened. They are tempting because they are free patients and dangerous because of drift in standard of care, patient mix, sites and conduct. [20/concurrent-and-non-concurrent-controls]

## Why it matters

FDA's June 2026 draft asks that the primary comparison use only concurrently eligible controls, who met the drug's eligibility criteria and could have been randomized to it. The shared control keeps most of its efficiency gain with only concurrent controls. [20/regulatory-position] The EMA draft defines concurrent controls as having a positive probability of randomization to the arm and says non-concurrent controls are usually not acceptable for the primary analysis of the primary endpoint. [20/regulatory-position]

## In the book

In a simulation with success on standard care rising 2 points a year, the concurrent comparison is unbiased and rejects at about the nominal 2.5%, while pooling all controls gives a type I error more than three times nominal. [20/how-big-is-the-bias-a-simulation] A linear calendar-time term removes the bias under smooth linear drift, but depends on the model being right. [20/how-big-is-the-bias-a-simulation] The Bayesian time machine is a less rigid alternative. [20/the-bayesian-time-machine]

## Pitfalls

Pooling improves power partly spuriously when drift is present. [20/how-big-is-the-bias-a-simulation] A sponsor using non-concurrent data should justify it in advance, pre-specify the method and run sensitivity analyses giving it less weight or none. [20/regulatory-position]

## Check yourself

- Q: Does pooling all controls under upward drift inflate or deflate type I error? A: It inflates it. [20/how-big-is-the-bias-a-simulation]
- Q: What does the EMA draft allow for non-concurrent data? A: Supplementary analyses or rarely observed secondary endpoints. [20/regulatory-position]
