#!/usr/bin/env python3
"""One-off mechanical fixes after review: list cited sections, drop prerequisite duplicates in
related, move illustrates edges onto trial pages, invert used-in edges that point at non-trials."""
import os, re, yaml, json, glob
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
KEYRE = re.compile(r'\[((?:sec-[A-Za-z0-9_-]+)|(?:[0-9A-C]{1,2}/[a-z0-9-]+))\]')
secs = {s['id'] for s in json.load(open(os.path.join(ROOT, 'build', 'skeleton.json')))['sections']}
P = {}
for f in glob.glob(os.path.join(ROOT, 'entities', '*.md')):
    t = open(f, encoding='utf-8').read()
    m = re.match(r'^---\n(.*?)\n---\n(.*)$', t, re.S)
    P[os.path.basename(f)[:-3]] = [yaml.safe_load(m.group(1)), m.group(2), f]
def add_edge(src, rel, to):
    fm = P[src][0]; rl = fm.setdefault('related', []) or []
    fm['related'] = rl
    if to != src and to not in (fm.get('prerequisites') or []) and not any(r.get('to') == to for r in rl):
        rl.append({'rel': rel, 'to': to}); return 1
    return 0
n = collections = {'sections': 0, 'dup': 0, 'illus': 0, 'usedin': 0}
for i, (fm, body, f) in list(P.items()):
    listed = [fm.get('home')] + list(fm.get('sections') or [])
    for k in KEYRE.findall(body):
        if k in secs and k not in listed:
            fm.setdefault('sections', []); fm['sections'] = (fm['sections'] or []) + [k]; listed.append(k); n['sections'] += 1
    keep = []
    for r in fm.get('related') or []:
        to, rel = r.get('to'), r.get('rel')
        if to in (fm.get('prerequisites') or []):
            n['dup'] += 1; continue
        if to in P:
            tt = P[to][0].get('type')
            if rel == 'illustrates' and fm.get('type') not in ('trial', 'history') and tt in ('trial', 'history'):
                add_edge(to, 'illustrates', i); n['illus'] += 1; continue
            if rel == 'used-in' and tt not in ('trial', 'design'):
                add_edge(to, 'uses', i); n['usedin'] += 1; continue
        keep.append(r)
    fm['related'] = keep
ORDER = ['id', 'name', 'type', 'aliases', 'level', 'summary', 'chapters', 'home', 'sections', 'prerequisites', 'related', 'equations', 'functions', 'results', 'lab', 'cites']
class D(yaml.SafeDumper): pass
def flow(dumper, data):
    if all(not isinstance(x, (dict, list)) for x in data):
        return dumper.represent_sequence('tag:yaml.org,2002:seq', data, flow_style=True)
    return dumper.represent_sequence('tag:yaml.org,2002:seq', data, flow_style=False)
D.add_representer(list, flow)
D.add_representer(dict, lambda d, x: d.represent_mapping('tag:yaml.org,2002:map', x.items(), flow_style=set(x) <= {'rel', 'to'}))
for i, (fm, body, f) in P.items():
    out = {k: fm[k] for k in ORDER if k in fm}
    out.update({k: v for k, v in fm.items() if k not in out})
    y = yaml.dump(out, Dumper=D, sort_keys=False, allow_unicode=True, width=10**6)
    open(f, 'w', encoding='utf-8').write('---\n' + y + '---\n' + body)
print(n)
