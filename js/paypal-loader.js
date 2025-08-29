(function(){
  if (window.__IBG_PAYPAL_LOADER__) return;
  window.__IBG_PAYPAL_LOADER__ = true;

  var E = window.__ENV || {};
  var CID = E.PAYPAL_CLIENT_ID || "";
  if (!CID){ console.warn("[paypal] CID vacío"); return; }

  var wantSubs = !!(E.PAYPAL_PLAN_ID_MONTHLY || E.PAYPAL_PLAN_ID_ANNUAL);
  var url = "https://www.paypal.com/sdk/js?client-id="+encodeURIComponent(CID)
          + "&components=buttons&currency=EUR"
          + (wantSubs ? "&intent=subscription&vault=true" : "&intent=capture");

  if (!document.getElementById("sdk-paypal")) {
    var s=document.createElement("script");
    s.id="sdk-paypal"; s.src=url; s.async=true; s.defer=true; s.crossOrigin="anonymous";
    document.head.appendChild(s);
  }
  console.info("[paypal-loader] url:", url);
})();
