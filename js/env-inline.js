(() => {
  const ENV = {
    BASE: (window.__ENV && window.__ENV.BASE) || (typeof IBG_ASSETS_BASE_URL !== "undefined" ? IBG_ASSETS_BASE_URL : "") || "https://ibizagirl.pics",
    PAYPAL_CLIENT_ID: (typeof PAYPAL_CLIENT_ID !== "undefined" ? PAYPAL_CLIENT_ID : "") || "",
    PAYPAL_PLAN_ID_MONTHLY: (typeof PAYPAL_PLAN_MONTHLY_1499 !== "undefined" ? PAYPAL_PLAN_MONTHLY_1499 : (typeof PAYPAL_PLAN_ID_MONTHLY !== "undefined" ? PAYPAL_PLAN_ID_MONTHLY : "")) || "",
    PAYPAL_PLAN_ID_ANNUAL:  (typeof PAYPAL_PLAN_ANNUAL_4999  !== "undefined" ? PAYPAL_PLAN_ANNUAL_4999  : (typeof PAYPAL_PLAN_ID_ANNUAL  !== "undefined" ? PAYPAL_PLAN_ID_ANNUAL  : "")) || "",
    PAYPAL_ONESHOT_PRICE_EUR_IMAGE:    (typeof PAYPAL_ONESHOT_PRICE_EUR_IMAGE    !== "undefined" ? PAYPAL_ONESHOT_PRICE_EUR_IMAGE    : (typeof PAYPAL_ONESHOT_PACK10_IMAGES_EUR !== "undefined" ? PAYPAL_ONESHOT_PACK10_IMAGES_EUR : "")) || "0.10",
    PAYPAL_ONESHOT_PRICE_EUR_VIDEO:    (typeof PAYPAL_ONESHOT_PRICE_EUR_VIDEO    !== "undefined" ? PAYPAL_ONESHOT_PRICE_EUR_VIDEO    : (typeof PAYPAL_ONESHOT_PACK5_VIDEOS_EUR  !== "undefined" ? PAYPAL_ONESHOT_PACK5_VIDEOS_EUR  : "")) || "",
    PAYPAL_ONESHOT_PRICE_EUR_LIFETIME: (typeof PAYPAL_ONESHOT_PRICE_EUR_LIFETIME !== "undefined" ? PAYPAL_ONESHOT_PRICE_EUR_LIFETIME : "") || "",
    EXOCLICK_ZONE:        (typeof EXOCLICK_ZONE        !== "undefined" ? EXOCLICK_ZONE        : "") || "",
    JUICYADS_ZONE:        (typeof JUICYADS_ZONE        !== "undefined" ? JUICYADS_ZONE        : "") || "",
    EROADVERTISING_ZONE:  (typeof EROADVERTISING_ZONE  !== "undefined" ? EROADVERTISING_ZONE  : "") || "",
    POPADS_ENABLE:        (typeof POPADS_ENABLE        !== "undefined" ? POPADS_ENABLE        : "") || "",
    POPADS_SITE_ID:       (typeof POPADS_SITE_ID       !== "undefined" ? POPADS_SITE_ID       : "") || ""
  };
  window.__ENV = ENV;
  console.info("[env-inline] window.__ENV", ENV);
})();
