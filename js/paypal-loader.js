;(()=>{  // seguro frente a ASI
  if (window.__PP_SDK__) return; window.__PP_SDK__ = true;

  const E = window.__ENV || {};
  const CID = (E.PAYPAL_CLIENT_ID || "").trim();
  if (!CID) { console.warn("[paypal] sin PAYPAL_CLIENT_ID, no cargo SDK"); return; }

  function injectOnce(id, src){
    if (document.getElementById(id)) return;
    const s = document.createElement("script");
    s.id = id; s.src = src; s.async = true; s.defer = true; s.crossOrigin = "anonymous";
    document.head.appendChild(s);
  }

  // Un único SDK con vault=true sirve tanto para orders (capturas) como subscriptions
  const url = "https://www.paypal.com/sdk/js"
            + "?client-id=" + encodeURIComponent(CID)
            + "&components=buttons&currency=EUR"
            + "&intent=subscription&vault=true"
            + "&data-namespace=pp"; // window.pp

  injectOnce("pp-sdk", url);
  console.info("[paypal-loader] SDK listo (vault=true)");
})();
