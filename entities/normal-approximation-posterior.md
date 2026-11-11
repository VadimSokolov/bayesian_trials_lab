---
id: normal-approximation-posterior
name: Normal approximation to the posterior
type: method
aliases: [normal approximation]
level: 2
summary: Turn a reported estimate and 95 percent interval into a normal likelihood on the log scale, combine it with a normal prior and read posterior probabilities at chosen thresholds.
chapters: ['22']
home: sec-reanalyses-normal
sections: [sec-reanalyses, sec-reanalyses-andromeda, sec-cases-surpass]
prerequisites: [normal-normal-model, prior-distribution]
related:
- {rel: uses, to: skeptical-prior}
- {rel: uses, to: enthusiastic-prior}
- {rel: uses, to: effective-sample-size}
equations: [eq-re-se, eq-re-post]
functions: [reanalysis_normal, normal_update]
results: []
lab: [15-reading-bayesian-trials, 01-prior-posterior]
cites: [spiegelhalter1994bayesian, freedman1983subjective, parmar1994chart]
---

## What it is
Let $\hat\theta$ be the estimate on the log scale and $s$ its standard error. [sec-reanalyses-normal]
A reported 95 percent interval $(\ell, u)$ gives
$$
s = \frac{\log u - \log \ell}{2 \times 1.96}.
$$
[sec-reanalyses-normal]
With a normal prior $\theta \sim N(m_0, s_0^2)$, the posterior is normal with precision equal to the sum of the precisions and mean equal to the precision-weighted average. [sec-reanalyses-normal]
$$
\frac{1}{s_1^2} = \frac{1}{s^2} + \frac{1}{s_0^2},
\qquad
m_1 = s_1^2\left(\frac{\hat\theta}{s^2} + \frac{m_0}{s_0^2}\right).
$$

## Why it matters
Write $\theta = -\log RR$ so that positive means benefit; then for a threshold $\theta^\ast$, $\Pr(\theta > \theta^\ast \mid \text{data}) = \Phi((m_1 - \theta^\ast)/s_1)$. [sec-reanalyses-normal]
The prior is worth $s^2/s_0^2$ trials of the present size, so a prior with $s_0 = s$ counts as much as the trial itself. [sec-reanalyses-normal]

## In the book
A skeptical prior is centered at no effect with enough spread that a large benefit is unlikely a priori, an enthusiastic prior is centered at the effect the trial was designed to detect, and a reference prior is flat. [sec-reanalyses-normal]
The family follows Spiegelhalter and colleagues, and elicited skeptical priors have an earlier statement in Freedman and Spiegelhalter, with the CHART trials as the worked example. [sec-reanalyses-normal]
A positive trial is convincing when it persuades the skeptic, and a negative trial when it discourages the enthusiast. [sec-reanalyses-normal]
For ANDROMEDA-SHOCK the interval 0.55 to 1.02 gives the log hazard ratio and its standard error. [sec-reanalyses-andromeda]
The book reduces SURPASS-CVOT and REWIND the same way, from published intervals. [sec-cases-surpass]

## Pitfalls
The approximation is on the stated effect scale and the book's numbers are not replications of published odds-ratio analyses. [sec-reanalyses-andromeda]
Ratios are reported back on their natural scale. [sec-reanalyses-normal]

## Check yourself
- Q: A prior has $s_0 = s$. How much is it worth? A: As much as the trial itself. [sec-reanalyses-normal]
- Q: How do you get $s$ from a 95 percent interval? A: Divide the difference of the log limits by $2 \times 1.96$. [sec-reanalyses-normal]
