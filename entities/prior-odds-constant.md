---
id: prior-odds-constant
name: Prior odds in the sample size constant
type: concept
aliases: [prior odds]
level: 3
summary: The constant C in the moderate deviation boundary, which makes the price of prior skepticism explicit in patients.
chapters: ['9']
home: 9/the-prior-odds-in-the-constant
sections: [9/the-power-function-and-the-sample-size-equation, 9/the-fixed-n-test-has-no-memory-of-n]
prerequisites: [moderate-deviation-sample-size]
related: []
equations: [eq-md-boundary]
functions: [n_md, events_md]
results: []
lab: []
cites: [polson2026bayesstandard]
---

## What it is

The constant $C$ collects the prior odds and the prior density at the null. For a unit-information prior $C = 2\log(\pi_0/\pi_a)$, and with equal odds $C = 0$ [9/the-fixed-n-test-has-no-memory-of-n]. Moving from even odds to two-to-one and four-to-one against the alternative raises $C$ from 0 to 1.39 and 2.77 [9/the-prior-odds-in-the-constant].

The moderate-deviation boundary for the critical $t$ value is:

$$
t_{\text{crit}} = \sqrt{\log n + C}\,\bigl(1 + o(1)\bigr), \qquad C = 2\log\frac{\pi_0/\pi_a}{\pi(\theta_0)\sqrt{2\pi/I(\theta_0)}},
$$

This is equation eq-md-boundary. [9/the-fixed-n-test-has-no-memory-of-n]

## Why it matters

Skepticism is paid for in patients, at a rate the formula makes explicit. The sponsor who says the drug is a long shot is told how many more patients it takes, and the sponsor who claims equal odds is told what that claim is worth [9/the-prior-odds-in-the-constant]. The requirement rises and the induced one-sided error falls as the odds worsen [9/the-prior-odds-in-the-constant].

## In the book

The unit matters. The package function `events_md()` uses the information convention ($n = d/4$, $I = 1$), where $C = 0$ is the unit-information prior at equal odds. In the events convention, $C_{\text{info}} = C_{\text{events}} + \log 4$, so the same numerical $C = 0$ means $C_{\text{info}} = \log 4 = 1.39$ [9/the-power-function-and-the-sample-size-equation]. For a standard Cauchy prior on a unit-variance Gaussian mean, $C = \log(\pi/2) = 0.452$ [9/the-fixed-n-test-has-no-memory-of-n].

## Pitfalls

This is not a way out of a regulatory error-rate expectation. Where the sponsor calibrates to a one-sided 0.025 by simulation, that target stays [9/the-prior-odds-in-the-constant]. Keeping $C = 0$ while switching units changes the implied prior [9/the-power-function-and-the-sample-size-equation].

## Check yourself

- Q: What does C equal at 4:1 odds against the alternative? A: $2\log 4 = 2.77$ [9/the-prior-odds-in-the-constant].
- Q: Does the required sample size go up or down as odds against the alternative worsen? A: Up [9/the-prior-odds-in-the-constant].
