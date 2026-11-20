/* UI behaviours: reveal on scroll, back-to-top, in-page contents, tabs. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Reveal on scroll ---------------------------------------------------- */
  var items = document.querySelectorAll('[data-reveal]');
  if (items.length) {
    if (!('IntersectionObserver' in window) || reduce) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
      items.forEach(function (el) { io.observe(el); });
    }
  }

  /* Back to top --------------------------------------------------------- */
  var topBtn = document.querySelector('.to-top');
  if (topBtn) {
    var tick = false;
    window.addEventListener('scroll', function () {
      if (tick) return;
      tick = true;
      window.requestAnimationFrame(function () {
        topBtn.classList.toggle('is-visible', window.scrollY > 700);
        tick = false;
      });
    }, { passive: true });
    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      var skip = document.querySelector('.skip-link');
      if (skip) { skip.focus({ preventScroll: true }); skip.blur(); }
    });
  }

  /* In-page contents (scroll-spy) --------------------------------------- */
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll('.toc a[href^="#"]'));
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    var targets = [];
    tocLinks.forEach(function (a) {
      var t = document.getElementById(a.getAttribute('href').slice(1));
      if (t) { map[t.id] = a; targets.push(t); }
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          tocLinks.forEach(function (l) { l.classList.remove('is-active'); l.removeAttribute('aria-current'); });
          var link = map[en.target.id];
          if (link) { link.classList.add('is-active'); link.setAttribute('aria-current', 'true'); }
        }
      });
    }, { rootMargin: '-96px 0px -70% 0px', threshold: 0 });
    targets.forEach(function (t) { spy.observe(t); });
  }

  /* Tabs ---------------------------------------------------------------- */
  document.querySelectorAll('[data-tabs]').forEach(function (root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });

    function select(i, focus, updateHash) {
      tabs.forEach(function (t, n) {
        var on = n === i;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        if (panels[n]) panels[n].hidden = !on;
      });
      if (focus) tabs[i].focus();
      if (updateHash && history.replaceState) history.replaceState(null, '', '#' + tabs[i].getAttribute('aria-controls'));
    }

    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(i, false, true); });
      t.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
        else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') n = 0;
        else if (e.key === 'End') n = tabs.length - 1;
        if (n !== null) { e.preventDefault(); select(n, true, true); }
      });
    });

    var start = 0;
    var hash = window.location.hash.slice(1);
    panels.forEach(function (p, n) { if (p && p.id === hash) start = n; });
    select(start, false, false);

    window.addEventListener('hashchange', function () {
      var h = window.location.hash.slice(1);
      panels.forEach(function (pn, n) { if (pn && pn.id === h) select(n, false, false); });
    });

    // Links elsewhere on the page that point at a tab panel.
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      panels.forEach(function (p, n) {
        if (p && p.id === id && !root.contains(a)) {
          a.addEventListener('click', function () { select(n, false, false); });
        }
      });
    });
  });
})();
