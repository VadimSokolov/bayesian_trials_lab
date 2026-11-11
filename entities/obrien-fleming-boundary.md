---
id: obrien-fleming-boundary
name: O'Brien-Fleming boundary
type: method
aliases: [O'Brien-Fleming]
level: 2
summary: 'An efficacy boundary proportional to one over the square root of the information fraction: early looks are almost impossible to cross and the final bar stays near 1.96.'
chapters: ['11', '14', '21']
home: 11/obrien-fleming-pocock-and-the-family-between-them
sections: [11/obrien-fleming-pocock-and-the-family-between-them, 11/spending-functions-and-the-information-fraction, 11/truncated-trials-overestimate-bassler-and-colleagues-2010]
prerequisites: [group-sequential-design, armitage-recursion]
related:
- {rel: contrasts-with, to: pocock-boundary}
equations: [eq-spending]
functions: [gs_boundary, gs_expected_information, gs_power_drift, gs_spending_boundary]
results: []
lab: [07-interim-looks]
cites: [obrienfleming1979, wang1987approximately]
---

## What it is

O'Brien-Fleming uses a critical value proportional to $1/\sqrt{t_k}$, which is $\Delta = 0$ in the Wang-Tsiatis family $b_k = c\, t_k^{\Delta - 1/2}$. Early looks are nearly impossible to cross, and the final critical value is close to the single-test value. [11/obrien-fleming-pocock-and-the-family-between-them] As a spending function it is the first half of the book's equation (eq-spending, the second half is Pocock's):

$$
\alpha^*_{\text{OBF}}(t) = 2\{1 - \Phi(z_{\alpha/2}/\sqrt{t})\}, \qquad
\alpha^*_{\text{Pocock}}(t) = \alpha \log\{1 + (e - 1)\,t\}.
$$

[11/spending-functions-and-the-information-fraction]

## Why it matters

For a cardiovascular outcomes trial with an event-driven analysis and a durable commercial case, the final result should carry the weight of a fixed trial, so O'Brien-Fleming is almost universal. [11/obrien-fleming-pocock-and-the-family-between-them]

## In the book

For four equally spaced looks the boundaries are 4.05, 2.86, 2.34, 2.02 (exact solution of the recursion, $c = 2.024$). Polson and Sokolov print 4.05, 2.87, 2.34, 2.03 from the rounded constant 2.026, and the third decimal is not something a protocol should hinge on. [11/obrien-fleming-pocock-and-the-family-between-them]

The first look requires $Z > 4.05$, a one-sided $p$ of about $2.6 \times 10^{-5}$. The final look requires $Z > 2.02$, a $p$ of about 0.021. The unadjusted 0.025 at the end becomes 0.021. [11/obrien-fleming-pocock-and-the-family-between-them]

The cost is about 2 percent more patients for 90 percent power if the trial runs to the end. When the treatment works the design stops on average at about 75 percent of the planned information. [11/obrien-fleming-pocock-and-the-family-between-them]

As a spending function, $\alpha^*_{\text{OBF}}(t) = 2\{1 - \Phi(z_{\alpha/2}/\sqrt{t})\}$ spends about 0.0015 of the 0.025 by $t = 0.5$. [11/spending-functions-and-the-information-fraction]

## Pitfalls

- A boundary does not fix the point estimate at stopping, and a design with an O'Brien-Fleming boundary is not immune to early-stop bias. [11/truncated-trials-overestimate-bassler-and-colleagues-2010]

## Check yourself

- Q: What bar does the final look of a four-look O'Brien-Fleming design ask for? A: About 2.02. [11/obrien-fleming-pocock-and-the-family-between-them]
- Q: What does it cost in sample size? A: About 2 percent. [11/obrien-fleming-pocock-and-the-family-between-them]
