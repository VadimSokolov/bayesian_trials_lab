---
id: villes-inequality
name: Ville's inequality
type: principle
aliases: [Ville inequality]
level: 2
summary: For a test martingale, the probability that it ever reaches 1/alpha under the null is at most alpha, whatever the looks or the reason for stopping.
chapters: ['12']
home: 12/test-martingales-and-villes-inequality
sections: [12/test-martingales-and-villes-inequality, sec-safety-monitor, 12/two-arm-binary-design]
prerequisites: [test-martingale]
related:
- {rel: generalizes, to: wald-sprt}
- {rel: uses, to: e-value}
equations: []
functions: []
results: []
lab: [08-e-values]
cites: [ville1939etude, wald1945sequential]
---
## What it is

For a test martingale $E_n$ with $E_0 = 1$, the bound holds for the whole path: [12/test-martingales-and-villes-inequality]

$$
\mathbb{P}_{H_0}\Bigl(\sup_{n} E_n \ge 1/\alpha\Bigr) \le \alpha .
$$

[12/test-martingales-and-villes-inequality] Markov's inequality gives the bound at one fixed time. Ville's inequality gives it for the supremum over all times, the probability that the wealth is ever above $1/\alpha$. [12/test-martingales-and-villes-inequality]

## Why it matters

The gambler may look after every patient, pause, resume, or stop for a reason the protocol never considered. The probability of ever declaring success under the null is still at most $\alpha$. [12/test-martingales-and-villes-inequality] This is what "anytime-valid" means. [12/test-martingales-and-villes-inequality]

## In the book

For likelihood ratios the bound is the one Wald used for the error rates of his sequential probability ratio test, and Ville's version covers any nonnegative martingale. [12/test-martingales-and-villes-inequality]

The proof takes the first time $T$ at which $E_n \ge 1/\alpha$. The stopped process is again a nonnegative martingale, so its expectation is one, and Markov's inequality at the stopping time gives $\mathbb{P}(T \le n) \le \alpha$. [12/test-martingales-and-villes-inequality] The argument does not use the distribution of the data, the number of looks, or the reason for stopping. [12/test-martingales-and-villes-inequality]

In safety monitoring the same bound applies to a Bayes factor computed with a fixed prior under the alternative. [sec-safety-monitor]

## Pitfalls

- The bound is not tight. The wealth overshoots the boundary when it crosses, so the realized type I error is often below nominal. [12/two-arm-binary-design]

## Check yourself

- Q: What changes between Markov's and Ville's inequality? A: Markov bounds the wealth at one fixed time. Ville bounds the supremum over all times. [12/test-martingales-and-villes-inequality]
- Q: Does Ville's inequality need the stopping rule to be prespecified? A: No. The proof does not use the number of looks or the reason for stopping. [12/test-martingales-and-villes-inequality]
