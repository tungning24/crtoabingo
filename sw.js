const CACHE_NAME = 'crtoabingo-v2';

const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './index.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // ใช้ addAll แบบไม่ให้พังถ้าบางไฟล์หาไม่เจอชั่วคราว
      return Promise.allSettled(
        ASSETS.map(url => cache.add(url))
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // Fallback กรณีออฟไลน์และหาไฟล์ไม่เจอ
        return caches.match('./index.html');
      });
    })
  );
});