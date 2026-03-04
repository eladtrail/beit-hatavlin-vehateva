/* ============================================================
   בית התבלין והטבע — Interactive Scripts
   ============================================================ */

'use strict';

/* ── Navbar: scroll effect ──────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 70);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* ── Mobile hamburger menu ──────────────────────────────────── */
(function initMobileMenu() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-label', isOpen ? 'סגור תפריט' : 'פתח תפריט');
  });

  // Close when any mobile link is clicked
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
    });
  });
})();


/* ── Smooth scroll for anchor links ────────────────────────── */
(function initSmoothScroll() {
  const NAV_OFFSET = 80;

  document.addEventListener('click', e => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;

    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });
  });
})();


/* ── Active nav link on scroll ──────────────────────────────── */
(function initActiveNav() {
  const sections  = Array.from(document.querySelectorAll('section[id]'));
  const navLinks  = document.querySelectorAll('.nav-links a[href^="#"]');
  const OFFSET    = 160;

  const update = () => {
    const scrollY = window.scrollY + OFFSET;
    let current   = '';

    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop) current = sec.id;
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
})();


/* ── Intersection Observer: reveal animations ───────────────── */
(function initReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-right, .reveal-left');
  if (!targets.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // fire once
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

  targets.forEach(el => observer.observe(el));
})();


/* ── Hero parallax (lightweight) ────────────────────────────── */
(function initHeroParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  // Only on devices that can handle it smoothly
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight * 1.5) {
          heroBg.style.transform = `translateY(${y * 0.28}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();


/* ── Hero floating particles ────────────────────────────────── */
(function initParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const PARTICLE_COUNT = 18;
  const colors = [
    'rgba(212,175,55,.55)',
    'rgba(196,133,42,.45)',
    'rgba(82,183,136,.35)',
    'rgba(255,255,255,.25)',
  ];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size    = Math.random() * 4 + 2;
    const left    = Math.random() * 100;
    const delay   = Math.random() * 10;
    const dur     = Math.random() * 12 + 10;
    const color   = colors[Math.floor(Math.random() * colors.length)];

    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${left}%;
      animation-duration:${dur}s;
      animation-delay:${delay}s;
      background:${color};
      border-radius:50%;
    `;
    container.appendChild(p);
  }
})();


/* ── Animated counters ──────────────────────────────────────── */
(function initCounters() {
  const stats = document.querySelectorAll('.stat-number[data-target]');
  if (!stats.length) return;

  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const dur    = 1600;
    const start  = Date.now();

    const tick = () => {
      const elapsed  = Date.now() - start;
      const progress = Math.min(elapsed / dur, 1);
      const value    = Math.floor(easeOutCubic(progress) * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statEls = entry.target.querySelectorAll('.stat-number[data-target]');
        statEls.forEach((el, i) => {
          setTimeout(() => animateCounter(el), i * 180);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const statsBlock = document.querySelector('.about-stats');
  if (statsBlock) observer.observe(statsBlock);
})();


/* ── WhatsApp float: hide on contact section ────────────────── */
(function initWaFloat() {
  const wa      = document.querySelector('.wa-float');
  const contact = document.getElementById('contact');
  if (!wa || !contact) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      wa.style.opacity     = entry.isIntersecting ? '0' : '1';
      wa.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
    });
  }, { threshold: 0.3 });

  observer.observe(contact);
})();


/* ── Lazy-load map iframe ────────────────────────────────────── */
(function initLazyMap() {
  const mapWrap = document.querySelector('.map-wrap');
  if (!mapWrap) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const iframe = mapWrap.querySelector('iframe[loading="lazy"]');
        if (iframe) {
          // Force load
          iframe.setAttribute('loading', 'eager');
        }
        observer.unobserve(mapWrap);
      }
    });
  }, { rootMargin: '300px' });

  observer.observe(mapWrap);
})();


/* ── Year in footer ─────────────────────────────────────────── */
(function setFooterYear() {
  const el = document.querySelector('.footer-bottom p');
  if (el) {
    el.textContent = el.textContent.replace('2025', new Date().getFullYear());
  }
})();
