---
id: interim-analysis
name: Interim analysis
type: concept
aliases: [repeated testing, interim look]
level: 1
summary: Any analysis comparing arms on efficacy or safety before formal completion, which inflates the type I error if each look uses a fixed level.
chapters: ['11', '15']
home: 11/why-repeated-testing-at-a-fixed-level-fails
sections: [11/why-repeated-testing-at-a-fixed-level-fails, sec-sequential, 11/the-armitage-recursion, 11/the-posterior-does-not-depend-on-the-stopping-rule, 11/spending-functions-and-the-information-fraction]
prerequisites: [type-i-error, z-test]
related:
- {rel: part-of, to: group-sequential-design}
- {rel: governed-by, to: fda-adaptive-design-guidance-2019}
- {rel: governed-by, to: ich-e9-r1}
- {rel: uses, to: sequential-updating}
equations: []
functions: [gs_power, gs_naive_inflation]
results: []
lab: [07-interim-looks]
cites: [armitage1969]
---

## What it is

ICH E9 defines an interim analysis as any analysis intended to compare arms on efficacy or safety before formal completion. Interim analyses should be carefully planned in advance and described in the protocol. [sec-sequential]

## Why it matters

Suppose a committee reviews the data $K$ times and declares success each time $Z > 1.96$. The chance that at least one statistic exceeds 1.96 is larger than 0.025, and it increases with $K$. Armitage and colleagues quantified this. [11/why-repeated-testing-at-a-fixed-level-fails]

Two equally spaced looks take the false positive rate from 2.5% to about 4.2%. [11/why-repeated-testing-at-a-fixed-level-fails] Four unadjusted looks at 1.96 give a type I error of 0.0631, more than two and a half times the nominal 0.025. [11/the-armitage-recursion]

## In the book

The inflation does not come from a flaw in the data. "Was $Z$ large at any of the looks" is a different event from "was $Z$ large at the end", and the null distribution computed for the second is the wrong one for the first. [11/why-repeated-testing-at-a-fixed-level-fails]

A committee that reviewed the data continuously at a fixed level would eventually see $Z$ exceed 1.96 with probability one, by the law of the iterated logarithm. [11/why-repeated-testing-at-a-fixed-level-fails] The rule that turns the data into a decision is part of the experiment, and the error rate belongs to the rule. [11/why-repeated-testing-at-a-fixed-level-fails]

## Pitfalls

- Looking is not free for the posterior, but it is for the error rate: a Bayesian rule perfectly calibrated under the prior can still reject a true null far above 2.5%. [11/the-posterior-does-not-depend-on-the-stopping-rule]
- A DMC that reviews safety without an efficacy comparison does not touch alpha at all. [11/spending-functions-and-the-information-fraction]

## Check yourself

- Q: What happens to the false positive rate with two equally spaced looks at 1.96? A: It rises from 2.5% to about 4.2%. [11/why-repeated-testing-at-a-fixed-level-fails]
- Q: Does continuous monitoring at a fixed cutoff ever stop being a problem? A: No, the cutoff is eventually crossed with probability one. [11/why-repeated-testing-at-a-fixed-level-fails]
