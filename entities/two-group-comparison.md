---
id: two-group-comparison
name: Two-group comparison
type: concept
aliases: [two group comparison]
level: 1
summary: The basic trial question of whether two arms differ, built in the book from one simulated trial with a binary and a continuous endpoint.
chapters: ['4', '6']
home: sec-testing-example
sections: [sec-testing, 4/recovery-a-two-group-comparison-a-rate-ratio-and-an-interval]
prerequisites: [clinical-trial]
related:
- {rel: uses, to: randomization}
- {rel: uses, to: sampling-distribution}
equations: []
functions: [sim_two_arm_binary]
results: []
lab: [00-are-they-different]
cites: [cox1958planning, recovery_dexamethasone_2021]
---
## What it is
A trial ends with two rows of numbers, one per arm, and the question: are they different? [sec-testing] The book uses one trial with 100 patients per arm, allocated by a fair coin. [sec-testing-example] The binary version has a control response rate of 30% and a true drug rate of 45%. The continuous version has a true extra fall of 4 mmHg in systolic blood pressure and a patient standard deviation of 12 mmHg. [sec-testing-example]

## Why it matters
Patients differ, so a difference in averages comes with a question attached: would a gap like this appear anyway, from the luck of which patients landed where? [sec-testing-example] A test is a procedure for answering it honestly. [sec-testing-example] Notation: $p_j$ is the response probability in arm $j$, with $j = 0$ for control, and $\theta$ is the treatment effect, $p_1 - p_0$ or $\mu_1 - \mu_0$. [sec-testing-example]

## In the book
In the simulated binary trial 30 of 100 respond on control and 45 of 100 on the drug. [sec-testing-example] RECOVERY's dexamethasone comparison is statistically the same kind of trial: 482 of 2104 (22.9%) died on dexamethasone against 1110 of 4321 (25.7%) on usual care, an age-adjusted rate ratio of 0.83 (95% CI 0.75 to 0.93). [4/recovery-a-two-group-comparison-a-rate-ratio-and-an-interval] The analysis is frequentist: only a p-value and an interval. The same 2.8 point gap in a trial of 100 per arm would be buried in a standard error of about 0.06. [4/recovery-a-two-group-comparison-a-rate-ratio-and-an-interval]

## Pitfalls
Each patient has two potential outcomes and only one is seen. Randomization lets the observed gap stand in for the unobservable average difference. [sec-testing-example]

## Check yourself
- Q: What is the true effect in the binary version? A: 15 percentage points, 45% against 30%. [sec-testing-example]
- Q: Why did the 2.8 point RECOVERY gap decide the question? A: The trial had thousands of patients, not 100 per arm. [4/recovery-a-two-group-comparison-a-rate-ratio-and-an-interval]
