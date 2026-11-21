/* Payments page: show relevant fields, copy account number. */
(function () {
  'use strict';
  var type = document.getElementById('p-type');
  var gy = document.getElementById('g-years'), gm = document.getElementById('g-ms');
  var years = document.getElementById('p-years');
  if (type && gy) {
    var cur = String(new Date().getFullYear());
    type.addEventListener('change', function () {
      var r = type.value === 'renewal';
      gy.hidden = !r; if (gm) gm.hidden = type.value !== 'journal';
      if (years) { years.required = r; if (r && !years.value) years.value = cur; }
    });
  }
  var btn = document.querySelector('[data-copy]');
  if (btn) btn.addEventListener('click', function () {
    var t = document.querySelector(btn.dataset.copy).textContent.trim();
    var st = document.getElementById('copy-status');
    function done(ok) { if (st) st.textContent = ok ? 'Account number copied' : 'Copy failed; select the number and copy it manually'; btn.textContent = ok ? 'Copied' : 'Copy number'; setTimeout(function () { btn.textContent = 'Copy number'; }, 2000); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function () { done(true); }, function () { done(false); });
    else done(false);
  });
})();
