(function(){
  function env(){ return (window.IBG_ENV||window.ENV||{}); }
  function num(v, d){ const n = Number(v); return isFinite(n)? n : d; }

  const e = env();
  const currency = e.PAYPAL_CURRENCY || 'EUR';
  const priceImg = num(e.PAYPAL_ONESHOT_PRICE_EUR_IMAGE, 0.10).toFixed(2);
  const priceVid = num(e.PAYPAL_ONESHOT_PRICE_EUR_VIDEO, 0.30).toFixed(2);
  const pricePack10 = num(e.PAYPAL_PACK10_PRICE_EUR, 0.80).toFixed(2);
  const pricePack5v = num(e.PAYPAL_PACK5V_PRICE_EUR, 1.00).toFixed(2);
  const priceLifetime = num(e.PAYPAL_ONESHOT_PRICE_EUR_LIFETIME, 100).toFixed(2);
  const planMonthly = e.PAYPAL_PLAN_MONTHLY_1499 || e.PAYPAL_PLAN_MONTHLY || '';
  const planAnnual  = e.PAYPAL_PLAN_ANNUAL_4999  || e.PAYPAL_PLAN_ANNUAL  || '';

  function mountSubs(slotId, planId){
    const el = document.getElementById(slotId);
    if(!el || !window.paypal) return;
    window.paypal.Buttons({
      style:{ label:'subscribe', shape:'pill' },
      createSubscription: (_d, actions)=>actions.subscription.create({ plan_id: planId }),
      onApprove: (data)=>{ console.log('[subs] OK', data); alert('¡Suscripción activa!'); },
      onError: (err)=>console.error('[subs] error', err)
    }).render(el);
  }
  function mountPay(container, value, description){
    if(!container || !window.paypal) return;
    window.paypal.Buttons({
      style:{ label:'pay', shape:'pill' },
      createOrder: (_d, actions)=>actions.order.create({
        purchase_units:[{ amount:{ currency_code: currency, value:String(value) }, description }]
      }),
      onApprove: (_d, actions)=> actions.order.capture().then((details)=>{
        console.log('[pay] OK', details); alert('Pago correcto ✅');
      }),
      onError: (err)=>console.error('[pay] error', err)
    }).render(container);
  }

  // Topbar packs + lifetime
  const slots = {
    'paypal-pack10':   {v:pricePack10, desc:'Pack 10 imágenes'},
    'paypal-pack5v':   {v:pricePack5v, desc:'Pack 5 vídeos'},
    'paypal-lifetime': {v:priceLifetime, desc:'Lifetime'}
  };
  function initTopbar(){
    Object.keys(slots).forEach(id=>{
      const el = document.getElementById(id);
      if(el && !el.dataset.ppReady){ el.dataset.ppReady="1"; mountPay(el, slots[id].v, slots[id].desc); }
    });
    if(planMonthly && !document.getElementById('paypal-monthly').dataset.ppReady){
      document.getElementById('paypal-monthly').dataset.ppReady="1";
      mountSubs('paypal-monthly', planMonthly);
    }
    if(planAnnual && !document.getElementById('paypal-annual').dataset.ppReady){
      document.getElementById('paypal-annual').dataset.ppReady="1";
      mountSubs('paypal-annual', planAnnual);
    }
  }

  // Por thumb
  function initPerThumb(){
    document.querySelectorAll('[data-pp-item]').forEach(card=>{
      if(card.dataset.ppReady) return;
      card.dataset.ppReady="1";
      const isVideo = card.getAttribute('data-kind') === 'video';
      const val = isVideo ? priceVid : priceImg;
      const c = card.querySelector('.ibg-pay');
      if(c){ mountPay(c, val, isVideo ? 'Vídeo individual' : 'Imagen individual'); }
    });
  }

  document.addEventListener('DOMContentLoaded', ()=>{ initTopbar(); initPerThumb(); });
  window.addEventListener('IBG_GRID_READY', initPerThumb);
  window.addEventListener('load', initTopbar);
})();
