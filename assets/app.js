/**
 * fastestAI.com — contact link assembly.
 *
 * The address never appears in the served markup as a harvestable string.
 * It is reassembled here from three data-* fragments, at which point the
 * anchor becomes an ordinary, fully accessible mailto: link.
 */
(function () {
  'use strict';

  var link = document.getElementById('contact-email');
  if (!link) return;

  var user = link.getAttribute('data-user');
  var host = link.getAttribute('data-host');
  var tld = link.getAttribute('data-tld');
  if (!user || !host || !tld) return;

  var address = user + String.fromCharCode(64) + host + '.' + tld;
  var subject = 'Acquisition inquiry: fastestAI.com';

  link.href = 'mailto:' + address + '?subject=' + encodeURIComponent(subject);
  link.textContent = address;
  link.setAttribute('aria-label', 'Email ' + address + ' about acquiring fastestAI.com');

  ['data-user', 'data-host', 'data-tld'].forEach(function (attr) {
    link.removeAttribute(attr);
  });
})();
