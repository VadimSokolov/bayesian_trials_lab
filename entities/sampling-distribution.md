---
id: sampling-distribution
name: Sampling distribution of a trial result
type: concept
aliases: [rerun ten thousand times]
level: 1
summary: The pattern of observed differences if the same trial were rerun many times given a truth; its width is the standard error.
chapters: ['4']
home: sec-testing-sampling
sections: [sec-testing-permutation, sec-testing]
prerequisites: [two-group-comparison]
related:
- {rel: uses, to: p-value}
- {rel: uses, to: confidence-interval}
- {rel: uses, to: z-test}
equations: [eq-testing-se]
functions: [sim_two_arm_binary]
results: []
lab: [00-are-they-different]
cites: []
---
## What it is
Rerun the binary trial ten thousand times, with 100 new patients per arm each time, and compute the observed difference in response rates each time. The histogram is the sampling distribution of the observed difference. [sec-testing-sampling] Its standard deviation is the standard error:

$$
\mathrm{SE}(\hat\theta) = \sqrt{\frac{p_0(1-p_0)}{n} + \frac{p_1(1-p_1)}{n}} ,
$$

which is equation eq-testing-se. For the book's numbers it is 0.0676. [sec-testing-sampling]

## Why it matters
Every test and interval in the chapter is a way of reading this distribution. [sec-testing] The standard error shrinks like $1/\sqrt{n}$, so halving it requires quadrupling the trial, and it grows with the variability of the outcome. [sec-testing-sampling]

## In the book
With a true effect of 0.15 the histogram is centered on the truth, so the observed difference is unbiased, but its standard deviation is about 0.067. In about 1.7% of reruns a drug that truly works shows no benefit or a harm. [sec-testing-sampling] With no effect, in roughly 1.0% of reruns the observed difference is 0.15 or larger. [sec-testing-sampling] That share is a p-value built from the picture. [sec-testing-sampling] For the continuous endpoint the standard error is $\sigma\sqrt{2/n} = 12\sqrt{2/100} = 1.70$ mmHg. [sec-testing-sampling]

## Pitfalls
A real trial does not know that both arms share one rate, so it cannot read the null histogram directly. The randomization test and the z test are two ways to learn it from one trial. [sec-testing-sampling]

## Check yourself
- Q: What is the observed difference on average? A: The true effect, so it is unbiased, though wrong in any single trial. [sec-testing-sampling]
- Q: How much more data halves the standard error? A: Four times as many patients. [sec-testing-sampling]
