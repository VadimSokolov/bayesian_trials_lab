---
id: ich-e11a
name: ICH E11A
type: regulation
aliases: [E11A, pediatric extrapolation guideline]
level: 2
summary: ICH guideline on pediatric extrapolation, adopted at Step 4 in August 2024, requiring a plan that assesses similarity between adult and pediatric populations.
chapters: ['19', '3']
home: sec-borrowing-pediatric
sections: [sec-borrowing, sec-borrowing-pediatric, sec-borrowing-guide]
prerequisites: [pediatric-extrapolation]
related:
- {rel: part-of, to: ich}
equations: []
functions: []
results: []
lab: [09-adaptive-bayesian]
cites: [ich_e11a_2024]
---
## What it is

ICH E11A is the guideline on pediatric extrapolation, adopted at Step 4 in August 2024. It is a framework for deciding how much pediatric efficacy can be inferred from adult or other source data, with a place for Bayesian methods in the quantitative part. [sec-borrowing]

## Why it matters

The guideline asks for a *pediatric extrapolation plan* with three parts. The first assesses how similar the disease, the drug's pharmacology and the response to treatment are in source (adult) and target (pediatric) populations. The second describes gaps and uncertainties. The third plans the data to be generated in children, from PK and safety only (full extrapolation of efficacy) to a reduced efficacy trial to a full one. [sec-borrowing-pediatric] The more similar the populations, the less pediatric data are needed. [sec-borrowing-pediatric]

## In the book

Bayesian borrowing is one of the quantitative tools for the middle case, in which adult data inform the pediatric efficacy analysis. [sec-borrowing-pediatric] The guideline emphasizes that the evidence-based judgment of similarity comes first and the statistics second. [sec-borrowing-pediatric] The book's decision guide says to begin with the E11A plan and write the similarity judgment as a number ($\omega$, $a_0$ or $w$). [sec-borrowing-guide]

## Pitfalls

The guideline does not make the statistics the starting point. The similarity judgment should be defended with the pharmacology and the case in which it is wrong should be simulated. [sec-borrowing-guide]

## Check yourself

- Q: What range of pediatric data does the plan allow? A: From PK and safety only to a reduced efficacy trial to a full one. [sec-borrowing-pediatric]
- Q: When was E11A adopted? A: At Step 4 in August 2024. [sec-borrowing]
