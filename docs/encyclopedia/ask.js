// Smart search: one Claude call that reads the top retrieved passages and points the reader to where the book answers.
// Retrieval runs in the browser (search.js). Single turn, no threads, structured JSON output.
// Readers without a key go through the site owner's proxy (Haiku); with their own key the call goes straight to Anthropic.
import { esc } from './render.js';
import * as S from './search.js';
import { MODELS, FREE_LINE, keys, lsGet, lsSet, client, viaProxy, modelFor, usageOf, fmtUsage, errorText } from './llm.js';

const $ = (s, r = document) => r.querySelector(s);
const TOP_K = 20;
const SNIPPET_WORDS = 60;
const LIST_CHARS = 7200; // about 1,800 tokens
let kg = null;
let sys = '';
const cache = new Map(); // "model|question" -> result, so going back never pays twice

export function init(data) {
  kg = data;
  sys = systemPrompt();
}

const QUESTION_RE = /^(how|what|when|why|which|is|are|can|should|does|do)\b/i;
export const looksLikeQuestion = (q) => /\?\s*$/.test(q) || QUESTION_RE.test(q.trim());

// Stable system prompt (cached): role, rules, output contract and a compact map of the book. Nothing here varies per question.
function systemPrompt() {
  const b = kg.book;
  const map = kg.chapters.map((c) => `Ch ${c.num} ${c.title} (${c.part}): ${(c.key_terms || []).slice(0, 8).join('; ')}`).join('\n');
  return `You are a librarian for the book "${b.title}" (${b.authors}, 2026) and for the encyclopedia pages built on it. A reader asks a question. You receive a numbered list of candidate passages that a search engine retrieved: each has a title, a section number when it comes from the book, a kind (encyclopedia page or book section) and a short snippet. Your job is to find the passages that answer the question and to point the reader to them. You never answer the question from outside knowledge.

Rules:
- Choose only from the numbered list of the latest user message. Refer to a passage only by its number n.
- Rank the passages that best answer the question first. Prefer a passage that states the answer or the method over one that only mentions the topic. Prefer an encyclopedia page for a definition or an overview and a book section for detail, a derivation, a worked example or a trial result.
- Return between 1 and 6 passages. Fewer is better when only a few really answer the question. Skip passages that merely share a word with the question.
- For each passage, "why" is one plain phrase of at most 15 words saying what the reader will find there that bears on the question. Do not repeat the title or the section number, and do not start with "Section".
- "pointer" is at most two short plain sentences (about 40 words in all) telling the reader where in the book the question is answered, for example which section or page to start with and what to read next. Name sections as in the list (for example §15.2.2). Add no new facts. Quote a number or a trial result only if it appears in a snippet. Do not explain the answer, do not give advice, do not use outside knowledge for facts, numbers, trial results, dates or citations.
- If the passages do not answer the question, say so in one sentence in "pointer" and give the closest passages, or an empty "results" list when nothing is close. You may then name the chapters from the map below that look most relevant.
- Stay within clinical trials, Bayesian statistics and regulation. For other requests, say in "pointer" that this book does not cover it and return an empty "results" list.
- Write plain text only: no Markdown, no LaTeX, no emojis.

Output: one JSON object that follows the schema given by the interface: {"pointer": string, "results": [{"n": integer, "why": string}]}, best passage first.

Map of the book (chapter, title, part, key terms), to help you judge where the answer should be and to name chapters when the list falls short:
${map}

Chapters are published in the HTML edition ${b.html}.`;
}

const SCHEMA = {
  type: 'object',
  properties: {
    pointer: { type: 'string' },
    results: { type: 'array', items: { type: 'object', properties: { n: { type: 'integer' }, why: { type: 'string' } }, required: ['n', 'why'], additionalProperties: false } },
  },
  required: ['pointer', 'results'],
  additionalProperties: false,
};

export const labelOf = (c) => (c.kind === 'entity' ? c.title : (c.number ? '§' + c.number + ' ' : '') + c.title).replace(/\$/g, '');
export const hrefOf = (c) => (c.kind === 'entity' ? '#/e/' + c.ref : c.url);

// Compact numbered list: title, section number, kind, a ~60 word snippet. Capped at about 1,800 tokens.
function buildList(chunks, q) {
  let left = LIST_CHARS;
  const lines = [];
  chunks.forEach((c, i) => {
    const kind = c.kind === 'entity' ? 'encyclopedia page' : 'book section';
    const head = `[${i + 1}] ${c.title}${c.number ? ' | §' + c.number : ''} | ${kind} | `;
    const room = left - head.length;
    if (room < 80) return;
    let text = S.snippet(c.text, q, SNIPPET_WORDS);
    if (text.length > room) text = text.slice(0, room).replace(/\s\S*$/, '') + ' ...';
    left -= head.length + text.length + 1;
    lines.push(head + text);
  });
  return lines.join('\n');
}

export async function retrieve(q) {
  S.loadSemantic();
  await Promise.race([S.loadSemantic(), new Promise((r) => setTimeout(r, 15000))]);
  return (await S.search(q, { k: TOP_K, maxPerRef: 1 })).map((r) => r.chunk);
}

// Returns {pointer, items: [{chunk, why}], usage, model} or throws an Error whose message is ready to show.
export async function smart(q) {
  const model = modelFor(lsGet('kg.ask.model'));
  const proxy = viaProxy();
  const ck = model + '|' + q.trim().toLowerCase();
  if (cache.has(ck)) return cache.get(ck);
  const chunks = await retrieve(q);
  if (!chunks.length) return { pointer: '', items: [], usage: null, model };
  try {
    const cl = await client(keys.value);
    const final = await cl.messages.create({
      model,
      max_tokens: 700,
      system: [{ type: 'text', text: sys, cache_control: { type: 'ephemeral' } }],
      output_config: { effort: MODELS[model].effort, format: { type: 'json_schema', schema: SCHEMA } },
      messages: [{ role: 'user', content: `Candidate passages:\n\n${buildList(chunks, q)}\n\nQuestion: ${q}` }],
    });
    const text = (final.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('');
    let data;
    try { data = JSON.parse(text); } catch (e) { throw new Error('The smart search reply could not be read.'); }
    const seen = new Set();
    const items = [];
    for (const r of (data.results || [])) {
      const n = Number(r.n);
      if (!Number.isInteger(n) || n < 1 || n > chunks.length || seen.has(n)) continue;
      seen.add(n);
      items.push({ chunk: chunks[n - 1], why: String(r.why || '').trim() });
      if (items.length >= 6) break;
    }
    const out = { pointer: String(data.pointer || '').trim(), items, usage: usageOf(final, model), model };
    cache.set(ck, out);
    return out;
  } catch (err) {
    if (err instanceof Error && !err.status && /could not be read/.test(err.message)) throw err;
    throw new Error(errorText(err, proxy));
  }
}

export function smartHtml(r) {
  const items = r.items.map(({ chunk: c, why }) => {
    const ent = c.kind === 'entity';
    return `<li><a class="title" href="${esc(hrefOf(c))}"${ent ? '' : ' target="_blank" rel="noopener noreferrer"'}>${esc(labelOf(c))}</a>${why ? `<span class="why">${esc(why)}</span>` : ''}</li>`;
  }).join('');
  const usage = r.usage ? `<p class="sm-usage">${esc(MODELS[r.model].label)}: ${esc(fmtUsage(r.usage))}</p>` : '';
  return `${r.pointer ? `<p class="sm-pointer">${esc(r.pointer)}</p>` : ''}${items ? `<ol class="sm-list">${items}</ol>` : ''}${usage}`;
}

// ---------- settings (one quiet line, key, model when a key is set) ----------
export function settingsHtml() {
  const cur = modelFor(lsGet('kg.ask.model'));
  return `<details class="a-settings" id="a-settings"><summary>Settings</summary>
    <p class="note" id="a-free">${esc(FREE_LINE)}</p>
    <label for="a-key">Anthropic API key (optional)</label>
    <input id="a-key" type="password" autocomplete="off" spellcheck="false" placeholder="sk-ant-...">
    <label class="inline"><input type="checkbox" id="a-remember"> Remember my key in this browser</label>
    <div id="a-modelrow"><label for="a-model">Model</label>
      <select id="a-model">${Object.entries(MODELS).map(([id, m]) => `<option value="${id}"${id === cur ? ' selected' : ''}>${m.label}</option>`).join('')}</select></div>
    <p class="note">A key stays in your browser and goes straight to Anthropic, never through this site. Use a key with a spend limit.</p>
  </details>`;
}

export function bindSettings(root) {
  const sync = () => { $('#a-modelrow', root).hidden = !keys.value; $('#a-free', root).hidden = !!keys.value; };
  $('#a-key', root).value = keys.value;
  $('#a-remember', root).checked = keys.remember;
  const saved = lsGet('kg.ask.model');
  if (keys.value && saved && MODELS[saved]) $('#a-model', root).value = saved;
  sync();
  $('#a-model', root).addEventListener('change', (e) => lsSet('kg.ask.model', e.target.value));
  $('#a-key', root).addEventListener('input', (e) => { keys.set(e.target.value); const tk = $('#t-key'); if (tk) { tk.value = keys.value; tk.dispatchEvent(new Event('input')); } sync(); });
  $('#a-remember', root).addEventListener('change', (e) => { keys.setRemember(e.target.checked); const tr = $('#t-remember'); if (tr) tr.checked = keys.remember; });
}
