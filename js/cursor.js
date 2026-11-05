/* ═══════════════════════════════════════════
   cursor.js — Cursor personalizado
   Usa transform en vez de left/top para
   evitar reflow y solo triggear composite
═══════════════════════════════════════════ */

(function initCursor() {
  const IS_TOUCH = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  if (IS_TOUCH) return; /* Sin cursor en touch */

  const cur  = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cur.style.transform = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;
  }, { passive: true });

  /* Ring sigue con lerp suave */
  (function animRing() {
    rx += (mx - rx) * .12;
    ry += (my - ry) * .12;
    ring.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`;
    requestAnimationFrame(animRing);
  })();

  /* Escalar al pasar sobre elementos interactivos */
  const targets = 'button, a, .reason-card, .promise-item, .tl-card';
  document.querySelectorAll(targets).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cur.style.width  = '20px';
      cur.style.height = '20px';
      ring.style.width  = '50px';
      ring.style.height = '50px';
    });
    el.addEventListener('mouseleave', () => {
      cur.style.width  = '12px';
      cur.style.height = '12px';
      ring.style.width  = '36px';
      ring.style.height = '36px';
    });
  });
})();
