---
id: posterior-probability-of-benefit
name: Posterior probability of benefit
type: concept
aliases: [probability of benefit]
level: 2
summary: The posterior probability that the treatment effect exceeds a threshold a, the quantity in the FDA draft's Bayesian success criterion.
chapters: ['7', '22']
home: sec-evidence-posterior
sections: [sec-evidence-fdacriterion, sec-evidence-flat, sec-evidence-mapping, sec-evidence-informativeprior, 7/a-worked-comparison]
prerequisites: [posterior-distribution, p-value]
related:
- {rel: governed-by, to: fda-bayesian-draft-guidance-2026}
- {rel: contrasts-with, to: bayes-factor}
- {rel: used-in, to: eolia-trial}
equations: [eq-fda, eq-alpha-ac]
functions: [calibrate_c_flat, type1_posterior_flat, calibrate_c_normal, power_posterior_normal, type1_posterior_normal, prob_superior]
results: []
lab: [02-p-values, 15-reading-bayesian-trials]
cites: [fda_bayesian_2026, harrell2001full]
---

## What it is

The January 2026 FDA draft describes the standard Bayesian success criterion [sec-evidence-fdacriterion]:

$$
\Pr(\delta > a \mid \text{data}) \;>\; c,
$$

which is eq-fda. The threshold $a$ says how big an effect counts, and $c$ says how sure one must be [sec-evidence-fdacriterion].

## Why it matters

With a flat prior and $a = 0$, the posterior probability is one minus the one-sided p-value, so $c = 0.975$ succeeds exactly when $Z_n > 1.96$ [sec-evidence-flat]. With a flat prior the type I error at no effect is $\alpha(a, c) = 1 - \Phi(a/s + z_c)$ [sec-evidence-mapping]. A skeptical prior raises the bar on the estimate [sec-evidence-informativeprior].

## In the book

With s = 0.10 and $a = 0.10$, the rule $c = 0.975$ has type I error 0.0015, and the calibrating $c$ falls to 0.83 [sec-evidence-mapping]. With skeptical priors of 0.2 and 0.1, the type I error at $c = 0.975$ falls to 0.014 and 0.003 and power falls to 0.79 and 0.59 from 0.85 [sec-evidence-informativeprior]. In a worked trial with estimate 0.28 and s = 0.10, the probability of benefit is 0.9974. The probability the effect exceeds 0.10 is 0.964, which clears $c = 0.95$ but not 0.975 [7/a-worked-comparison].

## Pitfalls

The pair $(a, c)$ means nothing until attached to a sample size and a model [sec-evidence-mapping]. Calibrating at $\theta = 0$ establishes superiority over zero, not benefit exceeding $a$ [sec-evidence-mapping].

## Check yourself

- Q: With a flat prior and a = 0, what c matches one-sided alpha 0.025? A: c = 0.975 [sec-evidence-mapping].
- Q: Does a calibrated criterion with a skeptical prior beat the z test at a single look? A: No, it has the same type I error and about the same power [sec-evidence-informativeprior].
