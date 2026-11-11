---
id: tipping-point-analysis
name: Tipping-point analysis
type: method
aliases: [tipping point, tipping-point prior]
level: 3
summary: Reporting the least extreme prior in a stated family for which the success criterion is no longer met, instead of the conclusion under one prior.
chapters: ['8', '19']
home: sec-priors-tipping
sections: [sec-priors-sensitivity, sec-priors-belimumab, sec-priors-protocol]
prerequisites: [sensitivity-analysis]
related:
- {rel: used-in, to: belimumab-pediatric-lupus}
equations: []
functions: []
results: []
lab: [16-bayesian-protocol]
cites: [brunner2020belimumab, pottackal2025belimumab]
---

## What it is

A tipping-point prior is the least extreme prior in a stated family for which the success criterion is no longer met. The idea is borrowed from the handling of missing data [sec-priors-tipping]. One family varies the prior standard deviation, another varies the prior mean at a fixed spread [sec-priors-tipping].

## Why it matters

It replaces a debate about the right prior with a statement about which priors the regulator would have to hold to disagree. A tipping point in an incredible region, such as a skeptic who thought the drug harmful or a prior worth two thirds of the trial, supports the claim that the data drive the conclusion [sec-priors-tipping]. One close to the sponsor's own prior is a warning that the prior drives the answer [sec-priors-tipping].

## In the book

For the 508-event trial, holding the skeptical spread of 0.175, benefit drops below 0.975 only if the prior mean expects harm on average [sec-priors-tipping] [sec-priors-sensitivity]. For pediatric belimumab in lupus, FDA requested a post hoc analysis borrowing from adult trials with weight $w$. The posterior probability of efficacy was at least 97.5 percent whenever $w$ was 0.55 or more [sec-priors-belimumab].

## Pitfalls

The family and criterion belong in the statistical analysis plan before unblinding. A family chosen after seeing the data would be a way of looking for a prior that works [sec-priors-tipping].

## Check yourself

- Q: What is a tipping-point prior? A: The least extreme prior in a family that reverses the success decision [sec-priors-tipping].
- Q: What did the belimumab analysis report? A: Efficacy of at least 97.5 percent once the borrowing weight was 0.55 or more [sec-priors-belimumab].
