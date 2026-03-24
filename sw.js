// Service Worker - sw.js

const CACHE_NAME = 'whakatu-charts-cache-v1';
const NETWORK_FIRST_URL = 'tracks.json';
const CACHE_FIRST_URLS = ['/audio/', '/images/'];

self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);

    if (requestUrl.pathname === NETWORK_FIRST_URL) {
        event.respondWith(networkFirst(event));
    } else if (CACHE_FIRST_URLS.some(url => requestUrl.pathname.indexOf(url) === 0)) {
        event.respondWith(cacheFirst(event));
    }
});

async function networkFirst(event) {
    try {
        const response = await fetch(event.request);
        return response;
    } catch (error) {
        return caches.match(event.request);
    }
}

async function cacheFirst(event) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(event.request);
    if (cachedResponse) {
        return cachedResponse;
    }
    return fetch(event.request);
}
