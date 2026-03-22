var CACHE = 'whakatu-v3';
var STATIC = ['/', '/index.html', '/manifest.json', '/logo.png'];

self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c) { return c.addAll(STATIC); }));
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  var url = e.request.url;

  // Never intercept audio — let browser handle range requests natively
  if (url.indexOf('/tracks/') !== -1 &&
     (url.slice(-4) === '.mp3' || url.slice(-4) === '.m4a')) {
    return;
  }

  // Network-first for tracks.json and index.html
  if (url.indexOf('tracks.json') !== -1 ||
      url.slice(-1) === '/' ||
      url.indexOf('index.html') !== -1) {
    e.respondWith(
      fetch(e.request).then(function(res) {
        var clone = res.clone();
        caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
        return res;
      }).catch(function() {
        return caches.match(e.request);
      })
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
