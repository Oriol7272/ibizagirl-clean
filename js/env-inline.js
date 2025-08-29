(function(){
  if (window.__ENV_READY__) return; window.__ENV_READY__=true;
  window.__ENV = {
    IBG_ASSETS_BASE_URL: "https://ibizagirl-assets.s3.eu-north-1.amazonaws.com",
    PAYPAL_CLIENT_ID: "AfQEdiielw5fm3wF08p9pcxwqR3gPz82YRNUTKY4A8WNG9AktiGsDNyr2i7BsjVzSwwpeCwR7Tt7DPq5",
    PAYPAL_PLAN_ID_MONTHLY: "P-3WE8037612641383DNCUKNJI",
    PAYPAL_PLAN_ID_ANNUAL:  "P-43K261214Y571983RNCUKN7I",

    ONESHOT_PRICE_IMAGE_EUR:    "0.10",
    ONESHOT_PRICE_VIDEO_EUR:    "0.30",
    ONESHOT_PRICE_LIFETIME_EUR: "100.00",

    EXOCLICK_ZONE: "5696328",
    JUICYADS_ZONE: "1099637",
    POPADS_ENABLE: "true",
    POPADS_SITE_ID:"e494ffb82839a29122608e933394c091"
  };
  console.info("[env-inline] listo", window.__ENV);
})();
