---
id: mcp-mod
name: MCP-Mod
type: method
aliases: [MCP Mod, dose response estimation]
level: 3
summary: 'A two-step dose-response method: a multiple contrast test over prespecified shapes, then model fitting and target-dose estimation.'
chapters: ['17']
home: sec-dose-response
sections: [sec-dose-response]
prerequisites: [dose-finding, familywise-error-rate]
related:
- {rel: governed-by, to: fda-fit-for-purpose-determination}
equations: []
functions: [mcp_contrasts, mcp_power]
results: []
lab: [14-studio]
cites: [bretz2005mcpmod, pinheiro2014model, fda_fit_for_purpose_2025]
---

## What it is
MCP-Mod combines a multiple comparison step with a modeling step. [sec-dose-response] Before the data, the protocol names candidate shapes (linear, Emax, exponential, umbrella) with guessed parameters. Each gives an optimal contrast of dose means. [sec-dose-response] The test of no dose-response is the maximum contrast statistic, with its critical value from their joint distribution, holding familywise type I error at one-sided 0.025. [sec-dose-response] If a signal appears, the passing models are fitted and a target dose is estimated by selection or averaging. [sec-dose-response]

## Why it matters
It is on FDA's fit-for-purpose list with a determination of 26 May 2016, the frequentist dose-finding method there. [sec-dose-response]

## In the book
With five doses, 40 per dose and standard deviation 1, the critical value is below the Bonferroni value for four comparisons because the monotone contrasts are positively correlated. [sec-dose-response] When the top dose returns to the placebo mean, the top-dose test has only its type I error rate, while the contrast test with an umbrella candidate keeps power. [sec-dose-response]

## Pitfalls
The candidate set is prespecified, and a truth outside it loses power, the counterpart of the CRM skeleton choice. [sec-dose-response] The test detects a non-flat dose-response, not benefit at some dose. [sec-dose-response]

## Check yourself
- Q: Why use an umbrella among the candidates? A: A top-dose-only comparison fails when the top dose returns to placebo. [sec-dose-response]
