---
id: randomization-test
name: Randomization test
type: method
aliases: [randomization inference, permutation test]
level: 2
summary: A test that shuffles treatment labels under the same procedure used to randomize, giving the exact distribution of the statistic over possible assignments.
chapters: ['5', '4']
home: sec-randomization-inference
sections: [5/analyze-as-you-randomized, sec-randomization-protocol]
prerequisites: [randomization, p-value, counterfactual]
related:
- {rel: generalizes, to: z-test}
- {rel: uses, to: type-i-error}
- {rel: uses, to: permuted-block-randomization}
equations: []
functions: [perm_test_arm]
results: []
lab: [00-are-they-different]
cites: [fisher1935design]
---
## What it is
Take the observed outcomes, shuffle the group labels many times, and ask how often a shuffled difference is as large as the observed one. The test is justified by the design. [sec-randomization-inference]

Under the sharp null, $Y_i(1) = Y_i(0)$ for every patient, each outcome would be the same whatever the arm, and only the assignment varied. The permutation distribution is then the exact distribution of the statistic over possible assignments. [sec-randomization-inference]

## Why it matters
It requires no model for the outcome, and type I error is controlled by construction. Fisher put it forward in 1935, and the normal-theory z and t tests approximate it. [sec-randomization-inference]

It also needs no random sample: it asks only about the patients actually enrolled. Generalizing to future patients is a separate step resting on clinical judgment. [sec-randomization-inference]

## In the book
The shuffle must follow the design. A null trial of 40 patients with an upward drift of two standard deviations was analyzed with a one-sided permutation test at nominal level 0.025. With block assignment the unrestricted shuffle was conservative, and the shuffle within blocks was close to nominal. [sec-randomization-inference] In Table 5.1 the empirical type I error is 0.011 for the unrestricted shuffle with block assignment and 0.022 within blocks, against 0.025 under simple randomization. [sec-randomization-inference]

## Pitfalls
A test that ignores the blocks treats as possible many assignments the design excluded. It gives away power. [sec-randomization-inference] The analysis should mirror the randomization, and stratification factors belong in the model. [5/analyze-as-you-randomized]

## Check yourself
- Q: If assignment used permuted blocks of four, which shuffles are allowed? A: Only those with two drug and two control in each block. [sec-randomization-inference]
- Q: What population does the p-value refer to? A: The patients actually enrolled, not a sample from anything. [sec-randomization-inference]
