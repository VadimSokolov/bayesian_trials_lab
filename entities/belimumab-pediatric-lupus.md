---
id: belimumab-pediatric-lupus
name: Pediatric belimumab in lupus
type: trial
aliases: [belimumab, belimumab in children, PLUTO]
level: 2
summary: A pediatric lupus trial whose wide interval was supported by a post hoc Bayesian robust mixture analysis borrowing from two adult trials, with a tipping point at weight 0.55.
chapters: ['19', '3', '8', '23']
home: sec-borrowing-belimumab
sections: [sec-borrowing-belimumab, sec-borrowing-pediatric, sec-borrowing-map]
prerequisites: [robust-mixture-prior, pediatric-extrapolation]
related:
- {rel: illustrates, to: tipping-point-analysis}
equations: []
functions: []
results: []
lab: [09-adaptive-bayesian, 16-bayesian-protocol]
cites: [brunner2020belimumab, fda_belimumab_leader_2025]
---
## What it is

The pediatric trial of intravenous belimumab in systemic lupus erythematosus (C1109, PLUTO) randomized 93 children, 92 in the analysis below. At week 52 the SRI-4 response was 28 of 53 (52.8%) on belimumab and 17 of 39 (43.6%) on placebo, a difference of 9.2 points with an odds ratio of 1.5 (95% CI 0.6 to 3.5). [sec-borrowing-belimumab]

## Why it matters

That interval is far too wide to stand alone. FDA recommended a post hoc Bayesian analysis borrowing from two adult trials (C1056 and C1057) with the same SRI-4 endpoint and the same 10 mg/kg dose. [sec-borrowing-belimumab]

## In the book

The prior was a robust mixture with an informative component built from the adult placebo and 10 mg/kg arms and a minimally informative component, with borrowing weight $w$. [sec-borrowing-belimumab] The analysis was a tipping-point analysis over $w$. The posterior probability of efficacy reached at least 97.5% whenever $w$ was 0.55 or more, and the review division judged such a weight reasonable given a similar disease course, similar pharmacokinetics and similar baseline characteristics. [sec-borrowing-belimumab] The tipping point reports the smallest borrowing that supports the conclusion and leaves its plausibility to the clinical and pharmacological evidence. [sec-borrowing-belimumab]

## Pitfalls

The analysis was post hoc. The case study stresses that future programs should pre-specify it, with the discussion starting before the IND. [sec-borrowing-belimumab]

## Check yourself

- Q: Why was borrowing needed? A: The pediatric odds ratio of 1.5 had a 95% CI of 0.6 to 3.5. [sec-borrowing-belimumab]
- Q: What did the tipping point show? A: Posterior probability of efficacy of at least 97.5% for $w$ of 0.55 or more. [sec-borrowing-belimumab]
