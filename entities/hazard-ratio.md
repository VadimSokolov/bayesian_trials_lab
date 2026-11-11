---
id: hazard-ratio
name: Hazard ratio
type: concept
aliases: [HR]
level: 1
summary: The ratio of event hazards between arms, a clean summary only when hazards are proportional.
chapters: ['18', '6']
home: sec-survival-traditional
sections: [sec-survival-traditional, sec-survival-nph, sec-survival-nph-tests, sec-survival-regulation, sec-survival, sec-survival-info]
prerequisites: [time-to-event-endpoint]
related:
- {rel: contrasts-with, to: restricted-mean-survival-time}
equations: []
functions: []
results: []
lab: []
cites: [cox1972regression, struthers1986misspecified, hernan2010hazards, trinquart2016rmst]
---

## What it is
The hazard ratio compares the instantaneous event rates of two arms. The book's convention is benefit-positive: $\theta = -\log \mathrm{HR}$ is positive when treatment reduces the hazard. [sec-survival-traditional]

## Why it matters
Sample size in event units depends on it. SELECT was designed for a hazard ratio of 0.83 with 90 percent power and 1,225 events. [sec-survival-traditional] A hazard ratio of 0.90 needs far more events, so tens of thousands of patients followed for years. [sec-survival-traditional]

## In the book
Under non-proportional hazards one hazard ratio misdescribes both phases of an effect. [sec-survival-nph] In the book's scenarios the cumulative hazard ratio at five years is not constant, "which is the point". [sec-survival-nph] Across 54 oncology trials, the hazard ratio gave on average a larger effect than the ratio of restricted mean survival times (average ratio 1.11). [sec-survival-nph-tests] The label summary is still usually a hazard ratio. [sec-survival-regulation]

## Pitfalls
A hazard ratio is one summary measure among others, such as the RMST difference. The choice is made before the trial. [sec-survival]

## Check yourself
- Q: Is a hazard ratio of 0.8 a 20 percent hazard reduction? A: Yes. [sec-survival-info]
