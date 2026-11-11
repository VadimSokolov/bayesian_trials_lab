---
id: multi-armed-bandit
name: Multi-armed bandit
type: concept
aliases: [bandit problem]
level: 2
summary: The problem of assigning patients one at a time among arms with unknown success rates, balancing treating the patient now against learning for later patients.
chapters: ['16']
home: sec-rar-bandit
sections: [16/exploring-and-exploiting, 16/the-bellman-equation, 16/the-gittins-index]
prerequisites: [posterior-distribution, beta-prior]
related:
- {rel: uses, to: backward-induction}
equations: [eq-bellman-rar]
functions: [rar_alloc_probs]
results: []
lab: [09-adaptive-bayesian]
cites: [thompson1933, robbins1952, gittins1974, berry1985bandit, villar2015multi]
---
## What it is

Suppose two treatments have unknown success probabilities $p_0$ and $p_1$ and patients arrive one at a time [16/exploring-and-exploiting]. Each assignment treats the patient, which is the reward, and teaches us about the arm [16/exploring-and-exploiting]. Assigning the arm that looks better exploits what is known, and assigning the other arm explores [16/exploring-and-exploiting]. The problem is named for a row of slot machines with unknown payout rates [16/exploring-and-exploiting].

## Why it matters

A trial that explores too little may lock onto the wrong arm, and one that explores too much wastes patients on the arm it already suspects is worse [16/exploring-and-exploiting].

## In the book

The best policy solves a Bellman equation on the posterior state with $m$ patients still to treat [16/the-bellman-equation]:

$$
V(\pi_t, m) = \max\Bigl\{ \underbrace{m \max_k \mathrm{E}_{\pi_t}[p_k]}_{\text{stop and treat}},\; \max_k \Bigl( \mathrm{E}_{\pi_t}[p_k] + \mathrm{E}\bigl[ V(\pi_{t+1}, m-1) \mid \pi_t, \text{arm } k \bigr] \Bigr) \Bigr\}.
$$

It is solvable exactly only for small problems, so the book looks at two approximations: the [[gittins-index]] for the discounted infinite horizon and [[thompson-sampling]] [16/the-bellman-equation]. Robbins formulated the sequential allocation problem, and Gittins showed that with geometric discounting the optimal policy is an index policy [16/exploring-and-exploiting].

## Pitfalls

The bandit objective is the reward to patients in the trial, which is not the objective of a confirmatory comparison [16/the-gittins-index]. Villar, Bowden and Wason review these models in trial design and are frank about the obstacles [16/exploring-and-exploiting].

## Check yourself

- Q: What are the two things an assignment does? A: It treats the patient and teaches us about the arm [16/exploring-and-exploiting].
- Q: Why are approximations needed? A: The Bellman equation is solvable exactly only for small problems [16/the-bellman-equation].
