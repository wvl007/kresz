/**
 * KRESZ Teszt & Gyakorló - Progressive Web App Service Worker
 * Network-First kódfrissítés, Cache-First offline média
 */

var CACHE_NAME = 'kresz-pwa-v5';

var CORE_ASSETS = [
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

// Telepítéskor előtárazzuk a magot és azonnal átvesszük az irányítást
self.addEventListener('install', function(event) {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(CORE_ASSETS).catch(function(err) {
                console.warn('Precache figyelmeztetés:', err);
            });
        })
    );
});

// Aktiváláskor a régi cache-eket azonnal kitöröljük
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

// Intelligens kéréskezelés
self.addEventListener('fetch', function(event) {
    if (event.request.method !== 'GET') return;
    var url = event.request.url;
    if (!url.startsWith('http')) return;

    // Fő alkalmazáskód (HTML, CSS, JS, manifest): NETWORK-FIRST
    // Így frissítés után azonnal a legújabb verzió jön le, offline pedig a mentett változat
    var isCoreCode = url.endsWith('.html') || url.endsWith('.js') || url.endsWith('.css') || url.endsWith('manifest.json') || url.endsWith('/kresz/') || url.endsWith('/KRESZ-teszt/');

    if (isCoreCode && !url.includes('data/asset/')) {
        event.respondWith(
            fetch(event.request).then(function(networkResponse) {
                if (networkResponse && networkResponse.status === 200) {
                    var clone = networkResponse.clone();
                    caches.open(CACHE_NAME).then(function(cache) {
                        cache.put(event.request, clone);
                    });
                }
                return networkResponse;
            }).catch(function() {
                return caches.match(event.request).then(function(cachedResponse) {
                    if (cachedResponse) return cachedResponse;
                    if (event.request.mode === 'navigate') {
                        return caches.match('./index.html');
                    }
                });
            })
        );
        return;
    }

    // Képek és egyéb statikus eszközök: CACHE-FIRST
    event.respondWith(
        caches.match(event.request).then(function(cachedResponse) {
            if (cachedResponse) return cachedResponse;

            return fetch(event.request).then(function(networkResponse) {
                if (networkResponse && networkResponse.status === 200) {
                    var clone = networkResponse.clone();
                    caches.open(CACHE_NAME).then(function(cache) {
                        cache.put(event.request, clone);
                    });
                }
                return networkResponse;
            });
        })
    );
});
