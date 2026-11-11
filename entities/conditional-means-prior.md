---
id: conditional-means-prior
name: Conditional means prior
type: method
aliases: []
level: 3
summary: A prior built from beta statements about response probabilities at chosen covariate values, so a clinician specifies beliefs on the scale she can think on.
chapters: ['8']
home: sec-priors-cmp
sections: [8/flat-priors-on-logistic-coefficients, sec-priors-ess]
prerequisites: [beta-prior, prior-distribution]
related:
- {rel: alternative-to, to: noninformative-prior}
- {rel: uses, to: prior-elicitation}
equations: [eq-cmp]
functions: [cmp_samples]
results: []
lab: [16-bayesian-protocol]
cites: [bedrick1996, polson2026simbayes, hanson2014]
---

## What it is

Bedrick, Christensen and Johnson moved elicitation from the coefficient scale to the scale where beliefs exist. The investigator states priors for the response probability at several covariate values, and the prior on the coefficients is what those statements induce through the link [sec-priors-cmp]. For $p$ coefficients take $p$ independent beta priors $\tilde m_i \sim \mathrm{Beta}(a_{1i}, a_{2i})$; the induced prior is

$$
\pi(\beta) \propto \prod_{i=1}^{p} F(\tilde x_i' \beta)^{a_{1i} - 1}\,\bigl[1 - F(\tilde x_i' \beta)\bigr]^{a_{2i} - 1}\, f(\tilde x_i' \beta),
$$

which is eq-cmp [sec-priors-cmp].

## Why it matters

A clinician cannot say what the log-odds slope is, but can say what she expects at 10 mg and at 50 mg [sec-priors-cmp]. For the logistic link the prior is literally $a_{1i} + a_{2i}$ pseudo-patients, so its weight is countable [sec-priors-cmp].

## In the book

Expecting about 30 percent response at 10 mg and 70 percent at 50 mg, with the confidence of 10 patients each, gives Beta(3, 7) and Beta(7, 3), with $a_{1i} = \nu_i m_i$ and $a_{2i} = \nu_i(1 - m_i)$ [sec-priors-cmp]. The default $N(0, 10^2)$ puts nearly all its mass at the extremes [sec-priors-cmp]. The ESS is $\nu_i$ at each design point, here 10 at each of two doses [sec-priors-ess].

## Pitfalls

Independent beta statements at two doses do not enforce a monotone dose-response. If monotonicity is required, constrain the ordered probabilities or the slope [sec-priors-cmp]. The same belief gives different coefficient priors under logit and probit links [sec-priors-cmp].

## Check yourself

- Q: With 30 percent expected response and prior sample size 10 at a dose, what beta prior results? A: Beta(3, 7) [sec-priors-cmp].
- Q: Why can the ESS of this prior be counted exactly under a logistic link? A: It equals $a_{1i} + a_{2i}$ pseudo-patients [sec-priors-cmp].
