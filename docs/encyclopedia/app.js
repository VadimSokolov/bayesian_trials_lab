// Single-page app: hash routing, vanilla JS. Data comes from data/kg.json.
import { esc, renderMarkdown, mathHtml, chipHtml, formulaHtml } from './render.js';
import { enhanceFormulas } from './formulas.js';
import * as Tutor from './tutor.js';
import * as Search from './search.js';
import * as Ask from './ask.js';

const $ = (sel, root = document) => root.querySelector(sel);
const view = $('#view');
let KG = null;
let cyInstances = [];

const LEVELS = { 1: 'Foundation', 2: 'Core', 3: 'Advanced' };
const DONE_KEY = 'kg.done';

// ---------- helpers ----------
const ents = () => KG.entities;
const chapterByNum = (n) => KG.chapters.find((c) => c.num === String(n));
const typeChip = (t) => `<span class="ty">${esc(t)}</span>`;
const entA = (id, text) => {
  const e = ents()[id];
  if (!e) return `<span class="elink missing">${esc(text || id)}</span>`;
  return `<a class="elink${e.stub ? ' stub' : ''}" href="#/e/${esc(id)}">${esc(text || e.name)}</a>`;
};
const sortName = (a, b) => a.name.localeCompare(b.name);
const pagesFirst = (a, b) => (a.stub - b.stub) || sortName(a, b);

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
function typeColors() {
  const out = {};
  KG.types.forEach((t) => { out[t] = cssVar('--t-' + t) || '#888'; });
  return out;
}

function loadDone() {
  try { return new Set(JSON.parse(localStorage.getItem(DONE_KEY) || '[]')); } catch (e) { return new Set(); }
}
function saveDone(set) {
  try { localStorage.setItem(DONE_KEY, JSON.stringify([...set])); } catch (e) { /* ignore */ }
}

function destroyGraphs() {
  cyInstances.forEach((c) => { try { c.destroy(); } catch (e) { /* ignore */ } });
  cyInstances = [];
}

// Prerequisite depth: 0 = no prerequisites (among the given ids), else 1 + max depth of prerequisites.
function depths(idSet) {
  const memo = {};
  const visiting = new Set();
  const d = (id) => {
    if (memo[id] !== undefined) return memo[id];
    if (visiting.has(id)) return 0;
    visiting.add(id);
    const ps = (ents()[id].prerequisites || []).filter((p) => idSet.has(p) && ents()[p]);
    memo[id] = ps.length ? 1 + Math.max(...ps.map(d)) : 0;
    visiting.delete(id);
    return memo[id];
  };
  idSet.forEach(d);
  return memo;
}
const chapNum = (e) => parseInt((e.chapters || [])[0], 10) || 999;
const partOfChapter = (n) => KG.parts.find((p) => p.chapters.includes(String(n)));

// ---------- search ----------
function buildIndex() {
  return Object.values(ents()).map((e) => ({
    e,
    name: e.name.toLowerCase(),
    aliases: (e.aliases || []).map((a) => a.toLowerCase()),
    summary: (e.summary || '').toLowerCase(),
  }));
}
let INDEX = [];
function runSearch(q) {
  q = q.trim().toLowerCase();
  if (!q) return [];
  const tokens = q.split(/\s+/);
  const out = [];
  for (const it of INDEX) {
    let score = 0;
    if (it.name === q) score = 100;
    else if (it.name.startsWith(q)) score = 85;
    else if (it.aliases.includes(q)) score = 80;
    else if (it.aliases.some((a) => a.startsWith(q))) score = 65;
    else if (it.name.includes(q)) score = 60;
    else if (it.aliases.some((a) => a.includes(q))) score = 45;
    else {
      const hay = it.name + ' ' + it.aliases.join(' ') + ' ' + it.summary;
      if (tokens.every((t) => hay.includes(t))) score = 20;
    }
    if (score) out.push({ it, score: score - (it.e.stub ? 3 : 0) });
  }
  out.sort((a, b) => b.score - a.score || a.it.name.localeCompare(b.it.name));
  return out.slice(0, 12).map((x) => x.it.e);
}

let searchCount = 0;
function mountSearch(container, big) {
  const n = ++searchCount;
  container.innerHTML = `<div class="search${big ? ' big' : ''}">
    <label class="sr-only" for="q${n}">Search concepts, methods, trials</label>
    <input id="q${n}" type="search" role="combobox" aria-expanded="false" aria-controls="ql${n}" aria-autocomplete="list" autocomplete="off" placeholder="${big ? 'Search or ask: futility, Bayes factor, priors' : 'Search'}">
    <ul id="ql${n}" role="listbox" hidden></ul></div>`;
  const input = $('input', container);
  const list = $('ul', container);
  let results = [];
  let active = -1;
  const close = () => { list.hidden = true; input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); active = -1; };
  const setActive = (i) => {
    active = i;
    [...list.children].forEach((li, j) => li.setAttribute('aria-selected', j === i ? 'true' : 'false'));
    if (i >= 0) { input.setAttribute('aria-activedescendant', `o${n}-${i}`); list.children[i].scrollIntoView({ block: 'nearest' }); }
    else input.removeAttribute('aria-activedescendant');
  };
  const go = (e) => { close(); input.value = ''; location.hash = '#/e/' + e.id; };
  const goSearch = () => { const q = input.value.trim(); if (!q) return; close(); input.blur(); location.hash = '#/search?q=' + encodeURIComponent(q); };
  const render = () => {
    results = runSearch(input.value);
    if (!input.value.trim()) { close(); return; }
    list.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    const more = `<li role="option" id="o${n}-${results.length}" aria-selected="false" class="more" data-search="1"><span>Search for "${esc(input.value.trim())}"</span></li>`;
    list.innerHTML = results.map((e, i) => `<li role="option" id="o${n}-${i}" aria-selected="false" data-id="${esc(e.id)}">
      <span>${esc(e.name)} ${typeChip(e.type)}${e.stub ? ' <span class="ty">planned</span>' : ''}</span>
      <span class="sub">${esc(e.summary || (e.aliases || []).join(', ') || 'Ch. ' + (e.chapters[0] || ''))}</span></li>`).join('') + more;
    setActive(-1);
  };
  input.addEventListener('input', render);
  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowDown') { ev.preventDefault(); if (list.hidden) render(); else setActive((active + 1) % (results.length + 1)); }
    else if (ev.key === 'ArrowUp') { ev.preventDefault(); setActive((active - 1 + results.length + 1) % (results.length + 1)); }
    else if (ev.key === 'Enter') { ev.preventDefault(); if (active >= 0 && active < results.length) go(results[active]); else goSearch(); }
    else if (ev.key === 'Escape') { if (!list.hidden) { ev.stopPropagation(); close(); } else input.value = ''; }
  });
  list.addEventListener('mousedown', (ev) => {
    const li = ev.target.closest('li[data-id]');
    if (li) { ev.preventDefault(); go(ents()[li.dataset.id]); }
    else if (ev.target.closest('li[data-search]')) { ev.preventDefault(); goSearch(); }
  });
  input.addEventListener('blur', () => setTimeout(close, 120));
  input.addEventListener('focus', () => { if (input.value.trim()) render(); });
  return input;
}

// ---------- search page (free results, plus smart search) ----------
let searchSeq = 0;
function searchView(params) {
  const q = (params.get('q') || '').trim();
  view.innerHTML = `<section class="searchpage">
    <form id="sp-form" class="sp-form" role="search"><label class="sr-only" for="sp-q">Search the encyclopedia and the book</label>
      <input id="sp-q" type="search" autocomplete="off" value="${esc(q)}" placeholder="Search or ask a question"></form>
    <p id="sp-smartbar" class="sp-smartbar" hidden><button type="button" class="linkbtn" id="sp-smartbtn">Smart search</button></p>
    <div id="sp-smart" class="sp-smart" role="status" aria-live="polite"></div>
    <p id="sp-note" class="muted small" role="status"></p>
    <ol id="sp-list" class="sp-list"></ol>
    ${Ask.settingsHtml()}</section>`;
  Ask.bindSettings(view);
  $('#sp-form').addEventListener('submit', (ev) => { ev.preventDefault(); const v = $('#sp-q').value.trim(); if (v) location.hash = '#/search?q=' + encodeURIComponent(v); });
  if (!q) return;
  const seq = ++searchSeq;
  const note = $('#sp-note');
  const alive = () => seq === searchSeq && $('#sp-list');
  const paint = async () => {
    const res = await Search.search(q, { k: 12 });
    if (!alive()) return;
    note.textContent = '';
    $('#sp-list').innerHTML = res.length ? res.map(({ chunk: c }) => {
      const ent = c.kind === 'entity';
      const href = ent ? '#/e/' + esc(c.ref) : esc(c.url);
      const e = ent ? ents()[c.ref] : null;
      const head = ent ? esc(c.title) : (c.number ? '&sect;' + esc(c.number) + ' ' : '') + esc(c.title.replace(/\$/g, ''));
      const tag = ent ? (e ? e.type : '') : 'book';
      return `<li><a class="title" href="${href}"${ent ? '' : ' target="_blank" rel="noopener noreferrer"'}>${head}</a> <span class="ty">${esc(tag)}</span><p>${Search.highlight(Search.snippet(c.text, q), q)}</p></li>`;
    }).join('') : '<li class="muted">No results.</li>';
  };
  paint().catch(() => { note.textContent = 'Search is not available.'; });
  if (Search.state.semantic === 'idle') Search.loadSemantic();
  if (Search.state.semantic === 'idle' || Search.state.semantic === 'loading') {
    const off = Search.onState((st) => { if (st === 'ready' || st === 'failed') { off(); if (alive()) paint(); } });
  }

  // Smart search: automatic for a question, a quiet button otherwise.
  const smartBox = $('#sp-smart');
  const runSmart = async () => {
    $('#sp-smartbar').hidden = true;
    smartBox.innerHTML = '<p class="sm-wait">Finding the passages that answer this...</p>';
    try {
      const r = await Ask.smart(q);
      if (!alive()) return;
      smartBox.innerHTML = Ask.smartHtml(r) + '<hr class="sm-rule">';
    } catch (err) {
      if (!alive()) return;
      smartBox.innerHTML = `<p class="sm-notice">${esc(err.message || 'Smart search is not available.')} The results below are from the regular search.</p>`;
    }
  };
  $('#sp-smartbtn').addEventListener('click', runSmart);
  if (Ask.looksLikeQuestion(q)) runSmart(); else $('#sp-smartbar').hidden = false;
}

// ---------- footer ----------
function renderFooter() {
  const b = KG.book;
  $('#footer').innerHTML = `<p>${esc(b.authors)} (2026). <em>${esc(b.title)}</em>.
    <a href="https://doi.org/${esc(b.doi)}" target="_blank" rel="noopener noreferrer">DOI</a> &middot;
    <a href="llms.txt">llms.txt</a></p>`;
}

// ---------- views ----------
function ownedBy(num) {
  return Object.values(ents()).filter((e) => (e.chapters || [])[0] === String(num));
}
function mentionedIn(num) {
  return Object.values(ents()).filter((e) => (e.chapters || []).slice(1).includes(String(num)));
}

function homeView() {
  const all = Object.values(ents());
  const pages = all.filter((e) => !e.stub);
  const dep = depths(new Set(pages.map((e) => e.id)));
  const sorted = pages.slice().sort((a, b) => (dep[a.id] - dep[b.id]) || (chapNum(a) - chapNum(b)) || sortName(a, b));
  const start = [];
  const per = {};
  sorted.forEach((e) => { const p = (partOfChapter(e.chapters[0]) || {}).name; per[p] = (per[p] || 0) + 1; if (per[p] <= 2 && start.length < 8) start.push(e); });
  start.sort((a, b) => chapNum(a) - chapNum(b));
  const byType = {};
  all.forEach((e) => { byType[e.type] = (byType[e.type] || 0) + 1; });
  let h = `<section class="hero"><h1>Bayesian Clinical Trials</h1>
    <p>Short pages for the ideas, methods and trials of the book, linked by what to learn first.</p><div id="home-search"></div></section>`;
  h += `<h2>Start here</h2><ol class="route">${start.map((e) => `<li><a class="title" href="#/e/${esc(e.id)}">${esc(e.name)}</a><span class="sum">${esc(e.summary)}</span></li>`).join('')}</ol>
    <p class="quiet"><a href="#/graph">See the whole map</a></p>`;
  h += `<h2>The book</h2><div class="parts">`;
  KG.parts.forEach((p) => {
    h += `<details class="part"><summary>${esc(p.name || 'Chapters')}</summary><ul class="chaplist">`;
    p.chapters.forEach((n) => {
      const c = chapterByNum(n);
      h += `<li><span class="num">${esc(n)}</span><a href="#/c/${esc(n)}">${esc(c.title)}</a></li>`;
    });
    h += `</ul></details>`;
  });
  const nfx = (KG.formulas || []).length;
  h += `</div><details class="browse"><summary>Browse</summary>${nfx ? `<h3>Formulas in words</h3><p class="typerow"><a href="#/formulas">${nfx} book formulas, each read aloud in a sentence</a></p>` : ''}<h3>By type</h3><p class="typerow">${KG.types.filter((t) => byType[t]).map((t) =>
    `<a href="#/type/${t}">${t} ${byType[t]}</a>`).join('')}</p>
    <h3>Catalogued results</h3>`;
  h += KG.results.map((r) => `<div class="resitem"><strong>${esc(r.name)}</strong> <span class="ty">${esc(r.status || '')}</span>
    <div class="meta"><a href="#/c/${esc(r.chapter)}">Chapter ${esc(r.chapter)}</a>${(r.entities || []).map((id) => ' &middot; ' + entA(id)).join('')}</div>
    <div>${esc(r.summary || '')}</div></div>`).join('');
  h += `</details>`;
  view.innerHTML = h;
  mountSearch($('#home-search'), true);
  document.title = 'Bayesian Clinical Trials: encyclopedia';
}

function formulasView() {
  const fs = KG.formulas || [];
  const byCh = {};
  fs.forEach((f) => { (byCh[f.chapter] = byCh[f.chapter] || []).push(f); });
  const chs = KG.chapters.filter((c) => byCh[c.num]);
  let h = `<h1>Formulas in words</h1>
    <p class="summary">${fs.length} formulas from the book. Each colored piece of a formula has a matching phrase in the sentence below it. Hover or tap a piece to light up its match and read a note.</p>`;
  if (!fs.length) h += '<p class="muted">No formulas yet.</p>';
  else h += `<p class="chapnav small"><span class="muted">Chapter</span> ${chs.map((c) => `<a href="#/formulas" data-jump="fch-${esc(c.num)}">${esc(c.num)}</a>`).join(' ')}</p>`;
  chs.forEach((c) => {
    h += `<section class="fx-group" id="fch-${esc(c.num)}"><h2><a href="#/c/${esc(c.num)}">Chapter ${esc(c.num)}: ${esc(c.title)}</a></h2>`;
    byCh[c.num].forEach((f) => {
      const used = (f.used_on || []).filter((id) => ents()[id]);
      h += `<article class="fx-item"><h3>${esc(f.title)}</h3>${formulaHtml(f, '')}
        <p class="fx-meta small muted">In the book ${chipHtml(KG, f.section)}${used.length ? ' &middot; Used on ' + used.map((id) => entA(id)).join(', ') : ''}</p></article>`;
    });
    h += '</section>';
  });
  view.innerHTML = h;
  view.querySelectorAll('[data-jump]').forEach((a) => a.addEventListener('click', (ev) => {
    ev.preventDefault();
    const t = document.getElementById(a.dataset.jump);
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
  enhanceFormulas(view);
  document.title = 'Formulas in words | Bayesian Clinical Trials';
}

function typeView(t) {
  const list = Object.values(ents()).filter((e) => e.type === t).sort(pagesFirst);
  view.innerHTML = `<p class="crumbs"><a href="#/">Home</a> / Types</p><h1>${typeChip(t)} ${list.length} entries</h1>
    <ul class="sections">${list.map((e) => `<li>${entA(e.id)}${e.stub ? ' <span class="ty">planned</span>' : ''}${e.summary ? ' <span class="small">' + esc(e.summary) + '</span>' : ''}</li>`).join('')}</ul>`;
  document.title = t + ' entries';
}

function groupRelated(e) {
  const groups = {};
  const add = (label, id) => { (groups[label] = groups[label] || []); if (!groups[label].includes(id)) groups[label].push(id); };
  (e.related || []).forEach((r) => add((KG.rel_labels[r.rel] || { out: r.rel }).out, r.to));
  (e.related_in || []).forEach((r) => add((KG.rel_labels[r.rel] || { in: r.rel }).in, r.from));
  return groups;
}

function entityView(id) {
  const e = ents()[id];
  if (!e) { view.innerHTML = `<h1>Not found</h1><p>No entity "${esc(id)}". <a href="#/">Home</a></p>`; return; }
  const ch = chapterByNum(e.chapters[0]);
  let article;
  if (e.stub) {
    article = `<div class="stubnote"><strong>This page is not written yet.</strong>
      <p>The book treats ${esc(e.name)} in ${e.chapters.map((c) => `<a href="#/c/${esc(c)}">chapter ${esc(c)}</a>`).join(', ')}.
      ${e.home && KG.sections[e.home] ? 'Start at ' + chipHtml(KG, e.home) + ' ' + esc(KG.sections[e.home].t) + '.' : ''}</p></div>`;
  } else {
    article = renderMarkdown(e.body, KG);
  }
  const prereqs = e.prerequisites || [];
  const needed = e.needed_for || [];
  const groups = groupRelated(e);
  const listIds = (ids) => `<ul>${ids.map((i) => `<li>${entA(i)}</li>`).join('')}</ul>`;
  const secLi = (k) => {
    const s = KG.sections[k];
    if (!s) return '';
    return `<li>${chipHtml(KG, k)} ${esc(s.t)}</li>`;
  };
  let side = '';
  side += `<h3>Prerequisites</h3>${prereqs.length ? listIds(prereqs) : '<p class="small">None</p>'}`;
  if (needed.length) side += `<h3>Needed for</h3>${listIds(needed)}`;
  const homeKeys = [e.home, ...(e.sections || [])].filter((k, i, a) => k && a.indexOf(k) === i);
  if (homeKeys.length) side += `<h3>In the book</h3><ul>${homeKeys.map((k) => secLi(k)).join('')}</ul>`;
  const labs = e.lab || [];
  if (labs.length) side += `<p class="lablink"><a href="${esc(labs[0].url)}" target="_blank" rel="noopener noreferrer">Try it in the lab</a></p>`;
  let more = '';
  if ((e.aliases || []).length) more += `<h3>Also called</h3><p class="small">${e.aliases.map(esc).join(', ')}</p>`;
  const gl = Object.keys(groups);
  if (gl.length) more += `<h3>Related</h3>` + gl.map((g) => `<div class="relgroup"><b>${esc(g)}</b>${listIds(groups[g])}</div>`).join('');
  if ((e.equations || []).length) more += `<h3>Equations</h3>${e.equations.map((q) =>
    `<div class="eqrow">${mathHtml(q.tex, true)}<span class="small">${esc(q.id)} ${chipHtml(KG, q.section)}</span></div>`).join('')}`;
  if ((e.functions || []).length) more += `<h3>R functions</h3>${e.functions.map((f) =>
    `<div class="fn"><span class="fname">${esc(f.name)}</span> ${esc(f.title)}<pre><code>${esc(f.usage)}</code></pre><span class="small">${esc(f.description)}</span></div>`).join('')}`;
  if ((e.results || []).length) more += `<h3>Results</h3>${e.results.map((r) =>
    `<div class="fn"><strong>${esc(r.name)}</strong> <span class="ty">${esc(r.status || '')}</span><br><span class="small">${esc(r.summary || '')}</span>
    ${r.statement ? `<details><summary class="small">Statement</summary>${renderMarkdown(r.statement, KG)}</details>` : ''}</div>`).join('')}`;
  if (labs.length > 1) more += `<h3>Lab</h3><ul>${labs.map((l) =>
    `<li><a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.title)}</a></li>`).join('')}</ul>`;
  more += `<h3>Neighborhood</h3><div id="minigraph" role="img" aria-label="Graph of the direct neighbors of ${esc(e.name)}"></div>`;
  side += `<details class="more" id="more"><summary>More</summary>${more}</details>`;

  view.innerHTML = `<div class="entity-head">
    <p class="kicker">${typeChip(e.type)}${e.stub ? ' &middot; planned' : ''}${ch ? ` &middot; <a href="#/c/${esc(ch.num)}">Chapter ${esc(ch.num)}</a>` : ''}</p>
    <h1>${esc(e.name)}</h1>
    ${e.summary ? `<p class="summary">${esc(e.summary)}</p>` : ''}
    <div class="actions">
      ${e.stub ? '' : `<button type="button" class="btn primary" id="btn-tutor">Study with a tutor</button>`}
      <a class="quiet" href="#/path/${esc(e.id)}">Study path</a>
      <a class="quiet" href="#/graph?focus=${esc(e.id)}">Show in graph</a></div></div>
    <div class="entity-grid"><article class="article">${article}</article><aside class="panel" aria-label="Related information">${side}</aside></div>`;
  document.title = e.name + ' | Bayesian Clinical Trials';
  enhanceFormulas(view);
  const bt = $('#btn-tutor'); if (bt) bt.addEventListener('click', () => Tutor.open(e.id, 'tutor'));
  const md = $('#more');
  let drawn = false;
  md.addEventListener('toggle', () => { if (md.open && !drawn) { drawn = true; miniGraph(e); } });
}

function miniGraph(e) {
  const box = $('#minigraph');
  if (!box || !window.cytoscape) return;
  const ids = new Set([e.id]);
  (e.prerequisites || []).forEach((i) => ids.add(i));
  (e.needed_for || []).forEach((i) => ids.add(i));
  (e.related || []).forEach((r) => ids.add(r.to));
  (e.related_in || []).forEach((r) => ids.add(r.from));
  const colors = typeColors();
  const els = [];
  ids.forEach((i) => { const x = ents()[i]; if (x) els.push({ data: { id: i, label: x.name, color: colors[x.type], stub: x.stub ? 1 : 0, center: i === e.id ? 1 : 0 } }); });
  const seen = new Set();
  const edge = (s, t, kind) => {
    const k = s + '>' + t + kind;
    if (seen.has(k) || !ids.has(s) || !ids.has(t) || (s !== e.id && t !== e.id)) return;
    seen.add(k); els.push({ data: { id: k, source: s, target: t, kind } });
  };
  (e.prerequisites || []).forEach((p) => edge(p, e.id, 'prerequisite'));
  (e.needed_for || []).forEach((p) => edge(e.id, p, 'prerequisite'));
  (e.related || []).forEach((r) => edge(e.id, r.to, 'related'));
  (e.related_in || []).forEach((r) => edge(r.from, e.id, 'related'));
  const cy = cytoscape({
    container: box, elements: els, minZoom: .4, maxZoom: 2.5, userZoomingEnabled: false,
    layout: { name: ids.size > 1 ? 'concentric' : 'grid', concentric: (n) => (n.data('center') ? 2 : 1), levelWidth: () => 1, minNodeSpacing: 20, padding: 12, fit: true },
    style: graphStyle(true),
  });
  cy.on('tap', 'node', (ev) => { if (ev.target.id() !== e.id) location.hash = '#/e/' + ev.target.id(); });
  cyInstances.push(cy);
}

function graphStyle(mini) {
  const text = cssVar('--text'), line = cssVar('--muted'), bg = cssVar('--surface');
  return [
    { selector: 'node', style: {
      'background-color': 'data(color)', label: 'data(label)', color: text, 'font-size': mini ? 9 : 10, 'text-valign': 'bottom', 'text-margin-y': 3,
      'text-wrap': 'ellipsis', 'text-max-width': mini ? 80 : 110, width: mini ? 16 : 'data(size)', height: mini ? 16 : 'data(size)',
      'text-background-color': bg, 'text-background-opacity': .75, 'text-background-padding': 1, 'min-zoomed-font-size': mini ? 0 : 10 } },
    { selector: 'node[size >= 30]', style: { 'min-zoomed-font-size': 0 } },
    { selector: 'node[center = 1]', style: { width: 26, height: 26, 'border-width': 3, 'border-color': text, 'font-weight': 'bold' } },
    { selector: 'node[stub = 1]', style: { 'background-color': bg, 'border-width': 2, 'border-color': 'data(color)', 'border-style': 'dashed' } },
    { selector: 'edge[kind = "prerequisite"]', style: { width: 2, 'line-color': line, 'target-arrow-color': line, 'target-arrow-shape': 'triangle', 'curve-style': 'bezier' } },
    { selector: 'edge[kind = "related"]', style: { width: 1, 'line-style': 'dashed', 'line-color': line, opacity: .55, 'curve-style': 'bezier' } },
    { selector: '.dim', style: { opacity: .12 } },
    { selector: 'node:selected, .hit', style: { 'border-width': 3, 'border-color': cssVar('--focus') } },
  ];
}

function chapterView(num) {
  const c = chapterByNum(num);
  if (!c) { view.innerHTML = `<h1>Not found</h1><p>No chapter "${esc(num)}". <a href="#/">Home</a></p>`; return; }
  const owned = ownedBy(num).sort(pagesFirst);
  const mentioned = mentionedIn(num).sort(pagesFirst);
  const byName = {};
  Object.values(ents()).forEach((e) => { byName[e.name.toLowerCase()] = e.id; (e.aliases || []).forEach((a) => { byName[a.toLowerCase()] = byName[a.toLowerCase()] || e.id; }); });
  const idx = KG.chapters.findIndex((x) => x.num === c.num);
  const prev = KG.chapters[idx - 1], next = KG.chapters[idx + 1];
  const li = (e) => `<li>${entA(e.id)} ${typeChip(e.type)}${e.stub ? ' <span class="ty">planned</span>' : ''}</li>`;
  view.innerHTML = `<p class="crumbs"><a href="#/">Home</a> / ${esc(c.part)}</p>
    <h1>Chapter ${esc(c.num)}: ${esc(c.title)}</h1>
    <p><a class="btn" href="${esc(c.url)}" target="_blank" rel="noopener noreferrer">Read the chapter in the book</a></p>
    <p>${esc(c.summary)}</p>
    ${c.key_terms.length ? `<h2>Key terms</h2><ul class="keyterms">${c.key_terms.map((t) => byName[t.toLowerCase()] ? `<li>${entA(byName[t.toLowerCase()], t)}</li>` : `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
    <div class="two-col"><div><h2>Owned here (${owned.length})</h2><ul class="sections">${owned.map(li).join('') || '<li class="small">None yet</li>'}</ul></div>
    <div><h2>Also discussed (${mentioned.length})</h2><ul class="sections">${mentioned.map(li).join('') || '<li class="small">None yet</li>'}</ul></div></div>
    <h2>Sections</h2><ul class="sections">${c.sections.map((s) =>
      `<li class="l${Math.min(s.level, 3)}"><span class="n">${esc(s.number)}</span><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)}</a></li>`).join('')}</ul>
    <p>${prev ? `<a href="#/c/${esc(prev.num)}">&larr; Chapter ${esc(prev.num)}</a>` : ''} ${next ? `&nbsp; <a href="#/c/${esc(next.num)}">Chapter ${esc(next.num)} &rarr;</a>` : ''}</p>`;
  document.title = 'Chapter ' + c.num + ': ' + c.title;
}

function graphView(params) {
  const types = KG.types;
  const colors = typeColors();
  const chapters = KG.chapters;
  view.innerHTML = `<h1>Learning map</h1>
    <div class="graph-bar">
      <input type="search" id="g-search" placeholder="Find a page" list="g-names" aria-label="Focus a node">
      <datalist id="g-names">${Object.values(ents()).map((e) => `<option value="${esc(e.name)}">`).join('')}</datalist>
      <button type="button" class="linkbtn" id="g-toggle" aria-expanded="false" aria-controls="g-filters">Filters</button>
    </div>
    <div class="graph-controls" id="g-filters" hidden>
      <span class="seg" role="radiogroup" aria-label="Layout">
        <label><input type="radio" name="g-layout" value="map" checked> Map</label>
        <label><input type="radio" name="g-layout" value="net"> Network</label></span>
      <label id="g-rel-wrap"><input type="checkbox" id="g-rel"> Related links</label>
      <label>Chapter <select id="g-chapter"><option value="">All</option>${chapters.map((c) => `<option value="${esc(c.num)}">${esc(c.num)}. ${esc(c.title.slice(0, 40))}</option>`).join('')}</select></label>
      <label>Level <select id="g-level"><option value="">All</option><option value="1">Foundation</option><option value="2">Core</option><option value="3">Advanced</option></select></label>
      <label><input type="checkbox" id="g-iso" checked> Hide unconnected</label>
      <label><input type="checkbox" id="g-stub" checked> Planned pages</label>
      <fieldset aria-label="Filter by type">${types.map((t) => `<label><input type="checkbox" data-type="${t}" checked> <span class="dot" style="background:${colors[t]}"></span>${t}</label>`).join('')}</fieldset>
      <p class="small" id="g-count"></p>
    </div>
    <p class="small" id="g-help"></p>
    <div id="bigraph" role="img" aria-label="Whole knowledge graph. Use the search box or the entity pages for keyboard navigation."></div>`;
  $('#g-toggle').addEventListener('click', () => { const f = $('#g-filters'); f.hidden = !f.hidden; $('#g-toggle').setAttribute('aria-expanded', String(!f.hidden)); });
  document.title = 'Learning map | Bayesian Clinical Trials';
  let cy = null;
  let focused = null;
  const layoutMode = () => view.querySelector('input[name=g-layout]:checked').value;
  const clearFocus = () => { focused = null; if (cy) cy.elements().removeClass('hit dim chain'); };
  const setFocus = (id) => {
    if (!cy) return;
    const n = cy.getElementById(id);
    if (!n.length) return;
    focused = id;
    cy.elements().removeClass('hit dim chain');
    const chain = cy.collection().union(n);
    let frontier = n;
    while (frontier.nonempty()) { const up = frontier.incomers('edge[kind = "prerequisite"]'); const nodes = up.sources().difference(chain); chain.merge(up); chain.merge(nodes); frontier = nodes; }
    frontier = n;
    while (frontier.nonempty()) { const dn = frontier.outgoers('edge[kind = "prerequisite"]'); const nodes = dn.targets().difference(chain); chain.merge(dn); chain.merge(nodes); frontier = nodes; }
    cy.elements().not(chain).addClass('dim');
    cy.nodes('[lab]').removeClass('dim');
    chain.addClass('chain');
    n.addClass('hit');
    if (layoutMode() === 'map') {
      const r = $('#bigraph').getBoundingClientRect();
      window.scrollTo({ top: window.scrollY + r.top + n.position('y') - 220, behavior: 'smooth' });
    } else cy.animate({ fit: { eles: chain, padding: 50 }, duration: 250 });
    const nm = ents()[id].name;
    $('#g-help').textContent = `${nm}: its chain is highlighted. Click it again to open the page.`;
  };
  const draw = () => {
    const mode = layoutMode();
    const showRel = mode === 'net' || $('#g-rel').checked;
    $('#g-rel-wrap').hidden = mode === 'net';
    $('#bigraph').classList.toggle('map', mode === 'map');
    const typeOn = new Set([...document.querySelectorAll('[data-type]')].filter((x) => x.checked).map((x) => x.dataset.type));
    const chap = $('#g-chapter').value, lvl = $('#g-level').value;
    const hideIso = $('#g-iso').checked, showStub = $('#g-stub').checked;
    const ok = (e) => typeOn.has(e.type) && (showStub || !e.stub) && (!chap || (e.chapters || []).includes(chap)) && (!lvl || String(e.level) === lvl);
    const keep = new Set(Object.values(ents()).filter(ok).map((e) => e.id));
    const edges = [];
    const deg = {};
    const addEdge = (s, t, kind, rel) => { if (keep.has(s) && keep.has(t)) { edges.push({ data: { id: s + '>' + t + kind + (rel || ''), source: s, target: t, kind } }); deg[s] = (deg[s] || 0) + 1; deg[t] = (deg[t] || 0) + 1; } };
    Object.values(ents()).forEach((e) => {
      (e.prerequisites || []).forEach((p) => addEdge(p, e.id, 'prerequisite'));
      if (showRel) (e.related || []).forEach((r) => addEdge(e.id, r.to, 'related', r.rel));
    });
    const ids = [...keep].filter((id) => !hideIso || deg[id]);
    const idSet = new Set(ids);
    const dep = depths(idSet);
    const nodes = ids.map((id) => {
      const e = ents()[id];
      return { data: { id, label: e.name, color: colors[e.type], stub: e.stub ? 1 : 0, lvl: e.level || 3, depth: dep[id], size: mode === 'map' ? 14 + 3 * Math.sqrt(deg[id] || 0) : 12 + 6 * Math.sqrt(deg[id] || 0) } };
    });
    let layout;
    let mapHeight = false;
    const extra = [];
    $('#bigraph').style.height = '';
    if (mode === 'map' && nodes.length) {
      const box = $('#bigraph');
      const W = Math.max(box.clientWidth, 300);
      const dx = 112, dy = 74;
      const perRow = Math.max(3, Math.floor((W - 80) / dx));
      const layers = {};
      nodes.forEach((n) => { (layers[n.data.depth] = layers[n.data.depth] || []).push(n); });
      let y = 0;
      const pos = {};
      Object.keys(layers).map(Number).sort((a, b) => a - b).forEach((d) => {
        const row = layers[d].sort((a, b) => (chapNum(ents()[a.data.id]) - chapNum(ents()[b.data.id])) || a.data.label.localeCompare(b.data.label));
        const rows = Math.ceil(row.length / perRow);
        const per = Math.ceil(row.length / rows);
        extra.push({ data: { id: '__L' + d, label: 'Depth ' + d + (d === 0 ? ' (foundations)' : ''), lab: 1 }, position: { x: 12, y: y + 2 }, classes: 'layerlab', selectable: false, grabbable: false });
        row.forEach((n, i) => {
          const r = Math.floor(i / per), c = i % per, inRow = Math.min(per, row.length - r * per);
          // stagger alternate nodes vertically so labels do not collide
          pos[n.data.id] = { x: 70 + (c - (inRow - 1) / 2) * dx + (W - 140) / 2, y: y + r * dy + (c % 2 ? 22 : 0) + 24 };
        });
        y += rows * dy + 70;
      });
      nodes.forEach((n) => { n.position = pos[n.data.id]; });
      layout = { name: 'preset', fit: false, pan: { x: 0, y: 0 }, zoom: 1 };
      box.style.height = Math.ceil(y + 30) + 'px';
      mapHeight = true;
    } else {
      layout = nodes.length > 2 ? { name: 'cose', animate: false, nodeRepulsion: () => 14000, idealEdgeLength: () => 110, numIter: 800, padding: 20 } : { name: 'grid' };
    }
    if (cy) { cy.destroy(); cyInstances = cyInstances.filter((c) => c !== cy); }
    const style = graphStyle(false).concat(mode === 'map' ? [
      { selector: 'node[lvl >= 3]', style: { 'min-zoomed-font-size': 9 } },
      { selector: 'node[lvl < 3]', style: { 'min-zoomed-font-size': 0, 'font-size': 11 } },
      { selector: 'node.showlabel', style: { 'min-zoomed-font-size': 0, 'z-index': 99 } },
      { selector: 'node.layerlab', style: { shape: 'rectangle', width: 1, height: 1, 'background-opacity': 0, 'border-width': 0, label: 'data(label)', 'text-halign': 'right', 'text-valign': 'center', 'font-size': 13, 'font-weight': 'bold', color: cssVar('--muted'), 'text-margin-x': 0, 'text-wrap': 'none', 'min-zoomed-font-size': 0, events: 'no', 'text-background-opacity': 0 } },
      { selector: 'edge[kind = "prerequisite"]', style: { width: 1.2, opacity: .45, 'curve-style': 'straight', 'arrow-scale': .8 } },
      { selector: 'edge.dim', style: { opacity: .04 } },
    ] : []).concat([{ selector: 'node.chain', style: { 'min-zoomed-font-size': 0 } }, { selector: 'edge.chain', style: { opacity: 1, width: 2 } }]);
    cy = cytoscape({ container: $('#bigraph'), elements: [...nodes, ...extra, ...edges], style, wheelSensitivity: .3, maxZoom: 1.6, minZoom: .1, layout, ...(mode === 'map' ? { userZoomingEnabled: false, userPanningEnabled: false, autoungrabify: true, boxSelectionEnabled: false } : {}) });
    cyInstances.push(cy);
    cy.on('tap', 'node', (ev) => {
      const id = ev.target.id();
      if (ev.target.data('lab')) return;
      if (focused === id) { location.hash = '#/e/' + id; return; }
      $('#g-search').value = ents()[id].name;
      setFocus(id);
    });
    cy.on('tap', (ev) => { if (ev.target === cy) { clearFocus(); $('#g-help').textContent = helpText(); } });
    cy.on('mouseover', 'node', (ev) => { const n = ev.target; if (n.data('lab')) return; n.addClass('showlabel'); if (!focused) { cy.elements().addClass('dim'); n.closedNeighborhood().removeClass('dim'); cy.nodes('[lab]').removeClass('dim'); } });
    cy.on('mouseout', 'node', (ev) => { ev.target.removeClass('showlabel'); if (!focused) cy.elements().removeClass('dim'); });
    $('#g-count').textContent = `${nodes.length} pages shown.`;
    focused = null;
    $('#g-help').textContent = helpText();
    focusSearch();
  };
  const helpText = () => (layoutMode() === 'map'
    ? 'Foundations at the top. Click a page to highlight its chain, click again to open it.'
    : 'Click a page to highlight its chain, click again to open it.');
  const focusSearch = () => {
    if (!cy) return;
    const q = $('#g-search').value.trim().toLowerCase();
    clearFocus();
    if (!q) return;
    const hits = cy.nodes().filter((n) => !n.data('lab') && (n.data('label').toLowerCase().includes(q) || n.id().includes(q)));
    if (!hits.length) return;
    const exact = hits.filter((n) => n.data('label').toLowerCase() === q);
    if (exact.length === 1 || hits.length === 1) setFocus((exact.length === 1 ? exact : hits)[0].id());
    else { hits.addClass('hit'); if (layoutMode() !== 'map') cy.animate({ fit: { eles: hits, padding: 80 }, duration: 250 }); }
  };
  view.querySelectorAll('.graph-controls select, .graph-controls input[type=checkbox], .graph-controls input[type=radio]').forEach((x) => x.addEventListener('change', draw));
  $('#g-search').addEventListener('input', focusSearch);
  if (params.get('focus') && ents()[params.get('focus')]) $('#g-search').value = ents()[params.get('focus')].name;
  draw();
}

function topoPath(target) {
  // Prerequisites of target in order, foundations first. DFS post-order, ties by level then name.
  const order = [];
  const state = {};
  const visit = (id) => {
    if (state[id]) return;
    state[id] = 1;
    const e = ents()[id];
    if (!e) return;
    const ps = (e.prerequisites || []).filter((p) => ents()[p]).sort((a, b) => ((ents()[a].level || 9) - (ents()[b].level || 9)) || sortName(ents()[a], ents()[b]));
    ps.forEach(visit);
    order.push(id);
  };
  visit(target);
  return order;
}

function pathView(id) {
  const e = ents()[id];
  if (!e) { view.innerHTML = `<h1>Not found</h1>`; return; }
  const order = topoPath(id);
  const done = loadDone();
  view.innerHTML = `<p class="crumbs"><a href="#/">Home</a> / <a href="#/e/${esc(id)}">${esc(e.name)}</a></p>
    <h1>Study path: ${esc(e.name)}</h1>
    <p>${order.length - 1} prerequisite${order.length === 2 ? '' : 's'} first, foundations at the top, then the target. Tick each one when you are comfortable. Progress is saved in this browser.</p>
    <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-label="Progress" id="p-bar"><div></div></div>
    <p id="p-text" class="small"></p>
    <ol class="pathlist">${order.map((i) => {
      const x = ents()[i];
      return `<li data-id="${esc(i)}"><input type="checkbox" id="pc-${esc(i)}" aria-label="Done: ${esc(x.name)}">
        <div><label for="pc-${esc(i)}" class="pname">${esc(x.name)}</label> ${typeChip(x.type)}${x.stub ? ' <span class="ty">planned</span>' : ''}
        ${i === id ? ' <span class="chip">target</span>' : ''}
        <p>${esc(x.summary || '')} <a href="#/e/${esc(i)}">Open page</a>${x.home && KG.sections[x.home] ? ' ' + chipHtml(KG, x.home) : ''}</p></div></li>`;
    }).join('')}</ol>`;
  document.title = 'Study path: ' + e.name;
  const update = () => {
    const n = order.filter((i) => done.has(i)).length;
    const pct = Math.round((100 * n) / order.length);
    $('#p-bar > div').style.width = pct + '%';
    $('#p-bar').setAttribute('aria-valuenow', pct);
    $('#p-text').textContent = `${n} of ${order.length} done (${pct}%)`;
    view.querySelectorAll('.pathlist li').forEach((li) => li.classList.toggle('done', done.has(li.dataset.id)));
  };
  view.querySelectorAll('.pathlist input').forEach((cb) => {
    const i = cb.closest('li').dataset.id;
    cb.checked = done.has(i);
    cb.addEventListener('change', () => { cb.checked ? done.add(i) : done.delete(i); saveDone(done); update(); });
  });
  update();
}

// ---------- router ----------
function route() {
  destroyGraphs();
  const raw = location.hash.replace(/^#/, '') || '/';
  const [pathPart, query] = raw.split('?');
  const params = new URLSearchParams(query || '');
  const parts = pathPart.split('/').filter(Boolean);
  const nav = (k) => document.querySelectorAll('[data-sub]').forEach((a) => {
    if (a.dataset.sub === k) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  nav(!parts[0] ? 'home' : parts[0] === 'graph' ? 'graph' : '');
  const [kind, arg] = [parts[0], decodeURIComponent(parts.slice(1).join('/'))];
  document.body.classList.toggle('is-home', !kind);
  if (!kind) { homeView(); }
  else if (kind === 'e') entityView(arg);
  else if (kind === 'c') chapterView(arg);
  else if (kind === 'graph') graphView(params);
  else if (kind === 'search') searchView(params);
  else if (kind === 'ask') { location.replace('#/search' + (params.get('q') ? '?q=' + encodeURIComponent(params.get('q')) : '')); return; }
  else if (kind === 'path') pathView(arg);
  else if (kind === 'type') typeView(arg);
  else if (kind === 'formulas') formulasView();
  else { view.innerHTML = '<h1>Not found</h1><p><a href="#/">Home</a></p>'; }
  Tutor.onRoute(kind === 'e' ? arg : null);
  if (!params.get('focus')) window.scrollTo(0, 0);
  if (kind !== 'graph') view.focus({ preventScroll: true });
}

async function init() {
  try {
    const res = await fetch('data/kg.json');
    KG = await res.json();
  } catch (e) {
    view.innerHTML = '<h1>Data not found</h1><p>Run <code>python3 tools/build_site.py</code> and serve the site folder over HTTP.</p>';
    return;
  }
  INDEX = buildIndex();
  mountSearch($('#header-search'), false);
  renderFooter();
  Tutor.init(KG);
  Ask.init(KG);
  window.addEventListener('hashchange', route);
  route();
}
init();
