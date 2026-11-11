#!/usr/bin/env python3
"""Build the search index for the encyclopedia (offline).

Chunks the entity pages and the book sections, embeds them with a small sentence-transformers model
(normalized, int8 with one scale per vector) and writes docs/encyclopedia/data/index/{chunks.json, emb.bin, meta.json}.
Each chunk also carries `cx` (context line "Chapter N: title > section number title"), `al` (entity aliases)
and optionally `dq` (generated questions from build/doc2query.json, made by tools/doc2query.py).

emb.bin layout: count float32 scales (little endian), then count*dims int8 values (row major).
Vector i is approximately scale[i] * int8[i, :].

Usage: python3 tools/build_index.py [--model bge|minilm|e5] [--no-ctx] [--dq] [--dq-embed] [--out DIR] [--search JSON]
  --no-ctx   embed "title. text" only (the context line is still stored in chunks.json for BM25)
  --dq       store generated questions as field `dq` (BM25); --dq-embed also puts them in the embedded text
  --search   JSON object stored in meta.json as `search`: ranking parameters that override rank.js DEFAULTS
Needs: PyYAML, numpy, sentence-transformers (model cached in ~/.cache/huggingface).
"""
import json
import re
import sys
from pathlib import Path

import numpy as np
import yaml

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'docs' / 'encyclopedia' / 'data' / 'index'
# ranking parameters stored in meta.json (override rank.js DEFAULTS); tuned on half of build/search_eval.json
SEARCH = {'fusion': 'score', 'wSem': 0.3, 'entityBoost': 1.5, 'wAlias': 3, 'expand': 'abbr'}
MODELS = {  # python model, browser (transformers.js) model, query prefix, doc prefix, pooling in the browser
    'minilm': ('sentence-transformers/all-MiniLM-L6-v2', 'Xenova/all-MiniLM-L6-v2', '', '', 'mean'),
    'bge': ('BAAI/bge-small-en-v1.5', 'Xenova/bge-small-en-v1.5', 'Represent this sentence for searching relevant passages: ', '', 'cls'),
    'e5': ('intfloat/e5-small-v2', 'Xenova/e5-small-v2', 'query: ', 'passage: ', 'mean'),
}
ENTITY_MAX = 300      # words: split entity pages at "## " headings above this
SEC_WORDS, SEC_OVERLAP = 225, 40
MIN_WORDS = 12

FENCE = re.compile(r'```.*?```', re.S)
WIKI = re.compile(r'\[\[[a-z0-9-]+(?:\|([^\]]*))?\]\]')
KEY = r'(?:sec-[A-Za-z0-9_-]+|[0-9A-Z]+/[A-Za-z0-9_.-]+)'
BRACKET = re.compile(r'\s*\[' + KEY + r'(?:\s*[,;]\s*' + KEY + r')*\]')


def wc(s):
    return len(s.split())


def is_code(s):
    words = s.split()
    if not words:
        return True
    good = sum(1 for w in words if re.fullmatch(r'[A-Za-z]{2,}[.,;:)]?', w))
    return good / len(words) < 0.4


def clean_entity(md, ids):
    md = FENCE.sub('', md)
    md = WIKI.sub(lambda m: m.group(1) or '', md)
    # [[id]] without text: show the entity name
    md = BRACKET.sub('', md)
    return md.strip()


def ctx_line(ch, sec, chapters):
    parts = []
    if ch and ch in chapters:
        parts.append(f'Chapter {ch}: {chapters[ch]}')
    if sec:
        parts.append(f"{sec.get('number') or ''} {sec['title']}".strip())
    return ' > '.join(parts)


def entity_chunks(sections, chapters):
    names = {}
    pages = []
    for f in sorted((ROOT / 'entities').glob('*.md')):
        raw = f.read_text(encoding='utf-8')
        m = re.match(r'---\n(.*?)\n---\n(.*)', raw, re.S)
        if not m:
            continue
        fm = yaml.safe_load(m.group(1))
        names[fm['id']] = fm['name']
        pages.append((fm, m.group(2)))
    out = []
    for fm, body in pages:
        # replace bare [[id]] by names before cleaning
        body = re.sub(r'\[\[([a-z0-9-]+)\]\]', lambda m: names.get(m.group(1), m.group(1)), body)
        body = clean_entity(body, names)
        head = fm['name'] + '. '
        if fm.get('aliases'):
            head += 'Also called: ' + ', '.join(map(str, fm['aliases'])) + '. '
        head += (fm.get('summary') or '').strip()
        tail = ''
        if fm.get('functions'):
            tail = '\nR functions (bayestrials): ' + ', '.join(fm['functions'])
        # split at "## "
        parts = re.split(r'\n(?=## )', '\n' + body)
        parts = [p.strip() for p in parts if p.strip()]
        groups, cur = [], ''
        for p in parts:
            if cur and wc(cur) + wc(p) > ENTITY_MAX:
                groups.append(cur)
                cur = p
            else:
                cur = (cur + '\n\n' + p).strip()
        if cur:
            groups.append(cur)
        if not groups:
            groups = ['']
        for i, g in enumerate(groups):
            text = (head + '\n\n' if i == 0 else '') + g + (tail if i == len(groups) - 1 else '')
            text = text.strip()
            if wc(text) < MIN_WORDS or is_code(text):
                continue
            ch = str((fm.get('chapters') or [''])[0]) if fm.get('chapters') else ''
            sec = sections.get(fm.get('home') or '')
            out.append({'kind': 'entity', 'ref': fm['id'], 'title': fm['name'], 'number': '',
                        'url': '#/e/' + fm['id'], 'chapter': ch,
                        'al': '; '.join(str(a) for a in fm.get('aliases') or []),
                        'cx': ctx_line(ch, sec, chapters), 'text': text})
    return out


def section_chunks(sk, chapters):
    out, dropped = [], 0
    for s in sk['sections']:
        t = ' '.join((s.get('rendered') or s.get('text') or '').split())
        words = t.split()
        if not words:
            dropped += 1
            continue
        step = SEC_WORDS - SEC_OVERLAP
        starts = [0] if len(words) <= SEC_WORDS + 40 else list(range(0, max(len(words) - SEC_OVERLAP, 1), step))
        for a in starts:
            piece = words[a:a + SEC_WORDS] if len(words) > SEC_WORDS + 40 else words
            txt = ' '.join(piece)
            if len(piece) < MIN_WORDS or is_code(txt):
                dropped += 1
                continue
            out.append({'kind': 'section', 'ref': s['id'], 'title': s['title'], 'number': str(s.get('number') or ''),
                        'url': s['url'], 'chapter': str(s.get('chapter') or ''), 'al': '',
                        'cx': ctx_line(str(s.get('chapter') or ''), s, chapters), 'text': txt})
            if a + SEC_WORDS >= len(words):
                break
    return out, dropped


def embed_text(c, model, ctx, dq_embed):
    pre = MODELS[model][3]
    if ctx:
        head = c['cx']
        if c['kind'] == 'entity':
            head = c['title'] + (' (also called ' + c['al'].replace('; ', ', ') + ')' if c['al'] else '') + '. ' + head
        t = head + '\n' + c['text']
    else:
        t = c['title'] + '. ' + c['text']
    if dq_embed and c.get('dq'):
        t += '\n' + c['dq']
    return pre + t


def main():
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument('--model', default='bge', choices=list(MODELS))
    ap.add_argument('--no-ctx', action='store_true')
    ap.add_argument('--dq', action='store_true')
    ap.add_argument('--dq-embed', action='store_true')
    ap.add_argument('--out', default=str(OUT))
    ap.add_argument('--search', default=json.dumps(SEARCH))
    a = ap.parse_args()
    out_dir = Path(a.out)
    from sentence_transformers import SentenceTransformer
    sk = json.loads((ROOT / 'build' / 'skeleton.json').read_text(encoding='utf-8'))
    chapters = {str(c['num']): c['title'] for c in sk['chapters']}
    sections = {}
    for s in sk['sections']:
        sections[s['id']] = s
        if s.get('label') and s['label'] != 'None':
            sections[s['label']] = s
    ents = entity_chunks(sections, chapters)
    secs, dropped = section_chunks(sk, chapters)
    chunks = ents + secs
    dq = json.loads((ROOT / 'build' / 'doc2query.json').read_text(encoding='utf-8')) if a.dq else {}
    seen = {}
    for i, c in enumerate(chunks):
        c['id'] = i
        k = (c['kind'], c['ref'])
        seen[k] = seen.get(k, -1) + 1
        qs = dq.get(f"{c['kind']}:{c['ref']}:{seen[k]}")
        c['dq'] = ' '.join(qs) if qs else ''
    print(f'entity chunks {len(ents)}, section chunks {len(secs)}, dropped {dropped}, with dq {sum(1 for c in chunks if c["dq"])}', file=sys.stderr)
    pymodel, browser, qprefix, _, pooling = MODELS[a.model]
    model = SentenceTransformer(pymodel)
    texts = [embed_text(c, a.model, not a.no_ctx, a.dq_embed) for c in chunks]
    emb = model.encode(texts, batch_size=64, normalize_embeddings=True, show_progress_bar=False).astype(np.float32)
    scale = np.abs(emb).max(axis=1) / 127.0
    q = np.clip(np.round(emb / scale[:, None]), -127, 127).astype(np.int8)
    err = np.abs(q.astype(np.float32) * scale[:, None] - emb).max()
    out_dir.mkdir(parents=True, exist_ok=True)
    order = ['id', 'kind', 'ref', 'title', 'number', 'url', 'chapter', 'al', 'cx', 'dq', 'text']
    rows = [{k: c[k] for k in order if k not in ('al', 'dq') or c[k]} for c in chunks]
    (out_dir / 'chunks.json').write_text(json.dumps(rows, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    with open(out_dir / 'emb.bin', 'wb') as f:
        f.write(scale.astype('<f4').tobytes())
        f.write(q.tobytes())
    meta = {'model': pymodel, 'browser_model': browser, 'dtype': 'q8', 'query_prefix': qprefix, 'pooling': pooling,
            'dims': int(emb.shape[1]), 'count': len(chunks),
            'normalized': True, 'quantization': 'int8, one float32 scale per vector; emb.bin = count float32 scales then count*dims int8',
            'max_abs_error': float(err), 'entity_chunks': len(ents), 'section_chunks': len(secs),
            'context': not a.no_ctx, 'doc2query': bool(a.dq), 'doc2query_in_embedding': bool(a.dq_embed)}
    if a.search:
        meta['search'] = json.loads(a.search)
    (out_dir / 'meta.json').write_text(json.dumps(meta, indent=1), encoding='utf-8')
    for n in ('chunks.json', 'emb.bin', 'meta.json'):
        print(n, (out_dir / n).stat().st_size, 'bytes')


if __name__ == '__main__':
    main()
