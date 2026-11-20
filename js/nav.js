/* Navigation: mobile menu, dropdowns, header state. */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var header = document.querySelector('.site-header');
  var nav = document.getElementById('site-nav');
  var toggle = document.querySelector('.nav-toggle');
  if (!nav || !toggle) return;

  var mobileQuery = window.matchMedia('(max-width: 1180px)');

  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('nav-open', open);
    if (!open) closeAllSubs();
  }

  function closeAllSubs(except) {
    nav.querySelectorAll('.nav__item.is-open').forEach(function (item) {
      if (item === except) return;
      item.classList.remove('is-open');
      var b = item.querySelector('.sub-toggle');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  }

  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });

  nav.querySelectorAll('.sub-toggle').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var item = btn.closest('.nav__item');
      var open = !item.classList.contains('is-open');
      closeAllSubs(item);
      item.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  // Close dropdowns when clicking elsewhere, or with Escape.
  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target)) closeAllSubs();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var openItem = nav.querySelector('.nav__item.is-open');
    if (openItem) {
      var b = openItem.querySelector('.sub-toggle');
      closeAllSubs();
      if (b) b.focus();
    } else if (nav.classList.contains('is-open')) {
      setMenu(false);
      toggle.focus();
    }
  });

  // Close the drawer when a link is followed (same-page anchors) or viewport grows.
  nav.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (a && mobileQuery.matches) setMenu(false);
  });
  var onChange = function () { if (!mobileQuery.matches) setMenu(false); };
  if (mobileQuery.addEventListener) mobileQuery.addEventListener('change', onChange);
  else mobileQuery.addListener(onChange);

  // Header shadow once the page scrolls.
  if (header) {
    var ticking = false;
    var update = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }
})();
