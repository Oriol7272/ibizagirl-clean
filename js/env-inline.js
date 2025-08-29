(function(){
  if (window.__IBG_ENV_INLINE__) return;
  window.__IBG_ENV_INLINE__ = true;

  window.__ENV = {
    BASE: process.env.IBG_ASSETS_BASE_URL || "https://ibizagirl-assets.s3.eu-north-1.amazonaws.com",
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID || "",
    PAYPAL_PLAN_ID_MONTHLY: process.env.PAYPAL_PLAN_MONTHLY_1499 || "",
    PAYPAL_PLAN_ID_ANNUAL: process.env.PAYPAL_PLAN_ANNUAL_4999 || "",
    ONESHOT_PRICE_IMAGE_EUR: process.env.PAYPAL_ONESHOT_PRICE_EUR_IMAGE || "0.10",
    ONESHOT_PRICE_VIDEO_EUR: process.env.PAYPAL_ONESHOT_PRICE_EUR_VIDEO || "0.30",
    ONESHOT_PRICE_LIFETIME_EUR: process.env.PAYPAL_ONESHOT_PRICE_EUR_LIFETIME || "100.00",
    EXOCLICK_ZONE: process.env.EXOCLICK_ZONE || "",
    JUICYADS_ZONE: process.env.JUICYADS_ZONE || "",
    JUICYADS_SNIPPET_B64: process.env.JUICYADS_SNIPPET_B64 || "",
    EROADVERTISING_ZONE: process.env.EROADVERTISING_ZONE || "",
    EROADVERTISING_SNIPPET_B64: process.env.EROADVERTISING_SNIPPET_B64 || "",
    POPADS_ENABLE: process.env.POPADS_ENABLE || "true",
    POPADS_SITE_ID: process.env.POPADS_SITE_ID || "",
    CRISP_WEBSITE_ID: process.env.CRISP_WEBSITE_ID || ""
  };

  console.info("[env-inline] listo", window.__ENV);
})();
