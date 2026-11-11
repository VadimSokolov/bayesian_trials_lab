---
id: randomization
name: Randomization
type: concept
aliases: [random allocation]
level: 1
summary: Assigning each patient to a treatment by chance, so that the groups differ only by luck of the draw and by the treatment.
chapters: ['5']
home: sec-randomization
sections: [sec-randomization-why, sec-randomization-failures, sec-randomization-methods, 5/seeing-the-difference, 5/the-counterfactual-problem]
prerequisites: [counterfactual]
related:
- {rel: contrasts-with, to: confounding-by-indication}
- {rel: precedes, to: allocation-concealment}
- {rel: used-in, to: mrc-streptomycin-trial}
- {rel: governed-by, to: ich-e9}
equations: []
functions: [covariate_imbalance]
results: []
lab: [00-are-they-different, 06-fair-comparisons]
cites: [fisher1935design, sacks1982, schulz1995empirical]
---
## What it is
Randomization assigns a patient to a treatment by chance. The p-values, posteriors and interim looks of the book all assume that the two groups differ only because of the treatment and by luck of the draw. [sec-randomization]

ICH E9 says randomization introduces a deliberate element of chance into the assignment, and tends to make the distributions of prognostic factors, known and unknown, similar across groups. [sec-randomization]

## Why it matters
If a coin ignores everything about the patient, the selection term is zero on average and the difference in observed means estimates the average effect of the drug. [5/the-counterfactual-problem] R. A. Fisher made this argument central to experimental design. [5/the-counterfactual-problem]

The failures without it come in four forms: historical controls, predictable schemes such as alternation, unconcealed allocation and self-selection by patients. [sec-randomization-failures]

## In the book
Sacks, Chalmers and Smith reviewed six therapies studied with both randomized and historical controls. The historically controlled studies were much more likely to report the new therapy as better. [sec-randomization-failures] Schulz and colleagues examined 250 controlled trials and found that inadequately concealed allocation went with odds ratios exaggerated by about 41 percent. [sec-randomization-failures]

The book covers [[simple-randomization]], [[permuted-block-randomization]], [[stratified-randomization]] and [[minimization]]. [sec-randomization-methods] Stratified blocks and minimization cut the imbalance in a known trait. Nothing helps a hidden trait. [5/seeing-the-difference]

## Pitfalls
Randomization does not guarantee balance in any single trial. It guarantees that the imbalance is due to chance, with a known distribution that the confidence interval and p-value account for. [5/seeing-the-difference]

A random list the investigator can see is a way of choosing patients with extra steps, so randomization is only as good as its [[allocation-concealment]]. [sec-randomization-failures]

## Check yourself
- Q: Does randomization balance a hidden trait in one trial? A: No. For a trait unrelated to the factors balanced on, its imbalance is as large as under simple randomization under all four methods. [5/seeing-the-difference]
- Q: What did Schulz and colleagues find about weak concealment? A: Odds ratios exaggerated on average by about 41 percent, an association and not a randomized comparison. [sec-randomization-failures]
