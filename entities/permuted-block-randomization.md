---
id: permuted-block-randomization
name: Permuted block randomization
type: method
aliases: [permuted blocks, blocked randomization]
level: 1
summary: Patients are grouped in blocks, and each block contains an equal number of each treatment in random order, which keeps arm sizes balanced.
chapters: ['5']
home: 5/permuted-block-randomization
sections: [sec-randomization-methods, 5/seeing-the-difference, sec-randomization-inference]
prerequisites: [simple-randomization]
related:
- {rel: contrasts-with, to: stratified-randomization}
- {rel: alternative-to, to: minimization}
- {rel: uses, to: time-trend-bias}
equations: []
functions: [assign_block]
results: []
lab: [06-fair-comparisons]
cites: [zelen1974randomization, efron1971biased_coin, wei1978adaptive]
---
## What it is
Permuted block randomization fixes the arm sizes at intervals. Patients are grouped in consecutive blocks of, say, four. In each block two get the drug and two get control, in random order, and there are six possible orders. [5/permuted-block-randomization]

## Why it matters
After every block the arms are exactly balanced in size, and at any moment the imbalance cannot exceed half a block. Both arms also have patients from each period, which protects against a slow time trend. [5/permuted-block-randomization]

## In the book
Block length fixed at four is predictable. If the first three patients were drug, drug, control, the fourth must be control. A clinician who can see past assignments can use that to select patients. [5/permuted-block-randomization] The standard remedy is to vary block length at random, for example blocks of 4 and 6, and to keep block sizes out of the protocol text. [5/permuted-block-randomization]

Blocks do nothing for covariate imbalance: a block makes the number of patients per arm equal and says nothing about which patients. The "block" boxplots match the "simple" ones. [5/seeing-the-difference]

For [[randomization-test|permutation tests]], the shuffle should respect the blocks. Ignoring them made the test conservative under a time trend: the empirical type I error was 0.011 for the unrestricted shuffle and 0.022 within blocks, against a nominal 0.025. [sec-randomization-inference]

## Pitfalls
The price is predictability, especially in open-label trials or trials with unmasked packaging. [5/permuted-block-randomization] Blocks help with arm size and time trends. For covariates, stratification inside blocks or [[minimization]] is needed. [5/seeing-the-difference]

## Check yourself
- Q: With blocks of four, the first three assignments were drug, drug, control. What is the fourth? A: Control, which is why fixed block length is predictable. [5/permuted-block-randomization]
- Q: Do blocks reduce imbalance in a known covariate? A: No. The block boxplots match simple randomization. [5/seeing-the-difference]
