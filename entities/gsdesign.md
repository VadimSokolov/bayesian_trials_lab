---
id: gsdesign
name: gsDesign
type: software
aliases: []
level: 2
summary: An R package for group sequential design, including spending functions, boundaries, power and sample size calculation.
chapters: [C]
home: sec-software-tools
sections: []
prerequisites: [group-sequential-design, spending-function]
related:
- {rel: alternative-to, to: rpact}
- {rel: uses, to: obrien-fleming-boundary}
equations: []
functions: []
results: []
lab: []
cites: []
---
## What it is
gsDesign is an R package for group sequential design. [sec-software-tools] It includes spending functions and boundaries, and power and sample size calculation. [sec-software-tools]

## Why it matters
A reader can use it to check the book's own boundary code. [sec-software-tools]

## In the book
The book suggests comparing its boundaries with `gs_boundary` and `gs_spending_boundary`. [sec-software-tools] The build machine had gsDesign 3.11.0. [sec-software-tools] The book's own boundary code can be checked against it, which makes gsDesign an independent reference for a calculation the reader would otherwise have to trust. [sec-software-tools] Its listed alternative, rpact 4.4.0 on the build machine, covers confirmatory adaptive design: group sequential designs, sample size reassessment and combination tests, with simulation. [sec-software-tools]

## Pitfalls
The description covers only purpose, so check the documentation for current features. [sec-software-tools]

## Check yourself
- Q: Which bayestrials functions does the book suggest comparing against gsDesign? A: gs_boundary and gs_spending_boundary. [sec-software-tools]
- Q: Which version was installed? A: 3.11.0. [sec-software-tools]
