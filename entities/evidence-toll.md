---
id: evidence-toll
name: Evidence toll
type: concept
aliases: [three tolls, tolls]
level: 3
summary: 'The three bars on the squared standardized score: a constant for a fixed level, log n for a Bayes rule, and log n plus 2 log(1/alpha) for an anytime-valid rule.'
chapters: ['11', '7', '12']
home: 11/the-three-tolls
sections: [11/the-three-tolls, 11/the-seventy-percent-result, 11/four-boundaries-compared]
prerequisites: [deviation-scale, bayes-factor, villes-inequality]
related:
- {rel: uses, to: ockham-penalty}
- {rel: uses, to: large-deviation}
equations: [eq-tolls, eq-excess, eq-seventy]
functions: [gs_tolls]
results: [evidence_tolls_three_scales]
lab: []
cites: [polson2026evaluesbayesrisk, ville1939etude]
---

## What it is

With $L_n = \log(1 + I_n\tau^2)$ and $q = I_n\tau^2$, the three calibrations act, for a one-sided claim with $Z_n > 0$, when the following holds. [11/the-three-tolls]

$$
\begin{aligned}
&\text{fixed level } \alpha: && Z_n \ge z_\alpha,\\
&\text{Bayes, threshold } b: && Z_n^2 \ge \Bigl(1 + \tfrac{1}{q}\Bigr)\{\log(1+q) + 2\log b\} \approx L_n + 2\log b,\\
&\text{anytime valid } \alpha: && Z_n^2 \ge \Bigl(1 + \tfrac{1}{q}\Bigr)\{\log(1+q) + 2\log(1/\alpha)\} \approx L_n + 2\log(1/\alpha).
\end{aligned}
$$

[11/the-three-tolls]

## Why it matters

The anytime-valid rule requires about $2\log(1/\alpha)(1 + 1/q)$ more than the Bayes rule at $b = 1$, approximately the constant 7.38 at large information. [11/the-three-tolls]

## In the book

A fixed-level test asks for 1.96 however much information there is, so its squared bar is $z_\alpha^2 = 3.84$. The Bayes bar with $b = 1$ is below the unadjusted bar at small information but overtakes 1.96 once $L_n$ exceeds 3.84, asymptotically for $I_n \tau^2 > 46$. The exact bar of the stated mixture crosses 1.96 at $q \approx 41.6$. [11/the-three-tolls]

The seventy percent result: the excess is $n_{\mathrm{LD}} - n_{\mathrm{MD}} \approx 2\log(1/\alpha)/\theta^2$, and relative to the fixed-sample requirement it is $7.38/10.51 \approx 0.70$ at $\alpha = 0.025$ and 90 percent power. [11/the-seventy-percent-result]

## Pitfalls

- The 70 percent figure compares boundary terms asymptotically and is not an exact sample-size identity. Calibration narrows the realized gap. [11/the-seventy-percent-result]
- The Bayesian saving is not a saving against a single unadjusted look once past the crossing point. The saving comes from monitoring and prior information. [11/the-three-tolls]
- Because the ratio tends to one only as $1/\log n$, the additive excess never shrinks. [11/the-seventy-percent-result]

## Check yourself

- Q: What is the constant surcharge at alpha 0.025? A: $2\log 40 = 7.38$ at large information. [11/the-three-tolls]
- Q: Does a calibrated Bayes rule pay the whole 70 percent? A: No, it has already paid part of the surcharge. [11/the-seventy-percent-result]
