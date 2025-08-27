// js/premium-paypal.js
(function () {
  const cfg = (window.ENV || {});
  const $ = (sel)=>document.querySelector(sel);
  const status = (id,msg,ok=true)=>{ const el=$(`#status-${id}`); if(el){el.textContent=msg; el.style.color=ok?"#147114":"#b00020";}};
  const n = {
    subs: ()=>window.paypal_subs,
    pay:  ()=>window.paypal_pay
  };

  function renderSubscription(mountId, planId){
    if(!planId) return;
    const paypal = n.subs();
    paypal.Buttons({
      style:{ layout:"vertical", label:"subscribe", shape:"pill" },
      createSubscription: (_, actions)=> actions.subscription.create({ plan_id: planId }),
      onApprove: (data)=>{ status(mountId,"Suscripción activada ✔"); console.log("[sub ok]", mountId, data); },
      onError: (e)=>{ status(mountId,"Error al suscribirse", false); console.error("[sub err]", mountId, e); }
    }).render(`#btn-${mountId}`);
  }

  function renderOneshot(mountId, amount, description){
    if(!amount) return;
    const paypal = n.pay();
    paypal.Buttons({
      style:{ layout:"vertical", label:"pay", shape:"pill" },
      createOrder: (_,actions)=> actions.order.create({
        purchase_units:[{ description: description||mountId, amount:{ currency_code:"EUR", value:String(amount) } }]
      }),
      onApprove: async (data,actions)=>{
        try { await actions.order.capture(); status(mountId,"Pago completado ✔"); console.log("[pay ok]", mountId, data); }
        catch(e){ status(mountId,"Error al capturar", false); console.error("[pay err]", mountId, e); }
      },
      onError: (e)=>{ status(mountId,"Error en el pago", false); console.error("[pay err]", mountId, e); }
    }).render(`#btn-${mountId}`);
  }

  async function main(){
    // Cargar ambos SDKs (cada uno con su intent) para evitar el error de mixing intents
    await Promise.all([ window._ibgPayPal.loadSubsSDK(), window._ibgPayPal.loadPaySDK() ]);
    console.log("[premium-paypal] SDKs listos");

    // Suscripciones
    renderSubscription("monthly", (cfg.PAYPAL_PLAN_MONTHLY_1499||"").trim());
    renderSubscription("annual",  (cfg.PAYPAL_PLAN_ANNUAL_4999 ||"").trim());

    // Oneshots
    renderOneshot("img",      cfg.PAYPAL_ONESHOT_PRICE_EUR_IMAGE,    "Imagen premium");
    renderOneshot("video",    cfg.PAYPAL_ONESHOT_PRICE_EUR_VIDEO,    "Vídeo premium");
    renderOneshot("lifetime", cfg.PAYPAL_ONESHOT_PRICE_EUR_LIFETIME, "Acceso lifetime (sin anuncios)");
    renderOneshot("pack10",   cfg.PAYPAL_ONESHOT_PACK10_IMAGES_EUR,  "Pack 10 imágenes");
    renderOneshot("pack5v",   cfg.PAYPAL_ONESHOT_PACK5_VIDEOS_EUR,   "Pack 5 vídeos");
  }

  document.readyState==="loading" ? document.addEventListener("DOMContentLoaded", main) : main();
})();
