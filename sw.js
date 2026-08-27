const CACHE='dijital-kart-v1.0.0';
const LOCAL=['./','./index.html','./style.css','./app.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
const QR='https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js';
self.addEventListener('install',e=>{e.waitUntil((async()=>{const c=await caches.open(CACHE);await c.addAll(LOCAL);try{await c.add(QR)}catch(_){ }self.skipWaiting()})())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==CACHE)await caches.delete(k);await self.clients.claim()})())});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith((async()=>{
    const cached=await caches.match(e.request);if(cached)return cached;
    try{const r=await fetch(e.request);const c=await caches.open(CACHE);c.put(e.request,r.clone()).catch(()=>{});return r}
    catch(_){if(e.request.mode==='navigate')return caches.match('./index.html');throw _}
  })());
});
