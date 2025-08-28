(() => {
  // Variables seguras expuestas al front
  window.__ENV = {
    // Assets
    BASE: (typeof IBG_ASSETS_BASE_URL !== "undefined" && IBG_ASSETS_BASE_URL) ? IBG_ASSETS_BASE_URL : "https://ibizagirl.pics",

    // PayPal (exactamente como en Vercel)
    PAYPAL_CLIENT_ID: (typeof PAYPAL_CLIENT_ID !== "undefined") ? PAYPAL_CLIENT_ID : "",
    PAYPAL_PLAN_ID_MONTHLY: (typeof PAYPAL_PLAN_MONTHLY_1499 !== "undefined") ? PAYPAL_PLAN_MONTHLY_1499 : "",
    PAYPAL_PLAN_ID_ANNUAL:  (typeof PAYPAL_PLAN_ANNUAL_4999  !== "undefined") ? PAYPAL_PLAN_ANNUAL_4999  : "",
    PAYPAL_ONESHOT_PRICE_EUR_IMAGE: (typeof PAYPAL_ONESHOT_PRICE_EUR_IMAGE !== "undefined") ? PAYPAL_ONESHOT_PRICE_EUR_IMAGE : "",
    PAYPAL_ONESHOT_PRICE_EUR_VIDEO: (typeof PAYPAL_ONESHOT_PRICE_EUR_VIDEO !== "undefined") ? PAYPAL_ONESHOT_PRICE_EUR_VIDEO : "",
    PAYPAL_ONESHOT_PRI    PAYPIFETIME: (typeof PAYPAL_ONESHOT_PRICE_EUR_LIFETIME !== "undefined") ? PAYPAL_ONESHOT_PRICE_EUR_LIFETIME : "",

    // Ads / Crisp
    EXOCLICK_ZONE: (typeof EXOCLICK_ZONE !== "undefined") ? EXOCLICK_ZONE : "",
    JUICYADS_ZONE: (typeof JUICYADS_ZONE !== "undefined") ? JUICYADS_ZONE : "",
    JUICYADS_SNIPPET_B64: (typeof JUICYADS_SNIPPET_B64 !== "undefined") ? JUICYADS_SNIPPET_B64 : "",
    EROADVERTISING_ZONE: (typeof EROADVERTISING_ZONE !== "undefined") ? EROADVERTISING_ZONE : "",
    EROADVERTISING_SNIPPET_B64: (typeof EROADVERTISING_SNIPPET_B64 !== "undefined") ? EROADVERTISING_SNIPPET_B64 : "",
    POPADS_ENABLE: (typeof POPADS_ENABLE !== "undefined") ? POPADS_ENABLE : "",
    POPADS_SITE_ID: (typeof POPADS_SITE_ID !== "undefined") ? POPADS_SITE_ID : "",
    CRISP_WEBSITE_ID: (typeof CRISP_WEBSITE_ID !== "undefined") ? CRISP_WEBSITE_ID : ""
  };
  console.info("[env-inline] window.__ENV", window.__ENV);
})();
