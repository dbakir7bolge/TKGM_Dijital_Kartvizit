const CACHE='kurumsal-dijital-kart-v2.0.0';
const LOCAL=['./','./index.html','./style.css','./app.js','./vendor/qrcode-local.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(LOCAL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith((async()=>{const cached=await caches.match(e.request);if(cached)return cached;try{const r=await fetch(e.request);if(new URL(e.request.url).origin===self.location.origin){const c=await caches.open(CACHE);c.put(e.request,r.clone()).catch(()=>{})}return r}catch(err){if(e.request.mode==='navigate')return caches.match('./index.html');throw err}})())});
