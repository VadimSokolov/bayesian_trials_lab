---
id: normal-normal-model
name: Normal-normal model
type: method
aliases: [normal normal model, normal-normal conjugacy]
level: 2
summary: A normal prior and a normal likelihood on the log hazard ratio give a normal posterior whose precision is the sum of the two precisions.
chapters: ['6', '22']
home: sec-normal-normal
sections: [sec-bayes-summary]
prerequisites: [conjugate-prior, log-hazard-ratio]
related:
- {rel: uses, to: effective-sample-size}
- {rel: generalizes, to: z-test}
equations: [eq-normal-normal, eq-loghr-lik]
functions: [normal_update]
results: []
lab: []
cites: []
---
## What it is
With prior $\theta \sim N(m_0, \tau^2)$ and the likelihood $\hat\theta \mid \theta \sim N(\theta, 4/d)$, the posterior is normal: [sec-normal-normal]

$$
\theta \mid \hat\theta \;\sim\; N\!\left(m_1, s_1^2\right), \quad
\frac{1}{s_1^2} = \frac{1}{\tau^2} + \frac{d}{4}, \quad
m_1 = \frac{m_0/\tau^2 + \hat\theta\, d/4}{1/\tau^2 + d/4}.
$$

## Why it matters
This is the weighted average of the Beta-binomial case with weights given by precision. The data have precision $d/4$, a prior has $1/\tau^2$, and the prior's effective sample size in events is $4/\tau^2$. A $N(0, 0.2^2)$ prior is worth 100 events and $N(0, 0.35^2)$ about 33. [sec-normal-normal]

## In the book
A trial observes $d = 200$ events and $\widehat{\mathrm{HR}} = 0.74$, so $\hat\theta = 0.30$ with standard error $0.141$, $z = 2.12$ and one-sided p-value $0.017$. [sec-normal-normal]

With a flat prior, $\Pr(\theta > 0) = 0.983$, exactly one minus the p-value. With the skeptical prior of 33 events the posterior mean is 0.258 (HR 0.77) and the probability is 0.975. With the strong prior of 100 events it is 0.958. [sec-normal-normal]

## Pitfalls
The likelihood is an approximation, a modeling choice and not an exact result. It treats $\hat\theta$ as sufficient, which holds only approximately for a Cox model, and ignores the discreteness of event times. [sec-normal-normal]

At a threshold of 0.975 the first prior passes, the second only in the fourth decimal, and the third fails, so the prior must be specified before the data. [sec-normal-normal]

## Check yourself
- Q: What is the ESS in events of a $N(0, 0.2^2)$ prior? A: $4/\tau^2 = 100$ events. [sec-normal-normal]
- Q: With a flat prior, how does $\Pr(\theta > 0)$ relate to the one-sided p-value? A: It equals one minus the p-value exactly. [sec-normal-normal]
