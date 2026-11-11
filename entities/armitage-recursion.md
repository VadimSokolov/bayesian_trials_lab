---
id: armitage-recursion
name: Armitage recursion
type: method
aliases: [Armitage-McPherson-Rowe recursion]
level: 3
summary: An exact numerical recursion for the density of the accumulated score at each look, which gives crossing probabilities for any boundary.
chapters: ['11']
home: 11/the-armitage-recursion
sections: [11/the-armitage-recursion]
prerequisites: [interim-analysis, information-fraction]
related:
- {rel: used-in, to: group-sequential-design}
equations: [eq-armitage, eq-armitage-p]
functions: [gs_crossing_prob, gs_naive_inflation]
results: []
lab: [07-interim-looks]
cites: [armitage1969, jennison_turnbull_2000]
---

## What it is

Armitage, McPherson and Rowe observed that the accumulated score is a Markov process. Given the score at look $k$ the next score is a normal increment, so the density of the score at look $k+1$ among trials that have not stopped is an integral of the density at look $k$ against a normal kernel, truncated at the boundary. [11/the-armitage-recursion]

With $S(t)$ Brownian motion with drift $\xi$ and $f_k(s)$ the density on the event of no stop through look $k$, the recursion is as follows. [11/the-armitage-recursion]

$$
\begin{aligned}
f_1(s) &= \phi_{t_1}(s - \xi t_1)\,\mathbf 1\{s < b_1\sqrt{t_1}\}, \\
f_{k+1}(s) &= \int_{-\infty}^{b_k\sqrt{t_k}} f_k(u)\,\phi_{\Delta_{k+1}}\bigl(s - u - \xi \Delta_{k+1}\bigr)\,du, \qquad s < b_{k+1}\sqrt{t_{k+1}},
\end{aligned}
$$

where $\Delta_{k+1} = t_{k+1} - t_k$. [11/the-armitage-recursion]

## Why it matters

The type I error of the design is $\sum_k p_k$ at $\xi = 0$, and power is the same sum at the alternative's $\xi$. A futility boundary enters by truncating the integral in the other direction. [11/the-armitage-recursion]

## In the book

The package computes it with `gs_crossing_prob`, using Gauss-Legendre nodes, accurate to many digits. [11/the-armitage-recursion] Four equally spaced unadjusted looks at 1.96 give a one-sided type I error of 0.0631, more than two and a half times the nominal 0.025. [11/the-armitage-recursion]

The recursion is exact except for numerical integration, because it uses only independent normal increments and the fact that the standardized statistic is a function of the score. [11/the-armitage-recursion]

## Pitfalls

- Real trials depart from the Brownian model. Jennison and Turnbull show the canonical joint distribution holds asymptotically for a wide class of endpoints, and the simulation report is where departures are checked. [11/the-armitage-recursion]

## Check yourself

- Q: What makes (look index, score) a Markov chain? A: Independent normal increments and a standardized statistic that is a function of the score. [11/the-armitage-recursion]
- Q: How do you get power from the recursion? A: Sum the crossing probabilities at the drift of the alternative. [11/the-armitage-recursion]
