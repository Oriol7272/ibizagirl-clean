(function(){
  if(!document.body.classList.contains('premium-page')) return; // no tocar HOME
  const $ = (q,r=document)=>r.querySelector(q);

  // Evitar Duplicados: si ya existe #premium-topmenu no volvemos a insertarlo
  if ($('#premium-topmenu')) return;

  // CSS scoped
  (function(){
    const old=document.getElementById('premium-menu-style'); if(old) old.remove();
    const s=document.createElement('style'); s.id='premium-menu-style';
    s.textContent=`
      body.premium-page #premium-topmenu{position:sticky;top:0;z-index:1000;background:#fff;border-bottom:1px solid #eee}
      body.premium-page #premium-topmenu .inner{max-width:1200px;margin:0 auto;padding:8px 12px;display:flex;gap:8px;flex-wrap:wrap;align-items:center}
      body.premium-page #premium-topmenu .slot{display:flex;align-items:center;gap:6px}
      body.premium-page #premium-topmenu .lbl{font:inherit;font-size:14px;color:#222;white-space:nowrap}
      body.premium-page #premium-topmenu .btn{font:inherit;font-size:14px;line-height:1;border:1px solid #ddd;border-radius:10px;background:#fafafa;padding:6px 8px;min-width:150px}
    `;
    document.head.appendChild(s);
  })();

  // Inserta en cabecera existente si hay contenedor principal; si no, en body
  let host = document.querySelector('header .container, header .inner, #header, header') || document.body;
  const nav=document.createElement('nav');
  nav.id='premium-topmenu';
  nav.innerHTML=`
    <div class="inner" style="font:inherit">
      <div class="slot"><span class="lbl">Mensual</span><div id="btn-monthly"  class="btn"></div></div>
      <div class="slot"><span class="lbl">Anual</span><div   id="btn-annual"   class="btn"></div></div>
      <div class="slot"><span class="lbl">Lifetime</span><div id="btn-life"     class="btn"></div></div>
      <div class="slot"><span class="lbl">Pack 10 imágenes</span><div id="btn-pack10" class="btn"></div></div>
      <div class="slot"><span class="lbl">Pack 5 vídeos</span><div   id="btn-pack5v" class="btn"></div></div>
    </div>`;
  if(host===document.body){ document.body.prepend(nav); } else { host.appendChild(nav); }

  // Buscar plan IDs por nombre dentro de PAYPAL_* que contengan "PLAN"
  const env=window.IBG_ENV||{};
  function findPlan(words){
    const keys=Object.keys(env).filter(k=>/^PAYPAL_.*PLAN/i.test(k));
    const L=words.map(w=>w.toLowerCase());
    for(const k of keys){ const lk=k.toLowerCase(); if(L.some(w=>lk.includes(w))) return env[k]; }
    return null;
  }
  const planMonthly=findPlan(['mensual','monthly','month']);
  const planAnnual =findPlan(['anual','annual','year','yearly']);
  const planLife   =findPlan(['lifetime','vitalicio','life']);

  function mountSubs(sel, planId){
    const slot=$(sel); if(!slot) return;
    if(!planId){ slot.innerHTML='<span style="opacity:.6">Configurar plan</span>'; return; }
    (function wait(){
      if(!(window.paypal_subs && window.paypal_subs.Buttons)) return setTimeout(wait,120);
      window.paypal_subs.Buttons({
        style:{layout:'horizontal',tagline:false,height:32},
        createSubscription:(d,a)=>a.subscription.create({plan_id:planId}),
        onApprove:(d)=>console.log('[subs OK]', sel, d)
      }).render(sel);
    })();
  }
  mountSubs('#btn-monthly',planMonthly);
  mountSubs('#btn-annual', planAnnual);
  mountSubs('#btn-life',   planLife);

  function mountPay(sel, euros){
    const slot=$(sel); if(!slot) return;
    (function wait(){
      if(!(window.paypal_pay && window.paypal_pay.Buttons)) return setTimeout(wait,120);
      window.paypal_pay.Buttons({
        style:{layout:'horizontal',tagline:false,height:32},
        createOrder:(d,a)=>a.order.create({purchase_units:[{amount:{currency_code:'EUR',value:euros.toFixed(2)}}]}),
        onApprove:(d,a)=>a.order.capture().then(x=>console.log('[pack OK]', sel, x))
      }).render(sel);
    })();
  }
  mountPay('#btn-pack10', 10*0.10);
  mountPay('#btn-pack5v',  5*0.30);
})();
