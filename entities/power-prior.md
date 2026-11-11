---
id: power-prior
name: Power prior
type: method
aliases: [normalized power prior, NPP, Ibrahim-Chen power prior]
level: 2
summary: A prior that raises the historical likelihood to a power a0 between 0 and 1, so that a0 sets the fraction of historical patients that count.
chapters: ['19']
home: sec-borrowing-power
sections: [sec-borrowing-power, sec-borrowing-rare, sec-borrowing-chain, sec-borrowing-nsclc]
prerequisites: [prior-distribution, likelihood, beta-prior]
related:
- {rel: alternative-to, to: commensurate-prior}
- {rel: contrasts-with, to: robust-mixture-prior}
- {rel: used-in, to: optimizer-smart-trial}
- {rel: part-of, to: bayesian-borrowing}
equations: [eq-power, eq-npp, eq-borrow-marg]
functions: [grid_update, borrow_power_prior, borrow_marginal_a0, borrow_rare_table]
results: []
lab: [09-adaptive-bayesian]
cites: [ibrahim2000, duan2006water, neuenschwander2009note, chenibrahim2006, ibrahim2015]
---
## What it is

The power prior of Ibrahim and Chen (2000) down-weights historical data $D_h$ with a single parameter $a_0$ [sec-borrowing-power]:

$$
\pi(\theta \mid D_h, a_0) \propto L(\theta \mid D_h)^{a_0}\,\pi_0(\theta),\qquad 0\le a_0\le 1.
$$

Setting $a_0=0$ discards the historical data and $a_0=1$ pools them fully (eq-power). [sec-borrowing-power] If $a_0$ is fixed in advance the method is static. [sec-borrowing-power] With a Beta$(1,1)$ initial prior the power prior is Beta$(1+a_0y_h,\,1+a_0(n_h-y_h))$, so its effective sample size is $a_0 n_h+2$. With $n_h=100$ and $a_0=0.3$ the historical arm counts as about 30 patients. [sec-borrowing-power]

## Why it matters

The regulator sees the borrowing in one number, the effective sample size, and FDA's distinction between static and dynamic borrowing is the distinction between a fixed and a learned $a_0$. [sec-borrowing-power]

## In the book

If $a_0$ is given its own prior, the data can choose it. The *normalized power prior* divides by the $a_0$-dependent constant (eq-npp), and the marginal posterior of $a_0$ rises when the current data resemble the historical data. [sec-borrowing-power] In the rare-disease example, 12 responders in 40 historical controls are borrowed for a trial with 6 of 15 on control, and the marginal likelihood of the current controls guides $a_0$ (eq-borrow-marg). [sec-borrowing-rare] Pr(pT>pC) is 0.83 without borrowing and 0.95 at $a_0=0.5$, and the marginal likelihood is maximized at $a_0=1$ with m(1)/m(0)=2.3. [sec-borrowing-rare] The tirzepatide chain divides the REWIND variance by $a_0$. [sec-borrowing-chain]

## Pitfalls

The power prior discounts the precision of the historical data but does not move their center. With $a_0=0.3$ the prior is Beta$(10,22)$, centered at 0.3125, and nothing in the method notices a conflict if the truth is 40%. [sec-borrowing-power] In the NSCLC case study a fixed-weight power prior did not reproduce the randomized result. [sec-borrowing-nsclc]

## Check yourself

- Q: What does $a_0=0.3$ mean for a historical arm of 100? A: It counts as about 30 patients. [sec-borrowing-power]
- Q: Does discounting fix a biased center? A: No, it only widens the prior. [sec-borrowing-power]
