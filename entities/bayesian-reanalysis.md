---
id: bayesian-reanalysis
name: Bayesian reanalysis
type: concept
aliases: []
level: 2
summary: Rereading a published trial from its reported estimates under a family of stated priors, to ask what we should now believe, not whether the trial crossed its threshold.
chapters: ['22']
home: sec-reanalyses
sections: [sec-reanalyses-share, sec-reanalyses-limits, 22/a-reanalysis-is-not-a-new-trial, 22/prespecification, 22/the-regulators-view, sec-reanalyses-eolia]
prerequisites: [posterior-distribution, normal-approximation-posterior]
related:
- {rel: uses, to: skeptical-prior}
- {rel: uses, to: enthusiastic-prior}
- {rel: governed-by, to: fda-bayesian-draft-guidance-2026}
- {rel: contrasts-with, to: prespecification}
equations: []
functions: [reanalysis_normal, reanalysis_gusto, reanalysis_eolia, reanalysis_andromeda, reanalysis_recovery]
results: []
lab: [15-reading-bayesian-trials]
cites: [fda_bayesian_2026]
---

## What it is
A published trial gives a likelihood, not a conclusion. [sec-reanalyses]
The same three steps recur: reduce the report to an approximately normal likelihood for a log relative risk, a log hazard ratio or a risk difference; combine it with a small family of priors that represent defensible positions; and report posterior probabilities of effects large enough to matter. [sec-reanalyses]
The chapter applies this to GUSTO, EOLIA, ANDROMEDA-SHOCK and RECOVERY. [sec-reanalyses]

## Why it matters
Existence and magnitude of an effect are separate questions, and a posterior adds direct probability statements at chosen thresholds. [sec-reanalyses-share]
Each prior stands for a position someone held or could defend, so showing the posterior under each shows readers where they stand. [sec-reanalyses-share]
Decisions need utilities: the reanalyses supply probabilities and a utility turns them into choices. [sec-reanalyses-share]

## In the book
Each trial did its job: it answered the question its protocol asked. [sec-reanalyses]
In EOLIA and ANDROMEDA-SHOCK the primary test did not reject the null, and the intervals (0.55 to 1.04 and 0.55 to 1.02) already showed that sizeable benefits were compatible with the data. [sec-reanalyses-share] EOLIA stopped for futility at its fourth analysis, after 240 patients. [sec-reanalyses-share]
The book's numbers differ from published reanalyses because it uses normal approximations on the stated effect scale and simple stand-in priors. [sec-reanalyses]

## Pitfalls
A reanalysis is done after the results are known, so the choice of priors, thresholds and scale is made in the light of the answer; it is exploratory in ICH E9's sense and should list every prior tried. [22/prespecification]
The FDA Bayesian draft is written for a trial designed to be Bayesian and says nothing that turns a post hoc reanalysis into evidence of effectiveness. [22/the-regulators-view]
A reanalysis uses the data once more: it cannot add patients, repair a design flaw or change the probability that the trial would have rejected a null effect. [22/a-reanalysis-is-not-a-new-trial]
A strongly positive posterior after a negative trial is a reason to run a confirmatory trial with priors written in the protocol. [22/a-reanalysis-is-not-a-new-trial]

## Check yourself
- Q: A trial misses $p < 0.05$ and a reanalysis gives a high probability of benefit. Is the trial now positive? A: No, the primary analysis missed its threshold and a reanalysis cannot change that. [sec-reanalyses-eolia]
- Q: What should an honest report list? A: Every prior tried, not only the favorable ones. [22/prespecification]
