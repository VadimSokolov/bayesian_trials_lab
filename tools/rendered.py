#!/usr/bin/env python3
"""Add the rendered text of each section (from the published HTML edition) to build/skeleton.json.

The Quarto source computes many numbers with inline R code; they appear only in the rendered
pages. This script downloads each chapter page once into build/html/ and stores, per section,
the visible text without its subsections as "rendered", plus rendered table text in "tables_text".

Usage: python3 tools/rendered.py [--refresh]
"""
import json, os, sys, urllib.request

from bs4 import BeautifulSoup

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
SK = os.path.join(ROOT, 'build', 'skeleton.json')
HD = os.path.join(ROOT, 'build', 'html')


def fetch(url, path):
    if os.path.exists(path) and '--refresh' not in sys.argv:
        return open(path, encoding='utf-8').read()
    req = urllib.request.Request(url, headers={'User-Agent': 'book-kg-builder'})
    html = urllib.request.urlopen(req, timeout=60).read().decode('utf-8')
    open(path, 'w', encoding='utf-8').write(html)
    return html


def own_text(sec):
    parts = []
    for child in sec.children:
        if getattr(child, 'name', None) == 'section':
            continue
        if getattr(child, 'name', None) in ('script', 'style'):
            continue
        t = child.get_text(' ', strip=True) if hasattr(child, 'get_text') else str(child).strip()
        if t:
            parts.append(t)
    return ' '.join(parts)


def main():
    os.makedirs(HD, exist_ok=True)
    sk = json.load(open(SK))
    by_page = {}
    for s in sk['sections']:
        page = s['url'].split('#')[0]
        by_page.setdefault(page, []).append(s)
    n = hit = 0
    for page, secs in by_page.items():
        html = fetch(page, os.path.join(HD, page.rsplit('/', 1)[1]))
        soup = BeautifulSoup(html, 'html.parser')
        main_el = soup.find('main') or soup
        for s in secs:
            n += 1
            if s['level'] == 1:
                el = main_el
                header = main_el.find('header')
                txt = ' '.join(c.get_text(' ', strip=True) for c in main_el.children
                               if getattr(c, 'name', None) not in ('section', 'header', None, 'script', 'style'))
            else:
                el = main_el.find('section', id=s['anchor'])
                txt = own_text(el) if el else ''
            if el is not None:
                hit += 1
            elif s['level'] > 1:
                s['url'] = page  # no anchor on the live page: link the chapter
                s['anchor_missing'] = True
            s['rendered'] = txt
    tmp = SK + '.tmp'
    json.dump(sk, open(tmp, 'w'), indent=1, ensure_ascii=False)
    os.replace(tmp, SK)
    print('sections', n, 'matched', hit, 'pages', len(by_page))


if __name__ == '__main__':
    main()
