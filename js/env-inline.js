(function(){
  if (window.__ENV_READY__) return; window.__ENV_READY__=true;
  function readMeta(key){ var m=document.querySelector('meta[name="ibg:'+key+'"]'); return m?m.content:''; }
  function pick(k, v){ return (typeof v!=='undefined' && v) || readMeta(k) || ''; }

  try{
    window.__ENV = {
      IBG_ASSETS_BASE_URL:            pick('IBG_ASSETS_BASE_URL',            (typeof IBG_ASSETS_BASE_URL!=='undefined'?IBG_ASSETS_BASE_URL:undefined)),
      PAYPAL_CLIENT_ID:               pick('PAYPAL_CLIENT_ID',               (typeof PAYPAL_CLIENT_ID!=='undefined'?PAYPAL_CLIENT_ID:undefined)),
      PAYPAL_PLAN_MONTHLY_1499:       pick('PAYPAL_PLAN_MONTHLY_1499',       (typeof PAYPAL_PLAN_MONTHLY_1499!=='undefined'?PAYPAL_PLAN_MONTHLY_1499:undefined)),
      PAYPAL_PLAN_ANNUAL_4999:        pick('PAYPAL_PLAN_ANNUAL_4999',        (typeof PAYPAL_PLAN_ANNUAL_4999!=='undefined'?PAYPAL_PLAN_ANNUAL_4999:undefined)),
      PAYPAL_ONESHOT_PRICE_EUR_IMAGE: pick('PAYPAL_ONESHOT_PRICE_EUR_IMAGE', (typeof PAYPAL_ONESHOT_PRICE_EUR_IMAGE!=='undefined'?PAYPAL_ONESHOT_PRICE_EUR_IMAGE:undefined)),
      PAYPAL_ONESHOT_PRICE_EUR_VIDEO: pick('PAYPAL_ONESHOT_PRICE_EUR_VIDEO', (typeof PAYPAL_ONESHOT_PRICE_EUR_VIDEO!=='undefined'?PAYPAL_ONESHOT_PRICE_EUR_VIDEO:undefined)),
      PAYPAL_ONESHOT_PRICE_EUR_LIFETIME: pick('PAYPAL_ONESHOT_PRICE_EUR_LIFETIME', (typeof PAYPAL_ONESHOT_PRICE_EUR_LIFETIME!=='undefined'?PAYPAL_ONESHOT_PRICE_EUR_LIFETIME:undefined)),
      PAYPAL_ONESHOT_PACK10_IMAGES_EUR: pick('PAYPAL_ONESHOT_PACK10_IMAGES_EUR', (typeof PAYPAL_ONESHOT_PACK10_IMAGES_EUR!=='undefined'?PAYPAL_ONESHOT_PACK10_IMAGES_EUR:undefined)),
      PAYPAL_ONESHOT_PACK5_VIDEOS_EUR:  pick('PAYPAL_ONESHOT_PACK5_VIDEOS_EUR',  (typeof PAYPAL_ONESHOT_PACK5_VIDEOS_EUR!=='undefined'?PAYPAL_ONESHOT_PACK5_VIDEOS_EUR:undefined)),
      EXOCLICK_ZONE:                  pick('EXOCLICK_ZONE',                  (typeof EXOCLICK_ZONE!=='undefined'?EXOCLICK_ZONE:undefined)),
      JUICYADS_ZONE:                  pick('JUICYADS_ZONE',                  (typeof JUICYADS_ZONE!=='undefined'?JUICYADS_ZONE:undefined)),
      JUICYADS_SNIPPET_B64:           pick('JUICYADS_SNIPPET_B64',           (typeof JUICYADS_SNIPPET_B64!=='undefined'?JUICYADS_SNIPPET_B64:undefined)),
      EROADVERTISING_ZONE:            pick('EROADVERTISING_ZONE',            (typeof EROADVERTISING_ZONE!=='undefined'?EROADVERTISING_ZONE:undefined)),
      EROADVERTISING_SNIPPET_B64:     pick('EROADVERTISING_SNIPPET_B64',     (typeof EROADVERTISING_SNIPPET_B64!=='undefined'?EROADVERTISING_SNIPPET_B64:undefined)),
      POPADS_ENABLE:                  pick('POPADS_ENABLE',                  (typeof POPADS_ENABLE!=='undefined'?POPADS_ENABLE:undefined)),
      POPADS_SITE_ID:                 pick('POPADS_SITE_ID',                 (typeof POPADS_SITE_ID!=='undefined'?POPADS_SITE_ID:undefined))
    };
    console.info("[env-inline] listo", window.__ENV);
  }catch(e){ console.error("[env-inline] error", e); }
})();
