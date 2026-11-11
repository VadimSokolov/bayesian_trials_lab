---
id: power
name: Statistical power
type: concept
aliases: [power, power calculation]
level: 1
summary: The probability that a trial declares success when the true effect equals a stated value, a conditional probability and not a chance of success.
chapters: ['9', '1', '4', A]
home: sec-power
sections: [9/two-errors-and-one-guess, 9/the-power-curve, 9/power-is-conditional, sec-power-assurance]
prerequisites: [z-test, one-sided-test]
related:
- {rel: contrasts-with, to: assurance}
- {rel: uses, to: design-alternative}
equations: [eq-power-z]
functions: [power_z]
results: []
lab: [03-errors-power]
cites: []
---

## What it is

A one-sided trial can declare a useless drug effective (type I error, fixed at $\alpha$, conventionally 0.025) or miss an effective drug (type II error, $\beta$). The complement $1-\beta$ is the power [9/two-errors-and-one-guess]. With $Z = \hat\theta\sqrt{nI}$ and a true effect $\theta$,

$$
\text{Power}(\theta) = \Phi\!\left(\theta\sqrt{nI} - z_\alpha\right).
$$

This is eq-power-z [9/two-errors-and-one-guess].

## Why it matters

Type I error control is a central regulatory design criterion. Type II error is a business and ethical quantity that the sponsor chooses, usually at 0.10 or 0.20 [9/two-errors-and-one-guess]. At 90% power $(z_\alpha+z_\beta)^2 = 10.51$, and at 80% it is 7.85, so 90% power needs a third more patients [9/two-errors-and-one-guess].

## In the book

Power is a conditional probability: the chance of a significant result given that the true effect equals $\theta_d$. A statement such as "90% power" is regularly heard as "90% chance of success", which would be true only if the sponsor were certain of the effect [9/power-is-conditional]. A conventional power calculation can be represented as [[assurance]] under a point-mass prior [sec-power-assurance]. The power curve shows how power changes with the effect [9/the-power-curve].

## Pitfalls

Raising the sample size buys power (and precision) but leaves the type I error at 0.025 [9/the-power-curve]. Power is not a condition of approval in the way that error control is [9/two-errors-and-one-guess].

## Check yourself

- Q: Why does 90% power need about a third more patients than 80%? A: 10.51 over 7.85 is 1.34, whatever the effect [9/two-errors-and-one-guess].
- Q: Is 90% power a 90% chance of success? A: No, it is conditional on one effect value [9/power-is-conditional].
