(function(){
  // evita dobles cargas
  if (window.__IBG_ENV_INLINE_LOADED__) return;
  window.__IBG_ENV_INLINE_LOADED__ = true;

  window.__ENV = {
    // Assets en S3 (tu captura)
    BASE: "https://ibizagirl-assets.s3.eu-north-1.amazonaws.com",

    // PayPal (tus variables en Vercel)
    PAYPAL_CLIENT_ID: "AfQEdiielw5fm3wF08p9pcxwqR3gPz82YRNUTKY4A8WNG9AktiGsDNyr2i7BsjVzSwwpeCwR7Tt7DPq5",
    PAYPAL_PLAN_ID_MONTHLY: "P-3WE8037612641383DNCUKNJI",
    PAYPAL_PLAN_ID_ANNUAL:  "P-43k261214Y571983RNCUKN7I",

    // Precios (tus env)
    ONESHOT_PRICE_IMAGE_EUR:    "0.10",
    ONESHOT_PRICE_VIDEO_EUR:    "0.30",
    ONESHOT_PRICE_LIFETIME_EUR: "100.00",

    // Ads (tus env)
    EXOCLICK_ZONE:       "5696328",
    JUICYADS_ZONE:       "2093981",
    EROADVERTISING_ZONE: "8177575",
    POPADS_ENABLE:       "true",
    POPADS_SITE_ID:      "e494ffb28339a29122680e933394c091"
  };

  console.info("[env-inline] listo", window.__ENV);
})();
