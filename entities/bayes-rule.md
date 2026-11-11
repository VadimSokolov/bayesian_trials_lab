---
id: bayes-rule
name: Bayes' rule
type: principle
aliases: [Bayes theorem, Bayes's rule]
level: 1
summary: 'The rule that reverses a conditional probability: the posterior is proportional to the prior times the likelihood.'
chapters: ['6']
home: sec-bayes-rule
sections: [sec-bayes, 6/key-points]
prerequisites: []
related:
- {rel: governed-by, to: ich-e9-r1}
equations: [eq-bayes]
functions: []
results: []
lab: [01-prior-posterior]
cites: [savage1954foundations]
---
## What it is
Bayes' rule reverses a conditional probability. A screening test has sensitivity 90%, specificity 95% and the disease has prevalence 2%. Sensitivity is a probability about the test given the disease, but the patient wants the probability of disease given a positive test. [sec-bayes-rule]

Writing the joint probability of disease and positive in two ways gives the answer. The prior $\mathbb{P}(D)$ is the belief before the result, the likelihood is $\mathbb{P}(+ \mid D)$ viewed as a function of the unknown state, and the posterior $\mathbb{P}(D \mid +)$ is the belief after. [sec-bayes-rule]

For a parameter $\theta$ and data $y$: [sec-bayes-rule]

$$
\pi(\theta \mid y) = \frac{p(y \mid \theta)\, \pi(\theta)}{\int p(y \mid \theta')\, \pi(\theta')\, d\theta'} \;\propto\; p(y \mid \theta)\, \pi(\theta),
$$

## Why it matters
In a trial the unknown is no longer disease or not but a continuous quantity such as the response rate or the log hazard ratio, and the prior is a distribution over its values. [sec-bayes-rule] The Bayesian adds the prior and the multiplication. What is given up is practical: the answer depends on a prior that must be chosen, defended and written into the protocol. [sec-bayes-rule]

## In the book
A patient with a positive test has a 27% chance of having the disease, not 90%, because the disease is rare and most positives come from the large healthy group. [6/key-points]

ICH E9 permits Bayesian approaches when the reasons are clear and the conclusions sufficiently robust. It does not forbid them. [sec-bayes]

## Pitfalls
The denominator does not depend on $\theta$. It only rescales the product to integrate to one. [sec-bayes-rule]

## Check yourself
- Q: A test is 90% sensitive and 95% specific, prevalence 2%. Is a positive result 90% likely to mean disease? A: No, about 27%. [6/key-points]
- Q: What is the shape of the posterior? A: The prior times the likelihood. [sec-bayes-rule]
