---
id: margin-synthesis
name: Margin synthesis
type: method
aliases: [synthesis method, retention of effect]
level: 3
summary: A noninferiority analysis that asks for the posterior probability that the new drug keeps a stated fraction of the control effect, carrying the full historical uncertainty.
chapters: ['19']
home: 19/margin-synthesis
sections: [19/margin-synthesis, sec-borrowing-ni]
prerequisites: [noninferiority-margin, posterior-distribution]
related:
- {rel: uses, to: bayesian-borrowing}
equations: [eq-ni-synth]
functions: [ni_synthesis, ni_posterior_table]
results: []
lab: [09-adaptive-bayesian]
cites: [schmidli2013nmap, rothmann2003ni, hasselblad2001placebo, snapinn2008preservation, simon1999active, fleming2008ni, fda_ni_2016]
---
## What it is

Regulatory practice preserves a fraction $f$ of the control's effect against placebo, $\delta_{CP}$, estimated from historical trials as $N(d,s_{CP}^2)$. The fixed-margin approach multiplies the lower 95% limit of $\delta_{CP}$ by $1-f$ to get the margin [19/margin-synthesis]. The synthesis alternative asks for

$$
\Pr\bigl(\theta_{NC}<(1-f)\,\delta_{CP}\mid\text{data}\bigr),
$$

the posterior probability that the new drug retains at least the fraction $f$ (eq-ni-synth). [19/margin-synthesis]

## Why it matters

The fixed margin reduces the historical estimate to one conservative number, while the synthesis carries the full uncertainty. Both rest on the constancy assumption, and the synthesis makes it visible. [19/margin-synthesis]

## In the book

With a hypothetical 10-point historical event reduction with standard error 0.02 and half preserved, the trial with estimate 0.01 and standard error 0.015 (upper limit 0.039) does not meet the fixed margin. The two answers differ because the fixed margin stacks two conservative operations. [19/margin-synthesis] The synthesis is not automatically more lenient: for an estimate of 0.04 the retention probability is low. [19/margin-synthesis] In the simple margin case with margin 0.04, a skeptical prior centered at the margin is the natural regulatory prior. [sec-borrowing-ni]

## Pitfalls

If care has improved and the control effect shrank, a power prior with $a_0<1$ only widens $\delta_{CP}$ and leaves its center. A shrunken effect must be modeled directly with an attenuation parameter and checked over plausible downward shifts. [19/margin-synthesis]

## Check yourself

- Q: What does the synthesis estimate? A: The posterior probability of keeping at least fraction $f$ of the control effect. [19/margin-synthesis]
- Q: Does discounting by $a_0$ fix a shrunken control effect? A: No, it leaves the center where it was. [19/margin-synthesis]
