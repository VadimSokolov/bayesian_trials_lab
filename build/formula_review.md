# Formula-in-words review (every third file, 33 of 99)

Files reviewed: sorted(glob("formulas/eq-*.yaml"))[::3]. Each checked against the book text of its section in build/skeleton.json.

## Findings

MAJOR eq-loghr-lik: c1 words "the estimated log hazard ratio" have the wrong sign; the book defines $\theta = -\log\mathrm{HR}$ so $\hat\theta$ is minus the estimated log hazard ratio (the note says so, the colored phrase contradicts it, and c2 "the true effect" is then on a different scale) -> c1 words "the estimated effect (minus the log hazard ratio, so positive means benefit)".
MAJOR eq-sv-schoenfeld: c3 note "Grows fast as the target effect shrinks toward a hazard ratio of one" is attached to the denominator $(\log\mathrm{HR})^2$, which shrinks toward zero; it is $D$ that grows -> c3 note "Shrinks toward zero as the target hazard ratio nears one, so the required events grow fast."
MAJOR eq-ni-synth: c3 words "the allowed fraction of the control's effect over placebo" read as the retained fraction $f$; the book says $(1-f)\delta_{CP}$ is the loss of effect that is allowed -> c3 words "the part of the control's effect over placebo that may be lost, $(1-f)$ times that effect".
MINOR eq-ni-synth: c1 wraps only $\text{data}$, but its note describes the whole probability -> c1 note "All the data: the historical trials and the noninferiority trial", and move the "posterior probability that the new drug retains at least the fraction $f$" sentence into the plain text of the sentence.
MINOR eq-bi-single: c2 words "adopting the drug only if it beats the standard rate" omit that the comparison uses the posterior mean, and drop the abandon branch -> "the payoff from stopping: adopt if the posterior mean response rate beats the standard rate, otherwise abandon for zero".
MINOR eq-commensurate: the sentence says "centered at the historical parameter" but c2 colors the $\eta_h$ in the conditioning, not the mean inside $N(\eta_h, \cdot)$, which is left plain -> wrap the $\eta_h$ inside $N(\cdot)$ with c2 as well (or instead); c4 note repeats c4 words -> c4 note "Small $\tau_c$ means a wide prior around the historical value, so little borrowing."
MINOR eq-events: c3 note "the one planning assumption the book says carries no prior probability" is self-referential and implies uniqueness; also $\theta_a$ is minus the log hazard ratio -> c3 note "The design alternative, $\theta_a = -\log\mathrm{HR}$ (0.288 for HR 0.75): a planning assumption that assigns no prior probability to any effect."
MINOR eq-ss-events: c2 words "four times the squared error-rate quantiles" misstate the expression (it is the square of the sum) -> "four times the square of the sum of the two error-rate quantiles".
MINOR eq-sv-schoenfeld: the plain text says "is four times" but the 4 sits inside the c2 wrapper -> move "four times" into the c2 phrase ("four times the squared sum of ...") and change the plain text to " is ".
MINOR eq-lairobbins: c2 note "grows at least like $\log T$, not linearly" mixes the lower bound with what the best policy achieves -> "A good policy must give the inferior arm a number of patients growing like $\log T$; the best policy's regret is logarithmic, not linear."
MINOR eq-safety-ville: lead-in "If there is no harm" suggests the composite null $RR \le 1$, while the equation conditions on $RR = 1$ -> "If the drug leaves the risk unchanged ($RR = 1$), ".
MINOR eq-testing-pvalue: c1 note "the share of the right-hand histogram" refers to a figure the reader of the formula card does not see -> "The share of rerun trials, under no effect, whose statistic is beyond the observed value."
MINOR eq-tolls: c5 note "about 7.38" omits that the book's 7.38 is $2\log 40$, i.e. $\alpha = 0.025$ -> "At $\alpha = 0.025$ the extra $2\log(1/\alpha) = 7.38$ over the Bayes bar at $b = 1$, at large information; a property of this construction." Also c5 words "a larger fixed surcharge" is only larger than c3's term when $1/\alpha > b$ -> "the Ockham penalty plus a fixed surcharge of $2\log(1/\alpha)$".
MINOR eq-predictive-bellman: c3 note "Cost per pair, normalized by $L_{FP}+L_{FN}$" holds only for the classification loss; the book also uses a utility loss -> "Cost of one more pair (normalized by $L_{FP}+L_{FN}$ in the classification version)."
MINOR eq-bayes-risk: c3 note puts the "frequentist leaves out these weights" point on the second term only, but the book's point is about the weights on both terms -> c3 note "The cost of missed drugs." and c1 note "Expected loss over parameter and data; reporting only $\alpha$ and $\beta$ leaves out the weights (prior probability times loss)."
MINOR eq-bf-gauss: c2 words "a penalty for the spread of the prior" hide that $k = I_n\tau^2$ also grows with the data, which is the book's point (the penalty grows like $\log I_n$) -> "a penalty that grows with the information in the data relative to the prior".

## Assessment

33 files reviewed: 19 clean (eq-alpha-ac, eq-arnold, eq-bayes, eq-chain, eq-cp, eq-ess-beta, eq-fpr, eq-hier, eq-md-power, eq-mult-hier, eq-ockham-ch10, eq-power-z, eq-pp, eq-re-se, eq-safety-benefitrisk, eq-selection, eq-sequential, eq-shrink, eq-sqrt-rule), 14 with findings: 3 MAJOR, 15 MINOR.

Patterns:
- Sign convention of $\theta = -\log\mathrm{HR}$ is the most frequent slip (eq-loghr-lik words, eq-events note); the time-to-event cards should all say "minus the log hazard ratio" when they mean $\theta$.
- Notes on a denominator sometimes describe the behavior of the whole quantity (eq-sv-schoenfeld), and words around $f$ vs $1-f$ blur retained versus lost effect (eq-ni-synth).
- Wrapper and sentence occasionally disagree: a constant inside the wrapper but spelled in plain text (eq-sv-schoenfeld), or the colored symbol is not the occurrence the sentence talks about (eq-commensurate), or a wrapper on a small token carries a note about the whole expression (eq-ni-synth).
- Notes otherwise stay close to the book and add no outside facts; the only numbers used (2, 7.38, 1.96, 0.288) are the book's, though 7.38 needs its $\alpha$.
- Plain English is generally good; the clinician-facing sentences read well, with only a few dense phrases (eq-ss-events c2, eq-tolls).
