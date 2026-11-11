---
id: beta-prior
name: Beta prior
type: concept
aliases: [Beta distribution, Beta family]
level: 1
summary: The convenient family of priors for a probability, Beta(a, b), with mean a/(a+b); Beta(1,1) is flat.
chapters: ['6', '8']
home: sec-beta
sections: [sec-ess, 6/pfizer-biontech-bnt162b2-phase-3-c4591001]
prerequisites: [posterior-distribution]
related:
- {rel: generalizes, to: conjugate-prior}
- {rel: used-in, to: bnt162b2-trial}
- {rel: uses, to: effective-sample-size}
equations: [eq-conjugate]
functions: [beta_post, grid_update]
results: []
lab: [01-prior-posterior]
cites: [bartlett1985]
---
## What it is
The convenient family of priors for a probability is the Beta distribution, $\theta \sim \mathrm{Beta}(a, b)$, with density proportional to $\theta^{a-1}(1-\theta)^{b-1}$ on $[0,1]$ and mean $a/(a+b)$. [sec-beta]

Beta(1,1) is flat: every value of $\theta$ is equally believable. Beta(2,2) is a gentle bell centered at one half. Larger $a$ and $b$ give narrower bells. [sec-beta]

## Why it matters
The binomial likelihood has the same algebraic form as the Beta density, so the update is addition: [sec-beta]

$$
\theta \sim \mathrm{Beta}(a, b), \quad h \text{ heads}, \; t \text{ tails} \quad\Longrightarrow\quad \theta \mid y \sim \mathrm{Beta}(a + h,\; b + t).
$$

The prior is worth $a + b$ patients, so the flat Beta(1,1) is worth two and Beta(30,70) is worth one hundred. [sec-ess]

## In the book
With 7 heads in 10 tosses, the Beta(2,2) prior gives Beta(9,5) with mean $9/14 = 0.643$. The flat prior gives Beta(8,4) with mean $0.667$. The traditional estimate is 0.70. [sec-beta]

In Bartlett's 1985 ECMO trial all 11 newborns assigned to ECMO survived. With a flat prior the posterior is Beta(12, 1). [sec-beta]

The BNT162b2 trial used the prior Beta(0.700102, 1), a prior of real shape and almost no weight. [sec-ess]

## Pitfalls
Two descriptions are in use: Beta(a,b) as $a-1$ prior responders, or as $a+b$ pseudo-observations. They differ by the two pseudo-observations of the flat prior. [sec-beta]

## Check yourself
- Q: Prior Beta(2,2), then 7 heads and 3 tails. What is the posterior? A: Beta(9,5). [sec-beta]
- Q: What is the mean of Beta(a,b)? A: $a/(a+b)$. [sec-beta]
