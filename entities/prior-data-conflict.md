---
id: prior-data-conflict
name: Prior-data conflict
type: concept
aliases: [prior data conflict]
level: 3
summary: The case where the data disagree with an informative prior, which a single normal prior handles badly and a robust mixture prior handles by shifting weight.
chapters: ['8', '19']
home: sec-priors-conflict
sections: [sec-priors-belimumab, sec-priors-ess]
prerequisites: [prior-distribution, posterior-distribution]
related:
- {rel: uses, to: robust-mixture-prior}
- {rel: used-in, to: belimumab-pediatric-lupus}
equations: []
functions: [mixture_posterior, normal_update]
results: []
lab: [16-bayesian-protocol]
cites: [schmidli2014robust]
---

## What it is

A prior-data conflict is a disagreement between an informative prior and the observed data. The effect scale here is $\theta = -\log \mathrm{HR}$, so benefit is positive. [sec-priors-conflict] Suppose the prior is informative and well justified, and the data disagree. A single normal prior compromises by precision however far apart they are [sec-priors-conflict]. The FDA draft recommends that sponsors examine prior-data conflict and not assume it away [sec-priors-conflict].

## Why it matters

The standard defense is a robust mixture prior, an informative component combined with a weakly informative one [sec-priors-conflict]. For example, $0.8\, N(0.29, 0.10^2) + 0.2\, N(0, 1)$ is an 80 percent chance that the effect looks like the phase 2 estimate and a 20 percent chance that nothing is known [sec-priors-conflict]. After the data the weights update, and the component that predicted better gains weight [sec-priors-conflict]. Schmidli and colleagues developed this construction for historical controls [sec-priors-conflict].

## In the book

When the observed effect is $\hat\theta = -0.20$ on the $-\log$ HR scale (a hazard ratio of 1.22, harm), the pure informative prior still reports a positive posterior mean, while the mixture moves weight to the vague component and follows the data [sec-priors-conflict]. The FDA applied the construction in the pediatric belimumab trial in lupus [sec-priors-belimumab].

## Pitfalls

The weight 0.2 on the vague component is itself a prior judgment. Type I error when the informative prior is wrong, and the extra patients needed, must be simulated [sec-priors-conflict]. The mixture's ESS depends on what the data do [sec-priors-ess].

## Check yourself

- Q: What does a mixture prior do when data contradict its informative part? A: Its posterior weight moves to the vague component and the posterior follows the data [sec-priors-conflict].
- Q: Does a single normal prior notice conflict? A: No, it compromises by precision however far apart they are [sec-priors-conflict].
