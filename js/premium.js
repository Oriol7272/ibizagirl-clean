document.addEventListener('DOMContentLoaded', async () => {
  const E = window.ENV || {};
  const num = v => { const n = Number(String(v ?? '').replace(',','.')); return Number.isFinite(n) ? n : null; };
  const euro = v => v==null ? '—' : v.toLocaleString('es-ES',{style:'currency',currency:'EUR'});

  // Pack 5 vídeos -> clave correcta; fallback al nombre legado si existiera
  const pack5VideosRaw = E.PAYPAL_ONESHOT_PACK5_VIDEOS_EUR ?? E.PAYPAL_ONESHOT_PACKS_VIDEOS_EUR;

  const prices = {
    individual:   num(E.PAYPAL_ONESHOT_PRICE_EUR_IMAGE),
    pack10Images: num(E.PAYPAL_ONESHOT_PACK10_IMAGES_EUR),
    pack5Videos:  num(pack5VideosRaw),
    video:        num(E.PAYPAL_ONESHOT_PRICE_EUR_VIDEO),
    lifetime:     num(E.PAYPAL_ONESHOT_PRICE_EUR_LIFETIME),
    monthly:      14.99, // PLAN_MONTHLY_1499
    annual:       49.99  // PLAN_ANNUAL_4999
  };

  const PLAN_MONTHLY = E.PAYPAL_PLAN_MONTHLY_1499 || null;
  const PLAN_ANNUAL  = E.PAYPAL_PLAN_ANNUAL_4999  || null;

  // ----- barra de planes -----
  const plansBar = document.getElementById('plans-bar');
  if(plansBar){
    const mk = (label,val,href,id) => {
      const a=document.createElement('a'); a.className='plan-pill'; a.href=href||'#'; a.textContent=label+': '+euro(val);
      if(id) a.id=id; return a;
    };
    plansBar.appendChild(mk('Individual', prices.individual, '#pp-individual', 'pp-pill-ind'));
    plansBar.appendChild(mk('Pack 10 imágenes', prices.pack10Images, '#pp-pack10', 'pp-pill-p10'));
    plansBar.appendChild(mk('Pack 5 vídeos', prices.pack5Videos, '#pp-pack5v', 'pp-pill-p5v'));
    plansBar.appendChild(mk('Mensual', prices.monthly, '#pp-monthly', 'pp-pill-m'));
    plansBar.appendChild(mk('Anual', prices.annual, '#pp-annual', 'pp-pill-a'));
    plansBar.appendChild(mk('Lifetime', prices.lifetime, '#pp-lifetime', 'pp-pill-life'));
  }

  // Contenedores PayPal globales (inserta si no existen)
  function ensureContainer(id){
    let el=document.getElementById(id);
    if(!el){ el=document.createElement('div'); el.id=id; el.style.margin="8px 0"; (document.querySelector('.plans')||document.body).appendChild(el); }
    return el;
  }
  const oneShotCtn = ensureContainer('paypal-oneshot');
  const subMonthCtn = ensureContainer('paypal-monthly');
  const subAnnualCtn = ensureContainer('paypal-annual');

  // Montar botones (one-shot: usa precio individual; suscripción usa plan IDs)
  if (window.PayPalLive){
    if (prices.individual != null) window.PayPalLive.mountOneShot(oneShotCtn, prices.individual);
    if (PLAN_MONTHLY) window.PayPalLive.mountSubscription(subMonthCtn, PLAN_MONTHLY);
    if (PLAN_ANNUAL)  window.PayPalLive.mountSubscription(subAnnualCtn, PLAN_ANNUAL);
  }

  // ----- Thumbs premium -----
  const all = IBG.getUncensoredList();
  const pick = IBG.pickRandom(all, Math.min(100, all.length));
  const newCount = Math.floor(pick.length * 0.30);
  const idxs = new Set(); while(idxs.size < newCount && idxs.size < pick.length){ idxs.add(Math.floor(Math.random()*pick.length)) }
  const grid = document.getElementById('premium-grid');

  function overlayPrice(el, priceEUR){
    const a=document.createElement('a'); a.className='price'; a.href='#pp-buy'; a.setAttribute('data-amount', String(priceEUR ?? ''));
    a.innerHTML='<img src="./img/paypal-mark.svg" alt="PayPal"><span>'+euro(priceEUR)+'</span>';
    a.addEventListener('click', (ev)=>{ ev.preventDefault();
      const amt = Number(a.getAttribute('data-amount')||'0')||0;
      const cont = document.getElementById('paypal-oneshot'); if(cont && window.PayPalLive){ window.PayPalLive.mountOneShot(cont, amt); cont.scrollIntoView({behavior:'smooth',block:'center'}); }
    });
    el.appendChild(a);
  }

  pick.forEach((it, i) => {
    const card=document.createElement('div'); card.className='card';
    if(idxs.has(i)){ const b=document.createElement('span'); b.className='badge new'; b.textContent='Nuevo'; card.appendChild(b) }
    const img=document.createElement('img'); img.loading='lazy'; img.decoding='async'; img.src=it.src; card.appendChild(img);
    overlayPrice(card, prices.individual);
    grid && grid.appendChild(card);
  });

  IBG.loadAds();
  IBG.loadCrisp();
});
