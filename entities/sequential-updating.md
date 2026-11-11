---
id: sequential-updating
name: Sequential updating
type: concept
aliases: [posterior today is the prior tomorrow]
level: 2
summary: Applying Bayes rule batch by batch gives the same posterior as using all the data at once, whatever path the data took.
chapters: ['6']
home: sec-updating
sections: [6/looking-does-not-change-the-posterior]
prerequisites: [posterior-distribution, exchangeability]
related:
- {rel: uses, to: conjugate-prior}
equations: [eq-sequential]
functions: [sim_sequential_looks]
results: []
lab: [07-interim-looks]
cites: [berger1988likelihood, berger1985, edwards1963bayesian]
---
## What it is
When data arrive in batches $y_1$ and then $y_2$, Bayes' rule can be applied twice. The first posterior becomes the prior for the second batch: [sec-updating]

$$
\pi(\theta \mid y_1, y_2) \;\propto\; p(y_2 \mid \theta)\, \pi(\theta \mid y_1) \;\propto\; p(y_2 \mid \theta)\, p(y_1 \mid \theta)\, \pi(\theta),
$$

provided $y_1$ and $y_2$ are conditionally independent given $\theta$. [sec-updating] The last form is the posterior from all data at once. The path by which data arrived does not matter. [sec-updating]

## Why it matters
For conjugate models the update is a running total, so interim posteriors cost a handful of arithmetic operations and a Data Monitoring Committee can have them at any time. [sec-updating]

## In the book
With 100 patients in four batches of 25, starting from a flat prior, the four-step posterior is Beta(46, 56), the same as the one-step posterior. [sec-updating]

A simulation of five looks at 50 patients per arm shows two statements at once. The frequentist rejection rate across looks is above the nominal 0.025. The Bayesian posterior at stopping is right on average when truth is drawn from the analysis prior. [6/looking-does-not-change-the-posterior]

## Pitfalls
- A valid posterior at every look does not make looks free: a threshold right at one look must be raised, or looks limited, to hold type I error at 0.025. [6/looking-does-not-change-the-posterior]
- If true effects are not drawn from the analysis prior, the posterior at stopping is not calibrated to anything in the real world. [6/looking-does-not-change-the-posterior]
- The likelihood principle removes only the conceptual objection that Bayesian inference does not know about the looks. [6/looking-does-not-change-the-posterior]

## Check yourself
- Q: Does updating by patient, by batch or all at once change the posterior? A: No, the posterior is the same. [sec-updating]
- Q: Does looking change the posterior? A: No, but it changes the type I error of the stopping rule. [6/looking-does-not-change-the-posterior]
