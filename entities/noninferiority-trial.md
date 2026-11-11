---
id: noninferiority-trial
name: Noninferiority trial
type: design
aliases: [noninferiority]
level: 2
summary: 'A trial against an active control with the null hypothesis moved: the claim is that the new drug is not worse than a margin allows.'
chapters: ['4', '19', '21']
home: sec-testing-ni
sections: [4/where-the-margin-comes-from, 4/surpass-cvot-a-noninferiority-margin-in-practice]
prerequisites: [one-sided-test, confidence-interval]
related:
- {rel: uses, to: noninferiority-margin}
- {rel: contrasts-with, to: equivalence-trial}
- {rel: special-case-of, to: two-group-comparison}
equations: [eq-ni-hyp]
functions: []
results: []
lab: []
cites: [blackwelder1982proving, dunnett1977equivalence, nicholls2025surpasscvot, gerstein2019dulaglutide]
---
## What it is
When an effective treatment exists, withholding it for placebo is often unethical, so the new drug is compared with an active control. [sec-testing-ni] Let $\gamma = \log \mathrm{HR}$. For margin $M>1$ on the hazard ratio scale the hypotheses are

$$
H_0:\ \gamma \ge \log M \qquad\text{against}\qquad H_1:\ \gamma < \log M.
$$

This is equation eq-ni-hyp. [sec-testing-ni] The test is one-sided at 0.025, equivalent to checking that the upper limit of the two-sided 95% interval is below $\log M$. [sec-testing-ni] Blackwelder put the burden of proof on the claim of similarity for noninferiority. [sec-testing-ni]

## Why it matters
The answer depends entirely on $M$, a number the data do not supply. [sec-testing-ni] A sloppy trial pulls the arms together and makes any drug look noninferior. [4/where-the-margin-comes-from]

## In the book
SURPASS-CVOT compared tirzepatide with dulaglutide 1.5 mg, with a pre-specified noninferiority margin of 1.05 for the upper limit of the 95.3% interval. [4/surpass-cvot-a-noninferiority-margin-in-practice] The primary outcome occurred in 801 patients (12.2%) on tirzepatide and 862 (13.1%) on dulaglutide, hazard ratio 0.92 (95.3% CI 0.83 to 1.01). [4/surpass-cvot-a-noninferiority-margin-in-practice] Noninferiority was established, since 1.01 is below 1.05, and superiority was not, since 1.01 is above 1.00. [4/surpass-cvot-a-noninferiority-margin-in-practice]

## Pitfalls
A margin changed after the data are seen is not a margin. [4/where-the-margin-comes-from] The traditional report does not give the probability that the hazard ratio lies below a given value. [4/surpass-cvot-a-noninferiority-margin-in-practice]

## Check yourself
- Q: Can a trial win noninferiority and lose superiority? A: Yes, the two nulls differ. [4/surpass-cvot-a-noninferiority-margin-in-practice]
- Q: Why was dulaglutide a legitimate control? A: REWIND had shown it reduces cardiovascular events against placebo. [4/surpass-cvot-a-noninferiority-margin-in-practice]
