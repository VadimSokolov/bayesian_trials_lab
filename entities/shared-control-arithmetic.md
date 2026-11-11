---
id: shared-control-arithmetic
name: Shared-control arithmetic
type: concept
aliases: [platform arithmetic, shared control, Dunnett allocation]
level: 2
summary: The sample-size, variance and correlation consequences of testing several experimental arms against one control group.
chapters: ['20', '9']
home: 20/shared-control-arithmetic
sections: [20/separate-trials-and-what-they-cost, 20/shared-control-arithmetic, 20/the-number-of-false-positives, 20/what-changes-in-the-protocol]
prerequisites: [type-i-error, sample-size]
related:
- {rel: used-in, to: platform-trial}
- {rel: governed-by, to: fda-master-protocols-guidance-2026}
- {rel: precedes, to: multiplicity-across-arms}
equations: [eq-shared-saving, eq-contrast-variance]
functions: [platform_shared_control_table, platform_contrast_variance, platform_arm_correlation, platform_false_positive_counts]
results: [shared_control_false_positive_counts]
lab: [10-platform-trials]
cites: [polson2026bayesstandard, dunnett1955, saville2016efficiencies]
---
## What it is

With $k$ drugs and a control of $m$ patients, separate trials randomize $2km$ patients and a platform with one control randomizes $(k+1)m$ [20/separate-trials-and-what-they-cost]. The saving is

$$
1 - \frac{k+1}{2k} = \frac{k-1}{2k},
$$

which is 25% for two drugs, 37.5% for four and 40% for five (eq-shared-saving). [20/separate-trials-and-what-they-cost] With $n$ patients per arm and $n_0=rn$ on control, the variance of each contrast is $\frac{1}{n}\left(1 + \frac{1}{r}\right)$ (eq-contrast-variance). Dunnett's rule puts $r=\sqrt{k}$ on control. [20/shared-control-arithmetic]

## Why it matters

Two arms' test statistics have correlation $1/(1+r)$, which is 0.5 under equal allocation and 0.33 for four arms under the square-root rule. [20/shared-control-arithmetic] Five drugs at 80 per arm need 480 patients rather than 800. [20/separate-trials-and-what-they-cost]

## In the book

At 480 total patients the square-root rule lowers each contrast variance by 10% with four arms and 15% with six. [20/shared-control-arithmetic] If all four arms are null at one-sided 0.025, the expected number of false positives is $0.025k$ whatever the correlation, but the count distribution changes. With a shared control and equal allocation, at least one false positive falls from 9.6% to 7.8% and two or more rises from 0.4% to 1.7%. [20/the-number-of-false-positives] FDA and the EMA ask for more control participants than each arm. [20/shared-control-arithmetic]

## Pitfalls

The arithmetic assumes all $k$ arms run at the same time. Real platforms add arms later. [20/separate-trials-and-what-they-cost] The simulation report should show the distribution of the number of errors, not only the familywise rate. [20/the-number-of-false-positives]

## Check yourself

- Q: Predict the saving for five drugs. A: 40%. [20/separate-trials-and-what-they-cost]
- Q: Is the mean number of false positives changed by sharing the control? A: No, it stays at $k\alpha$. [20/the-number-of-false-positives]
