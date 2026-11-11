---
id: fixed-sequence-testing
name: Fixed-sequence testing
type: method
aliases: [hierarchical testing, fixed sequence]
level: 1
summary: Order hypotheses in advance and test each at the full alpha, stopping at the first failure.
chapters: ['10']
home: 10/fixed-sequence-hierarchical-testing
sections: [10/fixed-sequence-hierarchical-testing, 10/key-points]
prerequisites: [familywise-error-rate]
related:
- {rel: special-case-of, to: closed-testing}
- {rel: special-case-of, to: graphical-procedure}
equations: []
functions: []
results: []
lab: [04-multiplicity]
cites: []
---

## What it is

Order the hypotheses in advance by clinical importance: $H_1, H_2, \dots, H_k$. Test $H_1$ at the full $\alpha$. If it is rejected, test $H_2$ at the full $\alpha$, and so on. Stop at the first failure and do not test the rest. [10/fixed-sequence-hierarchical-testing]

## Why it matters

The familywise error rate is controlled at $\alpha$ with no division of the level, because at most one hypothesis can be the first true null, and it is tested at $\alpha$. [10/fixed-sequence-hierarchical-testing]

This is the most common strategy for a primary endpoint followed by key secondaries. It is what "primary/secondary hierarchy" means in a protocol. [10/fixed-sequence-hierarchical-testing]

## In the book

The price is that the order is final. A failure on the primary, or on an early secondary, makes all later results exploratory regardless of how impressive they look. This surprises clinical teams that have seen a large effect on endpoint 4. [10/fixed-sequence-hierarchical-testing]

Two consequences for writing the hierarchy: put first the endpoint with the best chance of success and the most important claim, since a failure ends the chain. And the sequence can be a tree and not a line, which is a graphical procedure. [10/fixed-sequence-hierarchical-testing]

## Pitfalls

- Testing four secondaries at alpha/4 regardless of the primary may be worse for the claims the sponsor cares about than a fixed-sequence or graphical procedure. [10/key-points]

## Check yourself

- Q: A primary endpoint fails. May the key secondaries be tested at full level? A: No, later results become exploratory. [10/fixed-sequence-hierarchical-testing]
- Q: Why is no division of alpha needed? A: At most one hypothesis can be the first true null, and it is tested at alpha. [10/fixed-sequence-hierarchical-testing]
