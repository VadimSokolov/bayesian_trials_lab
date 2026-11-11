---
id: holm-procedure
name: Holm procedure
type: method
aliases: [Holm]
level: 2
summary: A step-down version of Bonferroni that rejects everything Bonferroni rejects and sometimes more, with the same dependence-free guarantee.
chapters: ['10']
home: 10/holm
sections: [10/holm, 10/closed-testing, 10/hochberg, 10/what-the-traditional-reading-does-with-it]
prerequisites: [bonferroni-correction]
related:
- {rel: special-case-of, to: closed-testing}
- {rel: contrasts-with, to: hochberg-procedure}
equations: []
functions: [mult_holm]
results: []
lab: [04-multiplicity]
cites: [holm1979simple]
---

## What it is

Order the $p$-values $p_{(1)}\le\dots\le p_{(k)}$. Compare $p_{(1)}$ to $\alpha/k$. If it is rejected, compare $p_{(2)}$ to $\alpha/(k-1)$, and continue until a $p$-value fails. Then stop and retain that hypothesis and all remaining ones. [10/holm]

Holm controls the familywise error rate in the strong sense with no assumption on dependence. It rejects everything Bonferroni rejects and sometimes more. [10/holm]

## Why it matters

Holm is a uniform improvement over Bonferroni at no extra assumption. [10/holm] It is the closed test that uses Bonferroni for each intersection hypothesis. [10/closed-testing]

## In the book

In the six-endpoint example all three adjusted procedures reject only E1, with $p=0.004$ just under $0.025/6 = 0.0042$. Holm's next threshold is $0.025/5 = 0.005$, which 0.011 misses, so it stops. [10/hochberg]

The procedures separate when several $p$-values are small, for example 0.004, 0.005, 0.006 and the rest large. [10/hochberg]

In the ulcer illustration Holm and Bonferroni agree on the smallest $p$-value, and none of the other contrasts is stronger, so Holm does not rescue the finding. [10/what-the-traditional-reading-does-with-it]

## Pitfalls

- Plain Bonferroni may still be written into a protocol because its simplicity helps when many people must read it. [10/holm]
- Holm does not use the ordering of arms, such as recurrence falling as more stomach is removed. [10/what-the-traditional-reading-does-with-it]

## Check yourself

- Q: With six hypotheses, what is Holm's second threshold if the smallest is rejected? A: alpha divided by 5. [10/holm]
- Q: Can Holm reject fewer hypotheses than Bonferroni? A: No, it rejects everything Bonferroni rejects. [10/holm]
