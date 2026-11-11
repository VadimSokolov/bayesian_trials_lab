---
id: conditional-power
name: Conditional power
type: concept
aliases: [CP, stochastic curtailment]
level: 2
summary: The probability that the final statistic exceeds the critical value, given the interim data and an assumed value of the treatment effect.
chapters: ['15']
home: 15/conditional-power
sections: [15/futility-rules, 15/from-conditional-power-to-predictive-probability]
prerequisites: [power, information-fraction, data-monitoring-committee]
related:
- {rel: uses, to: group-sequential-design}
- {rel: contrasts-with, to: predictive-probability-of-success}
- {rel: governed-by, to: fda-adaptive-design-guidance-2019}
equations: [eq-cp]
functions: [cond_power]
results: []
lab: [07-interim-looks]
cites: [lan1988bvalue, lan1982curtailed, halperin1982aid, proschan2006monitoring, lachin2005review]
---
## What it is

Conditional power is the probability that the final statistic $Z_1$ exceeds the critical value $z_\alpha$, given the interim data and an assumed value of the effect [15/conditional-power]. With the B-value $B_t = Z_t\sqrt{t}$ and drift $\xi$, the future increment is normal whatever the past was, so

$$
\mathrm{CP}(\xi) = \Pr(Z_1 > z_\alpha \mid Z_t) = 1 - \Phi\!\left(\frac{z_\alpha - Z_t\sqrt{t} - \xi(1-t)}{\sqrt{1-t}}\right).
$$

[15/conditional-power]

## Why it matters

It answers "could this trial still win?" and is the basis of stochastic curtailment: stop when the outcome is nearly decided [15/conditional-power]. A futility rule may stop if $\mathrm{CP}(\xi_a) < 0.10$ or $0.20$ [15/futility-rules].

## In the book

Three choices of $\xi$ are in use: the design alternative $\xi = z_\alpha + z_\beta$, the current trend $\xi = Z_t/\sqrt{t}$, and the null $\xi = 0$ [15/conditional-power]. At half the information of a trial designed with 90 percent power at one-sided 0.025, a trial exactly on the null path still has positive conditional power under the design alternative [15/conditional-power].

## Pitfalls

It treats $\xi$ as fixed and known, so it gives no credit for uncertainty about the effect [15/conditional-power]. A DMC that reports only one of the numbers has made a modeling choice without saying so [15/conditional-power]. It is a decision tool, not an inferential one, and futility stopping can only reduce the chance of rejecting, so it never inflates type I error [15/futility-rules]. The Bayesian remedy is [[predictive-probability-of-success]] [15/from-conditional-power-to-predictive-probability].

## Check yourself

- Q: Which choice of drift is optimistic after a poor interim? A: The design alternative [15/conditional-power].
- Q: Does a non-binding futility rule protect the type I error if the DMC ignores it? A: Yes, the final test is at the full $\alpha$ whether or not the rule is followed [15/futility-rules].
