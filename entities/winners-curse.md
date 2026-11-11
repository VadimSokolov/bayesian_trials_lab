---
id: winners-curse
name: Winner's curse
type: concept
aliases: []
level: 2
summary: The largest of several observed effects is on average too large because it was selected as the largest, and shrinkage corrects it.
chapters: ['10']
home: 10/a-numerical-illustration-the-winners-curse
sections: [10/a-numerical-illustration-the-winners-curse, sec-mult-shrinkage, 10/the-idea, 10/a-large-trial-with-many-subgroups-recovery]
prerequisites: [shrinkage, forking-paths]
related:
- {rel: part-of, to: multiplicity}
- {rel: uses, to: truncated-trial-bias}
equations: []
functions: []
results: []
lab: []
cites: []
---

## What it is

The largest of $k$ observed effects is on average too large, because it was selected as the largest. A hierarchical estimate pulls it back toward the mean by about the right amount. [10/the-idea]

## Why it matters

The correction for selection is an estimate that is smaller and more honest, not a harder test applied to an estimate that is still biased. [10/a-numerical-illustration-the-winners-curse]

## In the book

Six arms have true effects drawn from $N(0, 0.2^2)$ on the log odds scale, each estimated with standard error 0.28. The trial reports the arm with the largest observed effect. [10/a-numerical-illustration-the-winners-curse]

The raw estimate of the selected arm is too high on average, while the shrunken estimate has no average bias and a smaller root mean squared error. [10/a-numerical-illustration-the-winners-curse]

The same logic applies to the RECOVERY subgroups: estimates move toward the overall effect in proportion to how little information each carries. [10/a-large-trial-with-many-subgroups-recovery]

## Pitfalls

- In the simulation the true between-arm spread was known. In a real trial it is estimated, which adds uncertainty, and the model is only as good as its exchangeability assumption. [10/a-numerical-illustration-the-winners-curse]
- A related effect appears at early stops: the estimate after an early stop is biased away from the null. [10/the-idea]

## Check yourself

- Q: Does the raw estimate of the best-looking arm tend to be too high or too low? A: Too high. [10/a-numerical-illustration-the-winners-curse]
- Q: What does the book say fixes it? A: A smaller, shrunken estimate, not a harder test. [10/a-numerical-illustration-the-winners-curse]
