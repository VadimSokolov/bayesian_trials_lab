# Entity schema

One Markdown file per entity at `entities/<id>.md`: YAML frontmatter, then a short body. The site, the graph export and the tutor are all generated from these files; `tools/validate.py` checks them against `build/skeleton.json` (the extracted book).

## Frontmatter

```yaml
id: predictive-probability-of-success     # lowercase, hyphens; equals the file name; never reused
name: Predictive probability of success   # display name, sentence case
type: concept                             # one of the types below
aliases: [predictive probability, PPoS]   # other names in the book; used by search
level: 2                                  # 1 foundation, 2 core, 3 advanced
summary: >-                               # one plain sentence, at most 30 words
  The chance that the trial will meet its final success rule if it continues, averaging over what the remaining patients might show.
chapters: ["15", "14"]                    # chapter numbers where it is discussed, main one first
home: sec-pp                              # section id (from the skeleton) where it is defined or treated most fully
sections: [sec-pp, sec-goldilocks]        # other section ids that treat it (not passing mentions)
prerequisites: [posterior-distribution, conditional-power]   # entity ids a reader needs first (direct ones only)
related:                                  # typed edges to other entity ids
  - {rel: generalizes, to: conditional-power}
  - {rel: used-in, to: calgb-49907}
equations: [eq-pp]                        # equation ids from the skeleton
functions: [pp_beta_binomial]             # bayestrials exports that compute it
results: []                               # results.yaml ids
lab: [07-interim-looks]                   # lab module ids (skeleton "lab")
cites: [lan1982stochastically]            # bib keys the book cites for it (from the sections' cites)
```

Types: `concept` (an idea or quantity: posterior, type I error, effective sample size), `method` (a procedure or model: Thompson sampling, O'Brien-Fleming boundary, power prior, CRM), `design` (a trial design family: group sequential design, platform trial, Goldilocks design), `trial` (a real trial: SELECT, EOLIA, BNT162b2), `regulation` (a statute, regulation, guidance or program: FDA Bayesian draft guidance 2026, ICH E9(R1), CID program), `organization` (FDA, EMA, a data monitoring committee as a body), `software` (an R package or product other than bayestrials: rpact, FACTS), `principle` (a named rule or theorem: likelihood principle, Ville's inequality, stopping rule principle), `history` (a historical episode or person-centered story when the book treats it as such).

Relations (`rel`): `generalizes`, `special-case-of`, `alternative-to`, `contrasts-with`, `part-of`, `uses` (method uses concept), `used-in` (method or design used in a trial), `governed-by` (topic to regulation), `computes` (not used: functions go in `functions`), `illustrates` (a trial illustrates a concept), `critiques`, `precedes` (historical order). Prerequisites are not repeated in `related`.

## Body

Plain, short sentences for a clinician or a strong student. 150 to 350 words. Sections, in this order, each optional except the first:

- `## What it is`: definition in words, then the formula in `$$ ... $$` if the book gives one (copy the book's LaTeX; refer to its equation id).
- `## Why it matters`: what decision in a trial it changes.
- `## In the book`: the book's example or case, with its numbers; every number must appear in the cited section's text, table or figure caption.
- `## Pitfalls`: misreadings, limits, when the book says not to use it.
- `## Check yourself`: 2 or 3 predict-then-check questions with short answers, written as `- Q: ... A: ...`; the answers come from the book.

Every factual sentence ends with a section key in brackets, like `[sec-pp]` or `[15/the-normal-case]`, pointing to the section that supports it. Section keys are the first column of `build/chapters/<N>.md` (labeled sections are `sec-...`; unlabeled ones are `<chapter>/<anchor>`); `home` and `sections` use the same keys. Link other entities inline as `[[entity-id]]` or `[[entity-id|shown text]]`.

## Rules

- Never invent a number, date, trial fact or citation; take them from the book's text. If the book does not say it, leave it out.
- No em dashes. American spelling. No hard wrapping.
- One entity per idea: use the vocabulary in `build/vocab.json` for ids; add a new entity only when the book treats it as a topic of its own (it has a section, an equation, a function, or at least a paragraph).
