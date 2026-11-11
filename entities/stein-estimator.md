---
id: stein-estimator
name: Stein estimator
type: method
aliases: [James-Stein, Efron and Morris]
level: 3
summary: For three or more normal means the raw group averages are inadmissible under total squared error, and shrunken estimates beat them whatever the true means are.
chapters: ['10']
home: 10/stein-efron-and-morris-and-the-batting-averages
sections: [10/stein-efron-and-morris-and-the-batting-averages, 10/key-points]
prerequisites: [shrinkage]
related:
- {rel: precedes, to: empirical-bayes}
equations: []
functions: []
results: []
lab: []
cites: [stein1956inadmissibility, james1961estimation, efron1975data, efron1977steins]
---

## What it is

Stein showed that for three or more means in a multivariate normal model with known variances, the usual estimate (each group's own average) is inadmissible under total squared-error loss. Some estimator has smaller total squared error whatever the true means are. James and Stein gave one explicitly. [10/stein-efron-and-morris-and-the-batting-averages]

## Why it matters

It is the classical theorem behind shrinkage. [10/stein-efron-and-morris-and-the-batting-averages]

## In the book

Efron and Morris used early-season batting averages. Estimates shrunk toward the league mean predicted the rest of the season better than the raw averages did for most players, and the improvement came largely from the extreme players. [10/stein-efron-and-morris-and-the-batting-averages]

A player who hits 1 for 19 against one pitcher looks like evidence he cannot hit that pitcher. But there are many pitchers, and a hierarchical analysis across all of them gives an estimate lower than average but much nearer to it than 1/19. [10/stein-efron-and-morris-and-the-batting-averages]

## Pitfalls

- The theorem concerns that model and that loss. It does not show that the empirical-Bayes fit in the ulcer analysis improves every arm, the selected contrast, posterior coverage or a clinical decision. [10/stein-efron-and-morris-and-the-batting-averages]
- The key points repeat the limit: this is not a guarantee for any fitted procedure. [10/key-points]

## Check yourself

- Q: With how many means does the result start to hold? A: Three or more. [10/stein-efron-and-morris-and-the-batting-averages]
- Q: Where did the batting-average gain come from? A: Largely from the extreme players. [10/stein-efron-and-morris-and-the-batting-averages]
