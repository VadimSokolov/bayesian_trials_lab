---
id: real-options
name: Phases as a sequence of options
type: concept
aliases: [phases as options]
level: 2
summary: Each phase is paid for only if all earlier ones succeed, so the cost per approved drug is driven by attrition.
chapters: ['2']
home: sec-lifecycle-options
sections: [2/key-points]
prerequisites: [drug-development, phase-transition-probability]
related: []
equations: [eq-lifecycle-cost]
functions: []
results: []
lab: []
cites: [wong_siah_lo_2019]
---
## What it is
Let $p_{12}$, $p_{23}$ and $p_{3A}$ be the probabilities of moving from Phase I to II, II to III and III to approval, and $c_1$, $c_2$, $c_3$ the phase costs. Phase $k$ is paid for only if all earlier phases succeed, so the long-run cost per approval is the ratio of expected cost per start to expected approvals per start. [sec-lifecycle-options]

$$
C_{\mathrm{approved}} = \frac{c_1 + p_{12}c_2 + p_{12}p_{23}c_3}{p_{12}\,p_{23}\,p_{3A}}.
$$

This is equation eq-lifecycle-cost. [sec-lifecycle-options]

## Why it matters
The formula explains why attrition dominates the economics. Wong, Siah and Lo estimated that about 13.8 percent of programs entering Phase I reach approval, and 3.4 percent in oncology. [sec-lifecycle-options] Cost per approval falls as each transition probability rises or each phase cost falls. [2/key-points]

## In the book
The stylized baseline has $p_{12} = 0.5$, $p_{23} = 0.3$, $p_{3A} = 0.6$ and phase costs of 25, 60 and 250 million dollars, illustrative values and not data. [sec-lifecycle-options] The rows change one input at a time, such as a Phase II success rise from 0.30 to 0.40 or a Phase III cost cut by a fifth. [sec-lifecycle-options] The baseline cost per approval is 1028 million dollars; the Phase II rise cuts it by 14.9 percent and the cheaper Phase III by 8.1 percent. [sec-lifecycle-options]

## Pitfalls
The ranking of two savings depends on the perturbations chosen, so it is not a general ranking of inputs. Advancing more compounds is not in itself better selection. [sec-lifecycle-options]

## Check yourself
- Q: Why is Phase III cost multiplied by $p_{12}p_{23}$? A: It is paid only if Phases I and II both succeed. [sec-lifecycle-options]
- Q: Is the baseline in the table data? A: No, the values are illustrative. [sec-lifecycle-options]
