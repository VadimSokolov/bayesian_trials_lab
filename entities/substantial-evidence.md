---
id: substantial-evidence
name: Substantial evidence
type: regulation
aliases: [regulatory standard, substantial evidence of effectiveness]
level: 1
summary: 'The legal standard for approving a drug: evidence from adequate and well-controlled investigations that qualified experts could fairly and responsibly read as showing the claimed effect.'
chapters: ['3', '1', '23']
home: 3/what-the-statute-says
sections: [sec-regulatory-law, 3/what-the-standard-implies-for-the-numbers, 3/key-points, sec-regulatory, sec-regulatory-force, 3/the-1997-amendment-one-trial-and-confirmatory-evidence]
prerequisites: [clinical-trial]
related:
- {rel: special-case-of, to: adequate-and-well-controlled-investigation}
- {rel: precedes, to: one-trial-with-confirmatory-evidence}
- {rel: uses, to: one-sided-test}
- {rel: contrasts-with, to: requires-recommends-permits}
equations: []
functions: []
results: []
lab: [11-substantial-evidence]
cites: [fdc_act_505d]
---
## What it is
Section 505(d) of the Federal Food, Drug, and Cosmetic Act directs FDA to refuse approval if there is a lack of substantial evidence that the drug has the claimed effect under the labeled conditions of use. [3/what-the-statute-says] The Act defines substantial evidence as evidence consisting of adequate and well-controlled investigations. [3/what-the-statute-says]

## Why it matters
Everything in the book is aimed at this finding. [sec-regulatory] The standard is one of evidence and not of method: the statute names no test, level, sample size, prior or design. [3/what-the-statute-says] That gap is where Bayesian and adaptive design choices live. [sec-regulatory]

## In the book
The statute speaks of investigations in the plural, and for decades FDA read that as two independent positive trials. [3/what-the-statute-says] Since the 1997 FDAMA amendment, one adequate and well-controlled trial plus confirmatory evidence can also meet the standard. [3/the-1997-amendment-one-trial-and-confirmatory-evidence] Two trials each tested at one-sided 0.025 pass a useless drug with probability $0.025 \times 0.025 = 1/1600$. [3/what-the-standard-implies-for-the-numbers] One trial at 0.025 passes a useless drug 1 time in 40. [3/what-the-standard-implies-for-the-numbers] So one very persuasive trial and two ordinary trials can give comparable protection against a false positive. [3/what-the-standard-implies-for-the-numbers]

## Pitfalls
- Frequentist testing at one-sided 0.025 became customary, but the law does not mention it. [3/what-the-statute-says]
- A statute binds, but a guidance only recommends, so a draft is never "FDA requirements". [sec-regulatory-force]

## Check yourself
- Q: Does the statute name a significance level? A: No, it names no test, level, sample size, prior or design. [3/what-the-statute-says]
- Q: What is the chance that a useless drug passes two independent trials at one-sided 0.025? A: 1/1600. [3/what-the-standard-implies-for-the-numbers]
