self.addEventListener('fetch', function(event) {
    if (event.request.destination === 'document') {
        event.respondWith(fetch(event.request).catch(function() {
            return caches.match(event.request);
        }));
    } else if (event.request.destination === 'audio' || event.request.destination === 'image') {
        event.respondWith(fetch(event.request).then(function(response) {
            let responseToCache = response.clone();
            caches.open('track-cache').then(function(cache) {
                cache.put(event.request, responseToCache);
            });
            return response;
        }).catch(function() {
            return caches.match(event.request);
        }));
    }
});

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('track-cache').then(function(cache) {
            return cache.addAll([
                'tracks.json',
                'index.html'
            ]);
        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== 'track-cache') {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});