---
id: assurance
name: Assurance
type: concept
aliases: [Bayesian power, expected power]
level: 2
summary: The average of the power curve over a prior on the effect, the unconditional chance that the trial succeeds given what the sponsor believes.
chapters: ['9']
home: sec-power-assurance
sections: [9/power-is-conditional, 9/a-closed-form, 9/what-assurance-is-not, 9/a-comparison]
prerequisites: [power, prior-distribution, design-alternative]
related: []
equations: [eq-assurance, eq-assurance-normal]
functions: [assurance, n_fixed]
results: []
lab: [03-errors-power]
cites: [ohagan2005assurance, spiegelhalter1986predictive, brown1987projection, kunzmann2021review, rufibach2016bayesian, crisp2018assurance]
---

## What it is

With a prior $\pi(\theta)$ on the effect, the probability that the trial succeeds is the average of the power curve [9/power-is-conditional]:

$$
\text{Assurance} = \int \text{Power}(\theta)\,\pi(\theta)\,d\theta .
$$

This is eq-assurance. O'Hagan, Stevens and Campbell named it; earlier versions are predictive power and expected power [9/power-is-conditional]. For a normal prior $N(m, s^2)$ and a z test with standard error se,

$$
\text{Assurance} = \Phi\!\left(\frac{m - z_\alpha\,\mathrm{se}}{\sqrt{s^2 + \mathrm{se}^2}}\right).
$$

This is eq-assurance-normal [9/a-closed-form].

## Why it matters

A conventional power calculation is assurance under a point-mass prior [sec-power-assurance]. Uncertainty lowers assurance even when symmetric, because the power curve flattens near one [9/a-closed-form].

## In the book

For a trial sized for 0.20 at 90% power, a prior mean of 0.20 with standard deviation 0.10 gives assurance 0.75, and standard deviation 0.20 gives 0.65. Near a point-mass prior it is about 0.89 [9/a-closed-form]. For phase 3 sized on a phase 2 estimate, assurance is often 50% to 70% [9/a-comparison].

## Pitfalls

Assurance is a forecast, not a measure of evidence and not an error rate. It does not replace the scenario table of operating characteristics [9/what-assurance-is-not]. Type I error is computed under the null, whatever the sponsor believes [9/what-assurance-is-not]. Keep the design prior (to forecast) apart from the analysis prior (to be defended) [9/what-assurance-is-not].

## Check yourself

- Q: Does more uncertainty about the effect raise or lower assurance? A: It lowers it, for a prior centered on the design value [9/a-closed-form].
- Q: Is assurance the Type I error under the design prior? A: No, type I error is computed under the null [9/what-assurance-is-not].
