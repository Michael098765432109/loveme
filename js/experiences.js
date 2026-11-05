/* ═══════════════════════════════════════════
   experiences.js — Navegación entre experiencias
═══════════════════════════════════════════ */

(function initExperiences() {
  const home = document.getElementById('homeView');
  const app = document.getElementById('experienceApp');
  const counter = document.getElementById('experienceCounter');
  const screens = [...app.querySelectorAll('[data-experience]')];
  const screenIds = screens.map(screen => screen.dataset.experience);
  const experienceLinks = {
    '#razones': 'reasons',
    '#poema': 'poem',
    '#carta': 'letter',
    '#momentos': 'memories',
    '#promesas': 'promises',
    '#galaxia': 'galaxy',
    '#inicio': 'home'
  };
  const routePrefix = '#experiencia-';
  const baseUrl = `${window.location.pathname}${window.location.search}`;
  let hasInAppEntry = false;
  const missingThoughts = [
    'A veces una canción me devuelve a un momento bonito que compartimos. La escucho, sonrío un poquito y te deseo un día lindo.',
    'Hay detalles cotidianos que me hacen pensar en ti. Me recuerdan lo mucho que valoro haberte conocido.',
    'Extraño nuestras conversaciones, pero no quiero interrumpir tu tranquilidad. Solo espero que hoy tengas un motivo para sonreír.',
    'Cuando recuerdo una risa tuya, me doy cuenta de que todavía agradezco mucho los momentos que vivimos.',
    'A veces quisiera preguntarte cómo estás. Si algún día te nace contarme, me gustaría escucharte; si no, lo entiendo.',
    'Te extraño y te quiero. Ese sentimiento es mío para cuidar, sin convertirlo en una expectativa para ti.'
  ];
  let missingThoughtIndex = 0;

  function showHome() {
    document.body.classList.remove('experience-open');
    home.hidden = false;
    app.hidden = true;
    document.title = 'Para Ti, Mi Amor Eterno';
    window.scrollTo(0, 0);
  }

  function showExperience(id) {
    const screen = screens.find(item => item.dataset.experience === id);
    if (!screen) {
      showHome();
      return;
    }

    home.hidden = true;
    app.hidden = false;
    document.body.classList.add('experience-open');
    screens.forEach(item => { item.hidden = item !== screen; });
    counter.textContent = `${String(screenIds.indexOf(id) + 1).padStart(2, '0')} / ${String(screenIds.length).padStart(2, '0')}`;
    const heading = screen.querySelector('h1');
    document.title = `${heading?.innerText.replace(/\s+/g, ' ').trim() || 'Para ti'} · Amor Eterno`;
    window.scrollTo(0, 0);
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  }

  function openExperience(id, shouldPushState) {
    if (id === 'home') {
      if (hasInAppEntry && window.location.hash.startsWith(routePrefix)) {
        window.history.back();
      } else {
        window.history.replaceState({ home: true }, '', baseUrl);
        showHome();
      }
      return;
    }
    if (!screenIds.includes(id)) return;

    const route = `${routePrefix}${id}`;
    if (shouldPushState) {
      window.history.pushState({ experience: id }, '', route);
      hasInAppEntry = true;
    } else if (window.location.hash !== route) {
      window.history.replaceState({ experience: id }, '', route);
    }
    showExperience(id);
  }

  document.addEventListener('click', event => {
    const control = event.target.closest('[data-open-view], .hero-cta a, .section-cta a');
    if (!control) return;

    const id = control.dataset.openView || experienceLinks[control.getAttribute('href')];
    if (!id) return;

    event.preventDefault();
    openExperience(id, !document.body.classList.contains('experience-open'));
  });

  window.addEventListener('popstate', () => {
    const route = window.location.hash;
    if (route.startsWith(routePrefix)) {
      showExperience(route.slice(routePrefix.length));
    } else {
      hasInAppEntry = false;
      showHome();
    }
  });

  app.querySelectorAll('#constellation button').forEach(star => {
    star.addEventListener('click', () => {
      app.querySelectorAll('#constellation button').forEach(item => item.classList.remove('selected'));
      star.classList.add('selected');
      document.getElementById('constellationMessage').textContent = star.dataset.message;
    });
  });

  app.querySelector('[data-next-note]').addEventListener('click', () => {
    missingThoughtIndex = (missingThoughtIndex + 1) % missingThoughts.length;
    document.getElementById('missNote').textContent = missingThoughts[missingThoughtIndex];
    document.getElementById('missNoteCount').textContent =
      `PENSAMIENTO ${String(missingThoughtIndex + 1).padStart(2, '0')} / ${String(missingThoughts.length).padStart(2, '0')}`;
  });

  if (window.location.hash.startsWith(routePrefix)) {
    const initialScreen = window.location.hash.slice(routePrefix.length);
    if (screenIds.includes(initialScreen)) {
      showExperience(initialScreen);
    } else {
      window.history.replaceState({ home: true }, '', baseUrl);
    }
  }
})();
