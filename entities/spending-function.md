---
id: spending-function
name: Lan-DeMets spending function
type: method
aliases: [alpha spending, alpha spending function]
level: 2
summary: A prespecified nondecreasing function that says how much of the total type I error may be used by each information fraction, so looks need not be at planned times.
chapters: ['11', '1', A]
home: 11/spending-functions-and-the-information-fraction
sections: [11/spending-functions-and-the-information-fraction]
prerequisites: [information-fraction, group-sequential-design]
related:
- {rel: generalizes, to: obrien-fleming-boundary}
- {rel: generalizes, to: pocock-boundary}
- {rel: uses, to: armitage-recursion}
equations: [eq-spending]
functions: [gs_power, gs_spending_boundary]
results: []
lab: [07-interim-looks]
cites: [landemets1983, kim1987design]
---

## What it is

Lan and DeMets fix a spending function $\alpha^*(t)$ instead of fixed boundaries. It is nondecreasing with $\alpha^*(0) = 0$ and $\alpha^*(1) = \alpha$, and says how much of the total type I error may have been used by information fraction $t$. At look $t_k$ the boundary $b_k$ is the one for which the cumulative crossing probability equals $\alpha^*(t_k)$. [11/spending-functions-and-the-information-fraction]

Two spending functions mimic the classical designs:

$$
\alpha^*_{\text{OBF}}(t) = 2\{1 - \Phi(z_{\alpha/2}/\sqrt{t})\}, \qquad
\alpha^*_{\text{Pocock}}(t) = \alpha \log\{1 + (e - 1)\,t\}.
$$

[11/spending-functions-and-the-information-fraction]

## Why it matters

The function is in the protocol, not the number or times of looks. The recursion needs only the past boundaries and the current $t$, so the calculation does not require knowing how many looks will occur. [11/spending-functions-and-the-information-fraction]

## In the book

The first function spends about 0.0015 of the 0.025 by $t = 0.5$. The second spends steadily. [11/spending-functions-and-the-information-fraction]

Alpha is distributed, not consumed. A final critical value of 2.02 instead of 1.96 records where the rest went. A stop for superiority spends alpha, a stop for futility does not, and a DMC reviewing safety without an efficacy comparison does not touch alpha. [11/spending-functions-and-the-information-fraction]

## Pitfalls

- The sample size was chosen for a particular plan, so power assumed a particular boundary even though the final analysis stays valid. [11/spending-functions-and-the-information-fraction]
- The timing of looks must not depend on the observed effect. [11/spending-functions-and-the-information-fraction]

## Check yourself

- Q: Does an interim look cost alpha in total? A: No, the trial still has 0.025 overall and the function says where it lives. [11/spending-functions-and-the-information-fraction]
- Q: What happens if the second look comes at 0.55 instead of 0.6? A: The boundary at that look is recomputed from the realized fraction. [11/spending-functions-and-the-information-fraction]
