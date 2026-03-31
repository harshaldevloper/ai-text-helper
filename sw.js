// Service Worker - AIVANTAGE Tools
// No ad code - clean for Paddle approval

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Standard fetch handling - no ad injection
    event.respondWith(fetch(event.request));
});
