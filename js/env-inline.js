(function () {
  if (window.__IBG_ENV_INLINE__) return;
  window.__IBG_ENV_INLINE__ = true;

  // Estas cadenas se resuelven en build por Vercel:
  window.__ENV = {
    BASE:                     "${IBG_ASSETS_BASE_URL:-https://ibizagirl-assets.s3.eu-north-1.amazonaws.com}",
    PAYPAL_CLIENT_ID:         "${PAYPAL_CLIENT_ID:-}",

    // Planes (acepta cualquiera de los dos nombres que tienes configurados)
    PAYPAL_PLAN_ID_MONTHLY:   "${PAYPAL_PLAN_MONTHLY_1499:-${PAYPAL_PLAN_ID_MONTHLY:-}}",
    PAYPAL_PLAN_ID_ANNUAL:    "${PAYPAL_PLAN_ANNUAL_4999:-${PAYPAL_PLAN_ID_ANNUAL:-}}",

    // Precios
    ONESHOT_PRICE_IMAGE_EUR:    "${PAYPAL_ONESHOT_PRICE_EUR_IMAGE:-0.10}",
    ONESHOT_PRICE_VIDEO_EUR:    "${PAYPAL_ONESHOT_PRICE_EUR_VIDEO:-0.30}",
    ONESHOT_PRICE_LIFETIME_EUR: "${PAYPAL_ONESHOT_PRICE_EUR_LIFETIME:-100.00}",

    // Ads
    EXOCLICK_ZONE:       "${EXOCLICK_ZONE:-}",
    JUICYADS_ZONE:       "${JUICYADS_ZONE:-}",
    EROADVERTISING_ZONE: "${EROADVERTISING_ZONE:-}",
    POPADS_ENABLE:       "${POPADS_ENABLE:-true}",
    POPADS_SITE_ID:      "${POPADS_SITE_ID:-}"
  };

  console.info("[env-inline] listo", window.__ENV);
})();
