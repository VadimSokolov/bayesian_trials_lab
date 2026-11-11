---
id: maxsprt
name: MaxSPRT
type: method
aliases: [maximized sequential probability ratio test]
level: 3
summary: A sequential Poisson test for drug and vaccine surveillance whose log likelihood ratio is maximized over relative risks above one.
chapters: ['13']
home: sec-safety-aggregate
sections: [sec-safety-aggregate]
prerequisites: [wald-sprt, likelihood-ratio]
related:
- {rel: part-of, to: aggregate-safety-assessment}
- {rel: contrasts-with, to: e-value}
equations: []
functions: []
results: []
lab: []
cites: [kulldorff2011maxsprt]
---
## What it is

Kulldorff and colleagues proposed a maximized sequential probability ratio test for drug and vaccine safety surveillance. [sec-safety-aggregate] With a Poisson count $c$ against an expected count $\mu_0$ under no excess risk, the statistic is the log likelihood ratio maximized over relative risks above one, $c\log(c/\mu_0) - (c-\mu_0)$ when $c > \mu_0$. [sec-safety-aggregate]

## Why it matters

It is the likelihood-ratio machinery of the e-value chapter with a fixed alternative replaced by its maximum. [sec-safety-aggregate] A signal is declared when it crosses a critical value calibrated for the planned surveillance. [sec-safety-aggregate]

## In the book

Because the alternative is maximized, it needs a critical value from calibration rather than the $1/\alpha$ of an e-value. [sec-safety-aggregate] Surveillance of marketed products and vaccines is sequential in the Wald sense. [sec-safety-aggregate]

## Pitfalls

- A signal is a trigger or a hypothesis for review depending on what the safety plan states. [sec-safety-aggregate]

## Check yourself

- Q: Why does MaxSPRT not use the threshold $1/\alpha$? A: It maximizes over alternatives, so its critical value needs calibration. [sec-safety-aggregate]
