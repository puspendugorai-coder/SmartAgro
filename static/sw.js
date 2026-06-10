const CACHE = 'smartagro-v1';
const ASSETS = ['/', '/diagnose', '/market', '/alerts',
  '/static/css/main.css', '/static/css/dashboard.css',
  '/static/css/diagnose.css', '/static/css/market.css', '/static/css/alerts.css',
  '/static/js/main.js', '/static/js/translations.js', '/static/js/chatbot.js',
  '/static/js/dashboard.js', '/static/js/diagnose.js', '/static/js/market.js', '/static/js/alerts.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => {})));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      });
    }).catch(() => caches.match('/'))
  );
});
