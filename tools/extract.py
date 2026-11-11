#!/usr/bin/env python3
"""Extract a deterministic skeleton of the book into build/skeleton.json.

Reads the Quarto sources of the book (default ~/pap/trials-book) and records chapters,
sections (with their HTML anchors on the web edition), equations, tables, figures,
cross-references, citations, bayestrials calls, catalogued results, chapter summaries
and key terms, the package's exported functions, and the companion lab modules.

Usage: python3 tools/extract.py [BOOK_DIR]
"""
import json, os, re, subprocess, sys

BOOK = os.path.expanduser(sys.argv[1] if len(sys.argv) > 1 else '~/pap/trials-book')
HTML = 'https://vsokolov.org/bayesian_clinical_trials_v1/'
OUT = os.path.join(os.path.dirname(__file__), '..', 'build', 'skeleton.json')

try:
    import yaml
except ImportError:
    sys.exit('needs pyyaml')


def slug(t):
    """Quarto/pandoc auto identifier for an unlabeled heading."""
    t = re.sub(r'<[^>]+>', '', t)
    t = re.sub(r'[`*_$\\]', '', t).lower()
    t = re.sub(r"[^\w\s.-]", '', t)
    t = re.sub(r'\s+', '-', t.strip())
    t = re.sub(r'^[^a-z]+', '', t)
    return t or 'section'


def chapter_files():
    q = yaml.safe_load(open(os.path.join(BOOK, '_quarto.yml')))['book']
    main, parts = [], {}
    for c in q['chapters']:
        if isinstance(c, dict):
            for f in c['chapters']:
                main.append(f); parts[f] = c['part']
        elif c not in ('index.qmd', 'references.qmd'):
            main.append(c)
    return main, q.get('appendices', []), parts


def summaries():
    out = {}
    d = os.path.join(BOOK, 'summaries')
    for f in sorted(os.listdir(d)):
        t = open(os.path.join(d, f)).read()
        key = f.split('_')[0]
        body = re.sub(r'<!-- cite:begin -->.*?<!-- cite:end -->', '', t, flags=re.S)
        paras = [p.strip() for p in re.split(r'\n\s*\n', body) if p.strip() and not p.startswith('#')]
        kt = re.search(r'## Key terms\s+(.+?)(\n## |\Z)', t, re.S)
        lit = re.search(r'## From the literature\s+(.+?)(\n## |\Z)', t, re.S)
        out[key] = {
            'summary': paras[0] if paras else '',
            'literature': lit.group(1).strip() if lit else '',
            'key_terms': [k.strip().rstrip('.') for k in kt.group(1).replace('\n', ' ').split(',')] if kt else [],
        }
    return out


REF = re.compile(r'@((?:sec|eq|tbl|fig)-[A-Za-z0-9_-]+)')
CITE = re.compile(r'(?<![\w.])@([A-Za-z][A-Za-z0-9_:.-]*[A-Za-z0-9_])')
CALL = re.compile(r'\b([a-z][a-z0-9_]*)\s*\(')


def parse_chapter(f, num, part, exports):
    src = open(os.path.join(BOOK, f)).read().split('\n')
    page = HTML + f.replace('.qmd', '.html')
    secs, eqs, tbls, figs = [], [], [], []
    cur = None
    counters = [0, 0, 0]
    in_code = False
    code_lang = ''
    eq_buf = None
    chap_title = chap_label = None
    seen = set()

    def new_sec(level, title, label, unnumbered):
        nonlocal cur
        if not unnumbered and level >= 2:
            i = level - 2
            counters[i] += 1
            for j in range(i + 1, 3):
                counters[j] = 0
            number = '.'.join([str(num)] + [str(c) for c in counters[:i + 1]])
        else:
            number = ''
        anchor = label or slug(title)
        if not label:
            base, k = anchor, 0
            while anchor in seen:
                k += 1; anchor = '%s-%d' % (base, k)
        seen.add(anchor)
        key = label or '%s/%s' % (num, anchor.replace('.', ''))  # keys stay dot-free; anchors keep pandoc's dots
        cur = {'id': key, 'anchor': anchor, 'chapter': str(num), 'level': level, 'number': number, 'title': title,
               'label': label, 'url': page + '#' + anchor, 'text': [], 'refs': set(), 'cites': set(),
               'calls': set(), 'eqs': [], 'tbls': [], 'figs': []}
        secs.append(cur)

    for line in src:
        s = line.rstrip()
        if s.startswith('```'):
            if not in_code:
                in_code = True; code_lang = s[3:].strip('{} ')
            else:
                in_code = False
            continue
        if in_code:
            if s.startswith('#| label:'):
                lab = s.split(':', 1)[1].strip()
                if lab.startswith('tbl-'):
                    tbls.append({'id': lab, 'caption': '', 'section': cur['id'] if cur else None}); cur and cur['tbls'].append(lab)
                elif lab.startswith('fig-'):
                    figs.append({'id': lab, 'caption': '', 'section': cur['id'] if cur else None}); cur and cur['figs'].append(lab)
            elif s.startswith('#| tbl-cap:') and tbls:
                tbls[-1]['caption'] = s.split(':', 1)[1].strip().strip('"')
            elif s.startswith('#| fig-cap:') and figs:
                figs[-1]['caption'] = s.split(':', 1)[1].strip().strip('"')
            elif cur and code_lang.startswith('r'):
                for m in CALL.finditer(s.split('#')[0]):
                    if m.group(1) in exports:
                        cur['calls'].add(m.group(1))
            continue
        h = re.match(r'^(#{1,4})\s+(.*?)\s*(\{([^}]*)\})?\s*$', s)
        if h:
            level = len(h.group(1)); title = h.group(2); attrs = h.group(4) or ''
            lab = re.search(r'#((?:sec)-[A-Za-z0-9_-]+)', attrs)
            label = lab.group(1) if lab else None
            unnum = '.unnumbered' in attrs or attrs.strip() == '-'
            if level == 1:
                chap_title, chap_label = title, label
                new_sec(1, title, label, True)
                cur['number'] = str(num); cur['url'] = page
            else:
                new_sec(level, title, label, unnum)
            continue
        if cur is None:
            continue
        # equations
        if s.startswith('$$') and eq_buf is None and not re.match(r'^\$\$.*\$\$', s[2:] and s or ''):
            eq_buf = [s[2:]]
            m = re.search(r'\$\$\s*\{#(eq-[^}]+)\}', s)
            if s.count('$$') >= 2:
                tex = s.split('$$')[1]
                eq_buf = None
                if m:
                    eqs.append({'id': m.group(1), 'tex': tex.strip(), 'section': cur['id']}); cur['eqs'].append(m.group(1))
            cur['text'].append(s)
            continue
        if eq_buf is not None:
            m = re.match(r'^(.*)\$\$\s*(\{#(eq-[^}]+)\})?', s)
            if m:
                eq_buf.append(m.group(1))
                if m.group(3):
                    eqs.append({'id': m.group(3), 'tex': '\n'.join(eq_buf).strip(), 'section': cur['id']}); cur['eqs'].append(m.group(3))
                eq_buf = None
            else:
                eq_buf.append(s)
            cur['text'].append(s)
            continue
        cur['text'].append(s)
        for m in REF.finditer(s):
            cur['refs'].add(m.group(1))
        for m in CITE.finditer(s):
            k = m.group(1)
            if not re.match(r'(sec|eq|tbl|fig|res)-', k) and '@' + k not in ('@media',):
                cur['cites'].add(k)
    for c in secs:
        c['text'] = '\n'.join(c['text']).strip()
        c['words'] = len(c['text'].split())
        for k in ('refs', 'cites', 'calls'):
            c[k] = sorted(c[k])
    chap = {'num': str(num), 'file': f, 'title': chap_title, 'label': chap_label, 'url': page, 'part': part,
            'sections': [c['id'] for c in secs]}
    return chap, secs, eqs, tbls, figs


def exports_and_titles():
    ns = open(os.path.join(BOOK, 'bayestrials', 'NAMESPACE')).read()
    ex = re.findall(r'^export\(([^)]+)\)', ns, re.M)
    out = {}
    mand = os.path.join(BOOK, 'bayestrials', 'man')
    for e in ex:
        p = os.path.join(mand, e + '.Rd')
        title = desc = usage = ''
        if os.path.exists(p):
            t = open(p).read()
            m = re.search(r'\\title\{(.+?)\}\n', t, re.S); title = m.group(1).strip() if m else ''
            m = re.search(r'\\description\{\n?(.+?)\n\}', t, re.S); desc = ' '.join(m.group(1).split()) if m else ''
            m = re.search(r'\\usage\{\n?(.+?)\n\}', t, re.S); usage = m.group(1).strip() if m else ''
        out[e] = {'name': e, 'title': title, 'description': desc, 'usage': usage}
    return out


LAB = 'https://vsokolov.org/bayesian_trials_lab/'
LAB_MODULES = [
    ('00-are-they-different', 'Are they different?', ['4', '5', '7']),
    ('01-prior-posterior', 'Prior and posterior', ['6']),
    ('02-p-values', 'p-values', ['4', '7']),
    ('03-errors-power', 'Errors and power', ['4', '9']),
    ('04-multiplicity', 'Multiplicity', ['10']),
    ('05-ulcer-trial', 'The ulcer trial', ['10']),
    ('06-fair-comparisons', 'Fair comparisons', ['5']),
    ('07-interim-looks', 'Interim looks', ['11', '15']),
    ('08-e-values', 'E-values', ['12']),
    ('09-adaptive-bayesian', 'Adaptive Bayesian trials', ['14', '15', '16', '19']),
    ('10-platform-trials', 'Platform trials', ['20']),
    ('11-substantial-evidence', 'Substantial evidence', ['3', '23']),
    ('12-decisions', 'Decisions', ['1', '21']),
    ('13-regulators-map', 'The regulator\u2019s map', ['3', '23']),
    ('14-simulator', 'Trial simulator', ['14', '15']),
    ('14-studio', 'Trial studio', ['14', '16', '17', '19', '23']),
    ('15-reading-bayesian-trials', 'Reading a Bayesian trial', ['6', '21', '22']),
    ('16-bayesian-protocol', 'Your Bayesian protocol', ['8', '19', '23']),
]


def main():
    exports = exports_and_titles()
    main_files, apps, parts = chapter_files()
    summ = summaries()
    chapters, sections, eqs, tbls, figs = [], [], [], [], []
    seq = [(f, i + 1) for i, f in enumerate(main_files)] + [(f, chr(65 + i)) for i, f in enumerate(apps)]
    for f, num in seq:
        c, s, e, t, g = parse_chapter(f, num, parts.get(f, 'Appendices' if isinstance(num, str) else ''), exports)
        key = '%02d' % num if isinstance(num, int) else num
        c.update(summ.get(key, {}))
        chapters.append(c); sections += s; eqs += e; tbls += t; figs += g
    res = yaml.safe_load(open(os.path.join(BOOK, 'results.yaml')))
    meta = yaml.safe_load(open(os.path.join(BOOK, 'book.yaml')))
    commit = subprocess.run(['git', '-C', BOOK, 'rev-parse', '--short', 'HEAD'], capture_output=True, text=True).stdout.strip()
    bj = json.load(open(os.path.join(BOOK, 'site', 'book.json')))
    sk = {
        'book': {'title': bj['full_title'], 'authors': bj['credit_names'], 'version': bj['version'], 'doi': bj['doi'],
                 'concept_doi': bj.get('concept_doi'), 'html': HTML, 'commit': commit},
        'chapters': chapters, 'sections': sections, 'equations': eqs, 'tables': tbls, 'figures': figs,
        'results': res, 'functions': list(exports.values()),
        'lab': [{'id': m, 'title': t, 'url': LAB + m + '.html', 'chapters': ch} for m, t, ch in LAB_MODULES],
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump(sk, open(OUT, 'w'), indent=1, ensure_ascii=False)
    print('chapters', len(chapters), 'sections', len(sections), 'equations', len(eqs), 'tables', len(tbls),
          'figures', len(figs), 'results', len(res), 'functions', len(exports), 'commit', commit)
    print('labeled sections', sum(1 for s in sections if s['label']), 'with calls', sum(1 for s in sections if s['calls']))


if __name__ == '__main__':
    main()
