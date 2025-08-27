(function(){
  const env = window.IBG_ENV || {};
  const $ = (q,r=document)=>r.querySelector(q);

  // Inserta/asegura CSS del menú
  (function(){
    const s=document.createElement('style');
    s.id='premium-menu-style';
    s.textContent = `
      .premium-topmenu{position:sticky;top:0;z-index:999;background:#fff;border-bottom:1px solid #eaeaea;}
      .premium-topmenu .menu-inner{max-width:1200px;margin:0 auto;padding:8px 12px;display:flex;gap:8px;flex-wrap:wrap;align-items:center;font:inherit}
      .premium-topmenu .slot{display:flex;align-items:center;gap:6px}
      .premium-topmenu .lbl{font:inherit;font-size:14px;color:#222}
      .premium-topmenu .btn{font:inherit;font-size:14px;line-height:1;border:1px solid #ddd;border-radius:8px;background:#fafafa;padding:6px 8px;min-width:140px}
      .premium-topmenu .btn .disabled{opacity:.6}
    `;
    document.head.appendChild(s);
  })();

  // Crea contenedor si no existe
  let app = document.getElementById('premium-app');
  if(!app){ app = document.createElement('div'); app.id='premium-app'; document.body.prepend(app); }

  // Crea topmenu si no existe
  let nav = document.getElementById('premium-topmenu');
  if(!nav){
    nav = document.createElement('nav');
    nav.id='premium-topmenu';
    nav.className='premium-topmenu';
    nav.innerHTML = `
      <div class="menu-inner">
        <div class="slot"><span class="lbl">Mensual</span><div id="btn-monthly"  class="btn"></div></div>
        <div class="slot"><span class="lbl">Anual</span><div   id="btn-annual"   class="btn"></div></div>
        <div class="slot"><span class="lbl">Lifetime</span><div id="btn-life"     class="btn"></div></div>
        <div class="slot"><span class="lbl">Pack 10 imágenes</span><div id="btn-pack10" class="btn"></div></div>
        <div class="slot"><span class="lbl">Pack 5 vídeos</span><div   id="btn-pack5v" class="btn"></div></div>
      </div>`;
    app.prepend(nav);
  }

  // Resolver plan IDs buscando variables PAYPAL_* típicas (sin renombrar)
  function findPlan(needles){
    const keys = Object.keys(env).filter(k => /^PAYPAL_.*PLAN/.test(k));
    const L = needles.map(s=>s.toLowerCase());
    for(const k of keys){
      const kl=k.toLowerCase();
      if(L.some(w=>kl.includes(w))) return env[k];
    }
    return null;
  }
  const planMonthly = findPlan(['monthly','mensual','month']);
  const planAnnual  = findPlan(['annual','anual','year','yearly']);
  const planLife    = findPlan(['lifetime','vitalicio','life']);

  // Montar botones de suscripción (paypal_subs)
  function mountSubs(sel, planId){
    const host = $(sel);
    if(!host) return;
    if(!planId){ host.innerHTML='<span class="disabled">Configurar plan</span>'; return; }
    if(!(window.paypal_subs && window.paypal_subs.Buttons)) { return setTimeout(()=>mountSubs(sel,planId),200); }
    window.paypal_subs.Buttons({
      style:{ layout:'horizontal', tagline:false, height:32 },
      createSubscription: (data, actions) => actions.subscription.create({ plan_id: planId }),
      onApprove: data => console.log('[subs] OK', sel, data),
    }).render(sel);
  }
  mountSubs('#btn-monthly', planMonthly);
  mountSubs('#btn-annual',  planAnnual);
  mountSubs('#btn-life',    planLife);

  // Montar packs (capture) 10*0.10 y 5*0.30
  function mountPay(sel, value){
    const host = $(sel);
    if(!host) return;
    if(!(window.paypal_pay && window.paypal_pay.Buttons)) { return setTimeout(()=>mountPay(sel,value),200); }
    window.paypal_pay.Buttons({
      style:{ layout:'horizontal', tagline:false, height:32 },
      createOrder: (d, a) => a.order.create({ purchase_units:[{ amount:{ currency_code:'EUR', value: value.toFixed(2) } }]}),
      onApprove: (d, a) => a.order.capture().then(det => console.log('[pack] OK', sel, det)),
    }).render(sel);
  }
  mountPay('#btn-pack10', 10*0.10);
  mountPay('#btn-pack5v',  5*0.30);
})();
