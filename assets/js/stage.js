// Fundaserinco — stage.js
// Dispara el unfold 3D del stage una sola vez.
// No-op si no hay .stage en la página (sólo se carga en index.html).

(() => {
  'use strict';
  const stage = document.querySelector('.stage');
  if (!stage) return;

  // Sin IntersectionObserver: mostrar directo
  if (!('IntersectionObserver' in window)) {
    stage.classList.add('is-in');
    return;
  }

  // Entra al viewport → desplegar. Nunca se repite.
  const io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      stage.classList.add('is-in');
      io.disconnect();
    }
  }, { rootMargin: '0px 0px -20% 0px' });

  io.observe(stage);
})();