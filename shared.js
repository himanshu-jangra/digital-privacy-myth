/* =============================================
   shared.js — Digital Privacy is a Myth*
   Common utilities for all pages
   ============================================= */

// Google Apps Script endpoint — replace with your deployed URL
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyX_iC8OXYWzOJQPhC_uAyRWYuwdHmohGj4TFR7z48GdYPiWj8z3QqEOKgAUnER4WfO/exec';

/* ---------- Loader ---------- */
function initLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;
  const bar = loader.querySelector('.loader-progress-bar');
  const pct = loader.querySelector('.loader-percent');
  let progress = 0;
  const duration = 1800;
  const interval = 30;
  const step = 100 / (duration / interval);
  const timer = setInterval(() => {
    progress = Math.min(100, progress + step + (Math.random() * 2 - 1));
    if (bar) bar.style.width = progress + '%';
    if (pct) pct.textContent = Math.round(progress) + '%';
    if (progress >= 100) {
      clearInterval(timer);
      setTimeout(() => {
        loader.classList.add('fade-out');
        loader.addEventListener('animationend', () => {
          loader.style.display = 'none';
          document.body.classList.add('loaded');
        });
      }, 200);
    }
  }, interval);
}

/* ---------- Cookie Banner ---------- */
function initCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  const btn = document.getElementById('cookie-dismiss');
  if (!banner || !btn) return;
  btn.addEventListener('click', () => {
    banner.classList.add('hidden');
    document.body.classList.add('banner-dismissed');
  });
}

/* ---------- Mobile Nav ---------- */
function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
    toggle.classList.toggle('open');
    toggle.setAttribute('aria-expanded', menu.classList.contains('open'));
  });
  // Close on link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- Form Submission ---------- */
async function submitToSheet(type, data) {
  const payload = { type, ...data, timestamp: new Date().toISOString() };
  try {
    const res = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return { status: 'ok' };
  } catch (err) {
    console.error('Submission error:', err);
    return { status: 'error', message: err.message };
  }
}

/* ---------- Email Validation ---------- */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ---------- Button Loading State ---------- */
function setButtonLoading(btn, loadingText) {
  const originalHTML = btn.innerHTML;
  btn.innerHTML = loadingText || 'Submitting...';
  btn.classList.add('btn-loading');
  btn.disabled = true;
  return function restore(successText) {
    btn.classList.remove('btn-loading');
    if (successText) {
      btn.innerHTML = successText;
      btn.disabled = true;
      btn.style.opacity = '1';
    } else {
      btn.innerHTML = originalHTML;
      btn.disabled = false;
    }
  };
}

/* ---------- Binary Rain Background ---------- */
function initBinaryRain() {
  const canvas = document.getElementById('binary-rain');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, cols, drops;
  const chars = '01001101 0xDEAD 0xBEEF 10110 01 10 0xFF 0x00'.split('');

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    cols = Math.floor(w / 18);
    drops = Array(cols).fill(1);
  }

  function draw() {
    ctx.fillStyle = 'rgba(10,10,10,0.06)';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(0,255,157,0.06)';
    ctx.font = '14px JetBrains Mono, monospace';
    for (let i = 0; i < cols; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * 18, drops[i] * 18);
      if (drops[i] * 18 > h && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
}

/* ---------- Init on DOM Ready ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCookieBanner();
  initMobileNav();
});
