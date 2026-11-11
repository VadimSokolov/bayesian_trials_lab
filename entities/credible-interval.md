---
id: credible-interval
name: Credible interval
type: concept
aliases: [posterior interval]
level: 1
summary: A region that contains the parameter with stated posterior probability, such as 95%, given the data and the prior.
chapters: ['6']
home: sec-intervals
sections: [6/a-side-by-side, sec-bayes-summary]
prerequisites: [posterior-distribution]
related:
- {rel: contrasts-with, to: confidence-interval}
equations: []
functions: []
results: []
lab: [01-prior-posterior]
cites: []
---
## What it is
A credible interval is a statement about the parameter: given the data and the prior, the probability that $p_1 - p_0$ lies in the interval is 95%. [sec-intervals]

Two regions are common. The equal-tailed interval leaves 2.5% in each tail. The highest posterior density interval is the shortest region with 95% probability. For a skewed posterior they differ. [sec-intervals]

## Why it matters
A confidence interval is a procedure. If the trial were repeated many times, 95% of the intervals would contain the true value. For the one interval in the CSR, the true value is inside or not, and "95%" does not say how likely this interval covers the truth. [sec-intervals]

## In the book
For the running trial the 95% confidence interval for the difference is (0.017, 0.283) and the 95% credible interval is (0.015, 0.277). They are numerically close and mean different things. [sec-intervals]

The distinction matters with an informative prior, where the credible interval shifts and narrows. It also matters near boundaries, where a normal-approximation interval can stray outside $[0,1]$ while a Beta credible interval cannot. [sec-intervals]

Averaged over true rates drawn from the prior, a credible interval covers 95% by construction. [sec-intervals]

## Pitfalls
If the prior is wrong, coverage at a specific $p$ can be off, which is why the FDA draft asks for operating characteristics under a range of scenarios. [sec-intervals] Many trialists read confidence intervals as credible intervals, and in large trials with weak priors they get away with it. [sec-intervals]

## Check yourself
- Q: Which interval supports the statement "the effect is in this range with 95% probability"? A: The credible interval. [sec-intervals]
- Q: Can a Beta credible interval leave $[0,1]$? A: No, by construction. [sec-intervals]
