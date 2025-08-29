(function(){
  if (window.__ENV_READY__) return;
  window.__ENV_READY__ = true;
  try{
    window.__ENV = {
      IBG_ASSETS_BASE_URL:          (typeof IBG_ASSETS_BASE_URL!=='undefined'          && IBG_ASSETS_BASE_URL)          || '',
      PAYPAL_CLIENT_ID:             (typeof PAYPAL_CLIENT_ID!=='undefined'             && PAYPAL_CLIENT_ID)             || '',
      PAYPAL_PLAN_MONTHLY_1499:     (typeof PAYPAL_PLAN_MONTHLY_1499!=='undefined'     && PAYPAL_PLAN_MONTHLY_1499)     || '',
      PAYPAL_PLAN_ANNUAL_4999:      (typeof PAYPAL_PLAN_ANNUAL_4999!=='undefined'      && PAYPAL_PLAN_ANNUAL_4999)      || '',
      PAYPAL_ONESHOT_PACK10_IMAGES_EUR: (typeof PAYPAL_ONESHOT_PACK10_IMAGES_EUR!=='undefined' && PAYPAL_ONESHOT_PACK10_IMAGES_EUR) || '0.80',
      PAYPAL_ONESHOT_PACK5_VIDEOS_EUR:  (typeof PAYPAL_ONESHOT_PACK5_VIDEOS_EUR!=='undefined'  && PAYPAL_ONESHOT_PACK5_VIDEOS_EUR)  || '1.00',
      PAYPAL_ONESHOT_PRICE_EUR_IMAGE:   (typeof PAYPAL_ONESHOT_PRICE_EUR_IMAGE!=='undefined'   && PAYPAL_ONESHOT_PRICE_EUR_IMAGE)   || '0.10',
      PAYPAL_ONESHOT_PRICE_EUR_VIDEO:   (typeof PAYPAL_ONESHOT_PRICE_EUR_VIDEO!=='undefined'   && PAYPAL_ONESHOT_PRICE_EUR_VIDEO)   || '0.30',
      PAYPAL_ONESHOT_PRICE_EUR_LIFETIME:(typeof PAYPAL_ONESHOT_PRICE_EUR_LIFETIME!=='undefined'&& PAYPAL_ONESHOT_PRICE_EUR_LIFETIME)|| '100.00',
      EXOCLICK_ZONE:                 (typeof EXOCLICK_ZONE!=='undefined'                && EXOCLICK_ZONE)                || '',
      JUICYADS_ZONE:                 (typeof JUICYADS_ZONE!=='undefined'                && JUICYADS_ZONE)                || '',
      JUICYADS_SNIPPET_B64:          (typeof JUICYADS_SNIPPET_B64!=='undefined'         && JUICYADS_SNIPPET_B64)         || '',
      EROADVERTISING_ZONE:           (typeof EROADVERTISING_ZONE!=='undefined'          && EROADVERTISING_ZONE)          || '',
      EROADVERTISING_SNIPPET_B64:    (typeof EROADVERTISING_SNIPPET_B64!=='undefined'   && EROADVERTISING_SNIPPET_B64)   || '',
      POPADS_ENABLE:                 (typeof POPADS_ENABLE!=='undefined'                && POPADS_ENABLE)                || 'false',
      POPADS_SITE_ID:                (typeof POPADS_SITE_ID!=='undefined'               && POPADS_SITE_ID)               || ''
    };
    console.info("[env-inline] listo", window.__ENV);
  }catch(e){
    console.error("[env-inline] error", e);
  }
})();
