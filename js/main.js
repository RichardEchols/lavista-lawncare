/* Lavista · main.js (from the RMDW premium template)
   Load choreography, growth-ring drawing, scroll reveals, parallax,
   lazy video, counters, allocation bars, nav, menu, contact form. */
(function () {
  'use strict';
  var d = document, root = d.documentElement, body = d.body;
  root.classList.remove('no-js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Loader ---------- */
  var loader = d.getElementById('loader');
  var readyDone = false;
  function ready() {
    if (readyDone) return; readyDone = true;
    if (loader) loader.classList.add('done');
    body.classList.remove('is-loading');
    body.classList.add('is-ready');
    setTimeout(function () { if (loader && loader.parentNode) loader.parentNode.removeChild(loader); }, 1500);
  }
  var minWait = new Promise(function (r) { setTimeout(r, reduce ? 0 : 1250); });
  var loaded = new Promise(function (r) {
    if (d.readyState === 'complete') r(); else window.addEventListener('load', r, { once: true });
  });
  Promise.all([minWait, loaded]).then(ready);
  setTimeout(ready, 4500);

  /* ---------- Growth rings (hero) ---------- */
  var rings = d.getElementById('rings');
  if (rings) {
    var seed = 19870;
    var rnd = function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    var NS = 'http://www.w3.org/2000/svg';
    var r = 22, i = 0, frag = d.createDocumentFragment();
    while (r < 486) {
      var c = d.createElementNS(NS, 'circle');
      var drift = i / 34;
      c.setAttribute('cx', (500 + (rnd() - .5) * 26 * drift).toFixed(2));
      c.setAttribute('cy', (500 + (rnd() - .5) * 26 * drift).toFixed(2));
      c.setAttribute('r', r.toFixed(2));
      c.setAttribute('pathLength', '1');
      c.style.strokeWidth = (0.45 + rnd() * 1.4).toFixed(2);
      c.style.opacity = (0.3 + rnd() * 0.7).toFixed(2);
      c.style.transitionDelay = (i * 55) + 'ms';
      frag.appendChild(c);
      r += 5 + rnd() * 15; i++;
    }
    rings.appendChild(frag);
  }

  /* ---------- Nav ---------- */
  var nav = d.getElementById('nav');
  function onScroll() { if (nav) nav.classList.toggle('scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  var burger = d.getElementById('burger'), menu = d.getElementById('menu');
  function setMenu(open) {
    if (!menu || !burger) return;
    menu.classList.toggle('open', open);
    burger.classList.toggle('open', open);
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

  /* ---------- Marquee (duplicate for a seamless loop) ---------- */
  Array.prototype.forEach.call(d.querySelectorAll('.marquee__track'), function (t) { t.innerHTML += t.innerHTML; });

  /* ---------- Scroll reveals ---------- */
  var revealTargets = d.querySelectorAll('.reveal, .alloc');
  if ('IntersectionObserver' in window) {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    Array.prototype.forEach.call(revealTargets, function (el) { rio.observe(el); });
  } else {
    Array.prototype.forEach.call(revealTargets, function (el) { el.classList.add('in'); });
  }

  /* ---------- Video: hero plays immediately, the rest load near the viewport ---------- */
  function markLive(v) { var wrap = v.closest('.media'); if (wrap) wrap.classList.add('is-live'); }
  Array.prototype.forEach.call(d.querySelectorAll('video'), function (v) {
    v.addEventListener('playing', function () { markLive(v); }, { once: true });
    if (v.readyState >= 3 && !v.paused) markLive(v);
  });
  var lazyVids = d.querySelectorAll('video[data-src]');
  if (reduce) {
    Array.prototype.forEach.call(d.querySelectorAll('video'), function (v) { try { v.pause(); } catch (e) {} v.removeAttribute('autoplay'); });
  } else if ('IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) {
          if (!v.getAttribute('src')) { v.setAttribute('src', v.getAttribute('data-src')); v.load(); }
          var p = v.play(); if (p && p.catch) p.catch(function () {});
        } else if (v.getAttribute('src')) { v.pause(); }
      });
    }, { rootMargin: '480px 0px' });
    Array.prototype.forEach.call(lazyVids, function (v) { vio.observe(v); });
    var hero = d.querySelector('.media--hero video');
    if (hero) { var hp = hero.play(); if (hp && hp.catch) hp.catch(function () {}); }
  } else {
    Array.prototype.forEach.call(lazyVids, function (v) { v.setAttribute('src', v.getAttribute('data-src')); });
  }

  /* ---------- Parallax ---------- */
  var px = Array.prototype.slice.call(d.querySelectorAll('[data-parallax]'));
  if (px.length && !reduce) {
    var ticking = false;
    var update = function () {
      var vh = window.innerHeight;
      px.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > vh + 200) return;
        var p = (rect.top + rect.height / 2 - vh / 2) / vh;
        var strength = parseFloat(el.getAttribute('data-parallax')) || 40;
        el.style.setProperty('--py', (-p * strength).toFixed(1) + 'px');
      });
      ticking = false;
    };
    window.addEventListener('scroll', function () { if (!ticking) { window.requestAnimationFrame(update); ticking = true; } }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------- Counters ---------- */
  function fmt(n, dec) { return n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }); }
  var counters = d.querySelectorAll('[data-count]');
  function runCounter(el) {
    var end = parseFloat(el.getAttribute('data-count'));
    var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var pre = el.getAttribute('data-prefix') || '', suf = el.getAttribute('data-suffix') || '';
    if (reduce) { el.textContent = pre + fmt(end, dec) + suf; return; }
    var dur = 1900, t0 = null;
    function step(now) {
      if (!t0) t0 = now;
      var t = Math.min(1, (now - t0) / dur);
      var eased = 1 - Math.pow(1 - t, 4);
      el.textContent = pre + fmt(end * eased, dec) + suf;
      if (t < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { cio.unobserve(e.target); runCounter(e.target); } });
    }, { threshold: 0.5 });
    Array.prototype.forEach.call(counters, function (c) {
      if (!reduce) { c.textContent = (c.getAttribute('data-prefix') || '') + fmt(0, parseInt(c.getAttribute('data-decimals') || '0', 10)) + (c.getAttribute('data-suffix') || ''); }
      cio.observe(c);
    });
  }

  /* ---------- Contact form ---------- */
  var form = d.getElementById('contact-form');
  if (form) {
    var err = form.querySelector('.form__error');
    var btn = form.querySelector('button[type="submit"]');
    var label = btn ? btn.querySelector('span') : null;
    var original = label ? label.textContent : '';
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var ok = true;
      Array.prototype.forEach.call(form.querySelectorAll('[required]'), function (f) {
        var bad = !f.value || (f.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value));
        var field = f.closest('.field'); if (field) field.classList.toggle('invalid', bad);
        if (bad) ok = false;
      });
      if (!ok) { err.hidden = false; err.textContent = 'Please complete the highlighted fields.'; return; }
      err.hidden = true;
      if (btn) btn.disabled = true; if (label) label.textContent = 'Sending';
      var data = {};
      Array.prototype.forEach.call(form.elements, function (el) { if (el.name) data[el.name] = el.value; });
      data.source = 'lavista-site';
      var endpoint = form.getAttribute('data-endpoint');
      var done = function () {
        form.hidden = true;
        var s = d.getElementById('form-success'); if (s) { s.hidden = false; s.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      };
      var fail = function () {
        if (btn) btn.disabled = false; if (label) label.textContent = original;
        err.hidden = false; err.textContent = 'Something went wrong on our side. Please email info@rmdwllc.com and we will call you back.';
      };
      if (endpoint) {
        fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data) })
          .then(function (res) { if (!res.ok) throw new Error('bad status'); done(); })
          .catch(fail);
      } else {
        setTimeout(done, 900);
      }
    });
    Array.prototype.forEach.call(form.querySelectorAll('input, select, textarea'), function (f) {
      f.addEventListener('input', function () { var field = f.closest('.field'); if (field) field.classList.remove('invalid'); });
    });
  }

  /* ---------- Footer year ---------- */
  var y = d.getElementById('year'); if (y) y.textContent = String(new Date().getFullYear());
})();
