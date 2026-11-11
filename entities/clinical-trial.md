---
id: clinical-trial
name: Clinical trial
type: concept
aliases: [trial]
level: 1
summary: A trial is a measurement of a treatment effect and, at the same time, the basis for a decision to approve, continue or stop.
chapters: ['1', '2', '4']
home: sec-decision-setting
sections: [sec-decision-select, sec-decision-traditional, 1/the-price-of-a-trial-of-being-wrong-and-of-waiting]
prerequisites: []
related:
- {rel: part-of, to: drug-development}
- {rel: uses, to: decision-theory}
equations: []
functions: []
results: []
lab: [12-decisions]
cites: [cox1958planning, lincoff2023semaglutide, ryan2020select, moore_pivotal_costs_2018]
---
## What it is
A clinical trial assigns patients to treatments and follows them to compare outcomes, and the book frames it as a measurement and a decision at once. [sec-decision-setting] The traditional trial compares a new treatment with control, randomizing patients one to one and testing a null hypothesis that the treatment is no better than control. [sec-decision-traditional] Patient outcomes swing with the natural history of the disease, the environment, the psychological response to being treated and supportive care. D. R. Cox called this "large uncontrolled variations". [sec-decision-setting] Because the variation between patients is large and cannot be removed, a single trial can never prove anything. It can only change what we believe, and then someone has to act: approve or not, continue or stop, give the next patient drug A or drug B. [sec-decision-setting]

## Why it matters
The traditional apparatus was built to make the measurement honest and to put a fixed ceiling on one kind of wrong decision. [sec-decision-setting] The book asks what changes when the decision is put in the foreground. [sec-decision-setting] A pivotal trial is also costly: the median estimated cost was $19.0 million per trial for 138 pivotal trials behind 59 novel agents. [1/the-price-of-a-trial-of-being-wrong-and-of-waiting]

## In the book
SELECT randomized 17,604 adults with overweight or obesity and established cardiovascular disease, without diabetes, to weekly semaglutide 2.4 mg or placebo, at 804 sites in 41 countries. [sec-decision-select] The primary composite endpoint occurred in 569 of 8,803 patients on semaglutide and 701 of 8,801 on placebo, a hazard ratio of 0.80 with a 95 percent confidence interval from 0.72 to 0.90. [sec-decision-select] The trial was designed for a hazard ratio of 0.83 with 90 percent power at one-sided 0.025 and 1,225 planned events. [sec-decision-select]

## Pitfalls
A trial is not a proof. The traditional design is coherent, and its central strength is that the type I error rate is a promise about the procedure, made before any data exist. [sec-decision-traditional]

## Check yourself
- Q: Why can one trial never prove that a drug works? A: Variation between patients is large and cannot be removed, so a trial can only change belief. [sec-decision-setting]
- Q: What two roles does a trial play? A: It is a measurement and a decision. [sec-decision-setting]
