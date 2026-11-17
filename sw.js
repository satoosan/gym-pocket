const CACHE = "gym-pocket-v23";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css?v=18",
  "./app.js?v=18",
  "./manifest.webmanifest",
  "./icon.svg"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const requestURL = new URL(event.request.url);
  if (requestURL.origin !== self.location.origin) return;

  // Assets locais: cache-first para abrir a interface sem aguardar a rede.
  const isAsset = /\\.(?:js|css|svg|webmanifest)$/.test(requestURL.pathname);
  if (isAsset) {
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
        if (response.ok) caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
        return response;
      }))
    );
    return;
  }

  // Navegação: tenta atualizar e usa a cópia local quando estiver offline.
  event.respondWith(
    fetch(event.request).then(response => {
      if (response.ok) caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
      return response;
    }).catch(() => caches.match(event.request).then(cached => cached || caches.match("./index.html")))
  );
});
