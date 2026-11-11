---
id: pocock-boundary
name: Pocock boundary
type: method
aliases: [Pocock]
level: 2
summary: An efficacy boundary with the same critical value at every look, which stops early more easily but sets a final bar well above 1.96.
chapters: ['11']
home: 11/obrien-fleming-pocock-and-the-family-between-them
sections: [11/obrien-fleming-pocock-and-the-family-between-them, 11/spending-functions-and-the-information-fraction]
prerequisites: [group-sequential-design, armitage-recursion]
related:
- {rel: contrasts-with, to: obrien-fleming-boundary}
equations: [eq-spending]
functions: [gs_boundary, gs_expected_information, gs_power_drift, gs_spending_boundary]
results: []
lab: [07-interim-looks]
cites: [pocock1977, wang1987approximately, haybittle1971repeated, peto1976design]
---

## What it is

Pocock uses the same critical value at every look, which is $\Delta = 1/2$ in the Wang-Tsiatis family. Early stopping is easy, but the final critical value is well above 1.96. [11/obrien-fleming-pocock-and-the-family-between-them] As a spending function it is the second half of the book's equation (eq-spending, the first half is O'Brien-Fleming's):

$$
\alpha^*_{\text{OBF}}(t) = 2\{1 - \Phi(z_{\alpha/2}/\sqrt{t})\}, \qquad
\alpha^*_{\text{Pocock}}(t) = \alpha \log\{1 + (e - 1)\,t\}.
$$

[11/spending-functions-and-the-information-fraction]

## Why it matters

A trial in which an early answer is worth much more than a marginally larger sample, such as one in a serious acute illness, may choose a boundary closer to Pocock. [11/obrien-fleming-pocock-and-the-family-between-them]

## In the book

For four equally spaced looks the Pocock row has the same value, 2.36, at every look. A one-sided $p$ of 0.009 at the first look is enough to stop. [11/obrien-fleming-pocock-and-the-family-between-them]

To have 90 percent power the Pocock design needs about 18 percent more patients than the fixed design if the trial runs to the end, against about 2 percent for O'Brien-Fleming. When the treatment works it stops on average at about 59 percent of the planned information, against about 75 percent for O'Brien-Fleming. [11/obrien-fleming-pocock-and-the-family-between-them]

The spending-function form is $\alpha^*_{\text{Pocock}}(t) = \alpha \log\{1 + (e - 1)\,t\}$, which spends steadily. [11/spending-functions-and-the-information-fraction]

A third, informal rule uses a very small fixed nominal level at every interim look, for example two-sided $|Z| > 3$, and the unadjusted level at the end. [11/obrien-fleming-pocock-and-the-family-between-them]

## Pitfalls

- Under the null both designs run almost to the end when there is no futility rule, so Pocock's early-stop advantage appears only when the drug works. [11/obrien-fleming-pocock-and-the-family-between-them]

## Check yourself

- Q: What does the Pocock design charge for earlier stops? A: A final bar of about 2.36 and about 18 percent more patients if it runs to the end. [11/obrien-fleming-pocock-and-the-family-between-them]
- Q: When the treatment works, which stops earlier, Pocock or O'Brien-Fleming? A: Pocock, at about 59 percent against about 75 percent of the information. [11/obrien-fleming-pocock-and-the-family-between-them]
