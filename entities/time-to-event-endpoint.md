---
id: time-to-event-endpoint
name: Time-to-event endpoint
type: concept
aliases: [survival analysis, time to event]
level: 1
summary: An endpoint measured as the time to death, progression or another event, with patients censored if the event has not happened by last contact.
chapters: ['18']
home: sec-survival
sections: [sec-survival-traditional, sec-survival-info]
prerequisites: [clinical-trial, estimand]
related:
- {rel: used-in, to: event-driven-trial}
- {rel: governed-by, to: ich-e9-r1}
equations: []
functions: []
results: []
lab: []
cites: [kaplan1958nonparametric, ich_e9_r1, fda_oncology_endpoints_2018]
---

## What it is
Let $T$ be the event time and $S(t) = \Pr(T > t)$ the survival function. The hazard is $h(t) = \lim_{\delta \to 0}\Pr(t \le T < t + \delta \mid T \ge t)/\delta$, the cumulative hazard is $H(t) = \int_0^t h(u)\,du$, and $S(t) = e^{-H(t)}$. [sec-survival-traditional] Patients event-free at the data cutoff, or lost to follow-up, are censored: their event time is only known to exceed the last contact. [sec-survival-traditional]

## Why it matters
Most confirmatory trials in cardiology and oncology are event driven. The endpoint is the time to death, progression or a major adverse cardiovascular event. [sec-survival] The estimand must name the population, the variable, the handling of intercurrent events and the summary measure, chosen before the trial. [sec-survival]

## In the book
SELECT planned 1,225 events and observed 1,270, and REWIND observed 1,257. A trial of 17,604 patients is, statistically, a trial of about 1,270 events. [sec-survival]

## Pitfalls
The information is the number of events of the primary endpoint as defined, so any change to the definition or its intercurrent-event handling changes the information. [sec-survival-traditional]

## Check yourself
- Q: What does a censored patient's record tell you? A: The event time exceeds the last contact. [sec-survival-traditional]
- Q: What does a time-to-event trial wait for? A: A target number of events, not a fixed sample size. [sec-survival]
