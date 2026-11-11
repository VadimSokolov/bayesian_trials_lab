---
id: commensurate-prior
name: Commensurate prior
type: method
aliases: []
level: 3
summary: A prior that centers the current parameter on the historical one with a precision parameter that the data update, so agreement between sources is itself learned.
chapters: ['19']
home: sec-borrowing-commensurate
sections: [sec-borrowing-commensurate, sec-borrowing-map]
prerequisites: [hierarchical-model, prior-distribution]
related:
- {rel: alternative-to, to: power-prior}
- {rel: alternative-to, to: robust-mixture-prior}
- {rel: part-of, to: bayesian-borrowing}
equations: [eq-commensurate]
functions: []
results: []
lab: [09-adaptive-bayesian]
cites: [hobbs2011commensurate, hobbs2012commensurate]
---
## What it is

Hobbs, Carlin, Mandrekar and Sargent (2011) put agreement between sources into a parameter of its own [sec-borrowing-commensurate]. With $\eta_c$ the current and $\eta_h$ the historical parameter (logits for binary data), the commensurate prior says

$$
\eta_c \mid \eta_h, \tau_c \sim N(\eta_h,\; 1/\tau_c),
$$

where $\tau_c$ is the commensurability precision with its own prior (eq-commensurate). [sec-borrowing-commensurate] The prior is typically a spike-and-slab or a discrete mixture that allows a large and a small value. [sec-borrowing-commensurate]

## Why it matters

A large posterior $\tau_c$ means the current data support closeness and the historical data count heavily. A small one down-weights them. [sec-borrowing-commensurate] This makes borrowing dynamic.

## In the book

In the two-stage version the historical posterior is held fixed and borrowing runs one way, as a regulator thinks of an already reported trial. In the fully Bayesian joint model information flows both ways. [sec-borrowing-commensurate] A version places the commensurate model on a power prior, combining discounting and agreement. [sec-borrowing-commensurate] The paper treats Gaussian data, and the extension to generalized linear models is in Hobbs and colleagues (2012). [sec-borrowing-commensurate]

## Pitfalls

A method that learns agreement from a small current control arm has little to learn from. In a small trial the commensurate prior behaves much like a static one with weights fixed by the prior on $\tau_c$. [sec-borrowing-commensurate]

## Check yourself

- Q: What does a small posterior $\tau_c$ say? A: The current data do not support closeness, so the historical data are down-weighted. [sec-borrowing-commensurate]
- Q: Why is it weak in a small trial? A: A small control arm has little information about agreement. [sec-borrowing-commensurate]
