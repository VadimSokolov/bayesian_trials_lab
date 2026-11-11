---
id: clinical-trial-simulation
name: Clinical trial simulation
type: method
aliases: [simulation]
level: 2
summary: Running a trial design many times on a computer against assumed true effects to estimate its operating characteristics when no formula exists.
chapters: ['14', '23']
home: sec-simulation
sections: [sec-sim-rule, sec-sim-software, sec-sim-goldilocks, sec-sim-report, 14/what-goes-in-the-traditional-sap]
prerequisites: [operating-characteristics]
related:
- {rel: governed-by, to: fda-adaptive-design-guidance-2019}
- {rel: uses, to: scenario-grid}
equations: []
functions: [oc_simulate, oc_summarize, oc_post_table]
results: []
lab: [14-simulator, 14-studio]
cites: [fda2019adaptive, ich_e20]
---
## What it is

For designs without a closed formula, the answer usually has to be computed by running the design many times against assumed truths [sec-simulation]. ICH E20 defines a simulation as "the repeated execution of a large number of hypothetical clinical trials" [sec-sim-report].

## Why it matters

FDA's 2019 guidance says that when analytic methods are not available, operating characteristics should be evaluated by simulation (Section VI.A) [14/what-goes-in-the-traditional-sap].

## In the book

The function `oc_post_table` stores the posterior probability for every possible pair of success counts at each look [sec-sim-rule]. A simulated trial then costs two binomial draws and a lookup, so a hundred thousand four-look trials take a fraction of a second [sec-sim-rule]. Every simulation in the book passes `seed =` to `oc_simulate` [sec-sim-software].

Industrial practice calls this flight-simulating a trial: specify a structure, simulate many assumed truths, and judge the design by how it behaves across all of them [sec-sim-goldilocks].

## Pitfalls

Verification is the sponsor's job. Three cheap tests are to reproduce a known analytic result, to check invariances, and to rerun with a different seed and compare [sec-sim-software]. Never leave debug settings in a final run [sec-sim-software]. A simulation done after the data are in is not a prespecified operating characteristic [sec-sim-software].

## Check yourself

- Q: What should a one-look simulation with $c = 0.975$ reproduce? A: Approximately the exact type I error of the fixed design, 0.0252 in the book [sec-sim-software].
- Q: Why must parallel runs use independent random streams? A: Using the same seed on every worker is wrong; the book suggests L'Ecuyer-CMRG streams [sec-sim-software].
