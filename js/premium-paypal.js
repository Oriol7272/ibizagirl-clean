(function(){
  const env = (window.IBG_ENV||{});
  const currency = env.PAYPAL_CURRENCY || 'EUR';

  const priceImg = Number(env.PAYPAL_ONESHOT_PRICE_EUR_IMAGE || 0.10).toFixed(2);
  const priceVid = Number(env.PAYPAL_ONESHOT_PRICE_EUR_VIDEO || 0.30).toFixed(2);
  const pricePack10 = Number(env.PAYPAL_PACK10_PRICE_EUR || 0.80).toFixed(2);
  const pricePack5v = Number(env.PAYPAL_PACK5V_PRICE_EUR || 1.00).toFixed(2);
  const priceLifetime = Number(env.PAYPAL_ONESHOT_PRICE_EUR_LIFETIME || 100).toFixed(2);

  const planMonthly = env.PAYPAL_PLAN_MONTHLY_1499 || env.PAYPAL_PLAN_MONTHLY || '';
  const planAnnual  = env.PAYPAL_PLAN_ANNUAL_4999  || env.PAYPAL_PLAN_ANNUAL  || '';

  function mountSubs(slotId, planId){
    const el = document.getElementById(slotId);
    if(!el || !planId || !window.paypal) return;
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

  // Topbar (packs + lifetime)
  const slots = {
    'paypal-pack10':   {v:pricePack10, desc:'Pack 10 imágenes'},
    'paypal-pack5v':   {v:pricePack5v, desc:'Pack 5 vídeos'},
    'paypal-lifetime': {v:priceLifetime, desc:'Lifetime'}
  };
  Object.keys(slots).forEach(id=>{
    const el = document.getElementById(id);
    if(el) mountPay(el, slots[id].v, slots[id].desc);
  });

  // Suscripciones
  mountSubs('paypal-monthly', planMonthly);
  mountSubs('paypal-annual',  planAnnual);

  // Botones por thumb cuando el grid esté listo
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
  document.addEventListener('DOMContentLoaded', initPerThumb);
  window.addEventListener('IBG_GRID_READY', initPerThumb);
})();
