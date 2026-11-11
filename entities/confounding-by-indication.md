---
id: confounding-by-indication
name: Confounding by indication
type: concept
aliases: [doctor picks the patients]
level: 1
summary: When the reasons a doctor chooses a treatment are related to the outcome, the comparison of treated and untreated patients is biased.
chapters: ['5']
home: 5/confounding-by-indication-a-doctor-picks-the-patients
sections: [sec-randomization-failures, sec-randomization]
prerequisites: [counterfactual]
related:
- {rel: contrasts-with, to: randomization}
- {rel: contrasts-with, to: ignorability}
equations: []
functions: [sim_confounded_trial, sim_adjusted_vs_naive]
results: []
lab: [00-are-they-different]
cites: []
---
## What it is
The commonest way for the selection term (the bias term of Equation 5.1 that randomization sets to zero) to be nonzero in medicine is confounding by indication: the reasons a doctor chooses a treatment are themselves related to the outcome. [5/confounding-by-indication-a-doctor-picks-the-patients]

A physician who thinks a new drug is promising may offer it to patients who seem strong enough to benefit and keep the old treatment for the frail. No bad faith is needed. The physician is using judgment on behalf of each patient, and that ruins the comparison. [5/confounding-by-indication-a-doctor-picks-the-patients]

## Why it matters
A larger trial does not help. The standard error is about the same whether a doctor or a coin chooses, so more patients only make the wrong answer more convincing. [5/confounding-by-indication-a-doctor-picks-the-patients]

Adjustment helps only for what was recorded. Stratifying on a recorded health score moves the estimate closer to the truth but not onto it, because patients within a band still differ. [5/confounding-by-indication-a-doctor-picks-the-patients] The coin balances health as recorded, as sensed and as nobody has thought of. [5/confounding-by-indication-a-doctor-picks-the-patients]

## In the book
Each patient has a hidden health score. The new drug truly adds 10 percentage points to the probability of recovery. Each simulated trial has 400 patients, and 1,000 trials of each kind are run. [5/confounding-by-indication-a-doctor-picks-the-patients]

When the doctor chooses, the estimates center on roughly three times the truth. When a coin chooses, they center on the truth. [5/confounding-by-indication-a-doctor-picks-the-patients] The mean doctor-chosen estimate is 0.31 against a truth of 0.10, because the treated patients were 1.06 standard deviations healthier. [5/confounding-by-indication-a-doctor-picks-the-patients] Stratifying on health in five bands lowers the estimate to about 0.12 (0.117). [5/confounding-by-indication-a-doctor-picks-the-patients]

## Pitfalls
These are failures of assignment, not of analysis. No adjustment applied afterward can repair an assignment mechanism that depended on unrecorded information. [sec-randomization-failures]

## Check yourself
- Q: In the doctor-chooses simulation, will a larger trial bring the estimate to the true 10 points? A: No. The bias stays, and the larger trial only makes the wrong answer more convincing. [5/confounding-by-indication-a-doctor-picks-the-patients]
- Q: Does adjusting for a recorded health score fully fix it? A: No. It brings the estimate closer, but patients within a band still differ and the choice depends on health itself. [5/confounding-by-indication-a-doctor-picks-the-patients]
