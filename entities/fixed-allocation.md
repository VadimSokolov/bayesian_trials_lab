---
id: fixed-allocation
name: Fixed allocation
type: concept
aliases: ['1:1 allocation']
level: 1
summary: Setting the allocation ratio in the protocol, almost always 1:1, and keeping it for the whole study; the default that response-adaptive randomization must beat.
chapters: ['16']
home: sec-rar-fixed
sections: [16/why-11, 16/unequal-fixed-allocation-and-when-it-is-justified, sec-rar-practice]
prerequisites: [randomization, permuted-block-randomization]
related:
- {rel: contrasts-with, to: response-adaptive-randomization}
- {rel: part-of, to: platform-trial}
equations: []
functions: []
results: []
lab: []
cites: [dunnett1955]
---
## What it is

A traditional two-arm trial fixes the allocation ratio in the protocol and keeps it for the whole study [sec-rar-fixed]. Almost always the ratio is 1:1, implemented by permuted blocks, perhaps stratified [sec-rar-fixed].

## Why it matters

For equal variances the standard error of the difference is proportional to $\sqrt{1/n_1 + 1/n_0}$, smallest when $n_0 = n_1$ for a fixed total [16/why-11]. Permuted blocks also balance calendar time, so any change in patient mix hits both arms equally [16/why-11]. Allocation independent of outcomes keeps the randomization distribution exactly known [16/why-11].

## In the book

A 2:1 ratio costs 12.5 percent more patients, 3:1 costs a third more, and 9:1 costs almost three times as many [16/why-11]. For a control response of 0.30 and a treatment response of 0.45 the optimal share on treatment is only 52 percent [16/why-11]. Unequal ratios are justified when stated in advance, for example for safety exposure or a shared control [16/unequal-fixed-allocation-and-when-it-is-justified]. With $k$ experimental arms, Dunnett's result is that the control arm should be about $\sqrt{k}$ times as large as each treatment arm; with three arms equal allocation puts 25 percent on control and Dunnett's rule 36.6 percent [16/unequal-fixed-allocation-and-when-it-is-justified].

## Pitfalls

A fixed control share protects control accrual but does not establish acceptability of adaptive allocation among experimental arms [16/unequal-fixed-allocation-and-when-it-is-justified]. For a confirmatory two-arm trial, use fixed allocation [sec-rar-practice].

## Check yourself

- Q: What does 2:1 allocation cost in sample size for the same power? A: 12.5 percent more patients [16/why-11].
- Q: Why does blocking make time trends harmless? A: Each arm receives the same number of patients within a block, so changes in patient mix hit both arms equally [16/why-11].
