// Auto-stagger: a cualquier contenedor con data-stagger le pone data-reveal y --i a sus hijos.
// Debe cargarse ANTES que base.js para que base.js encuentre los [data-reveal] ya inyectados.
(() => {
  document.querySelectorAll('[data-stagger]').forEach((container) => {
    Array.from(container.children).forEach((el, i) => {
      if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', '');
      el.style.setProperty('--i', i);
    });
  });
})();