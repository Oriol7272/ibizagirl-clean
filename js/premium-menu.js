(function(){
  const $ = (q,r=document)=>r.querySelector(q);

  // CSS de menú + ocultar laterales / menús antiguos
  (function(){
    const s=document.createElement('style');
    s.id='premium-menu-style';
    s.textContent = `
      /* ocultar laterales/menús previos en premium */
      .premium-sidebar, .menu-lateral, #sidebar, aside, .left-menu, .subscription-menu, .subs-menu { display:none !important; }
      /* top menu */
      #premium-topmenu{position:sticky;top:0;z-index:1000;background:#fff;border-bottom:1px solid #eaeaea}
      #premium-topmenu .inner{max-width:1200px;margin:0 auto;padding:8px 12px;display:flex;gap:8px;flex-wrap:wrap;align-items:center}
      #premium-topmenu .slot{display:flex;align-items:center;gap:6px}
      #premium-topmenu .lbl{font:inherit;font-size:14px;color:#222}
      #premium-topmenu .btn{font:inherit;font-size:14px;line-height:1;border:1px solid #ddd;border-radius:10px;background:#fafafa;padding:6px 8px;min-width:150px}
    `;
    document.head.appendChild(s);
  })();

  // Contenedor principal (arriba del body)
  let host = document.getElementById('premium-app');
  if(!host){ host=document.createElement('div'); host.id='premium-app'; document.body.prepend(host); }

  // Menú único
  let nav = document.getElementById('premium-topmenu');
  if(!nav){
    nav=document.createElement('nav');
    nav.id='premium-topmenu';
    nav.innerHTML = `
      <div class="inner" style="font:inherit">
        <div class="slot"><span class="lbl">Mensual</span><div id="btn-monthly"  class="btn"></div></div>
        <div class="slot"><span class="lbl">Anual</span><div   id="btn-annual"   class="btn"></div></div>
        <div class="slot"><span class="lbl">Lifetime</span><div id="btn-life"     class="btn"></div></div>
        <div class="slot"><span class="lbl">Pack 10 imágenes</span><div id="btn-pack10" class="btn"></div></div>
        <div class="slot"><span class="lbl">Pack 5 vídeos</span><div   id="btn-pack5v" class="btn"></div></div>
      </div>`;
    host.prepend(nav);
  }

  // Resolver plan IDs sin inventar nombres (buscando dentro de PAYPAL_* que contengan PLAN)
  const env = window.IBG_ENV || {};
  function findPlan(words){
    const keys = Object.keys(env).filter(k => /^PAYPAL_.*PLAN/i.test(k));
    const L = words.map(w=>w.toLowerCase());
    for (const k of keys){
      const lk = k.toLowerCase();
      if (L.some(w=>lk.includes(w))) return env[k];
    }
    return null;
  }
  const planMonthly = findPlan(['mensual','monthly','month']);
  const planAnnual  = findPlan(['anual','annual','year','yearly']);
  const planLife    = findPlan(['lifetime','vitalicio','life']);

  // Botones de suscripción
  function mountSubs(sel, planId){
    const slot = $(sel);
    if(!slot) return;
    if(!planId){ slot.innerHTML='<span style="opacity:.6">Configurar plan</span>'; return; }
    if(!(window.paypal_subs && window.paypal_subs.Buttons)) return setTimeout(()=>mountSubs(sel,planId),160);
    window.paypal_subs.Buttons({
      style:{ layout:'horizontal', tagline:false, height:32 },
      createSubscription: (data, actions) => actions.subscription.create({ plan_id: planId }),
      onApprove: data => console.log('[subs OK]', sel, data)
    }).render(sel);
  }
  mountSubs('#btn-monthly', planMonthly);
  mountSubs('#btn-annual',  planAnnual);
  mountSubs('#btn-life',    planLife);

  // Botones de packs (capture)
  function mountPay(sel, euros){
    const slot = $(sel);
    if(!slot) return;
    if(!(window.paypal_pay && window.paypal_pay.Buttons)) return setTimeout(()=>mountPay(sel,euros),160);
    window.paypal_pay.Buttons({
      style:{ layout:'horizontal', tagline:false, height:32 },
      createOrder:(d,a)=>a.order.create({ purchase_units:[{ amount:{ currency_code:'EUR', value: euros.toFixed(2) } }]}),
      onApprove:(d,a)=>a.order.capture().then(det=>console.log('[pack OK]', sel, det))
    }).render(sel);
  }
  mountPay('#btn-pack10', 10*0.10);
  mountPay('#btn-pack5v',  5*0.30);
})();
