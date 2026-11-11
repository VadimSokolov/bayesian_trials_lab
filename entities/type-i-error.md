---
id: type-i-error
name: Type I error
type: concept
aliases: [type I error rate, alpha, false positive rate]
level: 1
summary: Rejecting the null when the drug has no effect, a false-positive trial result; its probability is the level alpha of the test.
chapters: ['4', '1', '7', '14', A]
home: sec-testing-errors
sections: [sec-decision-traditional, 4/key-points, sec-testing-sided, 1/what-the-apparatus-costs]
prerequisites: [p-value]
related:
- {rel: contrasts-with, to: type-ii-error}
- {rel: uses, to: one-sided-test}
- {rel: used-in, to: group-sequential-design}
equations: []
functions: [sim_two_arm_binary, z_test_binary]
results: []
lab: [03-errors-power]
cites: [neyman1933problem, fisher1935design, fisher1946statistical]
---
## What it is
A type I error is rejecting $H_0$ when the drug has no effect: a false-positive trial, which could lead to approval of an ineffective drug if nothing else catches it. Its probability is the level of the test, $\alpha$. [sec-testing-errors] The language of type I and type II errors comes from Neyman and Pearson. [sec-testing-errors] It is a probability computed under the null world. [sec-testing-errors]

## Why it matters
The rate is a promise about the procedure, made before any data exist: if the drug does nothing, at most a fraction $\alpha$ of trials run this way will declare success. [sec-decision-traditional] It is the reason regulators trust the design. [sec-decision-traditional] Regulators fix $\alpha$ by convention and leave $\beta$ to the sponsor. [sec-testing-errors]

## In the book
Run the binary trial many times with no effect and apply the rule "reject if $Z > 1.96$": the rejection rate is the type I error rate, close to the nominal 2.5%. [sec-testing-errors] If a false-positive trial leads to approval, the cost falls mostly on future patients, who receive a drug that does not work. [sec-testing-errors]

## Pitfalls
The promise survives repeated use only if the analysis plan is fixed in advance. [sec-decision-traditional] At fixed information, lowering $\alpha$ generally increases $\beta$ and reduces power. [4/key-points] If a sponsor sees the drug ahead and then declares a one-sided test at 0.05, the type I error doubles to 5%. [sec-testing-sided]

## Check yourself
- Q: In which world is $\alpha$ computed? A: The null world, where the drug does nothing. [sec-testing-errors]
- Q: What happens to the error rate if you test naively at 1.96 at each of four looks? A: The overall one-sided error is about 0.063, more than twice 0.025. [1/what-the-apparatus-costs]
