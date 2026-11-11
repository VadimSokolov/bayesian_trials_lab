---
id: backward-induction
name: Backward induction
type: method
aliases: [optimal stopping, dynamic programming, Bellman equation]
level: 3
summary: Finding the Bayes-optimal stopping rule for a stated loss and cost by working backward from the end of the trial over the sufficient-statistic lattice.
chapters: ['15', '16']
home: sec-bi
sections: [15/the-decision-problem, 15/the-sufficient-statistic-reduction, 15/what-backward-induction-does-and-does-not-do, 15/a-single-arm-example, sec-rar-bandit, sec-compare, sec-reg13]
prerequisites: [posterior-distribution, bayes-sequential-decision-problem, decision-theory]
related:
- {rel: generalizes, to: predictive-probability-monitoring}
- {rel: contrasts-with, to: group-sequential-design}
- {rel: governed-by, to: fda-bayesian-draft-guidance-2026}
equations: [eq-classloss, eq-predict, eq-predictive-bellman, eq-bi-single, eq-bellman-rar]
functions: [backward_induction, forward_oc, fixed_oc, decide_stop_single_arm]
results: [backward_induction_states, utility_only_rule_null_declaration]
lab: [09-adaptive-bayesian]
cites: [bellman1957dynamic, arrow1949bayes, berryho1988, polson2026simbayes]
---
## What it is

For a sequential decision problem with a finite horizon, a best rule exists for a stated loss and can be found by working backward from the end [sec-bi]. After $k$ pairs the trial stops and declares a winner, or pays a cost $\kappa$ for one more pair [15/the-decision-problem]. With $V_k(s_1,s_0)$ the minimum expected loss, the Bellman equation is

$$
V_k(s_1,s_0) = \min\Big\{ h_k(s_1,s_0),\ \kappa + \sum_{y_1,y_0\in\{0,1\}} \Pr(y_1,y_0 \mid s_1,s_0,k)\, V_{k+1}(s_1+y_1,\, s_0+y_0) \Big\},
$$

with $V_T = h_T$ at the horizon [15/the-sufficient-statistic-reduction].

## Why it matters

The sufficient-statistic reduction collapses the exponential decision tree to a lattice with $(k+1)^2$ states at stage $k$, so the recursion is exact and costs $O(T^3)$ states [15/the-sufficient-statistic-reduction]. It prices stopping explicitly through the cost per patient and the loss per error [sec-compare].

## In the book

A loss ratio of 39:1 gives $\gamma = 0.975$, the Bayesian reading of one-sided 0.025 [15/the-decision-problem]. In the book's example a classification-loss policy gives power 0.903 with an expected sample size of 54.3 pairs against 100 for the fixed design [15/the-sufficient-statistic-reduction]. A utility-only rule declares treatment better with probability 0.513 under the null, so it is no confirmatory rule [15/what-backward-induction-does-and-does-not-do].

## Pitfalls

The rule is optimal only for the stated loss and prior, and the loss function is the design [15/what-backward-induction-does-and-does-not-do]. The lattice assumes outcomes are seen before the next decision and balanced allocation; delays and response-adaptive allocation make it harder [15/what-backward-induction-does-and-does-not-do]. No guidance mentions backward induction, so submit it as a pre-specified table [sec-reg13].

## Check yourself

- Q: What does a 39:1 loss ratio correspond to? A: $\gamma = 0.975$, one-sided 0.025 [15/the-decision-problem].
- Q: Why can the policy be computed exactly? A: The posterior depends on the history only through $(s_1, s_0, k)$ [15/the-sufficient-statistic-reduction].
