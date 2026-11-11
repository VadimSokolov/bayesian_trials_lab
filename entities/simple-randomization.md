---
id: simple-randomization
name: Simple randomization
type: method
aliases: [coin-flip randomization]
level: 1
summary: Each patient is assigned by a fair coin, independently of every other patient, which is unpredictable but can leave small trials unbalanced.
chapters: ['5']
home: 5/simple-randomization
sections: [sec-randomization-methods, 5/seeing-the-difference, sec-randomization-inference]
prerequisites: [randomization]
related:
- {rel: contrasts-with, to: permuted-block-randomization}
- {rel: contrasts-with, to: minimization}
equations: []
functions: [assign_simple]
results: []
lab: [06-fair-comparisons]
cites: [rosenberger2016randomization]
---
## What it is
The simplest method assigns each patient by a fair coin, independently of every other patient. [5/simple-randomization] The book assumes two arms and 1:1 allocation in this section. [sec-randomization-methods]

## Why it matters
Its strength is unpredictability: knowing all previous assignments tells you nothing about the next one. [5/simple-randomization] It is also the case in which the unrestricted permutation shuffle is the right test. [sec-randomization-inference]

## In the book
With $n = 40$ patients, the number in the treatment arm has standard deviation $\sqrt{40}/2 \approx 3.2$, so a split of 15 and 25 is not rare. [5/simple-randomization]

In the simulation with three binary traits, the gap in a known trait under simple randomization falls by a factor of $\sqrt{5}$ when the trial grows from 40 to 200 patients. [5/seeing-the-difference] The hidden trait is as imbalanced under simple randomization as under any other method. [5/seeing-the-difference]

## Pitfalls
In a small trial, chance may give unequal arm sizes and unequal covariate distributions. The loss in arm size is a little efficiency. The covariate imbalance is more serious. [5/simple-randomization] [[permuted-block-randomization]] fixes arm sizes. [[stratified-randomization]] and [[minimization]] fix known covariates.

## Check yourself
- Q: How does the arm-size imbalance shrink when the trial grows from 40 to 200? A: The gap in the known trait falls by a factor of $\sqrt{5}$. [5/seeing-the-difference]
- Q: Does simple randomization allow a clinician to predict the next assignment? A: No. Previous assignments say nothing about the next. [5/simple-randomization]
