---
id: counterfactual
name: Counterfactual
type: concept
aliases: [counterfactual problem, potential outcomes]
level: 1
summary: For each patient we see only one outcome, never what would have happened under the other treatment, so a trial must compare groups instead.
chapters: ['5']
home: 5/the-counterfactual-problem
sections: [5/confounding-by-indication-a-doctor-picks-the-patients, 5/the-womens-health-initiative-2002-randomization-against-observational-evidence]
prerequisites: [clinical-trial]
related:
- {rel: contrasts-with, to: confounding-by-indication}
equations: [eq-selection]
functions: []
results: []
lab: [00-are-they-different]
cites: [rubin1974estimating, fisher1935design]
---
## What it is
For one patient we see one outcome. We never see what would have happened to the same patient under the other treatment. [5/the-counterfactual-problem]

Write $Y(1)$ for the outcome if treated and $Y(0)$ for the outcome if not. The treatment effect for that patient is $Y(1) - Y(0)$, and we can never observe both terms. The book calls this the fundamental problem of causal inference in Rubin's potential outcomes language. [5/the-counterfactual-problem]

What we can compare is groups. The difference in observed group means splits into the effect on those who were treated plus a selection bias term: [5/the-counterfactual-problem]

$$
\begin{aligned}
\underbrace{\mathbb{E}[Y \mid D=1] - \mathbb{E}[Y \mid D=0]}_{\text{what the trial shows}}
\;=\;& \underbrace{\mathbb{E}[Y(1) - Y(0) \mid D=1]}_{\text{effect on those who were treated}}\\
&+\; \underbrace{\mathbb{E}[Y(0) \mid D=1] - \mathbb{E}[Y(0) \mid D=0]}_{\text{selection bias}} .
\end{aligned}
$$

## Why it matters
The selection term asks how different the two groups were before the drug did anything. If groups were chosen in a way that depends on prognosis, it is not zero, and the observed difference mixes the drug effect with the effect of the choice. [5/the-counterfactual-problem]

If a coin that ignores everything about the patient makes the assignment, the term is zero on average and the difference in means estimates the average effect of the drug. The argument needs no assumption about which patient characteristics matter. [5/the-counterfactual-problem] This is the case for [[randomization]].

## In the book
The book uses the selection term again to read the Women's Health Initiative: women who chose hormone therapy differed from those who did not before any pill was taken. [5/the-womens-health-initiative-2002-randomization-against-observational-evidence] It also names the term as the reason the observational finding on [[confounding-by-indication]] fails. [5/confounding-by-indication-a-doctor-picks-the-patients]

## Pitfalls
The identity assumes complete adherence in the opening example. The intention-to-treat section separates assignment from receipt. [5/the-counterfactual-problem]

## Check yourself
- Q: Why can a trial never observe the individual treatment effect? A: Each patient has only one observed outcome, so $Y(1)$ and $Y(0)$ are never both seen. [5/the-counterfactual-problem]
- Q: When is the selection term zero? A: On average, when assignment is made by a coin that ignores the patient. [5/the-counterfactual-problem]
