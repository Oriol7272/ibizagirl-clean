(function(){
  if (window.__IBG_ENV_INLINE_LOADED__) return;
  window.__IBG_ENV_INLINE_LOADED__ = true;

  function nonEmpty(x){ return x!==undefined && x!==null && String(x).trim()!==""; }

  var injected = {
    BASE: "https://ibizagirl.pics",
    PAYPAL_CLIENT_ID: "",
    PAYPAL_PLAN_ID_MONTHLY: "",
    PAYPAL_PLAN_ID_ANNUAL:  "",
    ONESHOT_PRICE_IMAGE_EUR:    "0.10",
    ONESHOT_PRICE_VIDEO_EUR:    "0.30",
    ONESHOT_PRICE_LIFETIME_EUR: "100.00",
    EXOCLICK_ZONE:       "",
    JUICYADS_ZONE    JUICYADSUICYADS_ZONE:-}",
    EROADVERTISING_ZONE: "",
    POPADS_ENABLE:       "",
    POPADS_SITE_ID:      ""
  };

  var existing = window.__ENV || {};
  var merged = {};
  var keys = Object.keys(injected).concat(Object.keys(existing));
  keys.forEach(function(k){ merged[k] = nonEmpty(existing[k]) ? existing[k] : injected[k]; });

  Object.defineProperty(window, "__ENV", { value: merged, writable: false, configurable: false });

  var cid = merged.PAYPAL_CLIENT_ID||"";
  console.info("[env-inline] CID len:", cid.length, "first/last:", cid.slice(0,6), "...", cid.slice(-6));
})();
