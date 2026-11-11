#!/usr/bin/env python3
"""Validate entity pages against the schema and the extracted book.

Errors: broken ids, unknown section keys, equations, functions, results or lab modules,
prerequisite cycles, em dashes, missing required fields.
Warnings: numbers in the body that do not appear in the sections the sentence cites,
sentences without a section key, pages outside the length range.

Usage: python3 tools/validate.py [ENTITY_DIR] [--chapters 14,15] [--quiet]
(--chapters limits per-page checks to pages whose first chapter is listed)
"""
import json, os, re, sys, glob, collections

import yaml

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
TYPES = {'concept', 'method', 'design', 'trial', 'regulation', 'organization', 'software', 'principle', 'history'}
RELS = {'generalizes', 'special-case-of', 'alternative-to', 'contrasts-with', 'part-of', 'uses', 'used-in',
        'governed-by', 'illustrates', 'critiques', 'precedes'}
REQ = ['id', 'name', 'type', 'level', 'summary', 'chapters', 'home']
KEYRE = re.compile(r'\[((?:sec-[A-Za-z0-9_-]+)|(?:[0-9A-C]{1,2}/[a-z0-9-]+))\]')
LINK = re.compile(r'\[\[([a-z0-9-]+)(?:\|[^\]]*)?\]\]')
NUM = re.compile(r'(?<![\w.^_{])(\d+(?:[.,]\d+)*)(?![\w])')


def load(path):
    t = open(path, encoding='utf-8').read()
    m = re.match(r'^---\n(.*?)\n---\n(.*)$', t, re.S)
    if not m:
        return None, t
    return yaml.safe_load(m.group(1)) or {}, m.group(2)


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    quiet = '--quiet' in sys.argv
    chap = None
    if '--chapters' in sys.argv:
        raw = sys.argv[sys.argv.index('--chapters') + 1]
        chap = set(raw.split(','))
        args = [a for a in args if a != raw]
    edir = args[0] if args else os.path.join(ROOT, 'entities')
    sk = json.load(open(os.path.join(ROOT, 'build', 'skeleton.json')))
    vocab_p = os.path.join(ROOT, 'build', 'vocab.json')
    vocab = {v['id']: v for v in json.load(open(vocab_p))} if os.path.exists(vocab_p) else {}
    secs = {s['id']: s for s in sk['sections']}
    eqs = {e['id'] for e in sk['equations']}
    funcs = {f['name'] for f in sk['functions']}
    results = {r['id'] for r in sk['results']}
    labs = {l['id'] for l in sk['lab']}
    caps = collections.defaultdict(str)
    for t in sk['tables'] + sk['figures']:
        caps[t['section']] += ' ' + (t.get('caption') or '')
    files = sorted(glob.glob(os.path.join(edir, '*.md')))
    ents = {}
    errs, warns = [], []
    for f in files:
        fm, body = load(f)
        name = os.path.basename(f)[:-3]
        if fm is None:
            errs.append((name, 'no frontmatter')); continue
        ents[name] = (fm, body)
    known = set(ents) | set(vocab)
    def typeof(i):
        if i in ents:
            return ents[i][0].get('type')
        return vocab.get(i, {}).get('type')
    for name, (fm, body) in ents.items():
        if chap and str((fm.get('chapters') or [''])[0]) not in chap:
            continue
        E = lambda m: errs.append((name, m))
        W = lambda m: warns.append((name, m))
        for k in REQ:
            if fm.get(k) in (None, '', []):
                E('missing ' + k)
        if fm.get('id') != name:
            E('id %r differs from file name' % fm.get('id'))
        if fm.get('type') not in TYPES:
            E('bad type %r' % fm.get('type'))
        if fm.get('level') not in (1, 2, 3):
            E('bad level %r' % fm.get('level'))
        if len(str(fm.get('summary', '')).split()) > 35:
            W('summary over 35 words')
        for k in [fm.get('home')] + list(fm.get('sections') or []):
            if k and k not in secs:
                E('unknown section key %s' % k)
        for p in fm.get('prerequisites') or []:
            if p not in known:
                E('unknown prerequisite %s' % p)
            if p == name:
                E('self prerequisite')
        for r in fm.get('related') or []:
            if not isinstance(r, dict) or r.get('rel') not in RELS:
                E('bad related entry %r' % r); continue
            if r.get('to') not in known:
                E('unknown related target %s' % r.get('to'))
                continue
            ttype = typeof(r['to'])
            if r['to'] in (fm.get('prerequisites') or []):
                E('%s is both a prerequisite and related (%s)' % (r['to'], r['rel']))
            if r['rel'] == 'used-in' and ttype not in ('trial', 'design'):
                E('used-in must point to a trial or design, not %s %s' % (ttype, r['to']))
            if r['rel'] == 'illustrates' and fm.get('type') not in ('trial', 'history'):
                E('illustrates must come from a trial or history page (point the edge from the trial instead): %s' % r['to'])
            if r['rel'] == 'governed-by' and ttype != 'regulation':
                E('governed-by must point to a regulation, not %s %s' % (ttype, r['to']))
            if r['rel'] == 'critiques' and r['to'] == name:
                E('self critique')
        for e in fm.get('equations') or []:
            if e not in eqs:
                E('unknown equation %s' % e)
        if (fm.get('equations') or []) and '$$' not in body:
            W('lists equations but shows no display formula')
        cited = set(KEYRE.findall(body))
        listed = set([fm.get('home')] + list(fm.get('sections') or []))
        for k in sorted(cited - listed):
            W('body cites %s but it is not in home/sections' % k)
        for k in sorted(cited):
            if k in secs and not (secs[k].get('rendered') or secs[k]['text']).strip():
                W('cites %s, whose own text is empty (cite a subsection)' % k)
        for x in fm.get('functions') or []:
            if x not in funcs:
                E('unknown function %s' % x)
        for x in fm.get('results') or []:
            if x not in results:
                E('unknown result %s' % x)
        for x in fm.get('lab') or []:
            if x not in labs:
                E('unknown lab module %s' % x)
        whole = json.dumps(fm, ensure_ascii=False) + body
        if '—' in whole or ' -- ' in body or any('---' in l and not l.lstrip().startswith('|') for l in body.split('\n')):
            E('em dash')
        for m in LINK.finditer(body):
            if m.group(1) not in known:
                E('unknown link [[%s]]' % m.group(1))
        words = len(body.split())
        if words < 100 or words > 450:
            W('body has %d words' % words)
        if '## What it is' not in body:
            E('missing "## What it is"')
        # sentence level checks, outside math and code
        plain = re.sub(r'\$\$.*?\$\$', ' ', body, flags=re.S)
        plain = re.sub(r'\$[^$]*\$', ' ', plain)
        plain = re.sub(r'`[^`]*`', ' ', plain)
        for para in plain.split('\n'):
            p = para.strip()
            if not p or p.startswith('#') or p.startswith('- Q:') and 'A:' not in p:
                continue
            keys = KEYRE.findall(p)
            for k in keys:
                if k not in secs:
                    E('unknown section key in body [%s]' % k)
            text = ' '.join(secs[k]['text'] + ' ' + secs[k].get('rendered', '') + caps[k] for k in keys if k in secs)
            if not keys and len(p.split()) > 12 and not p.startswith('- Q:'):
                W('paragraph without a section key: ' + p[:60])
            for n in NUM.findall(LINK.sub(' ', KEYRE.sub(' ', p))):
                if len(n.replace(',', '').replace('.', '')) < 2 and '.' not in n:
                    continue
                if keys and n not in text and n.replace(',', '') not in text.replace(',', ''):
                    W('number %s not found in cited sections: %s' % (n, p[:60]))
    # prerequisite cycles
    g = {n: [p for p in (fm.get('prerequisites') or []) if p in ents] for n, (fm, _) in ents.items()}
    state = {}
    def dfs(u, stack):
        state[u] = 1; stack.append(u)
        for v in g.get(u, []):
            if state.get(v) == 1:
                errs.append((u, 'prerequisite cycle: ' + ' -> '.join(stack[stack.index(v):] + [v])))
            elif v not in state:
                dfs(v, stack)
        stack.pop(); state[u] = 2
    for n in g:
        if n not in state:
            dfs(n, [])
    for n, m in errs:
        print('ERROR', n, m)
    if not quiet:
        for n, m in warns:
            print('warn ', n, m)
    print('%d entities, %d errors, %d warnings' % (len(ents), len(errs), len(warns)))
    sys.exit(1 if errs else 0)


if __name__ == '__main__':
    main()
