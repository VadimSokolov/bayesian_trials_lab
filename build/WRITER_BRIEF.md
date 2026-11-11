# Brief: write encyclopedia entity pages for your chapters

Project: an encyclopedia and knowledge graph on top of the book "Bayesian Clinical Trials and Personalized Medicine, Volume I" (Sokolova, Sokolov and Polson, 2026). Readers: clinicians, statisticians, students; later an AI research agent. Repo: /Users/vsokolov/pap/bayesian_clinical_trials_kg.

Read first (once): SCHEMA.md (the format; follow it exactly), build/vocab.json (the canonical entity list; use only these ids in links, prerequisites and related), and for each of your chapters build/chapters/<N>.md (its section keys, equations, package calls, key terms). The book source is /Users/vsokolov/pap/trials-book/<file>.qmd (file name in the first line of build/chapters/<N>.md). Read the chapter source in parts with offset and limit; do not re-read ranges you already have.

Your job: write entities/<id>.md for every vocab entity whose "owner" is one of your chapters (python: `[v for v in json.load(open('build/vocab.json')) if v['owner'] in MINE]`). Do not write pages owned by other chapters. If the book clearly treats a topic of its own in your chapters that has no vocab entry, you may add a page for it, with an id that does not collide, and list it in your summary.

How to write each page
- Take every fact and number from the book text of the sections you cite. Never use outside knowledge for facts, numbers, dates, trial results or citations. If the book does not say it, leave it out.
- Section keys come from build/chapters/<N>.md (first column). Cite one at the end of every factual sentence or bullet, like [sec-pp] or [15/the-normal-case]. A key from another chapter is fine when that section supports the sentence.
- Equations: copy the book's LaTeX exactly and list the equation id in `equations`.
- functions: only bayestrials exports that the book's code calls for this entity (see the calls column), or that clearly compute it.
- prerequisites: the direct ones only (what a reader must know first), from the vocab; keep the graph acyclic: a foundation never lists an advanced topic.
- related: typed edges per SCHEMA (generalizes, special-case-of, alternative-to, contrasts-with, part-of, uses, used-in, governed-by, illustrates, critiques, precedes).
- lab: lab module ids whose chapters include this entity's chapter and whose topic matches (skeleton "lab" list; e.g. 07-interim-looks covers interim looks and predictive probability).
- cites: bib keys the book cites for this entity in the sections you used (the `@key` citations in the source).
- Body: 150 to 350 words, plain short sentences, sections in the SCHEMA order; "Check yourself" has 2 or 3 predict-then-check questions with short answers from the book.
- Trials: what was tested, the design feature the book uses it for, the result as the book reports it. Regulations: issuer, status and date as the book gives them, and what they require.
- No em dashes, American spelling, no hard wrapping.

Check your work: run `python3 tools/validate.py --quiet --chapters <your chapter numbers, comma separated>` after every 10 pages or so and fix every ERROR in your own pages (ignore errors in other writers' pages; they work in parallel). Then run it without --quiet (same --chapters) and fix the warnings in your pages that are real (a number not in the cited section usually means a wrong key or an unsupported number). Never edit files other than your own entity pages.

Return only a concise summary: pages written (count, ids of any added entities), validator result for your pages, problems found in the book or the vocab (one line each). Never paste page contents.
