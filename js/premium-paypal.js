(() => {
  const EUR='EUR';
  const money=(n)=>Number(n||0).toFixed(2);
  function renderBuy(node, amount, desc){
    if(!window.paypal_pay){ node.textContent='…'; return; }
    node.innerHTML='';
    return paypal_pay.Buttons({
      style:{label:'pay',color:'gold',shape:'pill'},
      createOrder:(_,a)=>a.order.create({
        intent:'CAPTURE',
        purchase_units:[{ amount:{value:money(amount),currency_code:EUR}, description:desc }]
      }),
      onApprove: async(_,a)=>{ try{await a.order.capture(); node.innerHTML='<div style="text-align:center;color:#19f079;font-weight:700">✔ OK</div>'; }catch(e){console.error(e);} }
    }).render(node);
  }
  function renderSub(node, planId, label){
    if(!window.paypal_subs){ node.textContent='…'; return; }
    node.innerHTML='';
    return paypal_subs.Buttons({
      style:{label:'subscribe',color:'gold',shape:'pill'},
      createSubscription:(_,a)=>a.subscription.create({ plan_id:planId }),
      onApprove:(d)=>{ node.innerHTML='<div style="text-align:center;color:#19f079;font-weight:700">✔ Suscrito</div>'; console.log('[subs]',label,d); }
    }).render(node);
  }
  window.__IBG_PremiumPay={
    renderTop:()=>{
      const E=window.IBG_ENV||{}, by=(id)=>document.getElementById(id);
      E.PAYPAL_PLAN_MONTHLY_1499 && by('btn-sub-monthly') && renderSub(by('btn-sub-monthly'),E.PAYPAL_PLAN_MONTHLY_1499,'Mensual');
      E.PAYPAL_PLAN_ANNUAL_4999  && by('btn-sub-annual')  && renderSub(by('btn-sub-annual'), E.PAYPAL_PLAN_ANNUAL_4999,'Anual');
      E.PAYPAL_ONESHOT_PRICE_EUR_LIFETIME && by('btn-lifetime') && renderBuy(by('btn-lifetime'),E.PAYPAL_ONESHOT_PRICE_EUR_LIFETIME,'Lifetime');
      E.PAYPAL_ONESHOT_PACK10_IMAGES_EUR && by('btn-pack10') && renderBuy(by('btn-pack10'),E.PAYPAL_ONESHOT_PACK10_IMAGES_EUR,'Pack 10 imágenes');
      E.PAYPAL_ONESHOT_PACKS_VIDEOS_EUR  && by('btn-pack5')  && renderBuy(by('btn-pack5'), E.PAYPAL_ONESHOT_PACKS_VIDEOS_EUR,'Pack 5 vídeos');
    },
    renderThumb:(node,isVideo)=>{
      const E=window.IBG_ENV||{};
      const amount = isVideo ? (E.PAYPAL_ONESHOT_PRICE_EUR_VIDEO||0.30) : (E.PAYPAL_ONESHOT_PRICE_EUR_IMAGE||0.10);
      renderBuy(node, amount, isVideo?'Vídeo individual':'Imagen individual');
    }
  };
})();
