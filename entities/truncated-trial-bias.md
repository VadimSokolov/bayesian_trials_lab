---
id: truncated-trial-bias
name: Truncated trial bias
type: concept
aliases: [early stopping bias, truncated trials overestimate]
level: 2
summary: A trial stopped early because the observed effect was large overstates the true effect, and a boundary does nothing for the estimate at stopping.
chapters: ['11', '14']
home: 11/truncated-trials-overestimate-bassler-and-colleagues-2010
sections: [11/truncated-trials-overestimate-bassler-and-colleagues-2010, 11/what-a-dmc-does]
prerequisites: [group-sequential-design, interim-analysis]
related:
- {rel: special-case-of, to: winners-curse}
- {rel: alternative-to, to: shrinkage}
equations: []
functions: []
results: []
lab: [07-interim-looks]
cites: [bassler2010truncated, pocock1989practical, montori2005randomized, freidlin2009stopping, whitehead1986bias]
---

## What it is

A trial that stops at an early look because it crossed a boundary stopped because the observed effect was large, and a large observed effect is more likely to be a positive deviation from the truth. The estimate is biased away from the null. The bias is bigger the smaller the trial and the earlier the stop. [11/what-a-dmc-does]

## Why it matters

A boundary controls the type I error but does nothing for the point estimate at stopping. Even an O'Brien-Fleming design is not immune. A trial stopped early should report its estimate with the information fraction and the interval in view. [11/truncated-trials-overestimate-bassler-and-colleagues-2010]

## In the book

Bassler and colleagues matched 91 randomized trials stopped early for benefit, asking 63 distinct questions, to 424 nontruncated trials. The pooled ratio of relative risks was 0.71 (95% confidence interval 0.65 to 0.77), so truncated trials gave on average a 29 percent lower relative risk. [11/truncated-trials-overestimate-bassler-and-colleagues-2010]

The difference was independent of whether a statistical stopping rule was present and of methodological quality, and it was greatest in smaller studies. [11/truncated-trials-overestimate-bassler-and-colleagues-2010]

The frequentist remedy is a bias-adjusted estimator, and a shrinkage prior is the Bayesian answer. [11/truncated-trials-overestimate-bassler-and-colleagues-2010]

## Pitfalls

- The size of the problem is debated. Freidlin and Korn argue the bias is smaller when boundaries are conservative. [11/truncated-trials-overestimate-bassler-and-colleagues-2010]
- Bayesian shrinkage can reduce upward selection bias, but its bias and coverage depend on the prior and should be evaluated under the stopping rule. [11/truncated-trials-overestimate-bassler-and-colleagues-2010]

## Check yourself

- Q: What ratio of relative risks did Bassler and colleagues find? A: 0.71, truncated over nontruncated. [11/truncated-trials-overestimate-bassler-and-colleagues-2010]
- Q: Does a conservative boundary remove the bias? A: No, it controls type I error but not the estimate at stopping. [11/truncated-trials-overestimate-bassler-and-colleagues-2010]
