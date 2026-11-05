/* ═══════════════════════════════════════════
   interactions.js — Hamburger, Burst
═══════════════════════════════════════════ */

(function initInteractions() {
  const IS_TOUCH = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

  /* ── Hamburger menu ── */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ── Burst de corazones en click/touch ── */
  const BURST_CHARS = ['❤', '💖', '💗', '✨'];
  const BURST_COUNT = IS_TOUCH ? 5 : 8;

  function spawnBurst(x, y) {
    for (let i = 0; i < BURST_COUNT; i++) {
      const el    = document.createElement('div');
      el.className = 'burst';
      el.textContent = BURST_CHARS[Math.floor(Math.random() * BURST_CHARS.length)];

      const angle = (Math.PI * 2 / BURST_COUNT) * i;
      const dist  = 35 + Math.random() * 35;

      el.style.cssText = `
        left: ${x}px;
        top:  ${y}px;
        --dx: ${Math.cos(angle) * dist}px;
        --dy: ${Math.sin(angle) * dist}px;
      `;

      document.body.appendChild(el);
      setTimeout(() => el.remove(), 800);
    }
  }

  document.addEventListener('click', e => spawnBurst(e.clientX, e.clientY));

  if (IS_TOUCH) {
    document.addEventListener('touchstart', e => {
      const t = e.touches[0];
      spawnBurst(t.clientX, t.clientY);
    }, { passive: true });
  }

  /* ── Corazón hero: pop al hacer clic ── */
  const heroHeart = document.getElementById('heroHeart');
  if (heroHeart) {
    heroHeart.addEventListener('click', () => {
      heroHeart.style.animation = 'none';
      heroHeart.style.animation = 'hero-heart-pop .5s ease, heart-beat 1.4s ease-in-out infinite .5s';
      /* Lluvia de corazones desde el centro */
      const r = heroHeart.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top  + r.height / 2;
      for (let i = 0; i < 16; i++) {
        const el = document.createElement('div');
        el.className = 'burst';
        el.textContent = BURST_CHARS[Math.floor(Math.random() * BURST_CHARS.length)];
        el.style.fontSize = (1 + Math.random()) + 'rem';
        const angle = (Math.PI * 2 / 16) * i;
        const dist  = 60 + Math.random() * 60;
        el.style.cssText += `left:${cx}px;top:${cy}px;--dx:${Math.cos(angle)*dist}px;--dy:${Math.sin(angle)*dist}px`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 900);
      }
    });
  }

})();
