---
id: effective-sample-size
name: Effective sample size
type: concept
aliases: [ESS, prior effective sample size]
level: 2
summary: The number of observations whose information about the parameter equals the prior's, turning an argument about the prior into one about patients.
chapters: ['8', '6', '19', A]
home: sec-priors-ess
sections: [sec-priors-three, sec-priors-bnt, sec-priors-protocol]
prerequisites: [prior-distribution, beta-prior]
related:
- {rel: used-in, to: bnt162b2-trial}
equations: [eq-ess-beta, eq-ess-normal]
functions: [ess_beta, ess_events]
results: []
lab: [16-bayesian-protocol]
cites: [morita2008, novick1965, polson2026bayesstandard]
---

## What it is

Morita, Thall and Müller defined the effective sample size of a prior as the number of observations whose information is equivalent to the prior's [sec-priors-ess]. For a Beta(a, b) prior,

$$
\mathrm{ESS} = a + b.
$$

For a normal prior $N(\mu_0, s_0^2)$ on the mean of observations with variance $\sigma^2$,

$$
\mathrm{ESS} = \frac{\sigma^2}{s_0^2}.
$$

These are eq-ess-beta and eq-ess-normal [sec-priors-ess]. For a log hazard ratio each event carries variance 4, so the ESS is $4/s_0^2$ events [sec-priors-ess].

## Why it matters

"A prior worth five patients in a trial of five hundred is a modelling choice; a prior worth two hundred is an assumption that needs defending" [sec-priors-ess]. Reviewers may disagree on the weight, but both sides can see what they disagree about [sec-priors-ess].

## In the book

A skeptical prior with $s_0 = 0.175$ is worth 131 events, about 26 percent of the information in a 508-event trial [sec-priors-ess]. The BNT162b2 prior Beta(0.700102, 1) has an ESS of 1.7 cases, against a final analysis planned at 164 cases [sec-priors-bnt].

## Pitfalls

ESS summarizes a prior's variance, not its location. A prior can be small in ESS and still decisive at a decision boundary, so report ESS beside a sensitivity analysis [sec-priors-ess]. For a mixture prior the ESS moves with the data, so the FDA draft asks for it over the plausible range of outcomes [sec-priors-ess]. Under the Novick and Grizzle convention the ESS differs from $a+b$ by 2 [sec-priors-ess].

## Check yourself

- Q: What is the ESS of a Beta(3, 7) prior? A: 10 [sec-priors-ess].
- Q: What is the ESS in events of a normal prior with $s_0 = 0.175$ on the log hazard ratio? A: About 131 events [sec-priors-ess].
