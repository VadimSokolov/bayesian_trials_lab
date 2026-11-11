#!/usr/bin/env python3
"""Check formulas/<eq-id>.yaml against the book's equations (see formulas/FORMAT.md).

Usage: python3 tools/check_formulas.py [eq-id ...]
"""
import glob, json, os, re, sys

import yaml

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')


def strip_wrappers(t):
    """Remove \\htmlClass{term cN}{...} wrappers, keeping the inner expression."""
    out, i = [], 0
    pat = re.compile(r'\\htmlClass\{term c[1-6]\}\{')
    while True:
        m = pat.search(t, i)
        if not m:
            out.append(t[i:]); break
        out.append(t[i:m.start()])
        depth, j = 1, m.end()
        while j < len(t) and depth:
            if t[j] == '\\':
                j += 2; continue
            depth += {'{': 1, '}': -1}.get(t[j], 0)
            j += 1
        if depth:
            raise ValueError('unbalanced wrapper at %d' % m.start())
        out.append(strip_wrappers(t[m.end():j - 1]))
        i = j
    return ''.join(out)


def norm(t):
    return re.sub(r'\s+', '', t)


def main():
    sk = json.load(open(os.path.join(ROOT, 'build', 'skeleton.json')))
    eqs = {e['id']: e for e in sk['equations']}
    secs = {s['id'] for s in sk['sections']}
    want = set(sys.argv[1:])
    files = sorted(glob.glob(os.path.join(ROOT, 'formulas', 'eq-*.yaml')))
    errs = 0
    for f in files:
        eid = os.path.basename(f)[:-5]
        if want and eid not in want:
            continue
        def E(m):
            nonlocal errs
            errs += 1
            print('ERROR', eid, m)
        try:
            d = yaml.safe_load(open(f, encoding='utf-8'))
        except Exception as e:
            E('yaml: %s' % e); continue
        if d.get('id') != eid:
            E('id differs from file name')
        if eid not in eqs:
            E('unknown equation id'); continue
        if d.get('section') not in secs:
            E('unknown section key %r' % d.get('section'))
        try:
            plain = strip_wrappers(d.get('tex', ''))
        except ValueError as e:
            E(str(e)); continue
        if norm(plain) != norm(eqs[eid]['tex']):
            E('tex differs from the book after removing wrappers')
        used = set(re.findall(r'\\htmlClass\{term (c[1-6])\}', d.get('tex', '')))
        pk = set(p['k'] for p in d.get('parts') or [] if isinstance(p, dict))
        nk = set((d.get('notes') or {}).keys())
        if not 2 <= len(used) <= 6:
            E('use 2 to 6 colors (found %d)' % len(used))
        if used != pk:
            E('colors in tex %s differ from colors in parts %s' % (sorted(used), sorted(pk)))
        if used != nk:
            E('colors in tex %s differ from notes %s' % (sorted(used), sorted(nk)))
        txt = json.dumps(d, ensure_ascii=False)
        if '\u2014' in txt:
            E('em dash')
    print('%d files checked, %d errors, %d of %d book equations covered' % (
        len([f for f in files if not want or os.path.basename(f)[:-5] in want]), errs, len(files), len(eqs)))
    sys.exit(1 if errs else 0)


if __name__ == '__main__':
    main()
