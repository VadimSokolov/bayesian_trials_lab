---
id: toxicity-monitoring
name: Toxicity monitoring
type: method
aliases: [toxicity monitoring inside a trial]
level: 2
summary: A prespecified stopping table that pauses a single-arm study when the posterior probability of exceeding the acceptable toxicity rate is high, with exact operating characteristics.
chapters: ['13', '17']
home: sec-safety-tox
sections: [sec-safety-tox, 13/the-traditional-counterpart, 13/the-bayesian-rule, 13/operating-characteristics, sec-safety-link, 13/key-points]
prerequisites: [beta-prior, posterior-distribution, pocock-boundary]
related:
- {rel: alternative-to, to: e-value-safety-monitoring}
- {rel: special-case-of, to: group-sequential-design}
equations: [eq-safety-toxrule]
functions: [tox_bayes_boundary, tox_oc, tox_pocock_boundary]
results: []
lab: []
cites: [thall1995sequential, thall1996new, ivanova2005continuous, pocock1977]
---
## What it is

Inside a trial the question is prospective: given a toxicity the protocol defines, when should enrollment pause? [sec-safety-tox]

The traditional counterpart is a repeated exact binomial test of $H_0: q \le \bar q$ after every five patients, up to 40, with $\bar q = 0.2$. A Pocock-type version uses the same nominal level at every look. [13/the-traditional-counterpart]

The Bayesian rule takes a Beta(0.5, 2.5) prior and, after every five patients, pauses if [13/the-bayesian-rule]

$$
\Pr(q > \bar q \mid x, n) > \kappa, \qquad \kappa = 0.75.
$$

This is eq-safety-toxrule. [13/the-bayesian-rule] It reduces to a table of counts, which is how it goes into a protocol and a DMC charter. [13/the-bayesian-rule]

## Why it matters

The type I error of a safety boundary is a design choice stated with its consequences, set by the asymmetric loss between exposing patients and delaying a good drug. [13/operating-characteristics]

## In the book

The Bayesian rule stops at 3 of the first 5 patients and 11 of 40. The Pocock-type rule at overall level 0.05 requires 4 of the first 5, and 14 of 40. [13/the-bayesian-rule] The Bayesian rule is a constant-nominal-level repeated test at these looks. It does not escape repeated-testing arithmetic and chooses a point on it. [13/the-bayesian-rule]

Operating characteristics are exact, from a dynamic program with no simulation. At the acceptable rate 0.2 the Bayesian rule pauses with probability 0.384. At a true rate of 0.3 expected enrollment is 19.7 of 40. [13/key-points]

## Pitfalls

- A DMC would not follow either table mechanically. The boundary is a flag that triggers a review. [13/operating-characteristics]
- The false alarm probability is guaranteed only for the stated schedule, not for looks off it. [sec-safety-link]

## Check yourself

- Q: Is the Bayesian toxicity rule outside the family of repeated tests? A: No. It matches a Pocock-type test with a constant nominal level. [13/the-bayesian-rule]
