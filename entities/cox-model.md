---
id: cox-model
name: Cox model
type: method
aliases: [Cox proportional hazards]
level: 2
summary: A regression model for the hazard with an unspecified baseline, whose treatment coefficient is the log hazard ratio.
chapters: ['18']
home: sec-survival-traditional
sections: [sec-survival-traditional, sec-survival-nph]
prerequisites: [hazard-ratio, time-to-event-endpoint]
related:
- {rel: uses, to: proportional-hazards}
- {rel: uses, to: log-hazard-ratio}
equations: [eq-sv-var]
functions: []
results: []
lab: []
cites: [cox1972regression, cox1975partial, schoenfeld1981, schoenfeld1983, struthers1986misspecified, hernan2010hazards]
---

## What it is
The Cox model writes $h(t \mid z) = h_0(t)e^{-\theta z}$ for a treatment indicator $z$, leaves $h_0(t)$ unspecified, and estimates $\theta = -\log \mathrm{HR}$ from the partial likelihood. [sec-survival-traditional] Under 1:1 allocation the variance of $\hat\theta$ is approximately
$$
\operatorname{Var}(\hat\theta) \approx \frac{4}{D},
$$
where $D$ is the total number of events (eq-sv-var). [sec-survival-traditional]

## Why it matters
The patients enter only through the events they produce. [sec-survival-traditional] Stratified randomization calls for a baseline hazard per stratum. Adding covariates changes the meaning of the hazard ratio, which is non-collapsible. [sec-survival-traditional]

## In the book
The events needed follow from the Cox variance, $4/D$: for a hazard ratio of 0.83 at 90% power the formula gives 1,211 events against the 1,225 planned for SELECT, and a hazard ratio of 0.90 needs 3,787. [sec-survival-traditional]

## Pitfalls
When the hazard ratio changes over time, the Cox estimate is a weighted average depending on censoring and follow-up, so the same drug can give different hazard ratios in different trials. [sec-survival-traditional] It then depends on how long the trial runs. [sec-survival-nph]

## Check yourself
- Q: How does the variance of the log hazard ratio estimate shrink as events D grow? A: It is about 4/D under 1:1 allocation. [sec-survival-traditional]
- Q: What does the book's sign convention make positive? A: $\theta$, positive when treatment reduces the hazard. [sec-survival-traditional]
