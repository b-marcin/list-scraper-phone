const cacheName = 'list-scraper-phone-1f600d391de22c4b071cbf40683db9f4004d637eb6f2d3d8ee345febf28f3f1f';
const assets = ["./index.html","./manifest.webmanifest","./apple-touch-icon.png","./icon-192.png","./icon-512.png","./favicon-32.png","./assets/index-B-vE-BVX.css","./assets/index-BWE47BLP.js","./assets/manifest-h5mFo10D.webmanifest","./assets/xlsx-Bv_pSZNU.js"];
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => cache.addAll(assets))
      .then(() => self.skipWaiting()),
  );
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('list-scraper-phone-') && key !== cacheName)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (
    event.request.mode === 'navigate' &&
    url.pathname.startsWith(new URL(self.registration.scope).pathname)
  ) {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.open(cacheName).then((cache) => cache.match('./index.html')),
      ),
    );
  } else if (assets.some((asset) => new URL(asset, self.registration.scope).href === url.href)) {
    event.respondWith(
      caches
        .open(cacheName)
        .then(async (cache) => (await cache.match(event.request)) ?? fetch(event.request)),
    );
  }
});
