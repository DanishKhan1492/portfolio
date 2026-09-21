(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme ---------- */
  var KEY = 'dk-theme';
  var stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) {}
  var preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', stored || preferred);

  var themeBtn = document.getElementById('theme');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', next === 'dark' ? '#0A1310' : '#F6F3EC');
    });
  }

  /* ---------- Ready state (hero entrance) ---------- */
  requestAnimationFrame(function () { root.classList.add('ready'); });

  /* ---------- Scroll progress + sticky nav ---------- */
  var bar = document.getElementById('progress');
  var nav = document.getElementById('nav');
  var ticking = false;

  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    if (bar) bar.style.width = pct.toFixed(2) + '%';
    if (nav) nav.classList.toggle('stuck', h.scrollTop > 24);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById('menu');
  var mobile = document.getElementById('mobile');

  function closeMenu() {
    if (!mobile || mobile.hidden) return;
    mobile.hidden = true;
    menuBtn.setAttribute('aria-expanded', 'false');
  }
  if (menuBtn && mobile) {
    menuBtn.addEventListener('click', function () {
      var open = !mobile.hidden;
      mobile.hidden = open;
      menuBtn.setAttribute('aria-expanded', String(!open));
    });
    mobile.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* ---------- Reveal on scroll (with stagger) ---------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  reveals.forEach(function (el) {
    var sibs = el.parentElement ? Array.prototype.filter.call(el.parentElement.children, function (c) {
      return c.classList && c.classList.contains('reveal');
    }) : [];
    el.style.setProperty('--i', Math.max(0, sibs.indexOf(el)) % 6);
  });

  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Active nav link ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.links a[href^="#"]'));
  var sections = links.map(function (a) {
    return document.querySelector(a.getAttribute('href'));
  }).filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Smooth anchor with nav offset ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    if (!id) return;
    var t = document.getElementById(id);
    if (!t) return;
    e.preventDefault();
    var top = t.getBoundingClientRect().top + window.pageYOffset - (nav ? nav.offsetHeight + 16 : 0);
    window.scrollTo({ top: Math.max(0, top), behavior: reduce ? 'auto' : 'smooth' });
    if (history.replaceState) history.replaceState(null, '', '#' + id);
  });

  /* ---------- Footer year ---------- */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = String(new Date().getFullYear());
})();
