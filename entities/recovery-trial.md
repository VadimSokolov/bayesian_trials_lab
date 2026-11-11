---
id: recovery-trial
name: RECOVERY
type: trial
aliases: [RECOVERY trial]
level: 2
summary: The dexamethasone comparison in RECOVERY, reanalyzed by respiratory-support subgroup with hierarchical shrinkage that leaves strongly supported effects nearly unchanged.
chapters: ['22', '4', '5', '10', '20']
home: sec-reanalyses-recovery
sections: [sec-reanalyses-share, 22/a-reanalysis-is-not-a-new-trial]
prerequisites: [hierarchical-model, shrinkage, subgroup-analysis]
related:
- {rel: illustrates, to: platform-trial}
- {rel: illustrates, to: two-group-comparison}
- {rel: illustrates, to: blinding}
equations: [eq-re-tau]
functions: [reanalysis_hier, reanalysis_recovery]
results: []
lab: [04-multiplicity, 15-reading-bayesian-trials]
cites: [recovery_dexamethasone_2021, albuquerque2021tocilizumab]
---

## What it is
The dexamethasone comparison randomized hospitalized patients with Covid-19 to dexamethasone 6 mg once daily for up to ten days or usual care. [sec-reanalyses-recovery]
Twenty-eight-day mortality was 22.9 percent (482 of 2104) on dexamethasone and 25.7 percent (1110 of 4321) on usual care, an age-adjusted rate ratio of 0.83 with 95 percent interval 0.75 to 0.93. [sec-reanalyses-recovery]
The subgroup results by respiratory support at randomization were as important as the overall result. [sec-reanalyses-recovery]

## Why it matters
Subgroup analyses are a familiar source of false findings, and the Bayesian instinct is to shrink them toward a common mean by an amount the data choose. [sec-reanalyses-recovery]
Shrinkage is not a rule that every subgroup be pulled to the mean. [sec-reanalyses-recovery]

## In the book
With $\theta_j = -\log RR_j$ in stratum $j$ and $\theta_j \sim N(\mu, \tau_b^2)$, the marginal likelihood of $\tau_b$ is
$$
p(\tau_b \mid \hat\theta) \propto p(\tau_b)\, V_\mu(\tau_b)^{1/2} \prod_j (s_j^2 + \tau_b^2)^{-1/2} \exp\left\{-\frac{(\hat\theta_j - \hat\mu(\tau_b))^2}{2(s_j^2+\tau_b^2)}\right\},
$$
[sec-reanalyses-recovery]
The conditional posterior mean of each $\theta_j$ is $(1 - B_j)\hat\theta_j + B_j \hat\mu$ with $B_j = s_j^2/(s_j^2 + \tau_b^2)$. [sec-reanalyses-recovery]
With only three strata the data say little about $\tau_b$, and the book uses a uniform prior over $(0, 1]$. [sec-reanalyses-recovery]
The shrinkage factors are small, and the shrunk estimates barely move; the pattern of benefit rising with severity is large and biologically expected. [sec-reanalyses-recovery]
The clinicians' conclusion was to treat patients on oxygen or ventilation and not those without oxygen. [sec-reanalyses-recovery]

## Pitfalls
The posterior of $\tau_b$ is sensitive to its prior, and moving the upper bound from 1 to 3 changes the median and mean, so the book reports the median. [sec-reanalyses-recovery]
The probability of harm in the no-oxygen stratum comes from the book's model, not from RECOVERY. [sec-reanalyses-recovery]
A trial so large that its prespecified analysis was decisive shows shrinkage changing the numbers but not the practice. [22/a-reanalysis-is-not-a-new-trial]

## Check yourself
- Q: Do the data decide how much to shrink? A: Yes, through the posterior of $\tau_b$, though with three strata it depends on its prior. [sec-reanalyses-recovery]
- Q: Which subgroup motivated the advice not to treat? A: Patients without oxygen. [sec-reanalyses-recovery]
