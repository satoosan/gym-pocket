const CACHE = "gym-pocket-v21";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css?v=16",
  "./app.js?v=16",
  "./manifest.webmanifest",
  "./icon.svg"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const url=new URL(event.request.url);

  if(
    event.request.method==="POST" &&
    url.pathname.endsWith("/share-target")
  ){
    event.respondWith((async()=>{
      try{
        const formData=await event.request.formData();
        const file=formData.get("backup");

        if(file && typeof file.text==="function"){
          const rawText=await file.text();
          const cache=await caches.open("gym-pocket-share-inbox");

          await cache.put(
            "./__shared_gympocket_backup__",
            new Response(rawText,{
              headers:{
                "Content-Type":"application/json",
                "X-GymPocket-FileName":encodeURIComponent(file.name || "Backup compartilhado.gympocket")
              }
            })
          );
        }

        return Response.redirect("./?shared-backup=1",303);
      }catch(err){
        return Response.redirect("./?shared-backup-error=1",303);
      }
    })());
    return;
  }

  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
