/* Render de thumbnails premium con blur permanente (hasta desbloqueo)
   - Evita doble .webp
   - Intenta /uncensored/ y cae a /full/ si hay 403/404
   - Quita referrer para evitar bloqueos por hotlink
*/
(() => {
  const BASE = (window.__ENV && window.__ENV.BASE) || "https://ibizagirl.pics";
  const grid = document.querySelector('.ibg-premium-grid');
  if (!grid) return;

  // content-data3/4 definen window.PREMIUM_PART1 / PREMIUM_PART2 (nombres de archivo)
  const L = (window.PREMIUM_PART1||[]).concat(window.PREMIUM_PART2||[]);
  const ensureWebp = (n) => (n||"").replace(/\.(jpe?g|png|gif|webp)$/i,'') + '.webp';

  function url(folder, name){ return `${BASE}/${folder}/${ensureWebp(name)}`; }

  function card(name){
    const wrap = document.createElement('div');
    wrap.className = 'ibg-card';

    const img = document.createElement('img');
    img.alt = '';
    img.loading = 'lazy';
    img.referrerPolicy = 'no-referrer';
    img.src = url('uncensored', name);
    img.onerror = () => { if (img.src.includes('/uncensored/')) img.src = url('full', name); };
    wrap.appendChild(img);

    const lock = document.createElement('div');
    lock.className = 'lock';
    lock.textContent = 'Bloqueado';
    wrap.appendChild(lock);

    const pp = document.createElement('div');
    pp.className = 'pp-buy';
    pp.dataset.paypal = 'subscription';
    pp.dataset.planId = (window.__ENV && window.__ENV.PAYPAL_PLAN_ID_MONTHLY) || '';
    wrap.appendChild(pp);

    return wrap;
  }

  // Render
  grid.innerHTML = '';
  L.slice(0, 300).forEach(n => grid.appendChild(card(n)));

  console.log('[premium-thumbs] render:', L.length, 'base:', BASE);
})();
