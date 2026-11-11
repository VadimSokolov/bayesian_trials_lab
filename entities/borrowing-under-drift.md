---
id: borrowing-under-drift
name: Borrowing under drift
type: concept
aliases: [drift, cost of borrowing]
level: 2
summary: The type I error inflation and power change that borrowing causes when the true current control rate differs from the historical rate.
chapters: ['19']
home: sec-borrowing-drift
sections: [sec-borrowing-drift, sec-borrowing-regulator, sec-borrowing-ess, sec-borrowing-sidebyside]
prerequisites: [bayesian-borrowing, type-i-error, power]
related:
- {rel: uses, to: power-prior}
- {rel: uses, to: robust-mixture-prior}
- {rel: governed-by, to: fda-bayesian-draft-guidance-2026}
equations: []
functions: [borrow_reject_prob, borrow_decision_table, borrow_priors]
results: []
lab: [09-adaptive-bayesian]
cites: [viele2014, kopp2020power, galwey2017dynamic, rover2020shrinkage, fda_bayesian_2026]
---
## What it is

Drift is the gap between the true current control rate and the historical rate. The central calculation takes 60 treated and 30 control patients, a historical arm of 30 responders in 100, and the rule $\Pr(\delta>0 \mid \text{data}) > 0.975$. It compares no borrowing, full pooling, a power prior with $a_0=0.3$ and a robust mixture, for drift from $-0.15$ to $+0.20$. The enumeration is exact. [sec-borrowing-drift]

## Why it matters

Without drift, borrowing buys power: matching the power of full pooling without borrowing would need roughly 170 control patients rather than 30. [sec-borrowing-drift] With upward drift it inflates type I error, and with downward drift it costs power. Neither is controlled by the trial. [sec-borrowing-drift]

## In the book

The type I error without borrowing barely moves, which is what the traditional design buys by discarding prior data. [sec-borrowing-drift] The robust prior is not a cure at a ten point drift. [sec-borrowing-drift] Kopp-Schneider and colleagues show that borrowing cannot improve power over an optimal current-data test while preserving strict conditional type I error control. [sec-borrowing-regulator] FDA asks for the prior effective sample size, conflict simulations including a no-effect scenario and sensitivity analyses, and does not recommend measuring borrowing by type I error inflation. [sec-borrowing-regulator] If the true control rate is 40% instead of 30%, the type I error is 14.6% under full pooling, 5.4% under the power prior and 8.9% under the robust prior, and at a 20 point drift full pooling rejects 52% of the time. [sec-borrowing-drift] A sponsor should report the type I error at the edge of the drift range it considers plausible. [sec-borrowing-regulator]

## Pitfalls

A cap on borrowing, such as 30% to 50%, and a recalibrated threshold are two protective devices, each of which gives up part of the gain. [sec-borrowing-regulator] Reporting only the no-drift column hides the price. [sec-borrowing-regulator]

## Check yourself

- Q: Predict the direction: a true control rate above history, does a borrowing rule reject a true null more or less often? A: More often. [sec-borrowing-drift]
- Q: What does drift below history cost? A: Power. [sec-borrowing-drift]
