---
id: nsclc-borrowing-case
name: NSCLC borrowing failure
type: history
aliases: [NSCLC case study]
level: 2
summary: A study in which a matched real-world control augmented with a fixed-weight power prior did not reproduce the randomized result in first-line lung cancer.
chapters: ['19']
home: sec-borrowing-nsclc
sections: [sec-borrowing-nsclc, sec-borrowing-guide, sec-borrowing-keypoints]
prerequisites: [power-prior, historical-control]
related: []
equations: []
functions: []
results: []
lab: [09-adaptive-bayesian]
cites: [nsclc_borrowing_2024]
---
## What it is

Struebing and colleagues (2024) built a matched real-world external control arm in first-line non-small cell lung cancer and augmented it with historical-trial data through a fixed-weight power prior. They compared the result with the survival result of the randomized trial whose control arm it replaced. The augmented external control did not reproduce the randomized result. [sec-borrowing-nsclc]

## Why it matters

A power prior with a fixed discount lowers the weight of the historical data but does not change their center. Discounting does not remove differences between sources. [sec-borrowing-nsclc]

## In the book

If real-world patients differ from trial patients in prognostic factors that matching did not capture, the augmented control stays biased. Matching on measured covariates removes only the measured bias. [sec-borrowing-nsclc] The book uses it as the example to show a team that proposes replacing a concurrent control with a matched external one. [sec-borrowing-nsclc] The decision guide says to expect the lesson to apply when the only sources are non-randomized. [sec-borrowing-guide]

## Pitfalls

It is one case and should not be generalized beyond what it shows. [sec-borrowing-nsclc]

## Check yourself

- Q: Predict: does a fixed discount repair prognostic differences? A: No, it changes weight and not center. [sec-borrowing-nsclc]
- Q: What bias does matching remove? A: Only the measured bias. [sec-borrowing-nsclc]
