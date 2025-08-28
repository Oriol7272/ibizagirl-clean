(() => {
  const BASE_FALLBACK = "https://ibizagirl.pics";
  const g = (k, d="") => (typeof window !== "undefined" && window[k]) ? window[k] : (typeof globalThis !== "undefined" && globalThis[k] ? globalThis[k] : d);
  window.__ENV = {
    BASE: g("IBG_ASSETS_BASE_URL", BASE_FALLBACK) || BASE_FALLBACK,
    PAYPAL_CLIENT_ID: g("PAYPAL_CLIENT_ID", ""),
    PAYPAL_PLAN_ID_MONTHLY: g("PAYPAL_PLAN_MONTHLY_1499", g("PAYPAL_PLAN_ID_MONTHLY","")),
    PAYPAL_PLAN_ID_ANNUAL:  g("PAYPAL_PLAN_ANNUAL_4999",  g("PAYPAL_PLAN_ID_ANNUAL",""))
  };
  console.info("[env-inline] window.__ENV", window.__ENV);
})();
