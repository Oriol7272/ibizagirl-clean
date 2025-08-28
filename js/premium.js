document.addEventListener('DOMContentLoaded', () => {
  const E = window.ENV || {};
  const toNum = x => { const v = Number(String(x==null?'':x).replace(',','.')); return isNaN(v)?0:v };

  // Precios exactos desde Vercel (sin inventar nombres):
  const prices = {
    individual:   toNum(E.PAYPAL_ONESHOT_PRICE_EUR_IMAGE),
    pack10Images: toNum(E.PAYPAL_ONESHOT_PACK10_IMAGES_EUR),
    pack5Videos:  toNum(E.PAYPAL_ONESHOT_PACK5_VIDEOS_EUR),
    video:        toNum(E.PAYPAL_ONESHOT_PRICE_EUR_VIDEO),
    lifetime:     toNum(E.PAYPAL_ONESHOT_PRICE_EUR_LIFETIME),
    monthly:      14.99, // según PLAN_MONTHLY_1499
    annual:       49.99  // según PLAN_ANNUAL_4999
  };

  const links = {
    individual: "/premium.html#comprar",
    packs: "/premium.html#packs",
    subscribe: "/premium.html#suscripciones"
  };

  const plansBar = document.getElementById('plans-bar');
  const euro = v => isFinite(v) ? v.toLocaleString('es-ES',{style:'currency',currency:'EUR'}) : '';
  const pill = (label, value, href) => { const a=document.createElement('a'); a.className='plan-pill'; a.href=href||'#'; a.textContent=label + (isFinite(value)?': '+euro(value):''); return a; };

  plansBar.appendChild(pill('Individual', prices.individual, links.individual));
  plansBar.appendChild(pill('Pack 10 imágenes', prices.pack10Images, links.packs));
  plansBar.appendChild(pill('Pack 5 vídeos', prices.pack5Videos, links.packs));
  plansBar.appendChild(pill('Mensual', prices.monthly, links.subscribe));
  plansBar.appendChild(pill('Anual', prices.annual, links.subscribe));
  plansBar.appendChild(pill('Lifetime', prices.lifetime, links.subscribe));

  // Thumbs premium: 100 desde uncensored, 30% marcadas "Nuevo"
  const all = IBG.getUncensoredList();
  const pick = IBG.pickRandom(all, Math.min(100, all.length));
  const newCount = Math.floor(pick.length * 0.30);
  const idxs = new Set(); while(idxs.size < newCount && idxs.size < pick.length){ idxs.add(Math.floor(Math.random()*pick.length)) }
  const grid = document.getElementById('premium-grid');

  pick.forEach((it, i) => {
    const card = document.createElement('div'); card.className = 'card';
    if(idxs.has(i)){ const badge=document.createElement('span'); badge.className='badge new'; badge.textContent='Nuevo'; card.appendChild(badge) }
    const img = document.createElement('img'); img.loading='lazy'; img.decoding='async'; img.src = it.src; card.appendChild(img);
    const price = document.createElement('a'); price.className = 'price'; price.href = links.individual + '?f=' + encodeURIComponent(it.src);
    price.innerHTML = '<img src="./img/paypal-mark.svg" alt="PayPal"><span>'+euro(prices.individual)+'</span>';
    card.appendChild(price);
    grid.appendChild(card);
  });

  IBG.loadAds();
});
