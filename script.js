/* ═══════════════════════════════════════════
   INVITACIÓN FANNY & MARCO · script.js
════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────
     1. SOBRE / ENVELOPE
  ───────────────────────────────────────── */
  const openBtn        = document.getElementById('openBtn');
  const topFlap        = document.getElementById('topFlap');
  const envelopeScreen = document.getElementById('envelope-screen');
  const invitation     = document.getElementById('invitation');
  const weddingMusic   = document.getElementById('weddingMusic');

  openBtn.addEventListener('click', () => {
    // 1) Abrir tapa
    topFlap.classList.add('open');

    // 2) Intentar reproducir música
    weddingMusic.play().catch(() => {
      // El navegador puede bloquear el autoplay; el usuario puede activarla con el botón flotante
    });

    // 3) Animar sobre hacia arriba y desaparecer
    setTimeout(() => {
      envelopeScreen.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
      envelopeScreen.style.transform  = 'translateY(-100%)';
      envelopeScreen.style.opacity    = '0';
    }, 700);

    // 4) Mostrar invitación
    setTimeout(() => {
      envelopeScreen.classList.add('hide');
      invitation.classList.remove('hidden');
      invitation.classList.add('visible');
      document.body.style.overflowY = 'auto';
      createParticles();
      initReveal();
    }, 1500);
  });

  /* ─────────────────────────────────────────
     2. PARTÍCULAS FLOTANTES
  ───────────────────────────────────────── */
  function createParticles () {
    const container = document.getElementById('particles');
    const colors    = ['#8B1A1A', '#C9A84C', '#B84040', '#E8D09A', '#5D2B2A'];
    const count     = 28;

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';

      const size  = Math.random() * 6 + 3;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left  = Math.random() * 100;
      const dur   = Math.random() * 15 + 10;
      const delay = Math.random() * 15;

      p.style.cssText = `
        width:${size}px;
        height:${size}px;
        left:${left}%;
        background:${color};
        animation-duration:${dur}s;
        animation-delay:-${delay}s;
        opacity:0;
      `;
      container.appendChild(p);
    }
  }

  /* ─────────────────────────────────────────
     3. REVEAL ON SCROLL (IntersectionObserver)
  ───────────────────────────────────────── */
  function initReveal () {
    const elements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Delay escalonado según el índice dentro del mismo bloque
          const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
          const idx      = siblings.indexOf(entry.target);
          const delay    = idx * 120;

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(el => observer.observe(el));
  }

  /* ─────────────────────────────────────────
     4. CONTADOR REGRESIVO
  ───────────────────────────────────────── */
  const weddingDate = new Date('2026-08-08T12:00:00');

  function pad (n) { return String(n).padStart(2, '0'); }

  function updateCountdown () {
    const now  = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) {
      document.getElementById('cdDays').textContent  = '00';
      document.getElementById('cdHours').textContent = '00';
      document.getElementById('cdMins').textContent  = '00';
      document.getElementById('cdSecs').textContent  = '00';
      return;
    }

    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000)  / 60000);
    const secs  = Math.floor((diff % 60000)    / 1000);

    setNum('cdDays',  pad(days));
    setNum('cdHours', pad(hours));
    setNum('cdMins',  pad(mins));
    setNum('cdSecs',  pad(secs));
  }

  function setNum (id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.textContent !== value) {
      el.classList.remove('flip');
      void el.offsetWidth;         // reflow para reiniciar animación
      el.classList.add('flip');
      el.textContent = value;
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ─────────────────────────────────────────
     5. CARRUSEL
  ───────────────────────────────────────── */
  const track      = document.getElementById('carouselTrack');
  const prevBtn    = document.getElementById('prevBtn');
  const nextBtn    = document.getElementById('nextBtn');
  const dotsWrap   = document.getElementById('carouselDots');

  let currentSlide = 0;
  let autoTimer    = null;

  function getSlides () { return track ? track.querySelectorAll('.carousel-slide') : []; }

  function buildDots () {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    getSlides().forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Foto ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
  }

  function goTo (index) {
    const slides = getSlides();
    if (!slides.length) return;

    currentSlide = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Actualizar dots
    dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === currentSlide);
    });

    restartAuto();
  }

  function restartAuto () {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(currentSlide + 1), 4500);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(currentSlide - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(currentSlide + 1));

  // Swipe táctil
  if (track) {
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) goTo(currentSlide + (dx < 0 ? 1 : -1));
    });
  }

  buildDots();
  restartAuto();

  /* ─────────────────────────────────────────
     6. BOTÓN DE MÚSICA
  ───────────────────────────────────────── */
  const musicBtn  = document.getElementById('musicBtn');
  const musicIcon = document.getElementById('musicIcon');
  let   isPlaying = false;

  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      if (isPlaying) {
        weddingMusic.pause();
        musicBtn.classList.remove('playing');
        musicIcon.className = 'fa-solid fa-music';
        isPlaying = false;
      } else {
        weddingMusic.play().then(() => {
          musicBtn.classList.add('playing');
          musicIcon.className = 'fa-solid fa-pause';
          isPlaying = true;
        }).catch(err => {
          console.warn('No se pudo reproducir audio:', err);
        });
      }
    });
  }

  // Sincronizar estado si el audio se reproduce automáticamente desde el sobre
  weddingMusic.addEventListener('play', () => {
    isPlaying = true;
    if (musicBtn) musicBtn.classList.add('playing');
    if (musicIcon) musicIcon.className = 'fa-solid fa-pause';
  });
  weddingMusic.addEventListener('pause', () => {
    isPlaying = false;
    if (musicBtn) musicBtn.classList.remove('playing');
    if (musicIcon) musicIcon.className = 'fa-solid fa-music';
  });

  /* ─────────────────────────────────────────
     7. EFECTO PARALLAX SUAVE EN HERO
  ───────────────────────────────────────── */
  const hero = document.getElementById('hero');
  window.addEventListener('scroll', () => {
    if (!hero) return;
    const scrolled = window.pageYOffset;
    hero.style.backgroundPositionY = `${scrolled * 0.3}px`;
  }, { passive: true });

  /* ─────────────────────────────────────────
     8. CURSOR PERSONALIZADO (desktop)
  ───────────────────────────────────────── */
  if (window.matchMedia('(pointer: fine)').matches) {
    const cursor = document.createElement('div');
    cursor.style.cssText = `
      position: fixed;
      width: 20px; height: 20px;
      border-radius: 50%;
      border: 1.5px solid rgba(201,168,76,0.7);
      pointer-events: none;
      z-index: 99999;
      transition: transform 0.12s ease, opacity 0.3s;
      transform: translate(-50%, -50%);
      top: 0; left: 0;
    `;
    document.body.appendChild(cursor);

    let mx = 0, my = 0, cx = 0, cy = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
    });

    function animCursor () {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      cursor.style.left = cx + 'px';
      cursor.style.top  = cy + 'px';
      requestAnimationFrame(animCursor);
    }
    animCursor();

    // Hover en links y botones
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%,-50%) scale(1.8)');
      el.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%,-50%) scale(1)');
    });
  }

});
