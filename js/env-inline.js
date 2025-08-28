;(function(){
  // Estas claves se inyectan desde Vercel en build al hacer vercel pull
  const raw = {
    IBG_ASSETS_BASE_URL: process?.env?.IBG_ASSETS_BASE_URL,
    PAYPAL_CLIENT_ID: process?.env?.PAYPAL_CLIENT_ID,
    PAYPAL_PLAN_ID_MONTHLY: process?.env?.PAYPAL_PLAN_ID_MONTHLY,
    PAYPAL_PLAN_ID_ANNUAL:  process?.env?.PAYPAL_PLAN_ID_ANNUAL,
    PAYPAL_PLAN_ID_LIFETIME:process?.env?.PAYPAL_PLAN_ID_LIFETIME,
    PAYPAL_PLAN_PRICE_EUR_MONTHLY: process?.env?.PAYPAL_PLAN_PRICE_EUR_MONTHLY,
    PAYPAL_PLAN_PRICE_EUR_ANNUAL:  process?.env?.PAYPAL_PLAN_PRICE_EUR_ANNUAL,
    PAYPAL_ONESHOT_PRICE_EUR_IMAGE:process?.env?.PAYPAL_ONESHOT_PRICE_EUR_IMAGE
  };
  const clean = Object.fromEntries(
    Object.entries(raw).map(([k,v])=>[k, String(v??'').trim().replace(/^"|"$/g,'')])
  );
  // Normaliza BASE sin slash final
  clean.IBG_ASSETS_BASE_URL = clean.IBG_ASSETS_BASE_URL.replace(/\/+$/,'');
  window.IBG_ENV = Object.freeze(clean);
  console.log('[env-inline] BASE:', window.IBG_ENV.IBG_ASSETS_BASE_URL);
})();
