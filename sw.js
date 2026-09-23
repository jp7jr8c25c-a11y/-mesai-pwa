const CACHE = 'mesai-pwa-v2.0.2';
const ASSETS = [
  './',
  './index.html',
  './app.css?v=2.0.2',
  './fix.css?v=2.0.2',
  './app.js?v=2.0.2',
  './fix.js?v=2.0.2',
  './manifest.json?v=2.0.2',
  './apple-touch-icon.png?v=2.0.2',
  './icon-192.png?v=2.0.2',
  './icon-512.png?v=2.0.2'
];
self.addEventListener('install', e => e.waitUntil(
  caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
));
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(resp => {
      const copy = resp.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(()=>{});
      return resp;
    }).catch(() => caches.match(e.request).then(hit => hit || caches.match('./index.html')))
  );
});
