/* ============================================================
   CHEFS & GASTRONOMIE — interactions (robuste, sans IntersectionObserver)
   ============================================================ */
(function () {
  'use strict';

  /* JS actif → autorise les états cachés des animations.
     (Sans JS, tout reste visible : progressive enhancement.) */
  document.documentElement.classList.add('js');

  /* ---- Preloader ---- */
  function hidePreloader() {
    var pre = document.getElementById('preloader');
    if (pre) pre.classList.add('is-hidden');
  }
  window.addEventListener('load', function () { setTimeout(hidePreloader, 1300); });
  // filet de sécurité : ne jamais bloquer l'écran
  setTimeout(hidePreloader, 4000);

  /* ---- Année ---- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---- Nav + barre de progression ---- */
  var nav = document.getElementById('nav');
  var progress = document.getElementById('scrollProgress');
  function onScroll() {
    var st = window.scrollY || document.documentElement.scrollTop;
    if (nav) nav.classList.toggle('is-scrolled', st > 60);
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (st / h) * 100 : 0) + '%';
    }
  }

  /* ---- Menu mobile ---- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobileMenu');
  function toggleMenu(force) {
    var open = force !== undefined ? force : !menu.classList.contains('is-open');
    menu.classList.toggle('is-open', open);
    nav.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger) burger.addEventListener('click', function () { toggleMenu(); });
  if (menu) menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { toggleMenu(false); });
  });

  /* ---- Apparition au scroll (basée sur la position, fiable partout) ---- */
  var revealEls = [].slice.call(document.querySelectorAll('.reveal, .reveal-img'));
  function revealInView() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    for (var i = revealEls.length - 1; i >= 0; i--) {
      var el = revealEls[i];
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > -10) {
        el.classList.add('is-in');
        revealEls.splice(i, 1);
      }
    }
  }
  // Filet de sécurité absolu : tout révéler après 3,5 s quoi qu'il arrive
  setTimeout(function () {
    document.querySelectorAll('.reveal, .reveal-img').forEach(function (el) {
      el.classList.add('is-in');
    });
  }, 3500);

  /* ---- Compteur 4.6 ---- */
  var statEl = document.querySelector('.stat__num[data-count]');
  var counted = false;
  function maybeCount() {
    if (counted || !statEl) return;
    var r = statEl.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    if (r.top < vh * 0.85 && r.bottom > 0) {
      counted = true;
      var target = parseFloat(statEl.dataset.count), t0 = performance.now(), dur = 1200;
      (function tick(now) {
        var p = Math.min((now - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        statEl.textContent = (target * eased).toFixed(1);
        if (p < 1) requestAnimationFrame(tick); else statEl.textContent = target.toFixed(1);
      })(t0);
    }
  }

  /* ---- Parallaxe hero + grande image ---- */
  var heroVideo = document.querySelector('.hero__video');
  var heroContent = document.querySelector('.hero__content');
  var showcaseImg = document.getElementById('showcaseImg');
  var showcaseSec = document.querySelector('.showcase');
  function parallax() {
    var st = window.scrollY;
    var vh = window.innerHeight;
    if (st < vh) {
      if (heroVideo) heroVideo.style.transform = 'translateY(' + st * 0.16 + 'px) scale(1.06)';
      if (heroContent) {
        heroContent.style.transform = 'translateY(' + st * 0.26 + 'px)';
        heroContent.style.opacity = Math.max(0, 1 - st / (vh * 0.82));
      }
    }
    if (showcaseImg && showcaseSec) {
      var rc = showcaseSec.getBoundingClientRect();
      if (rc.bottom > 0 && rc.top < vh) {
        var prog = (vh - rc.top) / (vh + rc.height);
        showcaseImg.style.transform = 'translateY(' + (prog - 0.5) * 16 + '%) scale(1.12)';
      }
    }
  }

  /* ---- Boucle scroll unique ---- */
  function tick() {
    onScroll();
    revealInView();
    maybeCount();
    parallax();
  }
  window.addEventListener('scroll', tick, { passive: true });
  window.addEventListener('resize', tick);
  window.addEventListener('load', tick);
  tick();
  // quelques passes au démarrage (images/polices qui décalent la mise en page)
  setTimeout(tick, 200);
  setTimeout(tick, 600);
  setTimeout(tick, 1200);

  /* ---- Ancres avec décalage du header ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      ev.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

})();
