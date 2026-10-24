// Fundaserinco — base.js
// Reveal por IntersectionObserver + header theme + mobile drawer + stage.

// Reveal once when an element enters the viewport.
(() => {
  const targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length) return;
  if (!('IntersectionObserver' in window)) { targets.forEach((el) => el.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.1 });
  targets.forEach((el) => io.observe(el));
  window.addEventListener('load', () => setTimeout(() => {
    targets.forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) el.classList.add('is-in'); });
  }, 2500));
})();

// Optional: header ink por capítulo (data-ink). Se usa solo si existe.
(() => {
  const chapters = document.querySelectorAll('[data-ink]');
  if (!chapters.length || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) if (entry.isIntersecting) document.documentElement.style.setProperty('--header-ink', entry.target.dataset.ink);
  }, { rootMargin: '0px 0px -92% 0px', threshold: 0 });
  chapters.forEach((el) => io.observe(el));
})();

// Stage: unfold 3D del plano de 7 losas. Una sola vez.
(() => {
  const stage = document.querySelector('.stage');
  if (!stage) return;
  if (!('IntersectionObserver' in window)) { stage.classList.add('is-in'); return; }
  const io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) { stage.classList.add('is-in'); io.disconnect(); }
  }, { rootMargin: '0px 0px -20% 0px' });
  io.observe(stage);
})();

// Header theme: en páginas mixtas (index), el header cambia a dark
// cuando una sección [data-scene="dark"] está mayormente en viewport.
(() => {
  const scenes = document.querySelectorAll('[data-scene="dark"]');
  if (!scenes.length || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    let anyVisible = false;
    entries.forEach((e) => { if (e.isIntersecting && e.intersectionRatio > 0.35) anyVisible = true; });
    document.body.setAttribute('data-header-theme', anyVisible ? 'dark' : 'light');
  }, { threshold: [0.35, 0.5, 0.7] });
  scenes.forEach((el) => io.observe(el));
})();

// Mobile drawer.
(() => {
  const toggle = document.querySelector('.menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('mobile-backdrop');
  if (!toggle || !drawer || !backdrop) return;

  const closeBtn = drawer.querySelector('.drawer-close');
  let isOpen = false;

  function open() {
    if (isOpen) return;
    isOpen = true;
    drawer.hidden = false;
    backdrop.hidden = false;
    requestAnimationFrame(() => {
      drawer.classList.add('is-open');
      backdrop.classList.add('is-open');
    });
    toggle.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => {
      drawer.hidden = true;
      backdrop.hidden = true;
    }, 340);
    toggle.focus();
  }

  toggle.addEventListener('click', () => {
    if (isOpen) close(); else open();
  });

  if (closeBtn) closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) close();
  });

  drawer.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));

  // Cerrar drawer si el viewport cruza el breakpoint desktop
  const mq = window.matchMedia('(min-width: 900px)');
  mq.addEventListener('change', (e) => { if (e.matches && isOpen) close(); });
})();