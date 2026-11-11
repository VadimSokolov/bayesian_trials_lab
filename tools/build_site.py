#!/usr/bin/env python3
"""Build the static site data from entity pages and the book skeleton.

Reads entities/*.md (or --entities DIR), build/skeleton.json and build/vocab.json.
Writes site/data/kg.json, site/data/graph.json, site/llms.txt and copies the vendored
tutor skill to site/vendor/. Unknown links are reported as warnings, never as errors.
"""
import argparse
import json
import os
import re
import shutil
import sys
from datetime import date

try:
    import yaml
except ImportError:
    sys.exit('needs pyyaml (pip install pyyaml)')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

TYPES = ['concept', 'method', 'design', 'trial', 'regulation', 'organization', 'software', 'principle', 'history']

# relation -> label when read from the owner's page (out) and from the target's page (in)
REL_LABELS = {
    'generalizes': {'out': 'Generalizes', 'in': 'Special case of'},
    'special-case-of': {'out': 'Special case of', 'in': 'Generalizes'},
    'alternative-to': {'out': 'Alternative to', 'in': 'Alternative to'},
    'contrasts-with': {'out': 'Contrasts with', 'in': 'Contrasts with'},
    'part-of': {'out': 'Part of', 'in': 'Has part'},
    'uses': {'out': 'Uses', 'in': 'Used by'},
    'used-in': {'out': 'Used in', 'in': 'Uses'},
    'governed-by': {'out': 'Governed by', 'in': 'Governs'},
    'illustrates': {'out': 'Illustrates', 'in': 'Illustrated by'},
    'critiques': {'out': 'Critiques', 'in': 'Critiqued by'},
    'precedes': {'out': 'Precedes', 'in': 'Follows'},
}

KEY_RE = r'(?:sec-[A-Za-z0-9_-]+|[0-9A-Z]+/[A-Za-z0-9_.-]+)'
BRACKET_RE = re.compile(r'\[(' + KEY_RE + r'(?:\s*[,;]\s*' + KEY_RE + r')*)\]')
LINK_RE = re.compile(r'\[\[([a-z0-9-]+)(?:\|[^\]]*)?\]\]')

warnings = []


def warn(msg):
    warnings.append(msg)
    print('WARN ' + msg, file=sys.stderr)


def split_frontmatter(path):
    text = open(path, encoding='utf-8').read()
    m = re.match(r'^---\s*\n(.*?)\n---\s*\n?(.*)$', text, re.S)
    if not m:
        warn('%s: no frontmatter' % path)
        return None, text
    try:
        fm = yaml.safe_load(m.group(1)) or {}
    except yaml.YAMLError as e:
        warn('%s: bad YAML (%s)' % (path, e))
        return None, text
    return fm, m.group(2).strip()


def as_list(v):
    if v is None:
        return []
    if isinstance(v, (list, tuple)):
        return list(v)
    return [v]


def strip_classes(tex):
    """Remove \\htmlClass{term cN}{...} wrappers (balanced braces), keeping the content."""
    out, i = [], 0
    pat = re.compile(r'\\htmlClass\{term c[1-6]\}\{')
    stack = []  # brace depths at which a wrapper closes
    depth = 0
    while i < len(tex):
        m = pat.match(tex, i)
        if m:
            stack.append(depth)
            depth += 1
            i = m.end()
            continue
        ch = tex[i]
        if ch == '\\' and i + 1 < len(tex):
            out.append(tex[i:i + 2])
            i += 2
            continue
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
            if stack and stack[-1] == depth:
                stack.pop()
                i += 1
                continue
        out.append(ch)
        i += 1
    return ''.join(out)


def tex_key(tex):
    """Normalized LaTeX used to match a page formula to its equation (same rule as render.js)."""
    return re.sub(r'\s+', '', tex or '').rstrip('.,;')


def clean_rd(s):
    """Strip Rd markup from an R help string."""
    s = s or ''
    s = re.sub(r'\\link\[[^\]]*\]\{([^{}]*)\}', r'\1', s)
    for _ in range(4):
        s = re.sub(r'\\[A-Za-z]+\{([^{}]*)\}', r'\1', s)
    return re.sub(r'\s+', ' ', s).strip()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--entities', default=os.path.join(ROOT, 'entities'))
    ap.add_argument('--skeleton', default=os.path.join(ROOT, 'build', 'skeleton.json'))
    ap.add_argument('--vocab', default=os.path.join(ROOT, 'build', 'vocab.json'))
    ap.add_argument('--formulas', default=os.path.join(ROOT, 'formulas'))
    ap.add_argument('--out', default=os.path.join(ROOT, 'docs', 'encyclopedia'))
    args = ap.parse_args()

    sk = json.load(open(args.skeleton, encoding='utf-8'))
    vocab = []
    if os.path.exists(args.vocab):
        vocab = json.load(open(args.vocab, encoding='utf-8'))
    else:
        warn('no vocab.json; stub nodes skipped')

    book = sk['book']
    sections = {s['id']: s for s in sk['sections']}
    equations = {e['id']: e for e in sk['equations']}
    functions = {f['name']: f for f in sk['functions']}
    results = {r['id']: r for r in sk['results']}
    lab = {l['id']: l for l in sk['lab']}
    chapter_nums = {c['num'] for c in sk['chapters']}

    # compact section map for chips
    sec_map = {}
    for s in sk['sections']:
        sec_map[s['id']] = {'n': s['number'], 't': s['title'], 'u': s['url'], 'c': s['chapter']}

    # entities
    ents = {}
    files = sorted(f for f in os.listdir(args.entities) if f.endswith('.md')) if os.path.isdir(args.entities) else []
    for f in files:
        fm, body = split_frontmatter(os.path.join(args.entities, f))
        if fm is None:
            continue
        eid = fm.get('id') or f[:-3]
        if eid != f[:-3]:
            warn('%s: id %s differs from file name' % (f, eid))
        if eid in ents:
            warn('%s: duplicate id' % eid)
            continue
        if fm.get('type') not in TYPES:
            warn('%s: unknown type %r' % (eid, fm.get('type')))
        rel = []
        for r in as_list(fm.get('related')):
            if isinstance(r, dict) and r.get('to'):
                rel.append({'rel': r.get('rel', 'related'), 'to': r['to']})
            else:
                warn('%s: bad related entry %r' % (eid, r))
        ents[eid] = {
            'id': eid,
            'name': fm.get('name', eid),
            'type': fm.get('type', 'concept'),
            'aliases': [str(a) for a in as_list(fm.get('aliases'))],
            'level': int(fm.get('level', 2)),
            'summary': re.sub(r'\s+', ' ', str(fm.get('summary', ''))).strip(),
            'chapters': [str(c) for c in as_list(fm.get('chapters'))],
            'home': fm.get('home'),
            'sections': as_list(fm.get('sections')),
            'prerequisites': as_list(fm.get('prerequisites')),
            'related': rel,
            'equation_ids': as_list(fm.get('equations')),
            'function_names': as_list(fm.get('functions')),
            'result_ids': as_list(fm.get('results')),
            'lab_ids': [str(x) for x in as_list(fm.get('lab'))],
            'cites': as_list(fm.get('cites')),
            'body': body,
            'stub': False,
        }

    known = set(ents) | {v['id'] for v in vocab}

    def check(kind, eid, val, pool):
        if val not in pool:
            warn('%s: unknown %s %r' % (eid, kind, val))
            return False
        return True

    for eid, e in ents.items():
        for c in e['chapters']:
            check('chapter', eid, c, chapter_nums)
        if e['home']:
            check('section key', eid, e['home'], sec_map)
        for k in e['sections']:
            check('section key', eid, k, sec_map)
        for p in e['prerequisites']:
            check('prerequisite id', eid, p, known)
        for r in e['related']:
            check('related id', eid, r['to'], known)
            if r['rel'] not in REL_LABELS:
                warn('%s: unknown relation %r' % (eid, r['rel']))
        for q in e['equation_ids']:
            check('equation', eid, q, equations)
        for q in e['function_names']:
            check('function', eid, q, functions)
        for q in e['result_ids']:
            check('result', eid, q, results)
        for q in e['lab_ids']:
            check('lab id', eid, q, lab)
        for m in LINK_RE.finditer(e['body']):
            check('entity link', eid, m.group(1), known)
        keys = []
        for m in BRACKET_RE.finditer(e['body']):
            for k in re.split(r'\s*[,;]\s*', m.group(1)):
                keys.append(k)
                check('section key', eid, k, sec_map)
        used = set(keys) | set(x for x in [e['home']] + e['sections'] if x)
        e['chips'] = {k: sec_map[k] for k in sorted(used) if k in sec_map}
        e['equations'] = [{'id': q, 'tex': equations[q]['tex'], 'section': equations[q]['section']}
                          for q in e['equation_ids'] if q in equations]
        e['functions'] = [{'name': q, 'title': clean_rd(functions[q]['title']),
                           'usage': functions[q]['usage'], 'description': clean_rd(functions[q]['description'])}
                          for q in e['function_names'] if q in functions]
        e['results'] = [{'id': q, 'name': results[q]['name'], 'chapter': results[q]['chapter'],
                         'status': results[q].get('status'), 'summary': results[q].get('summary'),
                         'statement': results[q].get('statement')}
                        for q in e['result_ids'] if q in results]
        e['lab'] = [{'id': q, 'title': lab[q]['title'], 'url': lab[q]['url']} for q in e['lab_ids'] if q in lab]
        for k in ('equation_ids', 'function_names', 'result_ids', 'lab_ids'):
            del e[k]

    # stubs from vocab
    for v in vocab:
        if v['id'] in ents:
            continue
        home = v.get('home')
        chips = {}
        if home and home in sec_map:
            chips[home] = sec_map[home]
        chs = [str(c) for c in v.get('chapters', [])]
        if v.get('owner') and str(v['owner']) not in chs:
            chs.insert(0, str(v['owner']))
        ents[v['id']] = {
            'id': v['id'], 'name': v['name'], 'type': v['type'], 'aliases': v.get('aliases', []),
            'level': None, 'summary': '', 'chapters': chs, 'home': home, 'sections': [],
            'prerequisites': [], 'related': [], 'equations': [], 'functions': [], 'results': [],
            'lab': [], 'cites': [], 'body': '', 'chips': chips, 'stub': True,
        }

    # formulas in words: formulas/*.yaml, one per equation id
    formulas = []
    fdir = args.formulas
    ffiles = sorted(f for f in os.listdir(fdir) if f.endswith('.yaml')) if os.path.isdir(fdir) else []
    order = {e['id']: i for i, e in enumerate(sk['equations'])}
    for f in ffiles:
        try:
            d = yaml.safe_load(open(os.path.join(fdir, f), encoding='utf-8')) or {}
        except yaml.YAMLError as e:
            warn('formulas/%s: bad YAML (%s)' % (f, e))
            continue
        fid = d.get('id') or f[:-5]
        if fid not in equations:
            warn('formulas/%s: unknown equation %r' % (f, fid))
            continue
        tex = str(d.get('tex') or '').strip()
        if re.sub(r'\s+', '', strip_classes(tex)) != re.sub(r'\s+', '', equations[fid]['tex']):
            warn('formulas/%s: tex differs from the book equation; skipped' % f)
            continue
        parts = []
        for p in as_list(d.get('parts')):
            if isinstance(p, dict) and p.get('words') and re.fullmatch(r'c[1-6]', str(p.get('k'))):
                parts.append({'k': p['k'], 'words': str(p['words'])})
            elif isinstance(p, str):
                parts.append(p)
            else:
                warn('formulas/%s: bad part %r' % (f, p))
        notes = {str(k): str(v) for k, v in (d.get('notes') or {}).items() if re.fullmatch(r'c[1-6]', str(k))}
        used = {p['k'] for p in parts if isinstance(p, dict)}
        for k in sorted(used - set(notes)):
            warn('formulas/%s: no note for %s' % (f, k))
        sec = d.get('section') or equations[fid]['section']
        formulas.append({
            'id': fid, 'title': str(d.get('title') or fid), 'section': sec,
            'chapter': str(sec_map.get(sec, {}).get('c', '')),
            'tex': tex, 'key': tex_key(equations[fid]['tex']), 'parts': parts, 'notes': notes,
            'used_on': sorted(e['id'] for e in ents.values() if any(q['id'] == fid for q in e['equations'])),
            'order': order[fid],
        })
    formulas.sort(key=lambda x: x['order'])

    # reverse edges
    for e in ents.values():
        e['needed_for'] = []
        e['related_in'] = []
    for e in ents.values():
        for p in e['prerequisites']:
            if p in ents and p != e['id']:
                ents[p]['needed_for'].append(e['id'])
        for r in e['related']:
            if r['to'] in ents:
                ents[r['to']]['related_in'].append({'rel': r['rel'], 'from': e['id']})
    for e in ents.values():
        e['needed_for'] = sorted(set(e['needed_for']))

    # catalogued results with owning entities
    res_list = []
    for r in sk['results']:
        owners = [e['id'] for e in ents.values() if any(x['id'] == r['id'] for x in e['results'])]
        res_list.append({'id': r['id'], 'name': r['name'], 'chapter': r['chapter'], 'status': r.get('status'),
                         'summary': r.get('summary'), 'statement': r.get('statement'),
                         'highlight': bool(r.get('highlight')), 'entities': owners})

    # chapters and parts
    chapters = []
    parts = []
    for c in sk['chapters']:
        secs = [{'key': k, 'number': sections[k]['number'], 'title': sections[k]['title'],
                 'url': sections[k]['url'], 'level': sections[k]['level']} for k in c['sections'] if k in sections]
        chapters.append({'num': c['num'], 'title': c['title'], 'url': c['url'], 'part': c.get('part') or '',
                         'summary': c.get('summary', ''), 'key_terms': c.get('key_terms', []),
                         'literature': c.get('literature', ''), 'sections': secs})
        if not parts or parts[-1]['name'] != (c.get('part') or ''):
            parts.append({'name': c.get('part') or '', 'chapters': []})
        parts[-1]['chapters'].append(c['num'])

    kg = {
        'book': book,
        'generated': date.today().isoformat(),
        'types': TYPES,
        'rel_labels': REL_LABELS,
        'parts': parts,
        'chapters': chapters,
        'sections': sec_map,
        'results': res_list,
        'lab': sk['lab'],
        'formulas': formulas,
        'entities': ents,
    }

    # graph
    deg = {k: 0 for k in ents}
    edges = []
    for e in ents.values():
        for p in e['prerequisites']:
            if p in ents:
                edges.append({'source': p, 'target': e['id'], 'kind': 'prerequisite'})
        for r in e['related']:
            if r['to'] in ents:
                edges.append({'source': e['id'], 'target': r['to'], 'kind': 'related', 'rel': r['rel']})
    for ed in edges:
        deg[ed['source']] += 1
        deg[ed['target']] += 1
    nodes = [{'id': e['id'], 'name': e['name'], 'type': e['type'], 'level': e['level'], 'stub': e['stub'],
              'chapters': e['chapters'], 'degree': deg[e['id']]} for e in ents.values()]
    graph = {'nodes': nodes, 'edges': edges}

    data_dir = os.path.join(args.out, 'data')
    os.makedirs(data_dir, exist_ok=True)
    with open(os.path.join(data_dir, 'kg.json'), 'w', encoding='utf-8') as f:
        json.dump(kg, f, ensure_ascii=False, separators=(',', ':'))
    with open(os.path.join(data_dir, 'graph.json'), 'w', encoding='utf-8') as f:
        json.dump(graph, f, ensure_ascii=False, indent=1)

    # vendored tutor skill (the site fetches it for the tutor prompt)
    vsrc = os.path.join(ROOT, 'vendor', 'socratic-tutor')
    vdst = os.path.join(args.out, 'vendor', 'socratic-tutor')
    if os.path.isdir(vsrc):
        os.makedirs(vdst, exist_ok=True)
        for fn in ('SKILL.md', 'LICENSE.md'):
            shutil.copy(os.path.join(vsrc, fn), os.path.join(vdst, fn))
    else:
        warn('vendor/socratic-tutor missing; the tutor needs it')

    n_pages = sum(1 for e in ents.values() if not e['stub'])
    n_stubs = sum(1 for e in ents.values() if e['stub'])
    llms = f"""# {book['title']}: encyclopedia and knowledge graph

This site is a study aid on top of the book "{book['title']}" ({book['authors']}, 2026).
It has one short page per concept, method, design, trial, regulation and principle in the book,
with prerequisite links, section-level pointers into the book, equations, R functions of the
bayestrials package and links to the companion lab. Every statement on an entity page cites a
section of the book. The book is the source of truth; these pages are a navigation layer.

## Cite the book

{book['authors']} (2026). {book['title']}. Version {book['version']}.
DOI: https://doi.org/{book['doi']}
HTML edition: {book['html']}
Companion lab: https://vsokolov.org/bayesian_trials_lab/

## Machine-readable data

- data/kg.json: book metadata, chapters, section map, results, lab modules and all entities
  (frontmatter fields, Markdown body, resolved section links, reverse edges, equations, functions).
- data/graph.json: plain node and edge lists. Edge kinds: "prerequisite" (source is needed before target)
  and "related" (typed by "rel").
- Entity ids are lowercase with hyphens. Section keys such as sec-pp or 15/the-normal-case are in
  data/kg.json under "sections", each with number, title and URL in the HTML edition.

## Size

{n_pages} written pages, {n_stubs} planned pages (stubs), {len(edges)} edges. Built {date.today().isoformat()}.

## Tutor method

Adapted from Jane Street's socratic-tutor skill (MIT): https://github.com/janestreet/agent_skills
"""
    with open(os.path.join(args.out, 'llms.txt'), 'w', encoding='utf-8') as f:
        f.write(llms)

    wpath = os.path.join(ROOT, 'build', 'site_warnings.txt')
    os.makedirs(os.path.dirname(wpath), exist_ok=True)
    with open(wpath, 'w', encoding='utf-8') as f:
        f.write('\n'.join(warnings) + ('\n' if warnings else ''))
    print('built %d pages, %d stubs, %d edges, %d formulas, %d warnings (build/site_warnings.txt)'
          % (n_pages, n_stubs, len(edges), len(formulas), len(warnings)))


if __name__ == '__main__':
    main()
