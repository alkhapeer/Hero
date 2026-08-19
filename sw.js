const CACHE_NAME = 'hero-academy-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/manifest.webmanifest',
    '/favicon.svg',
    '/css/style.css',
    '/css/responsive.css',
    '/js/app.js',
    '/js/router.js',
    '/js/storage.js',
    '/js/trial.js',
    '/js/activation.js',
    '/js/ui.js',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    '/icons/maskable-512.png'
];

// تثبيت Service Worker وتخزين الملفات الأساسية
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching assets...');
                return cache.addAll(ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// تفعيل Service Worker وتنظيف الكاش القديم
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

// اعتراض الطلبات وتقديم نسخة مخزنة
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response; // من الكاش
                }
                // محاولة جلب من الشبكة وتخزينها
                return fetch(event.request).then(fetchResponse => {
                    // تخزين فقط الطلبات الناجحة لنفس المصدر
                    if (fetchResponse && fetchResponse.status === 200) {
                        const clone = fetchResponse.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, clone);
                        });
                    }
                    return fetchResponse;
                }).catch(() => {
                    // في حالة عدم وجود اتصال، يمكن تقديم صفحة Offline
                    return new Response('غير متصل', { status: 503 });
                });
            })
    );
});
