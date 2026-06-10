// Navbar scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
}, {passive: true});

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
  toast.className   = `toast show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
}

// Weather
async function fetchWeather(lat, lon) {
  try {
    const res  = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
    if (!res.ok) throw new Error('error');
    const data = await res.json();
    window.weatherData = data;
    return data;
  } catch {
    showToast('Could not load weather.', 'error');
    return null;
  }
}

function getWeatherEmoji(code) {
  const map = {
    '01d':'☀️','01n':'🌙','02d':'⛅','02n':'⛅',
    '03d':'☁️','03n':'☁️','04d':'☁️','04n':'☁️',
    '09d':'🌧️','09n':'🌧️','10d':'🌦️','10n':'🌧️',
    '11d':'⛈️','11n':'⛈️','13d':'❄️','13n':'❄️','50d':'🌫️','50n':'🌫️'
  };
  return map[code] || '🌤️';
}

function getDayName(dateStr) {
  const days  = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const d     = new Date(dateStr);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return 'Today';
  const tom = new Date(today);
  tom.setDate(today.getDate() + 1);
  if (d.toDateString() === tom.toDateString()) return 'Tomorrow';
  return days[d.getDay()];
}

function capitalize(str) { return str ? str[0].toUpperCase() + str.slice(1) : ''; }

function updateAlertBadge(count) {
  document.querySelectorAll('#alertBadge').forEach(b => {
    b.textContent   = count;
    b.style.display = count > 0 ? 'inline-flex' : 'none';
  });
}

// Ripple
document.addEventListener('click', e => {
  const btn = e.target.closest('.btn-primary,.btn-secondary,.btn-analyze,.chart-tab,.alert-tab,.chip,.btn-hero-primary,.btn-hero-secondary');
  if (!btn) return;
  const r    = document.createElement('span');
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  r.style.cssText = `position:absolute;border-radius:50%;width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;background:rgba(255,255,255,0.2);transform:scale(0);animation:ripple 0.5s linear;pointer-events:none;`;
  if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
  btn.style.overflow = 'hidden';
  btn.appendChild(r);
  setTimeout(() => r.remove(), 550);
});
document.head.insertAdjacentHTML('beforeend', '<style>@keyframes ripple{to{transform:scale(2.5);opacity:0}}</style>');

function observeAnimations() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.style.animationPlayState = 'running'; obs.unobserve(e.target); }
    });
  }, {threshold: 0.1});
  document.querySelectorAll('.crop-card,.forecast-card,.alert-card,.city-card,.quick-card,.soil-tip-card').forEach(el => {
    el.style.animationPlayState = 'paused'; obs.observe(el);
  });
}

// Theme
function initTheme() {
  const btn  = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const saved = localStorage.getItem('smartagro_theme') || 'light';
  function apply(mode) {
    if (mode === 'dark') {
      document.body.classList.add('dark');
      if (icon) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
    } else {
      document.body.classList.remove('dark');
      if (icon) { icon.classList.remove('fa-sun'); icon.classList.add('fa-moon'); }
    }
    localStorage.setItem('smartagro_theme', mode);
  }
  apply(saved);
  if (btn) btn.addEventListener('click', () => {
    apply(document.body.classList.contains('dark') ? 'light' : 'dark');
  });
}

// Language dropdown — fixed
function initLangDropdown() {
  const sel = document.getElementById('langSelector');
  if (!sel) return;
  const btn = document.getElementById('langBtn');
  if (!btn) return;
  // Clone to remove old listeners
  const newBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(newBtn, btn);
  newBtn.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    sel.classList.toggle('open');
  });
  document.addEventListener('click', e => {
    if (!sel.contains(e.target)) sel.classList.remove('open');
  });
  const s = document.getElementById('langSearch');
  if (s) {
    s.addEventListener('input', e => buildLangList(e.target.value));
    s.addEventListener('click', e => e.stopPropagation());
  }
}

// Bottom nav active
function setBottomNavActive() {
  const path = window.location.pathname;
  document.querySelectorAll('.bottom-nav-item').forEach(item => {
    item.classList.toggle('active',
      item.getAttribute('href') === path || (path === '/' && item.getAttribute('href') === '/'));
  });
}

// PWA install prompt
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  const installBtn = document.getElementById('installBtn');
  if (installBtn) installBtn.style.display = 'flex';
});

function installApp() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => { deferredPrompt = null; });
  }
}

// Browser notifications
function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        showToast('Notifications enabled! You will get weather alerts.', 'success');
      }
    });
  }
}

function sendNotification(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body: body,
      icon: '/static/images/icon-192.png',
      badge: '/static/images/icon-192.png'
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const saved = sessionStorage.getItem('alert_count');
  if (saved) updateAlertBadge(parseInt(saved));
  observeAnimations();
  initTheme();
  initLangDropdown();
  setBottomNavActive();
  // Request notifications after 3 seconds
  setTimeout(requestNotificationPermission, 3000);
});
