---
id: e-process
name: E-process
type: concept
aliases: []
level: 3
summary: A sequential process dominated under every null distribution by some test martingale, which allows e-values for composite nulls and covariates.
chapters: ['12']
home: 12/e-processes
sections: [12/e-processes, sec-evalues-p, sec-evalues-reg]
prerequisites: [test-martingale]
related:
- {rel: part-of, to: anytime-valid-inference}
equations: []
functions: []
results: []
lab: [08-e-values]
cites: []
---
## What it is

Not every sequential statistic is a martingale. Often one has a process $E_n$ that is dominated, under every null distribution, by some test martingale. That is an e-process. [12/e-processes]

## Why it matters

The distinction matters mainly because it allows e-values to be built for composite nulls and with covariates in cases where no exact martingale exists. [12/e-processes] The working rule is the same: if $\sup_n E_n \ge 1/\alpha$ has probability at most $\alpha$ under every null, the process can be monitored continuously. [12/e-processes]

## In the book

An e-process supplies a regulator-style output in a form that survives continuous monitoring: the always-valid p-value $p_n = \min(1, 1/\max_{m\le n} E_m)$ and a [[confidence-sequence]]. [sec-evalues-p] The always-valid p-value is nonincreasing in $n$, and the probability that it is ever below $\alpha$ is at most $\alpha$ under the null. [sec-evalues-p]

A protocol using one prespecifies the e-process, the mixing distribution or betting fraction, the threshold and the horizon, not the look schedule. [sec-evalues-reg]

## Pitfalls

- The definitions in the chapter suffice for its trials. The book does not develop e-process theory beyond that. [12/e-processes]
- Protection against optional stopping does not repair bias from unblinding, altered endpoint assessment, selective data collection or invalid model changes. [sec-evalues-reg]

## Check yourself

- Q: What is the working rule for monitoring an e-process continuously? A: Under every null, $\sup_n E_n \ge 1/\alpha$ must have probability at most $\alpha$. [12/e-processes]
- Q: What does the always-valid p-value equal? A: $\min(1, 1/\max_{m\le n} E_m)$. [sec-evalues-p]
