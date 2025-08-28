document.addEventListener('DOMContentLoaded', () => {
  const E = window.ENV || {};
  function n(x){const v=Number(String(x==null?'':x).replace(',','.'));return isNaN(v)?0:v}
  const prices = {
    individual: n(E.PAYPAL_ONESHOT_PRICE_EUR_IMAGE||0.10),
    pack10Images: n(E.PAYPAL_ONESHOT_PACK10_IMAGES_EUR||2.99),
    packs5Videos: n(E.PAYPAL_ONESHOT_PACK5_VIDEOS_EUR||9.99),
    video: n(E.PAYPAL_ONESHOT_PRICE_EUR_VIDEO||0.30),
    lifetime: n(E.PAYPAL_ONESHOT_PRICE_EUR_LIFETIME||49.99),
    monthly: E.PAYPAL_PLAN_MONTHLY_1499 ? 14.99 : 14.99,
    annual:  E.PAYPAL_PLAN_ANNUAL_4999  ? 49.99 : 49.99
  };
  const links = { individual: "/premium.html#comprar", packs: "/premium.html#packs", subscribe: "/premium.html#suscripciones" };
  const plansBar = document.getElementById('plans-bar');
  function euro(v){return v.toLocaleString('es-ES',{style:'currency',currency:'EUR'})}
  function pill(label, value, href){ const a=document.createElement('a'); a.className='plan-pill'; a.href=href; a.textContent=label+': '+euro(value); return a }
  plansBar.appendChild(pill('Individual', prices.individual, links.individual));
  plansBar.appendChild(pill('Pack 10 imágenes', prices.pack10Images, links.packs));
  plansBar.appendChild(pill('Pack 5 vídeos', prices.packs5Videos, links.packs));
  plansBar.appendChild(pill('Mensual', prices.monthly, links.subscribe));
  plansBar.appendChild(pill('Anual', prices.annual, links.subscribe));
  plansBar.appendChild(pill('Lifetime', prices.lifetime, links.subscribe));
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
    price.innerHTML = '<img src="./img/paypal-mark.svg" alt="PayPal" width="16" height="16" style="vertical-align:middle;margin-right:6px"><span>'+euro(prices.individual)+'</span>';
    card.appendChild(price);
    grid.appendChild(card);
  });
  IBG.loadAds();
});
