---
id: prior-elicitation
name: Prior elicitation
type: concept
aliases: [sources of priors]
level: 2
summary: The provenance of a prior in a sponsor's program, from phase 2 data, literature, structured expert judgment and mechanistic models, with its documented weaknesses.
chapters: ['8']
home: sec-priors-sources
sections: [sec-priors-selection, sec-priors-cmp]
prerequisites: [prior-distribution]
related:
- {rel: part-of, to: prior-specification}
equations: []
functions: []
results: []
lab: [16-bayesian-protocol]
cites: [garthwaite2005eliciting, ohagan2006uncertain, oakley2019, gosling2018shelf, chaloner1993graphical, dallow2018elicitation, polson2026simbayes]
---

## What it is

A prior has an identifiable provenance that the guidance asks the sponsor to document. Four sources recur: phase 2 data from the same program, the published literature and earlier programs, expert elicitation, and mechanistic or pharmacometric models [sec-priors-sources].

## Why it matters

Each source has a failure mode. Phase 2 programs advance when results look good [sec-priors-sources]. A literature search is a sampling mechanism, so the prior should come from a pre-specified search guarding against "preferential selection of favorable studies" [sec-priors-sources]. Experts are overconfident: intervals stated as 90 percent contain the truth far less often [sec-priors-sources].

## In the book

The Sheffield Elicitation Framework has experts give individual judgments, share evidence, and agree on one distribution [sec-priors-sources]. Three rules protect the clinician and the sponsor: elicit observables, not parameters; elicit tails as well as the middle; and document the dissenters [sec-priors-sources]. A simulator's mean $\hat\mu$ and variance $\hat v$ can be converted to a beta prior by matching moments, with $a + b = \hat\mu(1 - \hat\mu)/\hat v - 1$ [sec-priors-sources]. The remedies for selected phase 2 estimates are to discount them, to center on the distribution of true effects in the class, or to use them only through a skeptical prior [sec-priors-selection].

## Pitfalls

A single consensus can hide a bimodal opinion that a mixture prior would represent honestly [sec-priors-sources]. A prior is not a mood [sec-priors-sources].

## Check yourself

- Q: Why elicit a response rate and not a log odds ratio? A: Observables are what clinicians can judge [sec-priors-sources].
- Q: What are three ways to handle a selected phase 2 estimate? A: Discount it, center on the class distribution, or use it only through a skeptical prior [sec-priors-selection].
