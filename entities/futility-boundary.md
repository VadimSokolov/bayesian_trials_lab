---
id: futility-boundary
name: Futility boundary
type: method
aliases: [futility rule, futility, binding futility]
level: 2
summary: 'The lower edge of the continuation region: stop if the interim statistic is below it. Binding rules enter the type I error, non-binding ones do not.'
chapters: ['11', '15']
home: 11/futility-boundaries-binding-and-non-binding
sections: [11/futility-boundaries-binding-and-non-binding, 11/a-futility-stop-and-its-reanalysis-eolia-2018]
prerequisites: [group-sequential-design, spending-function]
related:
- {rel: alternative-to, to: conditional-power}
equations: []
functions: [gs_boundary, gs_expected_information, gs_power, gs_power_drift]
results: []
lab: [07-interim-looks]
cites: [lan1982curtailed, pampallona1994group]
---

## What it is

An efficacy boundary is the upper edge of the continuation region. A futility boundary is the lower edge: if the interim statistic is below it, the trial stops because the treatment is unlikely to show benefit. [11/futility-boundaries-binding-and-non-binding]

- A binding boundary is part of the design. If crossed the trial stops, and the type I error assumes it does. The reduction can lower the efficacy boundaries a little. [11/futility-boundaries-binding-and-non-binding]
- A non-binding boundary is a guideline. The type I error is computed as though it did not exist, so it is at most $\alpha$ whether the committee follows it or not. [11/futility-boundaries-binding-and-non-binding]

## Why it matters

Futility stops shorten trials of useless drugs and reduce false positives. The traditional position, encouraged by regulators, is the non-binding rule, because a DMC's decision to continue should never invalidate the type I error. [11/futility-boundaries-binding-and-non-binding]

## In the book

On a four-look O'Brien-Fleming design the book stops for futility at looks 1, 2, 3 if the standardized statistic is below zero. Under the null this stops the trial early about 69 percent of the time, and 50 percent at the first look alone. [11/futility-boundaries-binding-and-non-binding]

The rule costs some power under the alternative, because trials with a true benefit sometimes have a negative interim statistic by chance. A binding rule recovers a little of it, but if overridden the type I error is no longer controlled. [11/futility-boundaries-binding-and-non-binding]

EOLIA stopped for futility under a two-sided triangular test, with relative risk 0.76 (95% confidence interval 0.55 to 1.04). [11/a-futility-stop-and-its-reanalysis-eolia-2018]

## Pitfalls

- Power must be computed as if the futility rule were followed. [11/futility-boundaries-binding-and-non-binding]
- A threshold of Z below 0 is crude. In practice the criterion is usually conditional power or predictive probability. [11/futility-boundaries-binding-and-non-binding]

## Check yourself

- Q: If a DMC overrides a binding futility rule, what happens to the type I error? A: It is no longer controlled. [11/futility-boundaries-binding-and-non-binding]
- Q: Why is a non-binding rule safe for the type I error? A: Ignoring it can only increase the chance of crossing the efficacy boundary, and that is already at most alpha. [11/futility-boundaries-binding-and-non-binding]
