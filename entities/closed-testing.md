---
id: closed-testing
name: Closed testing
type: method
aliases: [closed testing procedure]
level: 2
summary: 'The principle behind Holm, fixed-sequence and graphical procedures: reject a hypothesis only if every intersection containing it is rejected at level alpha.'
chapters: ['10']
home: 10/closed-testing
sections: [10/closed-testing, 10/graphical-procedures]
prerequisites: [familywise-error-rate, bonferroni-correction]
related:
- {rel: generalizes, to: holm-procedure}
- {rel: generalizes, to: fixed-sequence-testing}
- {rel: generalizes, to: graphical-procedure}
equations: []
functions: []
results: []
lab: [04-multiplicity]
cites: [marcus1976closed, dmitrienko2013traditional]
---

## What it is

The procedures above are special cases of one principle due to Marcus, Peritz and Gabriel. A closed test starts from hypotheses $H_1,\dots,H_k$ and forms all intersection hypotheses, such as "$H_1$ and $H_3$ are both true". Each intersection is tested with any valid level-$\alpha$ test. [10/closed-testing]

An individual hypothesis $H_i$ is rejected if every intersection that contains $H_i$ is rejected at level $\alpha$. [10/closed-testing]

## Why it matters

This controls the familywise error rate strongly. A true intersection of nulls is wrongly rejected with probability at most $\alpha$, and any false rejection of an individual hypothesis requires rejecting the intersection of all true nulls. [10/closed-testing]

For a clinician the lesson is that "the multiplicity adjustment" is not one formula. It is a rule for how a result about one hypothesis may depend on results about others, chosen at the protocol stage. [10/closed-testing]

## In the book

Holm's procedure is the closed test that uses Bonferroni for each intersection. A more powerful intersection test, such as one using the correlation between endpoints, gives a more powerful closed procedure. [10/closed-testing]

The same logic yields the gatekeeping and fixed-sequence procedures that dominate practice. [10/closed-testing] Graphical procedures control the familywise error rate because each step is a closed-test shortcut. [10/graphical-procedures]

## Pitfalls

- The choice of intersection test is where the power is won or lost, and it must be fixed in the protocol. [10/closed-testing]

## Check yourself

- Q: When is H1 rejected in a closed test? A: When every intersection hypothesis containing H1 is rejected at level alpha. [10/closed-testing]
- Q: Which classic procedure is closed testing with Bonferroni for each intersection? A: Holm's. [10/closed-testing]
