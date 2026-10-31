(function () {
  'use strict';
  var d = document;
  var els = [].slice.call(d.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else els.forEach(function (el) { el.classList.add('vis'); });

  var lb = d.getElementById('lb'), img = lb.querySelector('img'), last = null;
  function close() { lb.hidden = true; if (last) last.focus(); }
  d.getElementById('gal').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-full]'); if (!b) return;
    last = b; img.src = b.getAttribute('data-full'); img.alt = b.getAttribute('data-alt') || '';
    lb.hidden = false; lb.querySelector('button').focus();
  });
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target.tagName === 'BUTTON') close(); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !lb.hidden) close(); });
})();
