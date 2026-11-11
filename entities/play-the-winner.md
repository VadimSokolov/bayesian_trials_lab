---
id: play-the-winner
name: Play the winner
type: method
aliases: []
level: 2
summary: An urn allocation rule that adds a ball for the treatment that succeeded, so allocation drifts toward the apparent winner; used in the ECMO trial.
chapters: ['16']
home: sec-rar-ecmo
sections: [16/what-was-done, 16/what-the-rule-did-to-the-information, 16/exploring-and-exploiting, 16/the-aftermath-and-what-it-means-for-design]
prerequisites: [randomization]
related:
- {rel: used-in, to: ecmo-trial}
- {rel: part-of, to: response-adaptive-randomization}
equations: []
functions: [rar_ecmo_urn]
results: []
lab: []
cites: [zelen1969play, wei1978, bartlett1985]
---
## What it is

Zelen proposed the play-the-winner rule, and randomized versions followed [16/exploring-and-exploiting]. In its simplest urn form, start with one ball for each treatment and draw a ball to assign each patient [16/what-was-done]. After each outcome, add a ball for the treatment that succeeded, or for the other treatment after a failure [16/what-was-done].

## Why it matters

The ECMO trial of Bartlett and colleagues used a randomized play-the-winner rule [16/what-was-done]. As the urn drifted toward ECMO, one infant was assigned to conventional therapy and the other eleven to ECMO [16/what-was-done].

## In the book

The book simulates the urn with 12 infants and true survival 0.80 on ECMO and 0.20 on conventional therapy, against a fixed 6:6 trial analyzed by a one-sided Fisher exact test at level 0.025 [16/what-the-rule-did-to-the-information]. Play-the-winner puts few infants on the control arm, and in a sizable share of trials at most one, which makes a comparison essentially impossible [16/what-the-rule-did-to-the-information]. The rule gave more infants the treatment investigators believed in, at the cost of the information the trial was meant to produce [16/what-the-rule-did-to-the-information].

## Pitfalls

A rule that reacts to a few early outcomes can move allocation sharply on very little evidence, and an urn that has drifted toward a treatment that only looked best early takes a long time to correct [16/the-aftermath-and-what-it-means-for-design]. The pattern of every RAR design is in-trial reward against terminal information [16/what-the-rule-did-to-the-information].

## Check yourself

- Q: What does the urn do after a failure? A: It adds a ball for the other treatment [16/what-was-done].
- Q: What did play-the-winner cost the ECMO comparison? A: Information, because almost no infants were left on the control arm [16/what-the-rule-did-to-the-information].
