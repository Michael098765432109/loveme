/* ═══════════════════════════════════════════
   galaxy.js — Mapa de estrellas interactivo
═══════════════════════════════════════════ */

(function initGalaxy() {
  const stars   = document.querySelectorAll('.star-point');
  const tooltip = document.getElementById('starTooltip');
  let hideTimer;

  function showTooltip(star, e) {
    clearTimeout(hideTimer);
    const msg = star.dataset.msg;
    tooltip.textContent = msg;
    tooltip.classList.add('show');
    star.classList.add('visited');
    positionTooltip(e);
  }

  function positionTooltip(e) {
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? window.innerWidth / 2;
    const y = e.clientY ?? e.touches?.[0]?.clientY ?? window.innerHeight / 2;
    const tw = 280, th = 60;
    const left = Math.min(Math.max(x - tw / 2, 8), window.innerWidth - tw - 8);
    const top  = y - th - 20 < 0 ? y + 20 : y - th - 20;
    tooltip.style.left = left + 'px';
    tooltip.style.top  = top  + 'px';
  }

  function hideTooltip() {
    hideTimer = setTimeout(() => tooltip.classList.remove('show'), 1800);
  }

  stars.forEach(star => {
    star.addEventListener('mouseenter', e => showTooltip(star, e));
    star.addEventListener('mouseleave', hideTooltip);
    star.addEventListener('click', e => { showTooltip(star, e); hideTooltip(); });
    star.addEventListener('touchstart', e => {
      e.preventDefault();
      showTooltip(star, e);
      hideTooltip();
    }, { passive: false });
  });

  /* Crear micro-estrellas de fondo dinámicamente */
  const map = document.getElementById('galaxyMap');
  for (let i = 0; i < 60; i++) {
    const s = document.createElement('div');
    const size = Math.random() * 2 + 1;
    s.style.cssText = `
      position:absolute;
      width:${size}px; height:${size}px;
      border-radius:50%;
      background:rgba(255,255,255,${Math.random() * .5 + .1});
      top:${Math.random() * 100}%;
      left:${Math.random() * 100}%;
      animation: star-twinkle ${2 + Math.random() * 3}s ease-in-out infinite;
      animation-delay: ${Math.random() * 3}s;
      pointer-events:none;
    `;
    map.appendChild(s);
  }
})();
