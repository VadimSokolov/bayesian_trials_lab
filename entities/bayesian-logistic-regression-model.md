---
id: bayesian-logistic-regression-model
name: Bayesian logistic regression model
type: method
aliases: [BLRM]
level: 3
summary: A two-parameter logistic dose-toxicity model with informative priors, used with interval probabilities and an overdose bound.
chapters: ['17']
home: sec-dose-blrm
sections: [17/escalation-with-overdose-control, 17/the-continual-reassessment-method]
prerequisites: [overdose-control, posterior-distribution]
related:
- {rel: alternative-to, to: continual-reassessment-method}
equations: []
functions: [dose_blrm_table]
results: []
lab: [14-studio]
cites: [neuenschwander2008blrm]
---

## What it is
The BLRM of Neuenschwander and colleagues uses a two-parameter logistic model with informative priors. It estimates the slope too, and needs informative priors to behave. [17/the-continual-reassessment-method] It applies the overdose-control idea to interval probabilities of the DLT rate. [17/escalation-with-overdose-control]

## Why it matters
It shows what the posterior looks like at a decision point and how one early DLT is weighed against all the other data, which the 3+3 rule forgoes. [sec-dose-blrm]

## In the book
Doses are 1, 2, 4, 8 and 16 mg with reference dose 8 mg, and $\mathrm{logit}\,p(d) = \log\alpha + \beta \log(d/8)$. The priors are $\log\alpha \sim N(\mathrm{logit}\,0.25, 2^2)$ and $\log\beta \sim N(0, 1)$. [sec-dose-blrm] Four cohorts: 0 of 3 at 1 mg, 0 of 3 at 2 mg, 1 of 3 at 4 mg and 1 of 6 at 8 mg. [sec-dose-blrm] Underdosing is below 0.16, target 0.16 to 0.33, overdosing 0.33 or above. [sec-dose-blrm] The 16 mg dose is excluded because its overdose probability exceeds 0.25, and the next cohort gets 8 mg. [sec-dose-blrm]

## Pitfalls
The result depends on the prior. Rerun the table with a different `prior_sd` before trusting it. [sec-dose-blrm]

## Check yourself
- Q: Why was 16 mg excluded? A: Its probability of overdosing was above the bound of 0.25. [sec-dose-blrm]
- Q: Did the single DLT at 4 mg stop escalation? A: No, the model weighed it against the other data. [sec-dose-blrm]
