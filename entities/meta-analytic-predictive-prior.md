---
id: meta-analytic-predictive-prior
name: Meta-analytic-predictive prior
type: method
aliases: [MAP prior, MAP]
level: 2
summary: A prior for a new trial control parameter, taken as the predictive distribution from a random-effects meta-analysis of several historical control arms.
chapters: ['19']
home: sec-borrowing-map
sections: [sec-borrowing-map, sec-borrowing-ess]
prerequisites: [hierarchical-model, posterior-predictive-distribution]
related:
- {rel: alternative-to, to: power-prior}
- {rel: generalizes, to: robust-mixture-prior}
- {rel: part-of, to: bayesian-borrowing}
equations: [eq-hier]
functions: [borrow_map_prior]
results: []
lab: [09-adaptive-bayesian]
cites: [neuenschwander2010map, weber2021rbest, schmidli2013nmap]
---
## What it is

The meta-analytic-predictive (MAP) prior of Neuenschwander and colleagues (2010) runs a random-effects meta-analysis of the historical control rates, using the hierarchical model (eq-hier), and takes the predictive distribution of the control parameter in a new trial as the prior. [sec-borrowing-map] The predictive distribution is wider than the meta-analytic mean because it includes the between-trial variation $\tau_b$. [sec-borrowing-map] The hierarchical model for $K$ groups is:

$$
y_k \mid p_k \sim \mathrm{Binomial}(n_k,p_k),\qquad \mathrm{logit}\,p_k \mid \mu,\tau_b \sim N(\mu,\tau_b^2),\qquad (\mu,\tau_b)\sim \pi(\mu,\tau_b).
$$

This is eq-hier. [sec-borrowing-map]


## Why it matters

A MAP prior does not become more informative than the heterogeneity warrants, however many historical patients there are. [sec-borrowing-map]

## In the book

Four illustrative historical control arms of 80, 100, 70 and 150 patients (400 in total) give a normal-normal model on the logit scale with a half-normal prior with scale 0.5 on $\tau_b$. The predictive distribution is converted to a Beta prior by matching mean and variance. [sec-borrowing-map] The pooled analysis that ignores between-trial variation would claim an effective sample size of 402, while the MAP prior is worth far fewer patients. That difference is the number a regulator can ask for. [sec-borrowing-map] The R package RBesT fits MAP priors by MCMC and approximates them by mixtures of conjugate distributions, while the chapter uses a simpler approximation from `bayestrials`. [sec-borrowing-map]

## Pitfalls

A MAP prior is still an exchangeability assumption. If standard of care changed or the population is different, it is confidently wrong. [sec-borrowing-map] The robust MAP prior adds a vague component for protection. [sec-borrowing-map]

## Check yourself

- Q: Why is a MAP prior worth less than the pooled count of patients? A: It includes between-trial variation. [sec-borrowing-map]
- Q: When is a MAP prior confidently wrong? A: When the new trial differs systematically from the historical ones. [sec-borrowing-map]
