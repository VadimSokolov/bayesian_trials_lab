---
id: hochberg-procedure
name: Hochberg procedure
type: method
aliases: [Hochberg]
level: 2
summary: A step-up version of Holm that rejects at least as many hypotheses but needs independent or suitably positively dependent test statistics.
chapters: ['10']
home: 10/hochberg
sections: [10/hochberg, sec-mult-fdr, 10/key-points]
prerequisites: [holm-procedure]
related:
- {rel: contrasts-with, to: false-discovery-rate}
equations: []
functions: [mult_hochberg]
results: []
lab: [04-multiplicity]
cites: [hochberg1988sharper, simes1986improved, hommel1988stagewise]
---

## What it is

Hochberg runs the order in the other direction from Holm. Start from the largest $p$-value and compare it with $\alpha$, the next largest with $\alpha/2$, and so on. At the first $p_{(j)} \le \alpha/(k-j+1)$, reject that hypothesis and all with smaller $p$-values. [10/hochberg]

It is a step-up version of Holm's step-down test and rejects at least as many hypotheses. [10/hochberg]

## Why it matters

It is more powerful than Holm, which matters when several endpoints are moderately significant. [10/hochberg]

## In the book

The price is an assumption. The guarantee holds when the statistics are independent or positively dependent, such as nonnegative correlation among one-sided normal statistics, which covers comparisons with a shared control. [10/hochberg]

Its step-up logic rests on the Simes inequality, and Hommel gave a more powerful procedure under the same conditions. [10/hochberg] The Benjamini-Hochberg false discovery rate procedure is likewise controlled under positive dependence of this kind, which is why the book links the two. [sec-mult-fdr]

In Table 10.3 Bonferroni, Holm and Hochberg all reject only E1 ($p = 0.004 < 0.025/6 = 0.0042$); the procedures separate only when several $p$-values are small. [10/hochberg] The key points of the chapter state it plainly: Holm uniformly beats Bonferroni with the same dependence-free guarantee, and Hochberg is more powerful but needs positive dependence. [10/key-points]

## Pitfalls

- FDA's multiple endpoints guidance states the dependence conditions and does not treat Hochberg as assumption-free. [10/hochberg]

## Check yourself

- Q: Which direction does Hochberg order the p-values? A: From the largest, as a step-up procedure. [10/hochberg]
- Q: What does Hochberg assume that Holm does not? A: Independence or a specific positive dependence of the test statistics. [10/hochberg]
