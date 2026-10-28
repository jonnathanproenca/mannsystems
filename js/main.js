(function () {
  'use strict';
  var d = document, root = d.documentElement;
  var reduce = window.matchMedia('(prefers-color-scheme: no-preference)') && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };

  /* ---------- tema ---------- */
  var KEY = 'mann-theme';
  function getSaved() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  var saved = getSaved();
  var dark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  function applyTheme() {
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    var m = $('meta[name="theme-color"]'); if (m) m.setAttribute('content', dark ? '#070B22' : '#1E3799');
    var fav = $('link[rel="icon"]'); if (fav) fav.href = (dark ? 'images/Logo-Dark.ico' : 'images/Logo.ico');
  }
  applyTheme();
  var themeBtn = $('#theme');
  if (themeBtn) themeBtn.addEventListener('click', function () { dark = !dark; save(dark ? 'dark' : 'light'); applyTheme(); });

  /* ---------- menu mobile ---------- */
  var burger = $('#burger'), menu = $('#menu');
  function closeMenu() { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
  burger.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', closeMenu); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* ---------- scroll: progresso, nav, voltar ao topo, método ---------- */
  var bar = $('.progress span'), nav = $('#nav'), toTop = $('#totop');
  var steps = $('#steps'), stepsLine = steps && $('.steps-line', steps);
  var ticking = false;
  function onScroll() {
    var y = window.scrollY || root.scrollTop;
    var h = root.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    nav.classList.toggle('scrolled', y > 20);
    toTop.classList.toggle('show', y > 700);
    if (steps) {
      var r = steps.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, (window.innerHeight * 0.85 - r.top) / (r.height + 120)));
      steps.style.setProperty('--p', p.toFixed(3));
      if (stepsLine) stepsLine.style.setProperty('--p', p.toFixed(3));
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  /* ---------- link ativo no menu ---------- */
  var links = $$('.menu a'), map = {};
  links.forEach(function (a) { map[a.getAttribute('href')] = a; });
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          links.forEach(function (l) { l.classList.remove('on'); });
          var a = map['#' + e.target.id]; if (a) a.classList.add('on');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(function (s) { spy.observe(s); });

    /* ---------- revelar ao rolar ---------- */
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e, i) {
        if (e.isIntersecting) {
          var t = e.target, sibs = t.parentElement ? $$('.reveal', t.parentElement) : [];
          var delay = (t.tagName === 'LI') ? sibs.indexOf(t) * 110 : 0;
          setTimeout(function () { t.classList.add('vis'); }, delay);
          io.unobserve(t);
        }
      });
    }, { threshold: 0.12 });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('vis'); });
  }

  /* ---------- hero: montagem da logo + paralaxe ---------- */
  var pieces = $$('.piece');
  pieces.forEach(function (p) { p.classList.add('in'); });
  var stage = $('#stage');
  if (stage && !reduce && window.matchMedia('(pointer:fine)').matches) {
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
    var loop = function () {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      pieces.forEach(function (p) {
        var k = parseFloat(p.getAttribute('data-depth')) / 14;
        p.style.setProperty('--px', (cx * k).toFixed(2) + 'px');
        p.style.setProperty('--py', (cy * k).toFixed(2) + 'px');
      });
      raf = (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) ? requestAnimationFrame(loop) : null;
    };
    var kick = function () { if (!raf) raf = requestAnimationFrame(loop); };
    d.querySelector('.hero').addEventListener('mousemove', function (e) {
      var r = stage.getBoundingClientRect();
      tx = ((e.clientX - (r.left + r.width / 2)) / r.width) * 16;
      ty = ((e.clientY - (r.top + r.height / 2)) / r.height) * 16;
      kick();
    });
    d.querySelector('.hero').addEventListener('mouseleave', function () { tx = 0; ty = 0; kick(); });
  }

  /* ---------- botão magnético ---------- */
  if (!reduce && window.matchMedia('(pointer:fine)').matches) {
    $$('.magnetic').forEach(function (b) {
      b.addEventListener('mousemove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.18) + 'px,' + ((e.clientY - r.top - r.height / 2) * 0.25 - 2) + 'px)';
      });
      b.addEventListener('mouseleave', function () { b.style.transform = ''; });
    });
  }

  /* ---------- acordeão de serviços ---------- */
  var items = $$('.acc-item');
  function openItem(item) {
    items.forEach(function (it) {
      var on = it === item;
      it.classList.toggle('is-open', on);
      $('.acc-tab', it).setAttribute('aria-expanded', String(on));
    });
  }
  items.forEach(function (it) {
    var tab = $('.acc-tab', it);
    tab.addEventListener('click', function () { openItem(it); });
    if (window.matchMedia('(hover:hover) and (min-width:861px)').matches) {
      it.addEventListener('mouseenter', function () { if (!it.classList.contains('is-open')) openItem(it); });
    }
  });

  /* ---------- abas missão / visão / valores ---------- */
  var tabs = $$('[role="tab"]'), panels = $$('[role="tabpanel"]');
  function selectTab(t, focus) {
    tabs.forEach(function (x) { var on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; });
    panels.forEach(function (p) { var on = p.id === t.getAttribute('aria-controls'); p.hidden = !on; p.classList.toggle('is-on', on); });
    if (focus) t.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { selectTab(t); });
    t.addEventListener('keydown', function (e) {
      var n = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (n) { e.preventDefault(); selectTab(n, true); }
    });
  });

  /* ---------- inclinação 3D das fotos ---------- */
  var media = $('#tilt');
  if (media && !reduce && window.matchMedia('(pointer:fine)').matches) {
    var phs = $$('.ph', media);
    media.addEventListener('mousemove', function (e) {
      var r = media.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      phs.forEach(function (p, i) {
        var k = (i + 1) * 4;
        p.style.transform = 'rotateY(' + (x * k) + 'deg) rotateX(' + (-y * k) + 'deg) translate(' + (x * k * 2) + 'px,' + (y * k * 2) + 'px)';
      });
    });
    media.addEventListener('mouseleave', function () { phs.forEach(function (p) { p.style.transform = ''; }); });
  }

  /* ---------- formulário (sem backend: abre WhatsApp ou e-mail) ---------- */
  var form = $('#form'), note = $('#form-note');
  var tel = $('#f-tel');
  if (tel) tel.addEventListener('input', function () {
    var v = tel.value.replace(/\D/g, '').slice(0, 11), o = v;
    if (v.length > 6) o = '(' + v.slice(0, 2) + ') ' + v.slice(2, v.length - 4) + '-' + v.slice(-4);
    else if (v.length > 2) o = '(' + v.slice(0, 2) + ') ' + v.slice(2);
    tel.value = o;
  });
  var via = 'wa';
  $$('button[type="submit"]', form).forEach(function (b) { b.addEventListener('click', function () { via = b.getAttribute('data-via'); }); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    $$('.field', form).forEach(function (f) {
      var i = $('input,textarea', f), bad = !i.value.trim() || (i.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i.value));
      f.classList.toggle('bad', bad); if (bad) ok = false;
    });
    note.className = 'form-note';
    if (!ok) { note.textContent = 'Preencha todos os campos com um e-mail válido para continuar.'; note.classList.add('err'); return; }
    var n = $('#f-name').value.trim(), m = $('#f-email').value.trim(), t = tel.value.trim(), msg = $('#f-msg').value.trim();
    var text = 'Olá, sou ' + n + '.\n\n' + msg + '\n\nE-mail: ' + m + '\nTelefone: ' + t;
    if (via === 'wa') {
      window.open('https://api.whatsapp.com/send/?phone=5511960817141&text=' + encodeURIComponent(text), '_blank', 'noopener');
      note.textContent = 'Abrimos o WhatsApp com a sua mensagem pronta. É só enviar.';
    } else {
      window.location.href = 'mailto:jonnathan-lemos@hotmail.com?subject=' + encodeURIComponent('Contato pelo site: ' + n) + '&body=' + encodeURIComponent(text);
      note.textContent = 'Abrimos o seu e-mail com a mensagem pronta. É só enviar.';
    }
    note.classList.add('ok');
  });
  $$('.field input,.field textarea', form).forEach(function (i) { i.addEventListener('input', function () { i.parentElement.classList.remove('bad'); }); });

  var y = $('#year'); if (y) y.textContent = new Date().getFullYear();
})();
