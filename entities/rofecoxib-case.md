---
id: rofecoxib-case
name: Rofecoxib safety signal
type: history
aliases: [rofecoxib, Vioxx]
level: 2
summary: Rofecoxib (Vioxx) was withdrawn in 2004 after trials showed more heart attacks, a case read here as a cumulative analysis of what could have been said earlier.
chapters: ['13', '2']
home: sec-safety-rofecoxib
sections: [sec-safety-rofecoxib, 13/what-a-bayesian-reading-adds, 13/from-inference-to-decision, 13/the-naproxen-hypothesis-as-a-model-comparison, 13/what-the-traditional-analysis-said]
prerequisites: [cumulative-meta-analysis, skeptical-prior, posterior-distribution]
related:
- {rel: illustrates, to: safety-signal}
- {rel: illustrates, to: shrinkage}
- {rel: uses, to: e-value-safety-monitoring}
- {rel: illustrates, to: phase-4-trial}
equations: [eq-safety-benefitrisk]
functions: [safety_rofecoxib]
results: []
lab: []
cites: [bombardier2000vigor, bresalier2005approve, curfman2005expression, juni2004rofecoxib]
---
## What it is

Rofecoxib, sold as Vioxx, was a selective COX-2 inhibitor approved in 1999 for arthritis and pain. [sec-safety-rofecoxib] The VIGOR trial randomized 8076 patients and showed fewer upper gastrointestinal events on rofecoxib, but myocardial infarction in 0.4 percent against 0.1 percent on naproxen. [sec-safety-rofecoxib] The difference was attributed to a protective effect of naproxen. [sec-safety-rofecoxib]

## Why it matters

Merck withdrew the drug on 30 September 2004, after APPROVe showed confirmed thrombotic events in 46 of 1287 rofecoxib patients against 26 of 1299 on placebo, a rate ratio of 1.92 (95% CI 1.19 to 3.11). [sec-safety-rofecoxib]

## In the book

The cumulative meta-analysis by Jüni and colleagues had a pooled relative risk of 2.30 (95% CI 1.22 to 4.33) by the end of 2000. [13/what-the-traditional-analysis-said] See [[cumulative-meta-analysis]].

From that pool, $\log \widehat{RR} = 0.833$ with standard error $0.323$. A flat prior gives the published estimate, and skeptical priors with $s_0 = 0.3$ and $s_0 = 0.2$ were also used. [13/what-a-bayesian-reading-adds] The conclusion that harm was probable did not depend on the reviewer's prior. [13/what-a-bayesian-reading-adds]

The decision rule: rofecoxib is preferred for a patient when

$$
g\, d_G > r_0 (\mathbb{E}[RR] - 1)\, d_M.
$$

This is eq-safety-benefitrisk. [13/from-inference-to-decision] It is an illustration with stated inputs, not a regulatory benefit-risk analysis. [13/from-inference-to-decision]

The naproxen explanation and the harm explanation are competing models. The naproxen model predicts an elevated risk only against naproxen, and the harm model predicts it against every comparator. [13/the-naproxen-hypothesis-as-a-model-comparison]

## Pitfalls

- Explaining away an unwelcome signal with a plausible rival is how safety signals are most often lost. Writing the rival down as a model with its own predictions is the remedy. [13/the-naproxen-hypothesis-as-a-model-comparison]
- The book did not compute the Bayes factor between the two models. [13/the-naproxen-hypothesis-as-a-model-comparison]

## Check yourself

- Q: What did the 2004 APPROVe trial add to VIGOR? A: A placebo comparison, which showed a rate ratio of 1.92 for thrombotic events. [sec-safety-rofecoxib]
- Q: Why can a skeptic not dismiss the cumulative evidence? A: Under skeptical priors the direction of harm stays probable, even if the size is disputed. [13/what-a-bayesian-reading-adds]
