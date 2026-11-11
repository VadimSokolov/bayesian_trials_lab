---
id: rar-critique
name: Critiques of response-adaptive randomization
type: concept
aliases: [critiques of adaptive randomization]
level: 3
summary: The published case that outcome-adaptive randomization offers little over equal allocation in two arms, with its costs in power and variability, and the replies.
chapters: ['16']
home: sec-rar-critique
sections: [16/the-case-against-in-two-arms, 16/the-case-for-and-the-replies, 16/reproducing-the-critique]
prerequisites: [response-adaptive-randomization, power]
related:
- {rel: contrasts-with, to: fixed-allocation}
equations: []
functions: [rar_two_arm, rar_simulate]
results: []
lab: [14-studio]
cites: [korn2011rar, thall2015statistical, hey2015outcome, proschan2020rar, robertson2023response, berry1995adaptive, villar2020temptation]
---
## What it is

By the 2010s experience with Bayesian adaptive randomization in oncology produced criticisms that practitioners now regard as a fair statement of its costs [16/the-case-against-in-two-arms]. Korn and Freidlin argued that in two-arm trials it offers little over equal allocation [16/the-case-against-in-two-arms]. Thall, Fox and Wathen collected objections including lower power, highly variable arm sizes, a chance of more patients on the inferior arm, and sensitivity to time trends [16/the-case-against-in-two-arms].

## Why it matters

The replies matter too. Berry analyzed adaptive assignment as a decision problem and found randomization satisfactory when the disease is at least moderately common [16/the-case-for-and-the-replies]. On the book's reading the case is weakest in a two-arm confirmatory trial with a large outside population and strongest with several arms and a small population, and this is not a point of agreement [16/the-case-for-and-the-replies].

## In the book

The book reproduces the critique with a 400-patient trial at 0.30 against 0.45 under equal, Thompson and capped Thompson rules [16/reproducing-the-critique]. Thompson adds responders but power falls, and the number on the better arm varies much more [16/reproducing-the-critique]. The claim that RAR often puts more patients on the inferior arm is weaker in this scenario, where the effect is large and the outcome immediate [16/reproducing-the-critique]. The balanced review of Robertson and coauthors advises a burn-in, restricted extreme allocation, modeled time trends and an explicit ethical justification [16/the-case-against-in-two-arms].

## Pitfalls

The summaries follow the papers' main arguments and are not exhaustive [16/the-case-against-in-two-arms]. The loss of power is not a trade a sponsor should accept in a confirmatory setting [16/reproducing-the-critique].

## Check yourself

- Q: Which costs does the critique name for two arms? A: Lower power, variable arm sizes, and sensitivity to time trends [16/the-case-against-in-two-arms].
- Q: Which setting does the book find strongest for RAR? A: Several arms and a small population [16/the-case-for-and-the-replies].
