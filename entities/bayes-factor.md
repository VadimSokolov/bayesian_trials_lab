---
id: bayes-factor
name: Bayes factor
type: concept
aliases: [BF]
level: 2
summary: The ratio of the probabilities that the alternative and the null assigned to the observed data, which turns prior odds into posterior odds.
chapters: ['7', '12', '13']
home: sec-evidence-bf
sections: [sec-evidence-gaussian, sec-evidence-lindley, sec-evidence-together]
prerequisites: [prior-distribution, likelihood]
related:
- {rel: contrasts-with, to: p-value}
- {rel: contrasts-with, to: posterior-probability-of-benefit}
- {rel: generalizes, to: likelihood-ratio}
equations: [eq-bf-odds, eq-bf-gauss]
functions: [bf10_normal, posterior_null]
results: []
lab: [02-p-values]
cites: [polson2026bayesstandard, schwarz1978estimating]
---

## What it is

The Bayes factor measures the evidence in the data for one hypothesis against another. For a null $H_0:\theta = 0$ and an alternative with prior $\pi(\theta)$ [sec-evidence-bf]:

$$
\mathrm{BF}_{10} \;=\; \frac{p(y \mid H_1)}{p(y \mid H_0)} \;=\; \frac{\int p(y \mid \theta)\,\pi(\theta)\,d\theta}{p(y \mid \theta = 0)},
$$

$$
\underbrace{\frac{\Pr(H_1 \mid y)}{\Pr(H_0 \mid y)}}_{\text{posterior odds}} \;=\; \mathrm{BF}_{10} \times \underbrace{\frac{\pi_a}{\pi_0}}_{\text{prior odds}},
$$

the second being eq-bf-odds [sec-evidence-bf]. It weighs the data against both hypotheses and averages the likelihood over the prior, which is where its penalty for vague alternatives comes from [sec-evidence-bf].

## Why it matters

The p-value says nothing about how well an alternative explains the data. The Bayes factor does, but it needs a prior under the alternative [sec-evidence-together]. With a normal alternative $N(0,\tau^2)$ and $k = I_n\tau^2$ the integral is closed form:

$$
\mathrm{BF}_{10} \;=\; (1 + k)^{-1/2} \exp\!\left\{\tfrac12 Z_n^2 \,\frac{k}{1+k}\right\}, \qquad 2 \log \mathrm{BF}_{10} \;=\; Z_n^2 \,\frac{k}{1+k} \;-\; \log(1+k).
$$

This is eq-bf-gauss, the finite-sample version of the Schwarz criterion [sec-evidence-gaussian].

## In the book

With $\tau = 0.25$ and $I_n = 400$ the penalty is 3.26, so the Bayes factor reaches 1 only near $|Z_n| \approx 1.8$, where the one-sided p-value is 0.036 [sec-evidence-gaussian]. See [[ockham-penalty]] and [[lindleys-paradox]].

## Pitfalls

The answer depends on the prior scale $\tau$. Choosing $\tau$ after seeing the data is as open to abuse as choosing the test statistic afterward, so pre-specify it [sec-evidence-lindley]. Sources sometimes write the ratio the other way up as $\mathrm{BF}_{01}$, its reciprocal [sec-evidence-bf].

## Check yourself

- Q: What turns prior odds into posterior odds? A: Multiplication by the Bayes factor [sec-evidence-bf].
- Q: Why does a vague alternative lower the Bayes factor? A: It spends prior mass on effects the data rule out [sec-evidence-gaussian].
