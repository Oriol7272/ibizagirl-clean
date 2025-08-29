(() => {
  // Construimos un objeto plano sin líneas corruptas ni variables partidas.
  var ENV = {
    BASE: (typeof IBG_ASSETS_BASE_URL !== "undefined" ? IBG_ASSETS_BASE_URL : "") || "https://ibizagirl.pics",

    // PayPal
    PAYPAL_CLIENT_ID:              (typeof PAYPAL_CLIENT_ID !== "undefined" ? PAYPAL_CLIENT_ID : "") || "",
    PAYPAL_PLAN_ID_MONTHLY:        (typeof PAYPAL_PLAN_MONTHLY_1499 !== "undefined" ? PAYPAL_PLAN_MONTHLY_1499 : (typeof PAYPAL_PLAN_ID_MONTHLY !== "undefined" ? PAYPAL_PLAN_ID_MONTHLY : "")) || "",
    PAYPAL_PLAN_ID_ANNUAL:         (typeof PAYPAL_PLAN_ANNUAL_4999  !== "undefined" ? PAYPAL_PLAN_ANNUAL_4999  : (typeof PAYPAL_PLAN_ID_ANNUAL  !== "undefined" ? PAYPAL_PLAN_ID_ANNUAL  : "")) || "",

    // Precios (chips visuales; NO impactan PayPal)
    ONESHOT_PRICE_IMAGE_EUR:       (typeof PAYPAL_ONESHOT_PRICE_EUR_IMAGE    !== "undefined" ? PAYPAL_ONESHOT_PRICE_EUR_IMAGE    : (typeof PAYPAL_ONESHOT_PACK10_IMAGES_EUR !== "undefined" ? PAYPAL_ONESHOT_PACK10_IMAGES_EUR : "0.10")),
    ONESHOT_PRICE_VIDEO_EUR:       (typeof PAYPAL_ONESHOT_PRICE_EUR_VIDEO    !== "undefined" ? PAYPAL_ONESHOT_PRICE_EUR_VIDEO    : "0.30"),
    ONESHOT_PRICE_LIFETIME_EUR:    (typeof PAYPAL_ONESHOT_PRICE_EUR_LIFETIME !== "undefined" ? PAYPAL_ONESHOT_PRICE_EUR_LIFETIME : "100.00"),

    // Ads (opcionales)
    EXOCLICK_ZONE:                 (typeof EXOCLICK_ZONE       !== "undefined" ? EXOCLICK_ZONE       : "") || "",
    JUICYADS_ZONE:                 (typeof JUICYADS_ZONE       !== "undefined" ? JUICYADS_ZONE       : "") || "",
    EROADVERTISING_ZONE:           (typeof EROADVERTISING_ZONE !== "undefined" ? EROADVERTISING_ZONE : "") || "",
    POPADS_ENABLE:                 (typeof POPADS_ENABLE       !== "undefined" ? POPADS_ENABLE       : "true"),
    POPADS_SITE_ID:                (typeof POPADS_SITE_ID      !== "undefined" ? POPADS_SITE_ID      : "") || ""
  };

  window.__ENV = ENV;
  console.info("[env-inline] window.__ENV", window.__ENV);
})();
