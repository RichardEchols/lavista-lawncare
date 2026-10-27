/* Kiyomi storefront · kiyomi.js
   Loader, bloom motif, nav, marquee, reveals, lazy video, counters,
   benchmark bars, FAQ, endpoint copy, terminal tilt, web-app notice. */
(function () {
  'use strict';
  var d = document, root = d.documentElement, body = d.body;
  root.classList.remove('no-js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var desktop = window.matchMedia('(min-width: 900px)').matches;
  var NS = 'http://www.w3.org/2000/svg';

  /* ---------- Bloom motif: five-petal rings ---------- */
  function petalPath(cx, cy, R, lobe, rot) {
    var pts = [], n = 160;
    for (var i = 0; i <= n; i++) {
      var t = (i / n) * Math.PI * 2;
      var r = R * (1 - lobe + lobe * Math.cos(5 * (t - rot)));
      pts.push((cx + r * Math.cos(t)).toFixed(2) + ',' + (cy + r * Math.sin(t)).toFixed(2));
    }
    return 'M' + pts.join('L') + 'Z';
  }
  function bloom(svg, rings, maxR, delayStep) {
    if (!svg) return;
    var seed = 5150;
    var rnd = function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    var frag = d.createDocumentFragment();
    for (var i = 0; i < rings; i++) {
      var p = d.createElementNS(NS, 'path');
      var R = maxR * (0.12 + 0.88 * (i / (rings - 1)));
      var lobe = 0.16 + rnd() * 0.06;
      var rot = (i % 2) * 0.05 + rnd() * 0.04;
      p.setAttribute('d', petalPath(500, 500, R, lobe, rot));
      p.setAttribute('pathLength', '1');
      p.style.strokeWidth = (0.5 + rnd() * 1.1).toFixed(2);
      p.style.opacity = (0.3 + rnd() * 0.7).toFixed(2);
      p.style.transitionDelay = (i * delayStep) + 'ms';
      p.style.animationDelay = (i * delayStep) + 'ms';
      frag.appendChild(p);
    }
    svg.appendChild(frag);
  }
  bloom(d.getElementById('bloom'), 22, 470, 70);
  bloom(d.getElementById('loader-bloom'), 5, 470, 110);

  /* ---------- Loader ---------- */
  var loader = d.getElementById('loader'), readyDone = false;
  function ready() {
    if (readyDone) return; readyDone = true;
    if (loader) loader.classList.add('done');
    body.classList.remove('is-loading');
    body.classList.add('is-ready');
    setTimeout(function () { if (loader && loader.parentNode) loader.parentNode.removeChild(loader); }, 1500);
  }
  var minWait = new Promise(function (r) { setTimeout(r, reduce ? 0 : 1150); });
  var loaded = new Promise(function (r) { if (d.readyState === 'complete') r(); else window.addEventListener('load', r, { once: true }); });
  Promise.all([minWait, loaded]).then(ready);
  setTimeout(ready, 4000);

  /* ---------- Nav ---------- */
  var nav = d.getElementById('nav');
  function onScroll() { if (nav) nav.classList.toggle('scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var burger = d.getElementById('burger'), menu = d.getElementById('menu');
  function setMenu(open) {
    if (!menu || !burger) return;
    menu.classList.toggle('open', open); burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    body.classList.toggle('menu-open', open);
  }
  if (burger && menu) {
    burger.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
    Array.prototype.forEach.call(menu.querySelectorAll('a'), function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* ---------- Marquee ---------- */
  var TICK = ['Private by physics', 'US-based, Atlanta', 'Flat rate, no meter', 'Jah 5.0', 'Ties Claude Opus 5 on RMDW Bench', 'Outscores Claude Fable 5', '1M token context', 'Open weights, MIT', 'OpenAI + Anthropic compatible', 'Key in 60 seconds'];
  var track = d.getElementById('tick-track');
  if (track) { var html = TICK.map(function (t) { return '<span>' + t + '</span>'; }).join(''); track.innerHTML = html + html; }

  /* ---------- Reveals + benchmark bars ---------- */
  var targets = d.querySelectorAll('.reveal, .bench');
  if ('IntersectionObserver' in window) {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    Array.prototype.forEach.call(targets, function (el) { rio.observe(el); });
  } else { Array.prototype.forEach.call(targets, function (el) { el.classList.add('in'); }); }

  /* ---------- Video ---------- */
  function markLive(v) { var w = v.closest('.media'); if (w) w.classList.add('is-live'); }
  Array.prototype.forEach.call(d.querySelectorAll('video'), function (v) {
    v.addEventListener('playing', function () { markLive(v); }, { once: true });
    if (v.readyState >= 3 && !v.paused) markLive(v);
  });
  var lazy = d.querySelectorAll('video[data-src]');
  if (reduce) {
    Array.prototype.forEach.call(d.querySelectorAll('video'), function (v) { try { v.pause(); } catch (e) {} v.removeAttribute('autoplay'); });
  } else if ('IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) {
          if (v.hasAttribute('data-desktop') && !desktop) return;   /* phones get the poster, not 10+ MB of video */
          if (!v.getAttribute('src')) { v.setAttribute('src', v.getAttribute('data-src')); v.load(); }
          var p = v.play(); if (p && p.catch) p.catch(function () {});
        } else if (v.getAttribute('src')) { v.pause(); }
      });
    }, { rootMargin: '500px 0px' });
    Array.prototype.forEach.call(lazy, function (v) { vio.observe(v); });
  }
  Array.prototype.forEach.call(d.querySelectorAll('video[autoplay]'), function (v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); });

  /* ---------- Counters ---------- */
  function fmt(n, dec) { return n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }); }
  var counters = d.querySelectorAll('[data-count]');
  function run(el) {
    var end = parseFloat(el.getAttribute('data-count')), dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var pre = el.getAttribute('data-prefix') || '', suf = el.getAttribute('data-suffix') || '';
    if (reduce) { el.textContent = pre + fmt(end, dec) + suf; return; }
    var dur = 1700, t0 = null;
    function step(now) { if (!t0) t0 = now; var t = Math.min(1, (now - t0) / dur); var k = 1 - Math.pow(1 - t, 4); el.textContent = pre + fmt(end * k, dec) + suf; if (t < 1) window.requestAnimationFrame(step); }
    window.requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) { entries.forEach(function (e) { if (e.isIntersecting) { cio.unobserve(e.target); run(e.target); } }); }, { threshold: 0.5 });
    Array.prototype.forEach.call(counters, function (c) {
      if (!reduce) c.textContent = (c.getAttribute('data-prefix') || '') + fmt(0, parseInt(c.getAttribute('data-decimals') || '0', 10)) + (c.getAttribute('data-suffix') || '');
      cio.observe(c);
    });
  }

  /* ---------- FAQ ---------- */
  Array.prototype.forEach.call(d.querySelectorAll('.faq-q'), function (q) {
    q.addEventListener('click', function () {
      var item = q.parentElement, open = item.classList.toggle('open');
      q.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* ---------- Endpoint copy ---------- */
  Array.prototype.forEach.call(d.querySelectorAll('[data-copy]'), function (el) {
    el.addEventListener('click', function () {
      var text = el.getAttribute('data-copy'), tag = el.querySelector('.cp');
      var done = function () { if (tag) { tag.textContent = 'Copied'; setTimeout(function () { tag.textContent = 'Copy'; }, 1800); } };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done); else done();
    });
  });

  /* ---------- Terminal tilt ---------- */
  var tilt = d.getElementById('tilt-term');
  if (tilt && !reduce && window.matchMedia('(pointer:fine)').matches) {
    tilt.addEventListener('mousemove', function (e) {
      var r = tilt.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.transform = 'perspective(1100px) rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 6) + 'deg)';
    });
    tilt.addEventListener('mouseleave', function () { tilt.style.transform = ''; });
  }

  /* ---------- Web app notice (same storage key as before) ---------- */
  var appbar = d.getElementById('appbar'), appbarX = d.getElementById('appbar-x');
  try { if (appbar && localStorage.getItem('kj-appbar-dismissed')) appbar.classList.add('hide'); } catch (e) {}
  if (appbarX) appbarX.addEventListener('click', function () { appbar.classList.add('hide'); try { localStorage.setItem('kj-appbar-dismissed', '1'); } catch (e) {} });

  var y = d.getElementById('year'); if (y) y.textContent = String(new Date().getFullYear());
})();
