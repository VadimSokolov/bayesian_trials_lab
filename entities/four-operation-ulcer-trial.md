---
id: four-operation-ulcer-trial
name: Four-operation ulcer trial
type: trial
aliases: [ulcer trial]
level: 2
summary: A 1965 duodenal ulcer trial of four operations that Novick and Grizzle used to argue for Bayesian analysis, and the book's worked multiplicity example.
chapters: ['10']
home: sec-mult-ulcer
sections: [sec-mult-ulcer, 10/the-original, 10/what-the-traditional-reading-does-with-it, 10/what-the-hierarchical-reading-does-with-it, 10/structure-that-the-correction-cannot-see, 10/the-two-ways-to-pay-for-looking]
prerequisites: [multiplicity, bonferroni-correction, shrinkage]
related: []
equations: []
functions: [shrink_logodds, shrink_eb_fit, shrink_post_prob]
results: [ulcer_bonferroni_vs_posterior]
lab: [05-ulcer-trial]
cites: [novick1965, polson2026bayesstandard]
---

## What it is

Novick and Grizzle made one of the first cases for Bayesian analysis of trial data using an experiment then in progress that compared four operative treatments for duodenal ulcer. It has four arms, six pairwise contrasts, repeated analysis and a modest effect on a binary endpoint. [10/the-original]

The counts in the book are illustrative, set at the scale of that trial and not transcribed from the 1965 paper. They ship with the package as the dataset `ulcer`. [10/the-original]

## Why it matters

It is the structure on which the traditional apparatus does worst, so it shows both ways to pay for looking. [10/the-original]

## In the book

The best against worst contrast, drainage and vagotomy against 75 percent resection, is a difference of 12.4 percentage points in the recurrence rate, with $Z=2.45$. With six contrasts the Bonferroni-adjusted $p$ is 0.0855, not reportable, and Holm does not rescue it. [10/what-the-traditional-reading-does-with-it]

A group sequential design with four interim analyses at the corrected level would put the first boundary at 5.34. [10/what-the-traditional-reading-does-with-it]

The hierarchical model pays in the estimate instead. The best against worst contrast is shrunk from 1.053 to 0.464 on the log-odds scale, and the posterior probability that drainage and vagotomy is worse than 75 percent resection is 0.952, a number a clinician can use. It is not a claim of significance under strong familywise control. [10/what-the-hierarchical-reading-does-with-it]

The four operations are ordered by extent of resection, so a single prespecified linear trend contrast carries no multiplicity burden (trend $p = 0.0043$). [10/structure-that-the-correction-cannot-see]

## Pitfalls

- The companion lab's module 05 uses a different table for this trial, so its numbers differ from the chapter's. [10/the-original]
- The estimate of the between-arm spread rests on four arms and is the sensitive part. [10/what-the-hierarchical-reading-does-with-it]

## Check yourself

- Q: Why does the best against worst contrast overstate the effect? A: It was chosen because it is the largest of six. [10/what-the-traditional-reading-does-with-it]
- Q: What single contrast avoids a multiplicity burden here? A: A prespecified linear trend over the ordered extent of resection. [10/structure-that-the-correction-cannot-see]
