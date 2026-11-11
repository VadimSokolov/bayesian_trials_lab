/* Bayesian Clinical Trials Lab kit. Plain script, one global: Lab. No dependencies. */
(function (root) {
  'use strict';
  var Lab = {};

  /* ---------- RNG and samplers ---------- */
  // mulberry32: seeded uniform(0,1) generator; returns a function.
  Lab.rng = function (seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  // One standard normal draw (Box-Muller) from uniform generator r.
  Lab.normal = function (r) {
    var u = 1 - r(), v = r();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  // One Gamma(shape k, scale 1) draw (Marsaglia-Tsang, with boost for k < 1).
  Lab.gamma = function (r, k) {
    if (k < 1) return Lab.gamma(r, k + 1) * Math.pow(1 - r(), 1 / k);
    var d = k - 1 / 3, c = 1 / Math.sqrt(9 * d);
    for (;;) {
      var x = Lab.normal(r), v = 1 + c * x;
      if (v <= 0) continue;
      v = v * v * v;
      var u = 1 - r();
      if (Math.log(u) < 0.5 * x * x + d - d * v + d * Math.log(v)) return d * v;
    }
  };
  // One Beta(a, b) draw via two gammas.
  Lab.beta = function (r, a, b) {
    var x = Lab.gamma(r, a), y = Lab.gamma(r, b);
    return x / (x + y);
  };
  // One Binomial(n, p) draw by summing n Bernoulli trials.
  Lab.binomial = function (r, n, p) {
    var k = 0;
    for (var i = 0; i < n; i++) if (r() < p) k++;
    return k;
  };
  // Array of n draws from sampler f(r) using generator r.
  Lab.draws = function (n, r, f) {
    var out = new Array(n);
    for (var i = 0; i < n; i++) out[i] = f(r);
    return out;
  };

  /* ---------- Special functions and distributions ---------- */
  var LG = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
  // Natural log of the gamma function (Lanczos).
  Lab.lgamma = function (x) {
    var y = x, t = x + 5.5, s = 1.000000000190015;
    t -= (x + 0.5) * Math.log(t);
    for (var j = 0; j < 6; j++) s += LG[j] / ++y;
    return -t + Math.log(2.5066282746310005 * s / x);
  };
  // Log of the beta function B(a, b).
  Lab.lbeta = function (a, b) { return Lab.lgamma(a) + Lab.lgamma(b) - Lab.lgamma(a + b); };
  function betacf(a, b, x) {
    var qab = a + b, qap = a + 1, qam = a - 1, c = 1, d = 1 - qab * x / qap, h, m, m2, aa, del;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    d = 1 / d; h = d;
    for (m = 1; m <= 300; m++) {
      m2 = 2 * m;
      aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30;
      c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30;
      d = 1 / d; h *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30;
      c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30;
      d = 1 / d; del = d * c; h *= del;
      if (Math.abs(del - 1) < 3e-14) break;
    }
    return h;
  }
  // Regularized incomplete beta I_x(a, b), which is the Beta(a, b) cdf at x.
  Lab.betaCdf = function (x, a, b) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    var bt = Math.exp(Lab.lgamma(a + b) - Lab.lgamma(a) - Lab.lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
    return x < (a + 1) / (a + b + 2) ? bt * betacf(a, b, x) / a : 1 - bt * betacf(b, a, 1 - x) / b;
  };
  // Beta(a, b) density at x.
  Lab.betaPdf = function (x, a, b) {
    if (x <= 0 || x >= 1) return (x === 0 && a === 1) ? b : (x === 1 && b === 1) ? a : 0;
    return Math.exp((a - 1) * Math.log(x) + (b - 1) * Math.log(1 - x) - Lab.lbeta(a, b));
  };
  // Beta(a, b) mean.
  Lab.betaMean = function (a, b) { return a / (a + b); };
  // Beta(a, b) standard deviation.
  Lab.betaSd = function (a, b) { return Math.sqrt(a * b / ((a + b) * (a + b) * (a + b + 1))); };
  // Beta(a, b) mode (the peak), for a, b > 1; falls back to the mean otherwise.
  Lab.betaMode = function (a, b) { return (a > 1 && b > 1) ? (a - 1) / (a + b - 2) : a / (a + b); };
  // Beta(a, b) quantile at probability p, by bisection on the cdf.
  Lab.betaQuantile = function (p, a, b) {
    var lo = 0, hi = 1;
    for (var i = 0; i < 80; i++) {
      var m = (lo + hi) / 2;
      if (Lab.betaCdf(m, a, b) < p) lo = m; else hi = m;
    }
    return (lo + hi) / 2;
  };
  function gser(a, x) {
    var ap = a, sum = 1 / a, del = sum;
    for (var n = 0; n < 500; n++) { ap++; del *= x / ap; sum += del; if (Math.abs(del) < Math.abs(sum) * 1e-15) break; }
    return sum * Math.exp(-x + a * Math.log(x) - Lab.lgamma(a));
  }
  function gcf(a, x) {
    var b = x + 1 - a, c = 1 / 1e-300, d = 1 / b, h = d, an, del;
    for (var i = 1; i < 500; i++) {
      an = -i * (i - a); b += 2;
      d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300;
      c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300;
      d = 1 / d; del = d * c; h *= del;
      if (Math.abs(del - 1) < 1e-15) break;
    }
    return Math.exp(-x + a * Math.log(x) - Lab.lgamma(a)) * h;
  }
  // Regularized lower incomplete gamma P(a, x).
  Lab.gammaP = function (a, x) {
    if (x <= 0) return 0;
    return x < a + 1 ? gser(a, x) : 1 - gcf(a, x);
  };
  // Chi-square survival function: P(X >= x) with df degrees of freedom (the p-value).
  Lab.chi2Sf = function (x, df) { return x <= 0 ? 1 : 1 - Lab.gammaP(df / 2, x / 2); };
  // Standard normal cdf (via the incomplete gamma function).
  Lab.normalCdf = function (x, mu, sd) {
    mu = mu || 0; sd = sd || 1;
    var z = (x - mu) / (sd * Math.SQRT2), e = Lab.gammaP(0.5, z * z);
    return 0.5 * (1 + (z < 0 ? -e : e));
  };
  // Normal density with mean mu and sd (defaults 0 and 1).
  Lab.normalPdf = function (x, mu, sd) {
    mu = mu || 0; sd = sd || 1;
    var z = (x - mu) / sd;
    return Math.exp(-0.5 * z * z) / (sd * Math.sqrt(2 * Math.PI));
  };
  // Normal quantile at probability p, by bisection.
  Lab.normalQuantile = function (p, mu, sd) {
    var lo = -10, hi = 10;
    for (var i = 0; i < 100; i++) { var m = (lo + hi) / 2; if (Lab.normalCdf(m) < p) lo = m; else hi = m; }
    return (mu || 0) + (sd || 1) * (lo + hi) / 2;
  };
  // Binomial pmf: P(K = k) for n trials with success probability p.
  Lab.binomPmf = function (k, n, p) {
    if (k < 0 || k > n) return 0;
    if (p <= 0) return k === 0 ? 1 : 0;
    if (p >= 1) return k === n ? 1 : 0;
    return Math.exp(Lab.lgamma(n + 1) - Lab.lgamma(k + 1) - Lab.lgamma(n - k + 1) + k * Math.log(p) + (n - k) * Math.log(1 - p));
  };

  /* ---------- Summaries ---------- */
  // Mean of an array.
  Lab.mean = function (xs) { var s = 0; for (var i = 0; i < xs.length; i++) s += xs[i]; return s / xs.length; };
  // Empirical quantile of an array at probability p (linear interpolation; sorts a copy).
  Lab.quantile = function (xs, p) {
    var s = xs.slice().sort(function (a, b) { return a - b; }), h = (s.length - 1) * p, lo = Math.floor(h);
    return s[lo] + (h - lo) * ((s[Math.min(lo + 1, s.length - 1)]) - s[lo]);
  };
  // Fraction of an array satisfying predicate f (Monte Carlo probability).
  Lab.prob = function (xs, f) { var c = 0; for (var i = 0; i < xs.length; i++) if (f(xs[i])) c++; return c / xs.length; };
  // Bin xs into nb equal bins on [lo, hi]; returns {counts, density, edges:[lo,hi], width}.
  Lab.histogram = function (xs, lo, hi, nb) {
    var counts = new Array(nb).fill(0), w = (hi - lo) / nb, n = 0, i, k;
    for (i = 0; i < xs.length; i++) {
      k = Math.floor((xs[i] - lo) / w);
      if (k === nb && xs[i] === hi) k = nb - 1;
      if (k >= 0 && k < nb) { counts[k]++; n++; }
    }
    return { counts: counts, density: counts.map(function (c) { return c / (xs.length * w); }), edges: [lo, hi], width: w };
  };
  // Evenly spaced grid of n points from lo to hi inclusive.
  Lab.linspace = function (lo, hi, n) { var o = []; for (var i = 0; i < n; i++) o.push(lo + (hi - lo) * i / (n - 1)); return o; };
  // Format a number as a percent string with d decimals.
  Lab.pct = function (x, d) { return (100 * x).toFixed(d == null ? 0 : d) + '%'; };

  /* ---------- Animation ---------- */
  // Run fn(t) for t from 0 to 1 over ms milliseconds (ease in-out); returns a handle with cancel().
  Lab.tween = function (ms, fn) {
    var start = null, dead = false, raf = root.requestAnimationFrame || function (f) { return setTimeout(function () { f(Date.now()); }, 16); };
    var reduce = root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var guard;
    function step(now) {
      if (dead) return;
      if (start === null) start = now;
      var t = reduce ? 1 : Math.min(1, (now - start) / ms);
      fn(t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
      if (t < 1) raf(step); else { dead = true; clearTimeout(guard); }
    }
    raf(step);
    // Safety net: if frames are throttled (background tab, headless), still land on the final state.
    guard = setTimeout(function () { if (!dead) { dead = true; fn(1); } }, ms + 150);
    return { cancel: function () { dead = true; clearTimeout(guard); } };
  };

  /* ---------- SVG plot helpers ---------- */
  var NS = 'http://www.w3.org/2000/svg';
  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  // Nice tick positions between lo and hi (about n ticks).
  Lab.ticks = function (lo, hi, n) {
    var raw = (hi - lo) / (n || 5), mag = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / mag;
    var step = (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * mag, out = [];
    for (var v = Math.ceil(lo / step - 1e-9) * step; v <= hi + 1e-9; v += step) out.push(parseFloat((Math.round(v / step) * step).toPrecision(12)));
    return out;
  };
  // Format tick value v for a tick list whose spacing is step (no float noise, fixed decimals).
  Lab.fmtTick = function (v, step) {
    var d = step > 0 ? Math.max(0, Math.min(8, -Math.floor(Math.log10(step) + 1e-9))) : 0;
    var t = v.toFixed(d);
    return Math.abs(v) < Math.pow(10, -d - 1) ? (0).toFixed(d) : t;
  };
  // Plot(svgElement, opts): axes plus layers. opts: xlim, ylim, xlabel, ylabel, w, h, label (aria), xfmt, yfmt (default: clean decimals), xticks [{x,label}] (custom), small (compact margins), legend sits in a row above the plot.
  Lab.Plot = function (svg, opts) {
    var o = Object.assign({ w: 640, h: 360, xlim: [0, 1], ylim: [0, 1], xlabel: '', ylabel: '', label: 'Plot', xfmt: null, yfmt: null }, opts || {});
    var m = o.small ? { l: 44, r: 8, t: 26, b: 44 } : { l: 52, r: 16, t: 32, b: 46 }, P = {}, layers = {}, order = [], legendItems = [];
    var w0 = o.w, h0 = o.h, fixedSize = !!(opts && opts.fixed);
    // Responsive: draw at the container's real width so text is in screen pixels (falls back to opts.w when hidden).
    function measure() {
      var host = svg.parentNode, cw = host && host.clientWidth ? host.clientWidth : 0;
      if (host && host.nodeType === 1 && cw) { var cs = root.getComputedStyle(host); cw -= (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0); }
      return cw > 80 ? Math.floor(cw) : 0;
    }
    function fit() {
      if (fixedSize) return false;
      var cw = measure(); if (!cw) return false;
      var nh = Math.max(o.small ? 130 : 200, Math.round(cw * h0 / w0));
      if (cw === o.w && nh === o.h) return false;
      o.w = cw; o.h = nh; return true;
    }
    fit();
    svg.setAttribute('viewBox', '0 0 ' + o.w + ' ' + o.h);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', o.label);
    svg.classList.add('plot');
    svg.innerHTML = '';
    var gAxes = el('g', {}, svg), gLayers = el('g', {}, svg), gLegend = el('g', {}, svg);
    var iw = o.w - m.l - m.r, ih = o.h - m.t - m.b;
    svg.setAttribute('width', o.w); svg.setAttribute('height', o.h);
    // Map data x to pixel x.
    P.sx = function (x) { return m.l + (x - o.xlim[0]) / (o.xlim[1] - o.xlim[0]) * iw; };
    // Map data y to pixel y.
    P.sy = function (y) { return m.t + ih - (y - o.ylim[0]) / (o.ylim[1] - o.ylim[0]) * ih; };
    function drawAxes() {
      gAxes.innerHTML = '';
      var yt = Lab.ticks(o.ylim[0], o.ylim[1], o.small ? 3 : 5), ys = yt.length > 1 ? yt[1] - yt[0] : 1;
      yt.forEach(function (v) {
        el('line', { x1: m.l, x2: m.l + iw, y1: P.sy(v), y2: P.sy(v), 'class': 'grid' }, gAxes);
        el('text', { x: m.l - 6, y: P.sy(v) + 4, 'text-anchor': 'end' }, gAxes).textContent = o.yfmt ? o.yfmt(v) : Lab.fmtTick(v, ys);
      });
      var xt = o.xticks, xs0 = 1;
      if (!xt) { var xv = Lab.ticks(o.xlim[0], o.xlim[1], o.small ? 4 : 6); xs0 = xv.length > 1 ? xv[1] - xv[0] : 1; xt = xv.map(function (v) { return { x: v, label: o.xfmt ? o.xfmt(v) : Lab.fmtTick(v, xs0) }; }); }
      xt.forEach(function (t) {
        el('line', { x1: P.sx(t.x), x2: P.sx(t.x), y1: m.t + ih, y2: m.t + ih + 5, 'class': 'axis' }, gAxes);
        el('text', { x: P.sx(t.x), y: m.t + ih + 18, 'text-anchor': 'middle' }, gAxes).textContent = t.label;
      });
      el('line', { x1: m.l, x2: m.l + iw, y1: m.t + ih, y2: m.t + ih, 'class': 'axis' }, gAxes);
      el('text', { x: m.l + iw / 2, y: o.h - 6, 'text-anchor': 'middle', 'class': 'axis-label' }, gAxes).textContent = o.xlabel;
      var yl = el('text', { transform: 'rotate(-90)', x: -(m.t + ih / 2), y: o.small ? 10 : 14, 'text-anchor': 'middle', 'class': 'axis-label' }, gAxes);
      yl.textContent = o.ylabel;
    }
    function drawAll() { order.forEach(function (k) { layers[k].draw(); }); }
    // Set the y range and redraw axes and layers.
    P.setYlim = function (lo, hi) { o.ylim = [lo, hi]; drawAxes(); drawAll(); };
    // Set the axis labels.
    P.setLabels = function (xl, yl) { o.xlabel = xl; o.ylabel = yl; drawAxes(); };
    function getLayer(key, make) {
      if (!layers[key]) { layers[key] = make(); order.push(key); }
      return layers[key];
    }
    function animate(L, target, ms) {
      if (L.anim) L.anim.cancel();
      var from = L.cur.slice();
      if (ms === 0 || from.length !== target.length) { L.cur = target.slice(); L.draw(); return; }
      L.anim = Lab.tween(ms || 700, function (t) {
        L.cur = from.map(function (v, i) { return v + (target[i] - v) * t; });
        L.draw();
      });
    }
    // Histogram bars: heights over nb equal bins on [lo, hi]; style {fill, opacity}; animates from previous heights.
    P.bars = function (key, heights, lo, hi, style, ms) {
      var L = getLayer(key, function () {
        var g = el('g', {}, gLayers), l = { g: g, cur: heights.map(function () { return 0; }), style: {} };
        l.draw = function () {
          var nb = l.cur.length, bw = (l.hi - l.lo) / nb;
          while (g.childNodes.length < nb) el('rect', {}, g);
          while (g.childNodes.length > nb) g.removeChild(g.lastChild);
          for (var i = 0; i < nb; i++) {
            var h = Math.min(l.cur[i], o.ylim[1]), r = g.childNodes[i];
            r.setAttribute('x', P.sx(l.lo + i * bw) + 0.5);
            r.setAttribute('width', Math.max(0.5, P.sx(l.lo + (i + 1) * bw) - P.sx(l.lo + i * bw) - 1));
            r.setAttribute('y', P.sy(h));
            r.setAttribute('height', Math.max(0, P.sy(0) - P.sy(h)));
            r.setAttribute('fill', l.style.fill || '#2D8B8B');
            r.setAttribute('opacity', l.style.opacity == null ? 0.8 : l.style.opacity);
          }
        };
        return l;
      });
      L.lo = lo; L.hi = hi; L.style = Object.assign(L.style, style || {});
      animate(L, heights, ms);
    };
    // Line or area over points (xs, ys); style {stroke, width, dash, fill}; animates ys.
    P.line = function (key, xs, ys, style, ms) {
      var L = getLayer(key, function () {
        var g = el('g', {}, gLayers), area = el('path', { stroke: 'none' }, g), path = el('path', { fill: 'none' }, g);
        var l = { g: g, cur: ys.map(function () { return 0; }), style: {} };
        l.draw = function () {
          var d = l.cur.map(function (y, i) { return (i ? 'L' : 'M') + P.sx(l.xs[i]).toFixed(1) + ',' + P.sy(Math.min(y, o.ylim[1] * 1.5)).toFixed(1); }).join('');
          path.setAttribute('d', d);
          path.setAttribute('stroke', l.style.stroke || '#0A1628');
          path.setAttribute('stroke-width', l.style.width || 2);
          if (l.style.dash) path.setAttribute('stroke-dasharray', l.style.dash); else path.removeAttribute('stroke-dasharray');
          if (l.style.fill) {
            area.setAttribute('d', d + 'L' + P.sx(l.xs[l.xs.length - 1]) + ',' + P.sy(0) + 'L' + P.sx(l.xs[0]) + ',' + P.sy(0) + 'Z');
            area.setAttribute('fill', l.style.fill); area.setAttribute('opacity', l.style.opacity || 0.3);
          } else area.removeAttribute('d');
        };
        return l;
      });
      L.xs = xs; L.style = Object.assign(L.style, style || {});
      animate(L, ys, ms);
    };
    // Vertical marker at data x with optional label; style {color, dash}; animates x.
    P.vline = function (key, x, label, style, ms) {
      var L = getLayer(key, function () {
        var g = el('g', {}, gLayers), ln = el('line', {}, g), tx = el('text', { 'class': 'vlabel', 'text-anchor': 'middle' }, g);
        var l = { g: g, cur: [x], style: {} };
        l.draw = function () {
          var px = P.sx(l.cur[0]);
          ln.setAttribute('x1', px); ln.setAttribute('x2', px); ln.setAttribute('y1', m.t); ln.setAttribute('y2', m.t + ih);
          ln.setAttribute('stroke', l.style.color || '#0A1628'); ln.setAttribute('stroke-width', 2);
          if (l.style.dash) ln.setAttribute('stroke-dasharray', l.style.dash);
          tx.setAttribute('x', Math.min(Math.max(px, m.l + 28), m.l + iw - 28)); tx.setAttribute('y', m.t + 12);
          tx.setAttribute('fill', l.style.color || '#0A1628'); tx.textContent = l.label || '';
        };
        return l;
      });
      L.label = label; L.style = Object.assign(L.style, style || {});
      animate(L, [x], ms);
    };
    // Remove a layer by key.
    P.remove = function (key) {
      var L = layers[key]; if (!L) return;
      if (L.anim) L.anim.cancel();
      gLayers.removeChild(L.g); delete layers[key]; order.splice(order.indexOf(key), 1);
    };
    // Legend as a row of swatches above the plot area; items [{label, color, kind: 'box'|'line'|'dash'}]; wraps to a second row if needed.
    P.legend = function (items) {
      gLegend.innerHTML = ''; legendItems = items;
      var fs = o.small ? 7 : 7.2, x = m.l, row = 0;
      items.forEach(function (it) {
        var wdt = 22 + it.label.length * fs + 14;
        if (x + wdt > o.w - m.r && x > m.l) { x = m.l; row++; }
        var y = 14 + row * 14;
        if (it.kind === 'line' || it.kind === 'dash') el('line', { x1: x, x2: x + 14, y1: y - 4, y2: y - 4, stroke: it.color, 'stroke-width': 2, 'stroke-dasharray': it.kind === 'dash' ? '4 3' : '' }, gLegend);
        else el('rect', { x: x, y: y - 10, width: 14, height: 10, fill: it.color, opacity: 0.8 }, gLegend);
        el('text', { x: x + 19, y: y, 'style': o.small ? 'font-size:12px' : '' }, gLegend).textContent = it.label;
        x += wdt;
      });
    };
    // Set the x range and redraw axes and layers.
    P.setXlim = function (lo, hi) { o.xlim = [lo, hi]; drawAxes(); drawAll(); };
    // Convert a pointer clientX to a data x value.
    P.invX = function (cx) { var r = svg.getBoundingClientRect(), px = (cx - r.left) * o.w / r.width; return o.xlim[0] + (px - m.l) / iw * (o.xlim[1] - o.xlim[0]); };
    // Convert a pointer clientY to a data y value.
    P.invY = function (cy) { var r = svg.getBoundingClientRect(), py = (cy - r.top) * o.h / r.height; return o.ylim[0] + (m.t + ih - py) / ih * (o.ylim[1] - o.ylim[0]); };
    // Current y range [lo, hi].
    P.getYlim = function () { return o.ylim.slice(); };
    P.svg = svg;
    drawAxes();
    // Re-measure and redraw (called on resize).
    P.resize = function () {
      if (!fit()) return;
      iw = o.w - m.l - m.r; ih = o.h - m.t - m.b;
      svg.setAttribute('viewBox', '0 0 ' + o.w + ' ' + o.h); svg.setAttribute('width', o.w); svg.setAttribute('height', o.h);
      drawAxes(); drawAll(); if (legendItems.length) P.legend(legendItems);
    };
    var tmr;
    function later() { clearTimeout(tmr); tmr = setTimeout(function () { if (!svg.isConnected) return; P.resize(); }, 120); }
    if (root.ResizeObserver && svg.parentNode) { try { new root.ResizeObserver(later).observe(svg.parentNode); } catch (e) {} }
    else root.addEventListener('resize', later);
    return P;
  };

  // miniPlot(container, opts): small (280x140) Plot for a card reveal; same layer API as Plot (bars, line, vline, legend).
  Lab.miniPlot = function (container, opts) {
    var svg = document.createElementNS(NS, 'svg');
    container.appendChild(svg);
    svg.style.width = '100%';
    var P = Lab.Plot(svg, Object.assign({ w: 280, h: 140, small: true }, opts || {}));
    svg.classList.add('mini');
    return P;
  };

  /* ---------- Score ---------- */
  // Score(el): running "k of n right" display; returns {add(correct)}.
  Lab.Score = function (node) {
    var k = 0, n = 0;
    function show() { node.textContent = n ? k + ' of ' + n + ' right' : 'Score: no guesses yet'; }
    show();
    return { add: function (ok) { n++; if (ok) k++; show(); }, get: function () { return { right: k, total: n }; } };
  };

  /* ---------- QuestionCard ---------- */
  // QuestionCard(container, opts): predict-then-check card.
  // opts: tag, q (text), type 'choice' | 'slider', options [{value,label}] (choice), min/max/step/start/fmt/tol (slider),
  // answer (value or function), onGuess(value) while guessing, onReveal({guess,answer,correct}) to animate the plot,
  // explain (string or function(result)), revealPlot(container, result) to draw a mini plot on reveal (use Lab.miniPlot), score (Lab.Score). Returns {check, reset}.
  Lab.QuestionCard = function (container, opts) {
    var card = document.createElement('div'), guess = null, done = false;
    card.className = 'qcard'; card.setAttribute('data-state', 'guess');
    var html = '<div class="qtag">' + (opts.tag || 'Predict, then check') + '</div><div class="q"></div>';
    card.innerHTML = html;
    card.querySelector('.q').textContent = opts.q;
    var guessBox = document.createElement('div'), btnCheck = document.createElement('button'), out = document.createElement('div');
    btnCheck.className = 'btn primary'; btnCheck.textContent = 'Check'; btnCheck.disabled = true; btnCheck.type = 'button';
    if (opts.type === 'slider') {
      var fmt = opts.fmt || function (v) { return v.toFixed(2); };
      guessBox.className = 'guess';
      guessBox.innerHTML = '<label>Your guess: <output></output><br><input type="range" min="' + opts.min + '" max="' + opts.max + '" step="' + opts.step + '" value="' + opts.start + '"></label>';
      var inp = guessBox.querySelector('input'), outp = guessBox.querySelector('output');
      outp.textContent = '(drag the slider)';
      var move = function () {
        guess = parseFloat(inp.value); outp.textContent = fmt(guess); btnCheck.disabled = done;
        if (opts.onGuess) opts.onGuess(guess);
      };
      inp.addEventListener('input', move);
    } else {
      guessBox.className = 'opts';
      opts.options.forEach(function (op) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'opt'; b.textContent = op.label; b.setAttribute('aria-pressed', 'false');
        b.addEventListener('click', function () {
          if (done) return;
          guess = op.value;
          guessBox.querySelectorAll('.opt').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
          b.setAttribute('aria-pressed', 'true'); btnCheck.disabled = false;
          if (opts.onGuess) opts.onGuess(guess);
        });
        b.dataset.value = String(op.value);
        guessBox.appendChild(b);
      });
    }
    out.setAttribute('aria-live', 'polite');
    card.appendChild(guessBox); card.appendChild(btnCheck); card.appendChild(out);
    function check() {
      if (done || guess === null) return;
      done = true; btnCheck.disabled = true;
      var answer = typeof opts.answer === 'function' ? opts.answer() : opts.answer, ok;
      if (opts.type === 'slider') { ok = Math.abs(guess - answer) <= (opts.tol || 0.05); guessBox.querySelector('input').disabled = true; }
      else {
        ok = guess === answer;
        guessBox.querySelectorAll('.opt').forEach(function (b) {
          b.disabled = true;
          if (b.dataset.value === String(answer)) b.classList.add('right');
          else if (b.getAttribute('aria-pressed') === 'true') b.classList.add('wrong');
        });
      }
      var res = { guess: guess, answer: answer, correct: ok };
      if (opts.score) opts.score.add(ok);
      card.setAttribute('data-state', 'revealed');
      var why = typeof opts.explain === 'function' ? opts.explain(res) : (opts.explain || '');
      var ans = opts.type === 'slider' ? ' Answer: ' + (opts.fmt || function (v) { return v.toFixed(2); })(answer) + '.' : '';
      out.innerHTML = '<div class="verdict ' + (ok ? 'ok' : 'no') + '">' + (ok ? 'Right.' : 'Not quite.') + ans + '</div><div class="why"></div>';
      out.querySelector('.why').textContent = why;
      if (opts.revealPlot) { var mp = document.createElement('div'); mp.className = 'minibox'; out.appendChild(mp); opts.revealPlot(mp, res); }
      if (opts.onReveal) opts.onReveal(res);
    }
    btnCheck.addEventListener('click', check);
    container.appendChild(card);
    return { check: check, el: card };
  };

  /* ---------- CodeBox ---------- */
  // CodeBox(container, {py, r, title}): collapsed details with Python/R tabs and a copy button.
  Lab.CodeBox = function (container, opts) {
    var d = document.createElement('details'), langs = [['Python', opts.py], ['R', opts.r]].filter(function (x) { return x[1]; }), cur = 0;
    d.className = 'code';
    d.innerHTML = '<summary></summary><div class="ctabs"></div><pre><code></code></pre>';
    d.querySelector('summary').textContent = opts.title || 'See the code';
    var tabs = d.querySelector('.ctabs'), code = d.querySelector('code'), btns = [];
    function show(i) { cur = i; code.textContent = langs[i][1]; btns.forEach(function (b, j) { b.classList.toggle('on', j === i); b.setAttribute('aria-pressed', j === i); }); }
    langs.forEach(function (l, i) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'btn'; b.textContent = l[0];
      b.addEventListener('click', function () { show(i); }); tabs.appendChild(b); btns.push(b);
    });
    var cp = document.createElement('button'); cp.type = 'button'; cp.className = 'btn copy'; cp.textContent = 'Copy';
    cp.addEventListener('click', function () {
      var t = langs[cur][1];
      (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { cp.textContent = 'Copied'; }, function () { cp.textContent = 'Press Ctrl+C'; });
      setTimeout(function () { cp.textContent = 'Copy'; }, 1500);
    });
    tabs.appendChild(cp); show(0); container.appendChild(d);
    return d;
  };

  // Hub checkmark: mark this module visited (N from the file name, 00 to 13).
  try {
    var mm = root.location && /(?:^|\/)(\d{2})-[^\/]*\.html/.exec(root.location.pathname);
    if (mm) root.localStorage.setItem('bct-lab-' + parseInt(mm[1], 10), '1');
  } catch (e) {}

  if (typeof module !== 'undefined' && module.exports) module.exports = Lab;
  root.Lab = Lab;
})(typeof window !== 'undefined' ? window : globalThis);
