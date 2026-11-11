---
id: vaccine-efficacy-trial
name: Vaccine efficacy trial
type: design
aliases: []
level: 2
summary: A trial that estimates vaccine efficacy from case counts in two arms; in the book BNT162b2 is a confirmatory trial whose prespecified Bayesian primary analysis met its success criterion before the emergency use authorization.
chapters: ['21', '15']
home: sec-cases-bnt
sections: [21/the-trial-as-conducted-3, 21/the-bayesian-element, 21/what-happened-and-what-the-regulator-did, 21/the-lesson-for-this-chapter, 23/bnt162b2-thresholds-calibrated-to-25]
prerequisites: [beta-prior, posterior-probability-success-criterion]
related:
- {rel: used-in, to: bnt162b2-trial}
- {rel: uses, to: conjugate-prior}
- {rel: uses, to: calibration}
equations: []
functions: []
results: []
lab: [09-adaptive-bayesian]
cites: [polack2020bnt, pfizer_sap_2020, fda_eua_pfizer_2021, fda2021comirnaty]
---

## What it is
A vaccine efficacy trial splits cases between the vaccine and placebo arms, models the vaccine share of cases with a beta-binomial model, and transforms that share into vaccine efficacy (VE); VE of 30% corresponds to a vaccine share of 0.7/1.7. [21/the-bayesian-element] The success bar is set on VE above a clinical margin, not on zero. [21/the-lesson-for-this-chapter]
As the example, the BNT162b2 phase 2/3 trial (Protocol C4591001, Pfizer and BioNTech) began in July 2020, and its statistical analysis plan makes the primary analysis Bayesian. [21/the-trial-as-conducted-3]
Unlike the SELECT and REWIND reconstructions, the Bayesian rule was the trial's own decision rule. [21/the-trial-as-conducted-3]

## Why it matters
It shows a regulatory path already traveled: a minimally informative prior, a margin, calibration to 0.025 one-sided, and thresholds fixed before the first case. [21/the-lesson-for-this-chapter]

## In the book
The model is conjugate beta-binomial with prior Beta(0.700102, 1) on the vaccine share of cases. [21/the-bayesian-element]
The success criterion is $\Pr(\mathrm{VE} \ge 30\% \mid \text{data})$ above 0.995 at an interim analysis and 0.986 at the final analysis, calibrated so the overall one-sided type I error is 2.5 percent. [21/the-bayesian-element]
The final analysis was planned at 164 first primary cases, with a nonbinding futility rule at a predictive probability of success of 5 percent or less. [21/the-bayesian-element]
The bar is on vaccine efficacy of 30 percent and not on zero, so the criterion has $a$ different from zero. [21/the-bayesian-element]
The trial counted 8 cases in the vaccine group and 162 in the placebo group, an efficacy of 95.0 percent with a 95 percent credible interval of 90.3 to 97.6 percent. [21/what-happened-and-what-the-regulator-did]
FDA issued an emergency use authorization on 11 December 2020 for ages 16 and older and approved the biologics license application on 23 August 2021. [21/what-happened-and-what-the-regulator-did]

## Pitfalls
The plan on ClinicalTrials.gov is a sponsor document with several amendments. [21/the-lesson-for-this-chapter]
FDA's announcements contain no statement on the Bayesian criterion, so the lesson concerns the sponsor's side. [23/bnt162b2-thresholds-calibrated-to-25]

## Check yourself
- Q: Why are there two thresholds, 0.995 and 0.986? A: One applies at the interim analyses and one at the final, calibrated for 2.5 percent overall. [21/the-bayesian-element]
- Q: How does this case differ from SELECT? A: The Bayesian analysis was the actual analysis, not a counterfactual. [21/the-trial-as-conducted-3]
