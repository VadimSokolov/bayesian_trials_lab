---
id: calibration
name: Calibration of the success threshold
type: method
aliases: [calibration, calibrating c and a]
level: 2
summary: Choosing the posterior threshold c, for a given effect threshold a, as the 1 minus alpha quantile of the largest null posterior probability, so the type I error is controlled.
chapters: ['14', '7']
home: sec-sim-calibration
sections: [14/the-algorithm, 14/choosing-a-and-c, sec-sim-inflation, sec-simulation, 14/where-the-calibration-noise-comes-from]
prerequisites: [posterior-probability-success-criterion, clinical-trial-simulation]
related:
- {rel: governed-by, to: fda-bayesian-draft-guidance-2026}
- {rel: uses, to: scenario-grid}
- {rel: used-in, to: bnt162b2-trial}
equations: []
functions: [oc_calibrate, oc_simulate, oc_summarize]
results: [null_maximum_calibration]
lab: [14-simulator, 09-adaptive-bayesian]
cites: [fda_bayesian_2026]
---
## What it is

Let $M$ be the largest posterior probability $\Pr(p_1 - p_0 > a \mid \text{data})$ that a simulated null trial reaches at any look it attends [14/the-algorithm]. The rule "success if the probability exceeds $c$ at any look" rejects exactly when $M > c$ [14/the-algorithm]. So the smallest $c$ with type I error at most $\alpha$ is the $(1-\alpha)$ quantile of $M$ over the null simulations, which `oc_calibrate` computes [14/the-algorithm].

## Why it matters

Without calibration the rule inflates the error, because each look is a new chance for noise to cross the bar [sec-sim-inflation]. Calibration is this book's default for confirmatory adaptive designs without borrowing [sec-simulation].

## In the book

The four-call workflow simulates the null, calibrates $c$ to 2.5 percent, simulates the alternative and reports the operating characteristics [14/the-algorithm]. A threshold of $c = 0.975$ is a 2.5 percent test at one look, and $c = 0.991$ is a 2.5 percent test at four looks [sec-sim-inflation]. Raising $a$ lowers the calibrated $c$ and lowers the power at $p_1 = 0.45$ [14/choosing-a-and-c]. Futility stopping is simulated inside the null run, so the calibration accounts for it [14/the-algorithm].

## Pitfalls

A design with non-binding futility should calibrate on the maximum over all looks, the more conservative choice [14/the-algorithm]. The calibrated $c$ is itself an estimate, so use at least $10^5$ trials and validate on a fresh seed [14/where-the-calibration-noise-comes-from].

## Check yourself

- Q: Why does one simulation serve every candidate $c$? A: Common random numbers: the type I error is $\Pr(M > c)$ for the same simulated $M$ [14/the-algorithm].
- Q: Does raising $a$ raise or lower the calibrated $c$? A: It lowers it, because exceeding a larger effect is harder to do by chance [14/choosing-a-and-c].
