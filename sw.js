const CACHE='fb3x-v1';
const FILES=["./", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "fonts/barlow-400.woff2", "fonts/barlow-500.woff2", "fonts/barlow-600.woff2", "fonts/barlow-700.woff2", "fonts/barlow-condensed-600.woff2", "fonts/barlow-condensed-700.woff2"];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  const req=e.request, url=new URL(req.url);
  if(req.method!=='GET'||url.origin!==location.origin) return;
  const key=req.mode==='navigate'?'./':req;
  const fresh=fetch(req).then(res=>{ if(res.ok){ const copy=res.clone(); caches.open(CACHE).then(c=>c.put(key,copy)); } return res; });
  e.respondWith(caches.match(key,{ignoreSearch:true}).then(hit=>hit||fresh));
  e.waitUntil(fresh.catch(()=>{}));
});
