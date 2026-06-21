/*
  Service worker обеспечивает офлайн-запуск основного интерфейса приложения.
  Он кеширует важные файлы и отвечает на запросы, отдавая данные из кеша,
  если они доступны. Это простой кеш без динамического обновления, но его
  достаточно для работы PWA на GitHub Pages.
*/

const CACHE_NAME = 'detector-cache-v1';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names => {
      return Promise.all(
        names.map(name => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  // Кэшируем только GET-запросы
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        // При ошибке сети возвращаем кэшированный index.html
        return caches.match('./index.html');
      });
    })
  );
});