---
id: pediatric-extrapolation
name: Pediatric extrapolation
type: concept
aliases: [extrapolating adult data to children]
level: 2
summary: Inferring pediatric efficacy from adult or other source data, with Bayesian borrowing as one quantitative tool after a judgment of similarity.
chapters: ['19']
home: sec-borrowing-pediatric
sections: [sec-borrowing-pediatric, sec-borrowing-belimumab, sec-borrowing-guide]
prerequisites: [bayesian-borrowing, prior-distribution]
related:
- {rel: governed-by, to: ich-e11a}
- {rel: uses, to: robust-mixture-prior}
equations: [eq-ped-mix]
functions: [borrow_pediatric_mixture]
results: []
lab: [09-adaptive-bayesian, 16-bayesian-protocol]
cites: [ich_e11a_2024, fda_bayesian_2026, fda_rare_diseases_2023, dunne2011extrapolation, gamalosiebers2017extrapolation]
---
## What it is

Pediatric extrapolation uses source data, usually from adults, to infer efficacy in children. [sec-borrowing-pediatric] ICH E11A (Step 4, August 2024) asks for a plan with three parts: a similarity assessment, the gaps and uncertainties, and a pediatric data plan that ranges from pharmacokinetics and safety only to a full efficacy trial. [sec-borrowing-pediatric]
Pediatric trials are where borrowing is most often justified, because enrollment is small and withholding treatment from children is ethically difficult. [sec-borrowing-pediatric] The FDA Bayesian draft names pediatric extrapolation as a core use of an informative prior, with empagliflozin and linagliptin in pediatric type 2 diabetes as examples where Bayesian analyses were supportive. [sec-borrowing-pediatric]

## Why it matters

Undiscounted adult data would often overwhelm a small pediatric sample, so a prior centered on the adult effect with inflated variance is often more reasonable than pooling. [sec-borrowing-pediatric] Adult and pediatric sources can be related as equally relevant, exchangeable, linked by a bias parameter, or linked by a pharmacometric model. [sec-borrowing-pediatric]

## In the book

In the bias-parameter form the pediatric effect is $\theta_p=\theta_a+b$ with $b\sim N(0,\omega^2)$, and the sponsor's similarity judgment is the number $\omega$. [sec-borrowing-pediatric] A worked example takes an adult log odds ratio of $-0.5$ with standard error 0.08 and a pediatric estimate of $-0.35$ with standard error 0.30, under the mixture

$$
\theta_P\sim w\,N(\hat\theta_A,\,0.08^2+\omega^2)+(1-w)\,N(0,1).
$$

This is eq-ped-mix. [sec-borrowing-pediatric] With $w=0.7$ and $\omega=0.15$ the posterior weight on the adult component rises to 0.87 and Pr(benefit) is 0.98, against 0.88 for the trial alone. [sec-borrowing-pediatric] If the pediatric estimate were $-0.05$, the weight falls only to 0.75 and Pr(benefit) is 0.89, against 0.57 alone. [sec-borrowing-pediatric]

## Pitfalls

The mixture is a weak safeguard in a trial this small: with a standard error of 0.30 the data cannot tell the components apart, so the answer is mostly the prior. [sec-borrowing-pediatric] Drift here means the pediatric effect is not the adult effect, and its range is a clinical judgment about physiology. [sec-borrowing-pediatric] Simulations should include scenarios where children respond less well. [sec-borrowing-pediatric]

## Check yourself

- Q: What is $\omega$? A: The allowed adult-pediatric difference, the sponsor's similarity judgment. [sec-borrowing-pediatric]
- Q: Which comes first in E11A, similarity or statistics? A: The evidence-based judgment of similarity. [sec-borrowing-pediatric]
