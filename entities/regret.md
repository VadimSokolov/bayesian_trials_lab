---
id: regret
name: Regret
type: concept
aliases: [Lai-Robbins bound]
level: 3
summary: The loss against an oracle that knows the best arm; the Lai-Robbins bound says the best possible policy still puts a log-order number of patients on the inferior arm.
chapters: ['16']
home: 16/regret-and-the-lai-robbins-bound
sections: [16/the-same-logarithm, 16/an-analogy-that-does-not-transfer-as-design-advice]
prerequisites: [multi-armed-bandit]
related:
- {rel: part-of, to: response-adaptive-randomization}
- {rel: contrasts-with, to: thompson-sampling}
equations: [eq-lairobbins]
functions: [rar_regret_sim]
results: []
lab: []
cites: [lai1985, auer2002, polson2026bayesstandard]
---
## What it is

Regret measures how much a policy loses against an oracle that knows the best arm [16/regret-and-the-lai-robbins-bound]. For two arms the regret after $T$ patients is the expected number of patients on the inferior arm times the gap in response probabilities [16/regret-and-the-lai-robbins-bound]. Equal randomization puts half the patients on the inferior arm, so its regret grows linearly in $T$ [16/regret-and-the-lai-robbins-bound].

## Why it matters

Lai and Robbins showed that for a uniformly good policy the expected number of patients on an inferior arm $i$ satisfies [16/regret-and-the-lai-robbins-bound]

$$
\liminf_{T\to\infty} \frac{\mathbb{E}[N_i(T)]}{\log T} \;\ge\; \frac{1}{\mathrm{KL}(p_i, p^\ast)},
$$

where KL is the Kullback-Leibler divergence between the two arms' response distributions [16/regret-and-the-lai-robbins-bound]. The regret of the best possible policy is logarithmic, not linear [16/regret-and-the-lai-robbins-bound].

## In the book

A simulation compares equal allocation, Thompson sampling and the UCB1 rule, which adds a bonus $\sqrt{2\log t / N_i(t)}$ to each arm's mean [16/regret-and-the-lai-robbins-bound]. Polson and Sokolov observe that this logarithm matches the scale of the Bayes sequential boundary: for small effects $\mathrm{KL} \approx \theta^2/2$ and $n\,\mathrm{KL} \asymp \tfrac12 \log n$ [16/the-same-logarithm]. The analogy is exact for the deviation scale and misleading for the objective [16/an-analogy-that-does-not-transfer-as-design-advice].

## Pitfalls

The bound is asymptotic, so finite-horizon counts can sit below the plotted slope [16/regret-and-the-lai-robbins-bound]. Regret is a loss in the trial, power is a property of the final decision, and optimizing the first damages the second [16/an-analogy-that-does-not-transfer-as-design-advice].

## Check yourself

- Q: How does regret of equal allocation grow? A: Linearly in $T$ [16/regret-and-the-lai-robbins-bound].
- Q: Can any good policy avoid putting patients on the inferior arm? A: No, the number grows like $\log T$ with constant $1/\mathrm{KL}$ [16/regret-and-the-lai-robbins-bound].
