var CACHE = 'whakatu-v1';
var STATIC = ['/', '/index.html', '/manifest.json', '/logo.png'];

self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c) { return c.addAll(STATIC); }));
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  // Network-first for tracks.json so new tracks appear after push
  if (e.request.url.indexOf('tracks.json') !== -1) {
    e.respondWith(
      fetch(e.request).catch(function() { return caches.match(e.request); })
    );
    return;
  }
  // Cache-first for everything else
  e.respondWith(
    caches.match(e.request).then(function(hit) {
      return hit || fetch(e.request).then(function(res) {
        var clone = res.clone();
        caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
        return res;
      });
    })
  );
});
