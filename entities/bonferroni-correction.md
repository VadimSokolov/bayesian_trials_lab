---
id: bonferroni-correction
name: Bonferroni correction
type: method
aliases: [Bonferroni]
level: 1
summary: Test each of k hypotheses at alpha divided by k, which controls the familywise error rate whatever the dependence, at a cost in power.
chapters: ['10']
home: 10/bonferroni
sections: [10/bonferroni, 10/hochberg, 10/holm]
prerequisites: [familywise-error-rate]
related:
- {rel: generalizes, to: holm-procedure}
- {rel: special-case-of, to: closed-testing}
- {rel: contrasts-with, to: shrinkage}
equations: []
functions: [mult_bonferroni]
results: []
lab: [04-multiplicity]
cites: [dunn1961multiple, dunnett1955]
---

## What it is

With $k$ hypotheses and a familywise level $\alpha$, test each at $\alpha/k$. Equivalently, multiply each $p$-value by $k$ and compare to $\alpha$. [10/bonferroni]

The union bound guarantees the probability of any false rejection is at most $\alpha$, whatever the dependence between the tests. [10/bonferroni]

## Why it matters

The guarantee needs no assumption and can be explained to a clinician in one sentence. That is why Bonferroni is in every guidance and every statistical analysis plan. [10/bonferroni]

## In the book

For $k=6$ the per-test level is $0.025/6 = 0.00417$, and the critical value moves from $z=1.96$ to $z=2.64$. [10/bonferroni] In the six-endpoint example all three adjusted procedures reject only E1, whose $p$-value 0.004 is just under 0.025/6. [10/hochberg]

Dunn made the inequality a multiple-comparison method. Dunnett gave an exact procedure based on the multivariate $t$ distribution for several treatments against one control, which is less conservative because it uses the correlation induced by the shared control. [10/bonferroni]

## Pitfalls

- The cost is power. A trial sized for 90% power at the unadjusted level has noticeably less after adjustment. [10/bonferroni]
- When one or two hypotheses are truly effects, Bonferroni pays to guard against errors that cannot occur. [10/bonferroni]
- There is no good reason to use plain Bonferroni when Holm is available, other than protocol simplicity. [10/holm]

## Check yourself

- Q: What is the per-test level for six hypotheses at 0.025? A: 0.00417. [10/bonferroni]
- Q: Does Bonferroni need independence? A: No, the union bound holds whatever the dependence. [10/bonferroni]
