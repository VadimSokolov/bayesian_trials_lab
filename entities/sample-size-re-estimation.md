---
id: sample-size-re-estimation
name: Sample size re-estimation
type: method
aliases: []
level: 3
summary: Changing the planned sample size at an interim, either from blinded pooled variance or, riskier, from the unblinded interim effect, as in the promising zone design.
chapters: ['15']
home: 15/sample-size-re-estimation-and-the-promising-zone
sections: [sec-reg13]
prerequisites: [conditional-power, type-i-error]
related:
- {rel: governed-by, to: fda-adaptive-design-guidance-2019}
- {rel: contrasts-with, to: group-sequential-design}
- {rel: contrasts-with, to: goldilocks-design}
equations: []
functions: []
results: []
lab: [07-interim-looks]
cites: [mehtapocock2011promzone, jennison_turnbull_2015, tsiatis2003inefficiency, proschan1995designed, bauer1994evaluation]
---
## What it is

When the planning value of the effect or variance is wrong, the trial is under- or over-powered, and there are two traditional responses [15/sample-size-re-estimation-and-the-promising-zone]. Blinded re-estimation updates the nuisance parameter from the pooled variance, needs no unblinding and has negligible effect on type I error [15/sample-size-re-estimation-and-the-promising-zone]. Unblinded re-estimation uses the interim effect [15/sample-size-re-estimation-and-the-promising-zone].

## Why it matters

Increasing $n$ from the interim effect makes the sample size depend on the data, and the type I error can exceed the nominal level, by more than a factor of two in extreme cases [15/sample-size-re-estimation-and-the-promising-zone]. Remedies are combination tests and the conditional error principle, both pre-specified [15/sample-size-re-estimation-and-the-promising-zone].

## In the book

The promising zone restricts the increase to intermediate conditional power. Below a futility limit the trial continues unchanged or stops, above a favorable limit it continues unchanged, and in between the sample size rises by a pre-specified rule up to a cap, for example twice the original size [15/sample-size-re-estimation-and-the-promising-zone]. A protocol that says the DMC may recommend an increase of up to 50 percent without a formula and a cap has not specified an adaptation [15/sample-size-re-estimation-and-the-promising-zone].

Regulators treat blinded re-estimation as low risk, while unblinded re-estimation needs type I error control by design and a prespecified algorithm. [sec-reg13]

## Pitfalls

A group sequential design with a futility boundary, planned for the larger sample from the start, can match or beat a promising zone design in power and average sample size [15/sample-size-re-estimation-and-the-promising-zone]. The adaptive design buys insurance against a misjudged effect, not free efficiency [15/sample-size-re-estimation-and-the-promising-zone]. Whether the unadjusted final test stays valid must be shown by theory or simulation [15/sample-size-re-estimation-and-the-promising-zone].

## Check yourself

- Q: Which form of re-estimation is least risky? A: Blinded re-estimation from the pooled variance [15/sample-size-re-estimation-and-the-promising-zone].
- Q: Where does the promising zone increase the sample size? A: Where conditional power is intermediate, up to a pre-specified cap [15/sample-size-re-estimation-and-the-promising-zone].
