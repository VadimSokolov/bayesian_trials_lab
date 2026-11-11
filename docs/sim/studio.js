/* Copyright 2026 Nytel
 * MIT License. Permission is granted, free of charge, to any person obtaining a copy of this software to use, copy, modify, merge, publish and distribute it, provided this notice is kept. The software is provided "as is", without warranty of any kind.
 *
 * NSim.studio: the user interface of the trial simulator studio (14-studio.html). It uses only the public API of NSim.core and NSim.models, and runs simulations in sim/worker.js (or on the page thread when the browser blocks the Web Worker, for example on file:// pages). Every number on screen comes from the engine output.
 */
(function () {
  'use strict';
  var C = NSim.core, Mod = NSim.models;
  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function h(tag, a, kids) {
    var e = document.createElement(tag), k, v;
    for (k in (a || {})) {
      v = a[k]; if (v == null || v === false) continue;
      if (k === 'class') e.className = v; else if (k === 'text') e.textContent = v; else if (k === 'html') e.innerHTML = v;
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), v);
      else if (k === 'value' || k === 'checked' || k === 'disabled') e[k] = v;
      else e.setAttribute(k, v === true ? '' : v);
    }
    (kids || []).forEach(function (c) { if (c != null) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }
  function fx(v, d) { return (typeof v === 'number' && isFinite(v)) ? v.toFixed(d == null ? 3 : d) : 'n/a'; }
  function pct(v, d) { return (typeof v === 'number' && isFinite(v)) ? (100 * v).toFixed(d == null ? 1 : d) + '%' : 'n/a'; }

  /* ---------- State ---------- */
  var MODEL_LABEL = { independent: 'Independent arms', independentBeta: 'Independent beta-binomial', ndlm: 'NDLM, simple', ndlmMonotone: 'NDLM, monotone', ndlm2: 'NDLM, second order', linear: 'Linear', hierarchical: 'Hierarchical', logistic3: '3-parameter logistic', sigmoid: 'Sigmoid Emax', hierLogistic: 'Hierarchical logistic' };
  var QT = {
    postProb: { label: 'Posterior probability', cmp: '>', val: 0.975 },
    predProb: { label: 'Predictive probability of success', cmp: '>', val: 0.5 },
    condPower: { label: 'Conditional power', cmp: '>', val: 0.8 },
    pvalue: { label: 'p-value (one-sided)', cmp: '<=', val: 0.025 },
    prMax: { label: 'Pr(arm is the best)', cmp: '>', val: 0.9 },
    prED: { label: 'Pr(ED_q)', cmp: '>', val: 0.5 },
    med: { label: 'Pr(minimum effective dose)', cmp: '>', val: 0.5 },
    pAnyEffective: { label: 'Pr(any dose effective)', cmp: '>', val: 0.9 }
  };
  var GROUPS = [['is', 'Early success', 'at the looks'], ['if', 'Early futility', 'at the looks'], ['fs', 'Final success', 'at the final analysis'], ['ff', 'Final futility', 'at the final analysis']];
  function arm(name, dose, ctrl, act) { return { name: name, dose: dose, isControl: !!ctrl, isActive: !!act }; }
  function cond(type, v) { var q = QT[type]; return { type: type, delta: 0, vs: 'control', alpha: 0.025, adjust: 'none', q: 0.9, cmp: q.cmp, value: v == null ? q.val : v, agg: 'any' }; }
  function group(on, op, conds) { return { on: !!on, op: op || 'and', conds: conds || [] }; }
  function blank() {
    return {
      v: 1, name: 'Custom design',
      study: { endpoint: 'dichotomous', higherIsBetter: true, sigma: 1, maxN: 200, visitWeek: 12, arms: [arm('Control', 0, true), arm('Dose 1', 1)] },
      accrual: { regions: [{ peakPerWeek: 10, startWeek: 0, rampUpWeeks: 0, rampDownWeeks: 0 }] },
      dropout: [0, 0],
      scenarios: [{ name: 'Null', truth: [0.3, 0.3], sd: 1 }, { name: 'Effective', truth: [0.3, 0.45], sd: 1 }],
      model: { type: 'independentBeta' },
      allocation: { type: 'fixed', ratio: [1, 1], burnIn: 50, qoi: 'prMax', weight: 'probability', gamma: 1, controlShare: 'ratio', controlFixed: 0.25, minShare: 0.05, drop: { on: false, delta: 0, cmp: '<', value: 0.05, minInterim: 1, maxDropped: 2 } },
      interims: { trigger: 'enrolled', at: [], followUp: 'continue', from: 1 },
      rules: { is: group(false, 'and', [cond('postProb', 0.99)]), if: group(false, 'and', [cond('predProb', 0.05)]), fs: group(true, 'and', [cond('postProb', 0.975)]), ff: group(false, 'and', [cond('postProb', 0.2)]) },
      benchmark: { on: false, K: 4, spending: 'ldobf', alpha: 0.025, arm: -1 },
      sim: { nSims: 1000, seed: 20260801, nDraws: 500 }
    };
  }
  var _b0 = blank; blank = function () { var b = _b0(); b.rules.if.conds[0].cmp = '<'; b.rules.ff.conds[0].cmp = '<'; return b; };
  var S = blank(), R = null, view = [], stale = false, pinned = null, exploreVals = {};

  /* ---------- Scenario presets ---------- */
  var PRESETS = [['null', 'Null (no effect)'], ['linear', 'Linear'], ['emax', 'Emax-shaped'], ['plateau', 'Plateau'], ['peak', 'Peak in the middle']];
  function shape(kind, u) {
    switch (kind) { case 'null': return 0; case 'linear': return u; case 'emax': return u / (u + 0.3); case 'plateau': return Math.min(1, u / 0.5); case 'peak': return Math.sin(Math.PI * u) + 0.2 * u; }
    return 0;
  }
  function presetTruth(s, kind, c, e) {
    var arms = s.study.arms, doses = arms.filter(function (a) { return !a.isControl && !a.isActive; }).map(function (a) { return a.dose; }), mx = Math.max.apply(null, doses.concat([1e-9]));
    var sh = arms.map(function (a) { return (a.isControl || a.isActive) ? 0 : shape(kind, a.dose / mx); }), top = Math.max.apply(null, sh.concat([1e-9]));
    return arms.map(function (a, k) { var v = a.isControl ? c : (a.isActive ? c + e : c + (kind === 'null' ? 0 : e) * sh[k] / top); return Math.round(v * 1000) / 1000; });
  }
  function addScn(s, kind, name, c, e) { s.scenarios.push({ name: name, truth: presetTruth(s, kind, c, e), sd: s.study.sigma }); }

  /* ---------- Examples ---------- */
  function exTwoArm() {
    var s = blank(); s.name = 'Two-arm trial with 4 looks'; s.study.maxN = 300; s.dropout = [0.05, 0.05];
    s.scenarios = [{ name: 'Null: 30% vs 30%', truth: [0.3, 0.3], sd: 1 }, { name: 'Alternative: 30% vs 45%', truth: [0.3, 0.45], sd: 1 }];
    s.interims = { trigger: 'enrolled', at: [75, 150, 225], followUp: 'continue', from: 1 };
    s.rules.is = group(true, 'and', [cond('postProb', 0.99)]); s.rules.if = group(true, 'and', [cond('predProb', 0.05)]); s.rules.fs = group(true, 'and', [cond('postProb', 0.975)]);
    s.rules.if.conds[0].cmp = '<'; s.rules.ff.conds[0].cmp = '<';
    s.benchmark = { on: true, K: 4, spending: 'ldobf', alpha: 0.025, arm: -1 };
    return s;
  }
  function exDose(fixed) {
    var s = blank(); s.name = fixed ? 'Same design, fixed allocation' : 'Phase 2 dose finding, 5 doses, adaptive';
    s.study.maxN = 400; s.study.arms = [arm('Placebo', 0, true)]; [20, 40, 60, 80, 100].forEach(function (d, i) { s.study.arms.push(arm('Dose ' + (i + 1) + ' (' + d + ')', d)); });
    s.dropout = [0.05, 0.05, 0.05, 0.05, 0.05, 0.05]; s.accrual.regions[0].peakPerWeek = 15;
    s.scenarios = []; addScn(s, 'null', 'Null', 0.25, 0); addScn(s, 'emax', 'Emax-shaped, +25 points', 0.25, 0.25); addScn(s, 'peak', 'Peak in the middle, +25 points', 0.25, 0.25);
    s.model = { type: 'ndlm' };
    s.interims = { trigger: 'enrolled', at: [100, 150, 200, 250, 300, 350], followUp: 'continue', from: 1 };
    s.allocation.ratio = [1, 1, 1, 1, 1, 1];
    if (!fixed) { s.allocation.type = 'adaptive'; s.allocation.burnIn = 100; s.allocation.controlShare = 'fixed'; s.allocation.controlFixed = 0.2; s.allocation.drop = { on: true, delta: 0, cmp: '<', value: 0.05, minInterim: 2, maxDropped: 3 }; }
    s.rules.is = group(true, 'and', [cond('postProb', 0.995)]);
    var f = cond('postProb', 0.1); f.delta = 0.1; f.cmp = '<'; s.rules.if = group(true, 'and', [f]);
    s.rules.fs = group(true, 'and', [cond('postProb', 0.975)]);
    var ff = cond('postProb', 0.2); ff.delta = 0.1; ff.cmp = '<'; s.rules.ff = group(true, 'and', [ff]);
    return s;
  }
  var EXAMPLES = [['Two-arm trial with 4 looks', function () { return exTwoArm(); }], ['Phase 2 dose finding, 5 doses, adaptive', function () { return exDose(false); }], ['Same design, fixed allocation', function () { return exDose(true); }]];

  /* ---------- Build the engine design from the UI state ---------- */
  // Predictive probability predicts the final success rule that is set on the page. Only a single final posterior-probability or p-value condition under an independent-arms model can be predicted; anything else is rejected.
  function predSpec(s) {
    var g = s.rules.fs, md = s.model, dich = s.study.endpoint === 'dichotomous', c = g && g.on && g.conds.length === 1 ? g.conds[0] : null;
    var why = 'Predictive probability predicts the final success rule, so the final success rule must be on and have exactly one condition';
    if (!c) throw new Error(why + '.');
    if (dich ? md.type !== 'independentBeta' : md.type !== 'independent') throw new Error('Predictive probability supports only the ' + (dich ? 'independent beta-binomial' : 'independent arms') + ' model. Choose it on the Design tab, or remove the predictive probability condition.');
    var up = c.cmp === '>' || c.cmp === '>=';
    if (c.type === 'postProb' && c.vs !== 'absolute' && up) return dich ? { kind: 'bayes', threshold: c.value, delta: c.delta || 0, a0: md.betaA == null ? 1 : md.betaA, b0: md.betaB == null ? 1 : md.betaB } : { kind: 'bayes', threshold: c.value, delta: c.delta || 0 };
    if (c.type === 'pvalue' && c.adjust === 'none' && !up) return { kind: 'z', alpha: c.value };
    throw new Error('Predictive probability can predict a final success rule that is one posterior probability (better than control, ">") or one unadjusted p-value ("<="). Change the final success rule.');
  }
  function qoiSpec(c, s) {
    switch (c.type) {
      case 'postProb': return c.vs === 'absolute' ? { type: 'postProb', delta: c.delta, vs: 'absolute' } : { type: 'postProb', delta: c.delta };
      case 'predProb': return { type: 'predProb', delta: c.delta, success: predSpec(s) };
      case 'condPower': return { type: 'condPower', alpha: c.alpha };
      case 'pvalue': return c.adjust === 'none' ? { type: 'pvalue' } : { type: 'pvalue', adjust: c.adjust };
      case 'prED': return { type: 'prED', q: c.q };
      case 'med': case 'pAnyEffective': return { type: c.type, delta: c.delta };
      default: return { type: c.type };
    }
  }
  function qoiLabel(c) {
    var d = c.delta ? ' + ' + c.delta : '';
    switch (c.type) {
      case 'postProb': return c.vs === 'absolute' ? 'Pr(effect > ' + c.delta + ')' : 'Pr(better than control' + d + ')';
      case 'predProb': return 'Pred. prob. success';
      case 'condPower': return 'Cond. power';
      case 'pvalue': return 'p-value' + (c.adjust !== 'none' ? ' (' + c.adjust + ')' : '');
      case 'prMax': return 'Pr(best)';
      case 'prED': return 'Pr(ED' + Math.round(c.q * 100) + ')';
      case 'med': return 'Pr(MED)';
      default: return 'Pr(any effective)';
    }
  }
  // "Any arm" needs one arm to pass: the largest value for a rule of the form "> x", the smallest for "< x". "Every arm" needs all arms to pass: the reverse. So the same words work for probabilities and p-values.
  function engineAgg(c) {
    if (c.agg === 'best') return 'best';
    var every = c.agg === 'every' || c.agg === 'min', upper = c.cmp === '>' || c.cmp === '>=';
    return (every ? !upper : upper) ? 'max' : 'min';
  }
  function buildDesign(s) {
    var st = s.study, K = st.arms.length, qois = [], qmap = {}, meta = { labels: {}, groups: [] }, i;
    if (!st.arms[0] || !st.arms[0].isControl) throw new Error('The first arm must be the control.');
    if (K < 2) throw new Error('Add at least one dose or arm.');
    if (!(st.maxN >= 2 * K)) throw new Error('Maximum sample size must be at least ' + (2 * K) + '.');
    function qid(c) {
      var sp = qoiSpec(c, s), key = JSON.stringify(sp);
      if (!(key in qmap)) { var id = 'q' + (qois.length + 1); qmap[key] = id; qois.push(Object.assign({ id: id }, sp)); meta.labels[id] = qoiLabel(c); }
      return qmap[key];
    }
    var al = s.allocation, A = { type: al.type, ratio: al.ratio.slice() };
    if (A.ratio.every(function (r) { return !(r > 0); })) throw new Error('Allocation ratios cannot all be zero.');
    if (al.type === 'adaptive') {
      A.burnIn = al.burnIn; A.qoi = 'alloc'; A.gamma = al.gamma; A.weight = al.weight; A.minShare = al.minShare;
      A.controlShare = al.controlShare === 'fixed' ? al.controlFixed : (al.controlShare === 'matchBest' ? 'matchBest' : undefined);
      qois.push(al.qoi === 'prMax' ? { id: 'alloc', type: 'prMax' } : { id: 'alloc', type: 'postProb', delta: 0 });
    }
    if (al.drop.on) { A.drop = { qoi: 'drop', cmp: al.drop.cmp, value: al.drop.value, minInterim: al.drop.minInterim, maxDropped: al.drop.maxDropped }; qois.push({ id: 'drop', type: 'postProb', delta: al.drop.delta }); }
    var rules = { interim: [], final: {} };
    function grp(g) { if (!g.on || !g.conds.length) return null; return { op: g.op, conds: g.conds.map(function (c) { return { qoi: qid(c), cmp: c.cmp, value: c.value, agg: engineAgg(c) }; }) }; }
    var gs = {}; GROUPS.forEach(function (g) { gs[g[0]] = grp(s.rules[g[0]]); });
    if (gs.is || gs.if) rules.interim = [{ from: s.interims.from || 1, success: gs.is || undefined, futility: gs.if || undefined }];
    if (gs.fs) rules.final.success = gs.fs;
    if (gs.ff) rules.final.futility = gs.ff;
    var md = s.model, model = { type: md.type }, pr = {}, tau = {};
    if (md.priorMean != null) pr.mean = md.priorMean; if (md.priorSd != null) pr.sd = md.priorSd; if (md.betaA != null) pr.a = md.betaA; if (md.betaB != null) pr.b = md.betaB;
    if (Object.keys(pr).length) model.prior = pr;
    if (md.tauCenter != null) tau.center = md.tauCenter; if (md.tauWeight != null) tau.weight = md.tauWeight;
    if (Object.keys(tau).length) model.tau = tau;
    if (md.direction === 'decreasing') model.direction = 'decreasing';
    if (md.ed50Mean != null || md.ed50Sd != null) model.ed50 = { mean: md.ed50Mean == null ? undefined : md.ed50Mean, sd: md.ed50Sd == null ? undefined : md.ed50Sd };
    var at = (s.interims.at || []).filter(function (x) { return x >= 1 && x < st.maxN; }).sort(function (a, b) { return a - b; });
    var d = {
      study: { endpoint: st.endpoint, higherIsBetter: st.higherIsBetter, maxN: st.maxN, arms: st.arms.map(function (a) { return { name: a.name, dose: a.dose, isControl: a.isControl }; }) },
      accrual: { regions: clone(s.accrual.regions) }, dropout: { perArm: s.dropout.slice() }, visitWeeks: [st.visitWeek], model: model, allocation: A,
      interims: { trigger: s.interims.trigger, at: at, followUp: s.interims.followUp }, qois: qois, rules: rules, simulation: { nDraws: s.sim.nDraws }
    };
    if (st.endpoint === 'continuous') d.study.sigma = st.sigma;
    var scns = s.scenarios.map(function (sc) {
      if (sc.truth.length !== K) throw new Error('Scenario "' + sc.name + '" needs one value per arm.');
      sc.truth.forEach(function (v) { if (!(typeof v === 'number' && isFinite(v))) throw new Error('Scenario "' + sc.name + '" has an empty value.'); if (st.endpoint === 'dichotomous' && (v < 0 || v > 1)) throw new Error('Response rates must be between 0 and 1 (scenario "' + sc.name + '").'); });
      return st.endpoint === 'continuous' ? { name: sc.name, truth: sc.truth.slice(), sd: sc.sd } : { name: sc.name, truth: sc.truth.slice() };
    });
    if (!scns.length) throw new Error('Add at least one scenario.');
    return { design: d, scenarios: scns, meta: meta };
  }

  /* ---------- Small form helpers ---------- */
  function touch() { stale = true; var n = $('staleNote'); if (n) n.classList.toggle('hide', !R); }
  function numIn(get, set, o) {
    o = o || {};
    var e = h('input', { type: 'number', step: o.step || 'any', min: o.min, max: o.max, 'aria-label': o.label, placeholder: o.ph });
    var v = get(); e.value = v == null ? '' : v;
    e.addEventListener('input', function () { var x = e.value === '' ? null : parseFloat(e.value); set(x == null || isNaN(x) ? null : x); touch(); if (o.after) o.after(); });
    return e;
  }
  function selIn(opts, get, set, o) {
    o = o || {};
    var e = h('select', { 'aria-label': o.label }, opts.map(function (p) { return h('option', { value: p[0], text: p[1] }); }));
    e.value = String(get());
    e.addEventListener('change', function () { var v = e.value; if (o.num) v = parseFloat(v); if (o.bool) v = v === 'true'; set(v); touch(); if (o.rerender) o.rerender(); });
    return e;
  }
  function chkIn(get, set, label, o) {
    var e = h('input', { type: 'checkbox', checked: !!get(), 'aria-label': label });
    e.addEventListener('change', function () { set(e.checked); touch(); if (o && o.rerender) o.rerender(); });
    return h('label', { class: 'inl' }, [e, label]);
  }
  function fld(label, ctl) { return h('label', { class: 'fld' }, [h('span', { text: label }), ctl]); }
  function nextBtn(tab, text) { return h('div', { class: 'actions' }, [h('button', { class: 'btn primary', type: 'button', onclick: function () { showTab(tab, true); }, text: text })]); }
  function isDich() { return S.study.endpoint === 'dichotomous'; }
  function nonCtrl() { return S.study.arms.map(function (a, k) { return k; }).filter(function (k) { return !S.study.arms[k].isControl; }); }

  /* ---------- Tabs ---------- */
  var TABS = ['study', 'scn', 'design', 'sim', 'res', 'save'];
  function showTab(id, focus) {
    TABS.forEach(function (t) {
      var on = t === id, b = $('tab-' + t);
      b.setAttribute('aria-selected', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1; $('panel-' + t).hidden = !on;
    });
    if (id === 'res') renderResults();
    if (id === 'save') renderSave();
    if (focus) { $('tab-' + id).focus(); $('tab-' + id).scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
  }
  function initTabs() {
    TABS.forEach(function (t, i) {
      var b = $('tab-' + t);
      b.addEventListener('click', function () { showTab(t); });
      b.addEventListener('keydown', function (e) {
        var j = null;
        if (e.key === 'ArrowRight') j = (i + 1) % TABS.length; else if (e.key === 'ArrowLeft') j = (i + TABS.length - 1) % TABS.length; else if (e.key === 'Home') j = 0; else if (e.key === 'End') j = TABS.length - 1;
        if (j != null) { e.preventDefault(); showTab(TABS[j], true); }
      });
    });
  }

  /* ---------- 1. Study ---------- */
  function resizeArms() {
    var K = S.study.arms.length;
    S.dropout = S.dropout.slice(0, K); while (S.dropout.length < K) S.dropout.push(0);
    S.allocation.ratio = S.allocation.ratio.slice(0, K); while (S.allocation.ratio.length < K) S.allocation.ratio.push(1);
    S.scenarios.forEach(function (sc) { sc.truth = sc.truth.slice(0, K); while (sc.truth.length < K) sc.truth.push(sc.truth[0] == null ? 0 : sc.truth[0]); });
  }
  function removeArm(k) {
    S.study.arms.splice(k, 1); S.dropout.splice(k, 1); S.allocation.ratio.splice(k, 1); S.scenarios.forEach(function (sc) { sc.truth.splice(k, 1); });
    S.benchmark.arm = -1; touch(); renderStudy(); renderScn(); renderDesign();
  }
  function renderStudy() {
    var p = $('panel-study'), st = S.study; p.innerHTML = '';
    p.appendChild(h('h2', { text: 'Study' }));
    p.appendChild(h('p', { class: 'note', text: 'Describe the endpoint, the arms and how patients arrive. Defaults are small so you can run a first simulation in seconds.' }));
    var ep = h('div', { class: 'card' }, [h('h3', { text: 'Endpoint and size' }), h('div', { class: 'grid2' }, [
      fld('Endpoint', selIn([['dichotomous', 'Dichotomous (responder or not)'], ['continuous', 'Continuous (mean)']], function () { return st.endpoint; }, function (v) {
        st.endpoint = v;
        if (v === 'continuous') { if (S.model.type === 'independentBeta') S.model.type = 'independent'; S.scenarios.forEach(function (sc) { sc.truth = sc.truth.map(function (x, k) { return Math.round((k === 0 ? 0 : 0.5 * st.sigma * shape('linear', k / Math.max(1, sc.truth.length - 1))) * 1000) / 1000; }); sc.sd = st.sigma; }); }
        else { if (S.model.type === 'independent') S.model.type = 'independentBeta'; S.scenarios.forEach(function (sc) { sc.truth = sc.truth.map(function (x, k) { return k === 0 ? 0.3 : Math.min(0.9, 0.3 + 0.15 * k / Math.max(1, sc.truth.length - 1)); }); }); }
      }, { label: 'Endpoint', rerender: function () { renderStudy(); renderScn(); renderDesign(); } })),
      fld('Higher is better', selIn([['true', 'Yes'], ['false', 'No (lower is better)']], function () { return String(st.higherIsBetter); }, function (v) { st.higherIsBetter = v; }, { bool: true, label: 'Higher is better' })),
      st.endpoint === 'continuous' ? fld('SD of the outcome (planning value)', numIn(function () { return st.sigma; }, function (v) { st.sigma = v || 1; }, { min: 0.0001, label: 'SD' })) : null,
      fld('Maximum sample size', numIn(function () { return st.maxN; }, function (v) { st.maxN = v; }, { min: 2, step: 1, label: 'Maximum sample size' })),
      fld('Final visit (weeks after randomization)', numIn(function () { return st.visitWeek; }, function (v) { st.visitWeek = v || 1; }, { min: 0.1, label: 'Final visit week' }))
    ])]);
    p.appendChild(ep);
    var tb = h('table', { class: 'st' }), th = h('thead', null, [h('tr', null, ['Arm', 'Dose strength', 'Role', 'Dropout %', ''].map(function (t) { return h('th', { text: t }); }))]);
    tb.appendChild(th); var body = h('tbody');
    st.arms.forEach(function (a, k) {
      var tr = h('tr');
      tr.appendChild(h('td', null, [h('input', { type: 'text', value: a.name, 'aria-label': 'Name of arm ' + (k + 1), oninput: function (e) { a.name = e.target.value; touch(); } })]));
      tr.appendChild(h('td', null, [a.isControl ? h('span', { text: '0' }) : numIn(function () { return a.dose; }, function (v) { a.dose = v == null ? 0 : v; }, { label: 'Dose of ' + a.name })]));
      tr.appendChild(h('td', { text: a.isControl ? 'Control' : (a.isActive ? 'Active comparator' : 'Dose') }));
      tr.appendChild(h('td', null, [numIn(function () { return Math.round(S.dropout[k] * 1000) / 10; }, function (v) { S.dropout[k] = Math.min(0.99, Math.max(0, (v || 0) / 100)); }, { min: 0, max: 99, label: 'Dropout percent, ' + a.name })]));
      tr.appendChild(h('td', null, [a.isControl ? null : h('button', { class: 'btn sm danger', type: 'button', text: 'Remove', 'aria-label': 'Remove arm ' + a.name, onclick: function () { removeArm(k); } })]));
      body.appendChild(tr);
    });
    tb.appendChild(body);
    var nDose = st.arms.filter(function (a) { return !a.isControl && !a.isActive; }).length, hasAct = st.arms.some(function (a) { return a.isActive; });
    p.appendChild(h('div', { class: 'card' }, [h('h3', { text: 'Arms (control plus up to 8)' }), tb,
      h('div', { class: 'actions' }, [
        h('button', { class: 'btn sm', type: 'button', disabled: st.arms.length >= 9, text: 'Add dose', onclick: function () { var mx = Math.max.apply(null, st.arms.filter(function (a) { return !a.isActive; }).map(function (a) { return a.dose; })); st.arms.push(arm('Dose ' + (nDose + 1), mx + (mx > 0 ? mx / Math.max(1, nDose) : 1))); resizeArms(); touch(); renderStudy(); renderScn(); renderDesign(); } }),
        h('button', { class: 'btn sm', type: 'button', disabled: hasAct || st.arms.length >= 9, text: 'Add active comparator', onclick: function () { st.arms.push(arm('Active comparator', 0, false, true)); resizeArms(); touch(); renderStudy(); renderScn(); renderDesign(); } })]),
      h('p', { class: 'note', text: 'An active comparator is modelled as one more arm. Choose the independent model to keep it apart from the dose-response curve.' })]));
    var rt = h('table', { class: 'st' }); rt.appendChild(h('thead', null, [h('tr', null, ['Region', 'Peak rate (per week)', 'Start (week)', 'Ramp up (weeks)', 'Ramp down (weeks)', ''].map(function (t) { return h('th', { text: t }); }))]));
    var rb = h('tbody');
    S.accrual.regions.forEach(function (r, k) {
      rb.appendChild(h('tr', null, [h('td', { text: String(k + 1) })].concat(['peakPerWeek', 'startWeek', 'rampUpWeeks', 'rampDownWeeks'].map(function (f, j) {
        return h('td', null, [numIn(function () { return r[f]; }, function (v) { r[f] = v == null ? 0 : v; }, { min: 0, label: ['Peak rate', 'Start week', 'Ramp up weeks', 'Ramp down weeks'][j] + ', region ' + (k + 1) })]);
      })).concat([h('td', null, [S.accrual.regions.length > 1 ? h('button', { class: 'btn sm danger', type: 'button', text: 'Remove', 'aria-label': 'Remove region ' + (k + 1), onclick: function () { S.accrual.regions.splice(k, 1); touch(); renderStudy(); } }) : null])])));
    });
    rt.appendChild(rb);
    p.appendChild(h('div', { class: 'card' }, [h('h3', { text: 'Accrual regions' }), rt,
      h('div', { class: 'actions' }, [h('button', { class: 'btn sm', type: 'button', text: 'Add region', onclick: function () { S.accrual.regions.push({ peakPerWeek: 5, startWeek: 4, rampUpWeeks: 0, rampDownWeeks: 0 }); touch(); renderStudy(); } })]),
      h('p', { class: 'note', text: 'Patients arrive as a Poisson process with the summed rate of all regions. The results show the mean accrual time.' })]));
    p.appendChild(nextBtn('scn', 'Next: Scenarios'));
  }

  /* ---------- 2. Scenarios ---------- */
  var presetCfg = { kind: 'linear', c: null, e: null };
  function miniPlot(sc) {
    var arms = S.study.arms, W = 220, H = 120, L = 30, B = 22, T = 8, Rm = 8, pts = [], act = null, i;
    arms.forEach(function (a, k) { var pt = { x: a.isControl ? 0 : a.dose, y: sc.truth[k], k: k }; if (a.isActive) act = pt; else pts.push(pt); });
    pts.sort(function (a, b) { return a.x - b.x; });
    var all = pts.concat(act ? [act] : []), ys = all.map(function (p) { return p.y; }).filter(isFinite), lo = Math.min.apply(null, ys.concat([isDich() ? 0 : Infinity])), hi = Math.max.apply(null, ys.concat([isDich() ? 0.6 : -Infinity]));
    if (!isFinite(lo)) { lo = 0; hi = 1; } if (hi - lo < 1e-9) { hi = lo + 1; }
    var xs = pts.map(function (p) { return p.x; }), xmax = Math.max.apply(null, xs.concat([1e-9]));
    function X(x) { return L + (W - L - Rm) * x / xmax; } function Y(y) { return H - B - (H - B - T) * (y - lo) / (hi - lo); }
    var s = '<svg class="plot mini" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="True curve of scenario ' + esc(sc.name) + '"><line class="axis" x1="' + L + '" y1="' + (H - B) + '" x2="' + (W - Rm) + '" y2="' + (H - B) + '"/><line class="axis" x1="' + L + '" y1="' + T + '" x2="' + L + '" y2="' + (H - B) + '"/>';
    s += '<text x="' + (L - 4) + '" y="' + (Y(lo) + 4) + '" text-anchor="end">' + fx(lo, 2) + '</text><text x="' + (L - 4) + '" y="' + (Y(hi) + 4) + '" text-anchor="end">' + fx(hi, 2) + '</text>';
    s += '<text x="' + L + '" y="' + (H - 6) + '">0</text><text x="' + (W - Rm) + '" y="' + (H - 6) + '" text-anchor="end">' + fx(xmax, 3).replace(/\.?0+$/, '') + '</text>';
    s += '<polyline fill="none" stroke="#2D8B8B" stroke-width="2" points="' + pts.map(function (p) { return X(p.x).toFixed(1) + ',' + Y(p.y).toFixed(1); }).join(' ') + '"/>';
    pts.forEach(function (p) { s += '<circle cx="' + X(p.x).toFixed(1) + '" cy="' + Y(p.y).toFixed(1) + '" r="3.5" fill="' + (p.k === 0 ? '#E07A3F' : '#2D8B8B') + '"/>'; });
    if (act) s += '<rect x="' + (W - Rm - 10) + '" y="' + (Y(act.y) - 4) + '" width="8" height="8" fill="#0A1628"/>';
    return s + '</svg>';
  }
  function renderScnPlots() {
    var box = $('scnplots'); if (!box) return; box.innerHTML = '';
    S.scenarios.forEach(function (sc) { box.appendChild(h('div', { class: 'plotbox' }, [h('h4', { text: sc.name }), h('div', { html: miniPlot(sc) })])); });
  }
  function renderScn() {
    var p = $('panel-scn'), arms = S.study.arms, dich = isDich(); p.innerHTML = '';
    p.appendChild(h('h2', { text: 'Scenarios' }));
    p.appendChild(h('p', { class: 'note', text: dich ? 'Each row is a possible truth: the true response rate in every arm. Include a null row to read the type I error.' : 'Each row is a possible truth: the true mean in every arm and the SD. Include a null row to read the type I error.' }));
    var tb = h('table', { class: 'st' });
    tb.appendChild(h('thead', null, [h('tr', null, [h('th', { text: 'Scenario' })].concat(arms.map(function (a) { return h('th', { text: a.name + (dich ? ' rate' : ' mean') }); })).concat(dich ? [] : [h('th', { text: 'SD' })]).concat([h('th', { text: '' })]))]));
    var body = h('tbody');
    S.scenarios.forEach(function (sc, i) {
      var tr = h('tr');
      tr.appendChild(h('td', null, [h('input', { type: 'text', value: sc.name, 'aria-label': 'Scenario name ' + (i + 1), oninput: function (e) { sc.name = e.target.value; touch(); renderScnPlots(); } })]));
      arms.forEach(function (a, k) { tr.appendChild(h('td', null, [numIn(function () { return sc.truth[k]; }, function (v) { sc.truth[k] = v; }, { step: dich ? 0.01 : 0.05, min: dich ? 0 : null, max: dich ? 1 : null, label: sc.name + ', ' + a.name, after: renderScnPlots })])); });
      if (!dich) tr.appendChild(h('td', null, [numIn(function () { return sc.sd; }, function (v) { sc.sd = v || 1; }, { min: 0.0001, label: 'SD, ' + sc.name })]));
      tr.appendChild(h('td', null, [
        h('button', { class: 'btn sm', type: 'button', text: 'Duplicate', 'aria-label': 'Duplicate ' + sc.name, onclick: function () { var c = clone(sc); c.name += ' copy'; S.scenarios.splice(i + 1, 0, c); touch(); renderScn(); } }), ' ',
        h('button', { class: 'btn sm danger', type: 'button', text: 'Remove', 'aria-label': 'Remove ' + sc.name, disabled: S.scenarios.length < 2, onclick: function () { S.scenarios.splice(i, 1); touch(); renderScn(); } })]));
      body.appendChild(tr);
    });
    tb.appendChild(body); p.appendChild(h('div', { class: 'card' }, [tb]));
    if (presetCfg.c == null) { presetCfg.c = dich ? 0.3 : 0; presetCfg.e = dich ? 0.15 : 0.5 * S.study.sigma; }
    p.appendChild(h('div', { class: 'card' }, [h('h3', { text: 'Add a scenario from a preset' }), h('div', { class: 'inl' }, [
      selIn(PRESETS, function () { return presetCfg.kind; }, function (v) { presetCfg.kind = v; }, { label: 'Preset shape' }),
      h('label', { class: 'inl' }, [dich ? 'Control rate' : 'Control mean', numIn(function () { return presetCfg.c; }, function (v) { presetCfg.c = v == null ? 0 : v; }, { step: dich ? 0.01 : 0.1, label: 'Preset control value' })]),
      h('label', { class: 'inl' }, ['Largest effect', numIn(function () { return presetCfg.e; }, function (v) { presetCfg.e = v == null ? 0 : v; }, { step: dich ? 0.01 : 0.1, label: 'Preset largest effect' })]),
      h('button', { class: 'btn', type: 'button', text: 'Add scenario', onclick: function () { var nm = PRESETS.filter(function (q) { return q[0] === presetCfg.kind; })[0][1]; addScn(S, presetCfg.kind, nm + ', control ' + presetCfg.c + (presetCfg.kind === 'null' ? '' : ', effect ' + presetCfg.e), presetCfg.c, presetCfg.e); touch(); renderScn(); } })]),
      h('p', { class: 'note', text: 'Shapes follow the dose strengths on the Study tab. An active comparator gets control plus the largest effect.' })]));
    p.appendChild(h('h3', { text: 'True curve of each scenario' }));
    p.appendChild(h('div', { class: 'scnplots', id: 'scnplots' })); renderScnPlots();
    p.appendChild(nextBtn('design', 'Next: Design'));
  }

  /* ---------- 3. Design ---------- */
  function engineDefaults() {
    try { var b = buildDesign(S); return Mod.prepare(b.design); } catch (e) { return null; }
  }
  function renderRule(key, title, when) {
    var g = S.rules[key], box = h('div', { class: 'rule' + (key[1] === 'f' || key === 'if' ? ' fut' : '') });
    function re() { renderDesign(); }
    box.appendChild(h('h4', null, [chkIn(function () { return g.on; }, function (v) { g.on = v; }, title + ' ' + when, { rerender: re })]));
    if (!g.on) return box;
    if (key[0] === 'i' && !(S.interims.at.length)) box.appendChild(h('p', { class: 'note', text: 'No looks are set, so this rule is not used.' }));
    box.appendChild(h('div', { class: 'inl' }, ['Declare when', selIn([['and', 'all of'], ['or', 'any of']], function () { return g.op; }, function (v) { g.op = v; }, { label: title + ' combine' }), 'of these hold:']));
    g.conds.forEach(function (c, i) {
      var row = h('div', { class: 'cond' });
      row.appendChild(selIn(Object.keys(QT).map(function (t) { return [t, QT[t].label]; }), function () { return c.type; }, function (v) { c.type = v; c.cmp = QT[v].cmp; c.value = QT[v].val; }, { label: title + ' quantity ' + (i + 1), rerender: re }));
      if (c.type === 'postProb') { row.appendChild(selIn([['control', 'better than control by'], ['absolute', 'above']], function () { return c.vs; }, function (v) { c.vs = v; }, { label: 'Comparison' })); row.appendChild(numIn(function () { return c.delta; }, function (v) { c.delta = v || 0; }, { step: 0.01, label: 'Margin delta' })); }
      if (c.type === 'predProb' || c.type === 'med' || c.type === 'pAnyEffective') row.appendChild(h('label', { class: 'inl' }, ['margin', numIn(function () { return c.delta; }, function (v) { c.delta = v || 0; }, { step: 0.01, label: 'Margin' })]));
      if (c.type === 'condPower') row.appendChild(h('label', { class: 'inl' }, ['alpha', numIn(function () { return c.alpha; }, function (v) { c.alpha = v || 0.025; }, { step: 0.005, min: 0.0001, max: 0.5, label: 'One-sided alpha' })]));
      if (c.type === 'pvalue') row.appendChild(selIn([['none', 'unadjusted'], ['bonferroni', 'Bonferroni'], ['dunnett', 'Dunnett']], function () { return c.adjust; }, function (v) { c.adjust = v; }, { label: 'Adjustment' }));
      if (c.type === 'prED') row.appendChild(h('label', { class: 'inl' }, ['q', numIn(function () { return c.q; }, function (v) { c.q = v || 0.9; }, { step: 0.05, min: 0.01, max: 1, label: 'ED q' })]));
      row.appendChild(selIn([['>', '>'], ['>=', '>='], ['<', '<'], ['<=', '<=']], function () { return c.cmp; }, function (v) { c.cmp = v; }, { label: 'Comparison sign' }));
      row.appendChild(numIn(function () { return c.value; }, function (v) { c.value = v == null ? 0 : v; }, { step: 0.005, label: title + ' threshold ' + (i + 1) }));
      row.appendChild(selIn([['any', 'for any arm (one is enough)'], ['every', 'for every arm'], ['best', 'for the arm with the best estimate']], function () { return c.agg === 'max' ? 'any' : (c.agg === 'min' ? 'every' : c.agg); }, function (v) { c.agg = v; }, { label: 'Which arm' }));
      if (g.conds.length > 1) row.appendChild(h('button', { class: 'btn sm danger', type: 'button', text: 'Remove', 'aria-label': 'Remove condition ' + (i + 1) + ' of ' + title, onclick: function () { g.conds.splice(i, 1); touch(); re(); } }));
      box.appendChild(row);
    });
    box.appendChild(h('button', { class: 'btn sm', type: 'button', text: 'Add condition', onclick: function () { g.conds.push(cond('postProb')); touch(); re(); } }));
    return box;
  }
  function renderDesign() {
    var p = $('panel-design'), st = S.study, md = S.model, al = S.allocation, K = st.arms.length, dich = isDich(); p.innerHTML = '';
    p.appendChild(h('h2', { text: 'Design' }));
    /* model */
    var types = Mod.types.filter(function (t) { return dich || t !== 'independentBeta'; });
    var def = engineDefaults(), mt = md.type;
    var mf = [fld('Dose-response model', selIn(types.map(function (t) { return [t, MODEL_LABEL[t] || t]; }), function () { return md.type; }, function (v) { md.type = v; }, { label: 'Dose-response model', rerender: renderDesign }))];
    function ph(v) { return v == null ? '' : String(Math.round(v * 1000) / 1000); }
    if (mt === 'independentBeta') { mf.push(fld('Beta prior a', numIn(function () { return md.betaA; }, function (v) { md.betaA = v; }, { ph: '1', min: 0.01, label: 'Beta prior a' }))); mf.push(fld('Beta prior b', numIn(function () { return md.betaB; }, function (v) { md.betaB = v; }, { ph: '1', min: 0.01, label: 'Beta prior b' }))); }
    else {
      mf.push(fld(dich ? 'Prior mean (logit scale)' : 'Prior mean', numIn(function () { return md.priorMean; }, function (v) { md.priorMean = v; }, { ph: def ? ph(def.m0) : '', label: 'Prior mean' })));
      mf.push(fld(dich ? 'Prior SD (logit scale)' : 'Prior SD', numIn(function () { return md.priorSd; }, function (v) { md.priorSd = v; }, { ph: def ? ph(def.s0) : '', min: 0.0001, label: 'Prior SD' })));
    }
    if (['ndlm', 'ndlmMonotone', 'ndlm2', 'hierarchical', 'linear', 'hierLogistic'].indexOf(mt) >= 0) {
      mf.push(fld('Smoothing SD (tau) center', numIn(function () { return md.tauCenter; }, function (v) { md.tauCenter = v; }, { ph: def ? ph(def.tau.center) : '', min: 0.0001, label: 'Tau center' })));
      mf.push(fld('Tau prior weight', numIn(function () { return md.tauWeight; }, function (v) { md.tauWeight = v; }, { ph: def ? ph(def.tau.weight) : '', min: 0.0001, label: 'Tau weight' })));
    }
    if (['logistic3', 'sigmoid', 'hierLogistic'].indexOf(mt) >= 0) {
      mf.push(fld('Curve direction', selIn([['increasing', 'Increasing'], ['decreasing', 'Decreasing']], function () { return md.direction || 'increasing'; }, function (v) { md.direction = v; }, { label: 'Curve direction' })));
      mf.push(fld('log ED50 prior mean', numIn(function () { return md.ed50Mean; }, function (v) { md.ed50Mean = v; }, { ph: 'median dose', label: 'ED50 mean' })));
      mf.push(fld('log ED50 prior SD', numIn(function () { return md.ed50Sd; }, function (v) { md.ed50Sd = v; }, { ph: '1.5', min: 0.01, label: 'ED50 SD' })));
    }
    p.appendChild(h('div', { class: 'card' }, [h('h3', { text: 'Dose-response model and priors' }), h('div', { class: 'grid2' }, mf),
      h('p', { class: 'note', text: 'Blank prior fields use the engine defaults shown in grey.' }),
      st.arms.some(function (a) { return a.isActive; }) && ['independent', 'independentBeta'].indexOf(mt) < 0 ? h('div', { class: 'msg warn', text: 'The active comparator is part of the dose-response curve. Choose an independent model to separate it.' }) : null]));
    /* allocation */
    var ac = [fld('Allocation', selIn([['fixed', 'Fixed ratio'], ['adaptive', 'Adaptive (response-adaptive)']], function () { return al.type; }, function (v) { al.type = v; }, { label: 'Allocation type', rerender: renderDesign }))];
    var ratio = h('div', { class: 'inl' }, [h('span', { text: 'Ratio' })].concat(st.arms.map(function (a, k) { return h('label', { class: 'inl' }, [a.name, numIn(function () { return al.ratio[k]; }, function (v) { al.ratio[k] = v == null ? 0 : v; }, { min: 0, step: 1, label: 'Ratio, ' + a.name })]); })));
    var adv = null;
    if (al.type === 'adaptive') {
      adv = h('div', { class: 'grid2' }, [
        fld('Burn-in (patients enrolled)', numIn(function () { return al.burnIn; }, function (v) { al.burnIn = v || 0; }, { min: 0, step: 1, label: 'Burn-in' })),
        fld('Allocate toward', selIn([['prMax', 'Pr(arm is the best)'], ['postProb', 'Pr(better than control)']], function () { return al.qoi; }, function (v) { al.qoi = v; }, { label: 'Allocation quantity' })),
        fld('Weighting', selIn([['probability', 'Probability'], ['information', 'Information']], function () { return al.weight; }, function (v) { al.weight = v; }, { label: 'Weighting' })),
        fld('Gamma (power of the weight)', numIn(function () { return al.gamma; }, function (v) { al.gamma = v == null ? 1 : v; }, { step: 0.1, min: 0, label: 'Gamma' })),
        fld('Control share', selIn([['ratio', 'As in the ratio'], ['fixed', 'Fixed share'], ['matchBest', 'Match the best arm']], function () { return al.controlShare; }, function (v) { al.controlShare = v; }, { label: 'Control share', rerender: renderDesign })),
        al.controlShare === 'fixed' ? fld('Fixed control share', numIn(function () { return al.controlFixed; }, function (v) { al.controlFixed = v || 0; }, { step: 0.05, min: 0, max: 1, label: 'Fixed control share' })) : null,
        fld('Minimum share per active arm', numIn(function () { return al.minShare; }, function (v) { al.minShare = v || 0; }, { step: 0.01, min: 0, max: 1, label: 'Minimum share' }))]);
    }
    var dr = al.drop, dropBox = h('div', null, [chkIn(function () { return dr.on; }, function (v) { dr.on = v; }, 'Drop arms that look poor', { rerender: renderDesign })]);
    if (dr.on) dropBox.appendChild(h('div', { class: 'inl' }, ['Drop an arm when its Pr(better than control by', numIn(function () { return dr.delta; }, function (v) { dr.delta = v || 0; }, { step: 0.01, label: 'Drop margin' }), ')', selIn([['<', '<'], ['<=', '<=']], function () { return dr.cmp; }, function (v) { dr.cmp = v; }, { label: 'Drop sign' }), numIn(function () { return dr.value; }, function (v) { dr.value = v == null ? 0 : v; }, { step: 0.01, label: 'Drop threshold' }), 'from look', numIn(function () { return dr.minInterim; }, function (v) { dr.minInterim = v || 1; }, { step: 1, min: 1, label: 'First look for dropping' }), 'at most', numIn(function () { return dr.maxDropped; }, function (v) { dr.maxDropped = v == null ? 0 : v; }, { step: 1, min: 0, label: 'Maximum arms dropped' }), 'arms']));
    p.appendChild(h('div', { class: 'card' }, [h('h3', { text: 'Allocation and arm dropping' }), h('div', { class: 'grid2' }, ac), ratio, adv, dropBox,
      h('p', { class: 'note', text: 'Allocation and dropping change only at looks. At least one arm always stays.' })]));
    /* interims */
    var it = S.interims;
    var atIn = h('input', { type: 'text', value: it.at.join(', '), 'aria-label': 'Look schedule', size: 34 });
    atIn.addEventListener('input', function () { it.at = atIn.value.split(/[ ,;]+/).map(parseFloat).filter(function (x) { return isFinite(x) && x > 0; }); touch(); });
    var nLooks = h('input', { type: 'number', min: 1, max: 20, value: Math.max(1, it.at.length || 3), 'aria-label': 'Number of interim looks' });
    p.appendChild(h('div', { class: 'card' }, [h('h3', { text: 'Interim looks' }), h('div', { class: 'grid2' }, [
      fld('Trigger', selIn([['enrolled', 'Patients enrolled'], ['completers', 'Patients completed'], ['opportunity', 'Patients with opportunity to complete']], function () { return it.trigger; }, function (v) { it.trigger = v; }, { label: 'Look trigger' })),
      fld('After a stop decision', selIn([['continue', 'Finish follow-up of enrolled patients'], ['lock', 'Lock the data']], function () { return it.followUp; }, function (v) { it.followUp = v; }, { label: 'Follow-up after stop' })),
      fld('Rules apply from look', numIn(function () { return it.from; }, function (v) { it.from = v || 1; }, { step: 1, min: 1, label: 'Rules from look' }))]),
      h('div', { class: 'inl' }, [h('label', { class: 'inl' }, ['Looks at (patient counts)', atIn]), h('label', { class: 'inl' }, ['or evenly spaced', nLooks]),
        h('button', { class: 'btn sm', type: 'button', text: 'Space the looks', onclick: function () { var n = Math.max(1, Math.round(parseFloat(nLooks.value) || 1)); it.at = []; for (var j = 1; j <= n; j++) it.at.push(Math.round(st.maxN * j / (n + 1))); touch(); renderDesign(); } })]),
      h('p', { class: 'note', text: 'The final analysis follows the last look automatically.' })]));
    /* rules */
    var rc = h('div', { class: 'card' }, [h('h3', { text: 'Quantities and decision rules' }), h('p', { class: 'note', text: 'Futility wins when success and futility are both met at a look. Final rules also run after an early stop to find flip-flops.' })]);
    GROUPS.forEach(function (g) { rc.appendChild(renderRule(g[0], g[1], g[2])); });
    p.appendChild(rc);
    /* benchmark */
    var bm = S.benchmark, ba = [['-1', 'Highest dose']].concat(nonCtrl().map(function (k) { return [String(k), st.arms[k].name]; }));
    var bch = [chkIn(function () { return bm.on; }, function (v) { bm.on = v; }, 'Also run a group sequential benchmark on the same simulated patients', { rerender: renderDesign })];
    p.appendChild(h('div', { class: 'card' }, [h('h3', { text: 'Benchmark design' }), bch[0], bm.on ? h('div', { class: 'grid2' }, [
      fld('Analyses (looks including the final)', numIn(function () { return bm.K; }, function (v) { bm.K = Math.max(2, Math.round(v || 2)); }, { step: 1, min: 2, max: 10, label: 'Benchmark analyses' })),
      fld('Spending function', selIn([['ldobf', 'Lan-DeMets O\'Brien-Fleming'], ['ldpocock', 'Lan-DeMets Pocock'], ['obf', 'O\'Brien-Fleming'], ['pocock', 'Pocock']], function () { return bm.spending; }, function (v) { bm.spending = v; }, { label: 'Spending function' })),
      fld('One-sided alpha', numIn(function () { return bm.alpha; }, function (v) { bm.alpha = v || 0.025; }, { step: 0.005, min: 0.0001, max: 0.5, label: 'Benchmark alpha' })),
      fld('Arm tested against control', selIn(ba, function () { return String(bm.arm); }, function (v) { bm.arm = parseInt(v, 10); }, { label: 'Benchmark arm' }))]) : null,
      h('p', { class: 'note', text: 'The benchmark compares control with one arm at equal allocation, with the same maximum sample size.' })]));
    p.appendChild(nextBtn('sim', 'Next: Simulate'));
  }

  /* ---------- Runner (Web Worker with a page-thread fallback) ---------- */
  var Runner = { w: null, fallback: false, cancelled: false, last: null, got: false, handler: null, mode: 'worker' };
  Runner.useFallback = function () { Runner.fallback = true; Runner.mode = 'page'; Runner.w = null; };
  Runner.send = function (msg) {
    Runner.last = msg;
    if (msg.cancel) Runner.cancelled = true; else if (msg.type !== 'reEvaluate') Runner.cancelled = false;
    if (!Runner.fallback && !Runner.w) {
      try {
        Runner.got = false;
        Runner.w = new Worker('sim/worker.js');
        Runner.w.onmessage = function (e) { Runner.got = true; Runner.handler(e.data); };
        Runner.w.onerror = function (e) { if (!Runner.got) { try { e.preventDefault(); } catch (x) { } Runner.useFallback(); if (Runner.last && !Runner.last.cancel) Runner.send(Runner.last); } };
      } catch (err) { Runner.useFallback(); }
    }
    if (Runner.fallback) {
      if (msg.cancel) return;
      NSim.worker.runJob(msg, function (m) { Runner.handler(m); }, function () { return Runner.cancelled; });
    } else Runner.w.postMessage(msg);
  };

  /* ---------- 4. Simulate ---------- */
  var running = false;
  function renderSim() {
    var p = $('panel-sim'); p.innerHTML = '';
    p.appendChild(h('h2', { text: 'Simulate' }));
    var nIn = numIn(function () { return S.sim.nSims; }, function (v) { S.sim.nSims = Math.max(10, Math.round(v || 100)); }, { step: 1, min: 10, max: 100000, label: 'Number of simulated trials' });
    nIn.id = 'nSims'; nIn.className = 'big';
    var presets = [100, 1000, 10000].map(function (n) { return h('button', { class: 'btn sm', type: 'button', text: n.toLocaleString('en-US'), onclick: function () { S.sim.nSims = n; nIn.value = n; touch(); } }); });
    var seed = numIn(function () { return S.sim.seed; }, function (v) { S.sim.seed = Math.round(v == null ? 1 : v); }, { step: 1, label: 'Seed' }); seed.id = 'seed';
    p.appendChild(h('div', { class: 'card' }, [h('div', { class: 'grid2' }, [fld('Simulated trials per scenario', nIn), fld('Seed', seed),
      fld('Posterior draws per look', selIn([['250', '250 (fast)'], ['500', '500'], ['1000', '1,000 (engine default)']], function () { return String(S.sim.nDraws); }, function (v) { S.sim.nDraws = parseInt(v, 10); }, { label: 'Posterior draws' }))]),
      h('div', { class: 'inl' }, [h('span', { text: 'Quick choice:' })].concat(presets)),
      h('p', { class: 'note', text: 'The same seed gives the same patients in every design, so designs are compared on equal footing. 1,000 trials of a small design take seconds.' }),
      h('div', { class: 'actions' }, [h('button', { class: 'btn primary', type: 'button', id: 'runBtn', text: 'Run simulation', onclick: run }), h('button', { class: 'btn', type: 'button', id: 'cancelBtn', text: 'Cancel', disabled: true, onclick: function () { Runner.send({ cancel: true }); setStatus('Cancelling after the current chunk.'); } })]),
      h('div', { class: 'progress', role: 'progressbar', 'aria-label': 'Simulation progress', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': 0, id: 'prog' }, [h('i', { id: 'progI' })]),
      h('p', { class: 'note', id: 'simStatus', role: 'status', 'aria-live': 'polite', text: 'Ready.' }),
      h('div', { id: 'simErr' })]));
  }
  function setStatus(t, err) { var e = $('simStatus'); if (e) e.textContent = t; var x = $('simErr'); if (x) { x.innerHTML = ''; if (err) x.appendChild(h('div', { class: 'msg err', role: 'alert', text: err })); } }
  function setProg(f) { var b = $('prog'); if (!b) return; var v = Math.max(0, Math.min(100, Math.round(100 * f))); b.setAttribute('aria-valuenow', v); $('progI').style.width = v + '%'; }
  function setRunning(on) { running = on; var r = $('runBtn'), c = $('cancelBtn'); if (r) r.disabled = on; if (c) c.disabled = !on; }
  function run() {
    var B, jobs = [], snap = clone(S);
    try { B = buildDesign(snap); } catch (e) { setStatus('Cannot run.', e.message); return; }
    var opts = { nSims: snap.sim.nSims, seed: snap.sim.seed, chunk: 50 };
    try { C.normalize(B.design); } catch (e2) { setStatus('Cannot run.', e2.message); return; }
    jobs.push({ kind: 'main', msg: { design: B.design, scenarios: B.scenarios, opts: Object.assign({ savePath: true, keepInterims: true, keepPatients: 10 }, opts) } });
    if (snap.benchmark.on) {
      try { var bd = C.gsDesign(B.design, { K: snap.benchmark.K, spending: snap.benchmark.spending, alpha: snap.benchmark.alpha, arm: snap.benchmark.arm < 0 ? undefined : snap.benchmark.arm }); jobs.push({ kind: 'bench', msg: { design: bd, scenarios: B.scenarios, opts: Object.assign({ savePath: false, keepInterims: false, keepPatients: 0 }, opts) } }); }
      catch (e3) { setStatus('Cannot build the benchmark.', e3.message); return; }
    }
    var out = { S: snap, B: B, scn: [], bench: null, label: snap.name, ms: 0, mode: Runner.mode }, ji = 0, t0 = performance.now(), cur = null;
    setRunning(true); setProg(0); setStatus('Starting.', null);
    function next() {
      if (ji >= jobs.length) { finish(); return; }
      cur = jobs[ji]; if (cur.kind === 'bench' && !out.bench) out.bench = [];
      setStatus((cur.kind === 'main' ? 'Simulating the design' : 'Simulating the benchmark') + ': ' + snap.sim.nSims.toLocaleString('en-US') + ' trials per scenario.', null);
      Runner.send(cur.msg);
    }
    function finish() {
      out.ms = performance.now() - t0; out.mode = Runner.mode; R = out; view = out.scn.map(function (r) { return r.summary; }); exploreVals = {}; stale = false;
      setRunning(false); setProg(1); setStatus('Done in ' + (out.ms / 1000).toFixed(1) + ' s' + (Runner.mode === 'page' ? ' on the page thread.' : ' in a Web Worker.'), null);
      showTab('res');
    }
    Runner.handler = function (m) {
      if (m.type === 'progress') { setProg((ji + m.overall) / jobs.length); }
      else if (m.type === 'result') { (cur.kind === 'main' ? out.scn : out.bench)[m.scenario] = { summary: m.summary, trials: m.trials, interims: m.interims, patients: m.patients }; }
      else if (m.type === 'done') { ji++; next(); }
      else if (m.type === 'cancelled') { setRunning(false); setStatus('Cancelled.', null); }
      else if (m.type === 'error') { setRunning(false); setStatus('The engine reported a problem.', m.message); }
      else if (m.type === 'reEvaluated') { if (R && m.scenario < view.length) { view[m.scenario] = m.summary; scheduleRefresh(); } }
    };
    next();
  }
  function wireExploreHandler() { /* the handler is replaced by run(); reEvaluated messages arrive through it */ }

  /* ---------- 5. Results ---------- */
  var refreshTimer = null;
  function scheduleRefresh() { if (refreshTimer) return; refreshTimer = setTimeout(function () { refreshTimer = null; renderSummary(); renderBench(); renderPlots(); renderPinned(); }, 20); }
  function explored() { return R && view.some(function (v, i) { return v !== R.scn[i].summary; }); }
  function cellHtml(v, se, d, bold) { return '<td class="num">' + (bold ? '<b>' : '') + fx(v, d) + (bold ? '</b>' : '') + '<small>' + (se == null ? '' : '&plusmn;' + fx(se, d)) + '</small></td>'; }
  function sd(arr) { var n = arr.length, m = arr.reduce(function (a, b) { return a + b; }, 0) / n, s = 0; arr.forEach(function (x) { s += (x - m) * (x - m); }); return Math.sqrt(s / Math.max(1, n - 1)); }
  function durSE(i) { if (!R || explored()) return null; var t = R.scn[i].trials; return t.length ? sd(t.map(function (x) { return x.durationWeeks; })) / Math.sqrt(t.length) : null; }
  function isNull(sc) { var t = sc.truth; return t.slice(1).every(function (v) { return Math.abs(v - t[0]) < 1e-12; }); }
  function summaryTable(sums, scns, arms, durSEf) {
    var nc = arms.map(function (a, k) { return k; }).filter(function (k) { return !arms[k].isControl; });
    var hd = ['Scenario', 'Mean subjects', 'P(success)', 'Early success', 'Late success', 'Early futility', 'Late futility', 'Success to futility', 'Futility to success', 'Inconclusive', 'Mean duration (wk)']
      .concat(arms.map(function (a) { return 'Mean n, ' + a.name; })).concat(nc.map(function (k) { return 'P(dropped), ' + arms[k].name; })).concat(['P(correct arm)']);
    var s = '<table class="st" id="sumTable"><thead><tr>' + hd.map(function (t) { return '<th>' + esc(t) + '</th>'; }).join('') + '</tr></thead><tbody>';
    sums.forEach(function (m, i) {
      var mc = m.mcse;
      s += '<tr><td>' + esc(scns[i].name) + (isNull(scns[i]) ? '<small>null scenario: P(success) is the type I error</small>' : '') + '</td>' + cellHtml(m.meanSubjects, mc.meanSubjects, 1) + cellHtml(m.pSuccess, mc.pSuccess, 3, true) + cellHtml(m.pEarlySuccess, mc.pEarlySuccess) + cellHtml(m.pLateSuccess, mc.pLateSuccess) + cellHtml(m.pEarlyFutility, mc.pEarlyFutility) + cellHtml(m.pLateFutility, mc.pLateFutility) + cellHtml(m.pSuccessToFutility, mc.pSuccessToFutility) + cellHtml(m.pFutilityToSuccess, mc.pFutilityToSuccess) + cellHtml(m.pInconclusive, mc.pInconclusive) + cellHtml(m.meanDurationWeeks, durSEf ? durSEf(i) : null, 1);
      arms.forEach(function (a, k) { s += cellHtml(m.allocationMean[k], m.allocationSE[k], 1); });
      nc.forEach(function (k) { s += cellHtml(m.pArmDropped[k], m.pArmDroppedSE[k]); });
      s += m.pCorrectArm == null ? '<td class="num">n/a<small>no single best arm</small></td>' : cellHtml(m.pCorrectArm, m.pCorrectArmSE);
      s += '</tr>';
    });
    return s + '</tbody></table>';
  }
  function renderSummary() {
    var box = $('resSummary'); if (!box || !R) return;
    box.innerHTML = '<div class="scroll">' + summaryTable(view, R.B.scenarios, R.S.study.arms, durSE) + '</div>';
    var ex = $('exploreNote'); if (ex) ex.classList.toggle('hide', !explored());
  }
  function paired(a, b, f) { var n = Math.min(a.length, b.length), d = []; for (var i = 0; i < n; i++) d.push(f(a[i]) - f(b[i])); return { mean: d.reduce(function (x, y) { return x + y; }, 0) / n, se: sd(d) / Math.sqrt(n) }; }
  function renderBench() {
    var box = $('resBench'); if (!box) return; box.innerHTML = '';
    if (!R || !R.bench) { box.innerHTML = '<p class="note">Turn on the benchmark in the Design tab to compare against a group sequential design on the same patients.</p>'; return; }
    if (!R.bInfo) R.bInfo = C.gsDesign(R.B.design, { K: R.S.benchmark.K, spending: R.S.benchmark.spending, alpha: R.S.benchmark.alpha, arm: R.S.benchmark.arm < 0 ? undefined : R.S.benchmark.arm }).benchmarkInfo;
    var info = R.bInfo;
    var isP = !explored(), s = '<table class="st" id="benchTable"><thead><tr><th>Scenario</th><th>Design</th><th>P(success)</th><th>Mean subjects</th><th>Mean duration (wk)</th><th>P(stopped early)</th></tr></thead><tbody>';
    view.forEach(function (m, i) {
      var b = R.bench[i].summary, ta = R.scn[i].trials, tb = R.bench[i].trials, nm = esc(R.B.scenarios[i].name);
      var dS = isP ? paired(ta, tb, function (t) { return (t.code === 1 || t.code === 2) ? 1 : 0; }) : { mean: m.pSuccess - b.pSuccess, se: Math.sqrt(m.mcse.pSuccess * m.mcse.pSuccess + b.mcse.pSuccess * b.mcse.pSuccess) };
      var dN = isP ? paired(ta, tb, function (t) { return t.nEnrolled; }) : { mean: m.meanSubjects - b.meanSubjects, se: Math.sqrt(Math.pow(m.mcse.meanSubjects, 2) + Math.pow(b.mcse.meanSubjects, 2)) };
      var dD = isP ? paired(ta, tb, function (t) { return t.durationWeeks; }) : { mean: m.meanDurationWeeks - b.meanDurationWeeks, se: null };
      s += '<tr class="sep"><td rowspan="3">' + nm + '</td><td>Adaptive (yours)</td>' + cellHtml(m.pSuccess, m.mcse.pSuccess) + cellHtml(m.meanSubjects, m.mcse.meanSubjects, 1) + cellHtml(m.meanDurationWeeks, durSE(i), 1) + cellHtml(m.pStoppedEarly, m.mcse.pStoppedEarly) + '</tr>';
      s += '<tr><td>Group sequential</td>' + cellHtml(b.pSuccess, b.mcse.pSuccess) + cellHtml(b.meanSubjects, b.mcse.meanSubjects, 1) + cellHtml(b.meanDurationWeeks, b.sdSubjects != null && R.bench[i].trials.length ? sd(tb.map(function (t) { return t.durationWeeks; })) / Math.sqrt(tb.length) : null, 1) + cellHtml(b.pStoppedEarly, b.mcse.pStoppedEarly) + '</tr>';
      s += '<tr><td>Difference' + (isP ? ' (paired)' : '') + '</td>' + cellHtml(dS.mean, dS.se) + cellHtml(dN.mean, dN.se, 1) + cellHtml(dD.mean, dD.se, 1) + cellHtml(m.pStoppedEarly - b.pStoppedEarly, null) + '</tr>';
    });
    s += '</tbody></table>';
    var bnd = info && info.bounds ? 'Benchmark: ' + info.K + ' analyses, ' + R.S.benchmark.spending + ', one-sided alpha ' + info.alpha + ', z bounds ' + info.bounds.map(function (x) { return fx(x, 2); }).join(', ') + '; tests ' + esc(R.S.study.arms[info.arm].name) + ' against control.' : '';
    box.innerHTML = '<div class="scroll">' + s + '</div><p class="note">' + bnd + '</p><p class="note">Both designs use the same simulated patients, so the differences carry less noise than the cells suggest.</p>';
  }
  // A kept run is matched to the current scenarios by their truth (and SD), never by position or name.
  function scnKey(sc) { return JSON.stringify([sc.truth, sc.sd == null ? null : sc.sd]); }
  function pinMatch(keys, curKeys) { var used = {}; return curKeys.map(function (k) { for (var j = 0; j < keys.length; j++) if (!used[j] && keys[j] === k) { used[j] = 1; return j; } return -1; }); }
  function renderPinned() {
    var box = $('resPinned'); if (!box) return; box.innerHTML = '';
    if (!R) return;
    var pb = h('button', { class: 'btn sm', type: 'button', id: 'pinBtn', text: 'Keep this run for comparison', onclick: function () { pinned = { label: R.label, sums: view.map(function (v) { return v; }), names: R.B.scenarios.map(function (s) { return s.name; }), keys: R.B.scenarios.map(scnKey), nSims: R.S.sim.nSims }; renderPinned(); } });
    box.appendChild(pb);
    var pm = pinned ? pinMatch(pinned.keys, R.B.scenarios.map(scnKey)) : [];
    if (pinned && pm.some(function (j) { return j >= 0; })) {
      var s = '<table class="st" id="pinTable"><thead><tr><th>Scenario</th><th>Run</th><th>P(success)</th><th>Mean subjects</th><th>Mean duration (wk)</th></tr></thead><tbody>';
      view.forEach(function (m, i) {
        if (pm[i] < 0) return;
        var q = pinned.sums[pm[i]], dse = function (a, b) { return Math.sqrt(a * a + b * b); };
        s += '<tr class="sep"><td rowspan="3">' + esc(R.B.scenarios[i].name) + '</td><td>' + esc(pinned.label) + ' (kept)</td>' + cellHtml(q.pSuccess, q.mcse.pSuccess) + cellHtml(q.meanSubjects, q.mcse.meanSubjects, 1) + cellHtml(q.meanDurationWeeks, null, 1) + '</tr>';
        s += '<tr><td>' + esc(R.label) + ' (now)</td>' + cellHtml(m.pSuccess, m.mcse.pSuccess) + cellHtml(m.meanSubjects, m.mcse.meanSubjects, 1) + cellHtml(m.meanDurationWeeks, null, 1) + '</tr>';
        s += '<tr><td>Difference (now minus kept)</td>' + cellHtml(m.pSuccess - q.pSuccess, dse(m.mcse.pSuccess, q.mcse.pSuccess)) + cellHtml(m.meanSubjects - q.meanSubjects, dse(m.mcse.meanSubjects, q.mcse.meanSubjects), 1) + cellHtml(m.meanDurationWeeks - q.meanDurationWeeks, null, 1) + '</tr>';
      });
      box.appendChild(h('div', { class: 'scroll', html: s + '</tbody></table>' }));
      if (pm.some(function (j) { return j < 0; })) box.appendChild(h('p', { class: 'note', text: 'Scenarios are matched by their true values. A scenario with no match in the kept run is left out.' }));
      box.appendChild(h('p', { class: 'note', text: 'Standard errors of differences treat the two runs as independent, which is conservative when both use the same seed.' }));
    } else if (pinned) box.appendChild(h('p', { class: 'note', text: 'No scenario of the kept run has the same true values as a scenario now, so nothing can be compared.' }));
  }
  var COLORS = ['#2D8B8B', '#E07A3F', '#0A1628', '#8C6BB1'];
  function niceTicks(lo, hi) {
    var span = hi - lo || 1, raw = span / 5, p10 = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / p10, step = (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * p10, t = [];
    for (var v = Math.ceil(lo / step - 1e-9) * step; v <= hi + 1e-9; v += step) t.push(Math.round(v / step) * step);
    return t;
  }
  function barPlot(o) {
    var W = 520, Ht = 290, L = 54, Rm = 10, T = 12, B = o.cats.length > 5 ? 78 : 50, pw = W - L - Rm, ph = Ht - T - B, ns = o.series.length, nc = o.cats.length, vals = [];
    o.series.forEach(function (s) { s.vals.forEach(function (v, i) { if (isFinite(v)) { vals.push(v + (s.ses && isFinite(s.ses[i]) ? s.ses[i] : 0)); vals.push(v - (s.ses && isFinite(s.ses[i]) ? s.ses[i] : 0)); } }); });
    (o.markers || []).forEach(function (m) { m.vals.forEach(function (v) { if (isFinite(v)) vals.push(v); }); });
    var lo = Math.min(0, Math.min.apply(null, vals)), hi = o.ymax != null ? o.ymax : Math.max.apply(null, vals.concat([1e-9])) * 1.08;
    if (hi - lo < 1e-9) hi = lo + 1;
    function Y(v) { return T + ph * (1 - (v - lo) / (hi - lo)); }
    var s = '<svg class="plot" viewBox="0 0 ' + W + ' ' + Ht + '" role="img" aria-label="' + esc(o.title) + '"><title>' + esc(o.title) + '</title>';
    niceTicks(lo, hi).forEach(function (t) { s += '<line class="grid" x1="' + L + '" x2="' + (W - Rm) + '" y1="' + Y(t).toFixed(1) + '" y2="' + Y(t).toFixed(1) + '"/><text x="' + (L - 5) + '" y="' + (Y(t) + 4).toFixed(1) + '" text-anchor="end">' + (Math.abs(t) < 1e-9 ? '0' : (+t.toPrecision(3))) + '</text>'; });
    s += '<line class="axis" x1="' + L + '" x2="' + L + '" y1="' + T + '" y2="' + (T + ph) + '"/><line class="axis" x1="' + L + '" x2="' + (W - Rm) + '" y1="' + Y(0).toFixed(1) + '" y2="' + Y(0).toFixed(1) + '"/>';
    var gw = pw / nc, bw = gw * 0.78 / ns;
    o.cats.forEach(function (c, i) {
      var cx = L + gw * i + gw / 2, lab = String(c).length > 16 ? String(c).slice(0, 15) + '...' : String(c);
      s += nc > 5 ? '<text transform="translate(' + cx.toFixed(1) + ',' + (T + ph + 12) + ') rotate(-35)" text-anchor="end">' + esc(lab) + '</text>' : '<text x="' + cx.toFixed(1) + '" y="' + (T + ph + 16) + '" text-anchor="middle">' + esc(lab) + '</text>';
      o.series.forEach(function (sr, j) {
        var v = sr.vals[i]; if (!isFinite(v)) return;
        var x = L + gw * i + gw * 0.11 + j * bw, y0 = Y(0), y1 = Y(v);
        s += '<rect x="' + x.toFixed(1) + '" y="' + Math.min(y0, y1).toFixed(1) + '" width="' + (bw * 0.92).toFixed(1) + '" height="' + Math.max(0.5, Math.abs(y1 - y0)).toFixed(1) + '" fill="' + sr.color + '"><title>' + esc(sr.name + ', ' + c + ': ' + fx(v, 3)) + '</title></rect>';
        if (sr.ses && isFinite(sr.ses[i])) { var xm = x + bw * 0.46; s += '<line stroke="#0A1628" stroke-width="1.3" x1="' + xm.toFixed(1) + '" x2="' + xm.toFixed(1) + '" y1="' + Y(v - sr.ses[i]).toFixed(1) + '" y2="' + Y(v + sr.ses[i]).toFixed(1) + '"/>'; }
      });
      (o.markers || []).forEach(function (m) { var v = m.vals[i]; if (isFinite(v)) s += '<path d="M' + (cx - gw * 0.42).toFixed(1) + ' ' + Y(v).toFixed(1) + 'H' + (cx + gw * 0.42).toFixed(1) + '" stroke="#A8341F" stroke-width="2.5"><title>' + esc(m.name + ', ' + c + ': ' + fx(v, 3)) + '</title></path>'; });
    });
    s += '<text class="axis-label" x="' + (L + pw / 2) + '" y="' + (Ht - 4) + '" text-anchor="middle">' + esc(o.xlab || '') + '</text></svg>';
    var lg = o.series.map(function (sr) { return '<span><i style="background:' + sr.color + '"></i>' + esc(sr.name) + '</span>'; }).concat((o.markers || []).map(function (m) { return '<span><i style="background:#A8341F;height:3px;vertical-align:3px"></i>' + esc(m.name) + '</span>'; })).join('');
    return '<div class="plotbox"><h4>' + esc(o.title) + '</h4>' + s + '<div class="legend2">' + lg + '</div></div>';
  }
  function histBins(arrs, nb) {
    var all = [].concat.apply([], arrs), lo = Math.min.apply(null, all), hi = Math.max.apply(null, all);
    if (hi - lo < 1) return { cats: [String(Math.round(lo))], edges: [lo, lo + 1] };
    var step = Math.ceil((hi - lo + 1) / nb), edges = [], cats = [], i;
    for (i = 0; i < nb; i++) { var a = Math.floor(lo) + i * step; if (a > hi) break; edges.push(a); cats.push(String(a)); }
    edges.push(edges[edges.length - 1] + step); return { cats: cats, edges: edges };
  }
  function counts(vals, bn) { var c = bn.cats.map(function () { return 0; }); vals.forEach(function (v) { for (var i = bn.cats.length - 1; i >= 0; i--) if (v >= bn.edges[i]) { c[i]++; break; } }); return c.map(function (x) { return x / vals.length; }); }
  function currentScn() { var e = $('scnSel'); return e ? parseInt(e.value, 10) || 0 : 0; }
  function renderPlots() {
    var box = $('resPlots'); if (!box || !R) return;
    var si = Math.min(currentScn(), view.length - 1), m = view[si], arms = R.S.study.arms, an = arms.map(function (a) { return a.name; }), hasB = !!R.bench, bm = hasB ? R.bench[si].summary : null, out = '';
    var nm = R.B.scenarios[si].name;
    var alloc = [{ name: 'Adaptive design', color: COLORS[0], vals: m.allocationMean, ses: m.allocationSE }];
    if (hasB) alloc.push({ name: 'Group sequential', color: COLORS[1], vals: bm.allocationMean, ses: bm.allocationSE });
    out += barPlot({ title: 'Mean patients per arm: ' + nm, cats: an, series: alloc, xlab: 'Arm (bars show mean, whiskers one SE)' });
    out += barPlot({ title: 'Estimated response vs truth: ' + nm, cats: an, series: [{ name: 'Mean estimate', color: COLORS[0], vals: m.responseEstimate, ses: m.responseEstimateSE }], markers: [{ name: 'True value', vals: R.B.scenarios[si].truth }], xlab: 'Arm' });
    var tr = R.scn[si].trials, series = [], arrs = [tr.map(function (t) { return t.nEnrolled; })];
    if (hasB) arrs.push(R.bench[si].trials.map(function (t) { return t.nEnrolled; }));
    var bn = histBins(arrs, 12);
    series.push({ name: 'Adaptive design', color: COLORS[0], vals: counts(arrs[0], bn) }); if (hasB) series.push({ name: 'Group sequential', color: COLORS[1], vals: counts(arrs[1], bn) });
    out += barPlot({ title: 'Sample size distribution: ' + nm + (explored() ? ' (original run)' : ''), cats: bn.cats, series: series, xlab: 'Patients enrolled (bin start); share of trials' });
    var cum = function (a) { var c = 0; return a.map(function (v) { c += v; return c; }); };
    if (m.stopByInterim.length) {
      var ss = [{ name: 'Adaptive design', color: COLORS[0], vals: cum(m.stopByInterim) }];
      if (hasB && bm.stopByInterim.length) ss.push({ name: 'Group sequential', color: COLORS[1], vals: cum(bm.stopByInterim) });
      out += barPlot({ title: 'Cumulative probability of stopping by look: ' + nm, cats: m.stopByInterim.map(function (x, i) { return 'Look ' + (i + 1); }), series: ss, ymax: 1, xlab: 'Interim look' });
    } else out += '<div class="plotbox"><h4>Stopping by look</h4><p class="note">This design has no interim looks.</p></div>';
    var sc = [{ name: 'Adaptive design', color: COLORS[0], vals: view.map(function (v) { return v.pSuccess; }), ses: view.map(function (v) { return v.mcse.pSuccess; }) }];
    if (hasB) sc.push({ name: 'Group sequential', color: COLORS[1], vals: R.bench.map(function (b) { return b.summary.pSuccess; }), ses: R.bench.map(function (b) { return b.summary.mcse.pSuccess; }) });
    out += barPlot({ title: 'Probability of success across scenarios', cats: R.B.scenarios.map(function (s) { return s.name; }), series: sc, ymax: 1, xlab: 'Scenario (whiskers one Monte Carlo SE)' });
    box.innerHTML = out;
  }
  /* example trial */
  function fillIcons(arr) { return arr; }
  function renderExample() {
    if (!$('trialNo') && $('resExample')) $('resExample').innerHTML = '';
    var card = $('resExample'); if (!card || !R) return;
    var si = currentScn(), res = R.scn[si], arms = R.S.study.arms, ctrlTruth = R.B.scenarios[si].truth[0], dich = R.S.study.endpoint === 'dichotomous';
    var nKept = Math.min(10, res.trials.length), tSel = $('trialNo') ? Math.max(1, Math.min(nKept, parseInt($('trialNo').value, 10) || 1)) : 1, sim = tSel - 1;
    var rows = res.patients.filter(function (r) { return r.sim === sim; }), tr = res.trials[sim], ims = res.interims.filter(function (r) { return r.sim === sim; });
    if (!$('trialNo')) { card.appendChild(h('div', { class: 'inl' }, [h('label', { class: 'inl' }, ['Example trial (1 to ' + nKept + ')', h('input', { type: 'number', id: 'trialNo', min: 1, max: nKept, value: 1, 'aria-label': 'Example trial number', oninput: renderExample })])])); card.appendChild(h('div', { id: 'exBody' })); }
    var box = $('exBody'); box.innerHTML = '';
    if (!tr) { box.appendChild(h('p', { class: 'note', text: 'No trials were kept.' })); return; }
    box.appendChild(h('p', { class: 'note', text: 'Scenario "' + R.B.scenarios[si].name + '", trial ' + tSel + ': ' + tr.outcome + ' with ' + tr.nEnrolled + ' patients enrolled and a duration of ' + fx(tr.durationWeeks, 1) + ' weeks.' }));
    box.appendChild(h('div', { class: 'note', html: '<span class="key"><svg class="pp yes" viewBox="0 0 16 20"><use href="#person"/></svg>' + (dich ? 'responded' : 'above the control mean') + '</span><span class="key"><svg class="pp no" viewBox="0 0 16 20"><use href="#person"/></svg>' + (dich ? 'did not respond' : 'at or below the control mean') + '</span><span class="key"><svg class="pp yes gone" viewBox="0 0 16 20"><use href="#person"/></svg>dropped out before the final visit</span>' }));
    arms.forEach(function (a, k) {
      var mine = rows.filter(function (r) { return r.arm === k; }).sort(function (x, y) { return x.id - y.id; }), ic = '', resp = 0;
      mine.forEach(function (r) {
        var yes = dich ? r.y === 1 : (R.S.study.higherIsBetter === false ? r.y < ctrlTruth : r.y > ctrlTruth); if (yes) resp++;
        ic += '<svg class="pp ' + (yes ? 'yes' : 'no') + (r.dropout ? ' gone' : '') + '" viewBox="0 0 16 20" aria-hidden="true"><use href="#person"/></svg>';
      });
      box.appendChild(h('div', { class: 'rowwrap' }, [h('div', { class: 'rl', html: esc(a.name) + '<b>n = ' + mine.length + ', ' + resp + ' ' + (dich ? 'responded' : 'above') + '</b>' }), h('div', { class: 'trow', html: ic, role: 'img', 'aria-label': a.name + ': ' + mine.length + ' patients, ' + resp + ' ' + (dich ? 'responded' : 'above the control mean') })]));
    });
    var labels = R.B.meta.labels, ids = Object.keys(labels), nc = arms.map(function (a, k) { return k; }).filter(function (k) { return !arms[k].isControl; });
    var s = '<table class="st" id="exTable"><thead><tr><th>Look</th><th>Week</th><th>Enrolled</th><th>Completers</th><th>Patients per arm</th>' + ids.map(function (id) { return '<th>' + esc(labels[id]) + ' (' + nc.map(function (k) { return esc(arms[k].name); }).join(' / ') + ')</th>'; }).join('') + '<th>Decision</th></tr></thead><tbody>';
    ims.filter(function (r) { return tr.stopInterim < 0 || r.interim - 1 <= tr.stopInterim; }).forEach(function (r) {
      var stop = tr.stopInterim === r.interim - 1;
      s += '<tr><td>' + r.interim + '</td><td class="num">' + fx(r.time, 1) + '</td><td class="num">' + r.nEnrolled + '</td><td class="num">' + r.nCompleters + '</td><td class="num">' + r.armN.join(' / ') + '</td>' + ids.map(function (id) { var v = r.qoi[id]; return '<td class="num">' + (v ? nc.map(function (k) { return fx(v[k], 2); }).join(' / ') : 'n/a') + '</td>'; }).join('') + '<td>' + (stop ? esc(tr.outcome) : 'continue') + '</td></tr>';
    });
    s += '<tr class="sep"><td>Final</td><td class="num">' + fx(tr.durationWeeks, 1) + '</td><td class="num">' + tr.nEnrolled + '</td><td class="num">n/a</td><td class="num">' + tr.armN.join(' / ') + '</td><td colspan="' + ids.length + '">Estimated response per arm: ' + tr.est.map(function (v) { return fx(v, 3); }).join(' / ') + '</td><td>' + esc(tr.outcome) + '</td></tr></tbody></table>';
    box.appendChild(h('div', { class: 'scroll', html: s }));
  }
  /* explore thresholds */
  var exploreTimer = null;
  function renderExplore() {
    var box = $('resExplore'); if (!box || !R) return; box.innerHTML = '';
    var any = false;
    GROUPS.forEach(function (g) {
      var key = g[0], gr = R.S.rules[key]; if (!gr.on || !gr.conds.length) return;
      if (key[0] === 'i' && !R.S.interims.at.length) return;
      any = true; var c = gr.conds[0], isP = c.type === 'pvalue', mx = isP ? 0.5 : 1, stp = isP ? 0.0025 : 0.005, id = 'sl-' + key;
      if (exploreVals[key] == null) exploreVals[key] = c.value;
      var out = h('output', { for: id, id: id + '-o', text: fx(exploreVals[key], 3) });
      var sl = h('input', { type: 'range', id: id, min: 0, max: mx, step: stp, value: exploreVals[key], 'aria-label': g[1] + ' threshold' });
      sl.addEventListener('input', function () { exploreVals[key] = parseFloat(sl.value); out.textContent = fx(exploreVals[key], 3); queueExplore(); });
      box.appendChild(h('div', { class: 'slid' }, [h('label', { for: id, text: g[1] + ': ' + labelOf(key) + ' ' + c.cmp }), sl, out]));
    });
    if (!any) box.appendChild(h('p', { class: 'note', text: 'Turn on a decision rule in the Design tab to explore its threshold.' }));
    else box.appendChild(h('div', { class: 'actions' }, [h('button', { class: 'btn sm', type: 'button', id: 'resetThr', text: 'Reset to the simulated thresholds', onclick: function () { exploreVals = {}; view = R.scn.map(function (r) { return r.summary; }); renderExplore(); scheduleRefresh(); } })]));
  }
  function labelOf(key) { var c = R.S.rules[key].conds[0]; return qoiLabel(c) + (R.S.rules[key].conds.length > 1 ? ' (first condition)' : ''); }
  function queueExplore() {
    if (exploreTimer) return;
    exploreTimer = setTimeout(function () {
      exploreTimer = null; var c = clone(R.S);
      Object.keys(exploreVals).forEach(function (k) { if (c.rules[k].conds.length) c.rules[k].conds[0].value = exploreVals[k]; });
      var rules = buildDesign(c).design.rules;
      for (var i = 0; i < R.scn.length; i++) Runner.send({ type: 'reEvaluate', scenario: i, rules: rules });
    }, 30);
  }
  function renderResults() {
    var p = $('panel-res'); p.innerHTML = '';
    p.appendChild(h('h2', { text: 'Results' }));
    if (!R) { p.appendChild(h('p', { class: 'note', text: 'No results yet. Run a simulation in the Simulate tab.' })); p.appendChild(nextBtn('sim', 'Go to Simulate')); return; }
    p.appendChild(h('div', { id: 'staleNote', class: 'msg warn' + (stale ? '' : ' hide'), text: 'The design changed after this run. Run again to update the results.' }));
    p.appendChild(h('p', { class: 'note', text: R.label + ': ' + R.S.sim.nSims.toLocaleString('en-US') + ' trials per scenario, seed ' + R.S.sim.seed + ', engine ' + C.version + ', ' + (R.ms / 1000).toFixed(1) + ' s' + (R.mode === 'page' ? ' (page thread).' : ' (Web Worker).') }));
    p.appendChild(h('div', { class: 'card' }, [h('h3', { text: 'How to read the results' }), h('ul', { class: 'note' }, [
      h('li', { text: 'The null row (the drug does nothing): its success rate is the false-win rate, also called Type I error. Lower is safer.' }),
      h('li', { text: 'The other rows (the drug works): the success rate is power, the chance to find a real effect. Higher is better.' }),
      h('li', { text: 'Mean patients: how many patients the trial enrolls on average. Early stopping lowers it.' }),
      h('li', { text: 'Bias: how far the estimated effect lands from the truth on average. Zero is ideal.' })]),
      h('details', {}, [h('summary', { text: 'Glossary' }), h('ul', { class: 'note' }, [
        h('li', { text: 'Pr(ED_q): the chance that a dose reaches fraction q of the largest effect (the q-effective dose).' }),
        h('li', { text: 'tau: how much the true effects of the arms are allowed to differ when the model borrows strength across them. Small tau borrows more.' }),
        h('li', { text: 'gamma: how strongly adaptive randomization favors the arm that looks better. 0 keeps equal groups; larger values shift patients faster.' }),
        h('li', { text: 'Spending function: the rule that splits the total false-win allowance (alpha) across the looks.' }),
        h('li', { text: 'Conditional power: the chance of winning at the end if the true effect is the one assumed. Predictive probability: the same chance, averaged over what the data so far say the effect could be.' }),
        h('li', { text: 'Effective sample size of a prior: how many patients the prior opinion is worth.' })])])]));
    p.appendChild(h('h3', { text: 'Summary by scenario (Monte Carlo SE under each value)' }));
    p.appendChild(h('div', { id: 'resSummary' }));
    p.appendChild(h('div', { id: 'exploreNote', class: 'msg warn hide', text: 'Thresholds were changed after the run. The table and plots use the re-evaluated decisions on the same patients.' }));
    p.appendChild(h('h3', { text: 'Explore thresholds without re-simulating' }));
    p.appendChild(h('div', { class: 'card' }, [h('p', { class: 'note', text: 'Move a threshold to re-evaluate every decision on the saved trials. Allocation and arm dropping stay as simulated.' }), h('div', { id: 'resExplore' })]));
    p.appendChild(h('h3', { text: 'Adaptive design against the benchmark' }));
    p.appendChild(h('div', { id: 'resBench' }));
    p.appendChild(h('div', { id: 'resPinned' }));
    var sel = h('select', { id: 'scnSel', 'aria-label': 'Scenario shown in the plots and the example trial', onchange: function () { renderPlots(); renderExample(); } }, R.B.scenarios.map(function (s, i) { return h('option', { value: i, text: s.name }); }));
    p.appendChild(h('h3', { text: 'Plots' }));
    p.appendChild(h('div', { class: 'inl' }, [h('label', { class: 'inl' }, ['Scenario', sel])]));
    p.appendChild(h('div', { class: 'plots', id: 'resPlots' }));
    p.appendChild(h('h3', { text: 'One example trial' }));
    p.appendChild(h('div', { class: 'card', id: 'resExample' }));
    renderSummary(); renderExplore(); renderBench(); renderPinned(); renderPlots(); renderExample();
    p.appendChild(nextBtn('save', 'Next: Save and share'));
  }

  /* ---------- 6. Save and share ---------- */
  function download(name, text, type) {
    var a = h('a', { href: URL.createObjectURL(new Blob([text], { type: type || 'text/plain' })), download: name }); document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function csv(rows) { return rows.map(function (r) { return r.map(function (v) { if (v == null || (typeof v === 'number' && !isFinite(v))) return ''; v = String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }).join(','); }).join('\n') + '\n'; }
  function summaryCsv() {
    var arms = R.S.study.arms, head = ['scenario', 'nSims', 'seed', 'meanSubjects', 'meanSubjectsSE', 'pSuccess', 'pSuccessSE', 'pEarlySuccess', 'pEarlySuccessSE', 'pLateSuccess', 'pLateSuccessSE', 'pEarlyFutility', 'pEarlyFutilitySE', 'pLateFutility', 'pLateFutilitySE', 'pSuccessToFutility', 'pSuccessToFutilitySE', 'pFutilityToSuccess', 'pFutilityToSuccessSE', 'pInconclusive', 'pInconclusiveSE', 'meanDurationWeeks', 'meanAccrualWeeks', 'pCorrectArm', 'pCorrectArmSE'];
    arms.forEach(function (a) { head.push('alloc_' + a.name, 'alloc_' + a.name + '_SE', 'estimate_' + a.name, 'pDropped_' + a.name); });
    var rows = [head];
    view.forEach(function (m, i) {
      var r = [R.B.scenarios[i].name, m.nSims, R.S.sim.seed, m.meanSubjects, m.mcse.meanSubjects, m.pSuccess, m.mcse.pSuccess, m.pEarlySuccess, m.mcse.pEarlySuccess, m.pLateSuccess, m.mcse.pLateSuccess, m.pEarlyFutility, m.mcse.pEarlyFutility, m.pLateFutility, m.mcse.pLateFutility, m.pSuccessToFutility, m.mcse.pSuccessToFutility, m.pFutilityToSuccess, m.mcse.pFutilityToSuccess, m.pInconclusive, m.mcse.pInconclusive, m.meanDurationWeeks, m.meanAccrualWeeks, m.pCorrectArm, m.pCorrectArmSE];
      arms.forEach(function (a, k) { r.push(m.allocationMean[k], m.allocationSE[k], m.responseEstimate[k], m.pArmDropped[k]); });
      rows.push(r);
    });
    return csv(rows);
  }
  function trialsCsv() {
    var arms = R.S.study.arms, head = ['scenario', 'sim', 'outcomeCode', 'outcome', 'stopInterim', 'nEnrolled', 'accrualWeeks', 'durationWeeks', 'selectedArm', 'correct'], rows = [];
    arms.forEach(function (a) { head.push('n_' + a.name); }); arms.forEach(function (a) { head.push('est_' + a.name); }); arms.forEach(function (a) { head.push('dropped_' + a.name); });
    rows.push(head);
    R.scn.forEach(function (res, i) { res.trials.forEach(function (t) { rows.push([R.B.scenarios[i].name, t.sim, t.code, t.outcome, t.stopInterim + 1, t.nEnrolled, t.accrualWeeks, t.durationWeeks, t.selected >= 0 ? arms[t.selected].name : '', t.correct].concat(t.armN, t.est, t.dropped)); }); });
    return csv(rows);
  }
  function interimsCsv() {
    var arms = R.S.study.arms, ids = Object.keys(R.B.meta.labels), nc = arms.map(function (a, k) { return k; }).filter(function (k) { return !arms[k].isControl; }), head = ['scenario', 'sim', 'look', 'week', 'nEnrolled', 'nCompleters'], rows = [];
    arms.forEach(function (a) { head.push('n_' + a.name); }); ids.forEach(function (id) { nc.forEach(function (k) { head.push(R.B.meta.labels[id] + ' [' + id + '] ' + arms[k].name); }); });
    rows.push(head);
    R.scn.forEach(function (res, i) { res.interims.forEach(function (r) { var row = [R.B.scenarios[i].name, r.sim, r.interim, r.time, r.nEnrolled, r.nCompleters].concat(r.armN); ids.forEach(function (id) { nc.forEach(function (k) { row.push(r.qoi[id] ? r.qoi[id][k] : null); }); }); rows.push(row); }); });
    return csv(rows);
  }
  function stateJson() { return JSON.stringify({ format: 'bct-studio', version: 1, engine: C.version, design: S }, null, 2); }
  function b64enc(str) { return btoa(unescape(encodeURIComponent(str))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function b64dec(str) { str = str.replace(/-/g, '+').replace(/_/g, '/'); while (str.length % 4) str += '='; return decodeURIComponent(escape(atob(str))); }
  function shareUrl() { return location.href.split('#')[0] + '#d=' + b64enc(JSON.stringify(S)); }
  function mergeState(obj) {
    var d = obj && obj.design ? obj.design : obj;
    if (!d || !d.study || !d.study.arms || !d.scenarios) throw new Error('This file is not a studio design.');
    var b = blank(), s = Object.assign(b, d);
    ['accrual', 'model', 'interims', 'benchmark', 'sim'].forEach(function (k) { s[k] = Object.assign(b[k], d[k] || {}); });
    s.study = Object.assign(blank().study, d.study); s.allocation = Object.assign(blank().allocation, d.allocation || {}); s.allocation.drop = Object.assign(blank().allocation.drop, (d.allocation || {}).drop || {});
    var rb = blank().rules; s.rules = {}; GROUPS.forEach(function (g) { s.rules[g[0]] = Object.assign(rb[g[0]], (d.rules || {})[g[0]] || {}); s.rules[g[0]].conds = ((d.rules || {})[g[0]] && d.rules[g[0]].conds ? d.rules[g[0]].conds : rb[g[0]].conds).map(function (c) { return Object.assign(cond(c.type || 'postProb'), c); }); });
    var K = s.study.arms.length; s.dropout = (d.dropout || []).slice(0, K); while (s.dropout.length < K) s.dropout.push(0);
    s.allocation.ratio = (s.allocation.ratio || []).slice(0, K); while (s.allocation.ratio.length < K) s.allocation.ratio.push(1);
    s.scenarios.forEach(function (sc) { sc.truth = sc.truth.slice(0, K); while (sc.truth.length < K) sc.truth.push(0); if (sc.sd == null) sc.sd = 1; });
    return s;
  }
  function loadState(s, tab) {
    S = s; R = null; view = []; stale = false; exploreVals = {}; presetCfg = { kind: 'linear', c: null, e: null };
    renderStudy(); renderScn(); renderDesign(); renderSim(); renderResults(); renderSave(); showTab(tab || 'study');
  }
  function renderSave() {
    var p = $('panel-save'); p.innerHTML = '';
    p.appendChild(h('h2', { text: 'Save and share' }));
    var tx = h('textarea', { class: 'json', id: 'jsonBox', 'aria-label': 'Design JSON', spellcheck: 'false' }); tx.value = stateJson();
    var file = h('input', { type: 'file', accept: '.json,application/json', id: 'jsonFile', 'aria-label': 'Import a design file' });
    file.addEventListener('change', function () { var f = file.files[0]; if (!f) return; var rd = new FileReader(); rd.onload = function () { doImport(String(rd.result)); }; rd.readAsText(f); });
    var msg = h('div', { id: 'saveMsg', role: 'status', 'aria-live': 'polite' });
    function say(t, err) { var msg = $('saveMsg'); if (!msg) return; msg.innerHTML = ''; msg.appendChild(h('div', { class: 'msg' + (err ? ' err' : ''), text: t })); }
    function doImport(text) { try { loadState(mergeState(JSON.parse(text)), 'save'); say('Design imported.'); } catch (e) { say('Import failed: ' + e.message, true); } }
    var urlBox = h('input', { type: 'text', id: 'shareUrl', readonly: true, 'aria-label': 'Share link', size: 40 });
    p.appendChild(h('div', { class: 'card' }, [h('h3', { text: 'Design file (JSON)' }),
      h('div', { class: 'actions' }, [h('button', { class: 'btn', type: 'button', id: 'exportJson', text: 'Download design JSON', onclick: function () { tx.value = stateJson(); download('trial-design.json', tx.value, 'application/json'); say('Design downloaded.'); } }), h('label', { class: 'inl' }, ['Import file', file])]),
      h('label', { class: 'fld' }, [h('span', { text: 'Design JSON (copy, edit or paste here)' }), tx]),
      h('div', { class: 'actions' }, [h('button', { class: 'btn', type: 'button', id: 'importJson', text: 'Load the JSON above', onclick: function () { doImport(tx.value); } }), h('button', { class: 'btn sm', type: 'button', text: 'Refresh from current design', onclick: function () { tx.value = stateJson(); } })])]));
    p.appendChild(h('div', { class: 'card' }, [h('h3', { text: 'Share as a link' }),
      h('div', { class: 'actions' }, [h('button', { class: 'btn', type: 'button', id: 'makeLink', text: 'Make share link', onclick: function () { var u = shareUrl(); urlBox.value = u; try { history.replaceState(null, '', '#d=' + b64enc(JSON.stringify(S))); } catch (e) { } try { navigator.clipboard.writeText(u).then(function () { say('Link copied.'); }, function () { say('Link ready below. Copy it from the box.'); }); } catch (e2) { say('Link ready below. Copy it from the box.'); } } }), urlBox]),
      h('p', { class: 'note', text: 'The design is encoded in the link after the # sign, so it is never sent to a server.' })]));
    var has = !!R;
    p.appendChild(h('div', { class: 'card' }, [h('h3', { text: 'CSV export' }), has ? null : h('p', { class: 'note', text: 'Run a simulation first to export results.' }),
      h('div', { class: 'actions' }, [
        h('button', { class: 'btn', type: 'button', id: 'csvSum', disabled: !has, text: 'Summary CSV', onclick: function () { download('summary.csv', summaryCsv(), 'text/csv'); } }),
        h('button', { class: 'btn', type: 'button', id: 'csvTrials', disabled: !has, text: 'Per-trial CSV', onclick: function () { download('trials.csv', trialsCsv(), 'text/csv'); } }),
        h('button', { class: 'btn', type: 'button', id: 'csvInt', disabled: !has, text: 'Per-interim CSV', onclick: function () { download('interims.csv', interimsCsv(), 'text/csv'); } })]),
      h('p', { class: 'note', text: 'The summary has one row per scenario with standard errors. The per-interim table covers every simulated trial.' })]));
    p.appendChild(msg);
  }

  /* ---------- Start ---------- */
  function init() {
    var ex = $('examples');
    EXAMPLES.forEach(function (e) { ex.appendChild(h('button', { class: 'btn', type: 'button', text: e[0], onclick: function () { loadState(e[1](), 'study'); } })); });
    $('engver').textContent = 'v' + C.version;
    initTabs();
    var loaded = false;
    if (/^#d=/.test(location.hash)) { try { S = mergeState(JSON.parse(b64dec(location.hash.slice(3)))); loaded = true; } catch (e) { } }
    if (!loaded) S = exTwoArm();
    renderStudy(); renderScn(); renderDesign(); renderSim(); renderResults(); renderSave();
    window.addEventListener('hashchange', function () { if (/^#d=/.test(location.hash)) { try { loadState(mergeState(JSON.parse(b64dec(location.hash.slice(3)))), 'study'); } catch (e) { } } });
  }
  NSim.studio = { buildDesign: buildDesign, blank: function () { return blank(); }, engineAgg: engineAgg, scnKey: scnKey, pinMatch: pinMatch, state: function () { return S; }, results: function () { return R; } };
  if (typeof document !== 'undefined' && document.getElementById('examples')) init();
})();
