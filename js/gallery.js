/* Conference photo gallery: filterable grid + keyboard-accessible lightbox. Reads data/gallery.js.
 * <section data-gallery="2025|all" data-limit="8" hidden> ... <div class="gallery__filters"> ... <div class="gallery__grid">
 * A section stays hidden when no photos match. */
(function () {
  'use strict';
  var all = window.POPAN_GALLERY || [];
  var box, img, cap, count, list, idx, opener;

  function build() {
    box = document.createElement('div'); box.className = 'lightbox'; box.hidden = true;
    box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Photo viewer');
    box.innerHTML = '<button type="button" class="lightbox__close" aria-label="Close">&times;</button><button type="button" class="lightbox__nav lightbox__prev" aria-label="Previous photo">&#8249;</button><figure><img alt=""><figcaption></figcaption><p class="lightbox__count" aria-live="polite"></p></figure><button type="button" class="lightbox__nav lightbox__next" aria-label="Next photo">&#8250;</button>';
    document.body.appendChild(box);
    img = box.querySelector('img'); cap = box.querySelector('figcaption'); count = box.querySelector('.lightbox__count');
    box.querySelector('.lightbox__close').addEventListener('click', close);
    box.querySelector('.lightbox__prev').addEventListener('click', function () { show(idx - 1); });
    box.querySelector('.lightbox__next').addEventListener('click', function () { show(idx + 1); });
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    var sx = null;
    box.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1)); sx = null; });
    box.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(idx - 1);
      else if (e.key === 'ArrowRight') show(idx + 1);
      else if (e.key === 'Tab') {
        var f = box.querySelectorAll('button'), first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }
  function show(i) {
    idx = (i + list.length) % list.length; var p = list[idx];
    img.src = p.src; img.alt = p.alt || ''; cap.textContent = p.caption || ''; cap.hidden = !p.caption;
    count.textContent = (idx + 1) + ' of ' + list.length;
  }
  function open(l, i, from) { if (!box) build(); list = l; opener = from; show(i); box.hidden = false; document.body.style.overflow = 'hidden'; box.querySelector('.lightbox__close').focus(); }
  function close() { box.hidden = true; document.body.style.overflow = ''; if (opener && document.contains(opener) && opener.tabIndex >= 0) opener.focus(); }

  /* Home photo reel: two rows of thumbnails, moved horizontally by js/scroll.js (GSAP). */
  document.querySelectorAll('[data-reel]').forEach(function (root) {
    var year = root.dataset.reel;
    var photos = all.filter(function (p) { return year === 'all' || String(p.year) === year; });
    if (photos.length < 6) return;
    var rows = [photos.filter(function (_, i) { return i % 2 === 0; }), photos.filter(function (_, i) { return i % 2 === 1; })];
    rows.forEach(function (set) {
      var row = document.createElement('div'); row.className = 'reel__row';
      var track = document.createElement('div'); track.className = 'reel__track';
      set.forEach(function (p) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'reel__item';
        b.tabIndex = -1; /* keyboard users reach every photo through the full gallery page */
        var im = document.createElement('img'); im.src = p.thumb || p.src; im.alt = p.alt || ''; im.loading = 'lazy'; im.decoding = 'async';
        if (p.w && p.h) { im.width = Math.round(p.w / 4); im.height = Math.round(p.h / 4); }
        b.appendChild(im);
        b.addEventListener('click', function () { open(photos, photos.indexOf(p), b); });
        track.appendChild(b);
      });
      row.appendChild(track); root.appendChild(row);
    });
    root.hidden = false;
  });

  document.querySelectorAll('[data-gallery]').forEach(function (root) {
    var year = root.dataset.gallery, limit = parseInt(root.dataset.limit || '0', 10);
    var photos = all.filter(function (p) { return year === 'all' || String(p.year) === year; });
    if (!photos.length) return;
    var grid = root.querySelector('.gallery__grid');
    var filters = root.querySelector('.gallery__filters');
    var current = 'All';

    function render() {
      grid.innerHTML = '';
      var shown = photos.filter(function (p) { return current === 'All' || p.cat === current; });
      if (limit) shown = shown.slice(0, limit);
      shown.forEach(function (p, i) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'gallery__item';
        if (p.w && p.h) b.style.aspectRatio = p.w + ' / ' + p.h;
        var im = document.createElement('img'); im.loading = 'lazy'; im.decoding = 'async'; im.src = p.thumb || p.src; im.alt = p.alt || '';
        if (p.w && p.h) { im.width = Math.round(p.w / 2); im.height = Math.round(p.h / 2); }
        var s = document.createElement('span'); s.className = 'sr-only'; s.textContent = 'Enlarge photo';
        b.appendChild(im); b.appendChild(s);
        b.addEventListener('click', function () { open(shown, i, b); });
        grid.appendChild(b);
      });
      var st = root.querySelector('.gallery__status');
      if (st) st.textContent = 'Showing ' + shown.length + (limit ? '' : ' of ' + photos.length) + ' photographs';
    }
    if (filters) {
      var cats = ['All'];
      photos.forEach(function (p) { if (p.cat && cats.indexOf(p.cat) === -1) cats.push(p.cat); });
      cats.forEach(function (c) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = c;
        b.setAttribute('aria-pressed', String(c === current));
        b.addEventListener('click', function () {
          current = c;
          filters.querySelectorAll('.chip').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
          render();
        });
        filters.appendChild(b);
      });
    }
    render(); root.hidden = false;
  });
})();
