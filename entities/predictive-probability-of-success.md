---
id: predictive-probability-of-success
name: Predictive probability of success
type: concept
aliases: [predictive probability, PPoS, predictive power]
level: 2
summary: The chance that the trial will meet its final success criterion if it continues, averaging over what the remaining patients might show.
chapters: ['15', '18']
home: sec-pp
sections: [15/the-normal-case, 15/the-exact-beta-binomial-computation, 15/a-time-to-event-example, 15/from-conditional-power-to-predictive-probability, 15/what-the-predictive-probability-design-is-and-is-not]
prerequisites: [posterior-distribution, conditional-power]
related:
- {rel: used-in, to: calgb-49907}
- {rel: used-in, to: dawn-trial}
- {rel: uses, to: posterior-predictive-distribution}
equations: [eq-pp, eq-betabinom, eq-pp-binary, eq-marion]
functions: [pp_normal, cond_power, pp_one_arm, pp_two_arm]
results: []
lab: [07-interim-looks, 09-adaptive-bayesian]
cites: [spiegelhalter1986monitoring, dmitrienko2006predictive, marion2025]
---
## What it is

Conditional power fixes the effect $\xi$. The Bayesian replaces it by the posterior distribution of $\xi$ and averages [15/from-conditional-power-to-predictive-probability]:

$$
\mathrm{PP} = \int \mathrm{CP}(\xi)\, \pi(\xi \mid y_{1:n})\, d\xi = \Pr(\text{final success criterion met} \mid y_{1:n}).
$$

[15/from-conditional-power-to-predictive-probability]

For a binary endpoint with $m$ future patients the future responders are beta-binomial (eq-betabinom) and the predictive probability is the exact sum (eq-pp-binary) [15/the-exact-beta-binomial-computation]:

$$
\Pr(X = x \mid s, n) = \binom{m}{x}\frac{B(a_0+s+x,\; b_0+n-s+m-x)}{B(a_0+s,\; b_0+n-s)}, \qquad x = 0,\dots,m,
$$

$$
\mathrm{PP}(s, n) = \sum_{x=0}^{m} \Pr(X=x \mid s,n)\; \mathbf{1}\{\Pr(p > p_0 \mid s+x,\, N) > \eta\}.
$$

Marion's approximation (eq-marion) is

$$
\mathrm{PP} \approx \Phi\!\left(\frac{\Phi^{-1}(q_n) - \Phi^{-1}(\eta)\sqrt{r}}{\sqrt{1-r}}\right),
$$

[15/what-the-predictive-probability-design-is-and-is-not]

## Why it matters

It accounts for uncertainty in the effect, which conditional power does not [15/from-conditional-power-to-predictive-probability]. The final success criterion must be named when the number is reported, because it can be a frequentist test or a Bayesian rule [15/from-conditional-power-to-predictive-probability].

## In the book

With a normal prior and the normal-drift model the integral has a closed form, computed by `pp_normal` [15/the-normal-case]. For a binary endpoint no approximation is needed: the future responders follow a beta-binomial distribution, and the predictive probability is an exact sum [15/the-exact-beta-binomial-computation]. In a single-arm example with $N = 40$ and $p_0 = 0.20$, twenty patients with six responders give 0.457, with 5 responders 0.219, and with 7 responders 0.713 [15/the-exact-beta-binomial-computation]. The approximation of Marion needs only the current posterior probability and the information fraction [15/what-the-predictive-probability-design-is-and-is-not].

## Pitfalls

Neither a flat-prior value nor a design-alternative-prior value is the right one; they answer under different priors, so the prior must be pre-specified [15/the-normal-case]. The approximation is a design component to validate, not an identity [15/what-the-predictive-probability-design-is-and-is-not].

## Check yourself

- Q: How does PP relate to conditional power? A: It is conditional power averaged over the posterior of the effect [15/from-conditional-power-to-predictive-probability].
- Q: Does the binary case need simulation? A: No, it is an exact beta-binomial sum [15/the-exact-beta-binomial-computation].
