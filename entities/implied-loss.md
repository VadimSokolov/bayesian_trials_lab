---
id: implied-loss
name: Implied loss
type: concept
aliases: [test as a Bayes rule]
level: 3
summary: Every fixed-level test is a Bayes rule for some prior odds and loss ratio, which a trialist who fixes alpha has chosen without saying so.
chapters: ['7']
home: sec-evidence-implied-loss
sections: [sec-evidence-bayesrisk, sec-evidence-implied, sec-evidence-lossratio, 7/key-points, sec-evidence-bayestype1]
prerequisites: [bayes-risk]
related:
- {rel: uses, to: decision-theory}
equations: [eq-bayes-rule, eq-implied-c]
functions: [decide_lindley_table, decide_loss_ratio]
results: []
lab: []
cites: [neyman1933problem, isakov2019]
---

## What it is

A test is a Bayes rule for an implied loss. The Bayesian ledger holds one number, the [[bayes-risk]], which weighs the two errors by how likely each state is and how much each mistake hurts [sec-evidence-implied-loss]. The optimal rule rejects when $\mathrm{BF}_{10} > b$ with $b = \frac{\pi_0}{1-\pi_0}\cdot\frac{\ell_1}{\ell_0}$ [sec-evidence-bayesrisk]. A Neyman-Pearson most powerful test is a Bayes rule for some prior odds and loss ratio [sec-evidence-bayesrisk].

The implied Bayes factor threshold shrinks as information grows:

$$
2\log b_n \;=\; z_{\mathrm{crit}}^2\,\frac{q}{1+q} - \log(1+q), \qquad\text{so}\qquad b_n \approx \frac{e^{z_{\mathrm{crit}}^2/2}}{\sqrt{q}} \to 0 .
$$

This is equation eq-implied-c. [sec-evidence-implied]

## Why it matters

A fixed $\alpha$ hides the loss ratio. As trials grow, a fixed level behaves as if the prior odds on the null or the harm of a false approval were shrinking toward zero [sec-evidence-implied]. In normal model the implied threshold satisfies $2\log b_n = z_{\mathrm{crit}}^2\,\frac{q}{1+q} - \log(1+q)$ [sec-evidence-implied].

## In the book

A posterior threshold of 0.975, 0.99 or 0.995 says approving a useless drug is 39, 99 or 199 times worse than withholding a useful one [7/key-points]. The ratio is not statistical. It depends on the disease, and Isakov, Lo and Montazerhodjat find the best threshold differs by disease [sec-evidence-lossratio].

## Pitfalls

This is the point-null, two-sided calculation. It is not the benefit probability of the FDA criterion, and the two 0.975 thresholds are not interchangeable [sec-evidence-lossratio]. The one-sided confirmatory rule is a different decision problem [sec-evidence-bayestype1].

## Check yourself

- Q: What loss ratio does a posterior threshold of 0.99 imply? A: A false approval is about 99 times worse than a false rejection [7/key-points].
- Q: What does a regulator holding alpha fixed behave like as trials grow? A: As if the prior odds on the null were shrinking toward zero [sec-evidence-implied].
