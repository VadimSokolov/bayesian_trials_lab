# Audit brief: clinical and statistical realism

Read-only review. Write findings only to your output file in build/audit/. Repo: /Users/vsokolov/pap/bayesian_trials_lab.

The trigger: a lab page said "healthy and sick patients end up in both groups in about the same numbers". Trial participants are almost always patients who all have the condition (healthy volunteers appear mainly in Phase I and in prevention trials), so the right contrast is sicker vs less sick. Find every error of that kind: sentences that read fine but are wrong or misleading about how clinical trials, statistics or regulation actually work. Audience: clinicians, statisticians, students; a trialist reading the page should not wince.

Check for, among others:
- Who is in a trial and what happens to them: healthy vs sick, volunteers, consent, eligibility, placebo use (placebo is not always ethical or used; add-on to standard of care), "patients respond" without a treatment, blinding (who is blinded: patient, clinician, assessor), allocation concealment vs blinding, crossover, dropout.
- Terminology misuse: efficacy vs effectiveness; significant vs important; p-value as the probability the null is true or that results are due to chance; confidence interval as a probability statement about the parameter; credible vs confidence; power after the fact; type I error as "false approval"; randomization vs random sampling; intention-to-treat vs per protocol; hazard ratio vs risk ratio vs odds ratio; relative vs absolute risk; incidence vs prevalence; sensitivity vs specificity; "proves", "causes" overclaims; noninferiority vs equivalence; interim analysis vs looking at blinded data; DMC vs sponsor roles; phases (purpose and size); endpoints (surrogate vs clinical).
- Regulatory realism: what FDA or EMA require vs recommend; guidance status (draft/final) and dates; approval vs a trial "win"; one-sided 0.025 vs two-sided 0.05 (site-wide rule: a trial wins if one-sided p < 0.025, the same line as two-sided 0.05); "substantial evidence"; accelerated approval; labels.
- Real trials: facts stated about named trials (ECMO, RECOVERY, PANORAMIC, ISIS-2, CALGB 49907, EOLIA, BNT162b2, REMAP-CAP, SELECT, WHI, CAST, STAMPEDE, I-SPY 2, DAWN, lecanemab, GUSTO, ANDROMEDA-SHOCK and others): design, population, endpoint, result. Flag anything you know to be wrong or that looks overstated; say how sure you are. For encyclopedia pages, the book (section text in build/skeleton.json "sections", field "rendered") is the reference: flag a page that misstates the book; if you believe the book itself is wrong, say "BOOK?" so it can be checked.
- Misleading simplifications: a simplification is fine if labeled; flag ones that teach a wrong idea (for example "the coin makes the groups equal" without "on average").
- Internal contradictions between pages.

Do not report style, layout or wording preferences unless the wording is wrong or misleading. Do not report em dashes.

Output format, one line per finding:
`MAJOR|MINOR <file or entity id>:<line or section> | quote (short) | why it is wrong | concrete fix (replacement text)`
MAJOR = wrong or would mislead a reader; MINOR = imprecise. End with a 3-line summary (counts, patterns). Return to the caller only a concise summary (counts, 3 most serious, patterns), never the findings list.
