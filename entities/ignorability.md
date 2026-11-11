---
id: ignorability
name: Ignorability of assignment
type: concept
aliases: [ignorability, ignorable assignment mechanism]
level: 3
summary: When assignment depends only on recorded data, the posterior for the effect can be computed from the outcome model alone, and randomization guarantees it.
chapters: ['5']
home: 5/ignorability-of-the-assignment-mechanism
sections: [sec-randomization-bayesian, 5/the-bayesian-arguments-for-randomizing]
prerequisites: [randomization, posterior-distribution]
related: []
equations: [eq-ignorable]
functions: []
results: []
lab: []
cites: [rubin1978bayesian, kadane1990randomization, berry2006nrdd]
---
## What it is
Let $d_i$ be the arm, $x_i$ the recorded covariates and $y_i$ the outcome. Rubin showed that the posterior for $\theta$ can be computed from the outcome model alone if the assignment depends only on recorded data. Strictly, $\theta$ and the assignment parameters $\phi$ must also be independent a priori. Then the likelihood factorizes: [5/ignorability-of-the-assignment-mechanism]

$$
p(d, y \mid x, \theta, \phi) \;=\; \underbrace{p(d \mid x, \phi)}_{\text{assignment}} \;\times\; p(y \mid d, x, \theta),
$$

and the first factor drops out of the posterior of $\theta$. [5/ignorability-of-the-assignment-mechanism]

## Why it matters
If assignment depends on something unrecorded, such as a doctor's impression, the factorization fails and the posterior can be badly biased whatever the prior. Randomization makes the first factor a known constant. [5/ignorability-of-the-assignment-mechanism]

The book gives three Bayesian arguments for randomizing: Rubin's ignorability, the robustness argument of Kadane and Seidenfeld, and Berry's practical position. The Bayesian randomizes for credibility and robustness. [5/the-bayesian-arguments-for-randomizing]

## In the book
Response-adaptive randomization needs one more step, since assignment depends on earlier outcomes. If the assignment probabilities are known and depend on $\theta$ only through the recorded history, they can be omitted from the posterior. [5/ignorability-of-the-assignment-mechanism]

## Pitfalls
The Bayesian does not use the permutation distribution. What randomization buys is the factorization with a known assignment factor. [sec-randomization-bayesian] Under confounding, more data concentrate the posterior around the wrong value. [sec-randomization-bayesian]

## Check yourself
- Q: What does randomization do to the assignment factor? A: It makes it a known constant, because the coin ignores everything. [5/ignorability-of-the-assignment-mechanism]
- Q: Why does the Kadane and Seidenfeld argument favor randomizing? A: It yields an analysis whose validity does not depend on one person's beliefs about unmeasured determinants. [5/the-bayesian-arguments-for-randomizing]
