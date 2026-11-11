---
id: remap-cap-trial
name: REMAP-CAP
type: trial
aliases: [REMAP-CAP trial, 'Randomized, Embedded, Multifactorial Adaptive Platform trial for Community-Acquired Pneumonia']
level: 2
summary: A multifactorial, embedded Bayesian platform for pneumonia with response-adaptive randomization that declared IL-6 receptor antagonists beneficial in COVID-19.
chapters: ['20', '6', '8', '10', '16']
home: 20/remap-cap-domains-response-adaptive-randomization-and-an-embedded-design
sections: [20/remap-cap-domains-response-adaptive-randomization-and-an-embedded-design, 20/the-covid-anticoagulation-multiplatform, 20/traditional-against-bayesian-platforms-what-differs, 20/shared-control-arithmetic]
prerequisites: [response-adaptive-randomization, posterior-probability-of-benefit]
related:
- {rel: illustrates, to: platform-trial}
- {rel: used-in, to: covid-anticoagulation-multiplatform}
equations: []
functions: []
results: []
lab: [10-platform-trials]
cites: [angus2020remapcap, gordon2021remapcap]
---
## What it is

REMAP-CAP is a platform designed before the pandemic it became known for. After the 2009 H1N1 pandemic an EU-funded network built the infrastructure, which began enrolling in April 2016 (NCT02735707) with a dormant pandemic stratum later activated for COVID-19. [20/remap-cap-domains-response-adaptive-randomization-and-an-embedded-design]

## Why it matters

Its design has four features. It is *multifactorial*: domains are sets of alternative interventions for one aspect of care, and a patient is randomized in every domain for which he or she is eligible. It is *embedded* in routine care. Its pandemic primary endpoint was organ-support-free days to day 21, analyzed with a Bayesian proportional-odds model. And allocation within a domain is updated to favor arms with higher posterior probability of being best. [20/remap-cap-domains-response-adaptive-randomization-and-an-embedded-design]

## In the book

In the IL-6 domain the triggers were superiority at posterior probability of being best above 99%, efficacy at odds ratio above 1 with probability above 99%, futility if the probability of an odds ratio above 1.2 fell below 5%, and equivalence of non-control arms if the probability of an odds ratio between 0.83 and 1.2 exceeded 90%. The platform declared that tocilizumab and sarilumab improved outcomes, including survival, in critically ill COVID-19 patients. [20/remap-cap-domains-response-adaptive-randomization-and-an-embedded-design] A domain can be declared complete without waiting for the others. [20/remap-cap-domains-response-adaptive-randomization-and-an-embedded-design] The domains may be pooled in a hierarchical sense across strata, which is borrowing under the same conditions. [20/remap-cap-domains-response-adaptive-randomization-and-an-embedded-design]

## Pitfalls

For confirmatory platforms the October 2026 EMA draft does not support response-adaptive randomization, a point to settle with the regulator. [20/shared-control-arithmetic] [20/traditional-against-bayesian-platforms-what-differs]

## Check yourself

- Q: What is a domain? A: A set of alternative interventions for one aspect of care. [20/remap-cap-domains-response-adaptive-randomization-and-an-embedded-design]
- Q: Can a patient join several domains? A: Yes, in every domain for which eligible. [20/remap-cap-domains-response-adaptive-randomization-and-an-embedded-design]
