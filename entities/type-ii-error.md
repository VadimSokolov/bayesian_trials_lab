---
id: type-ii-error
name: Type II error
type: concept
aliases: [beta error]
level: 1
summary: Failing to reject the null when the drug does work, which means abandoning something useful; its probability is beta and power is one minus beta.
chapters: ['4']
home: sec-testing-errors
sections: [4/key-points, sec-testing-pvalue]
prerequisites: [type-i-error]
related:
- {rel: uses, to: power}
equations: []
functions: [sim_two_arm_binary, z_test_binary]
results: []
lab: [03-errors-power]
cites: [neyman1933problem]
---
## What it is
A type II error is failing to reject $H_0$ when the drug does work. Its probability is $\beta$, and the probability of avoiding it, $1 - \beta$, is the [[power]]. [sec-testing-errors] Unlike $\alpha$, $\beta$ is computed under a specific alternative. Power is a function of the true effect, so "90% power" invites the question: for what effect? [sec-testing-errors]

## Why it matters
A type II error falls on future patients, who will not receive a drug that would have helped, and on the sponsor who abandoned it. [sec-testing-errors] Sponsors pay for it, which is why they ask for more efficient designs. [sec-testing-errors]

## In the book
In the simulated trial with 100 patients per arm and a true rise from 30% to 45%, the power is 60%, so a drug that works would be missed four times in ten. [sec-testing-errors] Power is roughly 35% at 50 per arm, 78% at 150 and 97% at 300, and the customary 80% or 90% needs roughly 160 to 215 patients per arm. [sec-testing-errors] The continuous trial, with a 4 mmHg effect and standard deviation 12 mmHg, has power of about 65% at 100 per arm. [sec-testing-errors]

## Pitfalls
The two errors trade against each other. The only way to improve both at once is a smaller standard error, through more patients, a less noisy endpoint or better use of information. [sec-testing-errors] Success in one observed trial is not evidence that a 60% power design was good. [sec-testing-errors]

## Check yourself
- Q: What does the book call the sample size proportional to at one-sided 0.025 and 90% power? A: $(z_{0.025} + z_{0.10})^2 = 10.51$ divided by the squared standardized effect. [sec-testing-errors]
- Q: Does a large p-value show no effect? A: No. In a trial of 50 per arm the 30% versus 45% drug has power near one in three. [sec-testing-pvalue]
