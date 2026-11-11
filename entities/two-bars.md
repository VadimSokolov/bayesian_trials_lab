---
id: two-bars
name: The two bars
type: concept
aliases: [Bayes factor bar, level bar]
level: 3
summary: A fixed-level test passes a constant bar on Z squared, while a Bayes rule passes a bar that grows with the logarithm of the information, and the two cross.
chapters: ['7', '11']
home: sec-evidence-twobars
sections: [sec-evidence-tolls, 7/what-this-means-for-the-protocol]
prerequisites: [ockham-penalty, z-test, type-i-error]
related:
- {rel: part-of, to: evidence-toll}
- {rel: precedes, to: surcharge}
equations: [eq-bayes-toll, eq-crossing]
functions: [bayes_bar, crossing_n]
results: [bayes_bar_crossing_46]
lab: []
cites: [polson2026bayesstandard]
---

## What it is

A fixed-level one-sided test acts when $Z_n^2$ passes a constant bar, 3.84 at one-sided alpha 0.025, whatever the sample size. A Bayes rule that acts when the alternative is at least as probable as the null passes a bar that grows with the log of the information [sec-evidence-twobars]:

$$
Z_n^2 \;\ge\; L_n + C, \qquad L_n \sim \log n, \qquad C = 2\log\frac{\pi_0}{\pi_a}.
$$

This is eq-bayes-toll. The constant $C$ is zero at equal prior odds and positive when the null is favored [sec-evidence-twobars].

## Why it matters

At small samples the Bayes bar is lower, at large samples higher [sec-evidence-twobars]. They cross where, with $C = 0$,

$$
n^\ast \;=\; e^{z_\alpha^2} \;=\; e^{3.84} \;\approx\; 46.
$$

This is eq-crossing. The exact Gaussian expression puts the crossing at $I_n\tau^2 = 41.6$ [sec-evidence-twobars]. So the claim that Bayesian trials need less evidence fails against a single unadjusted look [sec-evidence-twobars].

## In the book

For $\tau = 0.25$ on the log hazard ratio, the crossing corresponds to $I_n > 730$ and about 2,900 events (exactly 666 and about 2,660), the size of a large cardiovascular outcome trial [sec-evidence-twobars]. A third toll for monitoring raises the bar by about 7.38 at alpha 0.025 [sec-evidence-tolls].

## Pitfalls

The comparison is for the uncalibrated point-null rule with a symmetric normal alternative. A Bayesian bar calibrated to the same type I error is never lower at a single look without an informative prior [sec-evidence-twobars].

## Check yourself

- Q: Which bar is higher for a very large trial, the fixed-level test or the uncalibrated Bayes rule? A: The Bayes rule [sec-evidence-twobars].
- Q: Where do the bars cross for a unit-information prior? A: At about 46 observations, exactly 41.6 [sec-evidence-twobars].
