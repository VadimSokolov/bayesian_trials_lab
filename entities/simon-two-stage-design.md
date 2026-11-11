---
id: simon-two-stage-design
name: Simon two-stage design
type: design
aliases: [Simon two stage]
level: 2
summary: A single-arm phase 2 design that enrolls n1 patients, stops for futility if at most r1 respond, and otherwise continues to n, with exact binomial error rates.
chapters: ['15']
home: sec-phase2-classic
sections: [15/what-the-predictive-probability-design-is-and-is-not]
prerequisites: [phase-2-trial, type-i-error, power]
related:
- {rel: alternative-to, to: predictive-probability-monitoring}
- {rel: precedes, to: predictive-probability-monitoring}
equations: []
functions: [simon_optimal, simon_oc, lee_liu_oc]
results: []
lab: []
cites: [simon1989optimal, gehan1961determination, fleming1982one]
---
## What it is

A response rate $p$ is judged against an uninteresting rate $p_0$ and a target rate $p_1$ [sec-phase2-classic]. In the two-stage design of Simon, enroll $n_1$ patients and stop for futility if at most $r_1$ respond; otherwise enroll to a total of $n$ and declare the drug promising if more than $r$ respond [sec-phase2-classic].

## Why it matters

It is the design most protocols use for single-arm phase 2 trials, and it is older than the predictive probability designs [sec-phase2-classic]. Both error rates are exact binomial sums, so the design is computed, not simulated [sec-phase2-classic].

## In the book

Among the pairs of stages that meet the stated type I error and power, the optimal design has the smallest expected sample size under $p_0$ [sec-phase2-classic]. The book compares it, for $p_0 = 0.20$ and $p_1 = 0.40$, with the three-look [[predictive-probability-monitoring]] design [sec-phase2-classic]. The two are close under the null, and the main gain of the predictive design is the possibility of stopping for efficacy, plus a smaller maximum sample size [sec-phase2-classic]. Earlier work includes Gehan's first stage that stops when there are no responses [sec-phase2-classic].

## Pitfalls

Simon's design has a single look and stops for futility only [sec-phase2-classic]. Bayesian single-arm designs came after it: Herson proposed stopping on the predictive probability of a positive final result, and Thall and colleagues monitored on a posterior probability with thresholds chosen by frequentist operating characteristics [sec-phase2-classic].

## Check yourself

- Q: What defines the optimal Simon design? A: Among designs meeting the error rates, the smallest expected sample size under $p_0$ [sec-phase2-classic].
- Q: Does it allow stopping for efficacy at the first stage? A: No, it stops for futility only [sec-phase2-classic].
