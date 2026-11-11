#!/usr/bin/env python3
"""Generate 3 short search questions per chunk with the Anthropic Messages API (doc2query).

Writes build/doc2query.json: {"kind:ref:n": [q1, q2, q3]}, where n numbers the chunks of one page or section.
Existing keys are kept, so a rerun only fills gaps and rebuilding the index never calls the API again.
The key is read from ~/.config/bct/anthropic_key and is never printed or stored.
Usage: python3 tools/doc2query.py [--limit N] [--workers 8]
"""
import argparse
import json
import re
import sys
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import build_index as bi  # noqa: E402

MODEL = 'claude-haiku-5-5'
OUTFILE = bi.ROOT / 'build' / 'doc2query.json'
PROMPT = ('Below is a passage from a book on Bayesian clinical trials. Write 3 short questions that a reader might type into a '
          'search box and that this passage answers. Vary the wording: use plain words a newcomer would use, '
          'synonyms, and the usual abbreviations where they apply. One question per line, no numbering, no other text.\n\n'
          'Title: {title}\nContext: {cx}\n\n{text}')


def keyed_chunks():
    import yaml  # noqa: F401
    sk = json.loads((bi.ROOT / 'build' / 'skeleton.json').read_text(encoding='utf-8'))
    chapters = {str(c['num']): c['title'] for c in sk['chapters']}
    sections = {}
    for s in sk['sections']:
        sections[s['id']] = s
        if s.get('label') and s['label'] != 'None':
            sections[s['label']] = s
    chunks = bi.entity_chunks(sections, chapters) + bi.section_chunks(sk, chapters)[0]
    seen, out = {}, []
    for c in chunks:
        k = (c['kind'], c['ref'])
        seen[k] = seen.get(k, -1) + 1
        out.append((f"{c['kind']}:{c['ref']}:{seen[k]}", c))
    return out


def call(key, c):
    body = json.dumps({'model': MODEL, 'max_tokens': 1500,
                       'messages': [{'role': 'user', 'content': PROMPT.format(title=c['title'], cx=c['cx'], text=' '.join(c['text'].split()[:320]))}]}).encode()
    for attempt in range(5):
        req = urllib.request.Request('https://api.anthropic.com/v1/messages', data=body, headers={
            'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json'})
        try:
            r = json.load(urllib.request.urlopen(req, timeout=60))
            text = ''.join(b.get('text', '') for b in r['content'] if b['type'] == 'text')
            qs = [re.sub(r'^[\-\d.)\s]+', '', l).strip() for l in text.splitlines() if l.strip()]
            return qs[:3], r['usage']
        except Exception as e:  # retry on rate limit and transient errors
            msg = getattr(e, 'code', str(type(e).__name__))
            if attempt == 4:
                print('failed:', msg, file=sys.stderr)
                return None, {}
            time.sleep(2 ** attempt)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--limit', type=int, default=0)
    ap.add_argument('--workers', type=int, default=8)
    a = ap.parse_args()
    key = (Path.home() / '.config' / 'bct' / 'anthropic_key').read_text().strip()
    done = json.loads(OUTFILE.read_text(encoding='utf-8')) if OUTFILE.exists() else {}
    todo = [(k, c) for k, c in keyed_chunks() if k not in done]
    if a.limit:
        todo = todo[:a.limit]
    tin = tout = 0
    with ThreadPoolExecutor(a.workers) as ex:
        for n, ((k, c), (qs, u)) in enumerate(zip(todo, ex.map(lambda kc: call(key, kc[1]), todo))):
            if qs:
                done[k] = qs
            tin += u.get('input_tokens', 0)
            tout += u.get('output_tokens', 0)
            if n % 50 == 49:
                OUTFILE.write_text(json.dumps(done, ensure_ascii=False, indent=0), encoding='utf-8')
    OUTFILE.write_text(json.dumps(done, ensure_ascii=False, indent=0), encoding='utf-8')
    print(f'{len(done)} chunks done; this run: {len(todo)} calls, {tin} input tokens, {tout} output tokens; '
          f'cost at $0.10/$0.50 per M tokens: ${tin * 0.10e-6 + tout * 0.50e-6:.3f}')


if __name__ == '__main__':
    main()
