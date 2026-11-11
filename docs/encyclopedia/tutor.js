// Tutor drawer: Socratic tutor mode and "Ask about this page" mode.
// Calls go from the browser straight to the Claude API with the reader's own key.
import { esc, renderMarkdown, BRACKET_RE } from './render.js';

import { MODELS, keys, client, makeThread, usageOf, fmtUsage, errorText, viaProxy, modelFor } from './llm.js';
const LS = { key: 'kg.apikey', model: 'kg.model', level: (id) => 'kg.level.' + id, state: (mode, id) => `kg.state.${mode}.${id}` };

const $ = (s) => document.querySelector(s);
let kg = null;
let cur = { id: null, mode: 'tutor' };
let routeId = null;
const tthreads = {}; // in memory: "mode:id" -> {thread, model}; one server-side thread per conversation
let streaming = null;
let skillCache = null;
let returnFocus = null;
const convs = {}; // in memory: "mode:id" -> [{role, content}]

// ---------- storage ----------
const lsGet = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } };
const lsDel = (k) => { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } };
export const getLevel = (id) => { const v = parseInt(lsGet(LS.level(id)), 10); return Number.isFinite(v) ? Math.max(0, Math.min(5, v)) : 0; };
const setLevel = (id, n) => lsSet(LS.level(id), String(Math.max(0, Math.min(5, n))));

// ---------- entity context ----------
const E = (id) => kg.entities[id];

export function subskills(targetId) {
  const out = [targetId];
  const seen = new Set([targetId]);
  let frontier = [targetId];
  while (frontier.length && out.length < 10) {
    const next = [];
    for (const x of frontier) {
      for (const p of E(x).prerequisites || []) {
        if (seen.has(p) || !E(p)) continue;
        seen.add(p);
        next.push(p);
      }
    }
    next.sort((a, b) => E(a).name.localeCompare(E(b).name));
    for (const p of next) if (!E(p).stub && out.length < 10) out.push(p);
    frontier = next;
  }
  return out;
}

function sectionKeys(e) {
  const keys = new Set([e.home, ...(e.sections || [])].filter(Boolean));
  for (const m of (e.body || '').matchAll(BRACKET_RE)) m[1].split(/\s*[,;]\s*/).forEach((k) => keys.add(k));
  return keys;
}

function pageText(e) {
  const nm = (ids) => ids.map((i) => (E(i) ? E(i).name + ' (' + i + ')' : i)).join(', ');
  const home = e.home && kg.sections[e.home] ? `[§${kg.sections[e.home].n}](${kg.sections[e.home].u})` : '';
  let t = `### Page: ${e.name} (id: ${e.id}; type: ${e.type}; level ${e.level})\n`;
  t += `Summary: ${e.summary}\n`;
  if (e.aliases.length) t += `Also called: ${e.aliases.join(', ')}\n`;
  t += `Prerequisites: ${e.prerequisites.length ? nm(e.prerequisites) : 'none'}\n`;
  if (home) t += `Home section in the book: ${home}\n`;
  t += `\n${e.body}\n`;
  if (e.equations.length) t += `\nEquations from the book:\n` + e.equations.map((q) => `- ${q.id}: $${q.tex}$`).join('\n') + '\n';
  if (e.functions.length) t += `\nR functions in the bayestrials package:\n` + e.functions.map((f) => `- ${f.title}: \`${f.usage.replace(/\s+/g, ' ')}\``).join('\n') + '\n';
  if (e.lab.length) t += `\nLab modules (exercises, open in a browser):\n` + e.lab.map((l) => `- [${l.title}](${l.url})`).join('\n') + '\n';
  return t;
}

function keyTable(entities) {
  const keys = new Set();
  entities.forEach((e) => sectionKeys(e).forEach((k) => keys.add(k)));
  const rows = [...keys].filter((k) => kg.sections[k]).map((k) => {
    const s = kg.sections[k];
    return `- ${k} = §${s.n || s.t} ${s.t}: ${s.u}`;
  });
  return rows.join('\n');
}

async function loadSkill() {
  if (skillCache) return skillCache;
  const res = await fetch('vendor/socratic-tutor/SKILL.md');
  if (!res.ok) throw new Error('Could not load the tutor skill file.');
  let t = await res.text();
  t = t.replace(/^---[\s\S]*?\n---\s*\n/, '');
  t = t.replace(/\s\u2014\s/g, ', ').replace(/\u2014/g, ', ');
  // Drop the guard and the generic session start; the site supplies its own versions below.
  const chunks = t.split(/\n(?=## )/);
  t = chunks.filter((c) => !/^## (Guard|Session start)/.test(c)).join('\n');
  skillCache = t.trim();
  return skillCache;
}

function bookLine() {
  const b = kg.book;
  return `"${b.title}" (${b.authors}, 2026; ${b.html}; DOI https://doi.org/${b.doi})`;
}

async function tutorPrompt(id) {
  const skill = await loadSkill();
  const ids = subskills(id);
  const pages = ids.map((i) => E(i));
  const ordered = [...ids].reverse(); // foundations first
  const levels = ordered.map((i) => `- ${i}: ${E(i).name}${i === id ? ' (TARGET)' : ''}, current level ${getLevel(i)}`).join('\n');
  const stubs = (E(id).prerequisites || []).filter((p) => E(p) && E(p).stub).map((p) => E(p).name);
  const sys = `You are a Socratic tutor inside an encyclopedia built on the book ${bookLine()}. The reader has asked to be taught "${E(id).name}", so intent is confirmed: do not ask whether they want a quick answer.

# Tutoring method (adapted from Jane Street's socratic-tutor skill, MIT)

${skill}

# Adaptations for this site

- The topic is fixed. The skill map has exactly these subskills (ids are entity ids, foundations first), with the reader's saved levels:
${levels}
- Session start: if all levels are 0, run the short diagnostic (3 to 5 questions, one at a time, easy to hard, no teaching yet), then propose where to start. If some levels are above 0, welcome the reader back in one sentence and test one saved subskill with a single question before moving on.
- Teach only from the pages below. If the pages do not cover something, say so plainly instead of answering from memory. Never invent numbers, dates, trial facts or citations; every number you give must appear in a page below.
- Cite sections as markdown links to the book, for example [§15.2.2](https://...), using the section key table at the end. Cite when you introduce a fact or send the reader to read.
- Use each page's "Check yourself" questions and the linked lab modules as exercises. Prefer predict-then-check questions. Paraphrase a question rather than copying it when the reader has already seen it.
- Ask exactly one question per message and stop after it.
- Write math with $...$ and $$...$$.
- The interface shows the skill map itself. Do not draw the ASCII map unless the reader asks "show progress".
- Whenever you change a level, end the message with one line per change in exactly this form, on its own line, with the entity id and an integer from 0 to 5: \`LEVEL entity-id N\`. The interface reads these lines and hides them. Do not mention them to the reader. Raise levels only as the evaluation rules allow.
- "save state" and "resume from:" still work as in the skill: print or read a compact text block.${stubs.length ? `\n- These prerequisites have no page yet, so only mention them by name: ${stubs.join(', ')}.` : ''}

# Pages (the only source you may teach from)

${pages.map(pageText).join('\n---\n\n')}

# Section key table

${keyTable(pages)}
`;
  const known = ordered.filter((i) => getLevel(i) > 0).map((i) => `LEVEL ${i} ${getLevel(i)}`);
  const first = known.length
    ? `Teach me "${E(id).name}". Resume from: my saved levels are\n${known.join('\n')}\nContinue with the next step.`
    : `Teach me "${E(id).name}". I am ready for the diagnostic.`;
  return { sys, first };
}

async function askPrompt(id) {
  const e = E(id);
  const nb = [...new Set([...(e.prerequisites || []), ...(e.needed_for || []), ...(e.related || []).map((r) => r.to), ...(e.related_in || []).map((r) => r.from)])]
    .filter((i) => E(i) && !E(i).stub && i !== id).slice(0, 8);
  const pages = [e, ...nb.map((i) => E(i))];
  const stubs = [...new Set([...(e.prerequisites || []), ...(e.needed_for || [])])].filter((i) => E(i) && E(i).stub).map((i) => E(i).name);
  const sys = `You answer questions about one page of an encyclopedia built on the book ${bookLine()}. The reader is on the page "${e.name}". Answer from the pages below only; they are the current page and its neighbors.

- If the pages do not cover the question, say so and point to the most relevant section link instead of answering from memory.
- Never invent numbers, dates, trial facts or citations; every number must appear in a page below.
- Cite sections as markdown links to the book, for example [§15.2.2](https://...), using the section key table at the end.
- Be concise: a short paragraph unless the reader asks for more. Write math with $...$ and $$...$$.
- When useful, mention other entities by name so the reader can open them.${stubs.length ? `\n- Neighbors without a page yet (name only): ${stubs.join(', ')}.` : ''}

# Pages

${pages.map(pageText).join('\n---\n\n')}

# Section key table

${keyTable(pages)}
`;
  return { sys, first: `What should I know about "${e.name}"?` };
}

const buildPrompt = (mode, id) => (mode === 'tutor' ? tutorPrompt(id) : askPrompt(id));

// ---------- UI ----------
const convKey = () => `${cur.mode}:${cur.id}`;
const getConv = () => (convs[convKey()] = convs[convKey()] || []);
const hideLevelLines = (t) => t.replace(/^[ \t]*LEVEL[ \t]+[a-z0-9-]+[ \t]+[0-5][ \t]*$\n?/gm, '').replace(/(^|\n)[ \t]*L(E(V(E(L[^\n]*)?)?)?)?$/, '$1');

function setStatus(msg) { $('#t-status').textContent = msg || ''; }

function bindMap() {
  const box = $('#t-map');
  if (!box || box.dataset.bound) return;
  box.dataset.bound = '1';
  box.addEventListener('click', (ev) => {
    const bar = ev.target.closest('.bar');
    if (!bar) return;
    const r = bar.getBoundingClientRect();
    setLevel(bar.dataset.id, Math.round(((ev.clientX - r.left) / r.width) * 5));
    renderMap();
  });
  box.addEventListener('keydown', (ev) => {
    const bar = ev.target.closest('.bar');
    if (!bar || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(ev.key)) return;
    ev.preventDefault();
    const id = bar.dataset.id;
    const d = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1 }[ev.key];
    setLevel(id, ev.key === 'Home' ? 0 : ev.key === 'End' ? 5 : getLevel(id) + d);
    renderMap();
    const nb = box.querySelector(`.bar[data-id="${CSS.escape(id)}"]`); if (nb) nb.focus();
  });
}

function renderMap() {
  bindMap();
  const box = $('#t-map');
  if (cur.mode !== 'tutor' || !cur.id) { box.hidden = true; return; }
  box.hidden = false;
  const ids = subskills(cur.id).slice().reverse();
  box.innerHTML = ids.map((i) => {
    const l = getLevel(i);
    return `<div class="sk${i === cur.id ? ' target' : ''}"><span class="nm" title="${esc(E(i).name)}">${esc(E(i).name)}</span>
      <span class="bar" data-id="${esc(i)}" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="5" aria-valuenow="${l}" aria-label="Level of ${esc(E(i).name)}, click to set" title="Click to set your level, 0 to 5"><i style="width:${l * 20}%"></i></span>
      <span class="lv">${l}/5</span></div>`;
  }).join('');
}

function addMsg(role, html, cls) {
  const d = document.createElement('div');
  d.className = 'msg ' + role + (cls ? ' ' + cls : '');
  if (role === 'assistant') d.innerHTML = '<div class="body"></div>';
  const log = $('#t-log');
  log.appendChild(d);
  log.scrollTop = log.scrollHeight;
  if (html != null) { role === 'assistant' ? (d.firstChild.innerHTML = html) : (d.textContent = html); }
  return d;
}

function renderLog() {
  $('#t-log').innerHTML = '';
  getConv().forEach((m) => {
    if (m.role === 'user') addMsg('user', m.content);
    else { const el = addMsg('assistant', renderMarkdown(hideLevelLines(m.content), kg)); if (m.usage) { const u = document.createElement('div'); u.className = 'usage'; u.textContent = m.usage; el.appendChild(u); } }
  });
  if (!getConv().length) {
    addMsg('assistant', null, 'notice').firstChild.textContent = cur.mode === 'tutor'
      ? 'Press Start. The tutor asks a few questions, one at a time, and teaches only from this page and its prerequisites.'
      : 'Ask a question about this page. Answers use only this page and its neighbors.';
  }
  $('#t-start').hidden = getConv().length > 0;
}

function refreshAll() {
  const e = cur.id ? E(cur.id) : null;
  $('#tutor-title').textContent = e ? (cur.mode === 'tutor' ? 'Tutor: ' : 'Ask: ') + e.name : 'Tutor';
  document.querySelectorAll('.tabs [role=tab]').forEach((t) => t.setAttribute('aria-selected', t.dataset.mode === cur.mode ? 'true' : 'false'));
  renderMap();
  renderLog();
  setStatus('');
}

export function open(id, mode) {
  if (!E(id) || E(id).stub) return;
  returnFocus = document.activeElement;
  cur = { id, mode: mode || 'tutor' };
  $('#tutor').hidden = false;
  refreshAll();
  $('#t-input').focus();
}

function close() {
  if (streaming) { try { streaming.abort(); } catch (e) { /* ignore */ } }
  $('#tutor').hidden = true;
  if (returnFocus && document.contains(returnFocus)) returnFocus.focus();
}

export function onRoute(id) {
  routeId = id;
  if (!$('#tutor').hidden && id && id !== cur.id && E(id) && !E(id).stub) { cur.id = id; refreshAll(); }
  else if (!$('#tutor').hidden && id && id !== cur.id) { /* stub or unknown: keep the current session */ }
}

function getKey() { return keys.value; }

// ---------- API ----------
async function send(text) {
  if (streaming || !cur.id) return;
  const key = getKey(); // empty: the call goes through the site's proxy (Haiku)
  const mode = cur.mode, id = cur.id;
  const conv = convs[`${mode}:${id}`] = convs[`${mode}:${id}`] || [];
  const logHere = () => cur.mode === mode && cur.id === id;
  conv.push({ role: 'user', content: text });
  if (logHere()) { if (conv.length === 1) $('#t-log').innerHTML = ''; addMsg('user', text); }
  $('#t-start').hidden = true;
  const msgEl = logHere() ? addMsg('assistant', null) : null;
  const bodyEl = msgEl ? msgEl.firstChild : null;
  if (bodyEl) bodyEl.classList.add('streaming');
  setBusy(true);
  setStatus('Thinking...');
  let acc = '';
  try {
    const model = modelFor($('#t-model').value);
    const ck = `${mode}:${id}`;
    let th = tthreads[ck];
    if (!th || th.model !== model || th.proxy !== viaProxy()) {
      // New thread: the stable system prompt goes up once; earlier turns (if any) are replayed from our own copy.
      const { sys } = await buildPrompt(mode, id);
      const cl = await client(key);
      const seed = conv.slice(0, -1).map((m) => ({ role: m.role, content: m.content }));
      th = tthreads[ck] = { model, proxy: viaProxy(), cl, thread: makeThread(cl, { model, system: sys, max_tokens: viaProxy() ? 1500 : 16000, seed, proxy: viaProxy() }) };
    }
    const stream = th.thread.stream({ role: 'user', content: text });
    streaming = stream;
    stream.on('text', (delta) => {
      acc += delta;
      setStatus('');
      if (bodyEl && logHere()) { bodyEl.textContent = hideLevelLines(acc); $('#t-log').scrollTop = $('#t-log').scrollHeight; }
    });
    const final = await stream.finalMessage();
    const full = (final.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('') || acc;
    const usage = fmtUsage(usageOf(final, model));
    finishAssistant(conv, full, bodyEl, mode, id, logHere, usage);
    if (final.stop_reason === 'refusal') notice('The model declined to answer this request.', logHere);
    else if (final.stop_reason === 'max_tokens') notice('The reply hit the length limit and was cut off. Ask it to continue.', logHere);
  } catch (err) {
    delete tthreads[`${mode}:${id}`]; // rebuilt from our own copy of the conversation on the next turn
    if (acc.trim() && (err.name === 'AbortError' || /abort/i.test(String(err.message)))) {
      finishAssistant(conv, acc, bodyEl, mode, id, logHere);
      notice('Stopped.', logHere);
    } else {
      if (msgEl) msgEl.remove();
      if (!acc.trim()) conv.pop(); else conv.push({ role: 'assistant', content: acc });
      if (logHere()) addMsg('assistant', null, 'error').firstChild.textContent = errorText(err, !key);
    }
  } finally {
    streaming = null;
    setBusy(false);
    setStatus('');
  }
}

function finishAssistant(conv, full, bodyEl, mode, id, logHere, usage) {
  conv.push({ role: 'assistant', content: full, usage });
  if (mode === 'tutor') {
    const allowed = new Set(subskills(id));
    for (const m of full.matchAll(/^[ \t]*LEVEL[ \t]+([a-z0-9-]+)[ \t]+([0-5])[ \t]*$/gm)) {
      if (allowed.has(m[1])) setLevel(m[1], parseInt(m[2], 10));
    }
    if (logHere()) renderMap();
  }
  if (bodyEl && logHere()) {
    bodyEl.classList.remove('streaming');
    bodyEl.innerHTML = renderMarkdown(hideLevelLines(full), kg);
    if (window.renderMathInElement) { try { renderMathInElement(bodyEl, { delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }], throwOnError: false }); } catch (e) { /* ignore */ } }
    if (usage) { const u = document.createElement('div'); u.className = 'usage'; u.textContent = usage; bodyEl.parentElement.appendChild(u); }
    $('#t-log').scrollTop = $('#t-log').scrollHeight;
  }
}

function notice(text, logHere) {
  if (logHere()) addMsg('assistant', null, 'notice').firstChild.textContent = text;
}

function setBusy(b) {
  $('#t-send').disabled = b;
  $('#t-stop').hidden = !b;
  $('#t-input').disabled = b;
  if (!b && !$('#tutor').hidden) $('#t-input').focus();
}

// ---------- copy, save, resume ----------
async function copyPrompt() {
  if (!cur.id) return;
  try {
    const { sys, first } = await buildPrompt(cur.mode, cur.id);
    const text = `${sys}\n\n=====\nFirst message to send after the instructions above:\n\n${first}\n`;
    try { await navigator.clipboard.writeText(text); }
    catch (e) {
      const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    }
    setStatus('Copied. Paste it into claude.ai as your first message.');
  } catch (e) { setStatus('Could not build the prompt: ' + e.message); }
}

function saveState() {
  if (!cur.id) return;
  const ok = lsSet(LS.state(cur.mode, cur.id), JSON.stringify({ at: new Date().toISOString(), messages: getConv(), levels: Object.fromEntries(subskills(cur.id).map((i) => [i, getLevel(i)])) }));
  setStatus(ok ? 'State saved in this browser.' : 'Could not save (storage is full or blocked).');
}

function resumeState() {
  if (!cur.id) return;
  const raw = lsGet(LS.state(cur.mode, cur.id));
  if (!raw) { setStatus('No saved state for this page.'); return; }
  try {
    const s = JSON.parse(raw);
    convs[convKey()] = s.messages || [];
    delete tthreads[convKey()];
    Object.entries(s.levels || {}).forEach(([i, n]) => { if (E(i)) setLevel(i, n); });
    refreshAll();
    setStatus('Resumed from ' + (s.at || '').slice(0, 10) + '.');
  } catch (e) { setStatus('Saved state is unreadable.'); }
}

// ---------- init ----------
export function init(data) {
  kg = data;
  keys.init();
  if (keys.value) { $('#t-key').value = keys.value; $('#t-remember').checked = true; }
  const syncKeyUi = () => { $('#t-modelrow').hidden = !keys.value; $('#t-free').hidden = !!keys.value; };
  syncKeyUi();
  const m = lsGet(LS.model);
  if (m && MODELS[m]) $('#t-model').value = m;
  $('#t-model').addEventListener('change', (e) => lsSet(LS.model, e.target.value));
  $('#t-key').addEventListener('input', (e) => { keys.set(e.target.value); syncKeyUi(); });
  $('#t-remember').addEventListener('change', (e) => keys.setRemember(e.target.checked));
  $('#t-close').addEventListener('click', close);
  document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && !$('#tutor').hidden && !ev.defaultPrevented) close(); });
  document.querySelectorAll('.tabs [role=tab]').forEach((t) => t.addEventListener('click', () => { cur.mode = t.dataset.mode; refreshAll(); }));
  $('#t-form').addEventListener('submit', (ev) => {
    ev.preventDefault();
    const v = $('#t-input').value.trim();
    if (!v) return;
    $('#t-input').value = '';
    send(v);
  });
  $('#t-input').addEventListener('keydown', (ev) => { if (ev.key === 'Enter' && (ev.metaKey || ev.ctrlKey)) { ev.preventDefault(); $('#t-form').requestSubmit(); } });
  $('#t-start').addEventListener('click', async () => {
    const { first } = await buildPrompt(cur.mode, cur.id);
    send(first);
  });
  $('#t-stop').addEventListener('click', () => { if (streaming) streaming.abort(); });
  $('#t-copy').addEventListener('click', copyPrompt);
  $('#t-save').addEventListener('click', saveState);
  $('#t-resume').addEventListener('click', resumeState);
  $('#t-reset').addEventListener('click', () => { if (!streaming) { delete convs[convKey()]; delete tthreads[convKey()]; refreshAll(); } });
}
