/* Member register: live search. */
(function () {
  'use strict';
  var input = document.getElementById('register-search');
  var list = document.getElementById('register-list');
  var count = document.getElementById('register-count');
  if (!input || !list) return;

  var rows = Array.prototype.slice.call(list.querySelectorAll('li'));
  var total = rows.length;

  function norm(s) { return s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim(); }
  var index = rows.map(function (li) { return norm(li.dataset.name || li.textContent); });

  function run() {
    var terms = norm(input.value).split(' ').filter(Boolean);
    var shown = 0;
    rows.forEach(function (li, i) {
      var ok = terms.every(function (t) { return index[i].indexOf(t) !== -1; });
      li.hidden = !ok;
      if (ok) shown++;
    });
    count.textContent = terms.length
      ? 'Showing ' + shown + ' of ' + total + ' entries'
      : 'Showing all ' + total + ' entries';
  }

  input.addEventListener('input', run);
  run();
})();
