---
id: log-hazard-ratio
name: Log hazard ratio
type: concept
aliases: [negative log hazard ratio]
level: 2
summary: The scale on which a hazard ratio is modeled, with estimate standard error about 2 over the square root of the total events under 1:1 randomization.
chapters: ['6', '18']
home: sec-normal-normal
sections: [sec-bayes-summary]
prerequisites: [hazard-ratio]
related:
- {rel: uses, to: cox-model}
equations: [eq-loghr-lik]
functions: [normal_update]
results: []
lab: []
cites: []
---
## What it is
In trials with a time-to-event endpoint, the treatment effect is a hazard ratio and the Beta-binomial model does not apply. The normal-normal model works on the log scale. [sec-normal-normal]

For 1:1 randomization with $d$ total events, the log hazard ratio estimate has standard error about $2/\sqrt{d}$. Each arm contributes about $d/2$ events, and the variance is about $1/d_1 + 1/d_0 = 4/d$. [sec-normal-normal]

With $\theta = -\log \mathrm{HR}$, so a positive $\theta$ means benefit: [sec-normal-normal]

$$
\hat\theta \mid \theta \;\sim\; N\!\left(\theta,\; \frac{4}{d}\right).
$$

## Why it matters
The logrank test is, to a good approximation, the z test $z = \hat\theta \sqrt{d} / 2$, and the number of events, not patients, is the sample size in both frameworks. [sec-normal-normal]

## In the book
With $d = 200$ events and $\widehat{\mathrm{HR}} = 0.74$, $\hat\theta = 0.30$ and the standard error is 0.141. [sec-normal-normal] The approximation is the standard route of Bayesian design in survival studies. [sec-normal-normal]

## Pitfalls
The Cox partial likelihood is only close to normal in large samples. The approximation is a modeling choice, and a final analysis that wants the exact likelihood can use a piecewise exponential model. [sec-normal-normal]

## Check yourself
- Q: What is the standard error of the log hazard ratio with 200 events? A: $2/\sqrt{200} = 0.141$. [sec-normal-normal]
- Q: Why use $\theta = -\log \mathrm{HR}$? A: So that a positive value means benefit. [sec-normal-normal]
