/* ═══════════════════════════════════════════
   poem.js — Poema interactivo con tabs
═══════════════════════════════════════════ */

(function initPoem() {
  const tabs    = document.querySelectorAll('.poem-tab');
  const contents = document.querySelectorAll('.poem-content');
  const dots    = document.querySelectorAll('.poem-dot');
  const prevBtn = document.getElementById('poemPrev');
  const nextBtn = document.getElementById('poemNext');
  let current   = 0;

  function goTo(index) {
    tabs[current].classList.remove('active');
    contents[current].classList.remove('active');
    dots[current].classList.remove('active');

    current = (index + tabs.length) % tabs.length;

    tabs[current].classList.add('active');
    contents[current].classList.add('active');
    dots[current].classList.add('active');

    /* Scroll suave al poema si está fuera de vista */
    contents[current].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  tabs.forEach((tab, i) => tab.addEventListener('click', () => goTo(i)));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  /* Swipe en móvil */
  let touchStartX = 0;
  const display = document.querySelector('.poem-display');
  display.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  display.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) goTo(dx < 0 ? current + 1 : current - 1);
  }, { passive: true });

  /* Teclado */
  document.addEventListener('keydown', e => {
    const section = document.getElementById('poema');
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      if (e.key === 'ArrowRight') goTo(current + 1);
      if (e.key === 'ArrowLeft')  goTo(current - 1);
    }
  });
})();
