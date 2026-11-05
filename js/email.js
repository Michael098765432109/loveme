/* ═══════════════════════════════════════════
   email.js — Botón de amor + EmailJS
   
   CONFIGURACIÓN:
   Reemplaza los 3 valores de CONFIG con los
   datos de tu cuenta en emailjs.com
═══════════════════════════════════════════ */

(function initEmail() {

  /* ── CONFIGURACIÓN EmailJS ── */
  const CONFIG = {
    publicKey:  'TU_PUBLIC_KEY',      /* Account → Public Key        */
    serviceId:  'TU_SERVICE_ID',      /* Email Services → Service ID */
    templateId: 'TU_TEMPLATE_ID'      /* Email Templates → Template ID */
  };

  /* ── Toast helper ── */
  function showToast(icon, title, msg, duration = 4000) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      toast.innerHTML = `
        <span class="toast-icon"></span>
        <div class="toast-msg"><strong></strong><span></span></div>
      `;
      document.body.appendChild(toast);
    }
    toast.querySelector('.toast-icon').textContent      = icon;
    toast.querySelector('.toast-msg strong').textContent = title;
    toast.querySelector('.toast-msg span').textContent   = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
  }

  /* ── Estado del botón ── */
  function setState(btn, textEl, iconEl, state) {
    btn.classList.remove('sending', 'success', 'error');

    const states = {
      idle:    { icon: '💌', text: 'Enviar todo mi amor',       cls: ''        },
      sending: { icon: '⏳', text: 'Enviando...',               cls: 'sending' },
      success: { icon: '💖', text: '¡Mensaje enviado!',         cls: 'success' },
      error:   { icon: '💔', text: 'Inténtalo de nuevo',        cls: 'error'   }
    };

    const s = states[state];
    iconEl.textContent = s.icon;
    textEl.textContent = s.text;
    if (s.cls) btn.classList.add(s.cls);
  }

  /* ── Inicializar EmailJS ── */
  function sendEmail(btn, textEl, iconEl) {
    if (CONFIG.publicKey === 'TU_PUBLIC_KEY') {
      /* Modo demo: sin credenciales reales */
      setState(btn, textEl, iconEl, 'sending');
      setTimeout(() => {
        setState(btn, textEl, iconEl, 'success');
        showToast('💖', '¡Amor enviado!', 'La persona especial ya sabe que la amas 🌹');
        setTimeout(() => setState(btn, textEl, iconEl, 'idle'), 4000);
      }, 1800);
      return;
    }

    emailjs.init(CONFIG.publicKey);
    setState(btn, textEl, iconEl, 'sending');

    const now  = new Date();
    const date = now.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const time = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    emailjs.send(CONFIG.serviceId, CONFIG.templateId, { date, time })
      .then(() => {
        setState(btn, textEl, iconEl, 'success');
        showToast('💖', '¡Amor enviado!', `Mensaje enviado el ${date} a las ${time} 🌹`);
        setTimeout(() => setState(btn, textEl, iconEl, 'idle'), 5000);
      })
      .catch(err => {
        console.error('EmailJS error:', err);
        setState(btn, textEl, iconEl, 'error');
        showToast('💔', 'Error al enviar', 'Revisa tu conexión e inténtalo de nuevo.');
        setTimeout(() => setState(btn, textEl, iconEl, 'idle'), 3000);
      });
  }

  /* ── Bind al botón ── */
  const btn    = document.getElementById('loveBtn');
  const textEl = btn.querySelector('.btn-text');
  const iconEl = btn.querySelector('.btn-icon');

  btn.addEventListener('click', () => {
    if (btn.classList.contains('sending') || btn.classList.contains('success')) return;
    sendEmail(btn, textEl, iconEl);
  });

})();
