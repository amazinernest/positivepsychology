/* Hover and focus states for every link and button, animated with Motion (https://motion.dev).
 * One delegated listener, so links and buttons created later (gallery, lightbox, chat) behave the same. */
(function () {
  'use strict';
  var M = window.Motion;
  if (!M || !M.animate) return;
  document.documentElement.classList.add('motion');
  var animate = M.animate;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ease = [0.22, 1, 0.36, 1];
  var dur = reduce ? 0.001 : 0.35;
  var state = new WeakMap();

  var SEL = 'a[href], button, [role="tab"], .gallery__item, .reel__item, summary, label[for]';

  function cs(el, p) { return getComputedStyle(el)[p]; }

  /* Describe what changes for each kind of control: [target, props-on, props-off-from-computed] */
  function plan(el) {
    var inFooter = !!el.closest('.site-footer');
    if (el.closest('.lightbox') && el.tagName === 'BUTTON') return { el: el, on: { backgroundColor: '#ffffff', color: '#0e1b2c' }, keys: ['backgroundColor', 'color'] };
    if (el.matches('.btn')) {
      if (el.matches('.btn--outline,.btn--light,.btn--ghost-light')) return { el: el, on: { backgroundColor: '#0e1b2c', color: '#f6f7f5' }, keys: ['backgroundColor', 'color'] };
      return { el: el, on: { backgroundColor: '#955500', borderColor: '#955500' }, keys: ['backgroundColor', 'borderColor'] };
    }
    if (el.matches('.nav-toggle,.sub-toggle,.to-top,.wa__fab,.wa__close')) {
      if (el.matches('.to-top')) return { el: el, on: { backgroundColor: '#955500' }, keys: ['backgroundColor'] };
      if (el.matches('.wa__fab')) return { el: el, on: { backgroundColor: '#0e1b2c', color: '#f6f7f5' }, keys: ['backgroundColor', 'color'] };
      return { el: el, on: { color: '#955500' }, keys: ['color'] };
    }
    if (el.matches('.gallery__item,.reel__item')) {
      var img = el.querySelector('img');
      return img ? { el: img, on: { scale: 1.04 }, keys: ['scale'], scaleOnly: true } : null;
    }
    if (el.matches('.nav__link')) return { el: el, on: { textDecorationColor: '#955500' }, keys: ['textDecorationColor'], offset: '.38em' };
    if (el.closest('.mega')) {
      var t = el.querySelector('.mega__title');
      return { el: el, on: { x: 8 }, keys: ['x'], extra: t ? { el: t, on: { color: '#955500' }, keys: ['color'] } : null };
    }
    if (el.matches('.tab,.chip,.toc a')) return { el: el, on: { color: '#0e1b2c' }, keys: ['color'] };
    if (inFooter) return { el: el, on: { color: '#e8b25c', textDecorationColor: '#e8b25c' }, keys: ['color', 'textDecorationColor'] };
    if (el.matches('.brand')) return { el: el, on: { opacity: 0.72 }, keys: ['opacity'] };
    /* ordinary text links */
    return { el: el, on: { color: '#955500', textDecorationColor: '#955500' }, keys: ['color', 'textDecorationColor'], offset: '.34em' };
  }

  function run(p, on) {
    var from = state.get(p.el) || {};
    var target = {};
    /* animate border colour per side: the shorthand cannot be read back from computed style */
    var keys = [];
    p.keys.forEach(function (k) {
      if (k === 'borderColor') ['borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor'].forEach(function (s) { p.on[s] = p.on.borderColor; keys.push(s); });
      else keys.push(k);
    });
    keys.forEach(function (k) {
      if (on) {
        if (!(k in from)) from[k] = k === 'x' ? 0 : k === 'scale' ? 1 : k === 'opacity' ? 1 : cs(p.el, k);
        target[k] = p.on[k];
      } else target[k] = from[k];
    });
    if (p.offset) { if (on) { if (!('textUnderlineOffset' in from)) from.textUnderlineOffset = cs(p.el, 'textUnderlineOffset'); target.textUnderlineOffset = p.offset; } else target.textUnderlineOffset = from.textUnderlineOffset; }
    state.set(p.el, from);
    var a = animate(p.el, target, { duration: p.scaleOnly ? 0.6 : dur, ease: ease });
    if (!on) {
      var done = function () { if (!p.el.matches(':hover')) { state.delete(p.el); /* hand control back to the stylesheet */ ['color','backgroundColor','borderColor','borderTopColor','borderRightColor','borderBottomColor','borderLeftColor','textDecorationColor','textUnderlineOffset','opacity','transform','scale'].forEach(function (k) { p.el.style[k] = ''; }); } };
      if (a && a.then) a.then(done, function () {}); else done();
    }
    if (p.extra) run(p.extra, on);
  }

  function enter(el) { var p = plan(el); if (p) run(p, true); }
  function leave(el) { var p = plan(el); if (p) run(p, false); }

  document.addEventListener('pointerover', function (e) {
    if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    var el = e.target.closest && e.target.closest(SEL);
    if (!el || (e.relatedTarget && el.contains(e.relatedTarget))) return;
    if (el.disabled || el.getAttribute('aria-current') === 'page' && el.matches('.nav__link')) return;
    enter(el);
  });
  document.addEventListener('pointerout', function (e) {
    if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    var el = e.target.closest && e.target.closest(SEL);
    if (!el || (e.relatedTarget && el.contains(e.relatedTarget))) return;
    leave(el);
  });
  /* Keyboard focus gets the same state as hover */
  document.addEventListener('focusin', function (e) {
    var el = e.target.closest && e.target.closest(SEL);
    if (el && el.matches(':focus-visible') && !el.matches('.reel__item')) enter(el);
  });
  document.addEventListener('focusout', function (e) {
    var el = e.target.closest && e.target.closest(SEL);
    if (el && !el.matches(':hover')) leave(el);
  });
})();
