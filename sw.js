/**
 * KRESZ Teszt & Gyakorló - Progressive Web App Service Worker
 * Offline működés és gyorstárazás GitHub Pages és helyi környezetben
 */

var CACHE_NAME = 'kresz-pwa-v1';

var PRECACHE_URLS = [
    './',
    './index.html',
    './style.css',
    './model.js',
    './ui.compiled.js',
    './manifest.json',
    './assets/react-0.13.3.min.js',
    './assets/jquery-2.1.4.min.js',
    './assets/materialize.min.css',
    './assets/materialize.min.js',
    './assets/material-icons.css',
    './assets/icons/icon-192.png',
    './assets/icons/icon-512.png',
    './assets/icons/icon.svg',
    './data/jsonp/categories.js',
    './data/jsonp/166852.js',
    './data/jsonp/166856.js',
    './data/jsonp/166866.js',
    './data/jsonp/166868.js',
    './data/jsonp/166870.js',
    './data/jsonp/166878.js',
    './data/jsonp/166880.js',
    './data/jsonp/166886.js',
    './tests/test.css',
    './tests/search.js',
    './tests/test_b_alapismeretek.html'
];

// Telepítés és előtárazás
self.addEventListener('install', function(event) {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(PRECACHE_URLS).catch(function(err) {
                console.warn('Precache hiba egy vagy több fájlnál:', err);
            });
        })
    );
});

// Aktiválás és korábbi gyorsítótárak törlése
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(function() {
            return self.clients.claim();
        })
    );
});

// Hálózati kérések kiszolgálása: Cache-First dinamikus mentéssel
self.addEventListener('fetch', function(event) {
    // Csak http/https GET kéréseket kezelünk
    if (event.request.method !== 'GET') return;
    var url = event.request.url;
    if (!url.startsWith('http')) return;

    event.respondWith(
        caches.match(event.request).then(function(cachedResponse) {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request).then(function(networkResponse) {
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }

                var responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then(function(cache) {
                    cache.put(event.request, responseToCache);
                });

                return networkResponse;
            }).catch(function() {
                // Ha offline van és nincs a gyorsítótárban, navigációnál adjuk vissza az index.html-t
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});
