---
id: large-deviation
name: Large deviation scale
type: concept
aliases: [large deviation, large deviation ledger]
level: 3
summary: The scale where ruling out a null at error alpha needs a fixed quantity of evidence, log(1/alpha), accruing at the Kullback-Leibler rate.
chapters: ['11', '1', '9']
home: sec-ch10-wald
sections: [sec-ch10-wald, 11/where-the-surcharge-comes-from]
prerequisites: [wald-sprt]
related:
- {rel: part-of, to: deviation-scale}
- {rel: uses, to: villes-inequality}
equations: [eq-wald]
functions: []
results: []
lab: []
cites: [wald1945sequential]
---

## What it is

Wald's expected sample size formula has three features that the book calls the large deviation ledger. The numerator, such as $\log\{(1-\beta)/\alpha\}$, is a fixed quantity of evidence in nats, set by the error levels alone. The denominator is a Kullback-Leibler divergence, the rate at which evidence accrues, linearly in $n$. The governing relation is $n\,\mathrm{KL} \asymp \log(1/\alpha)$, the Chernoff-Stein relation. [sec-ch10-wald]

$$
\mathbb{E}_1[T] \approx \frac{(1-\beta)\log\{(1-\beta)/\alpha\} + \beta \log\{\beta/(1-\alpha)\}}{\mathrm{KL}(P_1 \| P_0)}
$$

## Why it matters

To rule out a null with error probability $\alpha$ requires evidence $\log(1/\alpha)$, and evidence comes at rate KL. It is a statement at exponential speed. [sec-ch10-wald]

## In the book

Ville's inequality is Markov's inequality at a stopping time. For the exponential martingale, the first passage to $1/\alpha$ is the first time the cumulative log likelihood ratio reaches $\log(1/\alpha)$. Wald's identity then gives $\mathbb{E}[T_\alpha] = \{\log(1/\alpha)/\mathrm{KL}\}(1 + o(1))$. [11/where-the-surcharge-comes-from]

The surcharge of the normal-mixture rule is this Chernoff toll: the bar $\log(1/\alpha)$ is fixed and evidence accrues at rate KL. [11/where-the-surcharge-comes-from]

## Pitfalls

- The surcharge is a cost of this construction and comparison, not a lower bound for all anytime-valid procedures. Realizable boundaries with iterated-logarithm rates exist and behave differently. [11/where-the-surcharge-comes-from]

## Check yourself

- Q: What is the governing relation of the ledger? A: $n\,\mathrm{KL} \asymp \log(1/\alpha)$. [sec-ch10-wald]
- Q: What unit measures the fixed quantity of evidence? A: Nats. [sec-ch10-wald]
