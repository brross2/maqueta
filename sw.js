// Maqueta — service worker. Cambia solo cuando cambia la app (la versión sale del contenido de index.html).
const V = 'maqueta-26443f37f2';
const CORE = ['./', 'index.html', 'config.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
const CDN = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
const EXTRA = ['cdnjs.cloudflare.com', 'fonts.googleapis.com', 'fonts.gstatic.com'];   // se guardan al usarse; Google (accounts, Drive) no se toca
self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(V);
    await c.addAll(CORE);
    try{ await c.put(CDN, await fetch(CDN)); }catch(_){}   // Three.js, para poder abrir sin conexión
    self.skipWaiting();
  })());
});
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for(const k of await caches.keys()) if(k.startsWith('maqueta-') && k!==V) await caches.delete(k);
    await self.clients.claim();
  })());
});
const keep = (r, x) => { if(x && (x.ok || x.type==='opaque')){ const c = x.clone(); caches.open(V).then(k => k.put(r, c)); } return x; };
self.addEventListener('fetch', e => {
  const r = e.request; if(r.method!=='GET') return;
  const u = new URL(r.url);
  if(u.origin===location.origin){
    if(r.mode==='navigate'){   // la página: primero la red (así llegan las versiones nuevas); sin conexión, la guardada
      e.respondWith(fetch(r).then(x => keep('index.html', x)).catch(() => caches.match('index.html')));
      return;
    }
    if(u.pathname.endsWith('/config.js')){ e.respondWith(fetch(r).then(x => keep(r, x)).catch(() => caches.match(r))); return; }   // la configuración: primero la red, así un cambio se nota enseguida
    e.respondWith(caches.match(r).then(h => h || fetch(r).then(x => keep(r, x))));
    return;
  }
  if(EXTRA.includes(u.hostname)) e.respondWith(caches.match(r).then(h => h || fetch(r).then(x => keep(r, x))));
});
