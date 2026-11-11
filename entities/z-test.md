---
id: z-test
name: z test
type: method
aliases: [normal approximation test]
level: 1
summary: 'The randomization test with a bell curve in place of shuffling: the difference divided by its standard error, read against a standard normal.'
chapters: ['4']
home: sec-testing-z
sections: [4/key-points]
prerequisites: [sampling-distribution]
related:
- {rel: alternative-to, to: randomization-test}
- {rel: precedes, to: confidence-interval}
equations: [eq-testing-z]
functions: [z_test_binary]
results: []
lab: [00-are-they-different]
cites: []
---
## What it is
Under the null, the difference in response rates is approximately normal with mean zero. The statistic uses the pooled rate $\bar p = (x_0 + x_1)/(2n)$: [sec-testing-z]

$$
Z = \frac{\hat p_1 - \hat p_0}{\sqrt{2\bar p(1-\bar p)/n}} .
$$

This is equation eq-testing-z. [sec-testing-z] The reason is the central limit theorem: the observed difference is an average of many small independent contributions. [sec-testing-z] $Z$ counts standard errors from zero, and $z_{0.025} = 1.96$. [sec-testing-z]

## Why it matters
It replaces heavy shuffling with a formula. [sec-testing-z] The z test is an approximation that is least reliable for binary outcomes at moderate $n$ close to the threshold. [4/key-points]

## In the book
For the binary trial $\bar p = 0.375$, the standard error is 0.0685 and $Z = 2.19$. The one-sided p-value is 0.014 and the two-sided one is 0.029. For the continuous trial $Z = 4.69/1.83 = 2.56$. [sec-testing-z] The randomization test gives one-sided 0.021 for the binary trial, because its tail includes the whole step at 0.15. A continuity correction moves the cutoff to 0.14, giving $Z = 2.04$ and a one-sided p-value near 0.021. [sec-testing-z]

## Pitfalls
With a binary endpoint, moderate $n$ and a p-value near the threshold, the choice of statistic can change the verdict, so the analysis plan names the test exactly. [sec-testing-z] The approximation fails when responses are rare, $n$ is small or extreme values dominate the mean. [sec-testing-z]

## Check yourself
- Q: Why is the pooled rate used? A: The null says both arms have the same $p$. [sec-testing-z]
- Q: Why do shuffling and the z test differ for the binary trial? A: Shuffled differences move in steps and the normal curve effectively counts only half of the step at 0.15. [sec-testing-z]
