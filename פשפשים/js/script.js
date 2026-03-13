/* ============================================
   script.js — Main JS
   פשפשים — Navbar, Animations, Counters
   ============================================ */

const WA_NUMBER = '972547921821';

/* ── Navbar scroll effect ── */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ── Hamburger menu ── */
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navOverlay = document.querySelector('.nav-overlay');

hamburger?.addEventListener('click', toggleMenu);
navOverlay?.addEventListener('click', closeMenu);

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

function toggleMenu() {
  const open = navLinks?.classList.toggle('open');
  navOverlay?.classList.toggle('show', open);
  hamburger?.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

function closeMenu() {
  navLinks?.classList.remove('open');
  navOverlay?.classList.remove('show');
  hamburger?.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Reveal on scroll ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Stat counters ── */
function animateCounter(el, target, suffix = '') {
  const duration = 2000;
  const start = performance.now();
  const isDecimal = target % 1 !== 0;

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const val = isDecimal
      ? (ease * target).toFixed(1)
      : Math.floor(ease * target);
    el.textContent = val + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      animateCounter(el, target, suffix);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

/* ── WhatsApp helpers ── */
function openWhatsApp(msg = '') {
  const encoded = encodeURIComponent(msg);
  window.open(`https://wa.me/${WA_NUMBER}${msg ? '?text=' + encoded : ''}`, '_blank');
}

/* ── Expose globally ── */
window.openWhatsApp = openWhatsApp;
window.WA_NUMBER = WA_NUMBER;
