// เปลี่ยนชื่อเวอร์ชันเป็น v5 เพื่อสั่งให้แอปเคลียร์ของเก่าทิ้ง
const CACHE_NAME = 'crtoabingo-v3';

// ตัด './' ออก เหลือแค่ไฟล์ที่มีจริง
const ASSETS = [
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
  // รับเฉพาะ HTTP/HTTPS GET request เท่านั้น
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then(networkResponse => {
        return networkResponse;
      }).catch(() => {
        // ออฟไลน์หรือโหลดไม่สำเร็จ ให้ส่ง index.html กลับไป
        return caches.match('./index.html');
      });
    })
  );
});