/**
 * KRESZ Teszt & Gyakorló - Progressive Web App Service Worker
 * Kettős gyorsítótár architektúra:
 * - APP_CACHE: Alkalmazás kódja (HTML, JS, CSS, JSONP adatok) - Network-First, verziónként frissül
 * - MEDIA_CACHE: Kérdésképek és ikonok - Cache-First, tartósan megmarad kódfrissítéskor is!
 */

var APP_CACHE = 'kresz-app-v12';
var MEDIA_CACHE = 'kresz-media-v1';

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
    './assets/material-icons.woff2',
    './assets/material-icons.woff',
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
    './tests/index.html'
];

// Telepítéskor előtárazzuk az alkalmazás magját és azonnal aktiváljuk
self.addEventListener('install', function(event) {
    self.skipWaiting();
    event.waitUntil(
        caches.open(APP_CACHE).then(function(cache) {
            return cache.addAll(CORE_ASSETS).catch(function(err) {
                console.warn('Precache figyelmeztetés:', err);
            });
        })
    );
});

// Aktiváláskor CSAK az elavult app cache-eket töröljük, a MEDIA_CACHE megmarad!
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== APP_CACHE && cacheName !== MEDIA_CACHE) {
                        console.log('Régi cache törlése:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(function() {
            return self.clients.claim();
        })
    );
});

// Üzenetkezelés az azonnali frissítéshez
self.addEventListener('message', function(event) {
    if (event.data && (event.data === 'skipWaiting' || event.data.type === 'SKIP_WAITING')) {
        self.skipWaiting();
    }
});

// Intelligens kéréskezelés
self.addEventListener('fetch', function(event) {
    if (event.request.method !== 'GET') return;
    var url = event.request.url;
    if (!url.startsWith('http')) return;

    // Képek és médiafájlok: CACHE-FIRST a tartós MEDIA_CACHE-be
    var isMediaAsset = url.includes('/data/asset/') || 
                       url.includes('/assets/icons/') || 
                       /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(url);

    if (isMediaAsset) {
        event.respondWith(
            caches.open(MEDIA_CACHE).then(function(mediaCache) {
                return mediaCache.match(event.request).then(function(cachedResponse) {
                    if (cachedResponse) return cachedResponse;
                    return fetch(event.request).then(function(networkResponse) {
                        if (networkResponse && networkResponse.status === 200) {
                            mediaCache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    }).catch(function() {
                        return cachedResponse;
                    });
                });
            })
        );
        return;
    }

    // MINDEN EGYÉB (HTML, JS, CSS, JSONP, navigáció): NETWORK-FIRST az APP_CACHE-be
    // Mindig a legfrissebb változatot kéri a szerverről. Ha van kapcsolat, azonnal az új jön le.
    // Offline módban a gyorsítótárból szolgálja ki.
    event.respondWith(
        fetch(event.request).then(function(networkResponse) {
            if (networkResponse && networkResponse.status === 200) {
                var clone = networkResponse.clone();
                caches.open(APP_CACHE).then(function(cache) {
                    cache.put(event.request, clone);
                });
            }
            return networkResponse;
        }).catch(function() {
            return caches.match(event.request).then(function(cachedResponse) {
                if (cachedResponse) return cachedResponse;
                if (event.request.mode === 'navigate' && !url.includes('/tests/')) {
                    return caches.match('./index.html');
                }
            });
        })
    );
});
