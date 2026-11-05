/* ═══════════════════════════════════════════
   scroll.js — Reveal, Nav scroll, Contadores
═══════════════════════════════════════════ */

(function initScroll() {

  /* ── Nav scroll ── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ── Scroll reveal ── */
  const revEls = document.querySelectorAll('.reveal, .tl-item');
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: .15 });

  revEls.forEach(el => revObs.observe(el));

  /* ── Contadores animados ── */
  function animCount(el, target) {
    let v = 0;
    const inc = target / (2000 / 16);
    const timer = setInterval(() => {
      v += inc;
      if (v >= target) {
        el.textContent = target.toLocaleString() + '+';
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(v).toLocaleString();
      }
    }, 16);
  }

  const statsEl = document.querySelector('.stats');
  if (statsEl) {
    const statObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('[data-target]').forEach(n => {
            const t = parseInt(n.dataset.target);
            if (!isNaN(t)) animCount(n, t);
          });
          statObs.unobserve(e.target);
        }
      });
    }, { threshold: .5 });

    statObs.observe(statsEl);
  }

})();
