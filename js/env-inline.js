(function(){
  window.__ENV = {
    // Base de assets
    BASE: "https://ibizagirl.pics",

    // PayPal (client-id público)
    PAYPAL_CLIENT_ID: "AfQEdiielw5fm3wF08p9pcxwqR3gPz82YRNUTKY4A8WNG9AktiGsDNyr2i7BsjVzSwwpeCwR7Tt7DPq5",

    // (Opcional) Planes si los necesitas en front:
    PAYPAL_PLAN_ID_MONTHLY: "P-3WE8037612641383DNCUKNJI",
    PAYPAL_PLAN_ID_ANNUAL:  "P-47N54027YA5570442NCLY5ZA",

    // Chips de precio (solo UI)
    ONESHOT_PRICE_IMAGE_EUR:    "0.10",
    ONESHOT_PRICE_VIDEO_EUR:    "0.30",
    ONESHOT_PRICE_LIFETIME_EUR: "100.00",

    // Ads (de momento los dejamos vacíos para no romper)
    EXOCLICK_ZONE: "",
    JUICYADS_ZONE: "",
    EROADVERTISING_ZONE: "",
    POPADS_ENABLE: "false",
    POPADS_SITE_ID: ""
  };
  console.info("[env-inline] window.__ENV", window.__ENV);
})();
