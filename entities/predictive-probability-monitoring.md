---
id: predictive-probability-monitoring
name: Predictive probability monitoring
type: method
aliases: [Lee-Liu design, phase 2 monitoring]
level: 2
summary: A phase 2 design that stops for futility or efficacy when the predictive probability of final success crosses a lower or upper threshold, with a printed stopping table.
chapters: ['15']
home: sec-leeliu
sections: [15/what-the-predictive-probability-design-is-and-is-not, 15/the-economic-threshold-pp]
prerequisites: [predictive-probability-of-success, phase-2-trial]
related:
- {rel: alternative-to, to: simon-two-stage-design}
- {rel: used-in, to: bnt162b2-trial}
equations: [eq-marion, eq-ppstar]
functions: [lee_liu_table, lee_liu_oc, p2_pp_star]
results: []
lab: [07-interim-looks]
cites: [leeliu2008, marion2025, johns1999predictive]
---
## What it is

Lee and Liu turned the predictive probability of success into a two-threshold monitoring design for phase 2 with a printed stopping table [sec-leeliu]. After each cohort compute the predictive probability that the trial ends in success; stop for futility if it is below $\eta_L$, stop for efficacy if above $\eta_U$, otherwise continue [sec-leeliu]. At the maximum sample size success needs $\Pr(p > p_0 \mid \text{data}) > \eta$ [sec-leeliu]. The predictive probability is approximated by

$$
\mathrm{PP} \approx \Phi\!\left(\frac{\Phi^{-1}(q_n) - \Phi^{-1}(\eta)\sqrt{r}}{\sqrt{1-r}}\right),
$$

[sec-leeliu]

## Why it matters

The rule depends only on $(n, s)$, so the decision for every interim outcome can be tabulated before the trial and printed in the protocol [sec-leeliu]. It computes a boundary in a Bayesian way and judges it in a frequentist way [15/what-the-predictive-probability-design-is-and-is-not].

## In the book

With $N = 40$, $p_0 = 0.20$, thresholds 0.05 and 0.95 and looks after 10, 20 and 30 patients, futility stops are at 0 responders after 10, 3 or fewer after 20, and 7 or fewer after 30 [sec-leeliu]. Efficacy stops are at 6 or more after 10, 9 or more after 20, and twelve or more after 30 [sec-leeliu]. Operating characteristics follow from exact enumeration, power is essentially unchanged and the sample size falls by roughly a third [sec-leeliu].

## Pitfalls

Once efficacy stopping is allowed, the type I error is not guaranteed to stay at the fixed-design value, so thresholds need recalibration [sec-leeliu]. The thresholds 0.05 and 0.95 are conventions; an economic reading gives (eq-ppstar)

$$
\mathrm{PP}^* = \frac{m c_2}{\rho V - (1-\rho) c_3},
$$

[15/the-economic-threshold-pp]

## Check yourself

- Q: How many responders out of 10 stop the trial for futility in the example? A: None, that is zero responders [sec-leeliu].
- Q: Is the type I error guaranteed after adding efficacy looks? A: No, recalibrate by enumeration or simulation [sec-leeliu].
