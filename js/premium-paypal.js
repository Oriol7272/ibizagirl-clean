(() => {
  const EUR='EUR';
  const fix = (n) => Number(n||0).toFixed(2);
  function renderBuy(node, amount, desc){
    node.innerHTML='';
    return paypal_pay.Buttons({
      style:{label:'pay',color:'gold',shape:'pill'},
      createOrder:(_,a)=>a.order.create({ intent:'CAPTURE',
        purchase_units:[{ amount:{ value:fix(amount), currency_code:EUR }, description:desc }] }),
      onApprove: async(_,a)=>{ try{ await a.order.capture(); node.innerHTML='<div style="text-align:center;color:#19f079;font-weight:700">✔ OK</div>'; }catch(e){console.error(e);} }
    }).render(node);
  }
  function renderSub(node, planId, label){
    node.innerHTML='';
    return paypal_subs.Buttons({
      style:{label:'subscribe',color:'gold',shape:'pill'},
      createSubscription:(_,a)=>a.subscription.create({ plan_id:planId }),
      onApprove:(d)=>{ node.innerHTML='<div style="text-align:center;color:#19f079;font-weight:700">✔ Suscrito</div>'; console.log('[subs]',label,d); }
    }).render(node);
  }
  window.__IBG_PremiumPay={
    renderTop:()=>{
      const E=window.IBG_ENV||{}, byId=(i)=>document.getElementById(i);
      if(E.PAYPAL_PLAN_MONTHLY_1499 && byId('btn-sub-monthly')) renderSub(byId('btn-sub-monthly'),E.PAYPAL_PLAN_MONTHLY_1499,'Mensual');
      if(E.PAYPAL_PLAN_ANNUAL_4999  && byId('btn-sub-annual'))  renderSub(byId('btn-sub-annual'), E.PAYPAL_PLAN_ANNUAL_4999,'Anual');
      if(E.PAYPAL_ONESHOT_PRICE_EUR_LIFETIME && byId('btn-lifetime')) renderBuy(byId('btn-lifetime'),E.PAYPAL_ONESHOT_PRICE_EUR_LIFETIME,'Lifetime');
      if(E.PAYPAL_ONESHOT_PACK10_IMAGES_EUR && byId('btn-pack10')) renderBuy(byId('btn-pack10'),E.PAYPAL_ONESHOT_PACK10_IMAGES_EUR,'Pack 10 imágenes');
      if(E.PAYPAL_ONESHOT_PACKS_VIDEOS_EUR  && byId('btn-pack5'))  renderBuy(byId('btn-pack5'), E.PAYPAL_ONESHOT_PACKS_VIDEOS_EUR,'Pack 5 vídeos');
    },
    renderThumb:(node,isVideo)=>{
      const E=window.IBG_ENV||{};
      const amount=isVideo? (E.PAYPAL_ONESHOT_PRICE_EUR_VIDEO||0.30) : (E.PAYPAL_ONESHOT_PRICE_EUR_IMAGE||0.10);
      renderBuy(node, amount, isVideo?'Vídeo individual':'Imagen individual');
    }
  };
})();
