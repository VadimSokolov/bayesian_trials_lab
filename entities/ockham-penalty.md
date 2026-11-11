---
id: ockham-penalty
name: Ockham penalty
type: concept
aliases: [Lindley information]
level: 2
summary: The automatic charge a Bayes factor makes for a flexible alternative, growing like the logarithm of the information in the trial.
chapters: ['7']
home: sec-evidence-gaussian
sections: [sec-evidence-lindleyinfo, sec-evidence-twobars, sec-evidence-jeffreys]
prerequisites: [bayes-factor]
related: []
equations: [eq-ockham]
functions: []
results: []
lab: []
cites: [lindley1956information, polson2026bayesstandard]
---

## What it is

The Ockham penalty is the charge a Bayes factor makes for an alternative that is flexible. Take the alternative $\theta \sim N(0,\tau^2)$, centered at no effect. For large $k = I_n\tau^2$ the Bayes factor reads [sec-evidence-gaussian]:

$$
2 \log \mathrm{BF}_{10} \;\approx\; \underbrace{Z_n^2}_{\text{fit}} \;-\; \underbrace{\log(1+I_n\tau^2)}_{L_n,\ \text{Ockham penalty}}.
$$

This is eq-ockham. The first term is how well the best-fitting alternative explains the data. The second is a charge for flexibility [sec-evidence-gaussian].

## Why it matters

An alternative that spreads its prior over a wide range gives most of it to effects the data rule out, so it predicts the data worse than a sharp alternative. The more information, the larger the wasted share, and the penalty grows like $\log I_n$ [sec-evidence-gaussian].

## In the book

With $\tau = 0.25$ and $I_n = 400$ the penalty is $L_n = \log(26) = 3.26$ [sec-evidence-gaussian]. The Bayes factor reaches 1 only at $|Z_n| \approx 1.8$, a one-sided p-value of 0.036. [sec-evidence-gaussian] Lindley defined the information in an experiment as the mutual information between $\theta$ and the data. For a normal mean it is $\tfrac12\log(1 + q)$, half the penalty [sec-evidence-lindleyinfo]. Each quadrupling of the trial adds about one bit [sec-evidence-lindleyinfo].

## Pitfalls

The penalty belongs to a point null with a diffuse alternative. Against an interval null the penalties can cancel, and no general growth rate is claimed [sec-evidence-jeffreys].

## Check yourself

- Q: If the trial quadruples in size, what happens to the information it delivers about $\theta$? A: It grows by about one bit [sec-evidence-lindleyinfo].
- Q: What does the penalty do to the Bayes factor as $I_n$ grows? A: It lowers it, and the amount grows like $\log I_n$ [sec-evidence-gaussian].
