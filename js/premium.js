document.addEventListener('DOMContentLoaded', () => {
  const E = window.ENV || {};
  const num = v => { const n = Number(String(v ?? '').replace(',','.')); return Number.isFinite(n) ? n : null; };
  const euro = v => v==null ? '—' : v.toLocaleString('es-ES',{style:'currency',currency:'EUR'});

  const prices = {
    individual:   num(E.PAYPAL_ONESHOT_PRICE_EUR_IMAGE),
    pack10Images: num(E.PAYPAL_ONESHOT_PACK10_IMAGES_EUR),
    pack5Videos:  num(E.PAYPAL_ONESHOT_PACK5_VIDEOS_EUR),
    video:        num(E.PAYPAL_ONESHOT_PRICE_EUR_VIDEO),
    lifetime:     num(E.PAYPAL_ONESHOT_PRICE_EUR_LIFETIME),
    monthly:      14.99, // PLAN_MONTHLY_1499
    annual:       49.99  // PLAN_ANNUAL_4999
  };

  const links = { individual: "/premium.html#comprar", packs: "/premium.html#packs", subscribe: "/premium.html#suscripciones" };

  const plansBar=document.getElementById('plans-bar');
  const pill=(label,val,href)=>{const a=document.createElement('a');a.className='plan-pill';a.href=href||'#';a.textContent=label+': '+euro(val);return a};
  plansBar.appendChild(pill('Individual', prices.individual, links.individual));
  plansBar.appendChild(pill('Pack 10 imágenes', prices.pack10Images, links.packs));
  plansBar.appendChild(pill('Pack 5 vídeos', prices.pack5Videos, links.packs));
  plansBar.appendChild(pill('Mensual', prices.monthly, links.subscribe));
  plansBar.appendChild(pill('Anual', prices.annual, links.subscribe));
  plansBar.appendChild(pill('Lifetime', prices.lifetime, links.subscribe));

  const all = IBG.getUncensoredList();
  const pick = IBG.pickRandom(all, Math.min(100, all.length));
  const newCount = Math.floor(pick.length * 0.30);
  const idxs = new Set(); while(idxs.size < newCount && idxs.size < pick.length){ idxs.add(Math.floor(Math.random()*pick.length)) }
  const grid = document.getElementById('premium-grid');

  pick.forEach((it, i) => {
    const card=document.createElement('div'); card.className='card';
    if(idxs.has(i)){ const b=document.createElement('span'); b.className='badge new'; b.textContent='Nuevo'; card.appendChild(b) }
    const img=document.createElement('img'); img.loading='lazy'; img.decoding='async'; img.src=it.src; card.appendChild(img);
    const price=document.createElement('a'); price.className='price'; price.href=links.individual + '?f=' + encodeURIComponent(it.src);
    price.innerHTML='<img src="./img/paypal-mark.svg" alt="PayPal"><span>'+euro(prices.individual)+'</span>';
    card.appendChild(price);
    grid.appendChild(card);
  });

  IBG.loadAds();
});
