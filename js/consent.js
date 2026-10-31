/* Aviso de cookies + Google Analytics só depois do consentimento (LGPD). */
(function () {
  'use strict';
  var d = document, KEY = 'mann-consent';
  var cfg = window.MANN || {};
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  var gaLoaded = false;
  function loadGA() {
    if (gaLoaded || !/^G-[A-Z0-9]{6,}$/.test(cfg.GA_ID || '')) return;
    gaLoaded = true;
    var s = d.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + cfg.GA_ID;
    d.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', cfg.GA_ID, { anonymize_ip: true });
  }

  var box = null;
  function build() {
    if (box) return box;
    box = d.createElement('div');
    box.className = 'cookie';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-labelledby', 'ck-t');
    box.setAttribute('aria-describedby', 'ck-d');
    box.hidden = true;
    box.innerHTML =
      '<div class="cookie-txt"><strong id="ck-t">Cookies de análise</strong>' +
      '<p id="ck-d">Usamos cookies para entender como o site é usado e melhorá-lo. Você escolhe. Detalhes na <a href="privacidade.html">Política de Privacidade</a>.</p></div>' +
      '<div class="cookie-btns"><button type="button" class="btn btn-ghost sm" data-ck="denied">Recusar</button>' +
      '<button type="button" class="btn btn-primary sm" data-ck="granted">Aceitar</button></div>';
    d.body.appendChild(box);
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ck]'); if (!b) return;
      var v = b.getAttribute('data-ck'); set(v); hide();
      if (v === 'granted') loadGA();
    });
    return box;
  }
  function show() { build().hidden = false; d.body.classList.add('has-cookie'); }
  function hide() { if (box) box.hidden = true; d.body.classList.remove('has-cookie'); }

  var saved = get();
  if (saved === 'granted') loadGA();
  else if (!saved) setTimeout(show, 900);

  d.addEventListener('click', function (e) {
    var a = e.target.closest('[data-cookie-settings]');
    if (a) { e.preventDefault(); show(); }
  });
  var ys = d.querySelectorAll('.yr');
  for (var i = 0; i < ys.length; i++) ys[i].textContent = new Date().getFullYear();
})();
