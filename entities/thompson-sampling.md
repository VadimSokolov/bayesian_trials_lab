---
id: thompson-sampling
name: Thompson sampling
type: method
aliases: []
level: 2
summary: Allocation that draws one value from each arm's posterior and assigns the next patient to the arm with the largest draw.
chapters: ['16']
home: 16/thompson-sampling-in-four-lines
sections: [16/the-same-logarithm, 16/reproducing-the-critique, 16/an-analogy-that-does-not-transfer-as-design-advice, 16/the-fixes]
prerequisites: [multi-armed-bandit, beta-prior, posterior-distribution]
related:
- {rel: part-of, to: response-adaptive-randomization}
- {rel: uses, to: regret}
equations: []
functions: [rar_alloc_probs, rar_simulate, rar_regret_sim]
results: []
lab: [09-adaptive-bayesian, 14-studio]
cites: [thompson1933, kaufmann2012thompson, agrawal2013, russo2016, hill2017]
---
## What it is

With a uniform Beta(1, 1) prior on each success probability, the posterior after $s$ successes and $f$ failures is Beta$(1+s, 1+f)$ [16/thompson-sampling-in-four-lines]. Thompson sampling draws one value from each arm's posterior and assigns the patient to the arm with the largest draw [16/thompson-sampling-in-four-lines]. For two arms the probability that arm 1 is chosen is exactly $\Pr(p_1 > p_0 \mid \text{data})$ [16/thompson-sampling-in-four-lines].

## Why it matters

Early in a trial the allocation is close to one half, and as evidence accumulates it moves toward 0 or 1 [16/thompson-sampling-in-four-lines]. Nothing in the algorithm asks for a threshold, a boundary or a stopping rule [16/thompson-sampling-in-four-lines]. Kaufmann, Korda and Munos and Agrawal and Goyal showed that for Bernoulli arms it attains the Lai-Robbins bound asymptotically [16/the-same-logarithm].

## In the book

In the 400-patient two-arm simulation, Thompson sampling put a large share of patients on the better arm and added responders, but power fell below that of equal allocation and the number on the better arm varied much more between trials [16/reproducing-the-critique]. Its naive test had type I error of about 0.049, almost twice the nominal 0.025, even with no drift [16/reproducing-the-critique]. Amazon used it to choose web page layouts; the book calls the transfer to confirmatory trials limited [16/an-analogy-that-does-not-transfer-as-design-advice].

## Pitfalls

A recommendation of Thompson sampling for confirmatory trials on the strength of the regret analogy would be wrong [16/an-analogy-that-does-not-transfer-as-design-advice]. Burn-in and a cap on the allocation probability reduce but do not remove its problems [16/the-fixes].

## Check yourself

- Q: What is the chance arm 1 is chosen with two arms? A: The posterior probability that arm 1 is better [16/thompson-sampling-in-four-lines].
- Q: Does Thompson sampling need a stopping bar? A: No explicit bar; its exploration comes from the spread of the posterior [16/the-same-logarithm].
