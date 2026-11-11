---
id: confidence-interval
name: Confidence interval
type: concept
aliases: [CI]
level: 1
summary: The range of effect sizes the data do not rule out; the 95 percent describes the long-run record of the method, not one interval.
chapters: ['4', '6']
home: sec-testing-ci
sections: [4/what-the-95-refers-to, 4/tests-and-intervals-are-the-same-thing, 4/key-points]
prerequisites: [sampling-distribution]
related:
- {rel: contrasts-with, to: credible-interval}
- {rel: uses, to: p-value}
equations: [eq-testing-ci]
functions: [wald_ci, sim_two_arm_binary]
results: []
lab: [00-are-they-different]
cites: [newcombe1998interval]
---
## What it is
For an approximately normal estimator the 95% interval is the estimate plus and minus 1.96 standard errors: [sec-testing-ci]

$$
\hat\theta \;\pm\; 1.96 \times \mathrm{SE}(\hat\theta) .
$$

This is equation eq-testing-ci. [sec-testing-ci] The 95% is about the procedure: if the trial were rerun many times, about 95% of the intervals would contain the true effect. [4/what-the-95-refers-to]

## Why it matters
A p-value says whether the data are compatible with no effect, not what effect is likely. [sec-testing-ci] ICH E9 section 5.5 asks that estimates "should be accompanied by confidence intervals, whenever possible". [sec-testing-ci] Test and interval are one calculation: the 95% two-sided interval holds exactly the values a two-sided 5% test would not reject. [4/tests-and-intervals-are-the-same-thing]

## In the book
For the binary trial the interval for the risk difference is $0.15 \pm 0.132$, that is 0.017 to 0.283, so a gain of 2 points and one of 28 are both compatible. For the continuous trial it is 1.10 to 8.28 mmHg. [sec-testing-ci] Newcombe compared the score-based interval with ten other methods. [4/what-the-95-refers-to]

## Pitfalls
It is not a 95% chance that the true difference lies in 0.017 to 0.283. A statement of that form is a credible interval and needs a prior. [4/what-the-95-refers-to] The test and interval agree exactly only with the same standard error. [4/tests-and-intervals-are-the-same-thing] The analysis plan should name the interval method. [4/what-the-95-refers-to]

## Check yourself
- Q: In 50 reruns, how many intervals should miss the truth? A: About 2 or 3 (5 percent of 50 is 2.5), though in 50 trials the count is itself random. [4/what-the-95-refers-to]
- Q: What does a one-sided 0.025 test amount to? A: Rejecting essentially when the lower limit of the two-sided 95% interval is above zero. [4/tests-and-intervals-are-the-same-thing]
