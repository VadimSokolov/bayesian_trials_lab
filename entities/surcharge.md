---
id: surcharge
name: Surcharge for anytime validity
type: concept
aliases: [surcharge, seventy percent surcharge]
level: 3
summary: The extra squared evidence, about 2 log(1/alpha), that the normal-mixture e-value rule needs over a Bayesian rule at posterior odds of one.
chapters: ['12', '11']
home: sec-evalues-surcharge
sections: [sec-evalues-surcharge, sec-evalues, sec-evalues-pay, 12/time-to-event-design-the-select-reconstruction]
prerequisites: [anytime-valid-inference, mixture-method, bayes-factor]
related:
- {rel: uses, to: evidence-toll}
- {rel: contrasts-with, to: calibration}
equations: []
functions: [select_simulate]
results: [surcharge_seventy_percent]
lab: [08-e-values]
cites: [robbins1970statistical, polson2026bayesstandard, sokolova2026]
---
## What it is

For the normal-mixture e-value, at large information the anytime-valid rule needs approximately $2\log(1/\alpha)$ more units of squared evidence than a Bayesian rule at posterior odds of one. At $\alpha = 0.025$ that is 7.38. [sec-evalues]

Measured against that uncalibrated Bayes-factor bar it amounts to about seventy percent of a conventional trial. This compares boundary terms and is not an exact sample-size identity. [sec-evalues-surcharge]

## Why it matters

Whether a sponsor should pay depends on whether the trial needs validity at stopping times the protocol cannot anticipate. [sec-evalues-pay] The surcharge belongs in the sample size justification as an explicit line. [sec-evalues-pay]

## In the book

The e-process rule is the symmetric normal-mixture Bayes factor with $b = 1/\alpha$. [sec-evalues-surcharge] The half-normal mixture lowers the bar by about $2\log 2 = 1.39$. [sec-evalues-surcharge]

In the SELECT reconstruction the realized gap is smaller than seventy percent once the Bayesian rule is calibrated: the e-value rule needs 32 percent more events at the median than the calibrated Bayesian rule (612 against 464). [12/time-to-event-design-the-select-reconstruction] A sponsor should not read the figure as a 70 percent longer trial, because stopping early at a large effect is built into the e-value design. [sec-evalues-surcharge]

## Pitfalls

- It is a cost of one construction, not a universal cost of anytime validity. Iterated-logarithm boundaries behave differently. [sec-evalues-surcharge]
- Calibration narrows it. [sec-evalues-surcharge]

## Check yourself

- Q: At $\alpha = 0.025$, what is $2\log(1/\alpha)$ at large information? A: About 7.38. [sec-evalues]
- Q: Is seventy percent an exact sample-size identity? A: No. It compares boundary terms against the uncalibrated Bayes-factor bar. [sec-evalues-surcharge]
