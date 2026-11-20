/* Form validation and submission.
 *
 * The site is static and has no server, so a form can be delivered in one of two ways:
 *   1. data-endpoint="https://…"  -> the form is POSTed as JSON with fetch()
 *      (use this to connect Formspree, Netlify Forms, your own API, etc.).
 *   2. no endpoint (default)      -> the validated message opens in the visitor's
 *      email application, addressed to data-mailto, ready to send.
 * See README.md, "Connecting the forms".
 */
(function () {
  'use strict';

  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function fieldOf(el) { return el.closest('.field'); }

  function message(el) {
    var v = el.value.trim();
    if (el.required && !v) return el.dataset.requiredMsg || 'This field is required.';
    if (el.type === 'email' && v && !EMAIL.test(v)) return 'Enter a valid email address, for example name@example.com.';
    if (el.dataset.min && v.length < Number(el.dataset.min)) return 'Please write at least ' + el.dataset.min + ' characters.';
    return '';
  }

  function show(el, msg) {
    var f = fieldOf(el);
    if (!f) return;
    var err = f.querySelector('.error');
    f.classList.toggle('has-error', !!msg);
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (err) err.textContent = msg;
  }

  function status(form, text, kind) {
    var box = form.querySelector('.form__status');
    if (!box) return;
    box.textContent = text;
    box.classList.add('is-visible');
    box.classList.toggle('is-error', kind === 'error');
  }

  function compose(form, data) {
    var lines = [];
    form.querySelectorAll('.field').forEach(function (f) {
      var input = f.querySelector('input,select,textarea');
      var label = f.querySelector('label');
      if (!input || !label || input.name === 'website') return;
      var v = (input.value || '').trim();
      var name = (label.dataset.short || label.childNodes[0].textContent).trim();
      if (v) lines.push(name + ': ' + v);
    });
    return lines.join('\n');
  }

  document.querySelectorAll('form[data-form]').forEach(function (form) {
    var controls = Array.prototype.slice.call(form.querySelectorAll('input:not([name="website"]),select,textarea'));

    controls.forEach(function (el) {
      el.addEventListener('blur', function () { if (el.value !== '' || fieldOf(el).classList.contains('has-error')) show(el, message(el)); });
      el.addEventListener('input', function () { if (fieldOf(el).classList.contains('has-error')) show(el, message(el)); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      // Honeypot: bots fill the hidden field.
      var hp = form.querySelector('input[name="website"]');
      if (hp && hp.value) return;

      var firstBad = null;
      controls.forEach(function (el) {
        var m = message(el);
        show(el, m);
        if (m && !firstBad) firstBad = el;
      });
      if (firstBad) {
        status(form, 'Please correct the highlighted fields and try again.', 'error');
        firstBad.focus();
        return;
      }

      var subject = form.dataset.subject || 'Website enquiry';
      var body = compose(form);
      var endpoint = form.dataset.endpoint;
      var btn = form.querySelector('[type="submit"]');

      if (endpoint) {
        var payload = {};
        controls.forEach(function (el) { payload[el.name] = el.value.trim(); });
        payload._subject = subject;
        btn.disabled = true;
        fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(payload) })
          .then(function (r) { if (!r.ok) throw new Error('bad status'); status(form, 'Thank you. Your message has been sent to the Secretariat.'); form.reset(); })
          .catch(function () { status(form, 'Your message could not be sent. Please email ' + form.dataset.mailto + ' directly.', 'error'); })
          .then(function () { btn.disabled = false; });
        return;
      }

      var to = form.dataset.mailto;
      var href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      status(form, 'Your email application should now open with this message ready to send to ' + to + '. If nothing opens, copy the details and email them to that address.');
      window.location.href = href;
    });
  });
})();
