# Formulas in words: file format

One YAML file per labeled book equation: `formulas/<eq-id>.yaml` (for example `formulas/eq-pp.yaml`). Style model: https://vsokolov.org/courses/files/600/formula-english.html (local copy `~/Dropbox/www/courses/files/600/formula-english.html`): each colored piece of the formula has a matching colored phrase in an English sentence, and a one-line note.

```yaml
id: eq-pp                       # the equation id (build/skeleton.json "equations")
section: 15/from-conditional-power-to-predictive-probability   # section key where the book states it
title: Predictive probability of success                        # short name, sentence case
tex: >-                         # the book's LaTeX with pieces wrapped in \htmlClass{term cN}{...}; N in 1..6
  \htmlClass{term c1}{\mathrm{PP}} = \int \htmlClass{term c2}{\mathrm{CP}(\xi)}\, \htmlClass{term c3}{\pi(\xi \mid y_{1:n})}\, d\xi = \htmlClass{term c4}{\Pr(\text{final success criterion met} \mid y_{1:n})},
parts:                          # the English sentence as a list: plain strings and colored phrases
  - "The "
  - {k: c1, words: "predictive probability of success"}
  - " is "
  - {k: c2, words: "the conditional power at each possible effect"}
  - ", averaged with weights from "
  - {k: c3, words: "the posterior of the effect given the data so far"}
  - ". That is "
  - {k: c4, words: "the chance the final success rule is met, given the data so far"}
  - "."
notes:                          # one short line per color used: what the piece is and why it matters
  c1: "The chance the final success rule will be met if the trial continues."
  c2: "Power computed as if the effect were known to be xi."
  c3: "Today's belief about the effect; it replaces the single assumed effect of conditional power."
  c4: "The same quantity in words: what the trial will conclude at the end, judged from today."
```

Rules
- `tex` must be the book's LaTeX exactly once the `\htmlClass{term cN}{` wrappers are removed (the checker strips them and compares to the skeleton's tex, ignoring whitespace). Wrap only whole, balanced sub-expressions; do not split a `\frac`, `\left ... \right` pair, or an environment across a wrapper. Do not wrap inside `\text{}` or `\mathrm{}` arguments; wrap the whole command instead.
- Use 2 to 6 colors; color the pieces a reader must understand; leave operators and constants plain.
- The sentence reads as plain English for a clinician or a strong student; math inside `words` or notes only as short `$...$` when a symbol name helps (for example `$\xi$`).
- Every meaning comes from the book's own explanation of this equation (the section text around it, in the source .qmd or the skeleton's rendered text). No outside definitions, no numbers that the book does not give.
- No em dashes; American spelling.
- Multi-line equations (aligned, cases): color pieces within lines; keep line breaks as in the book.

Check with `python3 tools/check_formulas.py` (0 errors required).
