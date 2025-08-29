(function(){
  if (window.__ENV) return;
  window.__ENV = {
    // Assets base (S3 correcto, según tu captura)
    BASE: "https://ibizagirl-assets.s3.eu-north-1.amazonaws.com",

    // PayPal (all environments)
    PAYPAL_CLIENT_ID: "AfQEdiielw5fm3wF08p9pcxwqR3gPz82YRNUTKY4A8WNG9AktiGsDNyr2i7BsjVzSwwpeCwR7Tt7DPq5",
    PAYPAL_PLAN_ID_MONTHLY: "P-3WE8037612641383DNCUKNJI",
    PAYPAL_PLAN_ID_ANNUAL:  "P-43k261214571983RNUCKN7I",

    // Precios (chips)
    ONESHOT_PRICE_IMAGE_EUR: "0.10",
    ONESHOT_PRICE_VIDEO_EUR: "0.30",
    ONESHOT_PRICE_LIFETIME_EUR: "100.00",

    // Ads (IDs de tus capturas)
    EXOCLICK_ZONE:       "5696328",
    JUICYADS_ZONE:       "1099637",
    EROADVERTISING_ZONE: "8177575",
    POPADS_ENABLE:       "true",
    POPADS_SITE_ID:      "e494ffb2839a29122680e933394c091"
  };
  console.info("[env-inline] listo", window.__ENV);
})();
