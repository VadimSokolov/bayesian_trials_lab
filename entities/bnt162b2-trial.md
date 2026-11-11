---
id: bnt162b2-trial
name: BNT162b2 trial
type: trial
aliases: [BNT162b2, Pfizer-BioNTech phase 3, C4591001]
level: 2
summary: The phase 2/3 vaccine trial whose success rule was a posterior probability that vaccine efficacy exceeds 30 percent, with a weak Beta prior.
chapters: ['6', '3', '8', '12', '14', '15', '21', '23']
home: 6/pfizer-biontech-bnt162b2-phase-3-c4591001
sections: [sec-bayes-practice, sec-ess]
prerequisites: [beta-prior, conjugate-prior]
related:
- {rel: illustrates, to: posterior-probability-success-criterion}
- {rel: uses, to: effective-sample-size}
- {rel: illustrates, to: vaccine-efficacy-trial}
- {rel: illustrates, to: anytime-valid-inference}
equations: []
functions: [beta_post, ess_beta]
results: [bnt162b2_beta_binomial_reproduction]
lab: []
cites: [pfizer_sap_2020, polack2020bnt, fda_eua_pfizer_2021]
---
## What it is
The phase 2/3 trial of the BNT162b2 mRNA vaccine is the book's cleanest large example of a Bayesian success rule. Its statistical analysis plan used a beta-binomial model, conditional on the total number of first COVID-19 cases $s$, of whom $s_1$ occur in the vaccine arm. [6/pfizer-biontech-bnt162b2-phase-3-c4591001]

## Why it matters
With equal allocation and follow-up, a case falls in the vaccine arm with probability $p = (1 - \mathrm{VE})/(2 - \mathrm{VE})$. The prior is $p \sim \mathrm{Beta}(0.700102, 1)$, with mean 0.4118, the value of $p$ at VE $= 30\%$. The plan calls it minimally informative. Its effective sample size is 1.7 cases. [6/pfizer-biontech-bnt162b2-phase-3-c4591001]

## In the book
- Design feature: efficacy was declared if $\Pr(\mathrm{VE} > 30\% \mid \text{data}) > 0.986$ at the final analysis, and above 0.995 at an interim. The thresholds were calibrated to a one-sided type I error of 2.5%. [6/pfizer-biontech-bnt162b2-phase-3-c4591001]
- Plan: final analysis at 164 cases, with interim looks at 62, 92 and 120 cases. [6/pfizer-biontech-bnt162b2-phase-3-c4591001]
- Result: 8 cases in the vaccine group against 162 in the placebo group, so $s = 170$ and $s_1 = 8$. The posterior is Beta(0.700102 + 8, 1 + 162). [6/pfizer-biontech-bnt162b2-phase-3-c4591001]
- The posterior probability that VE exceeds 30% is $1 - 2 \times 10^{-28}$. The 95% credible interval for VE is about (90.4%, 97.6%), with a point estimate of 95.1% (plug-in) or 94.9% (posterior median). The paper reports 95.0% with interval 90.3 to 97.6. [6/pfizer-biontech-bnt162b2-phase-3-c4591001]
- FDA authorized the vaccine for individuals 16 years and older on 11 December 2020, and approved the biologics license on 23 August 2021. [6/pfizer-biontech-bnt162b2-phase-3-c4591001]

## Pitfalls
With ESS 1.7 and 170 cases the prior is irrelevant to the conclusion, and a flat prior would shift the interval by well under a point. The statistical analysis plan cited is version 10 dated 7 October 2022, not an archived 2020 version. [6/pfizer-biontech-bnt162b2-phase-3-c4591001]

## Check yourself
- Q: What posterior probability did the final analysis need? A: $\Pr(\mathrm{VE} > 30\% \mid \text{data}) > 0.986$. [6/pfizer-biontech-bnt162b2-phase-3-c4591001]
- Q: Does the prior carry the result? A: No. It was chosen to be defensible, not to carry the result. [6/pfizer-biontech-bnt162b2-phase-3-c4591001]
