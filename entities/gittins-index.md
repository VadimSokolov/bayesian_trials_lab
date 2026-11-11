---
id: gittins-index
name: Gittins index
type: method
aliases: []
level: 3
summary: 'The exact solution to the discounted infinite-horizon bandit problem: give each patient the arm with the highest index, which depends only on that arm''s own history.'
chapters: ['16']
home: 16/the-gittins-index
sections: [sec-rar-bandit, 16/exploring-and-exploiting]
prerequisites: [multi-armed-bandit, beta-prior]
related:
- {rel: part-of, to: response-adaptive-randomization}
- {rel: contrasts-with, to: thompson-sampling}
equations: [eq-gittins]
functions: [gittins_table, gittins_index, rar_gittins_index]
results: []
lab: []
cites: [gittins1974, gittins1979bandit, whittle1980multi, berry1985bandit]
---
## What it is

Each arm has a state, which for a binary outcome is its counts of successes and failures, and future rewards are discounted by a factor $\gamma < 1$ per patient [16/the-gittins-index]. The index of an arm in state $s$ is the highest achievable ratio of expected discounted reward to expected discounted time, over the stopping times $\tau$ at which one might abandon the arm:

$$
G(s) = \sup_{\tau > 0} \frac{\mathrm{E}\bigl[\sum_{t=0}^{\tau-1} \gamma^t r_t \mid s\bigr]}{\mathrm{E}\bigl[\sum_{t=0}^{\tau-1} \gamma^t \mid s\bigr]}.
$$

[16/the-gittins-index]

## Why it matters

Equivalently it is the constant payoff per patient at which a decision maker is indifferent between continuing with the arm and retiring to a sure thing [16/the-gittins-index]. The optimal policy gives each patient the arm with the highest index, and each arm's index depends only on its own history, so many arms are solved by tabulating one-arm indices [16/the-gittins-index].

## In the book

The index exceeds the posterior mean when the arm is uncertain, and the excess is the value of learning [16/the-gittins-index]. This premium makes an optimal policy try a new arm even when its estimate is mediocre, and a longer horizon raises it [16/the-gittins-index]. Gittins showed the result for geometric discounting [16/exploring-and-exploiting].

## Pitfalls

It is exact for an infinite, discounted horizon, whereas a trial has a fixed number of patients and a finite-horizon problem has no index solution [16/the-gittins-index]. The objective is the reward to patients in the trial, not that of a confirmatory comparison [16/the-gittins-index]. Practical designs use approximations, with [[thompson-sampling]] the most common [16/the-gittins-index].

## Check yourself

- Q: Does an untried arm's index sit above or at its posterior mean? A: Above, because uncertainty carries a premium for learning [16/the-gittins-index].
- Q: Why is the index not a design for a fixed-size trial? A: It solves the infinite discounted horizon; a finite horizon has no index solution [16/the-gittins-index].
