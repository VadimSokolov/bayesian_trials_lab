#!/usr/bin/env python3
"""Build build/search_eval.json, the test set for tools/eval_search.mjs, deterministically from the data.

Groups: q (Check yourself questions from entity bodies, 20), alias (aliases and abbreviations, 15),
para (hand-written paraphrases of entity summaries, 15), sec (book-section queries, 10).
Each query has `entities` (entity ids that count as a hit) and `sections` (section ids that count as a hit).
Each query carries a `half` (0 or 1, by hash) so that weights can be tuned on one half and reported on the other.
Usage: python3 tools/make_search_eval.py
"""
import hashlib
import json
import re
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
H = lambda s: hashlib.sha1(s.encode()).hexdigest()

# hand-written paraphrases (not copied from the summaries); target = the entity or its home section
PARA = {
    'calgb-49907': 'Which breast cancer study in elderly women compared an oral chemotherapy pill with the standard treatment after surgery and was halted because it looked unlikely to succeed?',
    'backward-induction': 'How do you work out the best moment to stop a study by starting from the final analysis and reasoning in reverse?',
    'sample-size': 'Why does halving the effect we hope to detect quadruple the number of participants we need?',
    'platform-trial': 'One standing trial infrastructure for a single disease in which candidate treatments are added and dropped over time by preset rules',
    'bayesian-reanalysis': 'What should we believe about an already published study if we reinterpret its results with skeptical or enthusiastic starting beliefs?',
    'sequential-updating': 'Does it matter whether we absorb the data in small installments or all at once when revising our beliefs?',
    'type-ii-error': 'Chance of missing a real treatment benefit and discarding a drug that actually works',
    'operating-characteristics': 'How frequently will my design wrongly claim success or end early under various assumed true effects?',
    'confidence-sequence': 'Intervals that stay valid no matter when you decide to look at the data and stop',
    'noninformative-prior': 'Why is a very diffuse starting belief not truly neutral once you change the scale of the parameter?',
    'time-trend-bias': 'Patients enrolled later differ from earlier ones, so comparing arms across calendar time inflates false positives when allocation probabilities shift',
    'bonferroni-correction': 'Divide the significance level by the number of hypotheses so that the chance of any false alarm stays controlled',
    'ockham-penalty': 'Why does a Bayesian comparison automatically penalize a hypothesis that can fit many outcomes?',
    'sensitivity-analysis': 'Show how conclusions change as you vary how widely spread the starting belief is',
    'false-positive-risk': 'Given a statistically significant result, how likely is it that the medicine is actually useless?',
}


def main():
    sk = json.loads((ROOT / 'build' / 'skeleton.json').read_text(encoding='utf-8'))
    secs = sk['sections']
    lab2id = {}
    for s in secs:
        lab2id[s['id']] = s['id']
        if s.get('label') and s['label'] != 'None':
            lab2id[s['label']] = s['id']
    ents = []
    for f in sorted((ROOT / 'entities').glob('*.md')):
        m = re.match(r'---\n(.*?)\n---\n(.*)', f.read_text(encoding='utf-8'), re.S)
        fm = yaml.safe_load(m.group(1))
        ents.append((fm, m.group(2)))
    byid = {fm['id']: fm for fm, _ in ents}
    qs = []

    def add(group, query, entities, sections, note=''):
        qs.append({'id': f'{group}-{len(qs):02d}', 'group': group, 'query': query,
                   'entities': sorted(set(entities)), 'sections': sorted(set(sections)), 'half': int(H('half' + query), 16) % 2,
                   **({'note': note} if note else {})})

    # (a) Check yourself questions, one per entity, at least 8 words, hash order
    cand = []
    for fm, body in ents:
        sec = re.search(r'## Check yourself\n(.*?)(?:\n## |\Z)', body, re.S)
        if not sec:
            continue
        for line in sec.group(1).splitlines():
            m = re.match(r'- Q: (.*?) A: ', line)
            if m and len(m.group(1).split()) >= 8:
                cand.append((H('q' + fm['id'] + m.group(1)), fm['id'], m.group(1).strip()))
    cand.sort()
    seen = set()
    for _, eid, q in cand:
        if eid in seen:
            continue
        seen.add(eid)
        add('q', q, [eid], [])
        if len(seen) == 20:
            break

    # (b) aliases: 8 hash-picked abbreviations, PPoS, CRM, MAP prior, and 4 other single or two-word aliases
    owners = {}
    for fm, _ in ents:
        for a in fm.get('aliases') or []:
            owners.setdefault(str(a).lower(), []).append(fm['id'])
    ab, other = [], []
    for fm, _ in ents:
        for a in fm.get('aliases') or []:
            a = str(a)
            if a.lower() == fm['name'].lower() or a[:1].isdigit():
                continue
            if re.fullmatch(r'[A-Za-z][A-Za-z0-9]{1,6}', a) and sum(c.isupper() for c in a) >= 2:
                ab.append((H('a' + a), a))
            elif len(a.split()) <= 2 and len(a) > 5:
                other.append((H('o' + a), a))
    ab.sort(); other.sort()
    used = set()
    for lst, n in ((ab, 8), (other, 4)):
        k = 0
        for _, a in lst:
            if a.lower() in used or k == n:
                continue
            used.add(a.lower())
            add('alias', a, owners[a.lower()], [])
            k += 1
    for a, e in (('PPoS', 'predictive-probability-of-success'), ('CRM', 'continual-reassessment-method'), ('MAP prior', 'meta-analytic-predictive-prior')):
        used.add(a.lower())
        add('alias', a, [e], [])

    # (c) paraphrases
    for eid, q in PARA.items():
        add('para', q, [eid], [lab2id[byid[eid]['home']]] if byid[eid].get('home') in lab2id else [])

    # (d) sections: a middle sentence of a long section, 10 sections in hash order, one per chapter
    cand = []
    for s in secs:
        t = ' '.join((s.get('rendered') or s.get('text') or '').split())
        if len(t.split()) < 250:
            continue
        sents = [x.strip() for x in re.split(r'(?<=[.?!])\s+', t)]
        mid = [x for x in sents[len(sents) // 4: 3 * len(sents) // 4] if 14 <= len(x.split()) <= 28 and not re.search(r'[\d$\\{}()=<>_^|“”]', x)]
        if mid:
            cand.append((H('s' + s['id']), s['id'], s['chapter'], mid[len(mid) // 2]))
    cand.sort()
    chs = set()
    for _, sid, ch, sent in cand:
        if ch in chs:
            continue
        chs.add(ch)
        add('sec', sent, [], [sid])
        if len(chs) == 10:
            break

    out = {'note': 'Generated by tools/make_search_eval.py. A result is correct if its ref is in entities (kind entity) or sections (kind section).',
           'queries': qs}
    p = ROOT / 'build' / 'search_eval.json'
    p.write_text(json.dumps(out, indent=1, ensure_ascii=False) + '\n', encoding='utf-8')
    import collections
    print(collections.Counter(q['group'] for q in qs), collections.Counter(q['half'] for q in qs))
    for q in qs:
        if q['group'] in ('alias', 'sec'):
            print(q['group'], q['query'][:80], q['entities'], q['sections'])


if __name__ == '__main__':
    main()
