---
id: power-curve
name: Power curve
type: concept
aliases: []
level: 1
summary: The plot of power against the true effect for a fixed sample size, showing the threshold effect below which a trial is more likely to miss than find a benefit.
chapters: ['9']
home: 9/the-power-curve
sections: [9/sensitivity-to-the-design-alternative]
prerequisites: [power]
related:
- {rel: part-of, to: sample-size}
equations: [eq-power-z]
functions: [power_z]
results: []
lab: [03-errors-power]
cites: []
---

## What it is

The power curve plots $\text{Power}(\theta)$ for fixed $n$ and $\alpha$ over the whole range of effects. [9/the-power-curve]

$$
\text{Power}(\theta) = \Phi\!\left(\theta\sqrt{nI} - z_\alpha\right).
$$

(eq-power-z) It equals $\alpha$ at $\theta = 0$, rises through 50% at $\theta = z_\alpha/\sqrt{nI}$, and passes the design value $\theta_d$ at $1-\beta$ [9/the-power-curve].

## Why it matters

A single power number hides the shape. The trial has a threshold effect at which power is 50%, and below it effects are more likely missed than found [9/the-power-curve]. For a design with 90% power, that threshold is 60.5% of the design effect [9/the-power-curve]. The curve is also flat near the design point: going from 90% to 95% power needs 24% more information [9/the-power-curve].

## In the book

If the trial is sized for $\theta_d$ and the truth is $\rho\,\theta_d$, power is $\Phi(\rho(z_\alpha+z_\beta) - z_\alpha)$, which depends only on $\rho$. A trial sized for 90% power has 83% power at 90% of the design effect, 62% at 70%, and 37% at half [9/sensitivity-to-the-design-alternative]. A trial with 90% power at hazard ratio 0.80 is, for an effect smaller than about a 13% hazard reduction, more likely than not to fail [9/the-power-curve].

## Pitfalls

At the left end of the curve the probability of a positive result for a drug that does nothing is $\alpha$, independent of $n$ [9/the-power-curve]. If the drug is better than assumed, the trial is overpowered and ends later than needed [9/sensitivity-to-the-design-alternative].

## Check yourself

- Q: Predict the power if the true effect is half the design effect at 90% design power. A: About 37% [9/sensitivity-to-the-design-alternative].
- Q: What fraction of the design effect has 50% power? A: 60.5% [9/the-power-curve].
