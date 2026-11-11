---
id: stratified-randomization
name: Stratified randomization
type: method
aliases: [stratified blocks]
level: 2
summary: A separate permuted-block list is run inside each stratum, the combination of levels of a few prognostic factors, so each stratum is nearly balanced.
chapters: ['5']
home: 5/stratified-randomization
sections: [sec-randomization-methods, 5/how-the-schedule-is-actually-made, 5/analyze-as-you-randomized, 5/seeing-the-difference]
prerequisites: [permuted-block-randomization]
related:
- {rel: alternative-to, to: minimization}
- {rel: uses, to: covariate-adjustment}
equations: []
functions: [assign_stratified]
results: []
lab: [06-fair-comparisons]
cites: [kernan1999stratified]
---
## What it is
If a prognostic factor such as disease stage, prior treatment or study center is known to matter, we can balance it by design. A separate permuted-block list is run inside each stratum, the combination of factor levels. Every stratum then has near-equal arm sizes. [5/stratified-randomization]

## Why it matters
ICH E9 asks that the factors used to stratify be accounted for in the analysis. [5/stratified-randomization] Stratification removes variation between strata from the treatment comparison. An analysis that ignores the strata gives a standard error that is too large, a type I error below nominal and a loss of power. [5/analyze-as-you-randomized]

## In the book
Stratification has a ceiling. With $k$ binary factors there are $2^k$ strata, and each has its own incomplete block at the end of enrollment. With 20 patients per center and four factors, most blocks are unfinished. [5/stratified-randomization] The rule is to stratify on two or three strongly prognostic factors and to adjust for the same factors in the analysis. [5/stratified-randomization]

In an interactive response system, the schedule is a table of stratum, sequence number, treatment and kit number. The book generates one for three strata with block sizes of 4 and 6, using a recorded seed. [5/how-the-schedule-is-actually-made]

## Pitfalls
Too many strata leave unfinished blocks and buy little. [5/stratified-randomization] Stratified blocks cut imbalance in the known trait but do nothing for a hidden one. [5/seeing-the-difference]

## Check yourself
- Q: With four binary stratification factors, how many strata exist? A: $2^4 = 16$, and with small centers most blocks stay unfinished. [5/stratified-randomization]
- Q: What happens to the standard error if the analysis ignores the strata? A: It is too large, with wider intervals and lost power. [5/analyze-as-you-randomized]
