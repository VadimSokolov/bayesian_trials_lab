---
id: event-driven-trial
name: Event-driven trial
type: design
aliases: [events are information]
level: 2
summary: A trial that ends when a target number of events has accrued, because the information on the log hazard ratio is proportional to events.
chapters: ['18']
home: sec-survival-info
sections: [sec-survival-traditional, sec-survival-info, sec-survival-regulation, sec-survival]
prerequisites: [time-to-event-endpoint, cox-model, sample-size]
related:
- {rel: uses, to: posterior-distribution}
equations: [eq-sv-var, eq-sv-schoenfeld]
functions: [surv_events_table]
results: []
lab: []
cites: [schoenfeld1981, schoenfeld1983, freedman1982logrank]
---

## What it is
The trial ends not at a fixed sample size but when a target number of events has accrued. [sec-survival] The number of patients enters only through the events they produce, so the design fixes $D$ and lets accrual and follow-up deliver it. [sec-survival-traditional] Inverting the variance gives
$$
D = \frac{4\,(z_{\alpha} + z_{\beta})^2}{(\log \mathrm{HR})^2}
$$
events (eq-sv-schoenfeld). [sec-survival-traditional] The information per event is $I = 1/4$. [sec-survival-traditional]

## Why it matters
With a flat prior, $\theta \mid \text{data} \sim N(\hat\theta, 4/D)$. [sec-survival-info] A prior with standard deviation $s_0$ on the log hazard ratio is worth $4/s_0^2$ events, so $s_0 = 0.2$ is worth 100 events. [sec-survival-info]

## In the book
SELECT used 1,225 planned events for a hazard ratio of 0.83 at 90 percent power. [sec-survival-traditional] About 800 events are needed to be 95 percent sure that an observed 0.80 is below 0.90. [sec-survival-info]

## Pitfalls
Events must be adjudicated and counted by agreed rules, interim timing prespecified, and an actual information fraction off target handled by a prespecified method. [sec-survival-regulation]

## Check yourself
- Q: How many effective events is a prior of standard deviation 0.2 worth? A: 100. [sec-survival-info]
