/* main.js — shared across all pages */

// Navbar scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Hamburger
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

// Toast
let toastTimer = null;
function showToast(msg, type = 'success', duration = 3500) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = `toast show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
}

// Weather fetch
async function fetchWeather(lat, lon) {
  try {
    const res  = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
    if (!res.ok) throw new Error('Weather API error');
    const data = await res.json();
    window.weatherData = data;
    return data;
  } catch (err) {
    showToast('Could not load weather data.', 'error');
    return null;
  }
}

// Weather emoji
function getWeatherEmoji(iconCode) {
  const map = {
    '01d':'☀️','01n':'🌙','02d':'⛅','02n':'⛅',
    '03d':'☁️','03n':'☁️','04d':'☁️','04n':'☁️',
    '09d':'🌧️','09n':'🌧️','10d':'🌦️','10n':'🌧️',
    '11d':'⛈️','11n':'⛈️','13d':'❄️','13n':'❄️',
    '50d':'🌫️','50n':'🌫️',
  };
  return map[iconCode] || '🌤️';
}

// Day name
function getDayName(dateStr) {
  const days  = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const d     = new Date(dateStr);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return 'Today';
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return days[d.getDay()];
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

// Alert badge
function updateAlertBadge(count) {
  const badge = document.getElementById('alertBadge');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-flex' : 'none';
  }
}

// Ripple effect
document.addEventListener('click', e => {
  const btn = e.target.closest('.btn-primary,.btn-secondary,.btn-analyze,.chart-tab,.alert-tab,.chip');
  if (!btn) return;
  const ripple = document.createElement('span');
  const rect   = btn.getBoundingClientRect();
  const size   = Math.max(rect.width, rect.height);
  ripple.style.cssText = `position:absolute;border-radius:50%;width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;background:rgba(255,255,255,0.18);transform:scale(0);animation:ripple 0.55s linear;pointer-events:none;`;
  if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
  btn.style.overflow = 'hidden';
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
});
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `@keyframes ripple{to{transform:scale(2.5);opacity:0}}`;
document.head.appendChild(rippleStyle);

// Observe animations
function observeAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.animationPlayState = 'running';
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.crop-card,.forecast-card,.timeline-item,.alert-card,.city-card').forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });
}

// Theme toggle
function initTheme() {
  const btn   = document.getElementById('themeToggle');
  const icon  = document.getElementById('themeIcon');
  const saved = localStorage.getItem('smartagro_theme') || 'dark';

  function applyTheme(mode) {
    if (mode === 'light') {
      document.body.classList.add('light-theme');
      if (icon) { icon.classList.replace('fa-moon','fa-sun'); }
    } else {
      document.body.classList.remove('light-theme');
      if (icon) { icon.classList.replace('fa-sun','fa-moon'); }
    }
    localStorage.setItem('smartagro_theme', mode);
  }

  applyTheme(saved);
  if (btn) {
    btn.addEventListener('click', () => {
      applyTheme(document.body.classList.contains('light-theme') ? 'dark' : 'light');
    });
  }
}

// Language dropdown — FIXED: single listener, no conflict
function initLangDropdown() {
  const btn = document.getElementById('langBtn');
  const sel = document.getElementById('langSelector');
  if (!btn || !sel) return;

  btn.addEventListener('click', e => {
    e.stopPropagation();
    sel.classList.toggle('open');
  });

  // Close on outside click — single listener
  document.addEventListener('click', e => {
    if (!sel.contains(e.target)) sel.classList.remove('open');
  });

  const searchEl = document.getElementById('langSearch');
  if (searchEl) {
    searchEl.addEventListener('input', e => buildLangList(e.target.value));
    searchEl.addEventListener('click', e => e.stopPropagation());
  }
}

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const saved = sessionStorage.getItem('alert_count');
  if (saved) updateAlertBadge(parseInt(saved));
  observeAnimations();
  initTheme();
  initLangDropdown();
});
