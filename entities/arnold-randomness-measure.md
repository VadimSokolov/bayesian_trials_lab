---
id: arnold-randomness-measure
name: Arnold's measure of randomness
type: method
aliases: [stochasticity parameter, Arnold's stochasticity parameter]
level: 3
summary: A geometric diagnostic that sums squared gaps between points on a circle to flag sequences that are too regular or too clumped to be random.
chapters: ['5']
home: 5/arnolds-measure-of-randomness
sections: [sec-randomization-randomness, 5/key-points]
prerequisites: [randomization]
related:
- {rel: contrasts-with, to: kolmogorov-complexity}
equations: [eq-arnold]
functions: [arnold_stochasticity]
results: []
lab: []
cites: [arnold2006forgotten]
---
## What it is
V. I. Arnold proposed a geometric way to judge how random a set of points on a circle looks. His measure asks whether the points are spread the way independent draws would be: evenly spaced points are too regular, and clumped points are too attracted to one another. [5/arnolds-measure-of-randomness]

Take $T$ points on a circle of length $L$. Let $x_1,\dots,x_T$ be the gaps between neighbors, so $\sum x_i = L$. The stochasticity parameter is the normalized sum of squared gaps: [5/arnolds-measure-of-randomness]

$$
s \;=\; T \sum_{i=1}^{T} \left(\frac{x_i}{L}\right)^{2}, \qquad 1 \le s \le T .
$$

## Why it matters
Evenly spaced points give $s = 1$, strong repulsion. All points in one place give $s = T$, strong attraction. For independent uniform points the expected value is $s_1 = 2T/(T+1)$, close to 2 for large $T$. [5/arnolds-measure-of-randomness]

A schedule from a linear congruential generator with a short period or poor lattice structure fails such tests. That is a reason to use a modern generator such as the Mersenne Twister, the R default, or PCG64, and not to write one's own. [5/arnolds-measure-of-randomness]

## In the book
With $T = 15$ points modulo 100, the sequence $37i$ sits at about 1.19, near the floor of 1, and is unmistakably too regular. The sequence $3^i$ is at about 1.55, inside the central 95% interval of random sets, so the measure does not reject it. [5/arnolds-measure-of-randomness]

## Pitfalls
The measure is a diagnostic and not a theorem. With $T = 15$ the random distribution is wide, and a single sequence inside the interval proves nothing. [5/arnolds-measure-of-randomness] Such diagnostics detect pattern but do not certify an allocation mechanism. [5/key-points]

## Check yourself
- Q: What does $s = 1$ mean? A: The points are evenly spaced, strong repulsion, too regular to be random. [5/arnolds-measure-of-randomness]
- Q: What is the expected $s$ for independent uniform points? A: $2T/(T+1)$, close to 2 for large $T$. [5/arnolds-measure-of-randomness]
