---
id: false-positive-risk
name: False positive risk
type: concept
aliases: [FPR]
level: 2
summary: The probability that a drug does not work given that its trial was significant, which depends on the prior probability that such drugs work.
chapters: ['7']
home: sec-evidence-fpr
sections: [sec-evidence-together, sec-evidence-practice]
prerequisites: [p-value, type-i-error, power, bayes-rule]
related:
- {rel: uses, to: asa-statement}
- {rel: uses, to: phase-2-to-phase-3-optimism}
equations: [eq-fpr]
functions: [false_positive_risk]
results: []
lab: [02-p-values]
cites: [ioannidis2005most, colquhoun2014investigation, soric1989discoveries, colquhoun2017reproducibility, wacholder2004assessing, sterne2001sifting, zia2005]
---

## What it is

The false positive risk is the fraction of significant trials in which the drug does not work. It is the screening-test calculation: sensitivity is the power $1-\beta$, the false alarm rate is the type I error $\alpha$, and prevalence is the prior probability $\pi_a$ that the drug works [sec-evidence-fpr].

$$
\text{FPR} \;=\; \Pr(\text{no effect} \mid \text{significant}) \;=\; \frac{\alpha\,(1-\pi_a)}{\alpha\,(1-\pi_a) + (1-\beta)\,\pi_a}.
$$

This is equation eq-fpr [sec-evidence-fpr]. Colquhoun later called it the false positive risk [sec-evidence-fpr].

## Why it matters

The type I error is $\Pr(\text{significant} \mid \text{no effect})$ and is what a design controls. The false positive risk is $\Pr(\text{no effect} \mid \text{significant})$ and is what a decision-maker wants. The prior probability connects them [sec-evidence-fpr]. Power also protects against false positives, because $(1-\beta)\pi_a$ is in the denominator [sec-evidence-fpr].

## In the book

At one-sided alpha 0.025 and 90% power, if half of drugs work the false positive risk is about 2.7%. If one in ten works it is 20%, and if one in a hundred works it is 73% [sec-evidence-fpr]. In a review of phase III oncology trials that repeated a regimen already positive in phase II, only 28% were positive [sec-evidence-fpr].

## Pitfalls

The equation conditions on the trial being significant at level $\alpha$, not on the exact p-value [sec-evidence-fpr]. It is not an alternative to the type I error rate [sec-evidence-fpr].

## Check yourself

- Q: With 90% power, if one in ten such drugs works, is a significant result mostly right? A: Mostly, but about one in five (20%) is a false positive [sec-evidence-fpr].
- Q: Why does an underpowered trial that crosses the line deserve more suspicion? A: Low power shrinks the true-positive term in the denominator, so chance explains more of the significant results [sec-evidence-fpr].
