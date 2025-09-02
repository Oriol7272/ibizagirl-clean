// SW killer para forzar actualización inmediata
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    try { const reg = await self.registration.unregister(); } catch(e){}
    const clientsArr = await self.clients.matchAll({includeUncontrolled:true});
    for (const c of clientsArr) { c.navigate(c.url); }
  })());
});
self.addEventListener('fetch', () => {}); // no cachea nada
