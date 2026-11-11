---
id: platform-trial
name: Platform trial
type: design
aliases: [adaptive platform trial]
level: 2
summary: A master protocol that fixes the disease and infrastructure and lets drugs enter and leave over time under pre-specified decision rules.
chapters: ['20', '19']
home: sec-platform
sections: [sec-platform, 20/definitions-master-protocol-basket-umbrella-platform, 20/traditional-against-bayesian-platforms-what-differs, 20/governance-firewalls-and-the-monitoring-board, 20/what-changes-in-the-protocol, 20/separate-trials-and-what-they-cost, 20/epad-a-platform-that-never-opened-an-arm]
prerequisites: [master-protocol]
related:
- {rel: generalizes, to: multi-arm-multi-stage-design}
- {rel: uses, to: shared-control-arithmetic}
- {rel: uses, to: concurrent-control}
- {rel: used-in, to: i-spy-2-trial}
equations: []
functions: [platform_shared_control_table]
results: []
lab: [10-platform-trials]
cites: [woodcock2017master, aptc2019adaptive, ema_cctqa_2022, saville2016efficiencies, park2019systematic, meyer2020evolution]
---
## What it is

FDA's June 2026 draft describes a platform as a trial to "evaluate multiple drugs for one or more diseases, conditions, or disease subtypes in an ongoing manner, with drugs entering or leaving the platform". [20/definitions-master-protocol-basket-umbrella-platform] A platform fixes the disease and the infrastructure and lets the drugs change. [20/definitions-master-protocol-basket-umbrella-platform] The EC, EMA and HMA question-and-answer document defines it as a shared framework in which investigational products enter and leave at different times under pre-specified decision rules. [20/definitions-master-protocol-basket-umbrella-platform]

## Why it matters

A platform answers $k$ questions with one control group, enrolling $(k+1)m$ patients rather than $2km$. [20/separate-trials-and-what-they-cost] Saville and Berry simulated whole programs and found platforms found beneficial treatments with fewer patients and less time than a traditional strategy, under stated assumptions. [20/separate-trials-and-what-they-cost]

## In the book

Both frequentist and Bayesian platforms can accommodate new arms and share information, and both need a justified hypothesis family and demonstrated operating characteristics. [sec-platform] The Bayesian platforms use a decision rule per arm calibrated by simulation, with optional hierarchical sharing. [20/traditional-against-bayesian-platforms-what-differs] Governance typically has a single monitoring committee, an independent statistical center and an arm-approval committee. [20/governance-firewalls-and-the-monitoring-board]

## Pitfalls

Arms added later create the non-concurrent control problem. [20/separate-trials-and-what-they-cost] A platform survives its first arm only if governance is built for arms not yet known, and EPAD never opened an arm. [20/governance-firewalls-and-the-monitoring-board] [20/epad-a-platform-that-never-opened-an-arm]

## Check yourself

- Q: What does a platform fix and what does it vary? A: It fixes disease and infrastructure and varies the drugs. [20/definitions-master-protocol-basket-umbrella-platform]
- Q: How many patients does a platform of five drugs at 80 per arm need? A: 480, against 800 for separate trials. [20/what-changes-in-the-protocol]
