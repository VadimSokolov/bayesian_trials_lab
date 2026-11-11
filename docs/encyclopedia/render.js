// Markdown, math, [[entity]] links and section chips.
// Depends on globals: marked, DOMPurify, katex (loaded from CDN in index.html).

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const KEY = '(?:sec-[A-Za-z0-9_-]+|[0-9A-Z]+/[A-Za-z0-9_.-]+)';
export const BRACKET_RE = new RegExp('\\[(' + KEY + '(?:\\s*[,;]\\s*' + KEY + ')*)\\]', 'g');

let hooked = false;
function hookPurify() {
  if (hooked || !window.DOMPurify) return;
  hooked = true;
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A') {
      const href = node.getAttribute('href') || '';
      if (/^https?:/i.test(href)) {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer');
      }
    }
  });
}

export function mathHtml(tex, display) {
  try {
    return katex.renderToString(tex, { displayMode: !!display, throwOnError: false, strict: false, trust: (ctx) => ctx.command === '\\htmlClass' });
  } catch (e) {
    return '<code>' + esc(tex) + '</code>';
  }
}

// ---------- formulas in words ----------
// Short inline math ($...$) inside a sentence piece or note; everything else is escaped text.
export function inlineText(s) {
  return String(s ?? '').split(/\$([^$]+)\$/).map((p, i) => (i % 2 ? mathHtml(p, false) : esc(p))).join('');
}

export const texKey = (tex) => String(tex || '').replace(/\s+/g, '').replace(/[.,;]+$/, '');

// The formula file for a display formula copied from the book, or null.
export function formulaFor(kg, tex) {
  if (!kg.formulas || !kg.formulas.length) return null;
  if (!kg._fxmap) { kg._fxmap = {}; kg.formulas.forEach((f) => { kg._fxmap[f.key] = f; }); }
  return kg._fxmap[texKey(tex)] || null;
}

// Colored formula, the sentence in words, and a one-line note area. Pieces are linked by their color class.
export function formulaHtml(f, chips) {
  const used = [...new Set(f.parts.filter((p) => typeof p !== 'string').map((p) => p.k))];
  const sentence = f.parts.map((p) => (typeof p === 'string' ? esc(p)
    : '<span class="w ' + p.k + '" data-k="' + p.k + '">' + inlineText(p.words) + '</span>')).join('');
  const notes = used.filter((k) => f.notes[k]).map((k) => '<span data-k="' + k + '">' + inlineText(f.notes[k]) + '</span>').join('');
  return '<figure class="fx" data-fid="' + esc(f.id) + '">'
    + '<div class="fx-eq eqline">' + mathHtml(f.tex, true) + (chips ? '<span class="eqchip">' + chips + '</span>' : '') + '</div>'
    + '<p class="fx-sentence">' + sentence + '</p>'
    + '<p class="fx-note" aria-live="polite"></p><div class="fx-notes" hidden>' + notes + '</div></figure>';
}

export function chipLabel(sec, key) {
  if (!sec) return key;
  return sec.n ? '§' + sec.n : sec.t.length > 18 ? sec.t.slice(0, 16) + '...' : sec.t;
}

export function chipHtml(kg, key) {
  const sec = kg.sections[key];
  if (!sec) return '<span class="chip">' + esc(key) + '</span>';
  const title = (sec.n ? sec.n + ' ' : '') + sec.t;
  return '<a class="chip sec" href="' + esc(sec.u) + '" target="_blank" rel="noopener noreferrer" title="' + esc(title) + '">' + esc(chipLabel(sec, key)) + '</a>';
}

function entLink(kg, id, text) {
  const e = kg.entities[id];
  if (!e) return '<span class="elink missing" title="Unknown entity">' + esc(text || id) + '</span>';
  return '<a class="elink' + (e.stub ? ' stub' : '') + '" href="#/e/' + esc(id) + '"' + (e.stub ? ' title="Page not written yet"' : '') + '>' + esc(text || e.name) + '</a>';
}

// Render Markdown with math, entity links and section chips into a safe HTML string.
export function renderMarkdown(md, kg) {
  hookPurify();
  const maths = [];
  const hold = (tex, display) => { maths.push([tex, display]); return '@@M' + (maths.length - 1) + '@@'; };
  let s = String(md || '');
  s = s.replace(/\$\$([\s\S]+?)\$\$/g, (m, t) => '\n\n' + hold(t, true) + '\n\n');
  s = s.replace(/\\\[([\s\S]+?)\\\]/g, (m, t) => '\n\n' + hold(t, true) + '\n\n');
  s = s.replace(/\\\(([\s\S]+?)\\\)/g, (m, t) => hold(t, false));
  s = s.replace(/(?<![\\$\w])\$(?![\s$])([^$\n]+?)(?<![\s\\])\$(?![\w$])/g, (m, t) => hold(t, false));
  // Equation ids such as "(eq-betabinom)" are only for the data; the formulas are shown, so drop the ids.
  s = s.replace(/[ \t]*\(\s*eq-[\w-]+(?:\s*[,;]\s*eq-[\w-]+)*\s*\)/g, '');
  s = s.replace(/[ \t]+eq-[a-z][\w-]*(?![\w\/-])/g, '');
  s = s.replace(/\[\[([a-z0-9-]+)(?:\|([^\]]*))?\]\]/g, (m, id, txt) => entLink(kg, id, txt));
  s = s.replace(BRACKET_RE, (m, keys) => keys.split(/\s*[,;]\s*/).map((k) => chipHtml(kg, k)).join(''));
  let html = marked.parse(s, { gfm: true });
  html = DOMPurify.sanitize(html, { ADD_ATTR: ['target', 'rel'] });
  // A chip-only paragraph right after a display formula moves onto the formula line, right-aligned.
  html = html.replace(/<p>@@M(\d+)@@<\/p>\s*<p>((?:<a class="chip sec"[^>]*>[^<]*<\/a>\s*)+)<\/p>/g, (m, i, chips) => {
    if (!maths[+i][1]) return m;
    const f = formulaFor(kg, maths[+i][0]);
    return f ? formulaHtml(f, chips.trim())
      : '<div class="eqline">' + mathHtml(maths[+i][0], true) + '<span class="eqchip">' + chips.trim() + '</span></div>';
  });
  html = html.replace(/<p>@@M(\d+)@@<\/p>/g, (m, i) => {
    if (!maths[+i][1]) return m;
    const f = formulaFor(kg, maths[+i][0]);
    return f ? formulaHtml(f, '') : mathHtml(maths[+i][0], true);
  });
  html = html.replace(/@@M(\d+)@@/g, (m, i) => mathHtml(maths[+i][0], maths[+i][1]));
  return html;
}
