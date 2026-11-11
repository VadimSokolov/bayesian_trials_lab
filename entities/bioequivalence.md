---
id: bioequivalence
name: Bioequivalence
type: concept
aliases: []
level: 2
summary: The finding that a generic or reformulated drug delivers the same exposure as the reference, declared when the geometric mean ratio lies in (0.80, 1.25).
chapters: ['2']
home: sec-lifecycle-be
sections: []
prerequisites: [drug-development, confidence-interval]
related:
- {rel: uses, to: two-one-sided-tests}
- {rel: special-case-of, to: equivalence-trial}
- {rel: uses, to: posterior-distribution}
equations: [eq-lifecycle-be]
functions: []
results: []
lab: []
cites: [schuirmann1987, fda_be_stat_2026, racinepoon1987, rodda1980probability, fluhler1983]
---
## What it is
A generic or reformulated drug must deliver the same exposure as the reference product, measured by the area under the concentration-time curve. The parameter is the ratio $\rho = \mu_T/\mu_R$ of geometric means. Bioequivalence is declared when $\rho$ lies in the interval $(0.80, 1.25)$. [sec-lifecycle-be]

## Why it matters
The classical analysis is the [[two-one-sided-tests|TOST]] procedure, equivalent to checking that the 90 percent confidence interval lies inside $(\log 0.80, \log 1.25)$. [sec-lifecycle-be] A Bayesian version asks directly for the posterior probability of equivalence. In a simplified normal model with a reference prior,

$$
\Pr\bigl(\log 0.80 < \eta < \log 1.25 \mid d\bigr) = F_{t_{n-1}}\!\left(\frac{\log 1.25 - \bar d}{s/\sqrt n}\right) - F_{t_{n-1}}\!\left(\frac{\log 0.80 - \bar d}{s/\sqrt n}\right).
$$

This is equation eq-lifecycle-be. [sec-lifecycle-be]

## In the book
Under the reference prior each one-sided posterior tail probability equals the corresponding one-sided TOST p-value, so the posterior probability of equivalence is $1 - p_L - p_U$. [sec-lifecycle-be] TOST at 0.05 implies a posterior probability above 0.90, but not the reverse. In an illustrative scenario a data set passes the 0.90 posterior rule with probability 0.9291 and fails TOST with p-value 0.0709. [sec-lifecycle-be]

## Pitfalls
TOST is the standard in FDA's final guidance of May 2026, so a posterior-probability rule would need agreement with the regulator and an evaluation of its operating characteristics. [sec-lifecycle-be] The model is a simplification, not the regulatory crossover analysis, and some highly variable drugs use reference-scaled approaches. [sec-lifecycle-be]

## Check yourself
- Q: Which implication holds, TOST success to posterior above 0.90, or the reverse? A: TOST success at 0.05 implies a posterior probability above 0.90, not the reverse. [sec-lifecycle-be]
