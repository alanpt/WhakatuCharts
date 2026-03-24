const CACHE = 'whakatu-v2'; // bump this whenever you push changes
const STATIC = ['/', '/index.html', '/manifest.json', '/logo.png'];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(STATIC);
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(
        keyList.map(function(key) {
          if (key !== CACHE) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(e) {
  // Network-first for tracks.json AND index.html
  if (e.request.url.includes('tracks.json') || 
      e.request.url.endsWith('/') || 
      e.request.url.includes('index.html')) {
    e.respondWith(
      fetch(e.request)
        .then(function(res) {
          var clone = res.clone();
          caches.open(CACHE).then(function(cache) {
            cache.put(e.request, clone);
          });
          return res;
        })
        .catch(function() {
          return caches.match(e.request);
        })
    );
    return;
  }
  // Cache-first for everything else (audio, images, logo)
  e.respondWith(
    caches.match(e.request).then(function(hit) {
      return hit || fetch(e.request).then(function(res) {
        var clone = res.clone();
        caches.open(CACHE).then(function(cache) {
          cache.put(e.request, clone);
        });
        return res;
      });
    })
  );
});
