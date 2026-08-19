const CACHE_NAME = 'hero-academy-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/manifest.webmanifest',
    '/css/style.css',
    '/css/responsive.css',
    '/js/storage.js',
    '/js/trial.js',
    '/js/activation.js',
    '/js/router.js',
    '/js/app.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                // استخدم addAll مع catch لتجنب فشل التثبيت بالكامل
                return cache.addAll(ASSETS).catch(err => {
                    console.warn('Some assets failed to cache:', err);
                    // لا نرمي الخطأ إلى الخارج حتى يكتمل التثبيت
                });
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
            .catch(() => new Response('Network error', { status: 503 }))
    );
});
