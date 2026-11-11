---
id: basket-trial
name: Basket trial
type: design
aliases: [basket design, tissue-agnostic basket]
level: 2
summary: A trial of one therapy in several tumor types or biomarker subgroups, where a hierarchical model lets small baskets borrow from one another.
chapters: ['19', '20']
home: sec-borrowing-basket
sections: [sec-borrowing-basket, sec-borrowing-guide, 20/definitions-master-protocol-basket-umbrella-platform]
prerequisites: [hierarchical-model, multiplicity]
related:
- {rel: part-of, to: master-protocol}
- {rel: contrasts-with, to: umbrella-trial}
equations: [eq-hier]
functions: [borrow_basket_posterior]
results: []
lab: [09-adaptive-bayesian]
cites: [thall2003, berry2013bayesian, chu2018calibrated, chu2018blast, neuenschwander2016exnex, hobbs2018exchangeability, kaizer2018multisource, simon2016basket]
---
## What it is

A basket trial tests one therapy in several tumor types or biomarker-defined subgroups that share a molecular target. Each basket is small, and the question is which baskets respond. [sec-borrowing-basket] The traditional design runs a separate single-arm test in each basket with a multiplicity adjustment. The Bayesian design puts the baskets in a hierarchical model, for $K$ baskets with response rates $p_1,\ldots,p_K$: [sec-borrowing-basket]

$$
y_k \mid p_k \sim \mathrm{Binomial}(n_k,p_k),\qquad \mathrm{logit}\,p_k \mid \mu,\tau_b \sim N(\mu,\tau_b^2),\qquad (\mu,\tau_b)\sim \pi(\mu,\tau_b).
$$
This is eq-hier. [sec-borrowing-basket]

## Why it matters

Berry and colleagues applied the hierarchical model to oncology subpopulations and reported designs needing fewer patients per subgroup than independent analyses at the same type I error, under their own scenarios. The quoted figure is 4 to 7 fewer patients per group, and shows what the method can achieve, not what it will. [sec-borrowing-basket]

## In the book

In a mechanism example with ten baskets of 30 patients, nine baskets have 12 responders (40%) and one has 3 (10%). The outlier raises $\tau_b$, the nine typical baskets are pulled down from 40%, and the outlier is pulled up from 10%. [sec-borrowing-basket] If all ten have 12, the estimate stays at 40% and intervals narrow. [sec-borrowing-basket] Variants include the calibrated hierarchical model (CBHM), BLAST and EXNEX. [sec-borrowing-basket] FDA lists basket trials under borrowing and asks for justified exchangeability and explicit effect modifiers. [sec-borrowing-basket]

## Pitfalls

A basket that does not respond has its response overestimated, by almost three-fold in the example, and may be rejected more often than under independent analyses. The remedy is calibration by simulation with some baskets not responding. [sec-borrowing-basket]

## Check yourself

- Q: What happens to a 10% outlier among nine 40% baskets? A: It is pulled up toward the others, a response overstatement. [sec-borrowing-basket]
- Q: Which error should be reported? A: The false positive rate for non-responding baskets. [sec-borrowing-basket]
