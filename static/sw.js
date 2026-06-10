const CACHE = 'smartagro-v2';
const ASSETS = [
  '/', '/diagnose', '/market', '/alerts',
  '/static/css/main.css',
  '/static/css/dashboard.css',
  '/static/css/diagnose.css',
  '/static/css/market.css',
  '/static/css/alerts.css',
  '/static/js/main.js',
  '/static/js/translations.js',
  '/static/js/chatbot.js',
  '/static/js/dashboard.js',
  '/static/js/diagnose.js',
  '/static/js/market.js',
  '/static/js/alerts.js',
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS).catch(err => console.log('[SW] Cache failed:', err)))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('/api/')) return; // Never cache API calls
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fresh = fetch(e.request).then(res => {
        if (res.ok) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        return res;
      }).catch(() => cached);
      return cached || fresh;
    })
  );
});