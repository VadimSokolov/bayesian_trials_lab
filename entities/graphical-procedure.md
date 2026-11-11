---
id: graphical-procedure
name: Graphical procedure
type: method
aliases: [graphical multiple testing]
level: 3
summary: A multiple testing framework where hypotheses are nodes with weights and edges pass a rejected hypothesis's level to others, so the graph is the protocol.
chapters: ['10']
home: 10/graphical-procedures
sections: [10/graphical-procedures]
prerequisites: [closed-testing, fixed-sequence-testing, holm-procedure]
related:
- {rel: uses, to: spending-function}
equations: []
functions: [mult_graph]
results: []
lab: [04-multiplicity]
cites: [bretz2009graphical, burman2009recycling, bretz2011graphical, maurer2013graphical, dmitrienko2003gatekeeping]
---

## What it is

Bretz, Maurer, Brannath and Posch gave a framework that unifies Bonferroni, Holm, fixed sequence, fallback and gatekeeping procedures in one picture. Each hypothesis is a node with a weight $w_i$, its share of $\alpha$, with $\sum w_i \le 1$. Directed edges carry weights $g_{ij}$, the fraction of $H_i$'s level that passes to $H_j$ if $H_i$ is rejected. [10/graphical-procedures]

The algorithm rejects any $H_i$ with $p_i \le w_i\alpha$, removes it, passes its weight along the edges, updates the edge weights, and repeats. It controls the familywise error rate strongly because each step is a closed-test shortcut. [10/graphical-procedures]

## Why it matters

The graph is the protocol. A statistician can draw it for the clinical team, the team can see which results unlock which, and the same picture goes into the statistical analysis plan. [10/graphical-procedures]

## In the book

The example has two primary endpoints and two secondaries. Each primary gets half the level. A rejected primary passes its level to the secondary that clinically follows it, and a rejected secondary passes its level to the other primary. [10/graphical-procedures]

In the second scenario P1 at 0.020 fails alone, but P2 is rejected and passes to S2. S2 is rejected and returns its level to P1, which then clears 0.025, and S1 follows. A single common marginal $p$-value of 0.015 is not enough when each primary has only half of the level, 0.0125. [10/graphical-procedures]

For an outcomes trial with a group sequential design, the protocol needs three statements: the spending function for each hypothesis, the rule that a transferred weight is spent from the look at which the transfer happens, and the graph with its weights printed. [10/graphical-procedures]

## Pitfalls

- A design that says only "alpha is spent by O'Brien-Fleming" has left the key secondary undefined. [10/graphical-procedures]

## Check yourself

- Q: What does an edge weight g_ij mean? A: The fraction of H_i's level passed to H_j when H_i is rejected. [10/graphical-procedures]
- Q: Why can two primaries at p=0.015 each fail when alpha is 0.025? A: Each has only half of the level, 0.0125, and nothing unlocks. [10/graphical-procedures]
