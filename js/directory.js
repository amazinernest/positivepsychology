/* Member register: live search. */
(function () {
  'use strict';
  var input = document.getElementById('register-search');
  var list = document.getElementById('register-list');
  var count = document.getElementById('register-count');
  if (!input || !list) return;

  var filter = document.getElementById('register-filter');
  var dues = window.POPAN_DUES || {};
  var rows = Array.prototype.slice.call(list.querySelectorAll('li'));
  var total = rows.length;

  function norm(s) { return s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim(); }
  var index = rows.map(function (li) { return norm(li.dataset.name || li.textContent); });

  rows.forEach(function (li) {
    var y = dues[li.dataset.n], cell = li.querySelector('.dues');
    li.dataset.paid = y ? '1' : '0';
    if (!cell) return;
    if (y) { cell.className = 'dues dues--paid'; cell.innerHTML = '<span aria-hidden="true">\u2713</span> ' + y; cell.setAttribute('aria-label', 'Annual dues recorded up to ' + y); cell.title = 'Dues recorded up to ' + y; }
    else { cell.className = 'dues dues--none'; cell.innerHTML = '<span aria-hidden="true">\u2013</span>'; cell.setAttribute('aria-label', 'No annual dues recorded'); }
  });

  function run() {
    var f = filter ? filter.value : 'all';
    var terms = norm(input.value).split(' ').filter(Boolean);
    var shown = 0;
    rows.forEach(function (li, i) {
      var ok = terms.every(function (t) { return index[i].indexOf(t) !== -1; }) &&
        (f === 'all' || (f === 'paid') === (li.dataset.paid === '1'));
      li.hidden = !ok;
      if (ok) shown++;
    });
    count.textContent = (terms.length || f !== 'all')
      ? 'Showing ' + shown + ' of ' + total + ' entries'
      : 'Showing all ' + total + ' entries';
  }

  input.addEventListener('input', run);
  if (filter) filter.addEventListener('change', run);
  run();
})();
