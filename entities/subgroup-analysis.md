---
id: subgroup-analysis
name: Subgroup analysis
type: concept
aliases: [subgroups]
level: 2
summary: Slicing trial results by age, sex, region or biomarker, the source of multiplicity that most often misleads.
chapters: ['10', '22']
home: sec-mult-subgroups
sections: [sec-mult-subgroups, 10/a-large-trial-with-many-subgroups-recovery]
prerequisites: [multiplicity]
related:
- {rel: uses, to: forking-paths}
- {rel: uses, to: shrinkage}
equations: []
functions: []
results: []
lab: [04-multiplicity]
cites: [isis21988, wang2007subgroups]
---

## What it is

A trial that fails overall will be examined by age, sex, region, baseline severity, biomarker status and prior therapy. With twelve ways to slice the data, luck has twelve chances. [sec-mult-subgroups]

## Why it matters

Of all the sources of multiplicity, the subgroup analysis is the one that most often misleads. [sec-mult-subgroups]

## In the book

The classic warning is ISIS-2, which enrolled 17,187 patients with suspected myocardial infarction. Its authors showed that split by astrological birth sign, aspirin appeared to have no benefit for Gemini or Libra, although in the whole trial it reduced vascular mortality very strongly. Twelve signs gave twelve chances. [sec-mult-subgroups]

Wang and colleagues give a reporting standard: say how many subgroup analyses were done, state which were prespecified, and test for interaction rather than comparing $p$-values inside subgroups. [sec-mult-subgroups]

The traditional remedies are to prespecify few subgroups with a rationale, put the subgroup variable in the multiplicity graph when a claim is intended, test interaction first, and treat the rest as exploratory. They are all-or-nothing, and an estimate outside the family is reported at face value with all its noise. [sec-mult-subgroups]

A hierarchical model across subgroups moves the estimates toward the overall effect in proportion to how little information each carries. The book applies this to RECOVERY. [10/a-large-trial-with-many-subgroups-recovery]

## Pitfalls

- A significant effect in one subgroup and a non-significant effect in another is not evidence that the effects differ. [sec-mult-subgroups]
- The interaction test has little power at the usual sample size, so the honest result is usually "consistent with a common effect". [sec-mult-subgroups]

## Check yourself

- Q: What did ISIS-2 show with birth signs? A: Apparent no benefit of aspirin in two of twelve signs despite a strong overall effect. [sec-mult-subgroups]
- Q: What should a subgroup report test instead of within-subgroup p-values? A: The interaction between subgroup and treatment. [sec-mult-subgroups]
