// Formulas in words: hover or tap a colored piece of a formula or of its sentence to light up its match.
// One delegated set of listeners; a figure is any element with class "fx" (see formulaHtml in render.js).

const KRE = /\bc[1-6]\b/;
const state = new WeakMap(); // figure -> { hover, pin }
let installed = false;

function keyOf(el) {
  if (el.dataset && el.dataset.k) return el.dataset.k;
  const m = KRE.exec(typeof el.className === 'string' ? el.className : '');
  return m ? m[0] : null;
}

function paint(fig) {
  const st = state.get(fig) || {};
  const k = st.hover || st.pin || null;
  fig.querySelectorAll('.on').forEach((n) => n.classList.remove('on'));
  const note = fig.querySelector('.fx-note');
  fig.classList.toggle('hot', !!k);
  if (!k) { note.innerHTML = ''; return; }
  fig.querySelectorAll('.term.' + k + ', .w.' + k).forEach((n) => n.classList.add('on'));
  const src = fig.querySelector('.fx-notes [data-k="' + k + '"]');
  note.innerHTML = '<span class="fx-dot ' + k + '"></span>' + (src ? src.innerHTML : '');
}

function setState(fig, patch) {
  state.set(fig, Object.assign(state.get(fig) || {}, patch));
  paint(fig);
}

function piece(target) {
  const el = target && target.closest ? target.closest('.fx .term, .fx .w') : null;
  if (!el) return null;
  const k = keyOf(el);
  return k ? { fig: el.closest('.fx'), k } : null;
}

export function installFormulas() {
  if (installed) return;
  installed = true;
  document.addEventListener('pointerover', (e) => {
    if (e.pointerType !== 'mouse') return;
    const p = piece(e.target);
    if (p) setState(p.fig, { hover: p.k });
  });
  document.addEventListener('pointerout', (e) => {
    if (e.pointerType !== 'mouse') return;
    const p = piece(e.target);
    if (p && !(e.relatedTarget && p.fig.contains(e.relatedTarget) && piece(e.relatedTarget) && piece(e.relatedTarget).k === p.k)) setState(p.fig, { hover: null });
  });
  document.addEventListener('click', (e) => {
    const p = piece(e.target);
    document.querySelectorAll('.fx.hot').forEach((fig) => {
      if (!p || fig !== p.fig) setState(fig, { hover: null, pin: null });
    });
    if (!p) return;
    const st = state.get(p.fig) || {};
    setState(p.fig, { pin: st.pin === p.k ? null : p.k, hover: e.pointerType === 'mouse' || !e.pointerType ? p.k : null });
  });
  document.addEventListener('focusin', (e) => {
    const p = piece(e.target);
    if (p) setState(p.fig, { hover: p.k });
  });
  document.addEventListener('focusout', (e) => {
    const p = piece(e.target);
    if (p) setState(p.fig, { hover: null });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const p = piece(e.target);
    if (!p) return;
    e.preventDefault();
    setState(p.fig, { pin: (state.get(p.fig) || {}).pin === p.k ? null : p.k });
  });
}

// Make the sentence phrases reachable by keyboard; call after a view's HTML is in the page.
export function enhanceFormulas(root) {
  installFormulas();
  (root || document).querySelectorAll('.fx .w').forEach((w) => { w.tabIndex = 0; });
}
