/* WhatsApp chat launcher: opens a chat with the President's number, with an optional pre-filled message. */
(function () {
  'use strict';
  var NUMBER = '2348034105253';
  var WHO = 'the President';
  var wrap = document.createElement('div');
  wrap.className = 'wa';
  wrap.innerHTML =
    '<div class="wa__panel" id="wa-panel" role="dialog" aria-labelledby="wa-title" hidden>' +
      '<div class="wa__head"><strong id="wa-title">Chat on WhatsApp</strong><button type="button" class="wa__close" aria-label="Close chat">&times;</button></div>' +
      '<form class="wa__body" novalidate>' +
        '<p>Send a message to ' + WHO + ' of PoPAN. It opens in WhatsApp, and replies come to you there.</p>' +
        '<label for="wa-name">Your name</label><input id="wa-name" type="text" autocomplete="name">' +
        '<label for="wa-msg">Message</label><textarea id="wa-msg" rows="3">Hello, I am contacting you from the PoPAN website. </textarea>' +
        '<button type="submit" class="btn btn--sm">Open WhatsApp</button>' +
        '<p class="wa__fine">Your message is sent through WhatsApp, not stored on this website. WhatsApp must be installed, or use WhatsApp Web.</p>' +
      '</form>' +
    '</div>' +
    '<button type="button" class="wa__fab" aria-expanded="false" aria-controls="wa-panel"><svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" width="26" height="26"><path fill="currentColor" d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm0 2.4a10.6 10.6 0 1 1-5.6 19.6l-.4-.2-3.9 1 1-3.8-.3-.4A10.6 10.6 0 0 1 16 5.4zm-4 5.2c-.3 0-.7.1-1 .5-.4.4-1.3 1.2-1.3 3s1.4 3.5 1.5 3.7c.2.3 2.6 4.1 6.4 5.6 3.1 1.2 3.7 1 4.4.9.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.6.2-1.8-.1-.2-.3-.3-.7-.5l-2.300-1.100c-.3-.1-.5-.2-.8.2l-1 1.200c-.2.200-.4.300-.7.100-.4-.2-1.400-.5-2.700-1.700-1-.9-1.600-2-1.800-2.300-.2-.4 0-.5.200-.7l.5-.6c.2-.2.200-.4.400-.6.100-.3.100-.5 0-.7l-1.100-2.600c-.3-.7-.6-.6-.8-.6z"/></svg><span>Chat with us</span></button>';
  document.body.appendChild(wrap);
  var fab = wrap.querySelector('.wa__fab'), panel = wrap.querySelector('.wa__panel');
  function setOpen(o) {
    panel.hidden = !o; fab.setAttribute('aria-expanded', String(o));
    if (o) wrap.querySelector('#wa-name').focus(); else fab.focus();
  }
  fab.addEventListener('click', function () { setOpen(panel.hidden); });
  wrap.querySelector('.wa__close').addEventListener('click', function () { setOpen(false); });
  wrap.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) setOpen(false); });
  wrap.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();
    var name = wrap.querySelector('#wa-name').value.trim();
    var msg = wrap.querySelector('#wa-msg').value.trim() || 'Hello, I am contacting you from the PoPAN website.';
    if (name) msg += '\n\n' + name;
    var url = 'https://wa.me/' + NUMBER + '?text=' + encodeURIComponent(msg);
    var w = window.open(url, '_blank');
    if (w) { w.opener = null; } else { window.location.href = url; }
  });
})();
