---
id: stan
name: Stan
type: software
aliases: []
level: 2
summary: A probabilistic programming language for Bayesian inference by Hamiltonian Monte Carlo, used when conjugate formulas are not available.
chapters: [C]
home: sec-software-tools
sections: []
prerequisites: [posterior-distribution]
related:
- {rel: contrasts-with, to: conjugate-prior}
equations: []
functions: []
results: []
lab: []
cites: []
---
## What it is
Stan is a probabilistic programming language for Bayesian inference by Hamiltonian Monte Carlo. [sec-software-tools]

## Why it matters
Stan and brms are used to fit analysis models when conjugate formulas are not available. [sec-software-tools]

## In the book
The build machine had rstan 2.32.7. [sec-software-tools] trialr fits its Bayesian clinical trial designs, including dose-finding and phase II designs, with Stan. [sec-software-tools] brms fits multilevel models through Stan with a formula interface, so a reader can use Stan without writing the model code. [sec-software-tools] The packages listed in the book are on CRAN, except bcrm. [sec-software-tools]

## Pitfalls
The descriptions in the book cover only the purpose of each tool, so a reader should consult the documentation for current features and versions. [sec-software-tools]

## Check yourself
- Q: What algorithm does Stan use? A: Hamiltonian Monte Carlo. [sec-software-tools]
- Q: When does the book reach for Stan or brms? A: When conjugate formulas are not available. [sec-software-tools]
