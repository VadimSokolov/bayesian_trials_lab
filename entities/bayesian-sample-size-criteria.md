---
id: bayesian-sample-size-criteria
name: Bayesian sample size criteria
type: method
aliases: []
level: 3
summary: 'Rules that turn a design prior and an analysis prior into a sample size: average length, average coverage, worst outcome and posterior probability criteria.'
chapters: ['9']
home: sec-power-criteria
sections: [sec-power-lupus]
prerequisites: [assurance, posterior-probability-of-benefit]
related:
- {rel: uses, to: prior-distribution}
equations: []
functions: [decide_ss_acc_woc, decide_ss_alc, decide_ss_min_n, decide_ss_posterior_prob]
results: []
lab: [03-errors-power]
cites: [inoue2005, joseph1995hpd, joseph1997criteria, joseph1997normal, joseph2019consensus, moore1999lupus, ssproportions2023, wang2002simulation]
---

## What it is

Inoue, Berry and Parmigiani separate the Bayesian rules into families. Most involve two priors: the design prior that predicts the data and the analysis prior that turns data into a posterior [sec-power-criteria]. The criteria are the average length criterion (ALC), the average coverage criterion (ACC), the worst outcome criterion (WOC) and the posterior probability criterion [sec-power-criteria].

## Why it matters

Read by the question each answers, the length and coverage criteria size an estimate, the posterior probability criterion and assurance size a decision, and expected-utility criteria size a decision together with its cost [sec-power-criteria]. The power calculation is the posterior probability criterion with a point-mass design prior and a flat analysis prior [sec-power-criteria].

## In the book

At $\theta = 0.3$ (a point-mass design prior) and a flat analysis prior, 90% power needs 234 per arm [sec-power-criteria]. Under the design prior $N(0.3, 0.1^2)$ the assurance at 234 per arm is only 0.81 [sec-power-criteria]. With a flat analysis prior the ALC reduces to $n \ge 2(3.92\sigma/\ell)^2$ [sec-power-criteria]. If the informative prior is also the analysis prior, the prior alone gives $\Pr(\theta > 0) = \Phi(3) = 0.9987$, so the trial is unnecessary for an analyst holding it [sec-power-criteria]. In the lupus example, 50% on control and a hoped-for 25% on treatment needs 77 per arm by power. An estimation-based width of 0.3 gives 75 per arm [sec-power-lupus].

## Pitfalls

The criteria take their inputs from the design prior, so a sensitivity analysis applies. A smaller trial buys feasibility and costs the guarantee of a decision [sec-power-lupus]. For a confirmatory trial the regulator still asks for the operating characteristics of the final analysis [sec-power-criteria].

## Check yourself

- Q: Which criterion needs no design prior when the variance is known? A: The average length criterion [sec-power-criteria].
- Q: How does a power calculation appear among these criteria? A: As the posterior probability criterion with a point-mass design prior and a flat analysis prior [sec-power-criteria].
