---
id: one-sided-test
name: One-sided test
type: concept
aliases: [one sided test, 0.025, one sided alpha]
level: 1
summary: A test that counts only departures in the direction of benefit; regulators prefer a one-sided level of 0.025, half the conventional two-sided 0.05.
chapters: ['4', A]
home: sec-testing-sided
sections: [sec-testing-bridge, 4/key-points]
prerequisites: [p-value, confidence-interval]
related:
- {rel: governed-by, to: fda-bayesian-draft-guidance-2026}
- {rel: uses, to: type-i-error}
- {rel: governed-by, to: ich-e9}
equations: []
functions: []
results: []
lab: [03-errors-power]
cites: [fda_bayesian_2026]
---
## What it is
A two-sided test counts departures from the null in either direction. A one-sided test counts only departures toward benefit. In the shuffle picture the one-sided p-value is the right tail and the two-sided is that tail plus its mirror image. [sec-testing-sided]

## Why it matters
ICH E9 section 5.5 asks the sponsor to "justify prospectively the use of one-sided tests" and prefers one-sided type I errors at half the two-sided level. With the conventional 0.05, half is 0.025. [sec-testing-sided] A one-sided 0.025 is the same bar as a two-sided 0.05, since both reject when the 95% interval excludes zero on the favorable side. [sec-testing-sided] The FDA draft Bayesian guidance of January 2026 uses this language. [sec-testing-sided]

## In the book
A paper reporting "p = 0.04, two-sided" for a helpful drug has a one-sided p-value of 0.02 and meets the bar; "one-sided p = 0.04" does not. [sec-testing-sided] The binary trial gives one-sided p-values of 0.014 (normal), 0.020 (Fisher) and 0.021 (randomization). [sec-testing-sided] The sample size formula uses $z_{0.025} = 1.96$ either way. [sec-testing-sided]

## Pitfalls
If the sponsor sees the drug ahead and then declares a one-sided test at 0.05, the type I error rate has doubled to 5%. [sec-testing-sided] A one-sided test gives no weight to harm, and a strongly negative difference can give a one-sided p-value near 1. Safety review handles harm. [sec-testing-sided]

## Check yourself
- Q: A two-sided p of 0.04 corresponds to what one-sided p? A: 0.02. [sec-testing-sided]
- Q: Where is harm handled? A: In the safety analyses and interim monitoring, not the efficacy test. [sec-testing-sided]
