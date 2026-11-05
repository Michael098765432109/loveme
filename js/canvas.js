/* ═══════════════════════════════════════════
   canvas.js — Partículas de corazones vectoriales
   Usa bezierCurveTo en vez de fillText(emoji)
   para máximo rendimiento en GPU
═══════════════════════════════════════════ */

(function initCanvas() {
  const canvas = document.getElementById('canvas');
  const ctx    = canvas.getContext('2d', { alpha: true });

  const IS_TOUCH = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  const COUNT    = IS_TOUCH ? 18 : 35;
  const COLORS   = [
    'rgba(232,64,90,',
    'rgba(255,107,138,',
    'rgba(247,168,184,',
    'rgba(212,168,83,'
  ];

  let W, H, rafId;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  }, { passive: true });

  resize();

  /* Crea un objeto partícula */
  function mkHeart(init) {
    return {
      x:   Math.random() * W,
      y:   init ? Math.random() * H : H + 10,
      s:   Math.random() * 10 + 4,
      sp:  Math.random() * .45 + .15,
      dr:  (Math.random() - .5) * .35,
      al:  Math.random() * .35 + .07,
      col: COLORS[Math.floor(Math.random() * COLORS.length)]
    };
  }

  /* Dibuja un corazón con bezier — sin save/restore ni rotate */
  function drawHeart(x, y, s) {
    ctx.beginPath();
    ctx.moveTo(x, y - s * .25);
    ctx.bezierCurveTo(x, y - s * .6,  x + s * .6, y - s * .6,  x + s * .6, y - s * .25);
    ctx.bezierCurveTo(x + s * .6, y + s * .1,  x, y + s * .5,  x, y + s * .5);
    ctx.bezierCurveTo(x, y + s * .5,  x - s * .6, y + s * .1,  x - s * .6, y - s * .25);
    ctx.bezierCurveTo(x - s * .6, y - s * .6,  x, y - s * .6,  x, y - s * .25);
    ctx.closePath();
    ctx.fill();
  }

  const pts = Array.from({ length: COUNT }, () => mkHeart(true));

  function loop() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      p.y -= p.sp;
      p.x += p.dr;

      if (p.y < -20) {
        pts[i] = mkHeart(false);
        continue;
      }

      ctx.globalAlpha = p.al;
      ctx.fillStyle   = p.col + '1)';
      drawHeart(p.x, p.y, p.s);
    }

    ctx.globalAlpha = 1;
    rafId = requestAnimationFrame(loop);
  }

  loop();

  /* Pausar cuando la pestaña no es visible */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      loop();
    }
  });
})();
