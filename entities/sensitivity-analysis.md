---
id: sensitivity-analysis
name: Sensitivity analysis over the prior
type: method
aliases: [prior sensitivity analysis]
level: 2
summary: Re-reporting the result across a family of reasonable priors, usually by varying the prior scale, to show how far the conclusion depends on the prior.
chapters: ['8']
home: sec-priors-sensitivity
sections: [sec-priors-remapcap, sec-priors-protocol, sec-priors-ess, sec-priors-fda]
prerequisites: [prior-distribution, effective-sample-size]
related:
- {rel: generalizes, to: tipping-point-analysis}
- {rel: governed-by, to: fda-bayesian-draft-guidance-2026}
equations: []
functions: [normal_update]
results: []
lab: [16-bayesian-protocol]
cites: [fda_bayesian_2026, polson2026bayesstandard]
---

## What it is

The FDA draft asks that "sensitivity analyses should be planned that utilize a range of alternative reasonable choices for the prior distributions," for instance by varying the strength of borrowing [sec-priors-sensitivity]. For a normal prior the natural one-parameter family is the prior standard deviation $s_0$ at a fixed mean, because $s_0$ sets the ESS and spans a dogmatic prior ($s_0 \to 0$) to a noninformative one ($s_0 \to \infty$) [sec-priors-sensitivity].

## Why it matters

It turns "does the prior matter" into a curve. When the data are decisive the conclusion is robust to a wide family and breaks only for priors almost as informative as the trial [sec-priors-sensitivity].

## In the book

For the 508-event trial with observed HR 0.80, the curve is flat to the right. For prior standard deviations above about 0.15 (ESS up to about 180 events) the posterior probability of benefit stays above 0.98, and it falls below 0.975 only for a very tight skeptic worth about two thirds of the information in the trial [sec-priors-sensitivity]. The multiplatform heparin trials pre-specified an enthusiastic prior as such a check [sec-priors-sensitivity].

## Pitfalls

ESS is reported alongside a sensitivity analysis, not instead of one [sec-priors-ess]. The draft does not say how wide a family is enough [sec-priors-fda]. The family and success criterion go in the protocol, for example standard deviation from the ESS-zero reference to twice the proposed ESS, and mean over a stated range [sec-priors-protocol].

## Check yourself

- Q: What does a flat sensitivity curve say? A: The conclusion is robust and is driven by the data [sec-priors-sensitivity].
- Q: Why vary $s_0$ at fixed mean? A: It sets the prior's weight through the ESS [sec-priors-sensitivity].
