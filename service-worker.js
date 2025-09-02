// SW killer: desregistra cualquier SW previo y no cachea nada
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    try { await self.registration.unregister(); } catch(e){}
    const cs = await self.clients.matchAll({ includeUncontrolled: true });
    for (const c of cs) { c.navigate(c.url); }
  })());
});
self.addEventListener('fetch', e => {});
