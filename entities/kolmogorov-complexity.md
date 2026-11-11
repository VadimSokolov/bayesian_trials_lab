---
id: kolmogorov-complexity
name: Kolmogorov complexity
type: concept
aliases: [randomness as incompressibility]
level: 3
summary: The length of the shortest program that outputs a string; a string is random if it cannot be described by anything much shorter than itself.
chapters: ['5']
home: 5/randomness-as-incompressibility
sections: [sec-randomization-randomness, 5/key-points]
prerequisites: [randomization]
related:
- {rel: contrasts-with, to: arnold-randomness-measure}
equations: []
functions: [rand_bits_lcg]
results: []
lab: []
cites: [kolmogorov1965three, martinlof1966definition, li2019kolmogorov]
---
## What it is
Compare 0101010101... with a string from coin tosses. The first can be described in a few words, "repeat 01". The second cannot be described more briefly than by writing it out. Kolmogorov turned this into a definition: a string is random if it cannot be described by anything much shorter than itself. [5/randomness-as-incompressibility]

Formally, the complexity of a string is the length of the shortest computer program that outputs it. [5/randomness-as-incompressibility]

## Why it matters
Randomness in this sense belongs to a sequence, not a procedure, and no finite sequence can be certified random because Kolmogorov complexity cannot be computed. A trialist can only apply tests. [5/randomness-as-incompressibility]

A sequence from a pseudo-random generator and a seed has low complexity by definition. That is not a flaw: what matters is that nobody can predict it without the seed. This is why the seed belongs in the sealed randomization specification. [5/randomness-as-incompressibility]

## In the book
A compression experiment used an everyday compressor in place of the shortest program. The alternation compressed to about 1 percent. The coin sequence compressed to about 0.18 of its size, with a floor of 0.125. [5/randomness-as-incompressibility]

The bits of a one-line multiplicative generator, $x_{k+1} = 75\,x_k \bmod 65537$, were not compressed either. The compressor could not tell them from a physically random quantum source. [5/randomness-as-incompressibility]

## Pitfalls
Passing a compression test is not a proof of randomness. [5/randomness-as-incompressibility] The equivalence between randomness and incompressibility holds for infinite sequences whose prefixes all have high prefix-free complexity, not for the finite-string definition. [5/randomness-as-incompressibility]

## Check yourself
- Q: Can a trialist certify a given schedule as Kolmogorov-random? A: No, the complexity cannot be computed. [5/randomness-as-incompressibility]
- Q: What does a clinical trial need from its generator instead? A: Documented statistical quality, a recorded seed, and a schedule the enrolling staff cannot see. [5/randomness-as-incompressibility]
