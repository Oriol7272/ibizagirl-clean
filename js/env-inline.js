/* AUTO-GENERADO DESDE .vercel/.env.production.local — NO EDITAR */
;(function(){
  try{
    var KEYS=[
      "PAYPAL_CLIENT_ID","PAYPAL_SECRET","PAYPAL_WEBHOOK_ID",
      "PAYPAL_PLAN_MONTHLY_1499","PAYPAL_PLAN_ANNUAL_4999",
      "PAYPAL_ONESHOT_PRICE_EUR_LIFETIME",
      "PAYPAL_ONESHOT_PRICE_EUR_VIDEO","PAYPAL_ONESHOT_PRICE_EUR_IMAGE",
      "PAYPAL_ONESHOT_PACK10_IMAGES_EUR",
      "PAYPAL_ONESHOT_PACK5_VIDEOS_EUR", /* <- nombre correcto */
      "IBG_ASSETS_BASE_URL",
      "EXOCLICK_ZONE","JUICYADS_ZONE","EROADVERTISING_ZONE",
      "JUICYADS_SNIPPET_B64","EROADVERTISING_SNIPPET_B64",
      "POPADS_ENABLE","POPADS_SITE_ID","CRISP_WEBSITE_ID"
    ];
    window.IBG_ENV = window.IBG_ENV || {};
    var raw = document.currentScript && document.currentScript.getAttribute('data-env')
      ? JSON.parse(document.currentScript.getAttribute('data-env')) : {};
    KEYS.forEach(function(k){ if(!(k in window.IBG_ENV)) window.IBG_ENV[k]=raw[k]||""; });
    console.log("[env-inline] OK · PAYPAL_*:", Object.keys(window.IBG_ENV).filter(function(x){return /^PAYPAL_/.test(x)}));
  }catch(e){ console.error("[env-inline] ERROR", e); }
})();
