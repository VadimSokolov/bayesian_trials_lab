---
id: noninferiority-margin
name: Noninferiority margin
type: concept
aliases: [margin]
level: 2
summary: The largest loss to the active control that is acceptable, built from the control's historical effect over placebo and fixed before unblinding.
chapters: ['4', '19', '21']
home: 4/where-the-margin-comes-from
sections: [sec-testing-ni, 4/surpass-cvot-a-noninferiority-margin-in-practice]
prerequisites: [noninferiority-trial]
related:
- {rel: uses, to: historical-control}
- {rel: alternative-to, to: margin-synthesis}
equations: []
functions: []
results: []
lab: []
cites: [fda_ni_2016, ich_e10, rothmann2003ni]
---
## What it is
A noninferiority trial with no placebo arm cannot show by itself that the new drug works. The comparison is informative only if the control's effect is known from earlier placebo-controlled trials and is assumed to hold now. [4/where-the-margin-comes-from] The FDA guidance builds the margin in two steps. $M_1$ is the whole effect of the active control over placebo that can be assumed in the present trial, conventionally the conservative limit of a meta-analytic interval. $M_2$ is the margin actually used, preserving a clinically meaningful fraction of that effect, so $M_2\le M_1$. [4/where-the-margin-comes-from]

## Why it matters
How much to preserve is a clinical judgment, and the margin should be justified for the setting and not read from a convention. [4/where-the-margin-comes-from] The margin must be fixed in the protocol and justified before unblinding. [4/where-the-margin-comes-from]

## In the book
Two ways to use the historical estimate are described. The fixed-margin approach sets the margin from the historical confidence limit and runs an ordinary test. The synthesis approach combines the historical and current estimates and carries both uncertainties into one test. [4/where-the-margin-comes-from] In SURPASS-CVOT the margin of 1.05 did the work, and a margin of 1.00 would have been a superiority trial. [4/surpass-cvot-a-noninferiority-margin-in-practice]

## Pitfalls
The scheme rests on the constancy assumption: the control's historical effect is the effect it would have in this trial. It cannot be checked within the trial. [4/where-the-margin-comes-from] Assay sensitivity, the ability to tell an effective from an ineffective treatment, therefore matters, and poor adherence or crossover helps the sponsor. [4/where-the-margin-comes-from]

## Check yourself
- Q: Which is larger, $M_1$ or $M_2$? A: $M_1$, since $M_2\le M_1$. [4/where-the-margin-comes-from]
- Q: Does sloppiness hurt or help a noninferiority sponsor? A: It helps, by pulling the arms together. [4/where-the-margin-comes-from]
