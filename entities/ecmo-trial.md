---
id: ecmo-trial
name: ECMO trial
type: trial
aliases: [ECMO, Harvard two-stage trial]
level: 3
summary: The 1985 play-the-winner trial of ECMO in newborns that ended 11 of 11 on ECMO and 0 of 1 on conventional therapy, and the controversy and follow-up trials it started.
chapters: ['16']
home: sec-rar-ecmo
sections: [16/what-was-done, 16/the-controversy, 16/the-harvard-two-stage-trial, 16/the-uk-collaborative-trial, 16/how-much-the-prior-matters, 16/the-aftermath-and-what-it-means-for-design]
prerequisites: [play-the-winner, beta-prior]
related:
- {rel: illustrates, to: response-adaptive-randomization}
- {rel: illustrates, to: sensitivity-analysis}
equations: []
functions: [ecmo_data, ecmo_beta_comparison, ecmo_prior_sensitivity, rar_ecmo_urn]
results: []
lab: []
cites: [bartlett1985, ware1989, orourke1989, uk_ecmo_1996, kass1989]
---
## What it is

Extracorporeal membrane oxygenation (ECMO) is a form of heart-lung bypass, here used for newborns in severe respiratory failure, often with persistent pulmonary hypertension [16/what-was-done]. Bartlett and colleagues thought randomizing to conventional medical therapy was close to unethical, and used a randomized play-the-winner rule [16/what-was-done]. The final tally was 11 of 11 on ECMO and 0 of 1 on conventional therapy [16/what-was-done].

## Why it matters

The conclusion that ECMO works rested on twelve infants, and the comparison with control on one death [16/the-controversy]. The design meant to reconcile ethics with science had allocated the information away from the comparison [16/the-controversy].

## In the book

With uniform priors the posteriors are Beta(12,1) and Beta(1,2), and the posterior probability that ECMO is better is $90/91 \approx 0.989$ [16/the-controversy]. The Harvard two-stage trial had 9 of 9 ECMO infants survive against 6 of 10 on control in phase one, then 20 further ECMO infants with 19 survivors [16/the-harvard-two-stage-trial]. The UK collaborative trial enrolled 185 infants; thirty of 93 allocated to ECMO died against 54 of 92, a relative risk of 0.55 (95% CI 0.39 to 0.77) [16/the-uk-collaborative-trial]. By then the data swamp any of the priors tried [16/how-much-the-prior-matters].

## Pitfalls

Extreme early data and an informative prior can make a rule stop almost immediately, and a protocol must show by simulation that this is the behavior it wants [16/the-aftermath-and-what-it-means-for-design]. A posterior above 0.98 under two priors is a statement about extreme data, not about a good design [16/the-controversy].

## Check yourself

- Q: What was the allocation outcome of the Bartlett trial? A: 11 infants to ECMO and 1 to conventional therapy [16/what-was-done].
- Q: Which trial settled the question? A: The conventional randomized UK collaborative trial [16/the-uk-collaborative-trial].
