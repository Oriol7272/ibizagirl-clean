(function(){
  const ENV = window.__ENV || {};
  console.log('[subscription] ENV', ENV);
  const CID = ENV.PAYPAL_CLIENT_ID || '';
  if(!CID){ console.error('[subscription] PAYPAL_CLIENT_ID vacío'); return; }

  const qs = new URLSearchParams({
    'client-id': CID,
    currency: 'EUR',
    components: 'buttons',
    vault: 'true'
  });
  const sdkUrl = `https://www.paypal.com/sdk/js?${qs.toString()}`;

  function onceLoadSDK(cb){
    if(document.querySelector('script[src^="https://www.paypal.com/sdk/js"]')){
      if(window.paypal && window.paypal.Buttons){ cb(); }
      else { const t=setInterval(()=>{ if(window.paypal&&window.paypal.Buttons){ clearInterval(t); cb(); }},50); }
      return;
    }
    const s=document.createElement('script');
    s.src=sdkUrl; s.async=true;
    s.onload=cb; s.onerror=()=>console.error('[subscription] error cargando SDK');
    document.head.appendChild(s);
  }

  function render(selector, opts){
    const host=document.querySelector(selector);
    if(!host) return;
    if(host.tagName.toLowerCase()==='button'){ const d=document.createElement('div'); d.id=host.id; host.replaceWith(d); }
    window.paypal.Buttons(opts).render(selector);
  }

  function renderAll(){
    const targets = [
      {sel:'#pp-monthly', plan: ENV.PAYPAL_PLAN_ID_MONTHLY},
      {sel:'#pp-annual',  plan: ENV.PAYPAL_PLAN_ID_ANNUAL},
      {sel:'#pp-image',   price: ENV.PAYPAL_ONESHOT_PRICE_EUR_IMAGE},
      {sel:'#pp-video',   price: ENV.PAYPAL_ONESHOT_PRICE_EUR_VIDEO},
      {sel:'#pp-lifetime',price: ENV.PAYPAL_ONESHOT_PRICE_EUR_LIFETIME}
    ];
    targets.forEach(t=>{
      if(t.plan){
        render(t.sel,{
          style:{layout:'vertical',shape:'pill',label:'subscribe'},
          createSubscription: (_,actions)=>actions.subscription.create({plan_id:String(t.plan)}),
          onApprove: d=>{ console.log('[subscription] OK',d); localStorage.setItem('ibg_paid','1'); }
        });
      } else if(t.price){
        render(t.sel,{
          style:{layout:'vertical',shape:'pill',label:'pay'},
          createOrder:(_,actions)=>actions.order.create({purchase_units:[{amount:{currency_code:'EUR',value:String(t.price)}}]}),
          onApprove:d=>{ console.log('[oneshot] OK',d); localStorage.setItem('ibg_paid','1'); }
        });
      }
    });
  }

  onceLoadSDK(renderAll);
})();
