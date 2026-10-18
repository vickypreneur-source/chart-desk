// Network-first untuk file aplikasi; data harga (server lain) tidak disimpan.
const CACHE="chartdesk-cache";
const FILES=["./","index.html","install.js","manifest.json","icon-192.png","icon-512.png","apple-touch-icon.png","favicon.png"];
const LIB="https://unpkg.com/lightweight-charts@4.2.0/dist/lightweight-charts.standalone.production.js";
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES).then(()=>c.add(LIB).catch(()=>{}))));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);
  const mine=u.origin===location.origin, lib=e.request.url===LIB, font=/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if(e.request.method!=="GET"||!(mine||lib||font))return; // data API: langsung ke jaringan
  e.respondWith(fetch(e.request,{cache:mine?"no-cache":"default"}).then(res=>{
    if(res&&(res.ok||res.type==="opaque")){const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}
    return res;
  }).catch(()=>caches.match(e.request).then(hit=>hit||caches.match("index.html"))));
});
