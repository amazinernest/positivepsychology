/* Conference photo gallery with lightbox. Reads data/gallery.js; the section stays hidden when no photos are listed. */
(function () {
  'use strict';
  document.querySelectorAll('[data-gallery]').forEach(function (root) {
    var year = root.dataset.gallery;
    var photos = (window.POPAN_GALLERY || []).filter(function (p) { return year === 'all' || String(p.year) === year; });
    if (!photos.length) return;
    var grid = root.querySelector('.gallery__grid');
    photos.forEach(function (p, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'gallery__item';
      b.innerHTML = '<img loading="lazy" alt=""><span class="sr-only"></span>';
      b.querySelector('img').src = p.src; b.querySelector('img').alt = p.alt || '';
      b.querySelector('.sr-only').textContent = 'Enlarge photo' + (p.caption ? ': ' + p.caption : '');
      b.addEventListener('click', function () { open(i, b); });
      grid.appendChild(b);
    });
    root.hidden = false;

    var box, img, cap, idx, opener;
    function build() {
      box = document.createElement('div'); box.className = 'lightbox'; box.hidden = true;
      box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Photo viewer');
      box.innerHTML = '<button type="button" class="lightbox__close" aria-label="Close">&times;</button><button type="button" class="lightbox__nav lightbox__prev" aria-label="Previous photo">&#8249;</button><figure><img alt=""><figcaption></figcaption></figure><button type="button" class="lightbox__nav lightbox__next" aria-label="Next photo">&#8250;</button>';
      document.body.appendChild(box);
      img = box.querySelector('img'); cap = box.querySelector('figcaption');
      box.querySelector('.lightbox__close').addEventListener('click', close);
      box.querySelector('.lightbox__prev').addEventListener('click', function () { show(idx - 1); });
      box.querySelector('.lightbox__next').addEventListener('click', function () { show(idx + 1); });
      box.addEventListener('click', function (e) { if (e.target === box) close(); });
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
    function show(i) { idx = (i + photos.length) % photos.length; img.src = photos[idx].src; img.alt = photos[idx].alt || ''; cap.textContent = photos[idx].caption || ''; }
    function open(i, from) { if (!box) build(); opener = from; show(i); box.hidden = false; document.body.style.overflow = 'hidden'; box.querySelector('.lightbox__close').focus(); }
    function close() { box.hidden = true; document.body.style.overflow = ''; if (opener) opener.focus(); }
  });
})();
