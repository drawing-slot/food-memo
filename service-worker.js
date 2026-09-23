const CACHE = "food-memo-v2-9";
const ASSETS = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", event => { self.skipWaiting(); event.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))); });
self.addEventListener("activate", event => { event.waitUntil((async()=>{ for (const key of await caches.keys()) if(key!==CACHE) await caches.delete(key); await self.clients.claim(); })()); });
self.addEventListener("fetch", event => {
  if(event.request.method!=="GET") return;
  const url=new URL(event.request.url);
  if(event.request.mode==="navigate" || url.pathname.endsWith("/index.html") || url.pathname.endsWith("/")){
    event.respondWith(fetch(event.request,{cache:"no-store"}).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(event.request,copy));return r;}).catch(()=>caches.match(event.request).then(r=>r||caches.match("./index.html"))));
    return;
  }
  event.respondWith(caches.match(event.request).then(r=>r||fetch(event.request).then(net=>{const copy=net.clone();caches.open(CACHE).then(c=>c.put(event.request,copy));return net;})));
});
