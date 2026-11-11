---
id: e-value-safety-monitoring
name: E-value safety monitoring
type: method
aliases: [e-value monitoring, continuous monitoring]
level: 3
summary: Continuous safety monitoring with a harm-only Bayes factor read as an e-value, so that acting at 20 keeps false alarms below 5 percent at any look schedule.
chapters: ['13', '12']
home: sec-safety-monitor
sections: [sec-safety-monitor, sec-safety-link]
prerequisites: [e-value, villes-inequality, bayes-factor]
related:
- {rel: alternative-to, to: toxicity-monitoring}
- {rel: uses, to: mixture-method}
- {rel: contrasts-with, to: posterior-probability-of-benefit}
equations: [eq-safety-ville]
functions: [safety_bf_monitor]
results: []
lab: []
cites: [ville1939etude]
---
## What it is

Two statistics survive continuous looking. The posterior probability is coherent under any stopping rule, but its false alarm rate is not controlled. [sec-safety-monitor] The Bayes factor read as an e-value is a nonnegative martingale under the null, so Ville's inequality gives

$$
\Pr\left(\sup_t \mathrm{BF}_t \geq 1/\alpha \mid RR = 1\right) \leq \alpha.
$$

This is eq-safety-ville. [sec-safety-monitor]

## Why it matters

Safety asks about harm, so the null is $RR \leq 1$. The alternative is $\log RR \sim N(0, 0.5^2)$ restricted to positive values, and acting when this harm-only Bayes factor first reaches twenty gives a false alarm probability below 5 percent however often one looks. [sec-safety-monitor] A two-sided factor also alarms for protective risk, so its bound is for the wrong null. [sec-safety-monitor]

## In the book

For rofecoxib at the end of 2000 the harm-only factor was substantial but short of the threshold of 20. [sec-safety-monitor] The posterior probability answers how probable harm is given a prior. The e-value rule answers whether the evidence is strong enough to act with a guaranteed bound on false alarms. [sec-safety-monitor]

Over 60 monthly looks at a drug with no effect, the simulation compares a posterior rule at 0.95 with the e-value rule, whose Ville bound is 0.05. [sec-safety-monitor] A posterior probability can rank signals while a charter threshold on the e-value sets the level for a stop or restrict recommendation. [sec-safety-monitor]

An e-value version of the toxicity boundary would be valid at any look, including an unscheduled one. [sec-safety-link]

## Pitfalls

- The price is a larger sample to reach the same alarm when harm is present. [sec-safety-monitor]
- Whether a sequential monitor would have alarmed earlier for rofecoxib needs data the book does not supply. [sec-safety-monitor]

## Check yourself

- Q: Why use a harm-only alternative? A: The null is $RR \leq 1$, and a two-sided factor would alarm for protection too. [sec-safety-monitor]
- Q: What is the false alarm bound at a Bayes factor threshold of 20? A: 0.05. [sec-safety-monitor]
