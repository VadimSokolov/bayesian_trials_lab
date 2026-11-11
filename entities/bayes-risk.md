---
id: bayes-risk
name: Bayes risk
type: concept
aliases: [Bayes risk of a test]
level: 3
summary: The expected loss of a test over both the parameter and the data, weighing each error by its prior probability and cost.
chapters: ['7', '12']
home: sec-evidence-bayesrisk
sections: [sec-evidence-bayestype1, sec-evidence-implied]
prerequisites: [bayes-factor, type-i-error, type-ii-error]
related:
- {rel: part-of, to: implied-loss}
equations: [eq-bayes-risk, eq-bayes-rule]
functions: [decide_bayes_risk, decide_bayes_type1_table]
results: []
lab: []
cites: [neyman1933problem]
---

## What it is

Let $D(y) = 1$ declare the treatment effective, $\pi_0 = \Pr(H_0)$, and let the loss be $\ell_1$ for approving a useless drug and $\ell_0$ for withholding a useful one. The Bayes risk is [sec-evidence-bayesrisk]:

$$
r(D) \;=\; \pi_0\,\ell_1\,\alpha(D) \;+\; (1-\pi_0)\,\ell_0 \int \beta_\theta(D)\, g(\theta)\, d\theta .
$$

This is eq-bayes-risk. A frequentist who reports $\alpha$ and $\beta$ reports its ingredients, but not the weights [sec-evidence-bayesrisk].

## Why it matters

The rule that minimizes $r(D)$ is found one data set at a time:

$$
D^{B}(y) = \mathbf 1\{\mathrm{BF}_{10}(y) > b\}, \qquad b = \frac{\pi_0}{1-\pi_0}\cdot\frac{\ell_1}{\ell_0},
$$

which is eq-bayes-rule [sec-evidence-bayesrisk].

## In the book

With equal odds and loss, the exact bar on $|Z_n|$ is $\sqrt{(1 + 1/q)\log(1+q)}$. The type I error of the Bayes rule exceeds 5% for small trials, passes 5% at the crossing, and then falls roughly like $(q \log q)^{-1/2}$ [sec-evidence-bayestype1]. The fixed-level test has Bayes risk at least $\pi_0\ell_1\alpha$ at every $n$. For the Bayes rule both error rates tend to zero [sec-evidence-bayestype1]. A fixed bar spends a constant error forever [sec-evidence-bayestype1].

## Pitfalls

The alternative $N(0,\tau^2)$ puts mass on harmful effects, so $\Pr(H_1\mid y)$ is not the benefit probability $\Pr(\theta>a\mid y)$. Restricting the rule to $Z_n>0$ does not preserve optimality [sec-evidence-bayesrisk].

## Check yourself

- Q: Does the fixed 5% test have Bayes risk that goes to zero as n grows? A: No, because its type I error stays at alpha [sec-evidence-bayestype1].
- Q: What does the Bayes rule threshold b contain? A: The prior odds times the loss ratio [sec-evidence-bayesrisk].
