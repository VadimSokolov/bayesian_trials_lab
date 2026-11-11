# Brief: fix round after review

Repo /Users/vsokolov/pap/bayesian_clinical_trials_kg. Rules: SCHEMA.md and build/WRITER_BRIEF.md still apply. The skeleton now carries each section's rendered text (field "rendered" in build/skeleton.json "sections"; look up by id with python), which includes the numbers the book computes with inline R; numbers from it are now allowed and the validator checks them.

Your pages: those whose first chapter is in your range (python: frontmatter `chapters[0]`). Do, in order:
1. Apply every finding in your review file (build/review_N.md, named in your prompt) that concerns your pages. If you disagree with a finding after checking the book, skip it and say why in your summary.
2. Fix all remaining ERROR lines from `python3 tools/validate.py --chapters <your range>`:
   - governed-by must point to a regulation page. If the book names the governing document (e.g. ICH E9 (1998), an FDA DMC guidance, the EMA reflection paper) and no page exists, you may create one regulation page for it (only if the book gives at least a paragraph or a table row with its status; check appendix B, build/chapters/B.md and B-documents.qmd), otherwise change the edge to the closest correct relation or drop it.
   - illustrates must come from the trial or history page: move it there (edit the trial's page) or use another relation.
3. Fix the warnings: show the formula of every listed equation in "What it is" (copy the book's LaTeX), and fix any number the validator cannot find.
4. Relations: check the direction of precedes, critiques, generalizes and special-case-of on your pages and fix reversed ones. Prerequisites are direct ones only.
5. Thin pages: for every page in your range whose "In the book" section has no numbers but whose cited sections report a headline result (a table, a probability, a sample size, a threshold), add one or two sentences with the book's numbers from the rendered text, with the section key. Keep the body under 380 words.
6. Definitions: "What it is" must define the entity itself in one or two sentences before any example.

Run `python3 tools/validate.py --chapters <your range>` at the end: 0 errors in your pages. Do not edit pages outside your range except the trial pages in step 2 or a new regulation page. Never edit tools/, site/, SCHEMA.md or build/ files other than your new pages. Return only a concise summary: findings applied and skipped (with reasons), pages created, pages enriched (count), validator result, any book errors found (one line each). Never paste page contents.
